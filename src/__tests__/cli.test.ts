import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(__dirname, "../index.js");

const BROKEN_PAGE = `<!DOCTYPE html>
<html>
<head></head>
<body>
<img src="x.jpg">
<button></button>
</body>
</html>`;

const CLEAN_PAGE = `<!DOCTYPE html>
<html lang="en">
<head><title>Clean</title></head>
<body><main><h1>Hi</h1></main></body>
</html>`;

function startServer(html: string): Promise<{ server: Server; url: string }> {
  return new Promise((resolvePromise) => {
    const server = createServer((_req, res) => {
      res.writeHead(200, { "content-type": "text/html" });
      res.end(html);
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolvePromise({ server, url: `http://127.0.0.1:${port}/` });
    });
  });
}

type CliResult = { status: number | null; stdout: string; stderr: string };

function runCli(args: string[], timeoutMs = 20000): Promise<CliResult> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn("node", [CLI_PATH, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      rejectPromise(new Error(`plain-a11y did not exit within ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
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

test("cli exits 1 and reports issues for a broken page", async () => {
  const { server, url } = await startServer(BROKEN_PAGE);
  try {
    const result = await runCli([url, "--no-color"]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /Image has no alt text/);
    assert.match(result.stdout, /Button has no accessible text/);
  } finally {
    server.close();
  }
});

test("cli exits 0 for a clean page", async () => {
  const { server, url } = await startServer(CLEAN_PAGE);
  try {
    const result = await runCli([url, "--no-color"]);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /No issues found/);
  } finally {
    server.close();
  }
});

test("cli --json produces parseable JSON matching the issues found", async () => {
  const { server, url } = await startServer(BROKEN_PAGE);
  try {
    const result = await runCli([url, "--json"]);
    const parsed = JSON.parse(result.stdout);
    assert.equal(parsed.url, url);
    assert.ok(parsed.issueCount >= 2);
    assert.ok(parsed.issues.some((i: { ruleId: string }) => i.ruleId === "image-alt"));
  } finally {
    server.close();
  }
});

test("cli --category filters the report to one category", async () => {
  const { server, url } = await startServer(BROKEN_PAGE);
  try {
    const result = await runCli([url, "--no-color", "--category", "Images"]);
    assert.match(result.stdout, /Image has no alt text/);
    assert.doesNotMatch(result.stdout, /Button has no accessible text/);
  } finally {
    server.close();
  }
});

test("cli exits 1 with a clear message for an invalid url", async () => {
  const result = await runCli(["not-a-url"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr + result.stdout, /isn't valid/);
});

test("cli --help exits 0 without needing a url", async () => {
  const result = await runCli(["--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /plain-a11y/);
});
