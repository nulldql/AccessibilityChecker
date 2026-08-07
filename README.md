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
--json              Output machine-readable JSON instead of a report
--verbose           Show every affected element, not just one example
--no-color          Disable ANSI colors in the report
--fail-on <level>   Only exit non-zero for this severity or above
                     (minor | moderate | serious | critical, default: minor)
--ignore <ruleId>   Skip a specific axe-core rule (repeatable)
--timeout <ms>      Page load timeout in milliseconds (default: 30000)
--help              Show usage
--version           Print the installed version
```

A couple of real examples:

```bash
plain-a11y https://example.com --fail-on serious
plain-a11y https://example.com --ignore color-contrast --verbose
plain-a11y https://example.com --json > report.json
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
  ● Image has no alt text (critical, 1 element)
    A screen reader user has no way to know what this image shows or why it's there.
    Fix: Add an alt attribute describing the image's purpose, or alt="" if it's purely decorative.
    Example: <img src="photo.jpg" width="200" height="150">

Forms
  ● Form field has no label (critical, 1 element)
    A screen reader user hears "edit text" with no idea what to type or why.
    Fix: Add a <label> connected via a matching for/id pair, or wrap the input in the label.
```

## What it checks

Everything in axe-core's default ruleset: images, forms, color contrast, page structure (headings, landmarks), links and buttons, and page language and metadata. All of it grouped into those categories instead of dumped as one flat list.

## What it doesn't do

Automated tools only catch a fraction of real accessibility issues, somewhere around a third. A clean report from this tool, or any tool like it, doesn't mean the page is actually accessible. Things like logical tab order, sensible focus management, and whether alt text actually describes the image still need a real person to check.

## Why I built this

I noticed a lot of developers just ignore accessibility tooling because the output is unreadable unless you're already deep in the spec. This is my attempt to fix that.

## License

MIT
