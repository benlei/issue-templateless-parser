import * as core from '@actions/core'
import slugify from 'slugify'
import { getIssue } from './github'
import {
  bodyInput,
  failOnErrorInput,
  issueNumber,
  issueNumberInput,
  issueTitleInput
} from './inputs'
import { findIssueNumberByTitle } from './issue'
import { parseBodyFields } from './parser'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    let issueBody = ''
    if (bodyInput()) {
      issueBody = bodyInput()
    } else if (issueNumberInput()) {
      issueBody = (await getIssue(issueNumber())).data.body ?? ''
      core.setOutput('issue-number', issueNumber().toString())
    } else if (issueTitleInput()) {
      const foundIssueNumber = await findIssueNumberByTitle(issueTitleInput())
      if (!foundIssueNumber) {
        throw new Error(`Issue with title "${issueTitleInput()}" not found`)
      }

      core.info(`Found issue number ${foundIssueNumber}`)
      issueBody = (await getIssue(foundIssueNumber)).data.body ?? ''
      core.setOutput('issue-number', foundIssueNumber.toString())
    } else {
      throw new Error(
        'One of body, issue-number, or issue-title must be provided'
      )
    }

    for (const field of parseBodyFields(issueBody)) {
      const outputName = slugify(field.key, {
        lower: true,
        strict: true,
        trim: true
      })
      core.info(`Setting output ${outputName} for heading ${field.key}`)
      core.setOutput(outputName, field.value)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (failOnErrorInput() && error instanceof Error)
      core.setFailed(error.message)
  }
}
