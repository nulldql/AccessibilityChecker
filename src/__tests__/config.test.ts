import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../config.js";

test("parseArgs returns defaults for a single bare URL", async (t) => {
  t.mock.method(console, "log", () => {});
  const config = await parseArgs(["https://example.com"]);
  assert.ok(config);
  assert.deepEqual(config.urls, ["https://example.com"]);
  assert.equal(config.json, false);
  assert.equal(config.verbose, false);
  assert.equal(config.color, true);
  assert.equal(config.failOn, "minor");
  assert.deepEqual(config.ignore, []);
  assert.deepEqual(config.categories, []);
  assert.equal(config.wcagLevel, null);
  assert.equal(config.timeout, 30000);
});

test("parseArgs collects multiple urls as positional args", async () => {
  const config = await parseArgs(["https://a.com", "https://b.com"]);
  assert.deepEqual(config?.urls, ["https://a.com", "https://b.com"]);
});

test("parseArgs sets boolean flags", async () => {
  const config = await parseArgs(["https://example.com", "--json", "--verbose", "--no-color"]);
  assert.equal(config?.json, true);
  assert.equal(config?.verbose, true);
  assert.equal(config?.color, false);
});

test("parseArgs collects repeated --ignore and --category flags", async () => {
  const config = await parseArgs([
    "https://example.com",
    "--ignore",
    "image-alt",
    "--ignore",
    "label",
    "--category",
    "Images",
    "--category",
    "Forms",
  ]);
  assert.deepEqual(config?.ignore, ["image-alt", "label"]);
  assert.deepEqual(config?.categories, ["Images", "Forms"]);
});

test("parseArgs rejects an invalid --fail-on value", async () => {
  await assert.rejects(() => parseArgs(["https://example.com", "--fail-on", "nonsense"]));
});

test("parseArgs rejects an invalid --wcag-level value", async () => {
  await assert.rejects(() => parseArgs(["https://example.com", "--wcag-level", "Z"]));
});

test("parseArgs rejects a non-positive --timeout", async () => {
  await assert.rejects(() => parseArgs(["https://example.com", "--timeout", "-5"]));
});

test("parseArgs rejects an unknown flag", async () => {
  await assert.rejects(() => parseArgs(["https://example.com", "--not-a-real-flag"]));
});

test("parseArgs returns null and prints help when there are no urls", async (t) => {
  const calls: string[] = [];
  t.mock.method(console, "log", (msg: string) => {
    calls.push(msg);
  });
  const config = await parseArgs([]);
  assert.equal(config, null);
  assert.ok(calls.some((c) => c.includes("plain-a11y")));
});
