---
title: Training
weight: 19
description: >
  Remotely train health workers
keyword: training
relatedContent: >
  building/training/training-cards
  building/training/training-cards-resources
  apps/examples/training
  apps/examples/learning-care/
---

*Training Cards* help health workers learn about changes to CHT apps remotely, directly in their app. Training content might include information about a newly deployed feature, changes to a [care guide]({{< relref "apps/concepts/care-guides" >}}), or simply a reminder about an underused feature or workflow. They are perfect for training on a very specific topic and are not meant to replace a comprehensive onboarding program.

[Template training content]({{< relref "building/training/training-cards-resources" >}}) for new CHT features is made available from time to time. These templates can be customized to the local context.

{{< figure src="training-deck.png" link="training-deck.png" class="col-12 col-lg-10" >}}
 

## Accessing

When health workers open or reload their app, configured training cards will automatically show on top of all other content in the app. If it is not a convenient time to complete the training, they can cancel out at any time and will be prompted again later whenever they open or reload their app (training will start from the beginning). 

{{% alert title="Note" %}} If there are multiple training sets configured to start on the same day, the CHT will determine the order alphabetically based on the form ID. Subsequent training sets will only be displayed once the previous ones are either completed or no longer valid AND the app is opened or reloaded again. {{% /alert %}}

## Completing

Health workers read through each card one by one in a predefined sequence, tapping “Next” on each card. When they are finished reading all cards, they tap “Submit” on the last card. The training set is now considered complete and they can continue using their app. Completed training sets show up on the [main list]({{< relref "apps/features/reports/#main-list" >}}) of the Reports tab and they won’t be asked to complete this set again. If there are additional training sets to complete, they will be shown the next time the app is opened or reloaded.

## Monitoring

As mentioned above, completed training sets will show up on the [main list]({{< relref "apps/features/reports/#main-list" >}}) of the Reports tab. These reports are available in [analytics]({{< relref "apps/features/supervision/#supervisor-dashboards" >}}), [aggregate targets]({{< relref "apps/features/supervision/#chw-aggregate-targets" >}}) , and can trigger supervision workflows and [tasks]({{< relref "apps/features/supervision/#supervisor-tasks" >}}).

## Configurability
Training cards can be shown to any user associated to a contact. A “set” of training cards represents a collection of individual training cards, generally covering a single training topic. The list below highlights some of the key areas of customization:

- Number of sets
- Number of cards in a set
- Content of each individual card (text, images, etc…)
- When health workers will start seeing a set (specific start date)
- How long the set will be available (# of days, relative to the start date)
- Which users will see the set (based on user roles)
