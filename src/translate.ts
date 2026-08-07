export type Category =
  | "Images"
  | "Forms"
  | "Color & Contrast"
  | "Page Structure"
  | "Links & Buttons"
  | "Language & Meta"
  | "Other";

export type PlainRule = {
  category: Category;
  title: string;
  why: string;
  fix: string;
};

export const RULES: Record<string, PlainRule> = {
  "image-alt": {
    category: "Images",
    title: "Image has no alt text",
    why: "A screen reader user has no way to know what this image shows or why it's there.",
    fix: "Add an alt attribute describing the image's purpose, or alt=\"\" if it's purely decorative.",
  },
  "input-image-alt": {
    category: "Images",
    title: "Image-based button has no alt text",
    why: "This is a clickable image acting as a button, but nothing announces what it does.",
    fix: "Add an alt attribute describing the action, e.g. alt=\"Submit form\".",
  },
  "area-alt": {
    category: "Images",
    title: "Clickable image map region has no alt text",
    why: "A screen reader user can't tell what this clickable region links to.",
    fix: "Add an alt attribute to the <area> element describing its destination.",
  },
  "object-alt": {
    category: "Images",
    title: "Embedded object has no accessible name",
    why: "Assistive technology can't describe this embedded content to the user.",
    fix: "Add an aria-label or title describing what the object contains.",
  },
  "svg-img-alt": {
    category: "Images",
    title: "SVG image has no accessible name",
    why: "A screen reader can't announce what this SVG graphic represents.",
    fix: "Add a <title> element inside the SVG or an aria-label on it.",
  },

  label: {
    category: "Forms",
    title: "Form field has no label",
    why: "A screen reader user hears \"edit text\" with no idea what to type or why.",
    fix: "Add a <label> connected via a matching for/id pair, or wrap the input in the label.",
  },
  "select-name": {
    category: "Forms",
    title: "Dropdown has no accessible name",
    why: "A screen reader user can't tell what this dropdown is for.",
    fix: "Add a <label> for the select element, or an aria-label attribute.",
  },
  "aria-input-field-name": {
    category: "Forms",
    title: "Custom input field has no accessible name",
    why: "This looks like a form field to assistive tech, but it announces nothing useful.",
    fix: "Add an aria-label or aria-labelledby pointing to visible text describing the field.",
  },
  "autocomplete-valid": {
    category: "Forms",
    title: "Autocomplete attribute is invalid",
    why: "Browsers and assistive tech that rely on autocomplete hints won't understand this field.",
    fix: "Use a valid autocomplete value from the HTML spec, e.g. \"email\" or \"given-name\".",
  },

  "color-contrast": {
    category: "Color & Contrast",
    title: "Text doesn't have enough contrast against its background",
    why: "People with low vision or color blindness may not be able to read this text at all.",
    fix: "Darken the text or lighten the background until the contrast ratio is at least 4.5:1 (3:1 for large text).",
  },
  "color-contrast-enhanced": {
    category: "Color & Contrast",
    title: "Text doesn't meet the stricter (AAA) contrast standard",
    why: "This text is readable for most people but falls short of the highest accessibility bar.",
    fix: "Aim for a 7:1 contrast ratio (4.5:1 for large text) if you're targeting WCAG AAA.",
  },
  "link-in-text-block": {
    category: "Color & Contrast",
    title: "Link is only distinguishable from surrounding text by color",
    why: "Someone who can't perceive color differences won't notice this is a link.",
    fix: "Add an underline or other non-color styling to links inside paragraphs.",
  },

  "heading-order": {
    category: "Page Structure",
    title: "Heading levels skip a level",
    why: "Screen reader users navigate by heading level — skipping from H2 to H4 makes the page structure confusing.",
    fix: "Use heading levels in order (H1, then H2, then H3) without skipping.",
  },
  "page-has-heading-one": {
    category: "Page Structure",
    title: "Page has no H1",
    why: "There's no top-level heading for a screen reader user to identify what this page is about.",
    fix: "Add exactly one <h1> that describes the page's main content.",
  },
  "empty-heading": {
    category: "Page Structure",
    title: "Heading has no text content",
    why: "A screen reader announces \"heading\" with nothing after it — a dead end for navigation.",
    fix: "Give the heading real text, or remove it if it's not actually needed.",
  },
  "landmark-one-main": {
    category: "Page Structure",
    title: "Page has no main landmark",
    why: "Screen reader users can't jump straight to the primary content of the page.",
    fix: "Wrap the primary content in a <main> element.",
  },
  region: {
    category: "Page Structure",
    title: "Content isn't inside a landmark region",
    why: "Screen reader users navigating by region will miss this content entirely.",
    fix: "Wrap content in a landmark element like <main>, <nav>, <header>, or <footer>.",
  },
  list: {
    category: "Page Structure",
    title: "List markup is broken",
    why: "A <ul> or <ol> contains something other than <li> children, so assistive tech won't announce it as a list.",
    fix: "Only put <li> elements directly inside <ul>/<ol>.",
  },
  listitem: {
    category: "Page Structure",
    title: "List item isn't inside a list",
    why: "An <li> outside a <ul>/<ol> loses its list context for screen reader users.",
    fix: "Make sure every <li> is a direct child of a <ul> or <ol>.",
  },

  "link-name": {
    category: "Links & Buttons",
    title: "Link has no accessible text",
    why: "A screen reader announces \"link\" with nothing after it — useless for navigation.",
    fix: "Add descriptive text inside the link, or an aria-label if it's icon-only.",
  },
  "button-name": {
    category: "Links & Buttons",
    title: "Button has no accessible text",
    why: "A screen reader user hears \"button\" with no idea what pressing it does.",
    fix: "Add text inside the button, or an aria-label for icon-only buttons.",
  },
  "aria-command-name": {
    category: "Links & Buttons",
    title: "Interactive element has no accessible name",
    why: "This element (button, link, or menu item) is focusable but announces nothing.",
    fix: "Add visible text, an aria-label, or aria-labelledby.",
  },

  "html-has-lang": {
    category: "Language & Meta",
    title: "Page has no language declared",
    why: "Screen readers won't know which pronunciation rules to use, and translation tools may guess wrong.",
    fix: "Add lang=\"en\" (or the correct language code) to the <html> element.",
  },
  "html-lang-valid": {
    category: "Language & Meta",
    title: "Declared language isn't a valid code",
    why: "Assistive tech can't act on a language code it doesn't recognize.",
    fix: "Use a valid BCP 47 language code, e.g. \"en\", \"es\", \"fr-CA\".",
  },
  "document-title": {
    category: "Language & Meta",
    title: "Page has no <title>",
    why: "Screen reader users hear the page title first when a page loads — with none, they get nothing.",
    fix: "Add a descriptive <title> in the document <head>.",
  },
  "frame-title": {
    category: "Language & Meta",
    title: "Embedded frame has no title",
    why: "A screen reader user can't tell what an <iframe> contains before entering it.",
    fix: "Add a title attribute describing the frame's content.",
  },

  "duplicate-id-active": {
    category: "Other",
    title: "Duplicate ID on an interactive element",
    why: "Duplicate IDs break label associations and can make assistive tech target the wrong element.",
    fix: "Make sure every id attribute on the page is unique.",
  },
  "aria-hidden-focus": {
    category: "Other",
    title: "Focusable element is hidden from assistive tech",
    why: "A keyboard user can tab to this element, but a screen reader user won't know it exists.",
    fix: "Remove aria-hidden from focusable elements, or make them unfocusable too.",
  },
};

export function categoryOrder(): Category[] {
  return [
    "Images",
    "Forms",
    "Color & Contrast",
    "Page Structure",
    "Links & Buttons",
    "Language & Meta",
    "Other",
  ];
}

export function translate(ruleId: string, fallbackHelp: string): PlainRule {
  const known = RULES[ruleId];
  if (known) return known;
  return {
    category: "Other",
    title: fallbackHelp,
    why: "This affects how well assistive technology can understand or operate this part of the page.",
    fix: "See the linked WCAG reference for this rule for the recommended fix.",
  };
}
