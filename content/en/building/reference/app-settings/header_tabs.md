---
title: ".header_tabs"
linkTitle: ".header_tabs"
weight: 5
description: >
  Configuring app header tab icons
relevantContent: >
  building/branding/resources
keywords: icons
aliases:
   - /apps/reference/app-settings/header_tabs
---

## `app_settings.js .header_tabs`
As of `3.10.0`, app header tabs can be configured by modifying the `header_tabs` section in the app settings.
The `header_tabs` section consists of key:value pairs, where the key is the name of the tab to configure.
These values can also be changed from the Admin console, on the Images page under the "Header tabs icons" tab.

As of `5.2.0`, the ordering of the app header tabs can be customized by setting the `weight` property. Tabs with a lower weight value will be displayed first (higher on the bar). The tab with the lowest `weight` will be the one loaded when the user first opens the app.

```json
{
  "messages": {
    "icon": "fa-user",
    "weight": 42
  },
  "tasks": {
    "resource_icon": "medic-health-center"
  },
  "analytics": {
    "icon": "fa-flag",
    "resource_icon": "icon-treatment",
    "weight": 0.5
  }
}
```

#### Available tabs

| tab name    | default [FontAwesome](https://fontawesome.com/v4.7.0/) icon | Default Weight |
|-------------|-------------------------------------------------------------|----------------|
| `messages`  | `fa-envelope`                                               | 1              |
| `tasks`     | `fa-flag`                                                   | 2              |
| `reports`   | `fa-list-alt`                                               | 3              |
| `contacts`  | `fa-user`                                                   | 4              |
| `analytics` | `fa-bar-chart-o`                                            | 5              |

#### `app_settings.js .header_tabs.<tab_name>`

| property        | type   | required | description                                                                                           |
|-----------------|--------|----------|-------------------------------------------------------------------------------------------------------|
| `icon`          | string | no       | [FontAwesome](https://fontawesome.com/v4.7.0/) icon name                                              |
| `resource_icon` | string | no       | [Resource icon](/building/branding/resources) name.                                                   |
| `weight`        | number | no       | Added in `5.2.0`. The numerical "weight" used to determine the tab ordering. Lower values come first. |

> [!NOTE]
> Selected Resource icons take precedence over selected FontAwesome icons.  
> If the selected Resource icon does not exist, the default icon will be displayed.   
> If the selected FontAwesome icon does not exist, the default icon will be displayed.    
> If the selected Resource icon is not an `svg` that supports css color filling, the icon will have a static color for every state (inactive, active and hovered). Colors will change only for > FontAwesome icons and css fillable `svg` icons.     
> The Admin console Resource icon dropdowns only supports selecting `svg` icons. If mismatched Resource Icons are selected, they will be deselected upon saving.     
> Resource icons images will be sized to `24 x 24px` when displayed. 
