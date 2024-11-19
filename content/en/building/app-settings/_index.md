---
title: Application settings
linkTitle: Application settings
weight: 7
description: >
   Configuring and managing CHT app settings
---

## Brief Overview of Key Concepts

The settings which control CHT apps are defined in the *[app_settings.json]({{< relref "building/app-settings/app-settings-json" >}})* file, and stored in the settings doc in the database.

*[Permissions]({{< relref "building/concepts/users#permissions" >}})* are settings that control access to specific app features and functionality.

*[Roles]({{< relref "building/concepts/users#roles" >}})* define permissions for users to access a group of app features and functionality.

*[Replication]({{< relref "building/guides/performance/replication" >}})* is when users download a copy of the data on to their device. *Replication depth* refers to the number of levels within a hierarchy a specific user role is able to replicate.

*[Transitions]({{< relref "core/overview/transitions" >}})* are Javascript code that run when a document is changed. A transition can edit the changed doc or do anything server side code can do for that matter.

## Required Resources

You should have a functioning CHT instance and have cht-conf installed locally. {{< see-also page="building/local-setup" title="How to set up a CHT local configuration environment" >}}
