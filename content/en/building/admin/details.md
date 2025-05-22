---
title: "App Management Details"
linkTitle: "Details"
weight: 19
description: >
  Detailed about App Management features and configuration
---

### Available Features

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

### Admin Console vs Command Line Tools

In general, everything that can be done in the **Admin Console** can also be done in command line tools, but not everything in the command line tools can be done in the **Admin Console**.

The **Admin Console** does not track changes. For most app development, using command line tools such as cht-conf and tracking files using a version control system is recommended

**In Admin Console But Not Command Line Tools:**
- User management
- ~Upgrades~

**In Command Line Tools But Not Admin Console:**
- Most of the JSON settings
- XLS → Xform conversion
