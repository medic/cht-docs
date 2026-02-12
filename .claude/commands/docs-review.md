# CHT Documentation Review

You are reviewing CHT documentation for style guide compliance and quality. This is typically used for PR reviews or validating existing content.

## What to Review

$ARGUMENTS

If no specific files are provided, ask the user what they want reviewed.

## Review Process

### 1. Style Guide Compliance

Check each document for:

**Voice & Tense Issues:**
- Passive voice → flag and suggest active voice rewrite
- Future tense → flag and suggest present tense
- "We" or "one" → should be "you"

**Forbidden Patterns (flag all instances):**
- "currently" → remove or rephrase
- "new" → specify version instead
- "please" → be direct, remove
- "e.g." → "For example"
- "i.e." → "That is"
- Jargon: "under the hood", "spin up", "out of the box"

**Terminology Errors (exact matches required):**
- "Couch DB", "couchdb", "couch db" → CouchDB
- "docker" → Docker
- "cht", "Cht" → CHT (or Community Health Toolkit)
- "XLSform", "xlsform" → XLSForm
- "NodeJS", "node.js", "nodejs" → Node.js

### 2. Formatting Check

**Front Matter:**
- `title`: Must be Title Case, no period
- `linkTitle`: Should be sentence case
- `weight`: Must be a number
- `description`: One sentence, active voice, no period

**Content Formatting:**
- Filenames/paths should be in backticks
- UI elements should be bold
- New terms should be italic
- Placeholders should use angle brackets
- Headings should be sentence case, no periods
- Code blocks should have language identifiers

### 3. Link Validation

- Check internal links point to valid paths
- Same-page links should be fragment-only (`#heading` not `/page/#heading`)
- External links should use HTTPS where possible

### 4. Code Style Review (for code examples)

If the document contains JavaScript/TypeScript code blocks, check for CHT Coding Style Guide compliance:

**Variable Declaration Issues:**
- `var` keyword → must use `const` or `let`
- Single-letter variable names (`a`, `i`, `k`, `x`) → must use descriptive names
- Non-descriptive names → flag and suggest meaningful alternatives

**Function Style Issues:**
- `function` keyword where arrow function works → suggest arrow function
- Unnecessary parentheses around single parameter → `(x) =>` should be `x =>`
- Callbacks or promise chains → suggest async/await pattern

**Formatting Issues:**
- Missing semicolons
- Double quotes in JS (except JSON)
- Inconsistent indentation (should be 2 spaces)
- Braces on separate line

**Example - Flag This:**
```js
var k = window.Kapa;
var i = function(args) {
  i.q.push(args)
}
```

**Should Be:**
```js
const kapaInstance = window.Kapa;
const queueCommand = args => {
  commandQueue.push(args);
};
```

**CouchDB Exception:**
Document properties in CouchDB use snake_case (not lowerCamelCase):
```json
{ "contact_type": "person", "created_date": "2024-01-15" }
```

### 5. Structure Review

- Does the page have a clear introduction?
- Are headings hierarchical (h2 → h3 → h4)?
- Are code examples properly formatted?
- Are images in sibling folders?
- Are appropriate shortcodes used?

## Output Format

Provide feedback in this structure:

### Summary
Brief overall assessment of the documentation quality.

### Issues Found

#### Critical (must fix)
- Broken links
- Incorrect terminology
- Missing required front matter

#### Style Guide Violations
List each violation with:
- File and line reference
- The problematic text
- Suggested fix

#### Recommendations
Optional improvements that would enhance quality.

### Checklist Result

```
[ ] or [x] Front matter complete and correct
[ ] or [x] Active voice throughout
[ ] or [x] Present tense throughout
[ ] or [x] Correct terminology capitalization
[ ] or [x] No forbidden patterns
[ ] or [x] Proper formatting (backticks, bold, italic)
[ ] or [x] Valid links
[ ] or [x] Appropriate shortcode usage
[ ] or [x] Code examples follow CHT style (if applicable)
```

## Example Review Output

```markdown
### Summary
The page covers the topic well but has several style guide violations that should be addressed before merging.

### Issues Found

#### Critical
- Line 45: Broken link to `/building/formss/` (typo, should be `/building/forms/`)

#### Style Guide Violations
- Line 12: "We will create a new form" → "Create a form" (passive voice, future tense, uses "we")
- Line 23: "e.g. CouchDB" → "For example, CouchDB"
- Line 34: "docker container" → "Docker container" (capitalization)
- Line 56: "This new feature currently supports..." → "This feature supports..." (remove "new" and "currently")

#### Recommendations
- Consider adding a `> [!TIP]` callout for the configuration note on line 67
- The code example on line 78 would benefit from a language identifier

### Checklist Result
[x] Front matter complete and correct
[ ] Active voice throughout - 2 violations
[ ] Present tense throughout - 1 violation
[ ] Correct terminology capitalization - 1 violation
[ ] No forbidden patterns - 3 violations
[x] Proper formatting
[x] Valid links (after fixing typo)
[x] Appropriate shortcode usage
```

Be thorough but constructive. The goal is to help improve the documentation, not to criticize.
