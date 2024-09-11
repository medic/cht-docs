---
title: ".header_tabs"
linkTitle: ".header_tabs"
weight: 5
description: >
  Configuring app header tab icons
relevantContent: >
  building/reference/resources
keywords: icons
---

## `app_settings.js .header_tabs`
As of `3.10.0`, app header tabs icons can be configured by modifying the `header_tabs` section in the app settings.
The `header_tabs` section consists of key:value pairs, where the key is the name of the tab to configure.
These values can also be changed from the Admin console, on the Images page under the "Header tabs icons" tab.

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
  }
}
```

#### Available tabs

| tab name | default [FontAwesome](https://fontawesome.com/v4.7.0/) icon |
| ---------| -------------|
| `messages` | `fa-envelope` |
| `tasks` | `fa-flag` |
| `reports` | `fa-list-alt` |
| `contacts` | `fa-user` |
| `analytics` | `fa-bar-chart-o` |

#### `app_settings.js .header_tabs.<tab_name>`

| property | type | required | description |
| -------- | ---- | -------- | ----------- |
| `icon` | string | no | [FontAwesome](https://fontawesome.com/v4.7.0/) icon name |
| `resource_icon` | string | no | [Resource icon]({{<  relref "building/reference/resources" >}}) name.

{{% alert title="Note" %}}  
Selected Resource icons take precedence over selected FontAwesome icons.  
If the selected Resource icon does not exist, the default icon will be displayed.   
If the selected FontAwesome icon does not exist, the default icon will be displayed.    
If the selected Resource icon is not an `svg` that supports css color filling, the icon will have a static color for every state (inactive, active and hovered). Colors will change only for FontAwesome icons and css fillable `svg` icons.     
The Admin console Resource icon dropdowns only supports selecting `svg` icons. If mismatched Resource Icons are selected, they will be deselected upon saving.     
Resource icons images will be sized to `24 x 24px` when displayed. 
{{% /alert %}}



