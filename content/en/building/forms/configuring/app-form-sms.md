---
title: "Make Calls and Sending SMS from App Forms"
linkTitle: "App Form SMS"
weight: 3
description: >
  Trigger calls and SMS from within the form, or send an SMS once submitted
relatedContent: >
  building/forms/configuring/additional-docs
  building/forms/configuring/multimedia
  building/forms/contact
aliases:
   - /building/guides/forms/app-form-sms
   - /apps/guides/forms/app-form-sms
---

{{< hextra/hero-subtitle >}}
  Trigger calls and SMS from within the form, or send an SMS once submitted
{{< /hextra/hero-subtitle >}}

## Triggering Calls and SMS

When an XForm is loaded on a phone you can start a phone call or trigger the sending of an SMS within the form itself. This can be useful if within a task or assessment, you want to tell the user to contact a patient, or perhaps a health worker at a facility.

To set up the call or SMS you'll need to create a link with `tel:` or `sms:` within a `note` field. To create the link, use the markdown link format, eg `[Call Patient](tel:+2547009875000)`. You can specify the content of the SMS by using the body parameter, eg `[Send SMS](sms://+25470098765000?body=Hello World!)`.

The phone number and message can be generated from fields within the XForm. For instance, if you have `patient_name`, `patient_phone`, and `message` fields, you can generate the SMS as follows:
- **XLSForm**
`[Send SMS to ${patient_name}](sms://${patient_phone}?body=${message})`

- **XForm**
`[Send SMS to <output value=" /data/patient_name "/>](sms://<output value=" /data/patient_phone "/>?body=<output value=" /data/message "/>)`

If you want to use a button to make the action more obvious, this can be done using HTML and CSS within the note:
```html
[<span style='background-color: #CC0000; color:white; padding: 1em; text-decoration: none; '>Call the patient</span>](tel:${patient_phone})
```

Note that the SMS link notation can be interpreted differently from one phone to another. Some devices work well with `sms:${phone}?body=${message}`, others with `sms://${phone}?body=${message}`. You may find [these SMS link tests](https://web.archive.org/web/20210125031111/https://bradorego.com/test/sms.html) helpful in determining what works on devices for your deployment.


## Sending reports as SMS

To define that an XForm should be converted to an SMS, add the field `xml2sms` to the form's CouchDB doc and assign it a truthy value (either a boolean or a string).  
When submitting such a form, along with creating the report document, the app will try to compact the report's content into an SMS that would be sent to the configured Gateway phone number.

There are two formats available - either using the [ODK's compact record representation for SMS](https://getodk.github.io/xforms-spec/#compact-record-representation-(for-sms)), or Medic's custom format.
When the form compaction fails or returns no content, no SMS will be sent.

### ODK compact record representation for SMS

When `xml2sms` field value is Boolean `true`, the app will try to compact the form using this format. 
To get forms sent in this format, follow the [ODK documentation](https://getodk.github.io/xforms-spec/#compact-record-representation-(for-sms)).

### Medic Custom SMS representation

To configure a form to send using Medic's custom SMS definition, the value of `xml2sms` from the form's CouchDB doc should be a string containing an [Angular expression](https://docs.angularjs.org/guide/expression).
This allows access to the `fields` property of the `data_record` doc created when saving the form submission to the database.  Extra functions are also provided to make compiling a form submission more simple.

#### Special Functions

##### `concat(...args)`

* `...args`: 0 or more values to be concatenated.

        concat('A', 'bee', 'Sea') => 'AbeeSea'

##### `spaced(...args)`

* `...args`: 0 or more values to be concatenated with spaces between them.

        spaced('A', 'bee', 'Sea') => 'A bee Sea'

##### `match(val, matchers)`

* `val`: the value to run matches against
* `matchers`: a string representing values to match and their corresponding outputs

        match('a', 'a:Hay,b:bzz,c:see') => 'Hay'
        match('b', 'a:Hay,b:bzz,c:see') => 'bzz'
        match('c', 'a:Hay,b:bzz,c:see') => 'c'

#### Examples

##### Form Submission JSON

	doc.fields = {
	  s_acc_danger_signs: {
	    s_acc_danger_sign_seizure: 'no',
	    s_acc_danger_sign_loss_consiousness: 'yes',
	    s_acc_danger_sign_unable_drink: 'no',
	    s_acc_danger_sign_confusion: 'yes',
	    s_acc_danger_sign_vomit: 'no',
	    s_acc_danger_sign_chest_indrawing: 'yes',
	    s_acc_danger_sign_wheezing: 'no',
	    s_acc_danger_sign_bleeding: 'yes',
	    s_acc_danger_sign_lathargy: 'no',
	    has_danger_sign: 'true',
	  },
	};

##### `formDoc.report2sms`

	concat(
	    "U5 ",
	    match(doc.s_acc_danger_signs.has_danger_sign, "true:DANGER, false:NO_DANGER"),
	    " ",
	    match(doc.s_acc_danger_signs.s_acc_danger_sign_seizure, "yes:S"),
	    match(doc.s_acc_danger_signs.s_acc_danger_sign_loss_consiousness, "yes:L"),
	    match(doc.s_acc_danger_signs.s_acc_danger_sign_unable_drink, "yes:D"),
	    match(doc.s_acc_danger_signs.s_acc_danger_sign_confusion, "yes:C"),
	    match(doc.s_acc_danger_signs.s_acc_danger_sign_vomit, "yes:V"),
	    match(doc.s_acc_danger_signs.s_acc_danger_sign_chest_indrawing, "yes:I"),
	    match(doc.s_acc_danger_signs.s_acc_danger_sign_wheezing, "yes:W"),
	    match(doc.s_acc_danger_signs.s_acc_danger_sign_bleeding, "yes:B"),
	    match(doc.s_acc_danger_signs.s_acc_danger_sign_lathargy, "yes:Y")
	)

##### SMS content

	U5 DANGER LCIB
