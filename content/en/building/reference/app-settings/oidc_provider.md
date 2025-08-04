---
title: ".oidc_provider"
linkTitle: ".oidc_provider"
weight: 5
description: >
  Instructions and schema for SSO Login by OIDC
relatedContent: >
  hosting/sso
  building/login/#single-sign-on-oidc-login
  building/reference/api/#login-by-oidc
  building/reference/app-settings/#app_settingsjson
  building/reference/app-settings/token_login
---

{{< callout >}}
Introduced in 4.20.0. This feature is only compatible with cht-android version `v1.5.2` or greater.
{{< /callout >}}

To support [authenticating users with Single Sign-On]({{< ref "/hosting/sso" >}}) (SSO) credentials (instead of CHT-specific usernames/passwords), the CHT can integrate with an external authorization server that supports the [OpenID Connect](https://openid.net/) (OIDC) protocol. Configure the OIDC Provider connection settings under the `oidc_provider` key:

## `app_settings.json .oidc_provider`
| property                | type    | required | description                                                                                                                                          |
|-------------------------|---------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| client_id               | String  | yes      | The unique key identifying your CHT application in your OIDC Provider.                                                                               |
| discovery_url           | String  | yes      | The URL to the `.well-known` OIDC configuration discovery endpoint for your OIDC Provider. Must be HTTPS unless `allow_insecure_requests` is `true`. |
| allow_insecure_requests | Boolean | no       | Optional configuration (NOT for production use). If `true`, the `discovery_url` can use the HTTP protocol (instead of HTTPS). Default is `false`.    |

When using SSO Login, the [`app_url` setting]({{< ref "building/reference/app-settings/#app_settingsjson" >}}) must also be defined. Also, your CHT application's _client secret_ from the OIDC Provider must be securely configured in your CHT instance with the [Credentials API]({{< ref "building/reference/api/#credentials" >}}) using the key `oidc:client-secret`.

Only users with the [`oidc_username` property]({{< ref "building/reference/api/#login-by-oidc" >}}) can log in with SSO.

## Code sample

The definition takes the typical form below:

```json
"oidc_provider": {
  "client_id": "60f18991-1eae-4825-a579-44190cbbe51d",
  "discovery_url": "https://my.oidc-provider.org/realms/master/.well-known/openid-configuration"
},
"app_url": "https://my.cht.org"
```
