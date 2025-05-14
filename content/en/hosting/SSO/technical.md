---
title: SSO technical reference
linkTitle: Technical
weight: 400
---

pull in key elements from [design doc](https://docs.google.com/document/d/1LUn1ZRetAmYE04CtdcTmp-bEBvl37AZ0CvFXZChXqfU/edit?tab=t.0)

```mermaid
sequenceDiagram
    autonumber
    participant cht as CHT <br/>(api server)
    participant user_agent as User <br/>(web browser)
    participant auth_server as OIDC Provider <br/>(authorization server)

    user_agent->>cht: Request SSO login authorization
    cht->>user_agent: Redirect to authorize endpoint on OIDC provider
    user_agent->>auth_server: Request OIDC authorization <br/>(happens automatically)
    auth_server->>user_agent: Respond with authentication challenge <br/>(e.g. login page)
    user_agent->>auth_server: User authenticates <br/>(e.g. submits SSO username/password)
    auth_server-->>auth_server: Authenticate user
    auth_server->>user_agent: Redirect back to CHT <br/>(with authorization_code)
    user_agent->>cht: Submit authorization_code <br/>(happens automatically)
    cht-->>auth_server: Request id_token with email scope
    auth_server-->>auth_server: Validates authorization_code <br/>and client credentials
    auth_server-->>cht: Reply with id_token (including email claim)
    cht->>user_agent: Reply with session cookie
    
    Note over cht,user_agent: Subsequent requests are made with the <br/>session cookie and do not require contacting<br/>the OIDC provider
```
