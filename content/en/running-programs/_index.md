---
title: "Running CHT implementations"
linkTitle: "CHT Implementations"
weight : 2
---

There are various ways of running Community Health Toolkit implementations. It is important to first appreciate the different models/ approaches to deploying/ integrating CHT tools into your community health programme. These are discussed below;

**Accompaniment approach**

In this approach, Medic accompanies partners; including ministries of health, through their digital journey that may include designing, building, deploying and supporting CHT based tools for their unique health system needs. 

**Community led implementations**

This model leverages the robust technical expertise of the CHT community of practice. A network of local and regional technical organizations that have onboarded on CHT are on hand to provide to offer design, development, deployment and support services for implementing partners - including ministries of health. This network also contributes back their learnings to the community through documentation, reference applications, CHT core improvements. Community led implementations emphasize on the importance of collaboration, local ownership and sustainability.

**Research initiatives, innovations and studies**

Through human centered design, research institutions and academia  design, test, refine and deploy open source digital health innovations - some of which are based on the CHT or other mature open source technologies. These innovations often are conducted in a research setting ultimately contributing new knowlegde through publications. These implementations incubate and test concepts or interventions before large scale implementation. They run for a limited time and often have pre-determined objectives. 

## Considerations for digital health implementations
To run a successful digital health implementation, you need to make the following considerations:
- Scope - Clear definition of the challenge, duration of implementation (including actual development of the digital tool), and implementation deliverables, and the change expected (goals) as a result of implementation
- Technical requirements - infrastructure (servers - physical/ cloud) and hardware (devices such as smartphones/tablets, laptops/computers) requirements
- Context - general understanding of the geography (country/region) in the following domains; legal and policy landscape, infrastruture penetration e.g. mobile and electricity connectivity, community health setup and maturity e.g cadres of community health workers, coverage and functionality
- Human resource requirements - skills to build, implement and sustain the implementation

## CHT Lifecycle
CHT implementations follow a process from beginning to end in order to deliver a complete functional solution. This process is referred to as the CHT Lifecycle. Although the process may differ from implementation to implementation, the process below is what has been used for most deployed implementations. It is an agile and iterative process that involves feedback collection and improvement.
{{< figure src="cht_lifecycle.png" link="cht_lifecycle.png" class="center col-8 col-lg-8" >}}
- Initiation - at this stage, the implementing partner defines the scope of the implementation they would like to run. They also understand the various capabilities and features of the CHT.
- Planning - includes coming up with detailed workplans, schedules, budget estimation, baseline data collection, user estimation and resource planning.
- Design - design plan sharing and reviewing, design field trips, definition of user personas, preperation of design workflows and implementation hierarchy.
- Building - refers to the app development process where workflows are configured, tested and improved.
- Hosting - includes different hosting options, data migration, configuration and optimization of CHT applications in various environments.
- Implementation - refers to the process of training end users and them using the CHT application to support the delivery of health care services. It includes training plan development, logistics planning, expenditure estimation and tracking, tech support training and application installation.
- Support - this is the support provided to end users to address any technical issues and ensure the usability of the tools.
- Evaluation - includes budget tracking, discussions on scaling, report writing and user feedback activities to help improve user experience and impact before the next development cycle begins.

## Implementation personas
Various people interact with CHT implementations at various stages. The list below may not be exhaustive but it does highlight the bare minimum requirements for a successflu deployment. Please note that in some cases, some of the personas may have overlapping roles.
- Project managers - This persona can also be referred to as program heads or program leads. They are involved in planning, directing and coordinating and oversighting digital health projects. Although these persona oversees the entire implementation, they interact with the CHT implementation more closely during the implementation and monitoring/evaluation stages.
- Designers - They include service designers, user experience/user interface designers, product designers, graphic designers among others. Designers interact with CHT implementations intimately during the design phase. They carry out field immersion visits to gather technical requirements from the prospective end users, programme leads at MoH, policy makers among others. The techniocal requirements inform the eventual product (CHT app). Product and UI/UX designers are involved in the design and evaluation phases to explore opportunities for improvement and optimize user experience and impact.
- Developers - they include app developers, core developers and software developers who are invloved in the building stage. App developers build custom applications based on the CHT core. These apps are composed of application and contact forms, application settings among other configurations. Core developers contribute to the [CHT Core framework]({{< ref "core" >}}) that powers the mobile apps.
- System administrators - they include database administators, security engineers, site reliability engineers, devOps engineers and network managers. They are responsible for configuration of computers, servers, databases, pipelines and infrastructure of CHT applications, monitoring health status of the infrastructure and application such as performance, server resources utilization, and  uptime. They interact with CHT implementations at the planning, hosting and support stages.
- Technical support team - they include information communication and technology (ICT) officers and monitoring & evaluation officers. ICT officers are responsible for mobile device testing, application installation and technical assistance provision for issues experienced by end users post deployment. Monitoring & Evaluation officers are responsible for monitoring project indicators performance, impact evaluation, data analysis and reporting. They interact with CHT implementations at the design and support stages.
- Researchers - they include Data Scientists, UX researchers and research scientists. They are integrate research aspects such as implememtation research into the project cycle to test hypothesis. They are involved through out the project cycle.

Incase an implementing partner does not have the expertise listed above, the CHT has a robust network of technical partners who have built CHT applications and have a deep understanding of how CHT implementations work.

## Running successful community health implementations
Digital health implementations do no exist in a silo. To be successful, there are other critical enablers to be aware of and champion for;

**Community health workers**

Community health workers deliver essentila life saving health services to the last mile to improve health outcomes. A functional community health worker requires good working conditions and the right tools to perform their responsibilities. To enable this, the items listed below are important. You can learn more on the [eight proCHW best practices](https://joinchic.org/what-we-do/).

- Continuous training for skill growth
- Supportive supervision to optimal performance management
- Compensation for economic growth and sustainability
- Institutionalization into the formal health workforce
- Equipping with required supplies and kits

**Technical performance optimization**

For CHT powered tools to perform optimally, the following requirements are integral.

- Privacy and protection of user and client data
- Routine monitoring and evalution to identify and resolves issues on time
- Data backups
- Redundancy
- Regular CHT upgrades to benefit from new features and performance improvements
- Device  maintenance
 - Regular Android app and security updates
 - Alternative power sources e.g solar chargers or powerbanks
 - Phone covers and screen protectors
 - Device replacements (losses, end of life) and repairs (broken screen, faukty chargers etc)
- Design
  - Designing with the user (Human-centered design)
  - Consistent user feedback to inform improvements
  - Consistency with material design guidelines for intuitive use.
