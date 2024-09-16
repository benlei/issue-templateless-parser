import { parseBodyFields } from '../src/parser'

const BodyValue =
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

describe('parseBodyFields', () => {
  it('should parse the body into fields', () => {
    const parsedFields = parseBodyFields(BodyValue)
    expect(parsedFields).toEqual([
      {
        key: 'Field 1',
        value: 'thefield1value with **bold** and *italic* text'
      },
      {
        key: 'Another Field Name',
        value:
          'Some value 1234\n\n> Some Quoted Value\n\n* list\n* of\n* items\n\nBlah\n\n```yaml\nheres a code block\n### not a real heading\n\nfoobar\n```'
      },
      {
        key: 'Final Heading',
        value: 'Final value'
      }
    ])
  })
})
