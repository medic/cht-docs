# CHT Documentation Workflow

You are helping create or edit CHT documentation. Follow this complete workflow.

## Step 1: Understand the Request

First, clarify what documentation is needed:
- What topic or feature needs documentation?
- Is this a new page or editing an existing one?
- Which section does it belong in? (building, hosting, design, technical-overview, etc.)
- What's the target audience? (developers, implementers, administrators)

## Step 2: Research Existing Content

Before writing:
1. Search for existing pages on this topic using Glob and Grep
2. Check related pages for patterns and cross-reference opportunities
3. Look at sibling pages in the target section for weight numbering and style
4. If CHT Docs MCP server is available, query it for related context

## Step 3: Scaffold the Page

Create the file with proper front matter:

```yaml
---
title: "Page Title"           # Title Case
linkTitle: "Short Title"      # Sentence case, for sidebar
weight: <number>              # Check siblings for appropriate value
description: >
  One sentence, active voice, no period at end
aliases:                      # Only if replacing/moving existing content
  - /old/path/
---
```

For section landing pages (`_index.md`), use card grids:
```markdown
{{</* cards */>}}
  {{</* card link="subpage" title="Title" icon="icon-name" subtitle="Description" */>}}
{{</* /cards */>}}
```

## Step 4: Write Content

Follow these CHT style guide rules strictly:

**Voice & Structure:**
- Active voice, present tense
- Address reader as "you"
- Lead with what's most important
- Keep sentences short and scannable

**Terminology (exact capitalization):**
- Community Health Toolkit / CHT
- CouchDB (not Couch DB)
- Docker (always capitalized)
- XLSForm, XForms, ODK
- Node.js (not NodeJS)

**Formatting:**
- Filenames/paths in backticks: `file.txt`
- UI elements in bold: **Button**
- New terms in italics: _term_
- Placeholders: `<placeholder_name>`
- Headings: Sentence case, no periods

**Avoid:**
- "currently", "new", "please"
- "e.g." (use "For example")
- "i.e." (use "That is")
- Future tense statements
- Jargon ("under the hood" → "internally")

**Use shortcodes appropriately:**
- `{{</* see-also page="path" */>}}` for related topics
- `{{</* callout */>}}` or `> [!NOTE]` for important info
- `{{</* figure src="img.png" link="img.png" */>}}` for images

## Step 5: Write Code Examples (if needed)

When documentation includes JavaScript/TypeScript code, you MUST understand the examples and check out the code style guide located in: content/en/community/contributing/code/style-guide.md

**Other rules:**
- Use `===` not `==`
- Single quotes (double only for JSON)
- 2-space indentation
- Semicolons required
- Opening braces on same line

**Exception - CouchDB documents use snake_case:**
```json
{ "contact_type": "person", "created_date": "2024-01-15" }
```

## Step 6: Handle Images

If the page needs images:
1. Create a folder with the same name as the .md file (without extension)
2. Place images in that folder
3. Reference with relative paths: `![Alt](image.png)` or figure shortcode

Example structure:
```
content/en/building/forms/
├── my-page.md
└── my-page/
    ├── screenshot.png
    └── diagram.svg
```

## Step 7: Validate

Before completing:
1. Check all internal links are valid (use relative paths like `/building/forms/`)
2. Verify terminology matches the style guide
3. Ensure front matter is complete
4. For same-page links, use fragment-only format: `[link](#heading)`

## Step 8: Final Review Checklist

- [ ] Front matter complete (title, linkTitle, weight, description)
- [ ] Active voice throughout
- [ ] Present tense throughout
- [ ] "You" not "we"
- [ ] Terminology capitalized correctly
- [ ] No forbidden words (currently, new, please, e.g., i.e.)
- [ ] Code blocks have language identifiers
- [ ] Code examples follow CHT style (const/let, descriptive names, arrow functions)
- [ ] Images in sibling folder with descriptive names
- [ ] Links validated
- [ ] Appropriate shortcodes used

Ask the user to confirm they want to proceed at each major step if the task is complex.
