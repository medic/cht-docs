---
title: "Building SMS Forms"
linkTitle: SMS Forms
weight: 1
description: >
  Building CHT application SMS forms
relatedContent: >
  apps/reference/app-settings/forms
  apps/reference/app-settings/sms
  apps/reference/app-settings/transitions
  apps/reference/app-settings/#validations
  apps/guides/messaging

---

## Purpose of the Tutorial

This tutorial will take you through how to build SMS forms for CHT applications, including:

- Defining SMS forms
- Setting validation rules for SMS forms
- Setting automatic responses to SMS reports

SMS forms allow users to submit reports from any device including [feature phones](https://en.wikipedia.org/wiki/Feature_phone) without internet access. SMS forms are ideal in scenarios where targeted users have no way of accessing internet or where they are restricted to using feature phones.

## Brief Overview of Key Concepts

*[SMS forms]({{< relref "apps/reference/app-settings/forms" >}})* are structured text messages that contain a form code representing a report type and some information associated with the report.

SMS forms are defined in the *[app_settings.json]({{< relref "apps/reference/app-settings" >}})* file, and stored in the settings doc in the database.

*[SMS gateways]({{< relref "apps/guides/messaging/gateway" >}})* allow the CHT coreframework to send and recieve SMS transmission to or from a mobile network operator.

*SMS aggregators* act as intermediaries between the mobile network operators and the CHT coreframework. They allow for greater customization of SMS workflows in the CHT.

## Required Resources

You should have a functioning CHT instance and have medic-conf installed locally. Read [How to set up a CHT local configuration environment]({{% ref "apps/tutorials/local-setup" %}}).

You also need to have some prior knowledge on `app_settings.json` and transitions. Read [Set Transitions]({{% ref "apps/tutorials/application-settings#2-set-transitions" %}}).

## Implementation Steps

SMS forms are defined using json in the `app_settings.json` file. Read [JSON forms]({{% ref "apps/reference/app-settings/forms#app_settingsjson-forms" %}}).

### 1. Enable Transitions

To ensure SMS forms function as expected, you will first need to able the following transitions in `app_settings.json`.

```json
  "update_clinics": true,
  "registration": true,
  "accept_patient_reports": true,
  "generate_shortcode_on_contacts": true,
  "death_reporting": true
```

{{< see-also page="apps/reference/app-settings/transitions" title="Transitions" >}}

### 2. Define a Place Registration Form

To define a form, edit the object corresponding to the `forms` key in `app_settings.json`.

Add a household registration form by adding the code snippet below to the `forms` object.

```json
"HR": {
  "meta": {
    "code": "HR",
    "label": {
      "en": "New Household Registration"
    }
  },
  "fields": {
    "place_name": {
      "labels": {
        "tiny": {
          "en": "household_name"
        },
        "description": {
          "en": "Name of Household"
        },
        "short": {
          "en": "Household name"
        }
      },
      "position": 0,
      "type": "string",
      "length": [
        3,
        30
      ],
      "required": true
    }
  }
}
```

{{% alert title="Note" %}} Users will register new households by sending a text message in the format `HR <household name>`. For example, `HR Mary` will register `Mary's Household`. {{% /alert %}}

To set the validation rules and autoresponses, edit the array corresponding to the `registration` key in `app_settings.json`. Add the following object within the array.

```json
{
  "form": "HR",
  "events": [
    {
      "name": "on_create",
      "trigger": "add_place",
      "params": "{ \"contact_type\": \"clinic\" }",
      "bool_expr": ""
    }
  ],
  "validations": {
    "join_respones": false,
    "list": [
      {
        "property": "place_name",
        "rule": "!regex('household') && !regex('house hold')",
        "translation_key": "messages.hr.validation.no_household_in_name"
      },
      {
        "property": "place_name",
        "rule": "lenMin(1) && lenMax(30)",
        "translation_key": "messages.hr.validation.household_name_length"
      }
    ]
  },
  "messages": [
    {
      "event_type":"report_accepted",
      "recepient": "reporting_unit",
      "translation_key": "messages.hr.report_accepted"
    }
  ]
}
```

{{% alert title="Note" %}} You can also define your own [validation rules]({{< relref "apps/reference/app-settings#validations" >}}).  {{% /alert %}}

{{% alert title="Note" %}} `translation_key` represents the message that is sent out. This will be defined in a translations file (covered in the translations tutorial). {{% /alert %}}

{{< see-also page="apps/reference/translations" title="Translations" >}}

### 3. Define a Person Registration Form

Add a person registration form by adding the code snippet below to the `forms` object.

```json
"N": {
  "meta": {
    "code": "N",
    "label": {
      "en": "New Person Registration"
    }
  },
  "fields": {
    "place_id": {
      "labels": {
        "tiny": {
          "en": "place_id"
        },
        "description": {
          "en": "Household ID"
        },
        "short": {
          "en": "HH ID"
        }
      },
      "position": 0,
      "type": "string",
      "length": [
        1,
        13
      ],
      "required": true
    },
    "gender": {
      "labels": {
        "tiny": {
          "en": "gender"
        },
        "description": {
          "en": "Gender"
        },
        "short": {
          "en": "Gender"
        }
      },
      "position": 1,
      "type": "string",
      "length": [
        1,
        6
      ],
      "required": true
    },
    "age": {
      "labels": {
        "tiny": {
          "en": "age"
        },
        "description": {
          "en": "Age"
        },
        "short": {
          "en": "Age"
        }
      },
      "position": 2,
      "type": "integer",
      "length": [
        1,
        2
      ],
      "required": true
    },
    "patient_name": {
      "labels": {
        "tiny": {
          "en": "patient_name"
        },
        "description": {
          "en": "Patient name"
        },
        "short": {
          "en": "Patient name"
        }
      },
      "position": 3,
      "type": "string",
      "length": [
        3,
        30
      ],
      "required": true
    }
  }
}
```

{{% alert title="Note" %}} Users will register a new person by sending a text message in the format `N <household id> <gender> <age> <name>`. For example, `N 12345 F 20 Jane Cho` will register `Jane Cho` who belongs to the household with household ID `12345`. {{% /alert %}}

To set the validation rules and autoresponses, edit the array corresponding to the `registration` key in `app_settings.json`. Add the following object within the array.

```json
{
  "form": "N",
  "events": [
    {
      "name": "on_create",
      "trigger": "add_patient",
      "params": "{ \"parent_id\": \"place_id\" }",
      "bool_expr": ""
    }
  ],
  "validations": {
    "join_responses": false,
    "list": [
      {
        "property": "place_id",
        "rule": "regex('^[0-9]{5,13}$')",
        "translation_key": "messages.validation.household_id"
      },
      {
        "property": "gender",
        "rule": "iEquals('m') || iEquals('f')",
        "translation_key": "messages.n.validation.gender"
      },
      {
        "property": "age",
        "rule": "between(5,130)",
        "translation_key": "messages.n.validation.age"
      }
    ]
  },
  "messages": [
    {
      "event": "report_accepted",
      "translation_key": "messages.n.report_accepted",
      "recipient": "reporting_unit"
    }
  ]
}
```

{{% alert title="Note" %}} You can also define your own [validation rules]({{< relref "apps/reference/app-settings#validations" >}}).  {{% /alert %}}

{{% alert title="Note" %}} `translation_key` represents the message that is sent out. This will be defined in a translations file (covered in the translations tutorial). {{% /alert %}}

{{< see-also page="apps/reference/translations" title="Translations" >}}

### 4. Define a Report Submission form

Add a report submission form by adding the code snippet below to the `forms` object.

```json
"P": {
  "meta": {
    "code": "P",
    "label": {
      "en": "Pregnancy Registration"
    }
  },
  "fields": {
    "patient_id": {
      "position": 0,
      "labels": {
        "tiny": {
          "en": "patient_id"
        },
        "short": {
          "en": "Woman's ID"
        },
        "description": {
          "en": "Woman's ID"
        }
      },
      "type": "string",
      "length": [
        5,
        13
      ],
      "required": true
    },
    "lmp": {
      "position": 1,
      "labels": {
        "tiny": {
          "en": "lmp"
        },
        "short": {
          "en": "LMP in weeks"
        },
        "description": {
          "en": "Last menstrual period - in weeks"
        }
      },
      "type": "integer",
      "length": [
        1,
        2
      ],
      "required": false
    }
  }
}
```

{{% alert title="Note" %}} Users will pregnancy registration report by sending a text message in the format `P <patient id> <last menstrual period>`. For example, `P 23456 21` will register a pregnancy report for a person whose unique ID is `23456` and the last menstrual period was `21 weeks ago`. {{% /alert %}}

To set the validation rules and autoresponses, edit the array corresponding to the `registration` key in `app_settings.json`. Add the following object within the array.

```json
{
  "form": "P",
  "events": [
    {
      "name": "on_create",
      "trigger": "add_expected_date",
      "params": "lmp_date",
      "bool_expr": "doc.fields.lmp && /^[0-9]+$/.test(doc.fields.lmp)"
    }
  ],
  "validations": {
    "join_responses": false,
    "list": [
      {
        "property": "patient_id",
        "rule": "regex('^[0-9]{5,13}$')",
        "translation_key": "messages.validation.patient_id"
      },
      {
        "property": "lmp",
        "rule": "lenMin(1) ? (integer && between(4,42)) : optional",
        "translation_key": "messages.p.validation.weeks_since_last_lmp"
      }
    ]
  },
  "messages": [
    {
      "event_type": "report_accepted",
      "translation_key": "messages.p.report_accepted",
      "recipient": "reporting_unit"
    },
    {
      "event_type": "registration_not_found",
      "translation_key": "messages.validation.woman_id",
      "recipient": "reporting_unit"
    }
  ]
}
```

{{% alert title="Note" %}} You can also define your own [validation rules]({{< relref "apps/reference/app-settings#validations" >}}).  {{% /alert %}}

{{% alert title="Note" %}} `translation_key` represents the message that is sent out. This will be defined in a translations file (covered in the translations tutorial). {{% /alert %}}

{{< see-also page="apps/reference/translations" title="Translations" >}}

### 5. Upload App Settings

To upload app settings to your local instance, run the following command:

```zsh
medic-conf --url=https://<username>:<password>@localhost --accept-self-signed-certs upload-app-settings
```

{{% alert title="Note" %}} Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance. {{% /alert %}}

## Next steps

In the next tutorial, you will define scheduled messages that can be triggered or cleared by submitting SMS forms.
