title: ClickUp — Delete Task
description: |
Deletes a task using DELETE /task/{task_id}. Permanently removes the task from the Workspace.
inputs:
name: ClickUp API Token
description: |
Personal API token used for authentication. Sent as HTTP header Authorization: <token>.
type: STRING_PASSWORD
mandatory: true
example:
name: Token
value: pk_xxxxxxxxxxxxxxxxx
name: Task ID
description: |
The ID of the task to delete.
type: STRING
mandatory: true
example:
name: Task ID
value: "9hcxq"
outputs:
name: Status code
description: |
HTTP status code returned by the API.
type: INT
name: Headers
description: |
HTTP response headers as key-value pairs.
type: STRING
name: Body
description: |
Full API response body as JSON (serialized). May be empty on success.
type: OBJECT
name: Run time
description: |
Node execution time in milliseconds.
type: INT
name: Task ID
description: |
The ID of the deleted task (echoed).
type: STRING
connectors:
name: Success
description: |
Triggered when the request completes with a 2xx response.
name: Fail
description: |
Triggered when execution encounters an error.
causes:
name: Authentication
description: Invalid or missing API token.
name: Not Found
description: Task ID does not exist or access denied.
name: Non-2xx Response Code
description: API returned a 4xx/5xx response.