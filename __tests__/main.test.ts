/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as github from '../src/github'
import * as inputs from '../src/inputs'
import * as issue from '../src/issue'
import * as main from '../src/main'

// Mock the GitHub Actions core library
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

const BodyResponse =
  `
### Field 1

thefield1value with **bold** and *italic* text

### Another Field Name

Some value 1234

> Some Quoted Value

* list
* of
* items

Blah
`.trim() +
  '\n\n```yaml\nheres a code block\n### not a real heading\n\nfoobar\n```\n\n' +
  `
### Final Heading

Final value`.trim()

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

    jest.spyOn(inputs, 'bodyInput').mockReturnValue('')
    jest.spyOn(inputs, 'issueNumberInput').mockReturnValue('')
    jest.spyOn(inputs, 'issueTitleInput').mockReturnValue('')
    jest.spyOn(inputs, 'failOnErrorInput').mockReturnValue(true)
  })

  it('should be able to parse body input', async () => {
    jest.spyOn(inputs, 'bodyInput').mockReturnValue(BodyResponse)
    await main.run()

    expect(setOutputMock).toHaveBeenCalledWith(
      'field-1',
      'thefield1value with **bold** and *italic* text'
    )
    expect(setOutputMock).toHaveBeenCalledWith(
      'another-field-name',
      'Some value 1234\n\n> Some Quoted Value\n\n* list\n* of\n* items\n\nBlah\n\n```yaml\nheres a code block\n### not a real heading\n\nfoobar\n```'
    )
    expect(setOutputMock).toHaveBeenCalledWith('final-heading', 'Final value')
  })

  it('should be able to parse issue number input', async () => {
    jest.spyOn(inputs, 'issueNumberInput').mockReturnValue('123')
    jest.spyOn(inputs, 'issueNumber').mockReturnValue(123)
    jest
      .spyOn(github, 'getIssue')
      .mockResolvedValue({ data: { number: 123, body: BodyResponse } })

    await main.run()

    expect(setOutputMock).toHaveBeenCalledWith(
      'field-1',
      'thefield1value with **bold** and *italic* text'
    )
  })

  it('should be able to parse issue title input', async () => {
    jest.spyOn(inputs, 'issueTitleInput').mockReturnValue('My Title')
    jest.spyOn(issue, 'findIssueNumberByTitle').mockResolvedValue(123)
    jest
      .spyOn(github, 'getIssue')
      .mockResolvedValue({ data: { number: 123, body: BodyResponse } })

    await main.run()

    expect(setOutputMock).toHaveBeenCalledWith(
      'field-1',
      'thefield1value with **bold** and *italic* text'
    )
  })

  it('should prioritize body input over the other inputs', async () => {
    const bodyCall = jest
      .spyOn(inputs, 'bodyInput')
      .mockReturnValue(BodyResponse)
    const issueNumberInputCall = jest
      .spyOn(inputs, 'issueNumberInput')
      .mockReturnValue('123')
    const issueTitleCall = jest
      .spyOn(inputs, 'issueTitleInput')
      .mockReturnValue('My Title')

    await main.run()

    expect(bodyCall).toHaveBeenCalled()
    expect(issueNumberInputCall).not.toHaveBeenCalled()
    expect(issueTitleCall).not.toHaveBeenCalled()
  })

  it('should prioritize issue number over issue title', async () => {
    const issueNumberInputCall = jest
      .spyOn(inputs, 'issueNumberInput')
      .mockReturnValue('123')
    const issueTitleCall = jest
      .spyOn(inputs, 'issueTitleInput')
      .mockReturnValue('My Title')

    await main.run()

    expect(issueNumberInputCall).toHaveBeenCalled()
    expect(issueTitleCall).not.toHaveBeenCalled()
  })

  it('should fail action if an error was encountered', async () => {
    // no inputs should have raised an exception
    await main.run()
    expect(setFailedMock).toHaveBeenCalled()
  })

  it('should not fail action when fail-on-error is set to false', async () => {
    jest.spyOn(inputs, 'failOnErrorInput').mockReturnValue(false)

    // no inputs should have raised an exception
    await main.run()

    expect(setFailedMock).not.toHaveBeenCalled()
  })
})
