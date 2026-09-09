import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX_URL = pathToFileURL(resolve(__dirname, "../index.js")).href;

function runNode(args: string[], timeoutMs = 5000): Promise<{ status: number | null; stdout: string; stderr: string }> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn("node", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      rejectPromise(new Error(`node did not exit within ${timeoutMs}ms`));
    }, timeoutMs);
    child.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("close", (status) => {
      clearTimeout(timer);
      resolvePromise({ status, stdout, stderr });
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      rejectPromise(err);
    });
  });
}

test("running index.js directly still behaves like the CLI", async () => {
  const result = await runNode([fileURLToPath(INDEX_URL), "--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /plain-a11y/);
});

test("importing index.js as a module doesn't run the CLI's main() as a side effect", async () => {
  const result = await runNode(["--input-type=module", "-e", `import(${JSON.stringify(INDEX_URL)})`]);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "");
  assert.equal(result.status, 0);
});
