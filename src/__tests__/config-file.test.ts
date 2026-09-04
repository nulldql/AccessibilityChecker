import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "../config.js";

async function withConfigFile<T>(contents: unknown, fn: () => Promise<T>): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), "plain-a11y-config-test-"));
  const originalCwd = process.cwd();
  try {
    await writeFile(join(dir, ".plaina11yrc.json"), JSON.stringify(contents));
    process.chdir(dir);
    return await fn();
  } finally {
    process.chdir(originalCwd);
    await rm(dir, { recursive: true, force: true });
  }
}

test("a valid config file sets real defaults", async () => {
  await withConfigFile({ failOn: "serious", timeout: 5000 }, async () => {
    const config = await parseArgs(["https://example.com"]);
    assert.equal(config?.failOn, "serious");
    assert.equal(config?.timeout, 5000);
  });
});

test("CLI flags still override the config file", async () => {
  await withConfigFile({ failOn: "serious" }, async () => {
    const config = await parseArgs(["https://example.com", "--fail-on", "minor"]);
    assert.equal(config?.failOn, "minor");
  });
});

test("a typo'd failOn in the config file is rejected instead of silently failing on everything", async () => {
  await withConfigFile({ failOn: "serius" }, async () => {
    await assert.rejects(() => parseArgs(["https://example.com"]), /"failOn"/);
  });
});

test("a non-numeric timeout in the config file is rejected instead of reaching page.goto unchecked", async () => {
  await withConfigFile({ timeout: "30s" }, async () => {
    await assert.rejects(() => parseArgs(["https://example.com"]), /"timeout"/);
  });
});

test("a negative timeout in the config file is rejected", async () => {
  await withConfigFile({ timeout: -1 }, async () => {
    await assert.rejects(() => parseArgs(["https://example.com"]), /"timeout"/);
  });
});

test("an invalid wcagLevel in the config file is rejected", async () => {
  await withConfigFile({ wcagLevel: "Z" }, async () => {
    await assert.rejects(() => parseArgs(["https://example.com"]), /"wcagLevel"/);
  });
});

test("a non-array ignore list in the config file is rejected", async () => {
  await withConfigFile({ ignore: "image-alt" }, async () => {
    await assert.rejects(() => parseArgs(["https://example.com"]), /"ignore"/);
  });
});

test("a missing config file falls back to real defaults without error", async () => {
  const dir = await mkdtemp(join(tmpdir(), "plain-a11y-config-test-"));
  const originalCwd = process.cwd();
  try {
    process.chdir(dir);
    const config = await parseArgs(["https://example.com"]);
    assert.equal(config?.failOn, "minor");
  } finally {
    process.chdir(originalCwd);
    await rm(dir, { recursive: true, force: true });
  }
});
