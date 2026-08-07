import { test } from "node:test";
import assert from "node:assert/strict";
import { translate, categoryOrder, knownRuleIds, ruleCount } from "../rules/index.js";

test("translate returns the mapped rule for a known id", () => {
  const rule = translate("image-alt", "fallback help text");
  assert.equal(rule.category, "Images");
  assert.equal(rule.title, "Image has no alt text");
  assert.ok(rule.why.length > 0);
  assert.ok(rule.fix.length > 0);
});

test("translate falls back to category Other for an unknown id", () => {
  const rule = translate("some-made-up-rule-id", "axe's own help text");
  assert.equal(rule.category, "Other");
  assert.equal(rule.title, "axe's own help text");
});

test("categoryOrder lists every category exactly once", () => {
  const order = categoryOrder();
  const unique = new Set(order);
  assert.equal(order.length, unique.size);
  assert.ok(order.includes("Images"));
  assert.ok(order.includes("Other"));
});

test("knownRuleIds is sorted and has no duplicates", () => {
  const ids = knownRuleIds();
  const sorted = [...ids].sort();
  assert.deepEqual(ids, sorted);
  assert.equal(ids.length, new Set(ids).size);
});

test("ruleCount matches knownRuleIds length", () => {
  assert.equal(ruleCount(), knownRuleIds().length);
  assert.ok(ruleCount() > 40, "expected a substantial rule registry");
});
