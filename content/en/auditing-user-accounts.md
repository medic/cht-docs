---
title: "Auditing User Accounts"
description: "Learn how to audit user activities such as logins, syncs, password changes, and more in the CHT."
weight: 100
---

# Auditing User Accounts

This guide provides instructions on how to audit user activity within the Community Health Toolkit (CHT). These steps can help administrators and implementers track security-related events and user behaviors in deployments.

---

## 1. List of Users

You can view a list of users in the **CHT Admin Console**:

- Navigate to the **Users** section.
- You'll see all registered users, their usernames, assigned roles, and statuses (active/inactive).
- For advanced access, query the CouchDB `_users` database directly using a tool like Fauxton or cURL.

---

## 2. Logins by Date

By default, the CHT does **not** track exact login timestamps for users. However, login activity can often be inferred through other means:

- Monitor session creation logs (if reverse proxy or server logs are enabled).
- Observe sync events triggered upon login in the CouchDB `_changes` feed.
- Use analytics tools (e.g., Google Analytics or Matomo) if integrated into your CHT frontend.

> *Note:* There is no native login history table, so custom logging solutions may be required for detailed tracking.

---

## 3. Syncs by Date

Sync events occur when users upload form data or fetch new data from the server.

- Sync activity can be observed in the CouchDB `_changes` feed.
- You can inspect the `updated_by` or `modified` fields on documents for timestamps.
- In more advanced setups, some implementers use monitoring dashboards (e.g., **Grafana** with **Prometheus**) to visualize sync frequency and volume.

---

## 4. User Creation

- When a user is created, a new document is inserted into the `_users` database in CouchDB.
- You can track this using the `_changes` endpoint of `_users`, which shows creation events and document revision history.

---

## 5. User Deletion

- Deleted users also appear in the `_changes` feed from the `_users` database.
- A `"deleted": true` flag is present in the feed to indicate removal.
- CouchDB does not natively track **who** deleted the user. If this level of detail is required, enable request logging in your reverse proxy (e.g., NGINX) or wrap your user deletion process with an audit trail.

---

## 6. User Password Change

- Password changes result in a new revision of the user document in the `_users` DB.
- However, these changes are not labeled specifically as password updates.
- You may detect password changes by monitoring `_rev` updates or implementing external server-side logging.

> *Note:* Passwords are always stored in a hashed format and should not be exposed.

---

## 7. User Role Change (Permissions)

- User roles are stored in the `roles` array within the user document in the `_users` database.
- Changes to roles are not logged by default. You can implement your own version tracking or diffing mechanism:
  - Export and snapshot user documents periodically.
  - Compare role values over time to detect changes.

---

## Best Practices

- **Enable and monitor server logs** for all user-related actions including account creation, updates, and deletions.
- Consider adding external logging tools (such as NGINX access logs) to track changes made via the Admin Console or API.
- Use monitoring tools like [Grafana](https://grafana.com/) or [Kibana](https://www.elastic.co/kibana/) when working with large deployments.
- **Regularly export `_users` documents** for version comparison and rollback planning.

---

> This documentation is intended for administrators and technical implementers responsible for managing security and user access in CHT deployments.
