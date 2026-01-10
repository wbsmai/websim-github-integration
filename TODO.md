# Plan

## How to get source code from Websim

GET `https://websim.com/api/v1/projects/{project_id}/revisions/{revision_id}/assets`

Use `.path` property for each asset

GET `https://{project_id}.c.websim.com/{path}?v={revision_id}`

## How to push all of source code to GitHub with Octokit

- Create blobs for each file with `octokit.git.createBlob`
- Create tree with `octokit.git.createTree`
- Create commit with `octokit.git.createCommit`
- Update reference with `octokit.git.updateRef`

## How to get source code from GitHub with Octokit

- Use `octokit.repos.getContent` to fetch files/directories
- Recursively handle directories
- Decode base64 content for files
