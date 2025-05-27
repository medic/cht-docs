---
title: Single Sign-On
linkTitle: SSO
weight: 200
description: Setting up an single sign on with the CHT
---

{{< callout >}}
Introduced in 4.20.0
{{< /callout >}}

## Overview

The CHT supports Single Sign-On (SSO) via integration with an external authentication server. Users connecting to a CHT instance authenticate with their SSO credentials instead of needing a CHT-specifc username and password.
 
SSO authentication is implemented with the industry standard [OpenID Connect](https://openid.net/) (OIDC) protocol. Any OIDC-compliant authentication server can be integrated the the CHT. For example:

- [Keycloak](https://www.keycloak.org/) - Free and open-source, self-hostable identity and access management server
- [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra) - Paid, cloud-based identity and access management service.

![sso-login-flow.svg](sso-login-flow.svg)

## Quick Start

1. Create an OIDC Provider client with the redirect URL of `https://<CHT_URL>/medic/login/oidc`. Grab the secret for step 3 below. Be sure to replace `CHT_URL` with your real URL.
2. Add the OIDC URL and CHT App URL to the app settings and upload it with CHT Conf to your CHT instance. Be sure to replace `KEYCLOAK_URL` and `CHT_URL` with your real URLs:

    ```yaml
    "oidc_provider": {
      "client_id": "CHT",
      "discovery_url": "https://<KEYCLOAK_URL>/realms/master/.well-known/openid-configuration"
    },
    "app_url": "https://<CHT_URL>/"
    ```
3. Upload the secret from step 1 to the CHT. Be sure to replace `CHT_URL` , `USER`,  `PASSWORD` and `SECRET` with the correct values: `curl -X PUT https://<USER>:<PASSWORD>@<CHT_URL>/api/v1/credentials/oidc:client-secret -H "Content-Type: text/plain" --data "<SECRET>"`
4. Ensure CHT users have their "SSO Email Address" match the OIDC provider's account 
5. Use the "Login with SSO" button 

## Detailed guides 

For more detailed guides and requirements, see the following documents:

{{< cards >}}
  {{< card link="keycloak" title="KeyCloak" subtitle="Authenticating with KeyCloak" icon="key" >}}
  {{< card link="entra" title="Microsoft Entra" subtitle="Authenticating with Entra" icon="lock-open" >}}
  {{< card link="technical" title="Technical Reference" subtitle="Sequence diagrams and more" icon="terminal" >}}
{{< /cards >}}
