---
title: ".token_login"
linkTitle: ".token_login"
weight: 5
description: >
  **Token login**: Instructions and schema for Login by SMS
relatedContent: >
  apps/reference/api#login-by-sms
 
keywords: sms login users
---

Login via SMS settings are defined under the `token_login` key, as an object supporting the following properties:
## `app_settings.json .sms`
| property         | required       | description                                                                                                                                                                              |
|------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| app_url | yes | Defined the base URL of the app. |
| translation_key  | yes if `message` is not defined | Translation key for the information (helper) sms message that the user receives, along with they token-login link |
| message  | yes if `translation_key` is not defined | Message content for the information (helper) sms message that the user receives, along with they token-login link |

## Code sample

The definition takes the typical form below:

```json
"token_login": {
  "app_url": "https://your-deployment-url.com/",
  "translation_key": "sms.token.login.help"
}
```
