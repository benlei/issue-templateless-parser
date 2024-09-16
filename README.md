# Create a GitHub Action Using TypeScript

[![GitHub Super-Linter](https://github.com/benlei/issue-templateless-parser/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/benlei/issue-templateless-parser/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/benlei/issue-templateless-parser/actions/workflows/check-dist.yml/badge.svg)](https://github.com/benlei/issue-templateless-parser/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/benlei/issue-templateless-parser/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/benlei/issue-templateless-parser/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action will try to parse a `body`, or an issue's body, for fields as if it
were created by an issue template. Keep in mind that because this is
templateless, it assumes all the contents of each field are strings.

## Inputs

<!-- markdownlint-disable MD013 -->

| Input Name     | Required | Default                    | Description                                                                                                                                        |
| -------------- | -------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `repository`   | no       | `${{ github.repository }}` | The repository to find issue in, if trying to fetch an issue's body                                                                                |
| `github-token` | no       | `${{ github.token }}`      | The GitHub token to use for searching for issue                                                                                                    |
| `body`         | no       | `''`                       | The body to parse                                                                                                                                  |
| `issue-number` | no       | `''`                       | The issue number to try to fetch the body from for parsing. Ignored if `body` input is specified/has content.                                      |
| `issue-title`  | no       | `''`                       | The exact issue title to search for to try to fetch the body from for parsing. Ignored if `body` or `issue-number` input is specified/has content. |

<!-- markdownlint-enable MD013 -->

## Outputs

<!-- markdownlint-disable MD013 -->

| Output Name    | Description                                                                                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `issue-number` | The issue number that was found, if an issue was fetched/searched for                                                                                                                                                                    |
| `*`            | The headings are slugified (lowercased, alphanumeric chars only) before having its content set as the output. For example, if you had the heading `Hello World`, you can expect the output `hello-world` to have been set from this step |

<!-- markdownlint-enable MD013 -->

## Examples

### Parse by Body

<!-- markdownlint-disable MD013 -->

````yaml
- name: Test Local Action - Body
  id: test
  uses: benlei/issue-templateless-parser@v1
  env:
    ISSUE_BODY: |
      ### Issue Title

      This is the body of the issue

      ```yaml
      time: 10
      ```

      And that's about it

      ### Something Else 123

      1235768457246

      ### Third Heading over here...

      Hello World
  with:
    body: ${{ env.ISSUE_BODY }}

- name: Outputs are not correct
  if: |
    steps.test.outputs.issue-number != '' ||
    !contains(steps.test.outputs.issue-title, 'time: 10') ||
    !contains(steps.test.outputs.issue-title, 'about it') ||
    steps.test.outputs.something-else-123 != '1235768457246' ||
    steps.test.outputs.third-heading-over-here != 'Hello World'
  run: exit 1
````

<!-- markdownlint-enable MD013 -->

### Parse by Issue Number

<!-- markdownlint-disable MD013 -->

```yaml
- name: Test Local Action - Issue Number
  id: test
  uses: benlei/issue-templateless-parser@v1
  with:
    issue-number: 3

- name: Outputs are not correct
  if: |
    steps.test.outputs.issue-number != '3' ||
    !contains(steps.test.outputs.issue-title, 'time: 10') ||
    !contains(steps.test.outputs.issue-title, 'about it') ||
    steps.test.outputs.something-else-123 != '1235768457246' ||
    steps.test.outputs.third-heading-over-here != 'Hello World'
  run: exit 1
```

<!-- markdownlint-enable MD013 -->

### Parse by Exact Issue Title

<!-- markdownlint-disable MD013 -->

```yaml
- name: Test Local Action - Issue Title
  id: test
  uses: benlei/issue-templateless-parser@v1
  with:
    issue-title: Issue with example contents

- name: Outputs are not correct
  if: |
    steps.test.outputs.issue-number != '3' ||
    !contains(steps.test.outputs.issue-title, 'time: 10') ||
    !contains(steps.test.outputs.issue-title, 'about it') ||
    steps.test.outputs.something-else-123 != '1235768457246' ||
    steps.test.outputs.third-heading-over-here != 'Hello World'
  run: exit 1
```

<!-- markdownlint-enable MD013 -->
