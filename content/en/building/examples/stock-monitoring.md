---
title: "Stock Monitoring"
linkTitle: "Stock Monitoring"
weight: 
description: >
  Guidance on design and development of stock monitoring workflows.
keywords: stock monitoring
aliases:
   - /apps/examples/stock-monitoring
---

## Problem Being Addressed

Paper based commodity management systems are prone to errors due to reliance on manually updated registers, this greatly affects data quality. Further, it is time consuming for CHWs to reference stock balances and at the same time update stocks on the commodity management sheet while providing treatment to household members. In terms of supervision, CHW’s supervisors do not know when CHWs have stock outs in time for replenishing and ordering  purposes.  A stock monitoring application can help CHWs update their stocks seamlessly while strengthening data integrity.

## Solution Overview

CHT stock monitoring apps can be configured to support community drug and commodity management among CHWs and their supervisors. The workflow can be designed to: 
* **Capture** stocks received from and returned to the health facility
* **Provide** stock status of every commodity
* **Automatically deduct** stocks when a CHW provides  treatment to the community members
* **Escalate** stock out alerts to the supervisors when the CHW runs low on any of the commodities

Some design considerations to make include:
* A stock condition card will appear on the CHW profile that will show a summary of the stock status
* In-built stock thresholds for different commodities
* Distinct colors for different stock thresholds
    * Red: Low stock
    * Green: Optimal stock
    * Yellow: Medium stock
* Automated stock level updates when a CHW provides treatment within the workflows
* Stock out tasks to CHW supervisors
* CHW supervisor updates the stocks disbursed on respective CHW Area and the CHW receives a task to confirm the received stocks
* Ensure consistency of stock units across all the sections of the app


## Users and Hierarchy Example

| User                                 | Location                               | Devices                             | Role                                                                                                                                                                                                                                              |
| :----------------------------------- | :------------------------------------- | :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| MOH                                  | Central and district offices           | Desktop, laptop                     | Access to dashboards where they monitor program indicators. Can view aggregate targets, not patient data.                                                 |
| District Biostatistician             | Local office                           | Desktop, laptop                     | Equipped with dashboards. Can view aggregate targets.                                                   |
| Supervisor                          | Community level, based at facilities   | Desktop, laptop                     | Equipped with CHT app. Can view CHW areas, their tasks and aggregate targets.  |                                                                                                      |
| CHW                                  | Community level                        | Smartphones                         | Equipped with CHT app for registrations, screening and monthly reports.                                                   |


## Workflow Examples

{{< figure src="stock-management-workflow.png" link="stock-management-workflow.png" class="right col-12 col-lg-12" >}}

