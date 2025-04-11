---
title: "Design Documents Guide"
linkTitle: "Design Docs"
weight: 12
description: >
  Guidelines for writing technical design documents
---

## What are design docs?
Software development is not just about writing code, but rather about solving problems and building the right solutions. Before diving into an initiative or feature and starting coding, it’s essential that the developers (and other team members) have a high-level understanding of what a solution might look like. 

Design docs are informal documents that the leading developer of a certain piece of software creates before they start the actual coding of a solution. The design doc contains high-level technical design decisions and alternatives that were considered when making those decisions. 

## Why write design docs?

Besides being an excellent way of documenting software design, design docs come with several additional benefits:

* Involve the team early and get feedback before implementation, after which changes are more difficult.
* Identify solution concerns and issues rapidly, as making changes to a solution in the design phase is faster.
* Provide a fantastic way to document technical decisions, which benefits the team, the community, and future contributors.  
* Ensure the consideration of alternative solutions, assumptions and eventual constraints.
* Achieve consensus in the team around the design and get everyone on the same page.

## What could a design doc contain?

The design doc can be added to the GitHub issue related to the feature or initiative to be implemented or in a Google Doc. 

The list below contains a non-exhaustive list of items a design doc could cover.

#### Context
An overview of the context in which the piece of software is being built and what is actually being built. It's important to keep this section succinct as it's only meant to bring the readers up to speed with the background facts.

#### Goals and scope
A short list of what the goals of the piece of software are, and, very importantly, what is out of scope. The out of scope items are explicitly chosen not to be goals, as for example "FHIR compliance of the API". Please note that a solution could cover out of scope items, as long as it doesn’t introduce trade-offs that prevent achieving the goals.

#### Proposed solution
The details of the solution that was chosen for implementation. This flexible-format section can contain how the developer envisions to code the solution, diagrams, sample code, pseudo-code, security considerations, and references to similar solutions or frameworks to be used. It's important that this section explains why this particular solution best satisfies the goals.

#### Alternative solutions considered
A list of alternative designs that would have achieved similar outcomes, together with the trade-offs that each respective design makes and how those trade-offs led to the decision to select the proposed solution.

#### Assumptions
A description of the assumptions made, for example user interface design or general system characteristics (e.g. operating systems).

#### Constraints
These can include constraints such as security, scalability, or performance.

#### Open questions
Any open issues that you aren’t sure about, or suggested future work.

[This example](https://docs.google.com/document/d/1bR3jygKQvfIK1CkRaplxz4LyXQqgO21MTjy8Jsd6s6c/edit?usp=sharing) shows how a design doc could look like.

> [!IMPORTANT]
> * Keep it simple and concise, write just enough documentation. Design docs should be sufficiently detailed but succinct enough to actually be read by busy people.
> * Be clear: Don't use unnecessarily complicated language and simplify whenever you can.
> * Make important points stand out (for example, in bold letters).

## When not to write a design doc

Writing design docs takes time and energy. When deciding to whether write a design doc or not, it's essential to reflect on the core trade-off of whether the benefits in the alignment around technical design, documentation, senior review, outweigh the extra work of actually creating the doc. If a doc basically says "This is how I am going to implement this feature" without going into trade-offs, alternatives, and explaining decision making (or if the solution is so obvious that there were no trade-offs), then it would probably have been a better idea to write the actual code right away instead of going through the effort of putting together a design doc.

Often, the overhead of creating and reviewing a design doc may not be compatible with prototyping and fast iteration. If "you tried it out and it worked", it might mean that you already have a solution that's worth pursuing without having to write a document. However, it's important to remember that subscribing to agile methodologies and fast iteration is not an excuse for not taking the time to get solutions to known problems right. 

## How to review a design doc?

When added as a design doc reviewer, there are some details about the problem to solve that should be clear to you after reading the content of the doc, and also some questions you should ask before giving your sign off:

* What problem is this initiative solving? How will we know it will work?
* Are there any risky pieces? How are they handled?
* Are there any non-obvious edge cases?
* What are the key technical decisions? What are the tradeoffs being made as a result of these decisions?
* Is there any information you are aware of which the writer may not have known? 
* Have you seen a similar solution (successful or not) used before?
* What external systems does this initiative interact with?
* Does it follow current good practices and patterns? Does it fit into the long-term direction? Does it create tech debt? 

## More info

This policy was inspired by [Design docs guidelines at Google](https://www.industrialempathy.com/posts/design-docs-at-google/) and [How to write a good software design doc](https://medium.com/free-code-camp/how-to-write-a-good-software-design-document-66fcf019569c).