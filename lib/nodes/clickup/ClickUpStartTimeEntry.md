::wavedoc
---
title: ClickUp — Start Time Entry
description: |
  Starts a timer for the authenticated user using POST /team/{team_id}/time_entries/start. Optionally associates the running timer with a task, description, billable flag, and tags.
inputs:
  - name: ClickUp API Token
    type: STRING_PASSWORD
    mandatory: true
  - name: Team ID (Workspace)
    type: STRING
    mandatory: true
  - name: Task ID (optional)
    type: STRING
    mandatory: false
  - name: Description (optional)
    type: STRING_LONG
    mandatory: false
  - name: Billable (optional)
    type: BOOLEAN
    mandatory: false
  - name: Tags (comma-separated, optional)
    type: STRING
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
  - name: Time Entry ID
    type: STRING
connectors:
  - name: Success
    description: Triggered when the request completes with a 2xx response.
  - name: Fail
    description: Triggered when execution encounters an error.
---
::