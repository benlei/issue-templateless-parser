import * as core from '@actions/core'
import { context } from '@actions/github'
import { Repository } from './types'

export const repositoryInput = (): string =>
  core.getInput('repository', {
    required: false,
    trimWhitespace: true
  })

export const issueNumberInput = (): string =>
  core.getInput('issue-number', {
    required: false,
    trimWhitespace: true
  })

export const issueTitleInput = (): string =>
  core.getInput('issue-title', {
    required: false,
    trimWhitespace: true
  })

export const githubTokenInput = (): string =>
  core.getInput('github-token', {
    required: false,
    trimWhitespace: true
  })

export const bodyInput = (): string =>
  core.getInput('body', {
    required: false,
    trimWhitespace: true
  })

export const repository = (): Repository => {
  const input =
    repositoryInput() || `${context.repo.owner}/${context.repo.repo}`
  const [owner, repo] = input.split('/', 2)
  if (!owner || !repo) {
    throw new Error(`Invalid repository input: ${input}`)
  }

  return { owner, repo }
}

export const issueNumber = (): number => parseInt(issueNumberInput(), 10)
