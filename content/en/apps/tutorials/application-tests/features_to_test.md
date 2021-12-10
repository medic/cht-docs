---
title: "Common features of the app that require automated testing"
linkTitle: "Features to test"
weight: 2
description: >
 Common features of the CHT App that require automated testing.
relatedContent: >
  apps/reference/forms/
  apps/reference/contact-page/
  apps/reference/tasks/
  apps/reference/targets/
---

- ### Contact summary
You will write tests for the contact summary to assert the expected behaviour of the contact summary. This will target the context, fields and the cards. The contact summary object can be accessed using the method `harness.getContactSummary()`. The code snippet below asserts the number of expected fields in a contact summary:
```zsh
it('fields', async () => {
  const contact_summary = await harness.getContactSummary();
  expect(contact_summary.fields.length, 'Expect 6 fields').to.be.equal(6);
});
```
- ### Forms
You will write tests for mainly app forms to ensure consistent output for given scenarios. This will be helpful especially if there are complex calculations in the form that affect tasks, targets and output to the user. Forexample if there is a calculation in an assessment that determines if a child should be given malaria treatment, we can have an `input` filled in for a form  `assessment` that has a calculated field `treat_malaria`
```zsh
it(`Treatment expected for malaria`, async () => {
  const result = await harness.fillForm('assessment', ...input);
  expect(result.errors).to.be.empty;
  expect(result.report.fields).to.nested.include({ treat_malaria: 'yes' });
});
```
- ### Tasks
Tests for tasks will focus on ensuring that the configured tasks are tiggered in the expected timeframe and resolved as per defined. You will use `harness.getTasks()` to access simulated tasks. Use `harness.setNow()` to set current simulated time and `harness.flush()` to adjust the time. See below for an example of a test of a referral follow up task.

```zsh
it('Assessment yields referral task on day 1 and resolves after follow up is completed', async () => {
  const result = await harness.fillForm('assessment', ...input);
  expect(result.errors, 'Error filling form').to.be.empty;
  
  await harness.flush(1);

  const tasks = await harness.getTasks({ actionForm: 'referral_follow_up' });
  expect(tasks).to.have.property('length', 1);
  
  const followup = await harness.fillForm('referral_follow_up',...followUpInput);
  expect(followup.errors).to.be.empty;
  
  expect(await harness.getTasks({ actionForm: 'referral_follow_up' })).to.be.empty;
});
```
- ### Targets
Tests for targets will ensure that a target increments as per its definition. Use `harness.getTargets()` to access simulated targets. See below an example test for a target of id `assessments-u1` that is expected to increment for  `input` applied to `assessment` form
```zsh
it('U1 Sick Child Assessments target increments for child assessment report', async () => {
  await harness.fillForm('assessment', ...input);
  
  const targets = await harness.getTargets({
    type: 'assessments-u1'
  });
  expect(targets.length, 'Exactly 1 target is expected').to.be.equal(1);
  expect(targets[0].value, 'Target didnt increase value').to.include({ total: 1 });
});
```
