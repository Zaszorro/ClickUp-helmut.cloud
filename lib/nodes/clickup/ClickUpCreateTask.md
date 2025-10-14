::wavedoc
---
title: Get Secret
description: |
  The Get Secret node retrieves a stored secret from the High5 space secrets store using its name.
inputs:
  - name: Secret Name
    description: |
      Enter the name of the secret (up to 32 characters). Allowed characters include lowercase and uppercase letters (a-z, A-Z), digits (0-9), hyphen (-), underscore (_), and period (.).
    type: STRING
    mandatory: true
    example:
      - name: Secret Name
        value: helmut
outputs:
  - name: Secret value
    description: |
      Returns the value of the stored secret.
    type: STRING
    example:
      - name: Secret value
        value: cloud
  - name: Secret encrypted
    description: |
      Returns whether the secret’s value is encrypted.
    type: BOOLEAN
    example:
      - name: Secret encrypted
        value: "false"
connectors:
  - name: Success
    description: |
      Triggered when the secret is retrieved successfully.
  - name: Fail
    description: |
      Triggered when the operation fails.
    causes:
      - name: Secret Name Too Long
        description: |
          If the secret name exceeds 32 characters.
      - name: Unsupported Characters
        description: |
          If the secret name contains invalid characters.
      - name: Not Found
        description: |
          If the secret does not exist in the High5 space.
---
::