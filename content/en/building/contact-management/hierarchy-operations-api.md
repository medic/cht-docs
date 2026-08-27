---
title: "Managing Contact Hierarchies with the API"
linkTitle: "Hierarchy Operations API"
weight: 5
description: >
  Deleting and moving contacts and their subtrees through the REST API
relatedContent: >
  building/contact-management/moving-contacts
  building/reference/api
  building/reference/app-settings/user-permissions
  building/reference/app-settings/hierarchy
---

{{< callout type="info" >}}
Added in 5.3.0.
{{< /callout >}}

Removing or reparenting a contact means changing every document beneath it. The clinics, the
households, the people, and the reports recorded for all of them. Until 5.3.0 the only way to do that
was [`cht-conf`](/building/contact-management/moving-contacts) run from an administrator's machine,
which meant the person who noticed the problem usually could not fix it, and no other software could
perform the operation at all.

These endpoints do the same work on the server, so a program manager can trigger it from a tool rather
than a terminal.

## The asynchronous model

Deleting a district can touch tens of thousands of documents. A single HTTP request cannot do that
much work without timing out and leaving the hierarchy half changed, so **these endpoints do not
perform the work themselves**. Each request validates what you asked for, writes down a job, and
returns immediately with a job id. Sentinel then applies the changes in batches, recording its
position as it goes, so a restart resumes rather than starting over.

That means a `202` tells you the job was accepted, not that it finished. Poll the job to find out.

## Deleting a contact and its hierarchy

```
DELETE /api/v1/person/{id}
DELETE /api/v1/place/{id}
```

Removes the contact, every contact beneath it, and the reports they are the subject of. Any surviving
place that named one of the removed contacts as its primary contact has that reference cleared, so the
hierarchy is not left pointing at documents that no longer exist.

Requires `can_delete_contact_hierarchy`.

| Query parameter | Description |
|---|---|
| `dry_run` | Return the summary without queuing anything. Default `false`. |
| `delete_users` | Also remove user accounts linked to the deleted contacts. Requires `can_delete_users` as well. Without it, a delete that would orphan a login is rejected with `400`. |

The endpoint enforces the type in the path, so sending a place id to `/person/{id}` returns `404`
rather than deleting the wrong kind of thing.

## Moving a contact to a new parent

```
POST /api/v1/person/{id}/move
POST /api/v1/place/{id}/move
```

```json
{ "parent_id": "<new-parent-uuid>" }
```

Send `{}` to move the contact to the top of the hierarchy.

Requires `can_move_contact_hierarchy`.

The contact and everything beneath it are reparented. Because the CHT stores a copy of the ancestor
list inside each document for offline performance, the stored lineage is rewritten on every descendant
contact, on the reports those contacts wrote, and on any place whose primary contact moved.

The same constraints apply as for the `cht-conf` action: the destination must be a valid parent for
the contact type under your [hierarchy configuration](/building/reference/app-settings/hierarchy), a
contact cannot become its own descendant's child, and a place's primary contact must remain a
descendant of that place. An illegal move is rejected with `400` before anything is queued.

## Previewing with `dry_run`

Both operations accept `dry_run=true`, which runs every query and validation and returns the same
summary without queuing anything. The response is `200` rather than `202` and carries no job id.

This is worth using before a destructive operation. The summary is how many real people and real
visits are involved:

```
DELETE /api/v1/place/{id}?dry_run=true
```

```json
{
  "summary": {
    "archive": { "contacts": 40, "reports": 18 },
    "set-contact": 1,
    "delete-user": 0
  }
}
```

A move summary is shaped by what it rewrites rather than what it removes:

```json
{
  "summary": {
    "set-parent": 12,
    "set-contact": { "reports": 34, "places": 2 }
  }
}
```

## Polling the job

```
GET /api/v1/bulk-operations/{id}
```

A queued operation returns its id alongside the summary:

```json
{
  "summary": { "archive": { "contacts": 40, "reports": 18 } },
  "id": "bulk-operation:8f3c..."
}
```

Polling it returns the log, with one entry per action:

```json
{
  "_id": "bulk-operation:8f3c...",
  "start_date": "2026-08-27T09:14:22.000Z",
  "actions": {
    "bulk-operation-action:8f3c...:a1": {
      "status": "completed",
      "action": "set-contact",
      "updated_date": "2026-08-27T09:14:25.000Z",
      "total_changes_count": 1
    }
  }
}
```

**The operation is finished when every action has a status of `completed` or `failed`.** There is no
single top-level status to read.

A `failed` action carries `failed_operations` listing the individual documents that could not be
changed, usually because something else modified them after the job was queued. The actions that
succeeded are not rolled back, so a failed operation leaves a partial change that the report describes.

## What to expect afterwards

**Offline users do not automatically lose contacts that leave their hierarchy.** The documents stay on
the device and later edits to them
[silently fail to sync](https://github.com/medic/cht-core/issues/5701). Users affected by a delete or a
move must clear cache and resync. This is the same caveat that applies to the `cht-conf` actions and it
is the most common source of confusion after a hierarchy change.

Users who gain a large subtree may face a long, bandwidth-heavy sync the next time they connect.

Between the response and completion, readers see the pre-operation arrangement, and during execution
they may briefly see some documents changed and others not. Devices converge on the next sync.

## When to use `cht-conf` instead

The [`cht-conf` actions](/building/contact-management/moving-contacts) still exist and are still the
right tool for bulk work from an administrator's machine, particularly moving several unrelated
contacts in one command, or reviewing the changed documents on disk before uploading them. The API
handles one contact per request and applies changes directly.

`merge-contacts` has no API equivalent yet.
