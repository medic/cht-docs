---
title: "Navigating CHT Apps"
linkTitle: "Navigation"
weight: 2
description: >
  Browsing your digital health apps
---

## Summary of Page Tabs

Page tabs are the primary way to navigate apps built with the Core Framework. The number of tabs is variable depending on the user’s role and place in the hierarchy. For example, non-admin users don’t have Messages. The Reports tab is accessible to CHWs but often located inside the secondary menu drawer.

{{< figure src="tabs.gif" link="tabs.gif" class="left col-12 col-lg-7" >}}

<br><br><br><br>

- **Messages​**: A place for community-based staff to send and exchange messages
- **Tasks​**: This is a list of upcoming visits, follow-ups, or other required tasks
- **Reports​**: A detailed history of all forms submitted by CHWs and other staff
- **People​**: This is where profiles of districts, staff, CHWs and patients live
- **Targets**: Displays real-time visualizations of key activity and impact indicators


## The Menu Drawer

{{< figure src="menu.png" link="menu.png" class="right col-6 col-lg-4" >}}

Tap the menu icon in the upper right corner of the header to access other pages, edit personal settings, view sync status and more.
- **Admin Console**: Change advanced app settings (only admin users will see this)
- **About**: View your app version and other detailed database information 
- **User Settings**: Update basic user information like email, phone number, and password
- **Report Bug**: Let us know if something isn’t working or you encounter errors
- **Log Out**: Sign out of the app

### Sync Status

{{< figure src="sync-status.png" link="sync-status.png" class="right col-6 col-lg-4" >}}

Data synchronization is important for [offline users]({{< relref "apps/concepts/users" >}}). These users keep a copy of the data they have access to on their device. They can work from their device while disconnected from the internet (offline), by reading from and writing to their copy of the data. “Sync” (synchronization) is when data on the device is made to match the data on the server and requires an internet connection. The CHT app monitors the online status and attempts sync accordingly.

#### Replication Types

Synchronization consists of upward replication and downward replication. 
- **Upward Replication**: Uploading all new or updated data from the device to the server. It includes a retry mechanism for handling larger data batches, ensuring a robust and reliable upload process.
- **Downward Replication**: Downloading new or updated data from the server to the device. Downward replication may include the download of software updates to the CHT app when available.

The CHT application manages data synchronization across two types of databases: the main application database and a meta database.

- **Main Application Database (`medic`)**: The main database that stores the primary data used by the application. It includes contacts, reports, messages, and other critical documents necessary for the core functionality of the application. This database is synchronized continuously to reflect changes to the application, such as new contact creations. Each user stores a subset of the main database which includes only the documents they're allowed to view.
- **User-Metadata Database(`medic-user-{username}-meta`)**: Each user has a dedicated database that stores operational metadata, including [telemetry data]({{< relref "apps/guides/performance/telemetry" >}}) and error messages. Synchronization occurs at predefined intervals to ensure up-to-date monitoring and analysis.

The CHT application has two different Sync Intervals: 
- **Regular Sync**: Occurs every 5 minutes. It replicates application data, including user-generated content and any changes to existing documents.
- **Metadata Sync**: Occurs every 30 minutes, focusing on operational metadata rather than user-generated content. This ensures that telemetry data and system logs are regularly synchronized, providing insights into system performance and user activities


#### Sync Status Notification

At the bottom of the menu is a notification which provides important information about data synchronization.

If the sync status is green and says “All reports synced,” this means you have successfully uploaded the most recent data on your device to the server. It also means that you downloaded the latest data from the server as of the time displayed. Note that there could be more recent data changes on the server, and it doesn't guarantee you are up to date.

If the indicator is red, it means you have data changes waiting to be uploaded to the server. You should check your internet and data connection to ensure a successful sync.

<aside class="right col-6 col-lg-4">
{{< figure src="sync-inprogress.jpg" link="sync-inprogress.jpg" >}}
{{< figure src="sync-failure.jpg" link="sync-failure.jpg" >}}
{{< figure src="sync-successful.jpg" link="sync-successful.jpg" >}}
</aside>

Triggering a manual sync by clicking the "Sync now" button will provide feedback at every step of the process through a snackbar appearing on the bottom side of the screen.  
It will also allow to retry the sync process in case of failure.

The user-initiated sync process initatied by clicking the "Sync now" buttoninvolves uploading local changes to the server and downloading updates from the server to the local database. It syncs both the main database and the metadata database to ensure that both user data and application metadata are up-to-date.

#### Synchronization Triggers
- **On Login**: Synchronization is automatically initiated upon successful user login if the app is connected to the internet. The CHT app checks for changes since the last known sequence, identifying document revisions that differ from the ones on the server, and sending or receiving bulk document updates.
- **Manual**: Clicking the "Sync now" button.
- **Periodic Sync**: The application performs regular checks and attempts to synchronize. For the main database this happens every 5 minutes, and for the meta database every 30 minutes.
- **On Reload**: Synchronization is automatically initiated when the user reloads the application, refreshes the page, or clicks the reload button in the "Update available" modal.
- **On Connect**: The app also detects when an internet connection becomes available and attempts to sync immediately.

#### Sync Status States
The synchronization process can be in one of the following states:

- **Unknown**: The sync status is not determined yet.
- **Disabled**: Sync is disabled - only applies to online-only users.
- **InProgress**: Synchronization is currently ongoing.
- **Success**: The last sync operation was successful.
- **Required**: There is data pending synchronization.


#### Data Synchronization Retry Mechanism 

The CHT app has a retry mechanism to handle replication failures, particularly due to forbidden documents and challenging network environments with restricted data access. CHT core is configured to attempt replication retry up to a maximum of 3 times for each document.

