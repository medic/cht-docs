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

When creating or updating a user, sending a truthy value for the field `token_login` will enable Login by SMS for this user.
This action resets the user's password to an unknown string and generates a complex 64 character token, that is used to generate a token-login URL.
The URL is sent to the user's phone number by SMS, along with another (configurable) SMS that can contain additional information.
Accessing this link, before its expiration time, will log the user in directly - without the need of any other credentials.
The link can only be accessed once, the token becomes invalid after being used for one login.
The token expires in 24 hours, after which logging in is only possible by either generating a new token, or disabling `token_login` and manually setting a password.

The SMS messages are stored in a doc of type `login_token`. These docs cannot be viewed as reports from the webapp, and can only be edited by admins, but their messages are visible in the Admin Message Queue page.

To disable login by SMS for a user, update the user sending `token_login` with a `false` value.
To regenerate the token, update the user sending `token_login` with a `true` value.

| `token_login` | user state           | action                                                                                                                                    |
|---------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| undefined     | new                  | None                                                                                                                                      |
| undefined     | existent, no token   | None                                                                                                                                      |
| undefined     | existent, with token | None. Login by SMS remains enabled. Token is unchanged.                                                                                   |
| true          | new                  | Login by SMS enabled. Token is generated and SMS is sent.                                                                                 |
| true          | existent, no token   | Password is reset. Login by SMS enabled. Token is generated and SMS is sent. Existent sessions are invalidated.                           |
| true          | existent, with token | Password is reset. Login by SMS enabled. New token is generated and SMS is sent. Old token is invalid. Existent sessions are invalidated. |
| false         | new                  | None.                                                                                                                                     |
| false         | existent, no token   | None.                                                                                                                                     |
| false         | existent, with token | Request requires a password. Login by SMS is disabled. Old token is invalidated. Existent sessions are invalidated.                       |


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
