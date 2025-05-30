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

* [Microsoft Entra](https://entra.microsoft.com) business account with credit card added. Free trial accounts work, but require a credit card.
* CHT server - ensure you are running version `4.20.0` or later. This can be an instance of [Docker Helper](/hosting/4.x/app-developer/#cht-docker-helper-for-4x).
* DNS Entries and TLS enabled on CHT


## Entra Setup

{{% steps %}}

### Login 
Login to [Entra](https://entra.microsoft.com)

### Add new Client

- Navigate to "Applications" > "App registrations" > "New registration"
- Add a "user-facing display name"  of `CHT`
- Under "Redirect URI (optional)" select `Seb`
- Enter `https://<CHT_URL>/medic/login/oidc` as the redirect URI, being sure to replace `CHT_URL` with your production CHT URL

![new-registration.png](entra/new-registration.png)
![new-registration2.png](entra/new-registration2.png)

### Copy Secret

Navigate to "Certificates & secrets" > "Client secrets" > "New client secret". Add a new secret and copy the `Value` string

![new-secret.png](entra/new-secret.png)
![copy-secret.png](entra/copy-secret.png)


### Copy Discovery URL

From the "Overview" page copy the "Application (client) ID" and the "Directory (tenant) ID"  which are needed for the `client_id` and `discovery_url` respectively in step 1 below.

![client-overview.png](entra/client-overview.png)

{{% /steps %}}


## CHT Setup

{{% steps %}}

### CHT App Settings

In the config directory for your app, update your `app_settings.json` file to contain this additional JSON at the end, before the very last `}`

Be sure to replace `APP_ID` with the Application (client) ID and `DIRECTORY_ID` with Directory (tenant) ID both from step 4 above. Replace the `CHT_URL` with the production URL of your CHT instance. If you're using a development instance, be sure the `CHT_URL` includes your port.

```json
    "oidc_provider": {
      "client_id": "<APP_ID>",
      "discovery_url": "https://login.microsoftonline.com/<DIRECTORY_ID>/v2.0/.well-known/openid-configuration"
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
Be sure to replace `SECRET` with the value from [step 3 above](#copy-secret). As well, replace `CHT_URL` with the production URL of your CHT instance, `USER` with your admin user and `PASSWORD` with your password:
```shell
curl -X PUT https://<USER>:<PASSWORD>@<CHT_URL>/api/v1/credentials/oidc:client-secret \
     -H "Content-Type: text/plain" \
     --data "<SECRET>"
```

{{< /tab >}}
{{< tab >}}
Be sure to replace `SECRET` with the value from [step 3 above](#copy-secret). As well, replace `CHT_URL` with the docker helper URL, including port:
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

### Add Entra user: Screen 1

- Navigate to "Users" > "All users" > "New user" > "Create new user"
- Enter details for your test user. Specifically note the "Mail nickname" value as this will need to match the `email` value for your CHT user.
- Specify "User principal name" of `test` which will translate to `test@<DOMAIN>.com` where `DOMAIN` is the domain you have configured for Entra.
- Be sure to copy the principal name and the generated password

![create-new-user.png](entra/create-new-user.png)
![create-new-user2.png](entra/create-new-user2.png)

### Add Entra user: Screen 2

On the 2nd "Properties" screen, you must paste the exact "User principal name" into "Contact Information" -> "Email" from the prior screen. This is what will get passed to the CHT:

![create-new-user3.png](entra/create-new-user3.png)

###  Add CHT user

From the "App Management" console in the CHT, go to "Users" > "Add user"
- User name: `test`
- SSO Email Address: `test@test.com` (must match email from prior step)
- **Note** - the `E-mail address` field is not used for SSO.

![cht.new.user.png](entra/cht-new-user.png)

###  Test login

Logout as the Admin user and then on the CHT login screen, select "Login with SSO"
- Your browser will be redirected to the Entra login screen
- Enter the username/password for your Entra user
- You will be redirected back to the CHT app and logged in as your CHT user


{{% /steps %}}

### References

- tk
