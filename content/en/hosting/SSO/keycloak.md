---
title: Using CHT with KeyCloak
linkTitle: KeyCloak
weight: 100
---

# UPDATES TO THIS DOCUMENT NEEDED!
* dev vs prod
* test flow to ensure they're accurate
* taken from [GH ticket](https://github.com/medic/cht-core/issues/9827#issuecomment-2845544795)

hopefully we can have one page for both dev and prd , but use tabs to call out sections that are different. Here's an example of tabbed content for command line calls:

{{< tabs items="Production,Development" >}}

{{< tab >}}
```shell
  sudo apt update && sudo apt -y dist-upgrade
  sudo apt -y install python3-pip python3-setuptools python3-wheel xsltproc
  # Use NVM to install NodeJS:
  export nvm_version=`curl -s https://api.github.com/repos/nvm-sh/nvm/releases/latest | jq -r .name`
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$nvm_version/install.sh | $SHELL
  . ~/.$(basename $SHELL)rc
  nvm install {{< param nodeVersion >}}
```
{{< /tab >}}
{{< tab >}}
```shell
  # Uses Homebrew: https://brew.sh/
  brew update
  brew install curl jq pyenv git make node@{{< param nodeVersion >}} gcc openssl readline sqlite3 xz zlib tcl-tk
  # Python no longer included by default in macOS >12.3
  pyenv install 3
  pyenv global 3
  echo "eval \"\$(pyenv init --path)\"" >> ~/.$(basename $SHELL)rc
  . ~/.$(basename $SHELL)rc
```
{{< /tab >}}

{{< /tabs >}}


## Local Keycloak Instance (for testing with local development environment)

- Run your local development CHT instance via `npm run dev-api`
    - TODO Currently requires the code in the `benkags:9765-support-oidc-flow` branch.
    - These steps are not intended to work when running the CHT from within Docker (e.g. in via `docker-helper`).
- Start the Keycloak Docker container:
    ```shell
    docker run --name keycloak -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=medic -e KC_BOOTSTRAP_ADMIN_PASSWORD=password quay.io/keycloak/keycloak start-dev
    ```
- Open Keycloak at `http://localhost:8080` in browser.
    - Login with `medic/password`
- Add new user in Keycloak:
    - Navigate to "Users" > "Add user"
    - Enter data for new user. E.g.:
        - Username - `test`
        - Email - `test@test.com`
    - Create the user and then navigate to the user's "Credentials" tab and select "Set password"
        - Set a password for the user (optionally uncheck "Temporary" so you do not have to set a new password on first login)
- Add new Client in Keycloak:
    - Navigate to "Clients" > "Create Client"
        - Client Type: `OpenID Connect`
        - Client ID: `cht-test`
        - Client authentication: `On`
        - Authentication Flow: `Standard flow`
        - Valid redirect URIs: `http://localhost:5988/medic/login/oidc/get_token`
            - TODO This path might change based on review comments...
    - Once the client is created, navigate to "Credentials" and copy the "Client Secret" value.
- Configure CHT to use Keycloak as OIDC provider:
    - In your app config directory update your `base_settings.json` or `app_settings.json` file to contain:
        ```json
            "oidc_provider": {
              "client_id": "cht-test",
              "discovery_url": "http://localhost:8080/realms/master/.well-known/openid-configuration",
              "allow_insecure_requests": true
            },
        ```
        - (Note that `allow_insecure_requests` is required when connecting to the OIDC server via `HTTP` instead of `HTTPS`. This setting should not be used in production.)
    - Upload the config to the CHT with `cht --local compile-app-settings upload-app-settings`
- Set Client Secret in CHT instance:
    - Use the [`/api/v1/credentials` REST api](https://docs.communityhealthtoolkit.org/building/reference/api/#put-apiv1credentials) to set the client secret as the `oidc:client-secret` credential.
    ```shell
    curl -X PUT http://medic:password@localhost:5988/api/v1/credentials/oidc:client-secret \
         -H "Content-Type: text/plain" \
         --data "{{client_secret_from_keycloak}}"
    ```
- Create CHT user:
    - TODO Currently UI for adding SSO user is only in `benkags:9761-sso-user-management-frontend`
        - The workaround is to just add a normal user with the proper `email` value and then update the `_users` doc for that user to include `"oidc": true` via Fauxton
    - Navigate to the CHT instance in your browser: `http://localhost:5988/` and login as the admin user
    - From the "App Management" console, go to "Users" > "Add user"
        - User name: `test` (can be any unique value)
        - Email-address: `test@test.com` (this must match the email for the Keycloak user)
        - Enable login Via SSO: Checked
- Logout as the Admin user.
- From the CHT login screen, select "Login with SSO"
    - Your browser will be redirected to the Keycloak login screen
    - Enter the username/password for your Keycloak user
    - You will be redirected back to the CHT app and logged in as your CHT user
        - TODO Currently CHT login not working in branch code due to user mapping.

### References

- [Keycloak Docker Quickstart](https://www.keycloak.org/getting-started/getting-started-docker)
- Also see https://github.com/medic/cht-core/issues/9737 for more on configuring Keycloak with SSL and Docker Compose.
