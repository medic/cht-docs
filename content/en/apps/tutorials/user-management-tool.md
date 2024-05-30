---
title: "Building a User Management tool"
linkTitle: User management tool
weight: 23
description: >
 How to configure a web-based user management tool for your CHT project.
relatedContent: >
  apps/tutorials/contact-and-users-1
  apps/guides/data/users-bulk-load
---

The user management tool is a user-friendly web application used within CHT projects to manage users. 

## Required Resources

## Implementation Steps
1. Clone the `cht-user-management` repository.
2. Create a new folder under `src/config` with your required instance eg. chis-znz
3. Within that new folder create a `config.json` file with the following parameters
   Property | Type | Description
-- | -- | --
`domains` | Array | Controls the list of instances which the user can login to
`domains.friendly` | string | Friendly name for the instance (eg. "Migori")
`domains.domain` | string | Hostname for the instance (eg. "migori-echis.health.go.ke")
`domains.useHttp` | boolean | Whether to make an insecure connection (http) to the hostname (defaults to false)
`contact_types` | Array | One element for each type of user which can be created by the system
`contact_types.name` | string | The name of the contact_type as it [appears in the app's base_settings.json](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/hierarchy/)
`contact_types.friendly` | string | Friendly name of the contact type
`contact_types.contact_type` | string | The contact_type of the primary contact. [As defined in base_settings.json](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/hierarchy/)
`contact_types.contact_friendly` | string | Friendly name of the primary contact type
`contact_types.user_role` | string[] | A list of allowed [user roles](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/user-roles/). If only one is provided, it will be used by default.
`contact_types.username_from_place` | boolean | When true, the username is generated from the place's name. When false, the username is generated from the primary contact's name. Default is false.
`contact_types.hierarchy` | Array<ConfigProperty> | Defines how this `contact_type` is connected into the hierarchy. An element with `level:1` (parent) is required and additional elements can be provided to support disambiguation. See [ConfigProperty](#ConfigProperty).
`contact_types.hierarchy.level` | integer | The hierarchy element with `level:1` is the parent, `level:3` is the great grandparent.
`contact_types.replacement_property` | Property | Defines how this `contact_type` is described when being replaced. The `property_name` is always `replacement`. See [ConfigProperty](#ConfigProperty).
`contact_types.place_properties` | Array<ConfigProperty> | Defines the attributes which are collected and set on the user's created place. See [ConfigProperty](#ConfigProperty).
`contact_types.contact_properties` | Array<ConfigProperty> | Defines the attributes which are collected and set on the user's primary contact doc. See [ConfigProperty](#ConfigProperty).
`contact_types.deactivate_users_on_replace` | boolean | Controls what should happen to the defunct contact and user documents when a user is replaced. When `false`, the contact and user account will be deleted. When `true`, the contact will be unaltered and the user account will be assigned the role `deactivated`. This allows for account restoration.
`logoBase64` | Image in base64 | Logo image for your project

4. Add reference to your configuration folder(that you have just added above) in `src/config/config-factory.ts`. For example `import znzConfig from './chis-znz'`
5. Configure the `config.json` file.

#### ConfigProperty
The ConfigProperty is a data structure used several times within the `config.json` file and defines a property on an object. The ConfigProperty include:

Property | Type | Description
-- | -- | --
friendly_name | string | Defines how this data will be labeled in CSV files and throughout the user experience.
property_name | string | Defines how the value will be stored on the object.
type | ConfigPropertyType | Defines the validation rules, and auto-formatting rules. See [ConfigPropertyType](#configpropertytype).
parameter | any | See [ConfigPropertyType](#ConfigPropertyType).
required | boolean | True if the object should not exist without this information.

#### ConfigPropertyType
The `ConfigPropertyType` defines a property's validation rules and auto-formatting rules. The optional `parameter` information alters the behavior of the `ConfigPropertyType`.

| Type      | Validation Rules                                       | Auto Formatting Rules                                               | Validator                                                                                              | parameter     |
|-----------|--------------------------------------------------------|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|---------------|
| string    | Must be defined                                        | Removes double whitespaces, leading or trailing whitespaces, and any character which is not alphanumeric or ` ()\-'` | None                                                                                                   |
| name      | Must be defined                                        | Same as string + title case + `parameter` behavior                  | One or more regexes which are removed from the value when matched (eg. `"parameter": ["\\sCHU"]` will format `this CHU` into `This`) |
| regex     | Must match the `regex` captured by `parameter`         | Same as `string`                                                    | A regex which must be matched to pass validation (eg. `"parameter": "^\\d{6}$"` will accept only 6 digit numbers)     |
| phone     | A valid phone number for the specified locality        | Auto formatting provided by [libphonenumber](https://github.com/google/libphonenumber)          | Two letter country code specifying the locality of phone number (eg. `"parameter": "KE"`)             |
| generated | None. No user inputs.                                  | Uses [LiquidJS](https://liquidjs.com) templates to generate data    | None                                                                                                   | [Details](#The-Generated-ConfigPropertyType)
| select_one      | Single choice from a list of options            | Same as `string`                                                                                               | None                                                                                                   | Dictionary where the keys are the option values and the values are the corresponding labels |
| select_multiple | Multiple choice from a list of options          | Same as `string`                                                                                               | None                                                                                                   | Same as `select_one`    
| none      | None                                                   | None                                                                | None                                                                                                   |

#### The Generated ConfigPropertyType
ContactProperties with `type: "generated"` use the [LiquidJS](https://liquidjs.com) template engine to populate a property with data. Here is an example of some configuration properties which use `"type": "generated"`:

```json
{
  "place_properties": [
    {
      "friendly_name": "CHP Area Name",
      "property_name": "name",
      "type": "generated",
      "parameter": "{{ contact.name }}'s Area",
      "required": true
    }
  ],
  "contact_properties": [
    {
      "friendly_name": "CHP Name",
      "property_name": "name",
      "type": "name",
      "required": true
    }
  ]
}
```

The user will be prompted to input the contact's name (CHP Name). The user is _not_ prompted to input the place's name (CHP Area Name) because the place's name will automatically be assigned a value.  In this example, if the user puts `john` as the contact's name, then the place will be named `John's Area`.

The data that is passed to the template is consistent with the properties defined in your configuration.

Variable | Value
-- | --
place | Has the attributes from `place_properties.property_name` 
contact | Has the attributes from `contact_properties.property_name`
lineage | Has the attributes from `hierarchy.property_name` 


6. Develop locally
7. Deployment
    a. Set docker environment variables
8. Publishing new docker images

