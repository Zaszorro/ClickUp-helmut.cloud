::wavedoc
---
title: ClickUp — Create Time Entry
description: |
  Creates a time entry using POST /team/{team_id}/time_entries. Supports assigning to a task, custom start/end or duration, description, billable flag, and tags. A negative duration indicates a currently running timer.
inputs:
  - name: ClickUp API Token
    description: |
      Personal API token used for authentication. Sent as HTTP header `Authorization: <token>`.
    type: STRING_PASSWORD
    mandatory: true
    example:
      - name: Token
        value: pk_xxxxxxxxxxxxxxxxx
  - name: Team ID (Workspace)
    description: |
      The Workspace (team) ID to scope the time entry.
    type: STRING
    mandatory: true
    example:
      - name: Team
        value: "9010065123"
  - name: Task ID (optional)
    description: |
      Associate the time entry with a task (tid).
    type: STRING
    mandatory: false
    example:
      - name: Task
        value: "9hcxq"
  - name: Start (ms or ISO, optional)
    description: |
      Start timestamp for the entry. Accepts Unix milliseconds or ISO-8601 (`YYYY-MM-DDTHH:mm:ssZ`).
    type: STRING
    mandatory: false
    example:
      - name: Start
        value: "2025-10-13T08:15:00Z"
  - name: End (ms or ISO, optional)
    description: |
      End timestamp for the entry. Accepts Unix milliseconds or ISO-8601.
    type: STRING
    mandatory: false
    example:
      - name: End
        value: "2025-10-13T09:00:00Z"
  - name: Duration in ms (optional)
    description: |
      Duration in milliseconds. A negative value indicates a currently running timer.
    type: NUMBER
    mandatory: false
    example:
      - name: Duration
        value: 2700000
  - name: Description (optional)
    description: |
      Optional text description for the time entry.
    type: STRING_LONG
    mandatory: false
    example:
      - name: Description
        value: "Daily standup + review"
  - name: Billable (optional)
    description: |
      Whether the time is billable.
    type: BOOLEAN
    mandatory: false
    example:
      - name: Billable
        value: true
  - name: Tags (comma-separated, optional)
    description: |
      Comma-separated list of tags (labels) for the time entry.
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
          {
            "Content-Type": "application/json"
          }
  - name: Body
    type: OBJECT
    description: |
      Full API response body as JSON (serialized).
    example:
      - name: Body
        value: |
          { "id": "time_abc", "description": "Daily standup + review" }
  - name: Run time
    type: INT
  - name: Time Entry ID
    type: STRING
    description: |
      The ID of the created time entry (extracted from the API response).
connectors:
  - name: Success
    description: Triggered when the request completes with a 2xx response.
  - name: Fail
    description: Triggered when execution encounters an error.
---
::