---
title: "Offline-First in the CHT"
linkTitle: "Offline-First"
weight: 6
description: >
  Overview of Offline-First in the context of the CHT
aliases:
   - /core/overview/offline-first/
   - /technical-overview/offline-first/
---

CHT applications are designed to be used equally well in areas with no internet connectivity, slow or unreliable internet connectivity, and good internet connectivity. Achieving reliable performance and powerful features requires diligence and strict adherence to the principles of Offline-First development.

In this page we'll cover why and how we achieve this in the CHT.

## Why this is important

The CHT is designed to improve healthcare in the hardest to reach communities. While some users have a strong internet connection, to be as inclusive as possible we optimise for Care Teams with connections that are intermittent, unreliable, expensive, and low bandwidth. To achieve this the CHT is designed to be offline first, which, as the name suggests, means the application never relies on an internet connection for day to day tasks.

Caveat: a small set of use cases require a decent internet connection, but these are limited to:
- Logging in
- Initial download of the application and data
- Changing your own password
- Most administrative tasks such as creating new users
- Data analytics over large data sets

## Requirements

### Code

The CHT uses a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) to store the code needed to start up and run which is best practice for caching web applications. The CHT Core Framework code is downloaded when the user visits the login page for the first time and completes silently in the background while the user logs in.

The code includes JavaScript, CSS, HTML, fonts, and images. It doesn't contain any private information so it's safe to download and cache it without authentication. It also doesn't contain deployment specific configuration (covered in detail [below](#data)).

The CHT Core Framework checks for updates to the code by attempting to connect to the server in the background. The user isn't notified if this check fails or times out, so they can continue to complete workflows without interruption. When an update is found the new code is downloaded and the service worker cache is updated. The user is prompted to reload to start using the new version of the application, but this can be dismissed if they are busy with a patient or don't want to lose their progress if they are midway through an action like creating a contact or completing a form. Either way, the update will be automatically applied the next time the application starts up.

### Data

Once the application has started up it needs data to be useful. This data falls into two categories:

- **Configuration** specific to a single deployment such as forms, task definitions, places, and hierarchies.
- **Patient data** such as personal details, information about visits, reports, tasks, and messages.

Both of these types of data are cached on the device because they are required for the user to do their job. The CHT Core Framework uses [PouchDB](https://pouchdb.com/) to store the data on the device's disk. Once cached, when the application starts up the code is executed, which reads the data, allowing the user to do their job regardless of the quality of their internet connection.

If the user creates new patient data by registering a family or completing a task the application stores this in the phone's cache and attempts to submit this to the server. Periodically the application checks to see if there is new data on the server that is relevant to the user and if so, it updates the cache. This process of sending and receiving data updates is called [replication](/technical-overview/data/performance/replication), and is performed without interrupting the user from their work.

## FAQs from CHT contributors

{{% details title="Q: Should I rely on request failure handling?" %}}

A: No. This only works well when the user has a strong connection, or if the user is completely offline and the request fails immediately. It's impossible to know for sure how long the request will take, so users with poor connectivity may end up waiting forever. If this request is essential to doing their job they will be unable to move on. It is important to handle request failures gracefully, but it doesn't make a request offline first.

{{% /details %}}

{{% details title="Q: Should I rely on a request timeout?" %}}

A: No. This attempts to mitigate the problem by unblocking the user eventually. The problem is setting the timeout length correctly - if it's too short then the request won't succeed, but if it's too long the user will be required to wait. Experience suggests the timeout for a simple request would have to be around a minute to allow the request to succeed for most users, but a minute is far too long to expect a user to wait. Almost all requests should have a timeout, but that is not sufficient to make a request offline first.

{{% /details %}}

{{% details title="Q: Should I rely on a spinner or loading bar?" %}}

A: No. Much like the timeout solution, this is an attempt to mitigate the problem in this case by giving the user more information about the request. Regardless of the UX, blocking user interaction while waiting for a response is not offline first and therefore not appropriate for the CHT. Showing UX elements when loading is still recommended for local requests, user initiated server requests, and other potentially slow operations.

{{% /details %}}

{{% details title="Q: How can I check if the user is authenticated?" %}}

A: It is not possible to know for certain if a user has an active session without getting a response from the server. The CHT caches some data to hint at whether the session is still active, for example the session expiry date. However, the only way to be certain is to connect to the server, which is not offline first. This has been implemented in the CHT by checking the status code on background requests such as replication, and instructing the user to login when necessary.

{{% /details %}}

{{% details title="Q: Should I rely on APIs which report device connection status?" %}}

A: No. There are [APIs available](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) which report whether the device is online with reasonable reliability. Unfortunately these APIs don't reliably report whether the connection is slow, whether the connection will be held until the request completes, or whether the CHT server is available. This means that even if the browser API reports that the device is online the code will still make a request that may fail or wait indefinitely for a response. These APIs can be useful but must be used in conjunction with Offline-First principles, for example, the CHT uses the "online" event listener as a prompt to attempt replication in the background.

{{% /details %}}

{{% details title="Q: Should I add a feature that requires a connection?" %}}

A: Maybe. There are some things that cannot be done offline first because they either require server interaction (eg: authentication during login) or they need to access data that cannot be cached locally (eg: deployment-wide analytics). Every effort should be made to find a way to implement the feature using Offline-First principles, and trade-offs discussed with senior CHT contributors. If the feature truly needs to be online first then the UX needs to be designed so that the user understands the feature requires an internet connection.

{{% /details %}}

## Further reading

- [Designing Offline-First Web Apps](https://alistapart.com/article/offline-first/) by A List Apart
- [A Design Guide for Building Offline First Apps](https://hasura.io/blog/design-guide-to-offline-first-apps/) by Hasura
- [CouchDB takes CHT to the front lines of healthcare work](https://blog.couchdb.org/2017/09/19/couchdb-takes-medic-mobile-to-the-front-lines-of-healthcare-work/) by CouchDB
