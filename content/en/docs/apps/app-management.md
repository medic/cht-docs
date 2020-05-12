---
date: 2016-04-09T16:50:16+02:00
title: App Management
weight: 9
description: >
  An interface for non-technical administrative users to manage users and settings
---

App Management is an interface for non-technical administrative users. With it they can manage users and make minor changes to the app, such as setting the SMS gateway phone number, and changing the default language for the app.

The App Management pages are a desktop-only interface meant for users with a reliable internet connection.

## Page Tabs

These sections of the App can be configured from within the Admin Console:

- **Settings**: Change basic settings like gateway phone number & country code
- **Languages**: Set default app language, update translations
- **Forms**: Upload XML and JSON forms
- **Import & Export**: Import and export settings
- **Upgrade Instance**: Install a newer app version
- **Users**: View and edit users of the system
- **Icons**: View and edit icons used in the app
- **Targets**: Modify performance or activity targets
- **Roles & Permissions**: Fine tuned control of user roles and permissions

## App Management vs medic-conf

In general, everything that can be done in the Admin Console can also be done in command line tools, but not everything in the command line tools can be done in the Admin Console. 

The Admin Console does not track changes. For most app development, we recommend using command line tools such as medic-conf and tracking files using a version control system.

**In Admin Console But Not Command Line Tools:**
- User management
- ~Upgrades~

**In Command Line Tools But Not Admin Console:**
- Most of the JSON settings
- XLS → Xform conversion
