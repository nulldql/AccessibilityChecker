import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { chromium, type Browser } from "playwright";
import { scanUrl } from "../index.js";

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

test("scanUrl closes its browser context after a normal scan", async (t) => {
  const browser: Browser = await chromium.launch();
  t.after(() => browser.close());
  const { server, url } = await startServer(CLEAN_PAGE);
  try {
    await scanUrl(browser, url, 30000);
    assert.equal(browser.contexts().length, 0);
  } finally {
    server.close();
  }
});

test("scanUrl still closes its browser context when axe analysis fails mid-scan", async (t) => {
  const browser: Browser = await chromium.launch();
  t.after(() => browser.close());
  const { server, url } = await startServer(CLEAN_PAGE);
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load" });
    await page.close();
    await context.close();

    assert.equal(browser.contexts().length, 0);

    let realPage: Awaited<ReturnType<typeof context.newPage>> | undefined;
    const originalNewContext = browser.newContext.bind(browser);
    browser.newContext = (async (...args: Parameters<typeof originalNewContext>) => {
      const ctx = await originalNewContext(...args);
      const originalNewPage = ctx.newPage.bind(ctx);
      ctx.newPage = (async () => {
        realPage = await originalNewPage();
        await realPage.goto(url, { waitUntil: "load" });
        await realPage.close();
        return realPage;
      }) as typeof ctx.newPage;
      return ctx;
    }) as typeof browser.newContext;

    await assert.rejects(() => scanUrl(browser, url, 30000));

    browser.newContext = originalNewContext;
    assert.equal(browser.contexts().length, 0);
  } finally {
    server.close();
  }
});
