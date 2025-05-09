---
title: "COVID-19 Testing with Rapid Diagnostic Tests"
linkTitle: "COVID-19 Testing"
weight:
description: >
 Reference application that uses a third party app to capture the result of a Rapid Diagnostic Test
relatedContent: >
  building/forms/app/#android-app-launcher
  building/forms/app/#cht-xform-widgets
  building/forms/app/#parse-timestamp-to-date
aliases:
   - /apps/examples/covid-rdt-reference-app
   - /building/examples/covid-rdt-reference-app
   - /exploring/covid-rdt-reference-app
---

{{< hextra/hero-subtitle >}}
  Reference application that uses a third party app to capture the result of a Rapid Diagnostic Test
{{< /hextra/hero-subtitle >}}

Medic has worked with [FIND](https://www.finddx.org) to build a CHT reference application for COVID-19 point-of-care testing with Rapid Diagnostic Tests (RDT). Using the reference app as an example, CHT app developers can easily include the provisioning and capture of RDT in workflows. These workflows can include third-party applications, like [Dimagi's RD-Toolkit](https://github.com/dimagi/rd-toolkit/), that guide health workers through the use of the RDT.

You can find the code for this application in the [CHT Core repository on GitHub](https://github.com/medic/cht-core/tree/master/config/covid-19).

## Problem Being Addressed

The original call for proposals best describes why Medic created this app:

> FIND is working towards supporting countries in implementing an effective test-trace-isolate response using digital tools. To this end, FIND is looking to partner with leading digital solution providers to accelerate the development and deployment of a set of minimum functionalities for the collection of COVID RDT data and supporting incorporation of these functionalities into existing digital tools for use in low- and middle-income country settings.

## Solution Overview

This reference app provides a base layer of functionality that you can easily customize to meet the needs of your health program.  Specifically, this application has examples of:

 * Provisioning COVID-19 RDT tests
 * Capturing COVID-19 RDT results
 * Storing all RDT data, including pictures, in the CHT
 * Best practices for RDT workflows in the CHT

Your instance of CHT needs to be on v3.13+ which has features developed to support this reference application, including:

  * **Display Base64 Image** - show ASCII encoded images inline
  * **Android App Launcher** - integrate with third party apps like the RD-Toolkit
  * **Parse Timestamp to Date** -  convert epoch time stamps (`1628945040308`) to your desired format (`Sun Mar 19 13:25:08`).

For more information on these features, see the ["Related Content"](#related-content).

Additional requirements for this application beyond CHT 3.13, include [CHT Android 0.10.0](https://github.com/medic/cht-android) or later and Dimagi's [RD-Toolkit 0.9.8](https://github.com/dimagi/rd-toolkit/) or later.

While this application calls the RD-Toolkit, the integration features in the CHT Core and CHT Android are generic.  This means you could use a different RDT Android application if you prefer. Beyond the scope of RDTs, you could use this integration feature to launch any other Android app to perform an action and save the result in the CHT. To read more about this feature, see the [Android App Launcher section in the Forms reference documentation]({{< ref "building/forms/app#android-app-launcher" >}}).

## Workflow

There are three main components to this application:
 * The CHT forms to provision and capture RDTs (Green)
 * Using a third-party app to use an RDT (Yellow)
 * Tasks to remind CHWs to complete an RDT that has been started (Blue)

{{< figure src="flow.png" link="flow.png" class="right col-12 col-lg-12" >}}

## Training Materials

Medic is providing images and videos for use in training CHWs on how to use the CHT with the RD-Toolkit. These could be combined with existing in [app training]({{< ref "reference-apps/covid-education" >}}) if needed. As well, the RD-Toolkit has in app instructions for how to use specific RDTs.

### Images

27 high resolutions images taken from a demonstration CHW device are [available for download](CHT.COVID-19.RDT.Images.zip). These cover the entire usage of the reference app.

### Videos

Provided here are two videos of the Provision and Capture forms in the COVID-19 application.

#### Provision

This first video shows the left side of the workflow above to provision an RDT for a patient.  The CHW is shown finding Jessica Whitehouse's contact and choosing a new action of "RDT Covid-19 - Provision".  The CHW then does pre-test set up, checking Jessica's symptoms and location and confirming the test method and lot information. You can see the CHW launching the RD-Toolkit, reading the instructions and then, starting the session and timer.  With the RD-Toolkit sending back all the information to the CHT, a task "Capture Covid-19 RDT" can be seen in the CHT for the CHW to follow up on when the RD-Timer has completed. The last part of the video shows the completed provision report in the CHT:

<!--
  use raw HTML for now as hugo youtube short codes show 16:9 ration
  box instead of mobile portrait ~9:16
-->
<iframe id="ytplayer" type="text/html" width="342" height="610" src="https://www.youtube.com/embed/3o5d7p9O9OE" frameborder="0"></iframe>

#### Capture

This second video shows the right side of the workflow above to capture RDT results for a patient.  The CHW is shown viewing the "Capture Covid-19 RDT" task after the 15 minute timer from the RD-Toolkit app has completed. After selecting the task, the CHW is brought to the CHT form which has the session information for the RD-Toolkit already loaded.  The test results are recorded and then returned to the CHT from the RD-Toolkit. The last part of the video shows the completed capture report in the CHT, including the result and image of the RDT:

<!--
  use raw HTML for now as hugo youtube short codes show 16:9 ration
  box instead of mobile portrait ~9:16
-->
<iframe id="ytplayer" type="text/html" width="342" height="610" src="https://www.youtube.com/embed/gpExUOJ6eQ0" frameborder="0"></iframe>

## Reports and Dashboards

Like all applications written for the CHT, there are built-in mechanisms to retrieve raw and aggregate data to generate reports and dashboards. Here are some ways that the data can be accessed:

 * **[In app targets]({{< ref "building/targets/targets-overview" >}}):** Gives the CHW or their supervisor an aggregate view of any of the form fields. Since targets rely on the data on the device, if targets include data from other users then permissions must be set on the relevant forms so that the data can be replicated and synchronized accordingly.
 * **API Calls:** Given that all form submissions are captured in JSON and that we know the data model well, you can easily do API calls to a CHT server instance and use some custom code (node, python etc) to gather and show stats on a daily basis. You can export to either JSON or CSV. See API docs [for reports]({{< ref "building/reference/api#get-apiv2exportreports" >}}) as well as [monitoring metadata]({{< ref "building/reference/api#get-apiv2monitoring" >}}).
 * **[PostgreSQL queries](https://github.com/medic/cht-sync):** CHT ships with a utility to export all the data that the API has to a relational database, Postgres. You have all the raw data the API has, but can now use the power of joins and groupings to come up with totally customizable stats by day, week, month etc. Data can be synched near real time from the CHT.
 * **Dashboards:** Medic has used both [Klipfolio](https://www.klipfolio.com/) and, more recently, [Superset](https://superset.incubator.apache.org/) to create more complex yet still user-friendly dashboards. This is particular useful for those who need to view the data but wouldn't otherwise be logging in to CHT apps. These dashboards generally access the relational data in the Postgres database as the back end.
  * **Third-Party Applications:** Connecting to third-party applications can be done using built-in [integrations]({{< ref "building/integrations" >}}), or building a workflow with [custom integrations]({{< ref "building/integrations/custom" >}}).


### Sample API call

Start with finding out the names of the forms you can get reports from. If you had deployed this application without any customizations, you would have these forms available as seen by calling the [forms API]({{< ref "building/reference/api#get-apiv1forms" >}}):

```shell
curl "http://LOGIN:PASSWORD@HOSTNAME/api/v1/forms" | jq
```

The resulting JSON is formatted by `jq` for you to get an easy to read list.

```json
[
  "contact:clinic:create.xml",
  "contact:clinic:edit.xml",
  "contact:district_hospital:create.xml",
  "contact:district_hospital:edit.xml",
  "contact:health_center:create.xml",
  "contact:health_center:edit.xml",
  "contact:person:create.xml",
  "contact:person:edit.xml",
  "covid19_rdt_capture.xml",
  "covid19_rdt_provision.xml"
]
```

The last two forms can be used to query [the reports API ]({{< ref "building/reference/api#get-apiv2exportreports" >}}) to get RDT provions and captures.  To get all the capture reports into a file called `output.csv`, you would use this call:

```shell
curl "http://LOGIN:PASSWORD@HOSTNAME/api/v2/export/reports?filters[search]=&filters[forms][selected][0][code]=covid19_rdt_capture" > output.csv
```

{{< callout type="info" >}}
  As all API calls need to be authenticated, be sure to use a login with admin permissions with this structure: `http://LOGIN:PASSWORD@HOSTNAME`.
{{< /callout >}}

### Base64 image extraction

To extract the binary image from the ASCII value in a report, you can view it in the CHT or you can use a script to do so.  Here's an example of using Bash utilities (`sed`, `cut`, `tr` and `base64`) in Linux to loop over each line of the `output.csv` file from [the above call](#sample-api-call) to reports API. This results in numbered binary image files called `imageNUMBER.jpg` for each line in the export:

```shell
i=1 n=0
while read -r line; do
  ((n >= i )) && echo $line | cut -d',' -f15 | tr -d '"' | base64 -d > image$n.jpg
  ((n++))
done < output.csv
```

This code snippet is good just to validate data ad hoc, but more likely you'll be doing either an extract-transform-load (ETL) process into a third-party system, or just import the raw contents and then display the base64 as an image, as done in the CHT.

When retrieving [JSON](#capture-1), this value is found in `capture.android-app-outputs.rdt_session_bundle.rdt_session_result_bundle.rdt_session_result_extra_images.cropped` field.

{{< callout type="info" >}}
  The reports API always outputs in CSV, but the COVID-19 application uses [Base64 encoding](https://en.wikipedia.org/wiki/Base64) to store the images as text as noted above.  These may misbehave when opened them in a spreadsheet application like LibreOffice ("maximum number of characters per cell exceeded") or Excel (silently clipped to 32k chars) as they're thousands, if not hundreds of thousands, of characters long.  Be sure to programmatically process these into image files as needed.
{{< /callout >}}


## Customizing the application

These are the files in the COVID-19 app where you'll want to focus your customization efforts:

```shell
├── forms
│   ├── app
│   │   ├── covid19_rdt_capture.properties.json
│   │   ├── covid19_rdt_capture.xlsx
│   │   ├── covid19_rdt_capture.xml
│   │   ├── covid19_rdt_provision.properties.json
│   │   ├── covid19_rdt_provision.xlsx
│   │   └── covid19_rdt_provision.xml
├── tasks.js
```

The `forms/app/covid19_rdt_provision` and `forms/app/covid19_rdt_capture` forms (`xlsx`, `xml` and `properties.json`) represent the provision and capture portions of the forms.  The tasks that get created are defined in `tasks.js`.  Not shown are standard contact definitions in `forms/contact/*` as well as supporting configurations for icons and other CHT application settings.

To read more about how these files all work together, see [app forms]({{< ref "building/forms/app" >}}), [contact forms]({{< ref "building/forms/contact" >}}), and [task]({{< ref "building/tasks/tasks-js" >}}) reference documentation

## Example form submission

While likely too verbose for humans to read, these unredacted sample JSON documents from the COVID-19 application can be used for reference to know where to find fields when querying the CHT API or Postgres.

### Provision

```json
{
 "_id": "8ef8b4c4-59fc-4139-b760-64414637ed65",
 "_rev": "2-f64dd6048aebaf8f9bbaa38452640cf3",
 "form": "covid19_rdt_provision",
 "type": "data_record",
 "content_type": "xml",
 "reported_date": 1631312469783,
 "contact": {
  "_id": "d0bd9d0e-7a6e-4424-baea-f2ad13cc6e27",
  "parent": {
   "_id": "ca70460f-157d-415c-82a8-beeddaee54be",
   "parent": {
    "_id": "5821ca69-af9d-4245-8495-64092e2ed7f1"
   }
  }
 },
 "from": "+13125551211",
 "hidden_fields": [
  "patient_age_in_years",
  "patient_age_in_months",
  "patient_age_in_days",
  "provision",
  "summary",
  "meta"
 ],
 "fields": {
  "inputs": {
   "meta": {
    "location": {
     "lat": "",
     "long": "",
     "error": "",
     "message": ""
    },
    "deprecatedID": ""
   },
   "user": {
    "contact_id": "d0bd9d0e-7a6e-4424-baea-f2ad13cc6e27",
    "facility_id": "ca70460f-157d-415c-82a8-beeddaee54be",
    "name": "CHW123"
   },
   "source": "contact",
   "contact": {
    "_id": "bf3b7049-219d-44ef-a2a4-1647b75157e1",
    "patient_id": "34150",
    "first_name": "Jessica",
    "last_name": "Whitehouse",
    "name": "Jessica Whitehouse",
    "date_of_birth": "1984-06-05",
    "sex": "female",
    "phone": "+13125551222",
    "phone_alternate": "+13125551233",
    "address": "45 Frank ST, Kent Town",
    "parent": {
     "_id": "a894c6b9-d4be-428e-a855-27cd8082be3c",
     "name": "Jessica Whitehouse's Household",
     "address": "",
     "parent": {
      "_id": "ca70460f-157d-415c-82a8-beeddaee54be",
      "name": "Blue Tree Health Center",
      "address": "23 Willard ST, Kent Town"
     }
    }
   }
  },
  "patient_uuid": "bf3b7049-219d-44ef-a2a4-1647b75157e1",
  "patient_name": "Jessica Whitehouse",
  "patient_age_in_years": "37",
  "patient_age_in_months": "447",
  "patient_age_in_days": "13611",
  "age": "37 years old",
  "preview_time_expired": "15:41:01 on 10 Sep, 2021",
  "test-reference": {
   "session_id": "0faf0709-3c5f-405c-a692-1e0c96166782",
   "test_id": "69f30b96-c9cd-4a4e-acd2-72933f8b564b",
   "facility_id": "ca70460f-157d-415c-82a8-beeddaee54be",
   "facility_name": "Blue Tree Health Center",
   "facility_address": "23 Willard ST, Kent Town",
   "facility_confirm_ask": "yes",
   "test_reason": "symptomatic",
   "symptoms": "sore_throat cough loss_of_taste_or_smell",
   "days_since_symptoms_began": "4"
  },
  "spec-lot": {
   "specimen_type": "nasopharyngeal",
   "rdt_lot": "LOT12BA",
   "rdt_lot_expiry_date": "2021-09-17",
   "additional_notes": "All seals intact, all doses kept at correct temperature."
  },
  "provision": {
   "rdtoolkit-provision": {
    "action": "org.rdtoolkit.action.Provision",
    "note_instructions_provision": "",
    "android-app-inputs": {
     "rdt_session_id": "69f30b96-c9cd-4a4e-acd2-72933f8b564b",
     "rdt_config_bundle": {
      "rdt_config_classifier_mode": "PRE_POPULATE",
      "rdt_config_session_type": "TWO_PHASE",
      "rdt_config_provision_mode": "CRITERIA_SET_AND",
      "rdt_config_provision_mode_data": "sars_cov2",
      "rdt_config_flavor_one": "bf3b7049-219d-44ef-a2a4-1647b75157e1",
      "rdt_config_flavor_two": "Jessica Whitehouse",
      "rdt_config_cloudworks_dns": ""
     }
    },
    "android-app-outputs": {
     "rdt_session_bundle": {
      "rdt_session_state": "RUNNING",
      "rdt_session_time_started": "1631312461680",
      "rdt_session_time_resolved": "1631313361680",
      "rdt_session_time_expired": "1631313661680",
      "rdt_session_test_profile": "premier_medical_sure_status_c19"
     }
    },
    "preview_session_state": "RUNNING"
   },
   "note_continue_1": "",
   "note_continue_2": ""
  },
  "summary": {
   "syndrome_test_type": "COVID-19",
   "rdt_loinc_code": "94558-4",
   "rdt_loinc_long_common_name": "SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay",
   "summary_header": "",
   "summary_details": "",
   "summary_name": "",
   "summary_info": "",
   "summary_test_name": "",
   "summary_test_expire": ""
  },
  "meta": {
   "instanceID": "uuid:e21e1079-462b-4f56-9a33-c1e9e22a6643"
  }
 },
 "geolocation_log": [
  {
   "timestamp": 1631312469904,
   "recording": {
    "latitude": 5.9949813,
    "longitude": -5.0980983,
    "altitude": 706.7633651675733,
    "accuracy": 16.44700050354004,
    "altitudeAccuracy": null,
    "heading": null,
    "speed": null
   }
  }
 ],
 "geolocation": {
  "latitude": 5.9949813,
  "longitude": -5.0980983,
  "altitude": 706.7633651675733,
  "accuracy": 16.44700050354004,
  "altitudeAccuracy": null,
  "heading": null,
  "speed": null
 },
 "_attachments": {
  "content": {
   "content_type": "application/xml",
   "revpos": 1,
   "digest": "md5-VkGDlztsrWtyqNI6X4U9Yg==",
   "length": 5612,
   "stub": true
  }
 }
}
```

### Capture

{{< callout type="info" >}}
  The `rdt_session_result_extra_images.cropped` field is truncated as it normally exceeds [10,000 characters](#base64-image-extraction).
{{< /callout >}}


```json
{
  "_id": "a5f92d70-a3c0-4684-8ee7-fe435b49c974",
  "_rev": "1-a6cac66d104d779d91e7cfe16a2ee970",
  "form": "covid19_rdt_capture",
  "type": "data_record",
  "content_type": "xml",
  "reported_date": 1631313478618,
  "contact": {
    "_id": "d0bd9d0e-7a6e-4424-baea-f2ad13cc6e27",
    "parent": {
      "_id": "ca70460f-157d-415c-82a8-beeddaee54be",
      "parent": {
        "_id": "5821ca69-af9d-4245-8495-64092e2ed7f1"
      }
    }
  },
  "from": "+13125551211",
  "hidden_fields": [
    "inputs",
    "patient_age_in_years",
    "patient_age_in_months",
    "patient_age_in_days",
    "test-information",
    "capture",
    "summary.summary_header",
    "summary.summary_details",
    "summary.summary_name",
    "summary.summary_info",
    "summary.summary_rdt_loinc_long_common_name",
    "summary.summary_results",
    "meta"
  ],
  "fields": {
    "inputs": {
      "source": "task",
      "contact": {
        "_id": "bf3b7049-219d-44ef-a2a4-1647b75157e1",
        "patient_id": "34150",
        "first_name": "Jessica",
        "last_name": "Whitehouse",
        "name": "Jessica Whitehouse",
        "date_of_birth": "1984-06-05",
        "sex": "female",
        "phone": "+13125551222",
        "phone_alternate": "+13125551233",
        "address": "45 Frank ST, Kent Town",
        "parent": {
          "_id": "a894c6b9-d4be-428e-a855-27cd8082be3c",
          "name": "Jessica Whitehouse's Household",
          "address": "",
          "parent": {
            "_id": "ca70460f-157d-415c-82a8-beeddaee54be",
            "name": "Blue Tree Health Center",
            "address": "23 Willard ST, Kent Town"
          }
        }
      }
    },
    "patient_uuid": "bf3b7049-219d-44ef-a2a4-1647b75157e1",
    "patient_name": "Jessica Whitehouse",
    "patient_age_in_years": "37",
    "patient_age_in_months": "447",
    "patient_age_in_days": "13611",
    "age": "37 years old",
    "test-information": {
      "session_id": "0faf0709-3c5f-405c-a692-1e0c96166782",
      "administrator_id": "d0bd9d0e-7a6e-4424-baea-f2ad13cc6e27",
      "administrator_name": "mrjones",
      "test_id": "69f30b96-c9cd-4a4e-acd2-72933f8b564b",
      "facility_id": "ca70460f-157d-415c-82a8-beeddaee54be",
      "facility_name": "Blue Tree Health Center",
      "facility_address": "23 Willard ST, Kent Town",
      "facility_test_setting": "",
      "other_test_setting": "",
      "test_reason": "symptomatic",
      "symptoms": "sore_throat cough loss_of_taste_or_smell",
      "days_since_symptoms_began": "4",
      "specimen_type": "nasopharyngeal",
      "specimen_type_other": "",
      "rdt_lot": "LOT12BA",
      "rdt_lot_expiry_date": "2021-09-17",
      "additional_notes": "All seals intact, all doses kept at correct temperature."
    },
    "capture": {
      "rdtoolkit-capture": {
        "action": "org.rdtoolkit.action.Capture",
        "note_instructions_provision": "",
        "android-app-inputs": {
          "rdt_session_id": "69f30b96-c9cd-4a4e-acd2-72933f8b564b"
        },
        "android-app-outputs": {
          "rdt_session_bundle": {
            "rdt_session_state": "QUEUED",
            "rdt_session_time_started": "1631312461680",
            "rdt_session_time_resolved": "1631313361680",
            "rdt_session_time_expired": "1631313661680",
            "rdt_session_test_profile": "premier_medical_sure_status_c19",
            "rdt_session_result_bundle": {
              "rdt_session_result_time_read": "1631313440887",
              "rdt_session_result_extra_images": {
                "cropped": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9+-----SNIP-----+SkUbNztxB28pg/3WxqNihXn/ZSlB//Z"
              },
              "rdt_session_result_map": {
                "sars_cov2": "sars_cov2_pos"
              }
            }
          }
        },
        "preview_session_state": "COMPLETED"
      },
      "note_continue_1": "",
      "note_continue_2": ""
    },
    "repeat-test": {
      "repeat_test": "no"
    },
    "summary": {
      "time_started": "10 Sep, 2021 at 15:21:01",
      "time_read": "10 Sep, 2021 at 15:37:20",
      "time_expired": "10 Sep, 2021 at 15:41:01",
      "results_expired": "FALSE",
      "result": "Positive",
      "summary_header": "",
      "summary_details": "",
      "summary_name": "",
      "summary_info": "",
      "summary_rdt_loinc_long_common_name": "",
      "summary_results": "",
      "summary_image": ""
    },
    "meta": {
      "instanceID": "uuid:3225ed73-209f-4ddf-864a-ee0e4d2a51e3",
      "deprecatedID": ""
    }
  },
  "geolocation_log": [
    {
      "timestamp": 1631313478752,
      "recording": {
        "latitude": 5.9950304,
        "longitude": -5.0981426,
        "altitude": 706.6073668124792,
        "accuracy": 11.522000312805176,
        "altitudeAccuracy": null,
        "heading": null,
        "speed": null
      }
    }
  ],
  "geolocation": {
    "latitude": 5.9950304,
    "longitude": -5.0981426,
    "altitude": 706.6073668124792,
    "accuracy": 11.522000312805176,
    "altitudeAccuracy": null,
    "heading": null,
    "speed": null
  },
  "_attachments": {
    "user-file/covid19_rdt_capture/summary/summary_image": {
      "content_type": "image/png",
      "revpos": 1,
      "digest": "md5-H537gv0l2mOyltmyzBRaZA==",
      "length": 211302,
      "stub": true
    },
    "content": {
      "content_type": "application/xml",
      "revpos": 1,
      "digest": "md5-cwJDPyvLshux7nfuJxjnzQ==",
      "length": 287073,
      "stub": true
    }
  }
}
```