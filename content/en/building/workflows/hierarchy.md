---
title: "Configurable Hierarchies"
linkTitle: "Hierarchies"
weight: 6
description: >
  Organize people and places, and their relationship to one another
relatedContent: >
  building/reference/app-settings/hierarchy
aliases:
   - /building/concepts/hierarchy
   - /apps/concepts/hierarchy
---

The Core Framework requires a hierarchy to organize the information in the app. It is often based on the hierarchy of a health system within a particular geographic region. 

Large deployment sites often need three or more levels of place hierarchy, while some small sites need fewer than three levels. For this reason, the Core Framework’s information hierarchies are configurable to meet a users needs.

A user logging into their app will see a custom set of people, tasks, reports, and analytics based on the hierarchy level that they belong to. This allows appropriate data sharing based on the role of the user in the health system. 

The information hierarchy is configured in the administration console. The hierarchy levels can be given different titles depending on a particular health system’s program or reporting structures. 

{{< see-also page="building/reference/app-settings/hierarchy" title="Defining Hierarchy" >}}


### Places

This is an example of a simple hierarchy that includes a CHW Supervisor area, CHW area, and families as levels which serve as “places” or units of organizing people. 

```mermaid
flowchart TB
linkStyle default stroke-width:1px,stroke:lightgrey

classDef none fill:none,stroke:none

super_area_a[<img src='health-center.svg' width='30' />CHW Supervisor Area A]:::none
chw_area_a[<img src='chw-area.svg' width='30' />CHW CHW Area A]:::none
chw_area_b[<img src='chw-area.svg' width='30' />CHW CHW Area B]:::none
chw_area_c[<img src='chw-area.svg' width='30' />CHW CHW Area C]:::none
family_a[<img src='family.svg' width='30' />Family A]:::none
family_b[<img src='family.svg' width='30' />Family B]:::none
family_c[<img src='family.svg' width='30' />Family C]:::none
family_d[<img src='family.svg' width='30' />Family D]:::none
family_e[<img src='family.svg' width='30' />Family E]:::none
family_f[<img src='family.svg' width='30' />Family F]:::none

super_area_a --- chw_area_a & chw_area_b & chw_area_c
chw_area_a --- family_a & family_b
chw_area_b --- family_c & family_d
chw_area_c --- family_e & family_f
```

User roles can be assigned to log in at any of these levels. For example, it would be customary for a CHW to log in at the CHW Area level and view the families, and below that the people, i.e. patients or family members, who belong there.

### People

The hierarchy can be modeled after the health system, health program and/or the community.  All people are associated with a place and these places can be associated to each other. 

For example, a Family Member is part of a Family. A Family and CHWs are part of a CHW Area. A Family Member, a Family, and CHWs are part of a CHW Supervisor Area. 

```mermaid
%%{init: { "flowchart": { "rankSpacing": 20, "nodeSpacing": 10 } } }%%
flowchart TB
linkStyle default stroke-width:1px,stroke:lightgrey

classDef node fill:none,stroke:none
classDef cluster fill:none,stroke:#ccc

subgraph district[ ]
  admin[<img src='district-hospital.svg' width='30' />Admin]:::none
  officer[<img src='officer.svg' width='30' />Program Officer]:::none
  admin --- officer
end
district:::none

subgraph supervision[ ]
  super_area_a[<img src='health-center.svg' width='30' />CHW Supervisor Area A]:::none
  super_a[<img src='supervisor.svg' width='30' />CHW Supervisor A]:::none
  super_area_a --- super_a
end
supervision:::none

subgraph chw_group_a[ ]
  chw_area_a[<img src='chw-area.svg' width='30' />CHW Area A]:::none
  chw_a[<img src='chw.svg' width='30' />CHW]:::none
  chw_area_a --- chw_a
end
chw_group_a:::none

subgraph chw_group_b[ ]
  chw_area_b[<img src='chw-area.svg' width='30' />CHW Area B]:::none
  chw_b[<img src='chw.svg' width='30' /CHW]:::none
  chw_area_b --- chw_b
end
chw_group_b:::none

family_a[<img src='family.svg' width='30' />Family A]:::none
family_b[<img src='family.svg' width='30' />Family B]:::none
family_c[<img src='family.svg' width='30' />Family C]:::none
family_d[<img src='family.svg' width='30' />Family D]:::none
family_e[<img src='family.svg' width='30' />Family E]:::none
family_f[<img src='family.svg' width='30' />Family F]:::none
person_a_b[<img src='person.svg' width='30' /><img src='person.svg' width='30' />Family Members A and B]:::none
person_c[<img src='person.svg' width='30' />Family Member C]:::none
person_d[<img src='person.svg' width='30' />Family Member D]:::none
person_e_f[<img src='person.svg' width='30' /><img src='person.svg' width='30' />Family Members E and F]:::none
person_g[<img src='person.svg' width='30' />Family Member G]:::none
person_h_i_j[<img src='person.svg' width='30' /><img src='person.svg' width='30' /><img src='person.svg' width='30' />Family Members H, I, and J]:::none

district --- supervision
supervision --- chw_group_a & chw_group_b 
supervision ----  family_e & family_f
chw_group_a --- family_a & family_b
chw_group_b --- family_c & family_d
family_a --- person_a_b
family_b --- person_c
family_c --- person_d
family_d --- person_e_f
family_e --- person_g
family_f --- person_h_i_j
```

Additional hierarchy levels may be added as needed and each section of the hierarchy is configurable. For instance, many large projects have unbalanced hierarchies, which is to say, some parts of the hierarchy have more or different layers than others.
The Admin level operates outside of the hierarchy structure and enables access to all levels and people within the hierarchy.
