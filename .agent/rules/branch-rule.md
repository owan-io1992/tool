# Branch Rule

## Branch Prefixes
Branch names must start with a prefix corresponding to one of the following Linear labels: `feat`, `bug`, or `doc`. These labels are mutually exclusive.
If an issue does not have one of the required labels (`feat`, `bug`, or `doc`), the user should be prompted to add one before creating the branch.

## Including Linear Git Branch Name
The branch name should include the Linear-generated git branch name. For example, if the Linear issue's git branch name is `owan/owa-8-branch-rule`, and the issue has a `feat` label, the complete branch name would be `feat/owan/owa-8-branch-rule`.

## Commit Message Format
Commit messages should follow this structure:
`<label>(<linear-issue-id>): <description-of-changes>`

Example:
`feat(OWA-8): describe the change made`
