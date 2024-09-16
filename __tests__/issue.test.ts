import { IssueListResponse } from '../src/types'
import * as github from './../src/github'
import * as inputs from './../src/inputs'
import { findIssueNumberByTitle } from './../src/issue'

describe('findIssueNumberByTitle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should find the issue number', async () => {
    jest.spyOn(inputs, 'issueTitleInput').mockReturnValue('My Title')

    async function* iterator(): AsyncIterableIterator<IssueListResponse> {
      yield {
        data: [
          { title: 'Some title', number: 643 },
          { title: 'My Title', number: 123 }
        ]
      }

      yield {
        data: [
          { title: 'Next title', number: 7542 },
          { title: 'More titles', number: 42 }
        ]
      }
    }

    jest.spyOn(github, 'openIssuesIterator').mockReturnValue(iterator())
    expect(await findIssueNumberByTitle('My Title')).toEqual(123)

    jest.spyOn(github, 'openIssuesIterator').mockReturnValue(iterator())
    expect(await findIssueNumberByTitle('More titles')).toEqual(42)

    jest.spyOn(github, 'openIssuesIterator').mockReturnValue(iterator())
    expect(await findIssueNumberByTitle('unknown')).toEqual(null)
  })
})
