# plain-a11y

An accessibility checker that tells you what's actually wrong with a page, in plain English instead of rule IDs.

Most accessibility scanners assume you already know WCAG by heart. They dump a list of rule codes like `color-contrast` or `aria-command-name` and leave you to go look each one up. plain-a11y runs the same engine most of those tools use under the hood ([axe-core](https://github.com/dequelabs/axe-core)), but it explains every result in plain language: what's wrong, who it affects, and how to fix it. Everything's grouped by category too, so a report with 30 issues is still readable in under a minute instead of a wall of text.

## Install

```bash
npm install -g plain-a11y
npx playwright install chromium
```

## Usage

```bash
plain-a11y https://example.com
```

Scan more than one page in a single run:

```bash
plain-a11y https://example.com/page-one https://example.com/page-two
```

It exits with code `0` if nothing's wrong and `1` if it finds issues, so you can drop it straight into CI.

### Options

```
--json               Output machine-readable JSON instead of a report
--verbose            Show every affected element, not just one example
--no-color           Disable ANSI colors in the report
--fail-on <level>    Only exit non-zero for this severity or above
                      (minor | moderate | serious | critical, default: minor)
--ignore <ruleId>    Skip a specific axe-core rule (repeatable)
--category <name>    Only report this category (repeatable), e.g. "Images"
--wcag-level <level> Only report issues tagged at this WCAG level (A | AA | AAA)
--timeout <ms>       Page load timeout in milliseconds (default: 30000)
--list-rules         Print every rule id this tool understands and exit
--help               Show usage
--version            Print the installed version
```

A couple of real examples:

```bash
plain-a11y https://example.com --fail-on serious
plain-a11y https://example.com --ignore color-contrast --verbose
plain-a11y https://example.com --json > report.json
plain-a11y https://example.com --category Forms --category Images
plain-a11y https://example.com --wcag-level AA
```

### Config file

Drop a `.plaina11yrc.json` in your project root to set defaults so you don't have to repeat flags every time:

```json
{
  "failOn": "serious",
  "ignore": ["color-contrast"],
  "verbose": true
}
```

CLI flags always override whatever's in the config file.

## Example output

```
plain-a11y: accessibility report
https://example.com

3 issue types found, affecting 4 elements.

Images
  ● Image has no alt text (critical, 1 element, rule: image-alt)
    A screen reader user has no way to know what this image shows or why it's there.
    Fix: Add an alt attribute describing the image's purpose, or alt="" if it's purely decorative.
    WCAG: 1.1.1 Non-text Content (A)
    Example: <img src="photo.jpg" width="200" height="150">

Forms
  ● Form field has no label (critical, 1 element, rule: label)
    A screen reader user hears "edit text" with no idea what to type or why.
    Fix: Add a <label> connected via a matching for/id pair, or wrap the input in the label.
    WCAG: 4.1.2 Name, Role, Value (A)
```

## What it checks

62 rules from axe-core's ruleset, covering images, forms, color contrast, page structure (headings, landmarks, skip links), links and buttons, ARIA usage, timing and motion (auto-refresh, captions), and page language and metadata. Each one is grouped into a category and, where axe-core's own tags support it, cited against the real WCAG 2.2 success criterion it maps to, not just an internal rule id.

The rules live in `src/rules/`, one file per category, combined into a single registry at startup. Run `plain-a11y --list-rules` to see the full list.

## What it doesn't do

Automated tools only catch a fraction of real accessibility issues, somewhere around a third. A clean report from this tool, or any tool like it, doesn't mean the page is actually accessible. Things like logical tab order, sensible focus management, and whether alt text actually describes the image still need a real person to check.

## Why I built this

I noticed a lot of developers just ignore accessibility tooling because the output is unreadable unless you're already deep in the spec. This is my attempt to fix that.

## Development

```bash
git clone https://github.com/TheCEO3-rgb/AccessibilityChecker.git
cd AccessibilityChecker
npm install
npx playwright install chromium
npm test
```

`npm test` builds the project and runs the full suite with Node's built-in test runner: unit tests for the rule registry, the WCAG citation lookup, and every report/filtering function, plus integration tests that spin up a real local server, run the actual compiled CLI against it as a subprocess, and check the real stdout and exit code.

## License

MIT
