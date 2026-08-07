import type { RuleMap } from "./types.js";

export const forms: RuleMap = {
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
  "form-field-multiple-labels": {
    category: "Forms",
    title: "Form field has more than one label",
    why: "Some assistive tech only reads the first label, so the second one is silently ignored.",
    fix: "Use exactly one <label> per form field, or combine them with aria-labelledby.",
  },
  "label-title-only": {
    category: "Forms",
    title: "Form field is only labeled with a title attribute",
    why: "The title attribute isn't reliably announced by screen readers and doesn't show without a mouse hover.",
    fix: "Add a real <label> element instead of relying on the title attribute alone.",
  },
};
