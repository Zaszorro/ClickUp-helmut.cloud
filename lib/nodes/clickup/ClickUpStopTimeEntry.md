::wavedoc
---
title: ClickUp — Stop Time Entry
description: |
  Stops a currently running timer using POST /team/{team_id}/time_entries/stop.
inputs:
  - name: ClickUp API Token
    type: STRING_PASSWORD
    mandatory: true
  - name: Team ID (Workspace)
    type: STRING
    mandatory: true
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