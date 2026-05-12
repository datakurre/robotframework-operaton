/**
 * bpmn-render: headless BPMN-to-SVG renderer with executed-path highlighting.
 *
 * Reads JSON from stdin:
 *   { "bpmn": "<xml>", "activities": [ { "activityId": "...", "activityType": "...",
 *                                         "canceled": false, "completed": true }, ... ] }
 *
 * Writes SVG to stdout.
 * Errors are written to stderr and process exits with code 1.
 */

import { parseHTML } from "linkedom";
import { readFileSync, writeFileSync } from "fs";

// bpmn-js viewer UMD bundle — imported at module level; it does not access
// document at initialization time (only when new BpmnJS({container}) is called)
import BpmnJS from "bpmn-js/dist/bpmn-viewer.production.min.js";

function buildDOM(html) {
  const { window, document } = parseHTML(html);

  // SVGMatrix stub
  class SVGMatrix {
    constructor() { Object.assign(this, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }); }
    multiply(m) { return m; }
    inverse() { return new SVGMatrix(); }
    translate(x, y) { const m = new SVGMatrix(); m.e = x; m.f = y; return m; }
    scale(s) { const m = new SVGMatrix(); m.a = m.d = s; return m; }
    scaleNonUniform(sx, sy) { const m = new SVGMatrix(); m.a = sx; m.d = sy; return m; }
    rotate(r) { return new SVGMatrix(); }
    rotateFromVector(x, y) { return new SVGMatrix(); }
    flipX() { return new SVGMatrix(); }
    flipY() { return new SVGMatrix(); }
    skewX(a) { return new SVGMatrix(); }
    skewY(a) { return new SVGMatrix(); }
  }
  window.SVGMatrix = SVGMatrix;

  class SVGTransform {
    constructor() {
      this.type = 1;
      this.matrix = new SVGMatrix();
      this.angle = 0;
    }
    setMatrix(m) { this.matrix = m; }
    setTranslate(x, y) { this.type = 2; this.matrix.e = x; this.matrix.f = y; }
    setScale(sx, sy) { this.type = 3; this.matrix.a = sx; this.matrix.d = sy; }
    setRotate(angle) { this.type = 4; this.angle = angle; }
  }
  window.SVGTransform = SVGTransform;

  class SVGTransformList {
    constructor() { this._items = []; }
    get length() { return this._items.length; }
    get numberOfItems() { return this._items.length; }
    appendItem(t) { this._items.push(t); return t; }
    getItem(i) { return this._items[i]; }
    clear() { this._items = []; }
    initialize(t) { this._items = [t]; return t; }
    createSVGTransformFromMatrix(m) { const t = new SVGTransform(); t.matrix = m; return t; }
    consolidate() { return this._items[0] || null; }
  }

  class SVGPoint {
    constructor() { this.x = 0; this.y = 0; }
    matrixTransform(m) { return new SVGPoint(); }
  }
  window.SVGPoint = SVGPoint;

  const proto = window.Element && window.Element.prototype;
  if (proto) {
    if (!proto.getBBox) {
      proto.getBBox = function () { return { x: 0, y: 0, width: 100, height: 30 }; };
    }
    if (!proto.getScreenCTM) {
      proto.getScreenCTM = function () { return new SVGMatrix(); };
    }
    if (!proto.getComputedTextLength) {
      proto.getComputedTextLength = function () { return (this.textContent || "").length * 6; };
    }
    if (!proto.createSVGMatrix) {
      proto.createSVGMatrix = function () { return new SVGMatrix(); };
    }
    if (!proto.createSVGTransform) {
      proto.createSVGTransform = function () { return new SVGTransform(); };
    }
    if (!proto.createSVGPoint) {
      proto.createSVGPoint = function () { return new SVGPoint(); };
    }
    if (!proto.createSVGTransformFromMatrix) {
      proto.createSVGTransformFromMatrix = function (m) {
        const t = new SVGTransform(); t.matrix = m; return t;
      };
    }
  }

  const origCreateElementNS = document.createElementNS?.bind(document);
  if (origCreateElementNS) {
    document.createElementNS = function (ns, tag) {
      const el = origCreateElementNS(ns, tag);
      if (ns === "http://www.w3.org/2000/svg" && !el.transform) {
        const list = new SVGTransformList();
        el.transform = { baseVal: list, animVal: list };
      }
      return el;
    };
  }

  if (!window.CSS) {
    window.CSS = {
      escape(str) {
        let out = "";
        for (let i = 0; i < str.length; i++) {
          const c = str.charCodeAt(i);
          if (c === 0) { out += "\uFFFD"; continue; }
          if (c >= 0x80 || c === 0x2D || c === 0x5F ||
              (c >= 0x30 && c <= 0x39) || (c >= 0x41 && c <= 0x5A) ||
              (c >= 0x61 && c <= 0x7A)) {
            out += str[i];
          } else {
            out += "\\" + str[i];
          }
        }
        return out;
      }
    };
  }

  if (!window.structuredClone) {
    window.structuredClone = (o) => JSON.parse(JSON.stringify(o));
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (fn) => setTimeout(fn, 0);
    window.cancelAnimationFrame = clearTimeout;
  }

  return { window, document };
}
// ─── DOM & polyfills ──────────────────────────────────────────────────────────

/**
 * Determine which sequence flow IDs were executed, based on activity history.
 *
 * Algorithm (simplified from datakurre/operaton-cockpit-plugins connections.ts):
 *  - A sequence flow is "executed" if both its source and target activities appear
 *    in the executed activity set.
 *  - For exclusive gateways: only the flow whose target was executed is marked.
 *  - Canceled activities are excluded from the executed set.
 */
function getExecutedFlows(elementRegistry, activityHistory) {
  const executedIds = new Set(
    activityHistory
      .filter((a) => !a.canceled && a.completed)
      .map((a) => a.activityId)
  );

  // Also include active (started but not completed) activities
  for (const a of activityHistory) {
    if (!a.canceled) executedIds.add(a.activityId);
  }

  const executedFlows = new Set();

  for (const element of elementRegistry.getAll()) {
    if (element.type !== "bpmn:SequenceFlow") continue;
    const sourceId = element.source?.id;
    const targetId = element.target?.id;
    if (sourceId && targetId && executedIds.has(sourceId) && executedIds.has(targetId)) {
      executedFlows.add(element.id);
    }
  }

  return executedFlows;
}

// ─── Executed-path detection ──────────────────────────────────────────────────

const EXECUTED_COLOR = "#52B415";   // green — same as operaton-cockpit-plugins
const ACTIVE_COLOR = "#005588";     // blue for currently active activities

function highlightElements(elementRegistry, activityHistory, document) {
  const executedIds = new Set(
    activityHistory.filter((a) => !a.canceled && a.completed).map((a) => a.activityId)
  );
  const activeIds = new Set(
    activityHistory.filter((a) => !a.canceled && !a.completed).map((a) => a.activityId)
  );
  const executedFlows = getExecutedFlows(elementRegistry, activityHistory);

  for (const element of elementRegistry.getAll()) {
    const gfx = elementRegistry.getGraphics(element);
    if (!gfx) continue;

    const id = element.id;
    const isFlow = element.type === "bpmn:SequenceFlow";

    if (isFlow && executedFlows.has(id)) {
      // Highlight sequence flow path
      const paths = gfx.querySelectorAll(".djs-visual path");
      for (const path of paths) {
        const existing = path.getAttribute("style") || "";
        if (!existing.includes("stroke-opacity:0")) {
          path.setAttribute(
            "style",
            existing.replace(/stroke:[^;]+/, `stroke:${EXECUTED_COLOR}`)
          );
        }
      }
    } else if (!isFlow && executedIds.has(id)) {
      // Highlight shape as executed (green border)
      const visual = gfx.querySelector(".djs-visual");
      const shapes = visual
        ? visual.querySelectorAll("circle,rect,polygon,path,ellipse")
        : [];
      for (const shape of shapes) {
        const existing = shape.getAttribute("style") || "";
        if (!existing.includes("stroke-opacity:0") && !existing.includes("stroke:white")) {
          shape.setAttribute(
            "style",
            existing
              .replace(/stroke:[^;]+/, `stroke:${EXECUTED_COLOR}`)
              .replace(/fill:[^;]+/, "fill:hsl(94, 53%, 93%)")
          );
        }
      }
    } else if (!isFlow && activeIds.has(id)) {
      // Highlight currently active shapes
      const visual = gfx.querySelector(".djs-visual");
      const shapes = visual
        ? visual.querySelectorAll("circle,rect,polygon,path,ellipse")
        : [];
      for (const shape of shapes) {
        const existing = shape.getAttribute("style") || "";
        if (!existing.includes("stroke-opacity:0") && !existing.includes("stroke:white")) {
          shape.setAttribute(
            "style",
            existing
              .replace(/stroke:[^;]+/, `stroke:${ACTIVE_COLOR}`)
              .replace(/stroke-width:[^;]+/, "stroke-width:3px")
          );
        }
      }
    }
  }
}

// ─── SVG highlighting ─────────────────────────────────────────────────────────

async function renderBpmn(bpmnXml, activityHistory) {
  const { window, document } = buildDOM(
    `<!DOCTYPE html><html><head></head><body><div id="canvas"></div></body></html>`
  );

  // Set globals before instantiating BpmnJS (it accesses document/window when creating
  // the viewer, not at module-load time, so setting here is sufficient)
  globalThis.document = document;
  globalThis.window = window;
  globalThis.self = window;

  const container = document.getElementById("canvas");
  const viewer = new BpmnJS({ container });

  await viewer.importXML(bpmnXml);

  const elementRegistry = viewer.get("elementRegistry");

  // Apply highlighting before export
  if (activityHistory && activityHistory.length > 0) {
    highlightElements(elementRegistry, activityHistory, document);
  }

  // Fix element transforms (bpmn-js uses SVGTransformList.baseVal, not setAttribute)
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const element of elementRegistry.getAll()) {
    if (element.x !== undefined) {
      const gfx = elementRegistry.getGraphics(element);
      if (gfx) {
        gfx.setAttribute("transform", `translate(${element.x},${element.y})`);
      }
      minX = Math.min(minX, element.x);
      minY = Math.min(minY, element.y);
      maxX = Math.max(maxX, element.x + (element.width || 0));
      maxY = Math.max(maxY, element.y + (element.height || 0));
    }
    if (element.waypoints) {
      for (const wp of element.waypoints) {
        minX = Math.min(minX, wp.x);
        minY = Math.min(minY, wp.y);
        maxX = Math.max(maxX, wp.x);
        maxY = Math.max(maxY, wp.y);
      }
    }
  }

  const { svg: rawSvg } = await viewer.saveSVG();
  let svg = rawSvg;

  // Fix viewBox via string post-processing (SVG root setAttribute doesn't persist)
  if (isFinite(minX)) {
    const pad = 20;
    const vbX = minX - pad, vbY = minY - pad;
    const vbW = maxX - minX + 2 * pad, vbH = maxY - minY + 2 * pad;
    svg = svg
      .replace(/ width="[^"]*"/, ` width="${vbW}"`)
      .replace(/ height="[^"]*"/, ` height="${vbH}"`)
      .replace(/ viewBox="[^"]*"/, ` viewBox="${vbX} ${vbY} ${vbW} ${vbH}"`);
  }

  // Normalize uppercase SVG tags from linkedom serialization
  svg = svg.replace(/<\/?[A-Z][A-Z0-9-]*/g, (m) => m.toLowerCase());

  return svg;
}

// ─── CLI entrypoint ───────────────────────────────────────────────────────────

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
    process.stderr.write(`bpmn-render: invalid JSON input: ${e.message}\n`);
    process.exit(1);
  }

  const { bpmn, activities = [] } = parsed;
  if (!bpmn) {
    process.stderr.write("bpmn-render: missing 'bpmn' field in input JSON\n");
    process.exit(1);
  }

  try {
    const svg = await renderBpmn(bpmn, activities);
    process.stdout.write(svg);
  } catch (e) {
    process.stderr.write(`bpmn-render: rendering failed: ${e.message}\n${e.stack}\n`);
    process.exit(1);
  }
}

main();
