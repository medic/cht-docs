---
title: Using CHT with Entra
linkTitle: Entra
weight: 200
---


{{< callout >}}
Introduced in 4.20.0
{{< /callout >}}

## Introduction

These steps document how to configure Microsoft Entra as the Single Sign On (SSO) identity provider for the CHT. As well, it walks through provisioning a single user for SSO.

## Prerequisites

* [Microsoft Entra](https://entra.microsoft.com) account
* CHT server - ensure you are running version `4.20.0` or later
* DNS Entries and TLS enabled on CHT

## Entra Setup

{{% steps %}}

### Login to the Microsoft Entra

- https://entra.microsoft.com
- You will need a Microsoft Entra account. (I was able to create one for free, but it did require me to enter my credit card info.)

### Add new user in Entra:

-  Navigate to "Users" > "All users" > "New user" > "Create new user"
- Enter details for your test user. Specifically note the "Mail nickname" value as this will need to match the `email` value for your CHT user.
- Be sure to copy the generated password or replace it with one that you know.

### Add new Client in Entra:

- Navigate to "Applications" > "App registrations" > "New registration"
- Add a display name to identify the client. E.g. `CHT Test Instance`
- Under "Redirect URI (optional)" select `web`
    - Enter `http://localhost:5988/medic/login/oidc/get_token` as the redirect URI
    - TODO This path might change based on review comments...
- After registering the client, navigate to "Certificates & secrets" > "Client secrets" > "New client secret"
    - Add a new secret and copy the `Value` string
- On the client app's "Overview" page, note the value displayed for "Application (client) ID". This is the `client_id` value.
- From the "Overview" page, open the "Endpoints" modal and make a note of the "OpenID Connect metadata document" link value. This is the `discovery_url`.
- Be sure you're logged in

{{% /steps %}}

## CHT Setup

{{% steps %}}

### CHT App Settings

In the config directory for your app, update your `app_settings.json` file to contain this additional JSON at the end, before the very last `}`

Be sure to replace `ENTRA_URL` with the production URL of your Keycloak instance and `CHT_URL` with the production URL of your CHT instance. If you're using a development instance, be sure the `CHT_URL` includes your port.

```json
    "oidc_provider": {
      "client_id": "CHT",
      "discovery_url": "https://<ENTRA_URL>/realms/master/.well-known/openid-configuration"
    },
    "app_url": "https://<CHT_URL>/"
```


### Upload CHT config

{{< tabs items="Production,Development" >}}
{{< tab >}}
Upload the config using CHT Conf. Replace `CHT_URL` with the production URL of your CHT instance, `USER` with your admin user and `PASSWORD` with your password:

```
cht --url=https://<USER>:<PASSWORD>@<CHT_URL> compile-app-settings upload-app-settings
```

{{< /tab >}}
{{< tab >}}

Upload the config using CHT Conf.  Replace `CHT_URL` with the docker helper URL, including port:

```
cht --url=https://medic:password@<CHT_URL> compile-app-settings upload-app-settings
```
{{< /tab >}}
{{< /tabs >}}

### Client Secret in CHT

Use the [`/api/v1/credentials` REST api](https://docs.communityhealthtoolkit.org/building/reference/api/#put-apiv1credentials) to set the client secret as the `oidc:client-secret` credential.

{{< tabs items="Production,Development" >}}
{{< tab >}}
Be sure to replace `SECRET` with the value from [step 5 above](#copy-secret). As well, replace `CHT_URL` with the production URL of your CHT instance, `USER` with your admin user and `PASSWORD` with your password:
```shell
curl -X PUT https://<USER>:<PASSWORD>@<CHT_URL>/api/v1/credentials/oidc:client-secret \
     -H "Content-Type: text/plain" \
     --data "<SECRET>"
```

{{< /tab >}}
{{< tab >}}
Be sure to replace `SECRET` with the value from [step 5 above](#copy-secret). As well, replace `CHT_URL` with the docker helper URL, including port:
```shell
curl -X PUT https://medic:password@<CHT_URL>/api/v1/credentials/oidc:client-secret \
     -H "Content-Type: text/plain" \
     --data "<SECRET>"
```
{{< /tab >}}
{{< /tabs >}}

Upon success, `curl` should show the JSON `{"ok":true}` .

Further, going to the CHT login screen should now show an extra login button "Login with SSO". You may need to hold down the "shift" key and click reload to clear the browser cache:

![login-with-sso-button.png](keycloak/login-with-sso-button.png)

{{% /steps %}}


## Add a test user (optional)

{{% steps %}}

### Add Entra user

In Entra,  create a new user by going to  tk.  Specify username of `test` and and email of `test@test.com`


### Set Entra users's password

Go to the user's tk

###  Add CHT user

From the "App Management" console in the CHT, go to "Users" > "Add user"
- User name: `test`
- SSO Email Address: `test@test.com` (must match email [from step #1](#add-keycloak-user))
- **Note** - the `E-mail address` field is not used for SSO.

![cht.new.user.png](keycloak/cht.new.user.png)

###  Test login

Logout as the Admin user and then on the CHT login screen, select "Login with SSO"
- Your browser will be redirected to the Keycloak login screen
- Enter the username/password for your Keycloak user
- You will be redirected back to the CHT app and logged in as your CHT user


{{% /steps %}}

### References

- tk
