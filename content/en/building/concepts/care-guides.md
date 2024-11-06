---
title: "Care Guides"
weight: 4
description: >
  Taking health workers through care protocols and providing decision support
keywords: care-guides
relatedContent: >
  building/concepts/forms
  building/tasks/#care-guides
  building/contact-summary/contact-summary-templated/#care-guides
aliases:
   - /apps/concepts/care-guides
---

## Care Guides

{{< figure src="care-guides.png" link="care-guides.png" class="right col-12 col-lg-6" >}}

Forms are used to build “Care Guides” that take health workers through care protocols and provide decision support for their interactions with patients. App designers can use the basic form building functionality in a variety of ways. 

Care Guides also allow CHWs to register new families and people, assess a sick child, and enroll a new pregnancy into an antenatal care schedule. Care Guides can be located in many parts of your app, including the Tasks, People, and Reports tabs. 

Care Guides provided in the CHT's Reference Applications can be configured for your app, or a new Care Guide can be written from scratch. Some configuration is probably necessary due to different local requirements, and government protocols.

### Functionality

{{< figure src="functionality.png" link="functionality.png" class="right col-12 col-lg-4" >}}

Care Guides consists of questions grouped into pages. They are capable of presenting many different types of questions, skip logic, images, and videos. Validation rules can require certain questions to be answered or restrict answers to a specified type or range. 

It’s possible to reference previous information that was submitted about the person or household from within the care guide. The interaction can also conclude with a summary that includes assessment results, treatment recommendations, and referral info. 

Care Guides can include images for instructional purposes and can access a user’s camera to take a photo if needed.

### Summary

{{< figure src="summary.png" link="summary.png" class="right col-12 col-lg-4" >}}

After all of the required questions have been answered, a summary page can be displayed. 

Here, health workers can review the information they entered, receive instructions for treatment, care, and referrals, and relay detailed education to the patient.

{{% alert title="Note" %}}
The form is not submitted until the user scrolls to the very end of the summary and clicks the `Submit` button.
{{% /alert %}}

### Examples

{{< figure src="examples.png" link="examples.png" class="right col-12 col-lg-4" >}}

- While a health worker is going through the form during the care visit, you can include a family planning question only if the person who the form is about is a woman and not pregnant.
- You can include on-the-spot conversational prompts and advice for the CHW based on how they answer questions in the form. For instance, if a CHW answers “yes” to the question about a woman’s interest in family planning, text can automatically appear to provide information on her options.
- An image showing how to read a rapid test can be displayed within a form, to help health workers to correctly interpret their test results.
