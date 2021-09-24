---
title: "Configuring Branding"
linkTitle: Branding
weight: 9
description: >
  Configuring CHT branding
relatedContent: >
  apps/features/admin
  design/icons

---

{{% pageinfo %}}
This tutorial will take you through customising some graphical elements of CHT core.

We will site branding, partner logos, header tab icons, and app icons (used in tasks, targets and contacts)

{{% /pageinfo %}}

## Required Resources

You should have a functioning [CHT instance with `cht-conf` installed locally]({{< ref "apps/tutorials/local-setup" >}}), completed a [project folder]({{< ref "apps/tutorials/local-setup#3-create-and-upload-a-blank-project" >}}) setup, and [any form]({{< ref "apps/tutorials/app-forms" >}}).

## Implementation Steps

### 1. Site branding
We have the ability to modify the app title, logo and favicon.

{{< figure src="branding/branding_elements.png" link="branding/menu.png" class="center col-6 col-lg-8" >}}

#### using cht-conf

Create a `branding.json` file if it doesn't exist. (This may have already been created by the initialise-project-layout command.)
Edit the file with the following content:

```json
 {
   "title": "My Clinic",
   "resources": {
     "logo": "logo.png",
     "favicon": "favicon.ico"
   }
 }
 ```

The folder and files structure would look like this:

```
./
    branding.json
    /branding
        logo.png
        favicon.ico
```

Finally run the command: `cht --url=<intance-url> upload-branding`

#### using the admin interface

Log in to your instance and navigate to `App Settings > Images > Icons`

{{< figure src="branding/menu.png" link="branding/menu.png" class="left col-6 col-lg-8" >}}
{{< figure src="branding/images.png" link="branding/images.png" class="right col-6 col-lg-8" >}}