# CLAUDE.md - CHT Documentation Site

This file provides guidance for AI assistants working with the Community Health Toolkit (CHT) documentation repository.

## Project Overview

This is the official documentation site for the **Community Health Toolkit (CHT)**, an open-source platform for digital health initiatives. The site is built with Hugo (extended) using the Hextra theme and deployed to [docs.communityhealthtoolkit.org](https://docs.communityhealthtoolkit.org).

**Repository**: [github.com/medic/cht-docs](https://github.com/medic/cht-docs)

## Build Commands

```bash
# Local development (choose one)
hugo server              # Native/asdf installation
docker compose up        # Docker (recommended for ease)

# Site builds at http://localhost:1313/

# Link checking (optional)
docker exec cht-hugo sh -c "cd .github/scripts/; ./muffet.sh"  # All links
docker exec cht-hugo .github/scripts/check.urls.sh             # Internal links
```

## Repository Structure

```
cht-docs/
├── content/en/           # All documentation content (Markdown)
│   ├── building/         # Building CHT applications (forms, tasks, targets, etc.)
│   ├── design/           # UX design, icons, personas
│   ├── hosting/          # Deployment, Docker, Kubernetes, monitoring
│   ├── technical-overview/  # Architecture, concepts, data
│   ├── reference-apps/   # Example implementations
│   ├── releases/         # Version release notes
│   ├── community/        # Contributing guides, style guide
│   └── why-the-cht/      # Value proposition
├── layouts/
│   ├── shortcodes/       # Custom Hugo shortcodes
│   ├── partials/         # Custom partial templates
│   └── _default/_markup/ # Link render hook (validates links)
├── static/               # Fonts, favicons, icons
├── assets/css/           # Custom CSS overrides
├── hugo.toml             # Hugo configuration
└── go.mod                # Hugo module dependencies (Hextra theme)
```

## Content Conventions

### Front Matter (YAML)

Every `.md` file requires front matter:

```yaml
---
title: "Page Title"           # Title Case, no period
linkTitle: "Short Title"      # Sentence case, for navigation
weight: 10                    # Sort order (lower = earlier)
description: >                # One sentence, active voice, no period
  Brief description of page content
aliases:                      # Optional: redirects from old URLs
  - /old/path/to/page
keywords: keyword1 keyword2   # Optional: for search
relatedContent: >             # Optional: related page paths
  building/forms/
  building/tasks/
---
```

### Writing Style

The documentation follows specific style guidelines from [community/contributing/docs/style-guide](/content/en/community/contributing/docs/style-guide.md):

| Guideline | Do | Don't |
|-----------|-----|-------|
| **Voice** | Active voice | Passive voice |
| **Tense** | Present tense | Future tense |
| **Address** | "you" | "we" or "one" |
| **Language** | American English | British English |
| **Tone** | Conversational, direct | Formal, wordy |
| **Latin** | "For example" | "e.g." |
| **Jargon** | "Internally" | "Under the hood" |

**Avoid**: "currently", "new", "please", statements about the future

### Terminology (Exact Capitalization)

- **Community Health Toolkit** / **CHT**
- **CouchDB** (not Couch DB)
- **Docker** (always capitalized)
- **XLSForm**, **XForms**, **ODK**

### Formatting

| Element | Format |
|---------|--------|
| Filenames/paths | `` `file.txt` `` |
| UI elements | `**Bold**` |
| New terms | `_italic_` |
| Placeholders | `<placeholder_name>` |
| Headings | Sentence case, no periods |
| Page titles | Title Case |
| Numbers | `{{</* format-number 1_000_000 */>}}` (thin space separator) |

## Shortcodes

### Custom Shortcodes (in `layouts/shortcodes/`)

| Shortcode | Purpose | Example |
|-----------|---------|---------|
| `see-also` | Link to related topic | `{{</* see-also page="building/forms" */>}}` |
| `schedule` | Vaccination/event table | Wrap markdown table with `{{%/* schedule */%}}` |
| `copytable` | Table with copy button | `{{</* copytable id="example" */>}}...{{</* /copytable */>}}` |
| `workflow` | 3-step workflow diagram | `{{</* workflow condition="..." task="..." resolution="..." */>}}` |
| `gallery` | Image gallery | `{{</* gallery src="folder" */>}}` |
| `subpages` | List child pages | `{{</* subpages */>}}` |
| `read-content` | Include another page | `{{</* read-content file="path/to/page" */>}}` |
| `format-number` | Format with thin space | `{{</* format-number 10_000 */>}}` |
| `responsive-iframe` | Responsive embed | `{{</* responsive-iframe src="url" */>}}` |
| `icon/yes` | Checkmark icon | `{{</* icon/yes */>}}` |
| `icon/no` | X icon | `{{</* icon/no */>}}` |

### Theme Shortcodes (Hextra)

| Shortcode | Purpose | Example |
|-----------|---------|---------|
| `cards` | Card grid container | `{{</* cards */>}}...{{</* /cards */>}}` |
| `card` | Individual card | `{{</* card link="path" title="Title" icon="icon-name" */>}}` |
| `callout` | Note/warning box | `{{</* callout emoji="💡" */>}}...{{</* /callout */>}}` |
| `youtube` | Embed video | `{{</* youtube VIDEO_ID */>}}` |
| `figure` | Image with styling | `{{</* figure src="img.png" link="img.png" class="right col-6" */>}}` |
| `tabs` | Tabbed content | `{{</* tabs items="Tab1,Tab2" */>}}...{{</* /tabs */>}}` |

### GitHub-Style Alerts

```markdown
> [!NOTE]
> Informational note

> [!TIP]
> Helpful tip

> [!IMPORTANT]
> Important information

> [!WARNING]
> Warning message

> [!CAUTION]
> Caution message
```

## Linking

### Internal Links

```markdown
# Preferred: Standard markdown links
[Link text](/building/forms/)
[Link with anchor](/building/forms/#section-name)

# Same-page fragment links (ALWAYS use fragment-only)
[Link to heading](#heading-id)    # Correct
[Link](/current-page/#heading)    # Avoid - can fail validation
```

### Link Validation

- **Build-time validation**: Hugo validates all internal markdown links
- **Error on broken links**: Build fails if links are broken (`linkErrorLevel = "ERROR"` in hugo.toml)
- **Development mode**: Set `linkErrorLevel = "WARNING"` temporarily to see all broken links without failing build

### Cross-References

```markdown
# Inline link
See the [forms documentation](/building/forms/) for details.

# See Also shortcode (prominent, separate line)
{{</* see-also page="building/forms" */>}}

# With custom prefix
{{</* see-also prefix="Read More" page="building/forms" */>}}
```

## Images

### Placement

Images go in a folder matching the `.md` filename:
```
content/en/building/forms/
├── intro.md
└── intro/           # Images for intro.md
    ├── screenshot.png
    └── diagram.svg
```

### Usage

```markdown
# Simple markdown (for basic images)
![Alt text](image.png)

# Figure shortcode (for styling, recommended for docs)
{{</* figure src="image.png" link="image.png" alt="Alt text" title="Title" */>}}

# With responsive sizing
{{</* figure src="image.png" link="image.png" class="right col-6 col-lg-3" */>}}
```

## Section Pages (_index.md)

Section landing pages use `_index.md` and typically feature card grids:

```markdown
---
title: "Section Name"
linkTitle: "Section"
weight: 5
description: Brief description of this section
---

Introductory paragraph explaining the section.

{{</* cards */>}}
  {{</* card link="subsection1" title="Subsection 1" icon="document-text" subtitle="Description" */>}}
  {{</* card link="subsection2" title="Subsection 2" icon="cog" subtitle="Description" */>}}
{{</* /cards */>}}
```

## Code in Documentation

This documentation site occasionally contains code examples. All code must follow the [CHT Coding Style Guide](/content/en/community/contributing/code/style-guide.md).

### Code Block Formatting

````markdown
```bash
# Shell commands (no $ prompt)
npm install
hugo server
```

```json
{
  "key": "value"
}
```

```js
const example = () => 'result';
```
````

**Don't include command prompts** (`$` or `>`) in code blocks.

### CHT Coding Style Quick Reference

When writing or reviewing code examples in documentation, enforce these rules:

**Variable Declarations:**
```js
// Right: use const by default, let when reassignment needed
const config = { timeout: 5000 };
let counter = 0;

// Wrong: never use var
var config = { timeout: 5000 };
```

**Naming Conventions:**
```js
// Right: descriptive lowerCamelCase names
const adminUser = db.query();
const isValidPassword = password.length >= 4;

// Wrong: single-letter or unclear names
const a = db.query();
const x = password.length >= 4;
```

**Arrow Functions:**
```js
// Right: clean arrow syntax, omit parens for single param
const double = x => x * 2;
const add = (a, b) => a + b;
const getUser = () => currentUser;

// Wrong: unnecessary parens, function keyword
const double = (x) => x * 2;
const add = function(a, b) { return a + b; };
```

**Async/Await (preferred over promises/callbacks):**
```js
// Right: async/await
const fetchData = async () => {
  try {
    const response = await request.get();
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Wrong: promise chains
const fetchData = () => {
  return request.get()
    .then(response => response.data)
    .catch(error => handleError(error));
};

// Wronger: callbacks
const fetchData = callback => {
  request.get((err, response) => {
    if (err) return callback(err);
    callback(null, response.data);
  });
};
```

**Other Rules:**
- Use `===` and `!==` (never `==` or `!=`)
- Use single quotes for strings (double quotes only in JSON)
- 2-space indentation
- Semicolons required
- Opening braces on same line
- Return early to avoid nesting
- Keep functions under ~15 lines

Good code example:
```js
// Right: const, descriptive names, clear intent
const kapaInstance = window.Kapa;
if (!kapaInstance) {
  const queuedCommands = [];
  const queueCommand = commandArgs => {
    queuedCommands.push(commandArgs);
  };

  const kapaQueue = commandArgs => {
    queueCommand(commandArgs);
  };
  kapaQueue.q = queuedCommands;
  kapaQueue.c = queueCommand;

  window.Kapa = kapaQueue;
}
```

### CouchDB Document Properties

CouchDB documents use snake_case (exception to lowerCamelCase rule):

```json
{
  "type": "contact",
  "contact_type": "person",
  "created_date": "2024-01-15",
  "parent_id": "abc123"
}
```

## Common Patterns

### Adding a New Page

1. Create `.md` file in appropriate section
2. Add front matter (title, linkTitle, weight, description)
3. Create sibling folder for images if needed
4. Use relative markdown links to other pages
5. Test locally with `hugo server`

### Adding Redirects

Use `aliases` in front matter when moving/renaming pages:

```yaml
aliases:
  - /old/path/to/page
  - /another/old/path
```

### Creating Tutorials

- Use numbered steps with clear headings
- Include screenshots in sibling folder
- Use `{{</* callout */>}}` for tips/warnings
- Link to related pages with `{{</* see-also */>}}`

## Configuration Reference

Key settings in `hugo.toml`:

| Setting | Value | Purpose |
|---------|-------|---------|
| `linkErrorLevel` | `"ERROR"` | Fail build on broken links |
| `highlightBroken` | `true` | Highlight broken links in dev |
| `params.nodeVersion` | `"22"` | Documented Node.js version |
| `params.npmVersion` | `"10"` | Documented npm version |

## CI/CD

- **Build**: GitHub Actions on push to `main`
- **Link checking**: Automatic via Hugo render hook + optional Muffet
- **Deployment**: Static site to GitHub Pages

## AI-Assisted Documentation Workflows

### Available Tools

| Tool | Type | When to Use |
|------|------|-------------|
| `/cht-doc` | Skill | Creating or editing documentation pages (full workflow) |
| `docs-reviewer` | Agent | Reviewing PRs for style guide compliance |

### Creating New Documentation (`/cht-doc`)

Use the `/cht-doc` skill for the complete documentation workflow:

1. **Scaffolding**: Creates page with correct front matter
2. **Writing**: Guides content creation per style guide
3. **Assets**: Sets up image folder if needed
4. **Validation**: Checks links and style compliance
5. **Review**: Final check before committing

### Reviewing Documentation PRs

Use the `docs-reviewer` agent for pull request reviews:
- Style guide compliance checking
- Terminology consistency (CHT, CouchDB, Docker, etc.)
- Link validation
- Structure and navigation review

### Link Checking

```bash
# Quick internal link check (during development)
# Set linkErrorLevel = "WARNING" in hugo.toml temporarily
hugo server

# Full link check including external links
docker exec cht-hugo sh -c "cd .github/scripts/; ./muffet.sh"

# Check redirects after reorganization
docker exec cht-hugo .github/scripts/check.urls.sh
```

### Style Guide Quick Reference

When writing or reviewing documentation, enforce these rules:

**Voice & Tense:**
- Active voice: "Click **Save**" not "The Save button should be clicked"
- Present tense: "This creates..." not "This will create..."
- Address as "you": "You can configure..." not "We can configure..."

**Terminology (exact capitalization required):**
- Community Health Toolkit / CHT
- CouchDB (not Couch DB, couchdb)
- Docker (always capitalized)
- XLSForm, XForms, ODK
- Node.js (not NodeJS, node.js)

**Avoid these patterns:**
- "currently" → just state the fact
- "new" → features age, state the version instead
- "please" → be direct
- "e.g." → "For example"
- "i.e." → "That is"
- Future tense promises
- Jargon/idioms ("under the hood" → "internally")

**Formatting rules:**
- Filenames in backticks: `app-settings.json`
- UI elements in bold: **Submit**
- New terms in italics: _contact_
- Placeholders in angle brackets: `<project_name>`
- Headings in sentence case, no periods
- Page titles in Title Case

### Page Templates

**Regular documentation page:**
```yaml
---
title: "Feature Name"
linkTitle: "Feature"
weight: 10
description: >
  One sentence describing what this page covers
---

Introduction paragraph explaining the feature.

## Section heading

Content with [links to related pages](/building/forms/).

> [!NOTE]
> Important information for the reader.
```

**Section landing page (`_index.md`):**
```yaml
---
title: "Section Name"
linkTitle: "Section"
weight: 5
description: Brief description of this section
---

Overview paragraph.

{{</* cards */>}}
  {{</* card link="subpage" title="Subpage" icon="document-text" subtitle="Description" */>}}
{{</* /cards */>}}
```

### MCP Server Integration

This project can use the CHT Docs MCP server for:
- You are inside the docs repository
- Semantic search across all CHT documentation
- Context about CHT concepts and architecture
- Validation of technical accuracy

Configure in project settings:
```json
{
  "mcpServers": {
    "cht-docs": {
      "type": "http",
      "url": "https://mcp-docs.dev.medicmobile.org/mcp"
    }
  }
}
```

## Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hextra Theme](https://imfing.github.io/hextra/)
- [CHT Style Guide](/content/en/community/contributing/docs/style-guide.md)
- [CHT Forum](https://forum.communityhealthtoolkit.org/)
