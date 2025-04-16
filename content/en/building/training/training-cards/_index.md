---
title: "Training Cards"
weight: 2
description: >
  Remotely train health workers
keyword: training
relatedContent: >
  building/training/training-cards-resources
  reference-apps/training
  reference-apps/learning-care/
aliases:
   - /building/features/training/
   - /apps/features/training/
---

_Introduced in 4.2.0_

*Training Cards* help health workers learn about changes to CHT apps remotely, directly in their app. Training content might include information about a newly deployed feature, changes to a [care guide]({{< relref "building/concepts/care-guides" >}}), or simply a reminder about an underused feature or workflow. They are perfect for training on a very specific topic and are not meant to replace a comprehensive onboarding program.

[Template training content]({{< relref "building/training/training-cards-resources" >}}) for new CHT features is made available from time to time. These templates can be customized to the local context.

{{< figure src="training-deck.png" link="training-deck.png" class="col-12 col-lg-10" >}}


## Accessing

When health workers open or reload their app, configured training cards will automatically show on top of all other content in the app. If it is not a convenient time to complete the training, they can cancel out at any time and will be prompted again the next day they open their app (training will start from the beginning).

{{% alert title="Note" %}} If there are multiple training sets configured to start on the same day, the CHT will determine the order alphabetically based on the form ID. Subsequent training sets will only be displayed once the previous ones are either completed or no longer valid the next day the app is opened. {{% /alert %}}

Training materials can also be accessed in the training page found in the auxiliary menu for users to revisit as needed. Completed training is displayed with a green checkmark. _Added in 4.15.0_.

{{< figure src="training-materials-page.png" link="training-materials-page.png" class="col-10 col-lg-10" >}}

## Completing

Health workers read through each card one by one in a predefined sequence, tapping “Next” on each card. When they are finished reading all cards, they tap “Submit” on the last card. The training set is now considered complete and they can continue using their app. Completed training sets show up on the [main list]({{< relref "building/features/reports/#main-list" >}}) of the Reports tab and they won’t be asked to complete this set again. If there are additional training sets to complete, they will be shown the next day the app is opened.

## Monitoring

As mentioned above, completed training sets will show up on the [main list]({{< relref "building/features/reports/#main-list" >}}) of the Reports tab. These reports are available in [analytics]({{< relref "building/features/supervision/#supervisor-dashboards" >}}), [aggregate targets]({{< relref "building/features/supervision/#chw-aggregate-targets" >}}) , and can trigger supervision workflows and [tasks]({{< relref "building/features/supervision/#supervisor-tasks" >}}).

## Configurability
Training cards can be shown to any user associated to a contact. A “set” of training cards represents a collection of individual training cards, generally covering a single training topic. The list below highlights some of the key areas of customization:

- Number of sets
- Number of cards in a set
- Content of each individual card (text, images, etc…)
- When health workers will start seeing a set (specific start date)
- How long the set will be available (# of days, relative to the start date)
- Which users will see the set (based on user roles)
