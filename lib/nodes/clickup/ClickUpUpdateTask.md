title: ClickUp — Update Task
description: |
Updates a task using PUT /task/{task_id}`. Include one or more fields in the request body. Common fields include name, description, status, assignees, due date, priority, and notify options.
inputs:
name: ClickUp API Token
type: STRING_PASSWORD
mandatory: true
description: Personal API token used for authentication. Sent as HTTP header Authorization: <token>.
name: Task ID
type: STRING
mandatory: true
description: The ID of the task to update.
name: Task name (optional)
type: STRING
mandatory: false
description: New task title.
name: Description (optional)
type: STRING_LONG
mandatory: false
description: New task description (Markdown supported).
name: Status (optional)
type: STRING
mandatory: false
description: Target status (must exist in the destination list/space).
name: Assignees (comma-separated user IDs, optional)
type: STRING
mandatory: false
description: Comma-separated user IDs to assign.
name: Due date (ms or ISO, optional)
type: STRING
mandatory: false
description: Due timestamp; accepts Unix ms or ISO-8601 (YYYY-MM-DDTHH:mm:ssZ).
name: Priority (1-4, optional)
type: NUMBER
mandatory: false
description: Priority as number (1=Urgent, 2=High, 3=Normal, 4=Low).
name: Notify all (optional)
type: BOOLEAN
mandatory: false
description: Notify all watchers including the creator.
outputs:
name: Status code
type: INT
name: Headers
type: STRING
name: Body
type: OBJECT
description: Full API response body as JSON (serialized).
name: Run time
type: INT
name: Task ID
type: STRING
description: The ID of the updated task (extracted from response; falls back to input Task ID).
connectors:
name: Success
description: Triggered for 2xx responses.
name: Fail
description: Triggered on errors.
causes:
name: Authentication
description: Invalid or missing API token.
name: Invalid Configuration
description: Missing Task ID or invalid field values.
name: Status Not Available
description: Target status does not exist in the destination list/space.
name: Non-2xx Response Code
description: API returned a 4xx/5xx response.