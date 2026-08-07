import { test } from "node:test";
import assert from "node:assert/strict";
import {
  filterViolations,
  severityCounts,
  worstSeverity,
  meetsFailThreshold,
  toJson,
} from "../report.js";
import { fakeViolation, fakeNode } from "./fixtures.js";

test("filterViolations removes ignored rule ids", () => {
  const violations = [fakeViolation({ id: "image-alt" }), fakeViolation({ id: "label" })];
  const result = filterViolations(violations, { ignore: ["image-alt"] });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "label");
});

test("filterViolations keeps only requested categories", () => {
  const violations = [
    fakeViolation({ id: "image-alt" }),
    fakeViolation({ id: "label" }),
    fakeViolation({ id: "color-contrast" }),
  ];
  const result = filterViolations(violations, { categories: ["Images", "Forms"] });
  const ids = result.map((v) => v.id).sort();
  assert.deepEqual(ids, ["image-alt", "label"]);
});

test("filterViolations keeps only the requested WCAG level", () => {
  const violations = [
    fakeViolation({ id: "image-alt", tags: ["wcag111"] }),
    fakeViolation({ id: "color-contrast", tags: ["wcag143"] }),
  ];
  const result = filterViolations(violations, { wcagLevel: "AA" });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "color-contrast");
});

test("filterViolations with no options returns everything unchanged", () => {
  const violations = [fakeViolation({ id: "a" }), fakeViolation({ id: "b" })];
  const result = filterViolations(violations, {});
  assert.equal(result.length, 2);
});

test("severityCounts tallies each impact level correctly", () => {
  const violations = [
    fakeViolation({ impact: "critical" }),
    fakeViolation({ impact: "critical" }),
    fakeViolation({ impact: "serious" }),
    fakeViolation({ impact: undefined }),
  ];
  const counts = severityCounts(violations);
  assert.equal(counts.critical, 2);
  assert.equal(counts.serious, 1);
  assert.equal(counts.minor, 1);
  assert.equal(counts.moderate, 0);
});

test("worstSeverity finds the highest impact present", () => {
  const violations = [
    fakeViolation({ impact: "moderate" }),
    fakeViolation({ impact: "critical" }),
    fakeViolation({ impact: "minor" }),
  ];
  assert.equal(worstSeverity(violations), "critical");
});

test("worstSeverity returns null for an empty list", () => {
  assert.equal(worstSeverity([]), null);
});

test("meetsFailThreshold is true when a violation meets or exceeds the threshold", () => {
  const violations = [fakeViolation({ impact: "serious" })];
  assert.equal(meetsFailThreshold(violations, "serious"), true);
  assert.equal(meetsFailThreshold(violations, "critical"), false);
  assert.equal(meetsFailThreshold(violations, "minor"), true);
});

test("meetsFailThreshold is false for an empty list", () => {
  assert.equal(meetsFailThreshold([], "minor"), false);
});

test("toJson produces the expected shape and counts", () => {
  const violations = [
    fakeViolation({
      id: "image-alt",
      impact: "critical",
      tags: ["wcag111"],
      nodes: [fakeNode(), fakeNode()],
    }),
  ];
  const json = toJson("https://example.com", violations);
  assert.equal(json.url, "https://example.com");
  assert.equal(json.issueCount, 1);
  assert.equal(json.elementCount, 2);
  assert.equal(json.severityCounts.critical, 1);
  assert.equal(json.issues[0].ruleId, "image-alt");
  assert.equal(json.issues[0].category, "Images");
  assert.equal(json.issues[0].wcag[0].criterion, "1.1.1");
  assert.equal(json.issues[0].elements.length, 2);
});
