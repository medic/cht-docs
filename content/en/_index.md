---
title: "Welcome mrjones' Docs test site!"
linkTitle: "Documentation"
identifier: "docs"
weight: 1
menu:
  main:
    weight: 1
---

## Goal

Reproduce this table from gsheets in markdown:

![](./ad.hoc.png )



## Empty with just 🟢 & css styling

<div class="schedule-table"></div>

|| 6 mo | 12 mo | 18 mo | 2 yr | 2.5 yr | 3 yr | 3.5 yr | 4 yr | 4.5 yr | 5 yr | 
|------------|--|--|--|--|--|--|--|--|--|--|
| Vitamin A  | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| Deworming  | |  🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| Vitamin Z  | 🟢 | 🟢 | 🟢 |  | 🟢 | 🟢 | 🟢 |  | 🟢 | 🟢 |

Hidden CSS/HTML used to achieve this:

```html

<div class="schedule-table"></div>

|| 6 mo | 12 mo | 18 mo | 2 yr | 2.5 yr | 3 yr | 3.5 yr | 4 yr | 4.5 yr | 5 yr |
|------------|--|--|--|--|--|--|--|--|--|--|
| Vitamin A  | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| Deworming  | |  🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| Vitamin B  | 🟢 | 🟢 | 🟢 |  | 🟢 | 🟢 | 🟢 |  | 🟢 | 🟢 |
```
