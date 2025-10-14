::wavedoc
---
title: ClickUp — Delete Task
description: |
  Deletes a task using DELETE /task/{task_id}. Permanently removes the task from the Workspace.
inputs:
  - name: ClickUp API Token
    type: STRING_PASSWORD
    mandatory: true
    description: |
      Personal API token used for authentication. Sent as HTTP header `Authorization: <token>`.
  - name: Task ID
    type: STRING
    mandatory: true
    description: |
      The ID of the task to delete.
outputs:
  - name: Status Code
    type: INT
  - name: Headers
    type: STRING
  - name: Body
    type: OBJECT
  - name: Run time
    type: INT
  - name: Task ID
    type: STRING
connectors:
  - name: Success
    description: Triggered when the request completes with a 2xx response.
  - name: Fail
    description: Triggered when execution encounters an error.
---
::