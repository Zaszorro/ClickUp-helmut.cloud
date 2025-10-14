::wavedoc
---
title: ClickUp — Update Time Entry
description: |
  Updates a time entry using PUT /team/{team_id}/time_entries/{timer_id}. You can adjust start, end, duration, description, billable, tags, or associate with a task.
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
      ID of the time entry to update.
    type: STRING
    mandatory: true
    example:
      - name: Time Entry ID
        value: "time_abc123"
  - name: Task ID (optional)
    description: |
      Associate entry with a task.
    type: STRING
    mandatory: false
    example:
      - name: Task
        value: "9hcxq"
  - name: Start (ms or ISO, optional)
    description: |
      Start timestamp (Unix ms or ISO-8601).
    type: STRING
    mandatory: false
    example:
      - name: Start
        value: "2025-10-13T08:15:00Z"
  - name: End (ms or ISO, optional)
    description: |
      End timestamp (Unix ms or ISO-8601).
    type: STRING
    mandatory: false
    example:
      - name: End
        value: "2025-10-13T09:00:00Z"
  - name: Duration in ms (optional)
    description: |
      Duration in milliseconds. Negative means running.
    type: NUMBER
    mandatory: false
    example:
      - name: Duration
        value: 2700000
  - name: Description (optional)
    type: STRING_LONG
    mandatory: false
    example:
      - name: Description
        value: "Daily standup + review (edited)"
  - name: Billable (optional)
    type: BOOLEAN
    mandatory: false
    example:
      - name: Billable
        value: false
  - name: Tags (comma-separated, optional)
    type: STRING
    mandatory: false
    example:
      - name: Tags
        value: "clientA,internal"
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
          { "data": { "id": "time_abc123", "description": "Daily standup + review (edited)", "billable": false } }
  - name: Run time
    type: INT
    example:
      - name: Run time
        value: 121
  - name: Time Entry ID
    description: |
      The updated time entry ID (from response).
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