::wavedoc
---
title: ClickUp — Start Time Entry
description: |
  Starts a timer for the authenticated user using POST /team/{team_id}/time_entries/start. Optionally associates the timer with a task, description, billable flag, and tags.
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
      Workspace (a.k.a. team) ID.
    type: STRING
    mandatory: true
    example:
      - name: Team
        value: "9010065123"
  - name: Task ID (optional)
    description: |
      Associate the running timer with a task.
    type: STRING
    mandatory: false
    example:
      - name: Task
        value: "9hcxq"
  - name: Description (optional)
    type: STRING_LONG
    mandatory: false
    example:
      - name: Description
        value: "Client kickoff call"
  - name: Billable (optional)
    type: BOOLEAN
    mandatory: false
    example:
      - name: Billable
        value: true
  - name: Tags (comma-separated, optional)
    type: STRING
    mandatory: false
    example:
      - name: Tags
        value: "clientA,meeting"
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
      Response containing current running time entry.
    type: OBJECT
    example:
      - name: Body
        value: |
          { "data": { "id": "time_abc123", "task": { "id": "9hcxq" }, "description": "Client kickoff call", "billable": true } }
  - name: Run time
    type: INT
    example:
      - name: Run time
        value: 112
  - name: Time Entry ID
    description: |
      The running time entry ID (from response).
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