---
title: "Training Cards Resources"
linkTitle: "Training Cards Resources"
weight: 3
description: >
  Training cards for CHT
keyword: training
relatedContent: >
  building/training/training-cards
aliases:
   - /building/guides/training/training-cards-resources/
   - /apps/guides/training/training-cards-resources/
---

## Best practices

If you are deploying new [trainings cards](/building/training/training-cards), here are some best practices to follow: 

- When deploying training cards for the first time, provide guidance in advance as to what users should expect from the cards and how to use them
- Test training card content with a small set of users to ensure learnability and understanding before deploying to your live instance
- Test on a physical device to see what content will look like on different screen sizes
- Keep content to a minimum and try to have as few cards as possible
- Ensure images aren't confused with UI elements: Add outlines or shadows indicating they're for demonstrative purposes only. Never include navigation buttons in your screenshots (e.g., "Next" or "Cancel").
- Make sure users know who to contact if they run into issues
- Establish success criteria for the training cards

Some examples of data to monitor include:

- Users who have completed the training within X days
- Outliers, ex. users who have seen the cards multiple times and not completed the training
- The intended users have received the training

## Examples

Below is a list of training cards that you can use in your project to train users about new updates in CHT. Read the [step by step guide](/building/training/training-cards) to deploy the training cards.

### Floating Action Button

_Introduced in 4.2.0_

The additive actions (creating reports, places, people, etc...) have moved from the bottom action bar to a Floating Action Button. Use this training to introduce the change to your users. 

Get the training card files [here](https://github.com/medic/cht-docs/tree/main/content/en/building/training/training-cards-resources/available-trainings/floating-action-button).

{{< figure src="images/floating-action-button.png" class="left col-10" >}}



### More Options Menu

_Introduced in 4.2.0_

The Edit, Delete and Export actions have been moved to the More Options menu. Use this training to introduce the change to your users. 

Get the training card files [here](https://github.com/medic/cht-docs/tree/main/content/en/building/training/training-cards-resources/available-trainings/more-options).

{{< figure src="images/more-options.png" class="left col-10" >}}



Once you have downloaded the training card files, follow the [step by step guide](/building/training/training-cards) to learn how to edit the `properties file` to configure: 
- The `roles` of users who can view the training cards 
- The `start_date` to define the training start day (when the training cards should show)
