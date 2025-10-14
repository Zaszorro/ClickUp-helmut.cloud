::wavedoc
---
title: ClickUp — Update Task
description: |
  Updates a task using PUT /task/{task_id}. Include one or more fields in the request body such as name, description, status, assignees, due date, priority, or notify flag.
inputs:
  - name: ClickUp API Token
    type: STRING_PASSWORD
    mandatory: true
  - name: Task ID
    type: STRING
    mandatory: true
  - name: Task name (optional)
    type: STRING
    mandatory: false
  - name: Description (optional)
    type: STRING_LONG
    mandatory: false
  - name: Status (optional)
    type: STRING
    mandatory: false
  - name: Assignees (comma-separated user IDs, optional)
    type: STRING
    mandatory: false
  - name: Due date (ms or ISO, optional)
    type: STRING
    mandatory: false
  - name: Priority (1-4, optional)
    type: NUMBER
    mandatory: false
  - name: Notify all (optional)
    type: BOOLEAN
    mandatory: false
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