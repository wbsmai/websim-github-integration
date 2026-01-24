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

## How to push all code to Websim

Did some digging into the websim requests for assets, heres what I was able to find:

### To edit or create new file on websim

First, create a draft by making a `POST` request to `/api/v1/projects/<ID>/revisions`, obtaining the revision numeral ID and revision ID

Then send a `POST` request to `https://websim.com/api/v1/projects/<project ID>/revisions/<revision numeral ID>/assets`

Submit form data with following stucture

```text
------boundary114514
Content-Disposition: form-data; name="contents"

[{"size":<SIZE OF BINARY IN BYTES>,"existingAssetPath":"<ASSET PATH TO REPLACE, DO NOT INCLUDE THIS FIELD IF NEW UPLOAD>"},{<DATA FOR FILE 2>}]
------boundary114514
Content-Disposition: form-data; name="0"; filename="13292110.jpg.webp"
Content-Type: image/webp
[IMAGE DATA IN BINARY]
------boundary114514
Content-Disposition: form-data; name="1"; filename="index.html"
Content-Type: text/html
<THE ENTIRE CONTENTS OF index.html>
------boundary114514--
```

Note: seems like you just replace the whole file with new contents. Multiple files can be batched this way, the order of the data maps to the order in the JSON.

Then send a `POST` request to `https://websim.com/api/v1/sites`

```json
{
  "content": "<CONTENTS OF INDEX.HTML>",
  "project_id": "<project id>",
  "project_version": "<revision numeral ID>",
  "project_revision_id": "<revision uuid>",
  "prompt_data_override": {
    "type": "manual-edit",
    "text": "",
    "data": null
  }
}
```

### To delete file on websim

Send a `DELETE` request to `https://websim.com/api/v1/projects/<project ID>/revisions/<revision ID>/assets/<PATH TO FILE>`

### Process of syncing would be something like this

```typescript
function manual_sync(project_id: string, files_to_sync: Array) {
  current_revision_id = get_info(project_id);
  new_revision_data = create_new_revision(project_id, (parent_revision = current_revision_id));
  files_form = create_form(files_to_sync, new_revision_data.numeral_id);
  post_assets(files_form);
  post_sites(index_html, project_id, new_revision_data.numeral_id, new_revision_data.uuid);
  set_draft_status_and_pinned_version();
}

function create_form(files) {
  boundary = "-----boundary114514";
  form = [];
  header_data = [];
  for (file of files) {
    header.files({ size: sizeof(file), existingAssetPath: file.path });
  }
  header = [
    boundary,
    'Content-Disposition: form-data; name="contents"',
    "",
    JSON.stringify(header_data),
  ];
  form += header;
  for (file of files) {
    fileHeader = [
      boundary,
      `Content-Disposition: form-data; name="${i}"; filename="${file.name}"`,
      `Content-Type: ${file.type || "application/octet-stream"}`,
      "",
    ].join("\r\n");
    form.append(fileHeader);
    form.append(fileBinary);
  }
  form.join("\n") + "--";
}
```
