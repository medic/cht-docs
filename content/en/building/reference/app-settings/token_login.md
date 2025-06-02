---
title: ".token_login"
linkTitle: ".token_login"
weight: 5
description: >
  **Token login**: Instructions and schema for Login by SMS
relatedContent: >
  building/reference/api#login-by-sms
aliases:
   - /apps/reference/app-settings/token_login
---

Login via SMS settings are defined under the `token_login` key, as an object supporting the following properties:

> **Note:**  
> As of CHT 5.0.0, the `app_url` config is **required** when enabling token login. If `token_login.enabled` is `true` and `app_url` is not set, token login will not work and errors will be thrown.  
> Example:
> ```json
> "app_url": "https://example.org"
> ```

## `app_settings.json .token_login`
| property         | type | required       | description                                                                                                                                                                              |
|------------------|------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| enabled | Boolean | yes | Enables or disables token_login deployment-wide. When this is false, users can't be updated to use token_login and any requests to login with a token link will fail.  |
| translation_key | String | yes | Translation key for the information (helper) sms message that the user receives, along with their token-login link |
| app_url | String | yes | **Required as of 5.0.0 when token_login.enabled is true** The base URL of your CHT instance, used to generate login links. Example: "https://example.org" |
* Only required if token_login.enabled is true.

## Code sample

The definition takes the typical form below:

```json
"app_url": "https://example.org",
"token_login": {
  "enabled": true,
  "translation_key": "sms.token.login.help"
}
```
