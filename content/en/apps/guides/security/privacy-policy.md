---
title: "App Privacy Policies"
linkTitle: "Privacy Policies"
weight: 100
description: >
  Add privacy policies that users must accept before being allowed to use the app
---

As of `3.10.0`, privacy policies can be customized for every language, by adding desired content into HTML files. 
Add these HTML files to the `privacy-policies` folder in your configuration, and associate them to the correct language in the `privacy-policies.json` file.
```json
{
  "en": "en.attachment.html",
  "fr": "fr.file.html",
  "sw": "swahili.html",
   ...
}
```

{{< alert title="Note" >}}
- Use language codes when associating HTML files to languages  
- Files that are not in HTML format will be skipped  
- Files that are not associated with a language will not be uploaded  
{{< /alert >}}

### Build  
Build the privacy policies into the application with the `upload-privacy-policies` action in `medic-conf`.

`medic-conf --local upload-resources`


### Update in the admin console

Privacy policies can also be viewed and edited in the [Admin Console]({{ < relref "apps/features/admin" >}}), under `Display` > `Privacy Policies`

### View In Webapp

When a privacy policy is configured for a language, users who load the app in this language are prompted to accept the policy. 

![Accept privacy policy](accept-mobile.jpg)

The app will load normally after acceptance. 
To opt out, a user has to close their app or browser.  
Once accepted, users will not be prompted to accept the same policy again. However, users will be prompted for acceptance again when the policy is updated or when they change their language.  
An acceptance log is saved in the user-settings file and synced to the server, containing a history of privacy policies accepted by the user.    


