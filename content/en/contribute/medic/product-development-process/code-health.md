---
title: "Code Health"
linkTitle: "Code Health"
weight: 6
description: >
  How to keep the code and systems up-to-date
---

Healthy code is code that is easy to understand and update. Over time all code becomes less healthy as dependencies become out of date, new language features or code style rules are introduced, and changes are made that add complexity. This is sometimes referred to as technical debt as it makes it progressively harder to make new code changes. No project is ever completely healthy, so we need an ongoing process to improve the least healthy parts of the code so the CHT can be sustainable long term.

A good way to differentiate code health improvements from other changes is if it's something that a user won't notice, then it's code health. Because no user will ever ask for the change to be made they need to be managed outside of the usual prioritisation process.

A good guideline is to spend 25% of your time improving code health, which can be split up into three distinct categories: Tidying, Cards, and Projects.

### Tidying

These are the smallest improvements and should be part of your work every week. Engineers can decide what tidying they want to prioritize and don't need any approval to do the work, but it will need to go through [Code Review]({{% ref "/contribute/code/workflow#code-reviews" %}}) to ensure a teammate agrees it's an improvement.

If the tidying is unrelated to other issues you're working on then to make the review easy you should create a new issue, branch, and PR for the tidying work. However if the tidying will conflict or block development of your other work, then use your best judgement about how to proceed in whatever way is easiest for you and your reviewer. Some options are: a) in the same commit if the change is small, b) a separate commit in the same branch if the changes are codependent, c) two branches with one referencing the other.

Examples of appropriate tidying are increasing code reuse, improving readability, reducing complexity, updating a dependency, removing deprecated calls, and increasing test coverage.

Tidying should take around 10% of your time, or 4 hours a week.

### Cards

These are mid-sized improvements and are worked on every quarter. Focused Groups and Product Leadership work together to decide which cards to prioritise and include in the FGs OKRs. The FG is then responsible for ensuring the improvements get scheduled and delivered just like other work.

Cards should take around 10% of your time, or 6 days per quarter.

#### How Cards work in practice

A Focused Working Group is building a feature aligned with a quarterly OKR. When the feature is shipped, you may need to wait a week to see results from CHWs. The PM/PO goes through a list of tickets for code health and reviews them with the team. After aligning with the PM/PO, software developers and QA engineers start working on those tickets, tracking progress on the [GitHub board](https://github.com/orgs/medic/projects/134/views/1).

During this time almost all attention, from all engineers in the Focused Working Group, is on heads-down coding on code health tasks. There may still be some other tasks going on like user interviews or initial measurements of the newly deployed feature.

At the end of the week, the team realigns around work towards the chosen outcome. Code health work should be merged and the full focus of the team is together with the PM/PO on delivering improvements for users. It may be the case that a code health task cannot yet be merged. If that is the case, other developers on the Focused Working Group should assist to get it complete so everyone can stay together in what is being worked on.

### Projects

Projects are large refactors that are therefore expensive and risky to undertake. These need to be discussed with Product and Medic leadership and will likely require deep analysis and prototyping to verify the approach.

Examples of projects are upgrading from AngularJS to Angular, rewriting cht-couch2pg as cht-sync, and switching from medic-os to containerized deployment.

Projects should take around 5% of your time, or one project every few years.

## More info

This policy was inspired by a blog post about [technical debt at Shopify](https://shopify.engineering/technical-debt-25-percent-rule).
