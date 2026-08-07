import type { NodeResult, Result } from "axe-core";

export function fakeNode(overrides: Partial<NodeResult> = {}): NodeResult {
  return {
    html: "<div></div>",
    target: ["div"],
    any: [],
    all: [],
    none: [],
    ...overrides,
  };
}

export function fakeViolation(overrides: Partial<Result> = {}): Result {
  return {
    id: "fake-rule",
    description: "A fake rule for testing",
    help: "A fake rule for testing",
    helpUrl: "https://example.com/fake-rule",
    impact: "moderate",
    tags: [],
    nodes: [fakeNode()],
    ...overrides,
  };
}
