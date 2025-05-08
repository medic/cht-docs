---
title: "Creating Additional Docs from App Forms"
linkTitle: "Additional Docs"
weight: 2
aliases:
   - /building/guides/forms/additional-docs
   - /apps/guides/forms/additional-docs
---

In version 2.13.0 and higher, you can configure app forms to generate additional docs upon submission. You can create one or more docs using variations on the configuration described below. One case where this can be used is to register a newborn from a delivery report, as shown below. First, here is an overview of what you can do and how the configuration should look in XML:

## Extra Docs

Extra docs can be added by defining structures in the model with the attribute 

```zsh
db-doc="true"
```

> [!IMPORTANT]
> You must have lower-case `true` in your XLSform, even though Excel will default to `TRUE`.

### Example Form Model

```xml
<data>
  <root_prop_1>val A</root_prop_1>
  <other_doc db-doc="true">
    <type>whatever</type>
    <other_prop>val B</other_prop>
  </other_doc>
</data>
```

### Resulting Docs

Report (as before):

```js
{
  _id: '...',
  _rev: '...',
  type: 'report',
  _attachments: { xml: ... ],
  fields: {
    root_prop_1: 'val A'
  }
}
```

Other doc:

```json
{
  "_id": "...",
  "_rev": "...",
  "type": "whatever",
  "other_prop": "val B"
}
```

## Linked Docs

Linked docs can be referred to using the doc-ref attribute, with an xpath. This can be done at any point in the model, e.g.:

### Example Form Model

```xml
<sickness>
  <sufferer db-doc-ref="/sickness/new">
  <new db-doc="true">
    <type>person</type>
    <name>Gómez</name>
    <original_report db-doc-ref="/sickness"/>
  </new>
</sickness>
```

### Resulting Docs

Report:

```json
{
  "_id": "abc-123",
  "_rev": "...",
  "type": "report",
  "fields": {
    "sufferer": "def-456"
  }
}
```

Other doc:

```json
{
  "_id": "def-456",
  "_rev": "...",
  "type": "person",
  "name": "Gómez",
  "original_report": "abc-123"
}
```

## Repeated Docs

- Can have references to other docs, including the parent
- These currently cannot be linked from other docs, as no provision is made for indexing these docs

### Example Form

```xml
<thing>
  <name>Ab</name>
  <related db-doc="true">
    <type>relative</type>
    <name>Bo</name>
    <parent db-doc-ref="/thing"/>
  </related>
  <related db-doc="true">
    <type>relative</type>
    <name>Ca</name>
    <parent db-doc-ref="/thing"/>
  </related>
</artist>
```

### Resulting Docs

Report:

```json
{
  "_id": "abc-123",
  "_rev": "...",
  "type": "report",
  "fields": {
    "name": "Ab"
  }
}
```

Other docs:

```json
{
  "_id": "...",
  "_rev": "...",
  "type": "relative",
  "name": "Bo",
  "parent": "abc-123",
}
```

```json
{
  "_id": "...",
  "_rev": "...",
  "type": "relative",
  "name": "Ch",
  "parent": "abc-123",
}
```

## Linked Docs Example
This example shows how you would register a single newborn from a delivery report.

First, the relevant section of the delivery report XLSForm file:

{{< figure src="linked_docs_xlsform.png" link="linked_docs_xlsform.png" caption="Delivery report" >}}

Here is the corresponding portion of XML generated after converting the form:

```xml
<repeat>
  <child_repeat db-doc="true" jr:template="">
    <child_name/>
    <child_gender/>
    <child_doc db-doc-ref=" /delivery/repeat/child_repeat "/>
    <created_by_doc db-doc-ref="/delivery"/>
    <name/>
    <sex/>
    <date_of_birth/>
    <parent>
      <_id/>
      <parent>
        <_id/>
        <parent>
          <_id/>
        </parent>
      </parent>
    </parent>
    <type>person</type>
  </child_repeat>
</repeat>
```

If you've done your configuration correctly, all you should see when you click on the submitted report from the Reports tab is the `child_doc` field with an `_id` that corresponds to the linked doc. In this case, you could look for that `_id` on the People tab or in the DB itself to confirm that the resulting doc looks correct.

## Repeated Docs Example
This example extends the above example to show how you would register one or multiple newborns from a delivery report. This allows you to handle multiple births.

First, the relevant section of the delivery report XLSForm file:

{{< figure src="repeated_docs_xlsform.png" link="repeated_docs_xlsform.png" caption="Delivery report" >}}

Here is the corresponding portion of XML generated after converting the form:

```xml
<repeat>
  <child_repeat db-doc="true" jr:template="">
    <child_name/>
    <child_gender/>
    <created_by_doc db-docs-ref="/delivery"/>
    <name/>
    <sex/>
    <date_of_birth/>
    <parent>
      <_id/>
      <parent>
        <_id/>
        <parent>
          <_id/>
        </parent>
      </parent>
    </parent>
    <type>person</type>
  </child_repeat>
</repeat>
```

If you've done your configuration correctly, all you should see when you click on the submitted report from the Reports tab is that there will be no information on the children created. You will find the created docs as siblings to the subject of the previously submitted report. Each of these child docs will have a field `created_by_doc` whose value is the `_id` of the report that created them. You can also look in the DB itself to confirm that the resulting docs look correct.
