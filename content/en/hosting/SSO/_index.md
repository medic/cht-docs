---
title: Single Sign On
linkTitle: SSO
weight: 50
---

{{< hextra/hero-subtitle >}}****
  Setting up an single sign on**** with the CHT
{{< /hextra/hero-subtitle >}}

CHT version 4.2.0 introduces support for single sign on (SSO).  This enables deployments to authenticate users outside of the CHT.  While the feature was extensively tested with the free and open source [KeyCloak](https://www.keycloak.org/) and the commercial [Microsoft Entra](https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra) providers, it should work with any [OpenID Connect](https://openid.net/) (OIDC) compliant identity provider.

{{< cards >}}
  {{< card link="keycloak" title="KeyCloak" subtitle="Authenticating with KeyCloak" icon="key" >}}
  {{< card link="entra" title="Microsoft Entra" subtitle="Authenticating with Entra" icon="lock-open" >}}
  {{< card link="technical" title="Technical Reference" subtitle="Sequence diagrams and more" icon="terminal" >}}
{{< /cards >}}
