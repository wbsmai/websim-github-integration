# Websim to GitHub Export Plan

## How to get source code from Websim

GET `https://websim.com/api/v1/projects/{project_id}/revisions/{revision_id}/assets`

Use `.path` property for each asset

GET `https://{project_id}.c.websim.com/{path}?v={revision_id}`

## How to push all of source code to GitHub with Octokit

- Create blobs for each file with `octokit.git.createBlob`
- Create tree with `octokit.git.createTree`
- Create commit with `octokit.git.createCommit`
- Update reference with `octokit.git.updateRef`

## Export Process

1. Detect current Websim project and revision from page context
2. Fetch all project assets from Websim API
3. For each file asset, download content via Websim CDN
4. Create GitHub blobs for each file
5. Create GitHub tree with all file references
6. Create commit with descriptive message
7. Update target branch reference
