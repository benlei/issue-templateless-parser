import { Remarkable } from 'remarkable'
import { Field } from './types'

export const parseBodyFields = (body: string): Field[] => {
  const isHeading = (node: Remarkable.Token): boolean =>
    node.type === 'heading_open' && node.level === 0

  // content is always the node after the current
  const determineHeadingName = (
    nodes: Remarkable.Token[],
    headingOpenIndex: number
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ): string => (nodes[headingOpenIndex + 1] as Remarkable.TextToken).content!

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const getHeadingStartLine = (node: Remarkable.Token): number => node.lines![0]
  const getHeadingEndingLine = (node: Remarkable.Token): number =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    node.lines![1]

  const bodySplit = body.split('\n')
  const result: Field[] = []
  const md = new Remarkable()
  const nodes = md.parse(body, {})

  for (let i = 0; i < nodes.length; i++) {
    if (!isHeading(nodes[i])) {
      continue
    }

    const startLine = getHeadingEndingLine(nodes[i])
    let endLine = bodySplit.length
    for (let j = i + 1; j < nodes.length; j++) {
      if (isHeading(nodes[j])) {
        endLine = getHeadingStartLine(nodes[j])
        break
      }
    }

    result.push({
      key: determineHeadingName(nodes, i),
      value: bodySplit.slice(startLine, endLine).join('\n').trim()
    })
  }

  return result
}
