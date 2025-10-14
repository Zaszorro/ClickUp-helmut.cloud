::wavedoc
---
title: ClickUp — Update Time Entry
description: |
  Updates a time entry using PUT /team/{team_id}/time_entries/{timer_id}. You can adjust start, end, duration, description, billable, tags, or associate with a task.
inputs:
  - name: ClickUp API Token
    type: STRING_PASSWORD
    mandatory: true
  - name: Team ID (Workspace)
    type: STRING
    mandatory: true
  - name: Time Entry ID
    type: STRING
    mandatory: true
  - name: Task ID (optional)
    type: STRING
    mandatory: false
  - name: Start (ms or ISO, optional)
    type: STRING
    mandatory: false
  - name: End (ms or ISO, optional)
    type: STRING
    mandatory: false
  - name: Duration in ms (optional)
    type: NUMBER
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