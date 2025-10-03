---
title: "Logging into CHT Apps"
linkTitle: "Logging in"
weight: 100
description: >
  Different ways to log into the CHT
aliases:
   - /apps/concepts/access
   - /building/concepts/access
relatedContent: >
  hosting/sso
  building/reference/app-settings/oidc_provider
---


When accessing your app for the very first time, a login page is displayed. Users enter a username and password that grant access to their customized app experience.

On mobile devices, the app generally stays logged in after initial setup so that CHW users don’t have to type in their credentials each day.

On desktop devices, the user must login again if they close the app tab or browser window.

Users may log out by going to the options menu available in the top right corner of the app.

{{< see-also page="/building/navigation" >}}

{{< figure src="login-desktop.png" link="login-desktop.png">}}
{{< cards >}}
{{< figure src="login-mobile.png" link="login-mobile.png" >}}
{{< /cards >}}


### Password reset on first login

**Added in 4.17.0.**

To enhance the security of CHT applications, users logging in for the first time, or who have had their password reset, are prompted to change the password provided by the system administrator to their own strong password.

{{< figure src="password-change.png" link="password-change.png" class="col-12 col-lg-12" >}}

This feature is enabled by default because it encourages best practices. However, only new users will be prompted to go through this flow or those users whose passwords have been reset by the system administration.
Projects can disable this feature by enabling the `can_skip_password_change` [permission]( {{< ref "building/reference/app-settings/user-permissions#system-defined-permissions" >}}). This permission is a [feature flag](//community/contributing/code/core/feature-flags) and will be removed in a later CHT release.

Subsequent logins won’t require a password change – if the app closes before changing the password, the user will be prompted again when they reopen it. If a user is unable to update their password, they won’t be able to access the app.


## Magic Links for Logging In (Token Login)

{{< figure src="enable.token.login.gif" alt="Animated image showing the 'Enable login via SMS link' check box being clicked and 'password' and 'confirm password' fields being hidden" class="right col-6 col-lg-9" >}}

When creating users, the admin has the option to enable a user to login in by simply clicking a link sent via SMS. When the token login link is clicked and the app is not installed on the user's phone, it will open in their default browser. If no gateway is set up on the CHT server, the message may be sent via another messaging app. The link is only valid for 24 hours and can only be used once to log in. This ensures the link is used only by the intended recipient. By clicking the magic link, the user is logged into their project's instance directly, bypassing the need to manually enter a username and password.

With token login, the password is never known by the admin or the user because the password is changed to a random string after every successful token login. If the user needs to login again, they need to contact the admin so that the admin can either send a new magic link or switch their account back to using a manual login and password.

{{< see-also page="reference-apps/training" >}}
{{< see-also page="building/reference/app-settings/token_login" >}}

{{< cards >}}
    {{< figure src="link.png" link="link.png"  >}}
    {{< figure src="open-with.png" link="open-with.png"  >}}
    {{< figure src="log-in.png" link="log-in.png" >}}
{{< /cards >}}

> [!NOTE]
> The magic link workflow will not work for users who want to use multiple devices or for multiple users on one device.

## Single Sign-On (OIDC Login)

The CHT supports Single Sign-On (SSO) via integration with an external authentication server. When [configured]({{< ref "building/reference/app-settings/oidc_provider" >}}), users can authenticate with their SSO credentials instead of needing a CHT-specific username and password.

{{< see-also page="/hosting/sso" >}}
