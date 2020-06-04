---
title: "resources"
linkTitle: "resources"
weight: 2
description: >
  **Graphics**: Used for custom branding, logos, and icons
keywords: icons branding
---

## Icons
Apps can be customized by defining the icons to use for tasks, targets, and contacts.

Add icons to the `resources` folder, and include them by name in the resources.json file. 

    {
        "icon-risk": "icon-healthcare-warning@2x.png",
        "icon-treatment": "icon-healthcare-medicine@2x.png",
        "medic-clinic": "medic-family.svg",
        "medic-district-hospital": "medic-health-center.svg",
        "medic-health-center": "medic-chw-area.svg",
        "medic-person": "medic-person.svg"
    }

{{% see-also page="design/icons" title="Icon Library" %}}

### Build  
Build the icons into the application with the `upload-resources` action in `medic-conf`.

`medic-conf --local upload-resources`

## Branding

The site title, favicon, and header logo are configurable. The location to change these are in the Admin console on the images page under the branding tab. 

## Partner logos

Adding your partner logos can be done in the Admin console on the images page under the Partners tab. This will add partner logos on the about page. 
