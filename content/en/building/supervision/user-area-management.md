---
title: "User and Area Management"
linkTitle: "User and Area Management"
identifier: "User and Area Management"
weight: 3
description: >
  User account management and multi-area supervision capabilities
---

## User Management
Supervisors are able to set up users in the CHT without contacting a system administrator. They can **create** new CHW user accounts or **replace** CHWs on an existing device.

When _creating_ a new user account, Supervisors fill out the necessary details, including the CHW's phone number, from their own device. They can do this while offline, but must sync before the actual user account is created. Once the Supervisor syncs, the CHT will send an SMS to the new CHW with a [magic link](/building/login#magic-links-for-logging-in-token-login) that enables them to login and start using the app.

When _replacing_ a CHW, Supervisors access the existing device and provide details about the new CHW. The new CHW can start using the app immediately, even while offline, and will see all of the existing household data. Once the new CHW syncs, the records on the server will be updated to reflect the new CHWs details.

This can be used to manage both CHW and CHW supervisor roles.

## Managing Multiple Areas

CHT hierarchies tend to mimic geographical areas but Supervisors often manage CHWs across multiple geographical areas. (Offline) Supervisors who manage multiple areas can see data for all the different areas they manage from one app.

 > [!NOTE]
 > The ability for one user to replicate data from multiple areas was introduced in v4.9.0. A video demonstration of setting up a multi-facility user and what this looks like from a user's perspective can be found [on the forum](https://forum.communityhealthtoolkit.org/t/support-for-supervisors-who-need-to-manage-multiple-areas/3497/2?u=michael) and in the [June 2024 CHT Round-up](https://youtu.be/hrhdrzP41gE?si=_7wglk7Nm7CCSFbY&t=606).
