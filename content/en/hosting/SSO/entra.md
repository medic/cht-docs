---
title: Using CHT with Entra
linkTitle: Entra
weight: 200
---


# UPDATES TO THIS DOCUMENT NEEDED!
* dev vs prod
* test flow to ensure they're accurate
* taken from [GH ticket](https://github.com/medic/cht-core/issues/9827#issuecomment-2845779609)

## Microsoft Entra (Azure AD)

- Login to the Microsoft Entra console at `https://entra.microsoft.com`
    - You will need a Microsoft Azure account. (I was able to create one for free, but it did require me to enter my credit card info.)
- Add new user in Entra:
    -  Navigate to "Users" > "All users" > "New user" > "Create new user"
    - Enter details for your test user. Specifically note the "Mail nickname" value as this will need to match the `email` value for your CHT user.
    - Be sure to copy the generated password or replace it with one that you know.
- Add new Client in Entra:
    - Navigate to "Applications" > "App registrations" > "New registration"
    - Add a display name to identify the client. E.g. `CHT Test Instance`
    - Under "Redirect URI (optional)" select `web`
        - Enter `http://localhost:5988/medic/login/oidc/get_token` as the redirect URI
        - TODO This path might change based on review comments...
    - After registering the client, navigate to "Certificates & secrets" > "Client secrets" > "New client secret"
        - Add a new secret and copy the `Value` string
    - On the client app's "Overview" page, note the value displayed for "Application (client) ID". This is the `client_id` value.
    - From the "Overview" page, open the "Endpoints" modal and make a note of the "OpenID Connect metadata document" link value. This is the `discovery_url`.
- Configure CHT to use Entra as OIDC provider:
    - In your app config directory update your `base_settings.json` or `app_settings.json` file to contain:
        ```json
            "oidc_provider": {
              "client_id": "{{your_client_id}}",
              "discovery_url": "{{your_discovery_url}}"
            },
        ```
    - Upload the config to the CHT with `cht --local compile-app-settings upload-app-settings`
- Set Client Secret in CHT instance:
    - Use the [`/api/v1/credentials` REST api](https://docs.communityhealthtoolkit.org/building/reference/api/#put-apiv1credentials) to set the client secret as the `oidc:client-secret` credential.
    ```shell
    curl -X PUT http://medic:password@localhost:5988/api/v1/credentials/oidc:client-secret \
         -H "Content-Type: text/plain" \
         --data "{{your_client_secret}}"
    ```
- Create CHT user:
    - TODO Currently UI for adding SSO user is only in `benkags:9761-sso-user-management-frontend`
        - The workaround is to just add a normal user with the proper `email` value and then update the `_users` doc for that user to include `"oidc": true` via Fauxton
    - Navigate to the CHT instance in your browser: `http://localhost:5988/` and login as the admin user
    - From the "App Management" console, go to "Users" > "Add user"
        - User name: `test` (can be any unique value)
        - Email-address: `test@test.com` (this must match the email for the Entra user)
        - Enable login Via SSO: Checked
- Logout as the Admin user.
- From the CHT login screen, select "Login with SSO"
    - Your browser will be redirected to the Microsoft login screen
    - Enter the credentials for the test user you created in Entra and accept the prompts that follow.
    - You will be redirected back to the CHT app and logged in as your CHT user
        - TODO Currently CHT login not working in branch code due to user mapping.
