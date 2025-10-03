---
title: "Launching a contact form from a task"
linkTitle: Launching a contact form from a task
description: >
  Demonstrates how to create or edit a contact from a task 
relatedContent: >
  building/tasks/complex-tasks
  building/tasks/tasks-js
  building/tasks/tasks-js/#tasksjs
---

Task actions with `type: 'contact'` can be configured to redirect the user to the contact form to create/edit a contact. 

{{< callout >}}
Note that submitting the contact form does not automatically resolve the task. 
{{< /callout >}}

## Create contact

To configure a task action to redirect the user to a create contact form, use the [`modifyContent` function]({{< ref "building/tasks/tasks-js/#tasksjs" >}}) to set the `type` and `parent_id` values for the new contact in the action `content`. When the user selects the action, they will automatically be redirected to the create contact form (located at `contacts/{{parent_id}}/add/{{type}}`).  

The following example task config will create a task for all new households (`clinic` contacts), prompting the user to add new members to the household. When the user selects the task, they will be presented with two actions. The "Add person to household" action will redirect the user to the create contact form for a new `person` contact, with the `parent_id` set to the household contact. This action can be performed as many times as needed to add multiple members to the household. The second action, "No more household members to add", will open an `app` form to confirm all members have been added to the household. Submitting that form will resolve the task.

```js
{
  name: 'add_household_members_task',
    title: 'Add Household Members',
    appliesTo: 'contacts',
    appliesToType: ['clinic'],
    events: [{
    id: 'add_household_members_task_event_id',
    days: 0,
    start: 0,
    end: 1,
  }],
    actions: [
    {
      type: 'contact',
      label: 'Add person to household',
      modifyContent: (content, { contact }) => {
        content.type = 'person';
        content.parent_id = contact._id;
      },
    },
    {
      type: 'report',
      form: 'mark_household_complete',
      label: 'No more household members to add',
    }
  ],
}
```

A task action can also be configured to redirect the user to the create contact form of a _top-level contact_ by setting only the `type` field in the `modifyContent` function (and not the `parent_id`).

## Edit contact

{{< callout >}}
Added in CHT `4.21.0`.
{{< /callout >}}

To configure a task action to redirect the user to an edit contact form, use the [`modifyContent` function]({{< ref "building/tasks/tasks-js/#tasksjs" >}}) to set the `edit_id` field in the action `content` to the identifier of the contact to edit. When the user selects the action, they will automatically be redirected to the edit contact form for the identified contact (located at `contacts/{{edit_id}}/edit`).

The following example task config will create a task for new person contacts that do not have a `role` value. When the user selects the task, they will be redirected to the edit contact form for the person (where they can set the `role` value). Populating the `role` value for the person will cause the task to be cancelled and no longer displayed.

```js
{
  name: 'add_role_task',
    title: 'Add Role',
    appliesTo: 'contacts',
    appliesToType: ['person'],
    events: [{
    id: 'add_role_event_id',
    days: 0,
    start: 0,
    end: 1,
  }],
    appliesIf: ({ contact }) => {
    return !contact.role;
  },
    resolvedIf: () => false,
    actions: [{
    type: 'contact',
    modifyContent: (content, { contact }) => {
      content.edit_id = contact._id;
    },
  }],
}
```

## Navigate to contact profile

{{< callout >}}
Added in CHT `4.21.0`.
{{< /callout >}}

If a task action with `type: 'contact'` does not set a value in the action `content` for `parent_id`, `type`, or `edit_id`, then selecting the action will simply redirect the user to the contact profile page for the contact associated with the task.
