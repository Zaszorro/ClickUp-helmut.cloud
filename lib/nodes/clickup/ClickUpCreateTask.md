::wavedoc
---

title: ClickUp — Create Task
description: |
    Creates a new task in a ClickUp list using POST /list/{list_id}/task. Supports core fields such as name, description, status, assignees, due date, priority, and notifications. Time inputs accept either Unix milliseconds or ISO-8601 strings.
inputs:
    - name: ClickUp API Token
       description: |
        Personal API token used for authentication. Sent as HTTP header Authorization: <token>.
       type: STRING_PASSWORD
       mandatory: true
       example:
        - name: Token
        value: pk_xxxxxxxxxxxxxxxxx
    - name: List ID
       description: |
         The target list ID where the task will be created.
       type: STRING
       mandatory: true
       example:
        - name: List ID
          value: "9002001"
    - name: Task name
       description: |
        Title of the task.
       type: STRING
       mandatory: true
       example:
        - name: Title
          value: "Prepare Release 1.4"
    - name: Description (optional)
        description: |
        Task description text. Markdown is supported.
        type: STRING_LONG
        mandatory: false
        example:
        - name: Description
          value: "Review the changelog and schedule QA."
    - name: Status (optional)
        description: |
        Target status for the task (e.g., "to do", "in progress"). The status must exist in the destination space/list.
        type: STRING
        mandatory: false
        example:
         - name: Status
         value: "in progress"
    - name: Assignees (comma-separated user IDs, optional)
        description: |
            Comma-separated list of user IDs to assign to the task (e.g., "123,456").
        type: STRING
        mandatory: false
        example:
        - name: Assignees
          value: "123,456"
    - name: Due date (ms or ISO, optional)
        description: |
            Due timestamp for the task. Accepts Unix milliseconds or ISO-8601 (e.g., "2025-12-31T17:00:00Z"). If a time component is provided, due_date_time is considered accordingly.
        type: STRING
        mandatory: false
        example:
        - name: Due
          value: "2025-12-31T17:00:00Z"
    - name: Priority (1-4, optional)
        description: |
            Priority as a number: 1 = Urgent, 2 = High, 3 = Normal, 4 = Low.
        type: NUMBER
        mandatory: false
        example:
        - name: Priority
          value: 2
    - name: Notify all (optional)
        description: |
            When enabled, ClickUp notifies all watchers including the creator.
        type: BOOLEAN
        mandatory: false
        example:
        - name: Notify
          value: true
outputs:
    - name: Status code
        description: |
            HTTP status code returned by the API.
        type: INT
        example:
        - name: Status code
          value: 200
    - name: Headers
        description: |
            HTTP response headers as key-value pairs.
        type: STRING
        example:
        - name: Headers
            value: |
                {
                "Content-Type": "application/json",
                "X-RateLimit-Remaining": "98"
                }
    - name: Body
        description: |
             Full API response body as JSON (serialized).
        type: OBJECT
        example:
        - name: Body
            value: |
                {
                "id": "9hcxq",
                "name": "Prepare Release 1.4",
                "status": {"status": "in progress"}
                }
    - name: Run time
        description: |
            Node execution time in milliseconds.
        type: INT
        example:
        - name: Run time
            value: 123
    - name: Task ID
        description: |
            The ID of the created task (extracted from the API response).
        type: STRING
        example:
        - name: Task ID
            value: "9hcxq"
connectors:
    - name: Success
        description: |
            Triggered when the request completes with a 2xx response.
    - name: Fail
        description: |
            Triggered when execution encounters an error.
        causes:
          - name: Authentication
            description: |
            Invalid or missing API token.
          - name: Invalid Configuration
            description: |
            Missing required fields (e.g., List ID or Task name) or invalid values (e.g., priority outside 1–4).
          - name: Status Not Available
            description: |
            The target status does not exist in the destination list/space.
          - name: Non-2xx Response Code
            description: |
            API returned a 4xx/5xx response.
          - name: Response Parsing Error
            description: |
            Response body could not be parsed as JSON.
          - name: Rate Limit
            description: |
            ClickUp rate limit was reached.