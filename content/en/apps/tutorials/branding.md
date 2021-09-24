---
title: "Configuring Branding"
linkTitle: Branding
weight: 14
description: >
  Configuring CHT branding
relatedContent: >
  apps/features/admin
  design/icons

---

{{% pageinfo %}}
This tutorial will take you through customising some graphical elements of CHT core.

We will cover site branding, partner logos, header tab icons, and app icons (used in tasks, targets and contacts)

{{% /pageinfo %}}

## Required Resources

You should have a functioning [CHT instance with `cht-conf` installed locally]({{< ref "apps/tutorials/local-setup" >}}) and completed a [project folder]({{< ref "apps/tutorials/local-setup#3-create-and-upload-a-blank-project" >}}) setup.

## Implementation Steps

### 1. Site branding
We have the ability to modify the app title, logo and favicon.

{{< figure src="branding_elements.png" link="branding_elements.png" class="center col-6 col-lg-8" >}}

#### Using cht-conf

Create a `branding.json` file if it doesn't exist. (This may have already been created by the initialise-project-layout command).
Edit the file with the following content:

```json
 {
   "title": "My App Name",
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

#### Using the admin interface

Log in to your instance and navigate to `Menu > App Settings > Images > Icons`

![](menu.png)
![](images.png)

{{% alert title="Note" %}} 

If your changes are not reflected on the browser, you will have to clear browser data to get rid of the already cached resources.

Images used for the logo should be less than 100KB, transparent, have a high contrast, and horizonal in shape with ratio of about 3.5:1. We recommend SVG or PNG as an alternative image format.

{{% /alert %}}

### 2. Partner logos

 If you would like to display a collection of logos representing all of the organizations and funders involved in a project, we have created a new space for these at the bottom of the About page which can be reached through `Menu > About`.

 {{< figure src="about_page.png" link="about_page.png" class="center col-6 col-lg-8" >}}

 #### Using cht-conf

Create a `branding.json` file if it doesn't exist. (This may have already been created by the initialise-project-layout command).
Edit the file with the following content:

```json
{
   "resources": {
     "partnerA": "parnerA.png",
     "partnerB": "parnerB.png",
     "partnerC": "parnerC.png"
   }
 }
 ```

 The folder and files structure would look like this:

```
./
    partners.json
    /partners
        parnerA.png
        parnerB.png
```

Finally run the command: `cht --url=<intance-url> upload-partners`

#### Using the admin interface

Log in to your instance and navigate to `Menu > App Settings > Images > Partners`

![](menu.png)
![](partners.png)

### 3. Header tab icons

As of cht-core 3.10, app header tabs icons are configurable. CHT currently has five tabs: messages, tasks, reports, contacts, analytics.

{{< see-also page="apps/reference/app-settings/header_tabs" title="Header tabs" >}}


#### Using cht-conf

Create a `app_settings.json` file if it doesn't exist. (This may have already been created by the initialise-project-layout command).

We will then add a `header_tabs` key within app_settings with the following structure:

```json
{
  "messages": {
    "icon": "fa-user"
  },
  "tasks": {
    "resource_icon": "medic-health-center"
  },
  "analytics": {
    "icon": "fa-flag",
    "resource_icon": "icon-treatment"
  },
  "reports": {
    "icon": "fa-list-alt"
  },
  "contacts": {
    "icon": "fa-user"
  }
}
```

The above assumes you have the following resource icons already in your instance (either uploaded or out-of-the-box): `medic-health-center`, `icon-treatment`. 

{{< see-also page="apps/reference/resources" title="Icons" >}} 

#### Using the admin interface

Log in to your instance and navigate to `Menu > App Settings > Images > Header Icons`

![](menu.png)
![](header_icons.png)