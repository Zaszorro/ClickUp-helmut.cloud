::wavedoc
---
title: ClickUp — Delete Time Entry
description: |
  Deletes a time entry using DELETE /team/{team_id}/time_entries/{timer_id}.
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
  - name: Time Entry ID
    description: |
      ID of the time entry to delete.
    type: STRING
    mandatory: true
    example:
      - name: Time Entry ID
        value: "time_abc123"
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
      Usually empty for 204 responses.
    type: OBJECT
    example:
      - name: Body
        value: |
          {}
  - name: Run time
    type: INT
    example:
      - name: Run time
        value: 76
  - name: Time Entry ID
    description: |
      The deleted time entry ID (echoed).
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