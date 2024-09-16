import * as inputs from '../src/inputs'
import { repository } from '../src/inputs'

describe('repository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should parse default repository properly', () => {
    process.env.GITHUB_REPOSITORY = 'owner/repo'
    jest.spyOn(inputs, 'repositoryInput').mockReturnValue('')

    expect(repository()).toEqual({ owner: 'owner', repo: 'repo' })
  })

  it('should parse input repository properly', () => {
    process.env.GITHUB_REPOSITORY = 'owner/repo'
    jest.spyOn(inputs, 'repositoryInput').mockReturnValue('foo/bar')

    expect(repository()).toEqual({ owner: 'foo', repo: 'bar' })
  })

  it('should throw an error if owner or repo is empty', () => {
    jest.spyOn(inputs, 'repositoryInput').mockReturnValue('foo')
    expect(() => repository()).toThrow()

    jest.spyOn(inputs, 'repositoryInput').mockReturnValue('/bar')
    expect(() => repository()).toThrow()
  })
})
