::wavedoc
---
title: ClickUp — Update Task
description: |
  Updates a task using PUT /task/{task_id}. Include one or more fields such as name, description, status, assignees, due date, priority, or notify flag.
inputs:
  - name: ClickUp API Token
    description: |
      Personal token for authentication. Header: Authorization: <token>
    type: STRING_PASSWORD
    mandatory: true
    example:
      - name: Token
        value: pk_xxxxxxxxxxxxxxxxx
  - name: Task ID
    description: |
      The ID of the task to update.
    type: STRING
    mandatory: true
    example:
      - name: Task ID
        value: "9hcxq"
  - name: Task name (optional)
    description: |
      New title for the task.
    type: STRING
    mandatory: false
    example:
      - name: Name
        value: "Prepare Release 1.4 (hotfix)"
  - name: Description (optional)
    description: |
      Markdown supported.
    type: STRING_LONG
    mandatory: false
    example:
      - name: Description
        value: "Add hotfix notes and inform QA."
  - name: Status (optional)
    description: |
      Must exist in the destination space/list (e.g., "to do", "in progress").
    type: STRING
    mandatory: false
    example:
      - name: Status
        value: "in progress"
  - name: Assignees (comma-separated user IDs, optional)
    description: |
      Comma-separated ClickUp user IDs.
    type: STRING
    mandatory: false
    example:
      - name: Assignees
        value: "123,456"
  - name: Due date (ms or ISO, optional)
    description: |
      Accepts Unix ms or ISO-8601 (e.g., 2025-12-31T17:00:00Z).
    type: STRING
    mandatory: false
    example:
      - name: Due
        value: "2025-12-31T17:00:00Z"
  - name: Priority (1-4, optional)
    description: |
      1=Urgent, 2=High, 3=Normal, 4=Low.
    type: NUMBER
    mandatory: false
    example:
      - name: Priority
        value: 2
  - name: Notify all (optional)
    description: |
      Notify all watchers including the requester.
    type: BOOLEAN
    mandatory: false
    example:
      - name: Notify
        value: true
outputs:
  - name: Status Code
    type: INT
    example:
      - name: Status Code
        value: 200
  - name: Headers
    type: STRING
    example:
      - name: Headers
        value: |
          { "Content-Type": "application/json" }
  - name: Body
    description: |
      Full API response body as JSON (serialized).
    type: OBJECT
    example:
      - name: Body
        value: |
          { "id": "9hcxq", "name": "Prepare Release 1.4 (hotfix)", "status": { "status": "in progress" } }
  - name: Run time
    type: INT
    example:
      - name: Run time
        value: 134
  - name: Task ID
    description: |
      The updated task ID (from response).
    type: STRING
    example:
      - name: Task ID
        value: "9hcxq"
connectors:
  - name: Success
    description: Triggered when the request completes with a 2xx response.
  - name: Fail
    description: Triggered when execution encounters an error.
---
::