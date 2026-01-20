---
title: "CouchDB Authentication"
linkTitle: "Invalidating sessions"
weight: 5
description: >
  Invalidating Sessions
relatedContent: >
  
aliases:
   - /apps/guides/database/couchdb-authentication
   - /building/guides/database/couchdb-authentication
---

### To invalidate a session in couchdb, there are two options:


1. Change the session signing certificate on the server
2. Change the password and/or salt for the user whose session should be invalidated

There are drawbacks to note with each.  Option **1** will invalidate _all_ sessions; option **2** will invalidate all sessions _for that user_, and also their password.

Because of the nature of couch's session management, there is no way to see a list of active/open sessions.  Invalidating a specific session key could be achieved by denying a cookie value in e.g. nginx or API, but this is unlikely to be of practical value.
