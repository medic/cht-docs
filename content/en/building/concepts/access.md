---
title: "Accessing CHT Apps"
linkTitle: "Access"
weight: 1
description: >
  Starting up your digital health apps
  
aliases:
   - /apps/concepts/access
---

Apps built with the Core Framework run on most modern computers with the newest versions of Google Chrome or Mozilla Firefox.

## Hardware & Software Requirements

Hardware procurement, ownership, and management is the responsibility of each implementing organization. We strongly urge all organizations to procure hardware locally to ensure ease of replacement, repair, sustainability, and hardware support when needed.


## Accessing on Desktop

On desktop devices, there is no need to download anything. Simply go to a web browser and type in your unique URL, for example:

`{{projectname}}.app.medicmobile.org`

## Accessing on Mobile

The app also runs with an app on Android phones and tablets. It works best on devices running version 5.1 or later with at least 8 GB of internal memory (16 GB for supervisors) and minimum 1 GB RAM.

### Downloading and Launching

To download your app on a mobile device, first navigate to the Google Play Store. From there, click on the search icon in the upper right, and type in the custom name of your health app or project. Make sure the app shown is the correct one and then select it. Then, click on the “Install” button to begin the download. 

Once the download is complete, you can access your app via an app icon in your applications menu. Note that the icon, as well as the app name displayed, is customizable by the organization or project.

{{< figure src="playstore.png" link="playstore.png" class="left col-3 col-lg-3" >}}

{{< figure src="search-results.png" link="search-results.png" class="left col-3 col-lg-3" >}}

{{< figure src="install.png" link="install.png" class="left col-3 col-lg-3" >}}

{{< figure src="siaya.png" link="siaya.png" class="left col-3 col-lg-3" >}}


## Login

When accessing your app for the very first time, a login page is displayed. Users enter a username and password that grant access to their customized app experience.

On mobile devices, the app generally stays logged in after initial setup so that CHW users don’t have to type in their credentials each day. 

On desktop devices, the user must login again if they close the app tab or browser window.

Users may log out by going to the options menu available in the top right corner of the app.

{{< see-also page="building/concepts/navigation" >}}

{{< figure src="login-mobile.png" link="login-mobile.png" class="left col-3 col-lg-3" >}}

{{< figure src="login-desktop.png" link="login-desktop.png" class="right col-8 col-lg-8" >}}

### Password reset on first login

**Added in 4.17.0.**

To enhance the security of CHT applications, users logging in for the first time, or who have had their password reset, are prompted to change the password provided by the system administrator to their own strong password.

{{< figure src="password-change.png" link="password-change.png" class="col-12 col-lg-12" >}}

This feature is enabled by default because it encourages best practices. However, only new users will be prompted to go through this flow or those users whose passwords have been reset by the system administration. 
Projects can disable this feature by enabling the `can_skip_password_change` permission. This permission is a [feature flag]({{< relref "building/guides/updates/feature-flags" >}}) and will be removed in a later CHT release.

Subsequent logins won’t require a password change – if the app closes before changing the password, the user will be prompted again when they reopen it. If a user is unable to update their password, they won’t be able to access the app.


## Magic Links for Logging In (Token Login)

{{< figure src="enable.token.login.gif" alt="Animated image showing the 'Enable login via SMS link' check box being clicked and 'password' and 'confirm password' fields being hidden" class="right col-6 col-lg-9" >}}

When creating users, the admin has the option to enable a user to login in by simply clicking a link sent via SMS. When the token login link is clicked and the app is not installed on the user's phone, it will open in their default browser. If no gateway is set up on the CHT server, the message may be sent via another messaging app. The link is only valid for 24 hours and can only be used once to log in. This ensures the link is used only by the intended recipient. By clicking the magic link, the user is logged into their project's instance directly, bypassing the need to manually enter a username and password.  

With token login, the password is never known by the admin or the user because the password is changed to a random string after every successful token login. If the user needs to login again, they need to contact the admin so that the admin can either send a new magic link or switch their account back to using a manual login and password.

{{< see-also page="exploring/training" >}}
{{< see-also page="building/reference/app-settings/token_login" >}}


{{< figure src="link.png" link="link.png" class="left col-3 col-lg-3" >}}

{{< figure src="open-with.png" link="open-with.png" class="left col-3 col-lg-3" >}}

{{< figure src="log-in.png" link="log-in.png" class="left col-3 col-lg-3" >}}

{{% alert title="Note" %}}
The magic link workflow will not work for users who want to use multiple devices or for multiple users on one device.
{{% /alert %}}
