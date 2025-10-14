::wavedoc
---
title: ClickUp — Delete Task
description: |
  Deletes a task using DELETE /task/{task_id}. Permanently removes the task from the Workspace.
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
      The ID of the task to delete.
    type: STRING
    mandatory: true
    example:
      - name: Task ID
        value: "9hcxq"
outputs:
  - name: Status Code
    type: INT
    example:
      - name: Status Code
        value: 204
  - name: Headers
    type: STRING
    example:
      - name: Headers
        value: |
          { "X-RateLimit-Remaining": "98" }
  - name: Body
    description: |
      May be empty for 204 responses.
    type: OBJECT
    example:
      - name: Body
        value: |
          {}
  - name: Run time
    type: INT
    example:
      - name: Run time
        value: 87
  - name: Task ID
    description: |
      The deleted task ID (echoed).
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