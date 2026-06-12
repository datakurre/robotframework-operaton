/**
 * Spike: test that linkedom + bpmn-js viewer can render BPMN to SVG headlessly.
 *
 * Run: node src/spike.mjs < test.bpmn
 * Or:  node src/spike.mjs (uses built-in minimal BPMN)
 */

import { parseHTML } from "linkedom";
import { readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Minimal test BPMN
const MINIMAL_BPMN = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="EndEvent_1"/>
    <bpmn:endEvent id="EndEvent_1">
      <bpmn:incoming>Flow_1</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="159" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="332" y="159" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint xmlns:di="http://www.omg.org/spec/DD/20100524/DI" x="215" y="177"/>
        <di:waypoint xmlns:di="http://www.omg.org/spec/DD/20100524/DI" x="332" y="177"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

async function spike(bpmnXml) {
  // Set up a DOM environment via linkedom
  const { window, document } = parseHTML(
    `<!DOCTYPE html><html><head></head><body><div id="canvas"></div></body></html>`,
  );

  // Install SVG polyfills that bpmn-js needs
  // (minimal stubs — enough for import + saveSVG)
  installPolyfills(window, document);

  // Load bpmn-js viewer via CJS require (UMD bundle)
  // bpmn-js checks for `document` in global scope at import time,
  // so we must set globals before requiring.
  globalThis.document = document;
  globalThis.window = window;
  globalThis.self = window;

  const BpmnJS = require("../node_modules/bpmn-js/dist/bpmn-viewer.production.min.js");

  // Create viewer attached to canvas div
  const container = document.getElementById("canvas");
  const viewer = new BpmnJS({ container });

  // Import BPMN
  await viewer.importXML(bpmnXml);

  // bpmn-js positions shapes via SVGTransformList.baseVal (not setAttribute),
  // so our stub doesn't persist transforms to the DOM attribute.
  // Fix: manually set transform attributes from the element registry data.
  const elementRegistry = viewer.get("elementRegistry");
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
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

  // Fix viewBox: canvas.viewbox() doesn't persist in our DOM stub, set directly
  const svgRoot = viewer.get("canvas")._svg;
  if (svgRoot && isFinite(minX)) {
    const pad = 20;
    const vbX = minX - pad,
      vbY = minY - pad;
    const vbW = maxX - minX + 2 * pad,
      vbH = maxY - minY + 2 * pad;
    svgRoot.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
    svgRoot.setAttribute("width", `${vbW}`);
    svgRoot.setAttribute("height", `${vbH}`);
  }

  // Export SVG
  const { svg: rawSvg } = await viewer.saveSVG();
  let svg = rawSvg;

  // Fix viewBox via post-processing (setAttribute on internal _svg may not persist)
  if (isFinite(minX)) {
    const pad = 20;
    const vbX = minX - pad,
      vbY = minY - pad;
    const vbW = maxX - minX + 2 * pad,
      vbH = maxY - minY + 2 * pad;
    svg = svg
      .replace(/ width="[^"]*"/, ` width="${vbW}"`)
      .replace(/ height="[^"]*"/, ` height="${vbH}"`)
      .replace(/ viewBox="[^"]*"/, ` viewBox="${vbX} ${vbY} ${vbW} ${vbH}"`);
  }
  // linkedom serializes SVG element tags as uppercase; normalize to lowercase
  svg = svg.replace(/<\/?[A-Z][A-Z0-9-]*/g, (m) => m.toLowerCase());
  return svg;
}

function installPolyfills(window, document) {
  // SVGMatrix stub
  class SVGMatrix {
    constructor() {
      Object.assign(this, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
    }
    multiply(m) {
      return m;
    }
    inverse() {
      return new SVGMatrix();
    }
    translate(x, y) {
      const m = new SVGMatrix();
      m.e = x;
      m.f = y;
      return m;
    }
    scale(s) {
      const m = new SVGMatrix();
      m.a = m.d = s;
      return m;
    }
    scaleNonUniform(sx, sy) {
      const m = new SVGMatrix();
      m.a = sx;
      m.d = sy;
      return m;
    }
    rotate(r) {
      return new SVGMatrix();
    }
    rotateFromVector(x, y) {
      return new SVGMatrix();
    }
    flipX() {
      return new SVGMatrix();
    }
    flipY() {
      return new SVGMatrix();
    }
    skewX(a) {
      return new SVGMatrix();
    }
    skewY(a) {
      return new SVGMatrix();
    }
  }
  window.SVGMatrix = SVGMatrix;

  // SVGTransform stub
  class SVGTransform {
    constructor() {
      this.type = 1;
      this.matrix = new SVGMatrix();
      this.angle = 0;
      this.SVG_TRANSFORM_MATRIX = 1;
      this.SVG_TRANSFORM_TRANSLATE = 2;
      this.SVG_TRANSFORM_SCALE = 3;
      this.SVG_TRANSFORM_ROTATE = 4;
    }
    setMatrix(m) {
      this.matrix = m;
    }
    setTranslate(x, y) {
      this.type = 2;
      this.matrix.e = x;
      this.matrix.f = y;
    }
    setScale(sx, sy) {
      this.type = 3;
      this.matrix.a = sx;
      this.matrix.d = sy;
    }
    setRotate(angle) {
      this.type = 4;
      this.angle = angle;
    }
  }
  window.SVGTransform = SVGTransform;

  // SVGTransformList stub
  class SVGTransformList {
    constructor() {
      this._items = [];
    }
    get length() {
      return this._items.length;
    }
    get numberOfItems() {
      return this._items.length;
    }
    appendItem(t) {
      this._items.push(t);
      return t;
    }
    getItem(i) {
      return this._items[i];
    }
    clear() {
      this._items = [];
    }
    initialize(t) {
      this._items = [t];
      return t;
    }
    createSVGTransformFromMatrix(m) {
      const t = new SVGTransform();
      t.matrix = m;
      return t;
    }
    consolidate() {
      return this._items[0] || null;
    }
  }

  // SVGPoint stub
  class SVGPoint {
    constructor() {
      this.x = 0;
      this.y = 0;
    }
    matrixTransform(m) {
      return new SVGPoint();
    }
  }
  window.SVGPoint = SVGPoint;

  const proto = window.Element && window.Element.prototype;
  if (proto) {
    // getBBox: return non-zero size so bpmn-js doesn't treat elements as invisible
    if (!proto.getBBox) {
      proto.getBBox = function () {
        return { x: 0, y: 0, width: 100, height: 30 };
      };
    }
    if (!proto.getScreenCTM) {
      proto.getScreenCTM = function () {
        return new SVGMatrix();
      };
    }
    if (!proto.getComputedTextLength) {
      proto.getComputedTextLength = function () {
        return (this.textContent || "").length * 6;
      };
    }
    // SVGSVGElement methods - needed on the root <svg> element
    if (!proto.createSVGMatrix) {
      proto.createSVGMatrix = function () {
        return new SVGMatrix();
      };
    }
    if (!proto.createSVGTransform) {
      proto.createSVGTransform = function () {
        return new SVGTransform();
      };
    }
    if (!proto.createSVGPoint) {
      proto.createSVGPoint = function () {
        return new SVGPoint();
      };
    }
    if (!proto.createSVGTransformFromMatrix) {
      proto.createSVGTransformFromMatrix = function (m) {
        const t = new SVGTransform();
        t.matrix = m;
        return t;
      };
    }
  }

  // Patch createElementNS to add transform property on SVG elements
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

  // CSS.escape stub
  if (!window.CSS) {
    window.CSS = { escape: (s) => CSS_escape(s) };
  }

  // structuredClone stub
  if (!window.structuredClone) {
    window.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
  }

  // requestAnimationFrame stub
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (fn) => setTimeout(fn, 0);
    window.cancelAnimationFrame = clearTimeout;
  }
}

function CSS_escape(str) {
  // CSS.escape polyfill
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code === 0) {
      result += "\uFFFD";
      continue;
    }
    if (
      (code >= 0x01 && code <= 0x1f) ||
      code === 0x7f ||
      (i === 0 && code >= 0x30 && code <= 0x39) ||
      (i === 1 && code >= 0x30 && code <= 0x39 && str.charCodeAt(0) === 0x2d)
    ) {
      result += "\\" + code.toString(16) + " ";
    } else if (
      code >= 0x80 ||
      code === 0x2d ||
      code === 0x5f ||
      (code >= 0x30 && code <= 0x39) ||
      (code >= 0x41 && code <= 0x5a) ||
      (code >= 0x61 && code <= 0x7a)
    ) {
      result += str[i];
    } else {
      result += "\\" + str[i];
    }
  }
  return result;
}

// Main
const bpmnXml = process.stdin.isTTY
  ? MINIMAL_BPMN
  : await new Promise((resolve) => {
      let data = "";
      process.stdin.setEncoding("utf-8");
      process.stdin.on("data", (chunk) => (data += chunk));
      process.stdin.on("end", () => resolve(data));
    });

try {
  const svg = await spike(bpmnXml);
  process.stdout.write(svg);
  process.stderr.write("\nSpike successful! SVG length: " + svg.length + "\n");
} catch (err) {
  process.stderr.write("Spike FAILED: " + err.message + "\n");
  process.stderr.write(err.stack + "\n");
  process.exit(1);
}
