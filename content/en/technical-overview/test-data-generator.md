---
title: "Test Data Generator for CHT Test Instances"
linkTitle: "Test Data Generator"
weight: 11
aliases:
   - /core/overview/test-data-generator/
---

{{< hextra/hero-subtitle >}}
  A tool for CHT developers to design, generate, and push CouchDB docs tailored to project hierarchies and reports
{{< /hextra/hero-subtitle >}}

{{< callout type="error" >}}
  It is not recommended to use this tool to push data into production instances.
{{< /callout >}}

Design the test data that fits your project hierarchy and reports. The tool will generate CouchDB docs and push them into your CHT test instance.

## Technologies and Packages Used

- TypeScript
- Axios
- UUID
- Faker

## Minimum System Requirements 

- npm >= 10.2.4
- node >= 20.11.0

## Setup and Getting Started

Instructions on setting up the project and getting it running on a local machine:

1. Set the `COUCH_URL` environment variable to point to your test instance, for example: `http://[user]:[pass]@[host]:[port]/medic`
1. Double-check your CHT test instance is running
1. Clone or fork the [test data generator repository](https://github.com/medic/test-data-generator)
1. Install and build the project by running `npm ci` in the project root folder
1. Design the test data in a custom JavaScript file. See section on [designing test data](#designing-test-data).
1. Build, generate data and upload by running `npm run generate *path_to_your_custom_design_file*`

### Install test data generator globally
Another option is to install the tool globally:
1. Install package dependencies and build the project `npm ci`
1. Run `npm install -g` in the project root folder
1. Build, generate and upload data by running `tdg <path_to_your_custom_design_file>`.

### Use it with Docker
The tool is also available in Docker:
1. Create the image `docker build -t test-data-generator .`
1. Run the container `docker run --rm -it -v <folder_path_of_your_design_file>:/app/test-data -e COUCH_URL=<test_instance_CouchDB_URL> -e FILE=<your_design_file> test-data-generator`

## Designing Test Data

Steps to design the test data:

1. Create a custom JavaScript file that exports a `default` function. This function should match the [`DocDesign` type](https://github.com/medic/test-data-generator/blob/main/src/doc-design.ts).
2. Your custom function should return an array of [`DesignSpec`](https://github.com/medic/test-data-generator/blob/main/src/doc-design.ts) objects that define the structure of the data to be created.
3. Generate and upload data `npm run generate *path_to_your_custom_design_file*`. That's all! You can check the data in the CHT's CouchDB.

Note that `getDoc` function should return an object with at least a `type: string`. Remember that `type` is a `data_record` for reports, but when it comes to contacts, use the `contact_types` defined in your CHT project's `app-settings.json` file. 

### Example
```js
import { faker } from '@faker-js/faker'; // API Reference: https://fakerjs.dev/api

export default (context) => {
  return [
    {
      amount: 14, // This creates 14 reports
      getDoc: () => ({
        type: 'data_record',
        form: 'pregnancy_facility_visit_reminder',
        fields: {
          patient_name: faker.person.firstName(),
        },
      }),
    },
    {
      amount: 10, // This creates 10 hospitals
      getDoc: () => ({
        type: 'district_hospital',
        name: `${ faker.location.city() }'s hospital`,
      }),
      children: [
        {
          amount: 5, // This creates 5 people per each hospital
          getDoc: () => ({
            type: 'person',
            name: faker.person.firstName(),
          }),
        }
      ]
    },
  ];
}
```

Based on the example above, the tool will create and push 14 report docs at once (the `amount` is also the batch size pushed into the CHT instance), it then creates 10 hospitals docs, and lastly creates 5 people docs for each hospital (it's sent in groups of 5 docs to the CHT instance).

See the [sample-designs](https://github.com/medic/test-data-generator/tree/main/sample-designs) folder for more examples.

## Performance considerations

Many factors can affect the performance of the generator including the number of documents to generate, the size of the documents, the network speed, and the server's performance. When adding large datasets (100,000+ documents) to a database with existing views (e.g. the `medic` database), Couch's view indexing jobs can significantly impact the performance of the generator.

Under optimal conditions, running against a local CouchDB instance and inserting data into a new database with no views, the document creation rate has been measured at `~360,000 docs/min`.  

However, when running against a local CouchDB instance and inserting data into an existing `medic` database, the measured document creation rate was `~8000 docs/min`.

### Generate then replicate

When generating a massive dataset (100,000+ documents) for an existing database with views (e.g. the `medic` database), it is advisable to generate the data into a temporary database (on the same CouchDB instance) and then replicate the data into the target database (for example, using the Fauxton form at `_utils/#/replication/_create`). The document creation rate for this process (including generating into the temp DB, replicating to `medic` DB, and indexing views) has been measured at `~11,000 docs/min`.

While the speed gains of this approach are somewhat modest, it has a couple additional benefits:

- The time spent running the actual generation script is minimal (since docs are added to the temp db at `~360,000 docs/min`). Therefore, there is less risk of the script being interrupted or becoming disconnected from the CouchDB instance. 
Once all the docs are saved in the temp DB, the replication/indexing happens internally within the Couch instance. This is where the vast majority of the time is spent.
- You can keep your generated dataset in the temp DB for future use, without having to regenerate it each time you want to test with it.
