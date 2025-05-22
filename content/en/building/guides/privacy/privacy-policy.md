---
title: "Adding Privacy Policies to Apps"
linkTitle: "Adding Policies"
weight: 100
aliases:
  -    /apps/guides/security/
  - /apps/guides/privacy/privacy-policy/
description: >
  Guide for adding privacy policies that users must accept before being allowed to use the app
---

As of `3.10.0`, privacy policies can be customized for every language, by adding desired content into HTML files.

Privacy policies are now publicly accessible rather than only being available after logging in. This means it can be shared with third parties, for example, app store compliance. If your instance URL is `https://my-health-facility.org`, then the privacy policy is available at `https://my-health-facility.org/medic/privacy-policy`. _Added in 3.17.0_.

{{< figure src="privacy.policy.login.page.png" link="privacy.policy.login.page.png" caption="Privacy Policy on login page" >}}

Add these HTML files to the `privacy-policies` folder in your configuration. The `privacy-policies.json` file, which associates the HTML files with the correct language, should reside in the root of the project directory, not inside the `privacy_policies` folder.

```json
{
  "en": "en.attachment.html",
  "fr": "fr.file.html",
  "sw": "swahili.html"
}
```

### Adding and Editing a Privacy Policy

There are two ways to add or edit a privacy policy:

1. Build the privacy policies into the application with the `upload-privacy-policies` action in `cht-conf`.
```bash
cht --local upload-privacy-policies
```

2. Update and view privacy policies in the [Admin Console]({{< relref "building/admin" >}}), under `Display` > `Privacy Policies`

> [!NOTE]
> - Use language codes when associating HTML files to languages
> - Files that are not in HTML format will be skipped
> - Files that are not associated with a language will not be uploaded
> - Before being displayed to users, privacy policies HTML is [sanitized](https://docs.angularjs.org/api/ngSanitize/service/$sanitize), which strips all unsafe elements and attributes. The admin console has a previewing feature that will display your privacy policy contents after being sanitized.
> - When displayed to users, privacy policy HTML will be styled by webapp CSS.


### View In Webapp

When a privacy policy is configured for a language, users who load the app in this language are prompted to accept the policy.

If our `en.attachment.html` file looked like this:

```html
  <html><body>

    <h1>Lorem Ipsum: Privacy & Data Protection Policy</h1>

    <h2>The standard Lorem Ipsum passage, used since the 1500s</h2>

    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
    </p>
  </body></html>
```

Then visitors of the privacy policy would see:

{{< figure src="accept-mobile.png" link="accept-mobile.png" caption="Accept privacy policy" >}}

The app will load normally after acceptance. The user cannot opt out or skip acceptance, meaning, if a privacy policy is configured, the app will be unusable until the user has accepted it. Once accepted, users will not be prompted to accept the same policy again. However, users will be prompted for acceptance again when the policy is updated or when they change their language. An acceptance log is saved in the `user-settings` file and synced to the server, containing a history of privacy policies accepted by the user.

