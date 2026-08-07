import { test } from "node:test";
import assert from "node:assert/strict";
import { criteriaFromTags, formatCriteria } from "../wcag.js";

test("criteriaFromTags maps a known axe tag to its WCAG criterion", () => {
  const result = criteriaFromTags(["wcag2a", "wcag111", "cat.text-alternatives"]);
  assert.equal(result.length, 1);
  assert.equal(result[0].criterion, "1.1.1");
  assert.equal(result[0].name, "Non-text Content");
  assert.equal(result[0].level, "A");
});

test("criteriaFromTags ignores tags it doesn't recognize", () => {
  const result = criteriaFromTags(["cat.forms", "best-practice", "not-a-real-tag"]);
  assert.deepEqual(result, []);
});

test("criteriaFromTags sorts multiple matches by criterion number", () => {
  const result = criteriaFromTags(["wcag412", "wcag111", "wcag143"]);
  assert.deepEqual(
    result.map((r) => r.criterion),
    ["1.1.1", "1.4.3", "4.1.2"],
  );
});

test("formatCriteria joins criteria into a readable string", () => {
  const formatted = formatCriteria([
    { criterion: "1.1.1", name: "Non-text Content", level: "A" },
    { criterion: "1.4.3", name: "Contrast (Minimum)", level: "AA" },
  ]);
  assert.equal(formatted, "1.1.1 Non-text Content (A), 1.4.3 Contrast (Minimum) (AA)");
});

test("formatCriteria returns an empty string for no criteria", () => {
  assert.equal(formatCriteria([]), "");
});
