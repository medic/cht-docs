---
title: Single Sign-On
linkTitle: SSO
weight: 200
description: Setting up an single sign on with the CHT
---

{{< callout >}}
Introduced in 4.20.0
{{< /callout >}}
 
The CHT supports Single Sign-On (SSO) via integration with an external authentication server. Users connecting to a CHT instance authenticate with their SSO credentials instead of needing a CHT-specifc username and password.
 
SSO authentication is implemented with the industry standard [OpenID Connect](https://openid.net/) (OIDC) protocol. Any OIDC-compliant authentication server can be integrated the the CHT. For example:

- [Keycloak](https://www.keycloak.org/) - Free and open-source, self-hostable identity and access managment server
- [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra) - Paid, cloud-based identity and access management service.

![sso-login-flow.svg](sso-login-flow.svg)

{{< cards >}}
  {{< card link="keycloak" title="KeyCloak" subtitle="Authenticating with KeyCloak" icon="key" >}}
  {{< card link="entra" title="Microsoft Entra" subtitle="Authenticating with Entra" icon="lock-open" >}}
  {{< card link="technical" title="Technical Reference" subtitle="Sequence diagrams and more" icon="terminal" >}}
{{< /cards >}}
