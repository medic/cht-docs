---
title: ".token_login"
linkTitle: ".token_login"
weight: 5
description: >
  **Token login**: Instructions and schema for Login by SMS
relatedContent: >
  building/reference/api#login-by-sms
  building/reference/app-settings/oidc_provider
aliases:
   - /apps/reference/app-settings/token_login
---

When creating or updating a user, sending a truthy value for the field `token_login` enables Login by SMS for this user.
This action resets the user's password to an unknown string and generates a complex 64-character token, used to generate a token-login URL.
The URL is sent to the user's phone number by SMS, along with another (configurable) SMS that can contain additional information.
Accessing this link before its expiration time logs the user in directly - without the need of any other credentials.
The link can only be accessed once, and the token becomes invalid after one login.
The token expires in 24 hours, after which logging in is only possible by either generating a new token, or disabling `token_login` and manually setting a password.

The SMS messages are stored in a doc of type `login_token`. These docs cannot be viewed as reports from the webapp, and can only be edited by admins, but their messages are visible in the Admin Message Queue page.

To disable login by SMS for a user, update the user sending `token_login` with a `false` value.
To regenerate the token, update the user sending `token_login` with a `true` value.

| `token_login` | user state           | action                                                                                                                 |
|---------------|----------------------|------------------------------------------------------------------------------------------------------------------------|
| undefined     | new                  | None                                                                                                                   |
| undefined     | existing, no token   | None                                                                                                                   |
| undefined     | existing, with token | None. Login by SMS remains enabled. Token is unchanged.                                                                |
| true          | new                  | Enables Login by SMS. Generates token and sends SMS.                                                                   |
| true          | existing, no token   | Resets password. Enables Login by SMS. Generates token and sends SMS. Invalidates existing sessions.                   |
| true          | existing, with token | Resets password. Enables Login by SMS. Generates new token and sends SMS. Invalidates old token and existing sessions. |
| false         | new                  | None                                                                                                                   |
| false         | existing, no token   | None                                                                                                                   |
| false         | existing, with token | Requires a password. Disables Login by SMS. Invalidates old token and existing sessions.                               |

{{< see-also page="building/login" anchor="remote-login" >}}

## Configuration

Login via SMS settings are defined under the `token_login` key, as an object supporting the following properties:

{{< callout >}}
As of CHT `5.0.0`, the [`app_url` config](/building/reference/app-settings/#app_settingsjson) is **required** when enabling token login. If `token_login.enabled` is `true` and `app_url` is not set, token login will not work and errors will be thrown.
{{< /callout >}}

## `app_settings.json .token_login`
| property         | type | required       | description                                                                                                                                                                              |
|------------------|------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| enabled | Boolean | yes | Enables or disables token_login deployment-wide. When this is false, users can't be updated to use token_login and any requests to login with a token link will fail.  |
| translation_key | String | yes | Translation key for the information (helper) sms message that the user receives, along with their token-login link |

## Code sample

The definition takes the typical form below:

```json
"app_url": "https://example.org",
"token_login": {
  "enabled": true,
  "translation_key": "sms.token.login.help"
}
```
