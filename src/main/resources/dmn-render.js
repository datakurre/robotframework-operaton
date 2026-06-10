/**
 * dmn-render: headless DMN decision table to HTML renderer with result-row highlighting.
 *
 * Reads JSON from stdin:
 *   { "dmn": "<xml>", "decisionId": "discount", "matchedRules": [1, 3, ...] }
 *
 * matchedRules contains 1-based rule order numbers (from getRuleOrder() in the
 * Operaton history service). These are matched against row position in the table.
 * Writes self-contained HTML (styled <table>) to stdout.
 * Errors are written to stderr and process exits with code 1.
 *
 * Uses only Node.js built-in modules — no external dependencies required.
 */

"use strict";

// ---------------------------------------------------------------------------
// Minimal XML parser using Node.js built-in SAX-style parsing
// ---------------------------------------------------------------------------

/**
 * Lightweight DOM-like XML parser.
 * Returns a tree of { tag, attrs, children, text } nodes.
 */
function parseXml(xml) {
  const stack = [{ tag: "root", attrs: {}, children: [], text: "" }];
  let i = 0;

  while (i < xml.length) {
    if (xml[i] === "<") {
      // Collect text before this tag
      const textStart = xml.lastIndexOf(">", i) + 1;

      if (xml[i + 1] === "?") {
        // Processing instruction — skip
        const end = xml.indexOf("?>", i);
        i = end + 2;
        continue;
      }

      if (xml[i + 1] === "!" && xml[i + 2] === "-" && xml[i + 3] === "-") {
        // Comment — skip
        const end = xml.indexOf("-->", i);
        i = end + 3;
        continue;
      }

      if (xml[i + 1] === "!") {
        // DOCTYPE or CDATA — skip
        const end = xml.indexOf(">", i);
        i = end + 1;
        continue;
      }

      const closing = xml[i + 1] === "/";
      const tagEnd = xml.indexOf(">", i);
      const selfClosing = xml[tagEnd - 1] === "/";
      const tagContent = xml.substring(
        i + (closing ? 2 : 1),
        selfClosing ? tagEnd - 1 : tagEnd,
      );

      // Parse tag name and attributes
      const spaceIdx = tagContent.search(/[\s]/);
      const tagName =
        spaceIdx === -1 ? tagContent.trim() : tagContent.substring(0, spaceIdx);
      const attrStr = spaceIdx === -1 ? "" : tagContent.substring(spaceIdx);

      if (closing) {
        // Pop stack
        const node = stack.pop();
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(node);
        }
      } else {
        const attrs = {};
        const attrRegex = /([\w:.-]+)\s*=\s*"([^"]*)"/g;
        let match;
        while ((match = attrRegex.exec(attrStr)) !== null) {
          attrs[match[1]] = decodeXmlEntities(match[2]);
        }

        // Strip namespace prefix from tag name
        const localTag = tagName.includes(":")
          ? tagName.substring(tagName.indexOf(":") + 1)
          : tagName;

        const node = { tag: localTag, attrs, children: [], text: "" };

        if (selfClosing) {
          stack[stack.length - 1].children.push(node);
        } else {
          stack.push(node);
        }
      }

      i = tagEnd + 1;
    } else {
      // Text content
      const nextTag = xml.indexOf("<", i);
      if (nextTag === -1) break;
      const text = decodeXmlEntities(xml.substring(i, nextTag).trim());
      if (text && stack.length > 0) {
        stack[stack.length - 1].text += text;
      }
      i = nextTag;
    }
  }

  // Return root's children
  return stack[0].children.length > 0 ? stack[0].children : stack[0];
}

function decodeXmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/**
 * Find all descendants matching a tag name (depth-first).
 */
function findAll(node, tagName) {
  const result = [];
  if (!node || !node.children) return result;
  for (const child of node.children) {
    if (child.tag === tagName) result.push(child);
    result.push(...findAll(child, tagName));
  }
  return result;
}

/**
 * Find first descendant matching a tag name.
 */
function findFirst(node, tagName) {
  if (!node || !node.children) return null;
  for (const child of node.children) {
    if (child.tag === tagName) return child;
    const found = findFirst(child, tagName);
    if (found) return found;
  }
  return null;
}

/**
 * Get direct children with a given tag name.
 */
function directChildren(node, tagName) {
  if (!node || !node.children) return [];
  return node.children.filter((c) => c.tag === tagName);
}

/**
 * Get text content from a <text> child element.
 */
function getTextContent(node) {
  if (!node) return "";
  const textNode = findFirst(node, "text");
  if (textNode) return textNode.text || "";
  return node.text || "";
}

// ---------------------------------------------------------------------------
// DMN Decision Table → HTML rendering
// ---------------------------------------------------------------------------

const MATCHED_BG = "#d4edda"; // light green
const MATCHED_BORDER = "#52B415"; // green (same as BPMN executed color)

const TABLE_CSS = `
.dmn-result-table {
  border-collapse: collapse;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 13px;
  margin: 8px 0;
  min-width: 400px;
}
.dmn-result-table th,
.dmn-result-table td {
  border: 1px solid #ccc;
  padding: 6px 10px;
  text-align: left;
  vertical-align: top;
}
.dmn-result-table thead th {
  background: #f0f0f0;
  font-weight: 600;
  white-space: nowrap;
}
.dmn-result-table thead .dmn-header-clause {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.dmn-result-table thead .dmn-header-label {
  font-weight: 600;
}
.dmn-result-table thead .dmn-header-expr {
  font-size: 11px;
  color: #888;
  font-style: italic;
}
.dmn-result-table .dmn-input-col {
  background: #fafafa;
}
.dmn-result-table .dmn-output-col {
  background: #fff;
}
.dmn-result-table .dmn-rule-index {
  text-align: center;
  color: #999;
  font-size: 12px;
  min-width: 30px;
}
.dmn-result-table .dmn-annotation-col {
  color: #888;
  font-style: italic;
}
.dmn-result-table tr.dmn-matched td {
  background: ${MATCHED_BG} !important;
  border-top-color: ${MATCHED_BORDER};
  border-bottom-color: ${MATCHED_BORDER};
}
.dmn-result-table tr.dmn-matched td:first-child {
  border-left-color: ${MATCHED_BORDER};
}
.dmn-result-table tr.dmn-matched td:last-child {
  border-right-color: ${MATCHED_BORDER};
}
.dmn-result-table .dmn-hit-policy {
  font-weight: bold;
  text-align: center;
  color: #555;
}
.dmn-result-table .dmn-table-name {
  font-weight: 600;
  font-size: 14px;
  padding: 8px 10px;
  background: #e8e8e8;
  border-bottom: 2px solid #ccc;
}
`.trim();

/**
 * Map hit policy attribute value to display letter.
 */
function hitPolicyLabel(hitPolicy) {
  const map = {
    FIRST: "F",
    UNIQUE: "U",
    ANY: "A",
    COLLECT: "C",
    RULE_ORDER: "R",
    OUTPUT_ORDER: "O",
    PRIORITY: "P",
  };
  return map[(hitPolicy || "").toUpperCase()] || hitPolicy || "";
}

/**
 * Render a DMN decision table to self-contained HTML.
 *
 * @param {object} root - Parsed XML root
 * @param {string} decisionId - Decision key to find
 * @param {number[]} matchedRules - 1-based rule order numbers to highlight
 * @returns {string} HTML string
 */
function renderDecisionTable(root, decisionId, matchedRules) {
  // Find the decision element
  const decisions = findAll(root, "decision");
  let decision = decisions.find((d) => d.attrs.id === decisionId);
  if (!decision && decisions.length === 1) {
    decision = decisions[0];
  }
  if (!decision) {
    throw new Error(
      `Decision '${decisionId}' not found in DMN. ` +
        `Available: ${decisions.map((d) => d.attrs.id).join(", ")}`,
    );
  }

  const decisionName = decision.attrs.name || decision.attrs.id;
  const dt = findFirst(decision, "decisionTable");
  if (!dt) {
    throw new Error(
      `Decision '${decisionId}' does not contain a decision table`,
    );
  }

  const hitPolicy = dt.attrs.hitPolicy || "UNIQUE";
  const inputs = directChildren(dt, "input");
  const outputs = directChildren(dt, "output");
  const rules = directChildren(dt, "rule");

  const matchedSet = new Set((matchedRules || []).map(Number));
  const totalCols = 1 + inputs.length + outputs.length; // index + inputs + outputs

  // Check for annotations
  const hasAnnotations = rules.some(
    (r) => directChildren(r, "description").length > 0,
  );

  // Build HTML
  const lines = [];
  lines.push(`<style>${TABLE_CSS}</style>`);
  lines.push(`<table class="dmn-result-table">`);

  // --- Table name row ---
  const spanCount = totalCols + (hasAnnotations ? 1 : 0);
  lines.push(`<thead>`);
  lines.push(
    `<tr><th class="dmn-table-name" colspan="${spanCount}">${esc(decisionName)}</th></tr>`,
  );

  // --- Header row 1: clause labels (When / Then) ---
  lines.push(`<tr>`);
  lines.push(
    `<th class="dmn-hit-policy">${esc(hitPolicyLabel(hitPolicy))}</th>`,
  );
  for (let i = 0; i < inputs.length; i++) {
    lines.push(
      `<th class="dmn-input-col dmn-header-clause">${i === 0 ? "When" : "And"}</th>`,
    );
  }
  for (let i = 0; i < outputs.length; i++) {
    lines.push(
      `<th class="dmn-output-col dmn-header-clause">${i === 0 ? "Then" : "And"}</th>`,
    );
  }
  if (hasAnnotations) {
    lines.push(`<th class="dmn-header-clause">Annotations</th>`);
  }
  lines.push(`</tr>`);

  // --- Header row 2: input/output labels ---
  lines.push(`<tr>`);
  lines.push(`<th></th>`);
  for (const inp of inputs) {
    const label =
      inp.attrs.label ||
      getTextContent(findFirst(inp, "inputExpression")) ||
      "";
    lines.push(`<th class="dmn-input-col dmn-header-label">${esc(label)}</th>`);
  }
  for (const out of outputs) {
    const label = out.attrs.label || out.attrs.name || "";
    lines.push(
      `<th class="dmn-output-col dmn-header-label">${esc(label)}</th>`,
    );
  }
  if (hasAnnotations) {
    lines.push(`<th class="dmn-header-label"></th>`);
  }
  lines.push(`</tr>`);

  // --- Header row 3: expressions / types ---
  lines.push(`<tr>`);
  lines.push(`<th></th>`);
  for (const inp of inputs) {
    const expr = getTextContent(findFirst(inp, "inputExpression")) || "";
    lines.push(`<th class="dmn-input-col dmn-header-expr">${esc(expr)}</th>`);
  }
  for (const out of outputs) {
    const typeRef = out.attrs.typeRef || "";
    const name = out.attrs.name || "";
    lines.push(
      `<th class="dmn-output-col dmn-header-expr">${esc(name)}${typeRef ? " (" + esc(typeRef) + ")" : ""}</th>`,
    );
  }
  if (hasAnnotations) {
    lines.push(`<th class="dmn-header-expr"></th>`);
  }
  lines.push(`</tr>`);
  lines.push(`</thead>`);

  // --- Body: rules ---
  lines.push(`<tbody>`);
  for (let rIdx = 0; rIdx < rules.length; rIdx++) {
    const rule = rules[rIdx];
    const ruleId = rule.attrs.id || "";
    const isMatched = matchedSet.has(rIdx + 1); // matchedRules are 1-based order numbers
    const rowClass = isMatched ? ' class="dmn-matched"' : "";

    lines.push(`<tr${rowClass} data-rule-id="${esc(ruleId)}">`);
    lines.push(`<td class="dmn-rule-index">${rIdx + 1}</td>`);

    // Input entries
    const inputEntries = directChildren(rule, "inputEntry");
    for (let c = 0; c < inputs.length; c++) {
      const entry = inputEntries[c];
      const text = entry ? getTextContent(entry) : "";
      const display = text || "-";
      lines.push(`<td class="dmn-input-col">${esc(display)}</td>`);
    }

    // Output entries
    const outputEntries = directChildren(rule, "outputEntry");
    for (let c = 0; c < outputs.length; c++) {
      const entry = outputEntries[c];
      const text = entry ? getTextContent(entry) : "";
      const display = text || "-";
      lines.push(`<td class="dmn-output-col">${esc(display)}</td>`);
    }

    // Annotation
    if (hasAnnotations) {
      const desc = findFirst(rule, "description");
      const text = desc ? desc.text || "" : "";
      lines.push(`<td class="dmn-annotation-col">${esc(text)}</td>`);
    }

    lines.push(`</tr>`);
  }
  lines.push(`</tbody>`);
  lines.push(`</table>`);

  return lines.join("\n");
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  let inputData = "";
  process.stdin.setEncoding("utf-8");
  for await (const chunk of process.stdin) {
    inputData += chunk;
  }

  let parsed;
  try {
    parsed = JSON.parse(inputData);
  } catch (e) {
    process.stderr.write(`dmn-render: invalid JSON input: ${e.message}\n`);
    process.exit(1);
  }

  const { dmn, decisionId, matchedRules = [] } = parsed;
  if (!dmn) {
    process.stderr.write("dmn-render: missing 'dmn' field in input JSON\n");
    process.exit(1);
  }
  if (!decisionId) {
    process.stderr.write(
      "dmn-render: missing 'decisionId' field in input JSON\n",
    );
    process.exit(1);
  }

  try {
    const root = parseXml(dmn);
    // Root may be a single node or array; wrap for consistency
    const rootNode =
      Array.isArray(root) && root.length === 1
        ? root[0]
        : {
            tag: "root",
            attrs: {},
            children: Array.isArray(root) ? root : [root],
            text: "",
          };
    const html = renderDecisionTable(rootNode, decisionId, matchedRules);
    process.stdout.write(html);
  } catch (e) {
    process.stderr.write(
      `dmn-render: rendering failed: ${e.message}\n${e.stack}\n`,
    );
    process.exit(1);
  }
}

main();
