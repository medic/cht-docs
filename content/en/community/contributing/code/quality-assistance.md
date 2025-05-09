---
title: "Quality Assistance"
linkTitle: "Quality Assistance"
weight: 15
description: >
  How the Quality Assistance process works
aliases: >
  /contribute/medic/product-development-process/quality-assistance
  /contribute/code/quality-assistance
---

{{< hextra/hero-subtitle >}}
  How the Quality Assistance process works
{{< /hextra/hero-subtitle >}}

## Goals
1. Software developers should have full ownership of what they are building, including quality.
1. The team still benefits from having the QA engineering mindset of QA engineers.
1. QA engineers automate more tests and processes.

## In Short
A software developer writes code and performs testing on that code where a QA engineer assists by recommending tests to perform and adding additional end-to-end tests.

## In Detail
A developer should be able to write code and release it when done. Doing that without testing would be reckless and it is expected that the developer also tests their code. The team wants both speed and quality where the former should not be done without the latter. This means slowing down a bit to make sure it’s right and checking your work when developing before it is done/reviewed/merged.

It isn’t always easy to test your own code though and it is common for a developer to have a happy-path mindset, more suited for thinking about what to build rather than how something might break. Fortunately there are QA engineers on the team who have the skills to think about the solution from the perspective of what might break.

It’s worth noting that the team also requires code reviews via GitHub pull requests. The intention of code reviews is not for the reviewer to test the code. The reviewer may optionally also do that, but it is expected that the author of the code has tested it fully before requesting a code review.

Once code is done, tested (by the developer) and reviewed, it is ready to merge and the developer can do so... almost (see [Getting There in Milestones](#getting-there-in-milestones)). 

## Getting There in Milestones
The aim is to get to a place where the developer of a change can do everything and merge without needing any extra permission. To make the process safer in getting to the final step, several parts will be followed. A process similar to what’s described [In Detail](#in-detail) is followed, while retaining an “AT” step similar to what the current process.

The big difference to that AT step though will be the depth in which it is performed. Rather than being a single exhaustive step where all testing is performed, it will be more like a smoke test where a QA engineer gets a little extra creative in testing.

There may still be cases of a ticket getting coded up totally unrelated to bigger initiative work, perhaps even unannounced to anyone. For work like this the traditional AT step is still appropriate for now. Still though, it is preferred for the software developer to get a QA engineer involved as early as possible; it helps us get the best contributions from everyone.

## An Example of QA Assistance in Practice
Imagine a scenario where a community member or a squad is going to change the display of the targets screen. The group would discuss the needs of the users and work out solutions, where the selected solution was to make this change. This discussion could involve project managers, designers, developers, and QA engineers. The developer would be thinking about how to code the proposed solution and the QA engineer would be considering that as well as what might go wrong.

In the case where a UI change is being made, a design will be created. At this point the group can see what is to be built. When meeting and discussing the user interactions with the designer the QA engineer can get some early ideas around test scenarios.

As code is written and pushed to a branch the QA engineer and developer talk about what is changing. Any misconceptions are cleared up and the QA engineer can start to assist the developer by pointing out areas that may be important or non-obvious to test. This could be as simple as noting challenges of different screen sizes or as complex as specific configurations that may need extra attention for how targets work.

That conversation (ideally multiple of these) is the “assistance”. It’s where the value of the QA engineering mindset is achieved. The developer still owns and tests their work; they just have a QA engineer to talk to so they can feel confident in their own testing.

Depending on the change the developer may work with the QA engineer where the QA engineer can contribute some automated end-to-end testing to the branch. Things should feel collaborative and not a division of labor or handing things off.

Once the developer has finished writing the code they test it a bit more and open a PR for a code review. The reviewer should be able to review the code with an assumption that it is well-tested already and the focus of the review can be around the code and implementation choices.

If any changes need to be made during the review process, the developer makes those changes and re-executes any relevant testing.

At this point the ideal action to take would be that the developer merges the finished code and no AT step happens, as the quality is already baked in from the start and throughout. This is the ideal setup yet to be achieved. Here the ticket still goes to AT, but for a smaller last bit of smoke testing. Notice that it is not an exhaustive set of tests, it is a small bit of extra poking around by a QA engineer. This limited testing is possible because the developer said it is done, and they said that because they tested it, and they had a QA engineer assist them to reach that level of confidence in their own testing.

The last part here is to merge it. That extra poking around should be quick, so the developer should be ready to click the green button soon!

## FAQ

{{% details title="Who checks if the right thing got built?" %}}

The community/squad members should be aware of what’s being built, why, and if it’s coming together as expected. That’s not to be solely delegated to a QA engineer to do. Developers should be working with the community and showing their work (demos, screenshots, etc). This should feel like a team collaborating to build useful working software, not an assembly line of disassociated parts.

{{% /details %}}

{{% details title="What if a developer is bad at testing?" %}}

That’s something to improve, not outsource to someone else. Even still, the QA engineer isn’t disappearing and they will still offer deeper advice on what tests the developer should perform.

{{% /details %}}

{{% details title="What will QA engineers do if not doing manual acceptance testing?" %}}

Automating more. That can be in more end-to-end tests for better regression testing, automating mobile device testing, adding better structures to enable the whole team to automate better, improving CI pipeline, etc.

{{% /details %}}

