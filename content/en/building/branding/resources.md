---
title: "resources/"
linkTitle: "resources/"
weight: 2
description: >
  **Graphics**: Used for custom branding, logos, and icons
keywords: icons branding
aliases:
   - /apps/reference/resources
   - /building/reference/resources
---

## Icons
Apps can be customized by defining the icons to use for tasks, targets, and contacts.

Add icons to the `resources` folder, and include them by name in the `resources.json` file as the following example:
    
```json
 {
    "icon-risk": "icon-healthcare-warning@2x.png",
    "icon-treatment": "icon-healthcare-medicine@2x.png",
    "medic-clinic": "medic-family.svg",
    "medic-district-hospital": "medic-family.svg",
    "medic-health-center": "medic-chw-area.svg",
    "medic-person": "medic-person.svg"
 }
```

{{< see-also page="design/interface" title="Interface" >}}

The folder and files structure would look like this:

```shell
./
    resources.json
    /resources
        icon-healthcare-warning@2x.png
        icon-healthcare-medicine@2x.png
        medic-family.svg
        medic-family.svg
        medic-chw-area.svg
        medic-person.svg

```
Finally run the command: `cht --local upload-resources`

## Branding

The site title, favicon, and header logo are configurable. The location to change these are in the Admin console on the images page under the branding tab.

Another way to configure these options is by using the `cht-conf`, add the favicon and the header logo in the `branding` folder, then include the options in the `branding.json` as the following example:
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

```shell
./
    branding.json
    /branding
        logo.png
        favicon.ico
```
Finally run the command: `cht --local upload-branding`

## Partner logos

Adding your partner logos can be done in the Admin console on the images page under the Partners tab. This will add partner logos on the about page. 

Another way is by using the `cht-conf`, add the partners logo in the `partners` folder, then include them in the `partners.json` as the following example:
```json
 {
   "resources": {
     "partnerA": "parnerA.png",
     "partnerB": "parnerB.png"
   }
 }
```
The folder and files structure would look like this:

```shell
./
    partners.json
    /partners
        parnerA.png
        parnerB.png
```
Finally run the command: `cht --local upload-partners`
