---
title: "Getting started with writing Application Tests"
linkTitle: "Getting Started"
weight: 1
description: >
 Getting started with writing automated integration tests for CHT Applications
---

[`Medic Test Harness`](http://docs.communityhealthtoolkit.org/medic-conf-test-harness/) is used to write automated integration tests for CHT Applications in combination with [`Mocha test framework`](https://mochajs.org/) and [`Chai`](https://www.chaijs.com/) assertion library

### Follow the following steps to get started
- Install the necessary tools: `$ npm install --save chai mocha medic-conf-test-harness`
- Create a folder named `test` where you will store all your tests
- Create npm scripts for running your tests by adding the following to package.json:
```zsh
"scripts": {
    "test": "npm run compile-forms && npm run compile-app-settings && npm run unittest",
    "compile-app-settings": "npx medic-conf --no-check compile-app-settings",
    "compile-forms": "npx medic-conf --no-check convert-app-forms convert-contact-forms",
    "unittest": "mocha  test/**/*.spec.js --timeout 15000 --slow 500",
  },
```
- You will be able to run the scripts using `npm run test`. This will include convertion of forms and compilation of app settings.
- Create dummy contacts that you will use during the testing. For a default contact contact copy [`harness.defaults.json.example`](https://github.com/medic/medic-conf-test-harness/blob/master/harness.defaults.json.example) as `harness.defaults.json` and save to your config folder.

### Example
```zsh
const { expect } = require('chai');

const Harness = require('medic-conf-test-harness');
const harness = new Harness({ verbose: true });

describe('An Example of a test', () => {
  before(async () => { return await harness.start(); });
  after(async () => { return await harness.stop(); });
  beforeEach(async () => { return await harness.clear(); });
  afterEach(() => { expect(harness.consoleErrors).to.be.empty; });

  const formName = 'my_form';
  it(`${formName} can be loaded`, async () => {
    await harness.loadForm(`app/${formName}`);
    expect(harness.state.pageContent).to.include(`id="${formName}"`);
  });

  it('unit test confirming no pnc followup', async () => {
  // Load the pnc_followup form and fill in 'no' on the first page and 'no' on the second page
  const result = await harness.fillForm('pnc_followup', ['no'], ['no']);

  // Verify that the form successfully got submitted
  expect(result.errors).to.be.empty;

  // Verify some attributes on the resulting report
  expect(result.report.fields).to.deep.include({
    patient_name: 'Patient Name',
    s_pnc_visits: {
      s_pnc_visit: 'no',
      s_pnc_planned_date_show: '',
      s_pnc_date_show: '',
    },
    next_pnc: {
      s_next_pnc: 'no',
      next_pnc_date: '',
    }
  });
});
});
```
