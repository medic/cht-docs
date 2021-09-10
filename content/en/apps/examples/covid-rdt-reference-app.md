---
title: "COVID-19 RDT Reference Application"
linkTitle: "COVID-19 RDT"
weight: 
description: >
 A customizable CHT application with support for 3rd party RDT integration   
relatedContent: >
---

Medic has worked with [FIND](https://www.finddx.org) to provide a reference implementation of a rapid diagnostic tests (RDTs) for COVID-19 application.  By leveraging the expertise of third-party applications, like [Dimagi's RD-Toolkit](https://github.com/dimagi/rd-toolkit/), you can customize this application in your current or future deployment of the CHT.

## Problem Being Addressed

The original call for proposals best describes why Medic created this app: 

> FIND is working towards supporting countries in implementing an effective test-trace-isolate response using digital tools. To this end, FIND is looking to partner with leading digital solution providers to accelerate the development and deployment of a set of minimum functionalities for the collection of COVID RDT data and supporting incorporation of these functionalities into existing digital tools for use in low- and middle-income country settings.

## Solution Overview

This reference app provides a base layer of functionality that you can easily customize to meet the needs of your health program.  Specifically, this application has examples of:
 * Provisioning COVID-19 RDT tests 
 * Capturing COVID-19 RDT results
 * Storing all RDT data, including pictures, in the CHT
 * Best practices of Health Facility, CHW, patient and RDT hierarchy in the CHT

## Workflow

There are three main components to this application:
 * The CHT forms to provision and capture RDTs (Green)
 * Using a third-party app to use an RDT (Yellow)
 * Tasks to remind CHWs to complete an RDT that has been started (Blue) 

{{< figure src="flow.png" link="flow.png" class="right col-12 col-lg-12" >}}

## Example Videos

### Provision

This first video shows the left side of the workflow above to provision an RDT for a patient.  The CHW is shown finding Jessica Whitehouse's contact and choosing a new action of "RDT Covid-19 - Provision".  The CHW then does pre-test set up, checking Jessica's symptoms and location and confirming the test method and lot information. You can see the CHW launching the RD-Toolkit, reading the instructions and then, starting the session and timer.  With the RD-Toolkit sending back all the information to the CHT, a task "Capture Covid-19 RDT" can be seen in the CHT for the CHW to follow up on when the RD-Timer has completed. The last part of the video shows the completed provision report in the CHT:

<video controls poster="provision.poster.png"  class=" col-8 col-lg-8" >
    <source src="provision.mp4" type="video/mp4" >
    <source src="provision.webm" type="video/webm" >
</video>

### Capture

This second video shows the right side of the workflow above to capture RDT results for a patient.  The CHW is shown viewing the "Capture Covid-19 RDT" task after the 15 minute time from the RD-Timer has completed. After click the task, the CHW is brought to the CHT form which has the session information for the RD-Toolkit already loaded.  The test results are recorded and then returned to the CHT from the RD-Toolkit. The last part of the video shows the completed capture report in the CHT, including the prognosis and image of the RDT:

<video controls poster="capture.poster.png"  class=" col-8 col-lg-8" >
    <source src="capture.mp4" type="video/mp4" >
    <source src="capture.webm" type="video/webm" >
</video>

## Technical walkthrough

You can find the code for this application is found in the `config` directory Medic's main [CHT Core repository on GitHub](https://github.com/medic/cht-core/tree/master/config/covid-19). Shown below is a filtered file structure of the COVID19 app where you'll want to focus your customization efforts:

### Directory structure

```
├── forms
│   ├── app
│   │   ├── covid19_rdt_capture.properties.json
│   │   ├── covid19_rdt_capture.xlsx
│   │   ├── covid19_rdt_capture.xml
│   │   ├── covid19_rdt_provision.properties.json
│   │   ├── covid19_rdt_provision.xlsx
│   │   └── covid19_rdt_provision.xml
├── tasks.js
```

The `forms/app/covid19_rdt_provision` and `forms/app/covid19_rdt_capture` forms (`xlsx`, `xml` and `properties.json`) represent the provision and capture portions of the forms.  The tasks that get created are defined in `tasks.js`.  Not shown are standard contact definitions in `forms/contact/*` as well as supporting configurations for icons and other CHT application settings.  

To read more about how these files all work together, see [app forms]({{< ref "apps/reference/forms/app" >}}), [contact forms]({{< ref "apps/reference/forms/contact" >}}), and [task]({{< ref "apps/reference/tasks" >}}) reference documentation

### JSON from API calls

```json
{
  "_id": "08e17566-bbaf-43fa-9f1b-98d98402d0c3",
  "_rev": "2-274fc716e451afaf291b8a0ab4209bea",
  "form": "covid19_rdt_capture",
  "type": "data_record",
  "content_type": "xml",
  "reported_date": 1631119994462,
  "contact": {
    "_id": "541dec2f-f489-4a8a-bfad-f2c17a3cc54e",
    "parent": {
      "_id": "efcb2a10-371b-4c5f-a1ca-a043fc4bdae4"
    }
  },
  "from": "",
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
        "_id": "ebf0f37f-0813-4d80-bba4-d260c80454cc",
        "patient_id": "45858",
        "first_name": "p",
        "last_name": "1",
        "name": "p 1",
        "date_of_birth": "1999-07-08",
        "sex": "female",
        "phone": "",
        "phone_alternate": "",
        "address": "",
        "parent": {
          "_id": "efcb2a10-371b-4c5f-a1ca-a043fc4bdae4",
          "name": "chw's Health Facility",
          "address": "",
          "parent": {
            "_id": "",
            "name": "",
            "address": ""
          }
        }
      }
    },
    "patient_uuid": "ebf0f37f-0813-4d80-bba4-d260c80454cc",
    "patient_name": "p 1",
    "patient_age_in_years": "22",
    "patient_age_in_months": "266",
    "patient_age_in_days": "8098",
    "age": "22 years old",
    "test-information": {
      "session_id": "747bed8f-be46-47c3-8b00-153773b93aa3",
      "administrator_id": "541dec2f-f489-4a8a-bfad-f2c17a3cc54e",
      "administrator_name": "chw",
      "test_id": "91a610c5-dcaa-4ed3-8a96-e8518b065726",
      "facility_id": "efcb2a10-371b-4c5f-a1ca-a043fc4bdae4",
      "facility_name": "chw's Health Facility",
      "facility_address": "",
      "facility_test_setting": "",
      "other_test_setting": "",
      "test_reason": "",
      "symptoms": "",
      "days_since_symptoms_began": "",
      "specimen_type": "",
      "specimen_type_other": "",
      "rdt_lot": "",
      "rdt_lot_expiry_date": "",
      "additional_notes": ""
    },
    "capture": {
      "rdtoolkit-capture": {
        "action": "org.rdtoolkit.action.Capture",
        "note_instructions_provision": "",
        "android-app-inputs": {
          "rdt_session_id": "91a610c5-dcaa-4ed3-8a96-e8518b065726"
        },
        "android-app-outputs": {
          "rdt_session_bundle": {
            "rdt_session_state": "QUEUED",
            "rdt_session_time_started": "1631119916048",
            "rdt_session_time_resolved": "1631120816048",
            "rdt_session_time_expired": "1631121116048",
            "rdt_session_test_profile": "premier_medical_sure_status_c19",
            "rdt_session_result_bundle": {
              "rdt_session_result_time_read": "1631119948709",
              "rdt_session_result_extra_images": {
                "cropped": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAA++-----[SNIP]-----++ 0TbwhcjevKAAyiLk1ovjcllsACnVttsuV9LeQAKhP0tDjB3bAAipRvYopXtAAFSakq8GcZOFtAAFcUpLL0a/dQAB//9k="
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
      "time_started": "8 Sep, 2021 at 09:51:56",
      "time_read": "8 Sep, 2021 at 09:52:28",
      "time_expired": "8 Sep, 2021 at 10:11:56",
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
      "instanceID": "uuid:3eca0524-7c0a-42af-b24b-10a36895a7f1",
      "deprecatedID": "uuid:2a0d369a-cfbd-4e90-9363-572da8bb6f77"
    }
  },
  "geolocation_log": [
    {
      "timestamp": 1631119994567,
      "recording": {
        "code": 2,
        "message": "application does not have sufficient geolocation permissions."
      }
    },
    {
      "timestamp": 1631120467993,
      "recording": {
        "code": 2,
        "message": "application does not have sufficient geolocation permissions."
      }
    }
  ],
  "geolocation": {
    "code": 2,
    "message": "application does not have sufficient geolocation permissions."
  },
  "_attachments": {
    "user-file/covid19_rdt_capture/summary/summary_image": {
      "content_type": "image/png",
      "revpos": 2,
      "digest": "md5-dZxbM8jQzME+PwdIzwtuYw==",
      "length": 87452,
      "stub": true
    },
    "content": {
      "content_type": "application/xml",
      "revpos": 2,
      "digest": "md5-wSrSIxP/xGs6Ud+ImX8peg==",
      "length": 121504,
      "stub": true
    }
  }
}
```

