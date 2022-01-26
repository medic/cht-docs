---
title: "Application Tests"
linkTitle: "Application Tests"
weight: 15
description: >
  Guides for writing automated tests for CHT applications
---

{{% pageinfo %}}
This tutorial will take you through testing the various configurable components of CHT applications.

{{% /pageinfo %}}

## CHT Application Testing

---

CHT applications are configurable to a great extent. Depending on the number and the complexity of the app components, it can take a lot of time and effort to test them manually. Some components such as tasks behave differently over time and are particularly difficult to test. As the project evolves, the configuration is often updated with new components and changes are made to the existing components. After each change, we need to test not only the new components but also the old ones to make sure that nothing is broken. To facilitate the testing process, we encourage the app builders to write automated tests for their app using [cht-conf-test-harness](http://docs.communityhealthtoolkit.org/cht-conf-test-harness/).

Using cht-conf-test-harness, we write tests and run them with [Mocha](https://mochajs.org/) testing framework to test the behavior of different components in a CHT application. We use the [chai library](https://www.chaijs.com/), but other assertion libraries can also be used.

## Preparing

Adding tests for CHT apps requires a good understanding of the project workflows and requirements. It is encouraged that the tests be written as part of the app-building process. To test using cht-conf-test-harness, there are a few things we need to set up first.
1. If your **package.json** does not already have them, add cht-conf-test-harness, chai, and mocha: 
`npm install --save cht-conf-test-harness chai mocha`
2. Also, add the following scripts to package.json, if not already present:

```json
"scripts": {
    "test": "npm run compile-forms && npm run compile-app-settings && npm run unittest",
    "compile-app-settings": "npx cht --no-check compile-app-settings",
    "compile-forms": "npx cht --no-check convert-app-forms convert-contact-forms",
    "unittest": "mocha test/**/*.spec.js --timeout 20000"
  }
```

After adding these scripts, you will be able to run the tests using:

* `npm test`: compile, convert app forms, and then test (recommended)
* `npm run unittest`: test only

3. Create a folder in the project root where you keep the tests. You can name it anything. For convenience, we will name it as **test**.
4. Create a file **harness.defaults.json** at the root of your project. This is the default configuration file for the harness. Here you can specify the default user, preloaded contacts and reports, and other settings. Here's an [example](https://github.com/medic/cht-conf-test-harness/blob/master/harness.defaults.json.example) from its repo.


## Writing a test for CHT App

We start by adding a file where a group of related tests are written. It is customary to keep one test file per individual unit of the component. For example, in the default config, all tests for the pregnancy form are in the [pregnancy.spec.js](https://github.com/medic/cht-core/blob/master/config/default/test/forms/pregnancy.spec.js) file.

Some relevant sections from a typical test file are discussed here:


```js
const TestRunner = require('cht-conf-test-harness');
const harness = new TestRunner();
```


We get an instance of `harness` once and use it throughout the test file.

We can also pass options to the `TestRunner()` when instantiating:
```js
const harness = new TestRunner({ verbose: true });//Gives detailed console logs
```

Other common options are:
1. `{ headless: false }` -  Passed to [puppeteer](https://developers.google.com/web/tools/puppeteer/get-started#default_runtime_settings), launches browser with GUI. Helpful to see how the form is getting filled.
2. `{ harnessDataPath: 'harness.clinic.json'}`: Specify different confguration

You can find more harness options and examples [here](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html).


We need to start the harness before running tests and need to stop it after use. We can place these statements in `before()` and `after()` hooks of the test suite.
```js
describe(PNC form tests', () => {
  before(async () => { return await harness.start(); });
  after(async () => { return await harness.stop(); });
```

Any logic that you want to execute before and after each test can be placed in the `beforeEach()` and `afterEach()` hooks. Here, before each test run, we clear the state of the harness and set the date to a fixed value.
```js
  beforeEach(
    async () => {
      await harness.clear();
      await harness.setNow('2000-01-01');
    });
```

Similarly, after each test run, we assert that there are no errors in the console.
```js
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });
```

Here is a test case for [PNC followup form](https://github.com/medic/cht-conf-test-harness/blob/master/test/collateral/forms/app/pnc_followup.xml):


```js {linenos=table}
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
```

In line 3 above, the method [harness.fillForm()](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html#fillForm) fills the specified form with the given input.

Depending on the form design, the number of inputs (answers) to be filled can be large and span across many pages. It doesn't look good if we keep them inline. The inputs are often repeated within a single test or across multiple tests with little to no variation. It is a good idea to keep them in a separate file and refer them from the tests as required. We can also introduce some variations in the inputs using function parameters.

Example: `form-inputs.js`
```js {linenos=table}
module.exports = {
  pncFollowups: {
    healthy: [
      ['no'],
      [...Array(13).fill('no')]
    ],
    birth: (birthDate, pncDate) => [
      ['yes'],
      [birthDate, 'home'],
      [pncDate],
      [...Array(13).fill('no')]
    ]
  }
}
```

Test file where we use the inputs from the `form-inputs.js` file above:
```js
const { pncFollowups } = require('./form-inputs');
...
const result = await harness.fillForm('pnc_followup', ...pncFollowups.birth('2000-01-01', '2000-02-01'));
```

The test files are usually grouped in folders to access and run them easily. One way of grouping them is by creating folders for each of the components that can be tested: forms, contact summary, tasks, and targets.

![alt_text](tests-dir.png "Test directory structure")

### Forms

<table>
  <tr>
   <td>Minimum
   </td>
   <td>Filling a form with the most common options should not result in any error.
   </td>
  </tr>
  <tr>
   <td>Ideal
   </td>
   <td>All input combinations and constraints are tested with the report fields.
   </td>
  </tr>
</table>

When building a CHT app, we generally build a form first before moving into other components. So it makes sense that we test them before anything else.

We have already tested an app form in the previous example. More test cases can be added by changing the inputs.

We can also test contact forms using test harness. To fill a contact form, we use <code>[fillContactForm(contactType, …answers)](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html#fillContactForm)</code>

Example:
```js {linenos=table}
const result = await harness.fillContactForm(
  'district_hospital',
  ['new_person', 'William Mars', '1990-08-06', '+1234567891', 'female'],
  ['yes']
);
expect(result.errors).to.be.empty;
expect(result.contacts).excluding(['_id', 'meta']).to.deep.eq([
  {
    ...
  }
]);
```

We can also test the field constraints. For example, here we assert that the form does not accept birth date in the future:
```js {linenos=table}
it(`Throws validation error when birth date is in future`, async () => {
  const result = await harness.fillForm('delivery', ['yes', '2000-01-02']);
  expect(result.errors.length).to.equal(1);
  expect(result.errors[0]).to.include({
    msg: 'Date cannot be in the future!'
  });
});
```


Note: If there is a task triggered by a form, some use cases of the form can be tested when testing the task later.

---
### Contact Summary

<table>
  <tr>
   <td>Minimum
   </td>
   <td>Fill each contact form and count the number of fields in the contact summary
   </td>
  </tr>
  <tr>
   <td>Ideal
   </td>
   <td>Targeted tests for calculations of context, fields, cards, etc.
   </td>
  </tr>
</table>


Contact summary consists of visible components such as [cards](https://docs.communityhealthtoolkit.org/apps/reference/contact-page/#condition-cards), [fields](https://docs.communityhealthtoolkit.org/apps/reference/contact-page/#contact-summary) and a hidden component: [context](https://docs.communityhealthtoolkit.org/apps/reference/contact-page/#care-guides). All these can be tested with the test harness.

We use [harness.getContactSummary()](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html#getContactSummary) method to get the [ContactSummary ](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/global.html#ContactSummary)object, which has these properties: fields, cards, and context.

Examples:

Testing `contactSummary.fields`:
```js {linenos=table}
const contactSummary = await harness.getContactSummary();
expect(contactSummary.fields).to.have.property('length', 3);
expect(contactSummary.fields.filter(f => f.filter !== 'lineage')).to.deep.equal(
    [
      { label: 'person.field.phone', value: '+1234567891', width: 4, filter: 'phone' },
      { label: 'person.field.alternate_phone', value: '+1234567892', width: 4, filter: 'phone' },
      { label: 'contact.age', value: 12, width: 4 }
    ]
  );
```


Testing `contactSummary.cards`:
```js {linenos=table}
const contactSummary = await harness.getContactSummary();
expect(contactSummary.cards).to.have.property('length', 1);
const activePregnancyCard = contactSummary.cards[0];
expect(activePregnancyCard).to.have.property('label', 'contact.profile.pregnancy.active');
const fields = activePregnancyCard.fields;
expect(fields).to.have.property('length', 2);
expect(fields[0]).to.deep.equal(
  {
    'label': 'Weeks Pregnant',
    'value': 21,
    'width': 6
  });
```

Testing `contactSummary.context`:
```js {linenos=table}
const summaryContext = harness.getContactSummary().context;
expect(summaryContext).to.include({
  pregnant: true
});
```
---

### Tasks

<table>
  <tr>
   <td>Minimum
   </td>
   <td>Trigger and resolve the task
   </td>
  </tr>
  <tr>
   <td>Ideal
   </td>
   <td>One test for each user scenario <br/>
Code coverage for any arc with an external dependency<br/>
Negative cases - confirm tasks don’t trigger
   </td>
  </tr>
</table>


When testing the tasks manually, we need to fill a form, then either change the system date to move forward in time or change the reported date of the document to see the task. This is very tedious and unreliable. Using the test harness, we can quickly test the tasks under different scenarios and at different simulated dates.

Every task has a source that is either a contact document or a report document. When testing, we can mock the source document but it is risky and can lead to bugs missed. The recommended way is to fill the source form and then proceed with checking the associated tasks.

Commonly used harness methods when testing tasks are:

[`harness.setNow()`](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html#setNow): Set the current mock-time of the harness.

[`harness.flush()`](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html#flush): Increment the current time by an amount

[`harness.getTasks()`](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html#getTasks): Check which tasks are visible

[`harness.loadAction()`](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html#loadAction): Simulates the user clicking on an action

With `getTasks()`, we get an array of [`Task`](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/global.html#Task) objects which corresponds to the [tasks schema](https://docs.communityhealthtoolkit.org/core/overview/db-schema/#tasks).


```js {linenos=table}
it('followup schedule', async () => {
  const result = await harness.fillForm(...pncFollowups.registerBirth('2000-01-01', '2000-02-01'));
  expect(result.errors).to.be.empty;

  /* Task should appear 7 days after birth for follow up */
  await harness.flush(7);
  const tasks = await harness.getTasks();
  expect(tasks).to.have.property('length', 1);
   
  /* Complete the task, task should disappear */
  await harness.loadAction(tasks[0].emission.actions[0]);
  const followupResult = await harness.fillForm(...pncFollowups.followup.healthy);
  expect(followupResult.errors).to.be.empty;
  expect(await harness.getTasks()).to.be.empty;

  /* Confirm a task appears again on the schedule */
  await harness.flush(21);
  expect(await harness.getTasks()).to.have.property('length', 1);
});
```

Sometimes, we [pass other data](https://docs.communityhealthtoolkit.org/apps/guides/tasks/pass-data-to-form/) from a task to the action form using [modifyContent ](https://docs.communityhealthtoolkit.org/apps/guides/tasks/pass-data-to-form/#modifycontent)attribute of a task. We can also check these data.


```js
    expect(tasks[0].emission.actions[0].content).to.include({
      t_follow_up_count: '5',
      t_delivery_date:'2000-01-01',
    });

```
--- 
### Targets

Testing a target is relatively straightforward. We add a report or contact that increments a target, then we check the target values.

<table>
  <tr>
   <td>Minimum
   </td>
   <td>Trigger incrementing of the target <br/>
Ensure target doesn’t increment when it shouldn’t
   </td>
  </tr>
  <tr>
   <td>Ideal
   </td>
   <td>One test for each user scenario
<p>
Ensure proper deduplication (particularly for those with emitCustom)
   </td>
  </tr>
</table>


[`harness.getTargets`](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html#getTargets): Check the state of targets

It returns [`Target`](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/global.html#Target) object which corresponds to the [targets schema](https://docs.communityhealthtoolkit.org/core/overview/db-schema/#targets).


```js {linenos=table}
it('home visit done today should be counted', async () => {
  const result = await harness.fillForm('home_visit', formInputs.homeVisits.today);
  expect(result.errors).to.be.empty;

  const targets = await harness.getTargets({ type: 'home_visits' });
  expect(targets[0]).to.nested.include({
      'value.total': 1,
  });
});
```


For targets with type percentage, we might want to check more properties:

```js
expect(targets[0]).to.nested.include({
  'value.pass': 1,
  'value.total': 1,
  'value.percent': 100
});
```
---
### Tests for helper functions
If you have added [helper functions](https://docs.communityhealthtoolkit.org/apps/reference/tasks/#tasks-with-functions), it can be a good idea to test them separetely.

```js
  describe('toISODateString', () => {
    const { toDateString } = noolsExtras;

    it('parses a valid date', () => {
      const actual = toISODateString('01/01/2000');
      expect(actual).to.eq('2000-01-01');
    });
```
### Tests for bug fixes
When fixing a bug, we should write a test which captures the specific scenario being fixed.
- At least one test should fail before the fix
- It should pass after the fix

This will prevent the regression and ensure that you're fixing what you expect.


