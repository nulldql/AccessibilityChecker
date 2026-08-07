import type { RuleMap } from "./types.js";

export const images: RuleMap = {
  "image-alt": {
    category: "Images",
    title: "Image has no alt text",
    why: "A screen reader user has no way to know what this image shows or why it's there.",
    fix: "Add an alt attribute describing the image's purpose, or alt=\"\" if it's purely decorative.",
  },
  "image-redundant-alt": {
    category: "Images",
    title: "Alt text repeats text already next to the image",
    why: "A screen reader announces the same thing twice, once for the alt text and once for the visible text.",
    fix: "Set alt=\"\" on the image since the adjacent text already describes it.",
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
    fix: "Add a <title> element inside the SVG, or an aria-label on it.",
  },
  "role-img-alt": {
    category: "Images",
    title: "Element with role=\"img\" has no accessible name",
    why: "This element is presented to assistive tech as an image but has nothing describing it.",
    fix: "Add an aria-label or aria-labelledby to the element.",
  },
};
