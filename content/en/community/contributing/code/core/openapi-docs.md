---
title: "Documenting REST API"
linkTitle: "Documenting REST API"
weight: 9
description: >
  How the CHT REST API reference documentation is built, published, and rendered
---

The [REST API reference page](/building/reference/api/) renders an OpenAPI 3.1 specification produced by `cht-core`.

## Pipeline overview

1. OpenAPI configuration lives alongside the route definitions in [cht-core](https://github.com/medic/cht-core) as JSDoc comments on the API controller functions.
2. The `build-documentation` npm script compiles, lints, and validates the annotations, writing the result to `shared-libs/cht-datasource/docs/openapi.json`.
3. A GitHub Action in cht-core publishes that `openapi.json` on every commit to the `master` branch.
4. The Swagger shortcode on the [REST API reference page](/building/reference/api/) loads the latest published version by default.

## Adding or updating API endpoints

When adding or modifying an endpoint in cht-core, the OpenAPI configuration for the endpoint must be updated in the same pull request. The [controller](https://github.com/medic/cht-core/tree/master/api/src/controllers) function for the endpoint must have a JSDoc comment, annotated with `@openapi`, containing the `yaml` structure of the OpenAPI configuration for that operation. Once the configuration has been added to the comment:

1. Run `npm run build-documentation` from the cht-core repository root.
2. Review the linter output and fix any validation errors.
3. Commit the changes to the controller file. (Do not commit the generated `shared-libs/cht-datasource/docs/openapi.json` file.)

Once the pull request merges to `master`, the cht-core GitHub Action publishes the updated spec. The docs site automatically picks up the updated version. No changes to cht-docs are necessary.

### Tags

On the [REST API reference page](/building/reference/api/), the operations are grouped according to their configured `tags` value. Conventionally, each operation must have one `tags` value. Each new tag that is used must also be defined with a `name` and `description` in the top-level `tags` configuration. Conventionally, this is done [in a top-level JSDoc comment](https://github.com/medic/cht-core/blob/f8fe649aa5fb1601a504c764942f262412dc4538/api/src/controllers/person.js#L15) in the controller file. 

### CHT-specific extensions

The Swagger shortcode renders two [OpenAPI specification extensions](https://swagger.io/docs/specification/openapi-extensions/) as badges on each operation:

- `x-permissions` — the permissions required to call the endpoint. The value is an object with `hasAll` (all permissions required) and/or `hasAny` (at least one required). For example:
    ```json
    {
      "x-permissions": {
        "hasAll": ["can_view_contacts"],
        "hasAny": ["can_edit", "can_create_people"]
      }
    }
    ```
- `x-since` — the CHT version in which the endpoint was added, as a string (for example, `"v4.10.0"`).

### Including schema references in OpenAPI configuration

Special `$ref` values can be used in the OpenAPI `yaml` config to reference reusable component schemas. This prevents excessive duplication of schema definitions. Referenced schema components can be defined in several ways:

#### Locally – in the controller

Components only relevant to a particular controller are conventionally defined [directly in a top-level JSDoc comment](https://github.com/medic/cht-core/blob/f8fe649aa5fb1601a504c764942f262412dc4538/api/src/controllers/users.js#L182) in the controller file.

#### Globally – in the generation script

Components that are reused across many endpoints can be defined [in the generation script](https://github.com/medic/cht-core/blob/f8fe649aa5fb1601a504c764942f262412dc4538/scripts/build/generate-openapi.js#L49)

#### cht-datasource type definitions

Endpoints that accept/return data defined by cht-datasource types can leverage schema components automatically created for these types. The `$ref` path for these components is `#/components/schemas/${versionNamespace}.{typeName}`. For example, the OpenAPI config for the `GET /api/v1/person/{id}` endpoint [references the `#/components/schemas/v1.Person` schema](https://github.com/medic/cht-core/blob/f8fe649aa5fb1601a504c764942f262412dc4538/api/src/controllers/person.js#L46) which is automatically produced from the type information [in the `v1.Person` interface](https://github.com/medic/cht-core/blob/f8fe649aa5fb1601a504c764942f262412dc4538/shared-libs/cht-datasource/src/person.ts#L28). Changes to the `v1.Person` interface in cht-datasource will automatically be included in the OpenAPI configuration.

> [!NOTE]
> The list of cht-datasource files containing types to include is currently [hardcoded in the generation script](https://github.com/medic/cht-core/blob/f8fe649aa5fb1601a504c764942f262412dc4538/scripts/build/generate-openapi.js#L13). When a new data type is added to cht-datasource in a different file, the script must be updated to include that new file. (New types added _to existing files_ will be automatically picked up without changes to the script.)

## Deep linking to API docs

Deep links to specific endpoint operations on the [REST API reference page](/building/reference/api/) follow a predictable format: `/building/reference/api/#/${tag}/${operationId}`.  The `tag` and `operationId` values are determined by the OpenAPI configuration for the endpoint. For example, the `GET /api/v1/person/{id}` endpoint has `tags: [Person]` and `operationId: v1PersonIdGet`, so the deep link to that operation is `/building/reference/api/#/Person/v1PersonIdGet`.

Unfortunately, because the contents of the API reference page are generated at runtime, the internal link validation process cannot validate deep links to that page. Because of this, validation for links to that page has been disabled by setting the `skipIncomingLinkValidation: true` property in the front-matter.

## Previewing changes locally

To render an in-progress `openapi.json` when running the cht-docs side locally, follow these steps:

1. In cht-core, run `npm run build-documentation` to regenerate `cht-core/shared-libs/cht-datasource/docs/openapi.json`.
2. Copy that file to `cht-docs/assets/openapi.json`.
3. From the cht-docs root, start the dev server with `hugo server` (or `docker compose up`).
4. Open [`/building/reference/api/`](/building/reference/api/) in the browser — the page renders the local copy.

To revert to the published version, delete `cht-docs/assets/openapi.json` and restart the dev server.

> [!NOTE]
> The `cht-docs/assets/openapi.json` file is for local preview only. Do not commit it — the production build references the spec published by cht-core.

## Reference

- [OpenAPI Specification 3.1.0](https://spec.openapis.org/oas/v3.1.0) — the authoritative specification.
- [OpenAPI Guide](https://swagger.io/docs/specification/v3_0/about/) — a walkthrough of the available configuration options with examples.
