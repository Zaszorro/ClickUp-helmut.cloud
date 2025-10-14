::wavedoc
---
title: ClickUp — Stop Time Entry
description: |
  Stops a currently running timer using POST /team/{team_id}/time_entries/stop.
inputs:
  - name: ClickUp API Token
    description: |
      Header: Authorization: <token>
    type: STRING_PASSWORD
    mandatory: true
    example:
      - name: Token
        value: pk_xxxxxxxxxxxxxxxxx
  - name: Team ID (Workspace)
    description: |
      Workspace (team) ID.
    type: STRING
    mandatory: true
    example:
      - name: Team
        value: "9010065123"
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
      Response with the stopped time entry.
    type: OBJECT
    example:
      - name: Body
        value: |
          { "data": { "id": "time_abc123", "duration": 2700000, "stopped": true } }
  - name: Run time
    type: INT
    example:
      - name: Run time
        value: 95
  - name: Time Entry ID
    description: |
      The stopped time entry ID (from response).
    type: STRING
    example:
      - name: Time Entry ID
        value: "time_abc123"
connectors:
  - name: Success
    description: Triggered when the request completes with a 2xx response.
  - name: Fail
    description: Triggered when execution encounters an error.
---
::