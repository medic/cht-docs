---
title: "Adding Privacy Policies to CHT Apps"
linkTitle: "Adding Privacy Policies"
weight: 100
aliases:
  -    /apps/guides/security/
description: >
  Guide for adding privacy policies that users must accept before being allowed to use the app
---

As of `3.10.0`, privacy policies can be customized for every language, by adding desired content into HTML files. 
Add these HTML files to the `privacy-policies` folder in your configuration, and associate them to the correct language in the `privacy-policies.json` file.
```json
{
  "en": "en.attachment.html",
  "fr": "fr.file.html",
  "sw": "swahili.html"
}
```

### Adding and Editing a Privacy Policy

There are two ways to add or edit a privacy policy:
 
1. Build the privacy policies into the application with the `upload-privacy-policies` action in `medic-conf`.
```bash
medic-conf --local upload-privacy-policies
```

2. Update and view privacy policies in the [Admin Console]({{< relref "apps/features/admin" >}}), under `Display` > `Privacy Policies`

{{< alert title="Note" >}}
- Use language codes when associating HTML files to languages  
- Files that are not in HTML format will be skipped  
- Files that are not associated with a language will not be uploaded
- Before being displayed to users, privacy policies HTML is [sanitized](https://docs.angularjs.org/api/ngSanitize/service/$sanitize), which strips all unsafe elements and attributes. The admin console has a previewing feature that will display your privacy policy contents after being sanitized.
- When displayed to users, privacy policy HTML will be styled by webapp CSS.      
{{< /alert >}}


### View In Webapp

When a privacy policy is configured for a language, users who load the app in this language are prompted to accept the policy. 

![Accept privacy policy](accept-mobile.png)

The app will load normally after acceptance. The user cannot opt out or skip acceptance, meaning, if a privacy policy is configured, the app will be unusable until the user has accepted it. Once accepted, users will not be prompted to accept the same policy again. However, users will be prompted for acceptance again when the policy is updated or when they change their language. An acceptance log is saved in the `user-settings` file and synced to the server, containing a history of privacy policies accepted by the user.        


