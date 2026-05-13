var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/boolbase/index.js
var require_boolbase = __commonJS({
  "node_modules/boolbase/index.js"(exports2, module2) {
    module2.exports = {
      trueFunc: function trueFunc() {
        return true;
      },
      falseFunc: function falseFunc() {
        return false;
      }
    };
  }
});

// node_modules/css-what/lib/commonjs/types.js
var require_types = __commonJS({
  "node_modules/css-what/lib/commonjs/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AttributeAction = exports2.IgnoreCaseMode = exports2.SelectorType = void 0;
    var SelectorType4;
    (function(SelectorType5) {
      SelectorType5["Attribute"] = "attribute";
      SelectorType5["Pseudo"] = "pseudo";
      SelectorType5["PseudoElement"] = "pseudo-element";
      SelectorType5["Tag"] = "tag";
      SelectorType5["Universal"] = "universal";
      SelectorType5["Adjacent"] = "adjacent";
      SelectorType5["Child"] = "child";
      SelectorType5["Descendant"] = "descendant";
      SelectorType5["Parent"] = "parent";
      SelectorType5["Sibling"] = "sibling";
      SelectorType5["ColumnCombinator"] = "column-combinator";
    })(SelectorType4 = exports2.SelectorType || (exports2.SelectorType = {}));
    exports2.IgnoreCaseMode = {
      Unknown: null,
      QuirksMode: "quirks",
      IgnoreCase: true,
      CaseSensitive: false
    };
    var AttributeAction2;
    (function(AttributeAction3) {
      AttributeAction3["Any"] = "any";
      AttributeAction3["Element"] = "element";
      AttributeAction3["End"] = "end";
      AttributeAction3["Equals"] = "equals";
      AttributeAction3["Exists"] = "exists";
      AttributeAction3["Hyphen"] = "hyphen";
      AttributeAction3["Not"] = "not";
      AttributeAction3["Start"] = "start";
    })(AttributeAction2 = exports2.AttributeAction || (exports2.AttributeAction = {}));
  }
});

// node_modules/css-what/lib/commonjs/parse.js
var require_parse = __commonJS({
  "node_modules/css-what/lib/commonjs/parse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parse = exports2.isTraversal = void 0;
    var types_1 = require_types();
    var reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
    var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
    var actionTypes = /* @__PURE__ */ new Map([
      [126, types_1.AttributeAction.Element],
      [94, types_1.AttributeAction.Start],
      [36, types_1.AttributeAction.End],
      [42, types_1.AttributeAction.Any],
      [33, types_1.AttributeAction.Not],
      [124, types_1.AttributeAction.Hyphen]
    ]);
    var unpackPseudos = /* @__PURE__ */ new Set([
      "has",
      "not",
      "matches",
      "is",
      "where",
      "host",
      "host-context"
    ]);
    function isTraversal2(selector) {
      switch (selector.type) {
        case types_1.SelectorType.Adjacent:
        case types_1.SelectorType.Child:
        case types_1.SelectorType.Descendant:
        case types_1.SelectorType.Parent:
        case types_1.SelectorType.Sibling:
        case types_1.SelectorType.ColumnCombinator:
          return true;
        default:
          return false;
      }
    }
    exports2.isTraversal = isTraversal2;
    var stripQuotesFromPseudos = /* @__PURE__ */ new Set(["contains", "icontains"]);
    function funescape(_, escaped, escapedWhitespace) {
      var high = parseInt(escaped, 16) - 65536;
      return high !== high || escapedWhitespace ? escaped : high < 0 ? (
        // BMP codepoint
        String.fromCharCode(high + 65536)
      ) : (
        // Supplemental Plane codepoint (surrogate pair)
        String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320)
      );
    }
    function unescapeCSS(str) {
      return str.replace(reEscape, funescape);
    }
    function isQuote(c) {
      return c === 39 || c === 34;
    }
    function isWhitespace2(c) {
      return c === 32 || c === 9 || c === 10 || c === 12 || c === 13;
    }
    function parse6(selector) {
      var subselects2 = [];
      var endIndex = parseSelector(subselects2, "".concat(selector), 0);
      if (endIndex < selector.length) {
        throw new Error("Unmatched selector: ".concat(selector.slice(endIndex)));
      }
      return subselects2;
    }
    exports2.parse = parse6;
    function parseSelector(subselects2, selector, selectorIndex) {
      var tokens = [];
      function getName3(offset) {
        var match = selector.slice(selectorIndex + offset).match(reName);
        if (!match) {
          throw new Error("Expected name, found ".concat(selector.slice(selectorIndex)));
        }
        var name = match[0];
        selectorIndex += offset + name.length;
        return unescapeCSS(name);
      }
      function stripWhitespace(offset) {
        selectorIndex += offset;
        while (selectorIndex < selector.length && isWhitespace2(selector.charCodeAt(selectorIndex))) {
          selectorIndex++;
        }
      }
      function readValueWithParenthesis() {
        selectorIndex += 1;
        var start = selectorIndex;
        var counter = 1;
        for (; counter > 0 && selectorIndex < selector.length; selectorIndex++) {
          if (selector.charCodeAt(selectorIndex) === 40 && !isEscaped(selectorIndex)) {
            counter++;
          } else if (selector.charCodeAt(selectorIndex) === 41 && !isEscaped(selectorIndex)) {
            counter--;
          }
        }
        if (counter) {
          throw new Error("Parenthesis not matched");
        }
        return unescapeCSS(selector.slice(start, selectorIndex - 1));
      }
      function isEscaped(pos) {
        var slashCount = 0;
        while (selector.charCodeAt(--pos) === 92)
          slashCount++;
        return (slashCount & 1) === 1;
      }
      function ensureNotTraversal() {
        if (tokens.length > 0 && isTraversal2(tokens[tokens.length - 1])) {
          throw new Error("Did not expect successive traversals.");
        }
      }
      function addTraversal(type) {
        if (tokens.length > 0 && tokens[tokens.length - 1].type === types_1.SelectorType.Descendant) {
          tokens[tokens.length - 1].type = type;
          return;
        }
        ensureNotTraversal();
        tokens.push({ type });
      }
      function addSpecialAttribute(name, action2) {
        tokens.push({
          type: types_1.SelectorType.Attribute,
          name,
          action: action2,
          value: getName3(1),
          namespace: null,
          ignoreCase: "quirks"
        });
      }
      function finalizeSubselector() {
        if (tokens.length && tokens[tokens.length - 1].type === types_1.SelectorType.Descendant) {
          tokens.pop();
        }
        if (tokens.length === 0) {
          throw new Error("Empty sub-selector");
        }
        subselects2.push(tokens);
      }
      stripWhitespace(0);
      if (selector.length === selectorIndex) {
        return selectorIndex;
      }
      loop: while (selectorIndex < selector.length) {
        var firstChar = selector.charCodeAt(selectorIndex);
        switch (firstChar) {
          // Whitespace
          case 32:
          case 9:
          case 10:
          case 12:
          case 13: {
            if (tokens.length === 0 || tokens[0].type !== types_1.SelectorType.Descendant) {
              ensureNotTraversal();
              tokens.push({ type: types_1.SelectorType.Descendant });
            }
            stripWhitespace(1);
            break;
          }
          // Traversals
          case 62: {
            addTraversal(types_1.SelectorType.Child);
            stripWhitespace(1);
            break;
          }
          case 60: {
            addTraversal(types_1.SelectorType.Parent);
            stripWhitespace(1);
            break;
          }
          case 126: {
            addTraversal(types_1.SelectorType.Sibling);
            stripWhitespace(1);
            break;
          }
          case 43: {
            addTraversal(types_1.SelectorType.Adjacent);
            stripWhitespace(1);
            break;
          }
          // Special attribute selectors: .class, #id
          case 46: {
            addSpecialAttribute("class", types_1.AttributeAction.Element);
            break;
          }
          case 35: {
            addSpecialAttribute("id", types_1.AttributeAction.Equals);
            break;
          }
          case 91: {
            stripWhitespace(1);
            var name_1 = void 0;
            var namespace = null;
            if (selector.charCodeAt(selectorIndex) === 124) {
              name_1 = getName3(1);
            } else if (selector.startsWith("*|", selectorIndex)) {
              namespace = "*";
              name_1 = getName3(2);
            } else {
              name_1 = getName3(0);
              if (selector.charCodeAt(selectorIndex) === 124 && selector.charCodeAt(selectorIndex + 1) !== 61) {
                namespace = name_1;
                name_1 = getName3(1);
              }
            }
            stripWhitespace(0);
            var action = types_1.AttributeAction.Exists;
            var possibleAction = actionTypes.get(selector.charCodeAt(selectorIndex));
            if (possibleAction) {
              action = possibleAction;
              if (selector.charCodeAt(selectorIndex + 1) !== 61) {
                throw new Error("Expected `=`");
              }
              stripWhitespace(2);
            } else if (selector.charCodeAt(selectorIndex) === 61) {
              action = types_1.AttributeAction.Equals;
              stripWhitespace(1);
            }
            var value = "";
            var ignoreCase2 = null;
            if (action !== "exists") {
              if (isQuote(selector.charCodeAt(selectorIndex))) {
                var quote = selector.charCodeAt(selectorIndex);
                var sectionEnd = selectorIndex + 1;
                while (sectionEnd < selector.length && (selector.charCodeAt(sectionEnd) !== quote || isEscaped(sectionEnd))) {
                  sectionEnd += 1;
                }
                if (selector.charCodeAt(sectionEnd) !== quote) {
                  throw new Error("Attribute value didn't end");
                }
                value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd));
                selectorIndex = sectionEnd + 1;
              } else {
                var valueStart = selectorIndex;
                while (selectorIndex < selector.length && (!isWhitespace2(selector.charCodeAt(selectorIndex)) && selector.charCodeAt(selectorIndex) !== 93 || isEscaped(selectorIndex))) {
                  selectorIndex += 1;
                }
                value = unescapeCSS(selector.slice(valueStart, selectorIndex));
              }
              stripWhitespace(0);
              var forceIgnore = selector.charCodeAt(selectorIndex) | 32;
              if (forceIgnore === 115) {
                ignoreCase2 = false;
                stripWhitespace(1);
              } else if (forceIgnore === 105) {
                ignoreCase2 = true;
                stripWhitespace(1);
              }
            }
            if (selector.charCodeAt(selectorIndex) !== 93) {
              throw new Error("Attribute selector didn't terminate");
            }
            selectorIndex += 1;
            var attributeSelector = {
              type: types_1.SelectorType.Attribute,
              name: name_1,
              action,
              value,
              namespace,
              ignoreCase: ignoreCase2
            };
            tokens.push(attributeSelector);
            break;
          }
          case 58: {
            if (selector.charCodeAt(selectorIndex + 1) === 58) {
              tokens.push({
                type: types_1.SelectorType.PseudoElement,
                name: getName3(2).toLowerCase(),
                data: selector.charCodeAt(selectorIndex) === 40 ? readValueWithParenthesis() : null
              });
              continue;
            }
            var name_2 = getName3(1).toLowerCase();
            var data = null;
            if (selector.charCodeAt(selectorIndex) === 40) {
              if (unpackPseudos.has(name_2)) {
                if (isQuote(selector.charCodeAt(selectorIndex + 1))) {
                  throw new Error("Pseudo-selector ".concat(name_2, " cannot be quoted"));
                }
                data = [];
                selectorIndex = parseSelector(data, selector, selectorIndex + 1);
                if (selector.charCodeAt(selectorIndex) !== 41) {
                  throw new Error("Missing closing parenthesis in :".concat(name_2, " (").concat(selector, ")"));
                }
                selectorIndex += 1;
              } else {
                data = readValueWithParenthesis();
                if (stripQuotesFromPseudos.has(name_2)) {
                  var quot = data.charCodeAt(0);
                  if (quot === data.charCodeAt(data.length - 1) && isQuote(quot)) {
                    data = data.slice(1, -1);
                  }
                }
                data = unescapeCSS(data);
              }
            }
            tokens.push({ type: types_1.SelectorType.Pseudo, name: name_2, data });
            break;
          }
          case 44: {
            finalizeSubselector();
            tokens = [];
            stripWhitespace(1);
            break;
          }
          default: {
            if (selector.startsWith("/*", selectorIndex)) {
              var endIndex = selector.indexOf("*/", selectorIndex + 2);
              if (endIndex < 0) {
                throw new Error("Comment was not terminated");
              }
              selectorIndex = endIndex + 2;
              if (tokens.length === 0) {
                stripWhitespace(0);
              }
              break;
            }
            var namespace = null;
            var name_3 = void 0;
            if (firstChar === 42) {
              selectorIndex += 1;
              name_3 = "*";
            } else if (firstChar === 124) {
              name_3 = "";
              if (selector.charCodeAt(selectorIndex + 1) === 124) {
                addTraversal(types_1.SelectorType.ColumnCombinator);
                stripWhitespace(2);
                break;
              }
            } else if (reName.test(selector.slice(selectorIndex))) {
              name_3 = getName3(0);
            } else {
              break loop;
            }
            if (selector.charCodeAt(selectorIndex) === 124 && selector.charCodeAt(selectorIndex + 1) !== 124) {
              namespace = name_3;
              if (selector.charCodeAt(selectorIndex + 1) === 42) {
                name_3 = "*";
                selectorIndex += 2;
              } else {
                name_3 = getName3(1);
              }
            }
            tokens.push(name_3 === "*" ? { type: types_1.SelectorType.Universal, namespace } : { type: types_1.SelectorType.Tag, name: name_3, namespace });
          }
        }
      }
      finalizeSubselector();
      return selectorIndex;
    }
  }
});

// node_modules/css-what/lib/commonjs/stringify.js
var require_stringify = __commonJS({
  "node_modules/css-what/lib/commonjs/stringify.js"(exports2) {
    "use strict";
    var __spreadArray = exports2 && exports2.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stringify = void 0;
    var types_1 = require_types();
    var attribValChars = ["\\", '"'];
    var pseudoValChars = __spreadArray(__spreadArray([], attribValChars, true), ["(", ")"], false);
    var charsToEscapeInAttributeValue = new Set(attribValChars.map(function(c) {
      return c.charCodeAt(0);
    }));
    var charsToEscapeInPseudoValue = new Set(pseudoValChars.map(function(c) {
      return c.charCodeAt(0);
    }));
    var charsToEscapeInName = new Set(__spreadArray(__spreadArray([], pseudoValChars, true), [
      "~",
      "^",
      "$",
      "*",
      "+",
      "!",
      "|",
      ":",
      "[",
      "]",
      " ",
      "."
    ], false).map(function(c) {
      return c.charCodeAt(0);
    }));
    function stringify(selector) {
      return selector.map(function(token) {
        return token.map(stringifyToken).join("");
      }).join(", ");
    }
    exports2.stringify = stringify;
    function stringifyToken(token, index, arr) {
      switch (token.type) {
        // Simple types
        case types_1.SelectorType.Child:
          return index === 0 ? "> " : " > ";
        case types_1.SelectorType.Parent:
          return index === 0 ? "< " : " < ";
        case types_1.SelectorType.Sibling:
          return index === 0 ? "~ " : " ~ ";
        case types_1.SelectorType.Adjacent:
          return index === 0 ? "+ " : " + ";
        case types_1.SelectorType.Descendant:
          return " ";
        case types_1.SelectorType.ColumnCombinator:
          return index === 0 ? "|| " : " || ";
        case types_1.SelectorType.Universal:
          return token.namespace === "*" && index + 1 < arr.length && "name" in arr[index + 1] ? "" : "".concat(getNamespace(token.namespace), "*");
        case types_1.SelectorType.Tag:
          return getNamespacedName(token);
        case types_1.SelectorType.PseudoElement:
          return "::".concat(escapeName(token.name, charsToEscapeInName)).concat(token.data === null ? "" : "(".concat(escapeName(token.data, charsToEscapeInPseudoValue), ")"));
        case types_1.SelectorType.Pseudo:
          return ":".concat(escapeName(token.name, charsToEscapeInName)).concat(token.data === null ? "" : "(".concat(typeof token.data === "string" ? escapeName(token.data, charsToEscapeInPseudoValue) : stringify(token.data), ")"));
        case types_1.SelectorType.Attribute: {
          if (token.name === "id" && token.action === types_1.AttributeAction.Equals && token.ignoreCase === "quirks" && !token.namespace) {
            return "#".concat(escapeName(token.value, charsToEscapeInName));
          }
          if (token.name === "class" && token.action === types_1.AttributeAction.Element && token.ignoreCase === "quirks" && !token.namespace) {
            return ".".concat(escapeName(token.value, charsToEscapeInName));
          }
          var name_1 = getNamespacedName(token);
          if (token.action === types_1.AttributeAction.Exists) {
            return "[".concat(name_1, "]");
          }
          return "[".concat(name_1).concat(getActionValue(token.action), '="').concat(escapeName(token.value, charsToEscapeInAttributeValue), '"').concat(token.ignoreCase === null ? "" : token.ignoreCase ? " i" : " s", "]");
        }
      }
    }
    function getActionValue(action) {
      switch (action) {
        case types_1.AttributeAction.Equals:
          return "";
        case types_1.AttributeAction.Element:
          return "~";
        case types_1.AttributeAction.Start:
          return "^";
        case types_1.AttributeAction.End:
          return "$";
        case types_1.AttributeAction.Any:
          return "*";
        case types_1.AttributeAction.Not:
          return "!";
        case types_1.AttributeAction.Hyphen:
          return "|";
        case types_1.AttributeAction.Exists:
          throw new Error("Shouldn't be here");
      }
    }
    function getNamespacedName(token) {
      return "".concat(getNamespace(token.namespace)).concat(escapeName(token.name, charsToEscapeInName));
    }
    function getNamespace(namespace) {
      return namespace !== null ? "".concat(namespace === "*" ? "*" : escapeName(namespace, charsToEscapeInName), "|") : "";
    }
    function escapeName(str, charsToEscape) {
      var lastIdx = 0;
      var ret = "";
      for (var i = 0; i < str.length; i++) {
        if (charsToEscape.has(str.charCodeAt(i))) {
          ret += "".concat(str.slice(lastIdx, i), "\\").concat(str.charAt(i));
          lastIdx = i + 1;
        }
      }
      return ret.length > 0 ? ret + str.slice(lastIdx) : str;
    }
  }
});

// node_modules/css-what/lib/commonjs/index.js
var require_commonjs = __commonJS({
  "node_modules/css-what/lib/commonjs/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stringify = exports2.parse = exports2.isTraversal = void 0;
    __exportStar(require_types(), exports2);
    var parse_1 = require_parse();
    Object.defineProperty(exports2, "isTraversal", { enumerable: true, get: function() {
      return parse_1.isTraversal;
    } });
    Object.defineProperty(exports2, "parse", { enumerable: true, get: function() {
      return parse_1.parse;
    } });
    var stringify_1 = require_stringify();
    Object.defineProperty(exports2, "stringify", { enumerable: true, get: function() {
      return stringify_1.stringify;
    } });
  }
});

// node_modules/cssom/lib/StyleSheet.js
var require_StyleSheet = __commonJS({
  "node_modules/cssom/lib/StyleSheet.js"(exports2) {
    var CSSOM = {};
    CSSOM.StyleSheet = function StyleSheet() {
      this.parentStyleSheet = null;
    };
    exports2.StyleSheet = CSSOM.StyleSheet;
  }
});

// node_modules/cssom/lib/CSSRule.js
var require_CSSRule = __commonJS({
  "node_modules/cssom/lib/CSSRule.js"(exports2) {
    var CSSOM = {};
    CSSOM.CSSRule = function CSSRule() {
      this.parentRule = null;
      this.parentStyleSheet = null;
    };
    CSSOM.CSSRule.UNKNOWN_RULE = 0;
    CSSOM.CSSRule.STYLE_RULE = 1;
    CSSOM.CSSRule.CHARSET_RULE = 2;
    CSSOM.CSSRule.IMPORT_RULE = 3;
    CSSOM.CSSRule.MEDIA_RULE = 4;
    CSSOM.CSSRule.FONT_FACE_RULE = 5;
    CSSOM.CSSRule.PAGE_RULE = 6;
    CSSOM.CSSRule.KEYFRAMES_RULE = 7;
    CSSOM.CSSRule.KEYFRAME_RULE = 8;
    CSSOM.CSSRule.MARGIN_RULE = 9;
    CSSOM.CSSRule.NAMESPACE_RULE = 10;
    CSSOM.CSSRule.COUNTER_STYLE_RULE = 11;
    CSSOM.CSSRule.SUPPORTS_RULE = 12;
    CSSOM.CSSRule.DOCUMENT_RULE = 13;
    CSSOM.CSSRule.FONT_FEATURE_VALUES_RULE = 14;
    CSSOM.CSSRule.VIEWPORT_RULE = 15;
    CSSOM.CSSRule.REGION_STYLE_RULE = 16;
    CSSOM.CSSRule.prototype = {
      constructor: CSSOM.CSSRule
      //FIXME
    };
    exports2.CSSRule = CSSOM.CSSRule;
  }
});

// node_modules/cssom/lib/CSSStyleRule.js
var require_CSSStyleRule = __commonJS({
  "node_modules/cssom/lib/CSSStyleRule.js"(exports2) {
    var CSSOM = {
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSStyleRule = function CSSStyleRule() {
      CSSOM.CSSRule.call(this);
      this.selectorText = "";
      this.style = new CSSOM.CSSStyleDeclaration();
      this.style.parentRule = this;
    };
    CSSOM.CSSStyleRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSStyleRule.prototype.constructor = CSSOM.CSSStyleRule;
    CSSOM.CSSStyleRule.prototype.type = 1;
    Object.defineProperty(CSSOM.CSSStyleRule.prototype, "cssText", {
      get: function() {
        var text;
        if (this.selectorText) {
          text = this.selectorText + " {" + this.style.cssText + "}";
        } else {
          text = "";
        }
        return text;
      },
      set: function(cssText) {
        var rule = CSSOM.CSSStyleRule.parse(cssText);
        this.style = rule.style;
        this.selectorText = rule.selectorText;
      }
    });
    CSSOM.CSSStyleRule.parse = function(ruleText) {
      var i = 0;
      var state = "selector";
      var index;
      var j = i;
      var buffer = "";
      var SIGNIFICANT_WHITESPACE = {
        "selector": true,
        "value": true
      };
      var styleRule = new CSSOM.CSSStyleRule();
      var name, priority = "";
      for (var character; character = ruleText.charAt(i); i++) {
        switch (character) {
          case " ":
          case "	":
          case "\r":
          case "\n":
          case "\f":
            if (SIGNIFICANT_WHITESPACE[state]) {
              switch (ruleText.charAt(i - 1)) {
                case " ":
                case "	":
                case "\r":
                case "\n":
                case "\f":
                  break;
                default:
                  buffer += " ";
                  break;
              }
            }
            break;
          // String
          case '"':
            j = i + 1;
            index = ruleText.indexOf('"', j) + 1;
            if (!index) {
              throw '" is missing';
            }
            buffer += ruleText.slice(i, index);
            i = index - 1;
            break;
          case "'":
            j = i + 1;
            index = ruleText.indexOf("'", j) + 1;
            if (!index) {
              throw "' is missing";
            }
            buffer += ruleText.slice(i, index);
            i = index - 1;
            break;
          // Comment
          case "/":
            if (ruleText.charAt(i + 1) === "*") {
              i += 2;
              index = ruleText.indexOf("*/", i);
              if (index === -1) {
                throw new SyntaxError("Missing */");
              } else {
                i = index + 1;
              }
            } else {
              buffer += character;
            }
            break;
          case "{":
            if (state === "selector") {
              styleRule.selectorText = buffer.trim();
              buffer = "";
              state = "name";
            }
            break;
          case ":":
            if (state === "name") {
              name = buffer.trim();
              buffer = "";
              state = "value";
            } else {
              buffer += character;
            }
            break;
          case "!":
            if (state === "value" && ruleText.indexOf("!important", i) === i) {
              priority = "important";
              i += "important".length;
            } else {
              buffer += character;
            }
            break;
          case ";":
            if (state === "value") {
              styleRule.style.setProperty(name, buffer.trim(), priority);
              priority = "";
              buffer = "";
              state = "name";
            } else {
              buffer += character;
            }
            break;
          case "}":
            if (state === "value") {
              styleRule.style.setProperty(name, buffer.trim(), priority);
              priority = "";
              buffer = "";
            } else if (state === "name") {
              break;
            } else {
              buffer += character;
            }
            state = "selector";
            break;
          default:
            buffer += character;
            break;
        }
      }
      return styleRule;
    };
    exports2.CSSStyleRule = CSSOM.CSSStyleRule;
  }
});

// node_modules/cssom/lib/CSSStyleSheet.js
var require_CSSStyleSheet = __commonJS({
  "node_modules/cssom/lib/CSSStyleSheet.js"(exports2) {
    var CSSOM = {
      StyleSheet: require_StyleSheet().StyleSheet,
      CSSStyleRule: require_CSSStyleRule().CSSStyleRule
    };
    CSSOM.CSSStyleSheet = function CSSStyleSheet() {
      CSSOM.StyleSheet.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSStyleSheet.prototype = new CSSOM.StyleSheet();
    CSSOM.CSSStyleSheet.prototype.constructor = CSSOM.CSSStyleSheet;
    CSSOM.CSSStyleSheet.prototype.insertRule = function(rule, index) {
      if (index < 0 || index > this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      var cssRule = CSSOM.parse(rule).cssRules[0];
      cssRule.parentStyleSheet = this;
      this.cssRules.splice(index, 0, cssRule);
      return index;
    };
    CSSOM.CSSStyleSheet.prototype.deleteRule = function(index) {
      if (index < 0 || index >= this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      this.cssRules.splice(index, 1);
    };
    CSSOM.CSSStyleSheet.prototype.toString = function() {
      var result = "";
      var rules = this.cssRules;
      for (var i = 0; i < rules.length; i++) {
        result += rules[i].cssText + "\n";
      }
      return result;
    };
    exports2.CSSStyleSheet = CSSOM.CSSStyleSheet;
    CSSOM.parse = require_parse2().parse;
  }
});

// node_modules/cssom/lib/MediaList.js
var require_MediaList = __commonJS({
  "node_modules/cssom/lib/MediaList.js"(exports2) {
    var CSSOM = {};
    CSSOM.MediaList = function MediaList() {
      this.length = 0;
    };
    CSSOM.MediaList.prototype = {
      constructor: CSSOM.MediaList,
      /**
       * @return {string}
       */
      get mediaText() {
        return Array.prototype.join.call(this, ", ");
      },
      /**
       * @param {string} value
       */
      set mediaText(value) {
        var values = value.split(",");
        var length = this.length = values.length;
        for (var i = 0; i < length; i++) {
          this[i] = values[i].trim();
        }
      },
      /**
       * @param {string} medium
       */
      appendMedium: function(medium) {
        if (Array.prototype.indexOf.call(this, medium) === -1) {
          this[this.length] = medium;
          this.length++;
        }
      },
      /**
       * @param {string} medium
       */
      deleteMedium: function(medium) {
        var index = Array.prototype.indexOf.call(this, medium);
        if (index !== -1) {
          Array.prototype.splice.call(this, index, 1);
        }
      }
    };
    exports2.MediaList = CSSOM.MediaList;
  }
});

// node_modules/cssom/lib/CSSImportRule.js
var require_CSSImportRule = __commonJS({
  "node_modules/cssom/lib/CSSImportRule.js"(exports2) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSStyleSheet: require_CSSStyleSheet().CSSStyleSheet,
      MediaList: require_MediaList().MediaList
    };
    CSSOM.CSSImportRule = function CSSImportRule() {
      CSSOM.CSSRule.call(this);
      this.href = "";
      this.media = new CSSOM.MediaList();
      this.styleSheet = new CSSOM.CSSStyleSheet();
    };
    CSSOM.CSSImportRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSImportRule.prototype.constructor = CSSOM.CSSImportRule;
    CSSOM.CSSImportRule.prototype.type = 3;
    Object.defineProperty(CSSOM.CSSImportRule.prototype, "cssText", {
      get: function() {
        var mediaText = this.media.mediaText;
        return "@import url(" + this.href + ")" + (mediaText ? " " + mediaText : "") + ";";
      },
      set: function(cssText) {
        var i = 0;
        var state = "";
        var buffer = "";
        var index;
        for (var character; character = cssText.charAt(i); i++) {
          switch (character) {
            case " ":
            case "	":
            case "\r":
            case "\n":
            case "\f":
              if (state === "after-import") {
                state = "url";
              } else {
                buffer += character;
              }
              break;
            case "@":
              if (!state && cssText.indexOf("@import", i) === i) {
                state = "after-import";
                i += "import".length;
                buffer = "";
              }
              break;
            case "u":
              if (state === "url" && cssText.indexOf("url(", i) === i) {
                index = cssText.indexOf(")", i + 1);
                if (index === -1) {
                  throw i + ': ")" not found';
                }
                i += "url(".length;
                var url = cssText.slice(i, index);
                if (url[0] === url[url.length - 1]) {
                  if (url[0] === '"' || url[0] === "'") {
                    url = url.slice(1, -1);
                  }
                }
                this.href = url;
                i = index;
                state = "media";
              }
              break;
            case '"':
              if (state === "url") {
                index = cssText.indexOf('"', i + 1);
                if (!index) {
                  throw i + `: '"' not found`;
                }
                this.href = cssText.slice(i + 1, index);
                i = index;
                state = "media";
              }
              break;
            case "'":
              if (state === "url") {
                index = cssText.indexOf("'", i + 1);
                if (!index) {
                  throw i + `: "'" not found`;
                }
                this.href = cssText.slice(i + 1, index);
                i = index;
                state = "media";
              }
              break;
            case ";":
              if (state === "media") {
                if (buffer) {
                  this.media.mediaText = buffer.trim();
                }
              }
              break;
            default:
              if (state === "media") {
                buffer += character;
              }
              break;
          }
        }
      }
    });
    exports2.CSSImportRule = CSSOM.CSSImportRule;
  }
});

// node_modules/cssom/lib/CSSGroupingRule.js
var require_CSSGroupingRule = __commonJS({
  "node_modules/cssom/lib/CSSGroupingRule.js"(exports2) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSGroupingRule = function CSSGroupingRule() {
      CSSOM.CSSRule.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSGroupingRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSGroupingRule.prototype.constructor = CSSOM.CSSGroupingRule;
    CSSOM.CSSGroupingRule.prototype.insertRule = function insertRule(rule, index) {
      if (index < 0 || index > this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      var cssRule = CSSOM.parse(rule).cssRules[0];
      cssRule.parentRule = this;
      this.cssRules.splice(index, 0, cssRule);
      return index;
    };
    CSSOM.CSSGroupingRule.prototype.deleteRule = function deleteRule(index) {
      if (index < 0 || index >= this.cssRules.length) {
        throw new RangeError("INDEX_SIZE_ERR");
      }
      this.cssRules.splice(index, 1)[0].parentRule = null;
    };
    exports2.CSSGroupingRule = CSSOM.CSSGroupingRule;
  }
});

// node_modules/cssom/lib/CSSConditionRule.js
var require_CSSConditionRule = __commonJS({
  "node_modules/cssom/lib/CSSConditionRule.js"(exports2) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule
    };
    CSSOM.CSSConditionRule = function CSSConditionRule() {
      CSSOM.CSSGroupingRule.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSConditionRule.prototype = new CSSOM.CSSGroupingRule();
    CSSOM.CSSConditionRule.prototype.constructor = CSSOM.CSSConditionRule;
    CSSOM.CSSConditionRule.prototype.conditionText = "";
    CSSOM.CSSConditionRule.prototype.cssText = "";
    exports2.CSSConditionRule = CSSOM.CSSConditionRule;
  }
});

// node_modules/cssom/lib/CSSMediaRule.js
var require_CSSMediaRule = __commonJS({
  "node_modules/cssom/lib/CSSMediaRule.js"(exports2) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
      CSSConditionRule: require_CSSConditionRule().CSSConditionRule,
      MediaList: require_MediaList().MediaList
    };
    CSSOM.CSSMediaRule = function CSSMediaRule() {
      CSSOM.CSSConditionRule.call(this);
      this.media = new CSSOM.MediaList();
    };
    CSSOM.CSSMediaRule.prototype = new CSSOM.CSSConditionRule();
    CSSOM.CSSMediaRule.prototype.constructor = CSSOM.CSSMediaRule;
    CSSOM.CSSMediaRule.prototype.type = 4;
    Object.defineProperties(CSSOM.CSSMediaRule.prototype, {
      "conditionText": {
        get: function() {
          return this.media.mediaText;
        },
        set: function(value) {
          this.media.mediaText = value;
        },
        configurable: true,
        enumerable: true
      },
      "cssText": {
        get: function() {
          var cssTexts = [];
          for (var i = 0, length = this.cssRules.length; i < length; i++) {
            cssTexts.push(this.cssRules[i].cssText);
          }
          return "@media " + this.media.mediaText + " {" + cssTexts.join("") + "}";
        },
        configurable: true,
        enumerable: true
      }
    });
    exports2.CSSMediaRule = CSSOM.CSSMediaRule;
  }
});

// node_modules/cssom/lib/CSSSupportsRule.js
var require_CSSSupportsRule = __commonJS({
  "node_modules/cssom/lib/CSSSupportsRule.js"(exports2) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
      CSSConditionRule: require_CSSConditionRule().CSSConditionRule
    };
    CSSOM.CSSSupportsRule = function CSSSupportsRule() {
      CSSOM.CSSConditionRule.call(this);
    };
    CSSOM.CSSSupportsRule.prototype = new CSSOM.CSSConditionRule();
    CSSOM.CSSSupportsRule.prototype.constructor = CSSOM.CSSSupportsRule;
    CSSOM.CSSSupportsRule.prototype.type = 12;
    Object.defineProperty(CSSOM.CSSSupportsRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length = this.cssRules.length; i < length; i++) {
          cssTexts.push(this.cssRules[i].cssText);
        }
        return "@supports " + this.conditionText + " {" + cssTexts.join("") + "}";
      }
    });
    exports2.CSSSupportsRule = CSSOM.CSSSupportsRule;
  }
});

// node_modules/cssom/lib/CSSFontFaceRule.js
var require_CSSFontFaceRule = __commonJS({
  "node_modules/cssom/lib/CSSFontFaceRule.js"(exports2) {
    var CSSOM = {
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSFontFaceRule = function CSSFontFaceRule() {
      CSSOM.CSSRule.call(this);
      this.style = new CSSOM.CSSStyleDeclaration();
      this.style.parentRule = this;
    };
    CSSOM.CSSFontFaceRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSFontFaceRule.prototype.constructor = CSSOM.CSSFontFaceRule;
    CSSOM.CSSFontFaceRule.prototype.type = 5;
    Object.defineProperty(CSSOM.CSSFontFaceRule.prototype, "cssText", {
      get: function() {
        return "@font-face {" + this.style.cssText + "}";
      }
    });
    exports2.CSSFontFaceRule = CSSOM.CSSFontFaceRule;
  }
});

// node_modules/cssom/lib/CSSHostRule.js
var require_CSSHostRule = __commonJS({
  "node_modules/cssom/lib/CSSHostRule.js"(exports2) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSHostRule = function CSSHostRule() {
      CSSOM.CSSRule.call(this);
      this.cssRules = [];
    };
    CSSOM.CSSHostRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSHostRule.prototype.constructor = CSSOM.CSSHostRule;
    CSSOM.CSSHostRule.prototype.type = 1001;
    Object.defineProperty(CSSOM.CSSHostRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length = this.cssRules.length; i < length; i++) {
          cssTexts.push(this.cssRules[i].cssText);
        }
        return "@host {" + cssTexts.join("") + "}";
      }
    });
    exports2.CSSHostRule = CSSOM.CSSHostRule;
  }
});

// node_modules/cssom/lib/CSSKeyframeRule.js
var require_CSSKeyframeRule = __commonJS({
  "node_modules/cssom/lib/CSSKeyframeRule.js"(exports2) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration
    };
    CSSOM.CSSKeyframeRule = function CSSKeyframeRule() {
      CSSOM.CSSRule.call(this);
      this.keyText = "";
      this.style = new CSSOM.CSSStyleDeclaration();
      this.style.parentRule = this;
    };
    CSSOM.CSSKeyframeRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSKeyframeRule.prototype.constructor = CSSOM.CSSKeyframeRule;
    CSSOM.CSSKeyframeRule.prototype.type = 8;
    Object.defineProperty(CSSOM.CSSKeyframeRule.prototype, "cssText", {
      get: function() {
        return this.keyText + " {" + this.style.cssText + "} ";
      }
    });
    exports2.CSSKeyframeRule = CSSOM.CSSKeyframeRule;
  }
});

// node_modules/cssom/lib/CSSKeyframesRule.js
var require_CSSKeyframesRule = __commonJS({
  "node_modules/cssom/lib/CSSKeyframesRule.js"(exports2) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule
    };
    CSSOM.CSSKeyframesRule = function CSSKeyframesRule() {
      CSSOM.CSSRule.call(this);
      this.name = "";
      this.cssRules = [];
    };
    CSSOM.CSSKeyframesRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSKeyframesRule.prototype.constructor = CSSOM.CSSKeyframesRule;
    CSSOM.CSSKeyframesRule.prototype.type = 7;
    Object.defineProperty(CSSOM.CSSKeyframesRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length = this.cssRules.length; i < length; i++) {
          cssTexts.push("  " + this.cssRules[i].cssText);
        }
        return "@" + (this._vendorPrefix || "") + "keyframes " + this.name + " { \n" + cssTexts.join("\n") + "\n}";
      }
    });
    exports2.CSSKeyframesRule = CSSOM.CSSKeyframesRule;
  }
});

// node_modules/cssom/lib/CSSValue.js
var require_CSSValue = __commonJS({
  "node_modules/cssom/lib/CSSValue.js"(exports2) {
    var CSSOM = {};
    CSSOM.CSSValue = function CSSValue() {
    };
    CSSOM.CSSValue.prototype = {
      constructor: CSSOM.CSSValue,
      // @see: http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSValue
      set cssText(text) {
        var name = this._getConstructorName();
        throw new Error('DOMException: property "cssText" of "' + name + '" is readonly and can not be replaced with "' + text + '"!');
      },
      get cssText() {
        var name = this._getConstructorName();
        throw new Error('getter "cssText" of "' + name + '" is not implemented!');
      },
      _getConstructorName: function() {
        var s = this.constructor.toString(), c = s.match(/function\s([^\(]+)/), name = c[1];
        return name;
      }
    };
    exports2.CSSValue = CSSOM.CSSValue;
  }
});

// node_modules/cssom/lib/CSSValueExpression.js
var require_CSSValueExpression = __commonJS({
  "node_modules/cssom/lib/CSSValueExpression.js"(exports2) {
    var CSSOM = {
      CSSValue: require_CSSValue().CSSValue
    };
    CSSOM.CSSValueExpression = function CSSValueExpression(token, idx) {
      this._token = token;
      this._idx = idx;
    };
    CSSOM.CSSValueExpression.prototype = new CSSOM.CSSValue();
    CSSOM.CSSValueExpression.prototype.constructor = CSSOM.CSSValueExpression;
    CSSOM.CSSValueExpression.prototype.parse = function() {
      var token = this._token, idx = this._idx;
      var character = "", expression = "", error = "", info, paren = [];
      for (; ; ++idx) {
        character = token.charAt(idx);
        if (character === "") {
          error = "css expression error: unfinished expression!";
          break;
        }
        switch (character) {
          case "(":
            paren.push(character);
            expression += character;
            break;
          case ")":
            paren.pop(character);
            expression += character;
            break;
          case "/":
            if (info = this._parseJSComment(token, idx)) {
              if (info.error) {
                error = "css expression error: unfinished comment in expression!";
              } else {
                idx = info.idx;
              }
            } else if (info = this._parseJSRexExp(token, idx)) {
              idx = info.idx;
              expression += info.text;
            } else {
              expression += character;
            }
            break;
          case "'":
          case '"':
            info = this._parseJSString(token, idx, character);
            if (info) {
              idx = info.idx;
              expression += info.text;
            } else {
              expression += character;
            }
            break;
          default:
            expression += character;
            break;
        }
        if (error) {
          break;
        }
        if (paren.length === 0) {
          break;
        }
      }
      var ret;
      if (error) {
        ret = {
          error
        };
      } else {
        ret = {
          idx,
          expression
        };
      }
      return ret;
    };
    CSSOM.CSSValueExpression.prototype._parseJSComment = function(token, idx) {
      var nextChar = token.charAt(idx + 1), text;
      if (nextChar === "/" || nextChar === "*") {
        var startIdx = idx, endIdx, commentEndChar;
        if (nextChar === "/") {
          commentEndChar = "\n";
        } else if (nextChar === "*") {
          commentEndChar = "*/";
        }
        endIdx = token.indexOf(commentEndChar, startIdx + 1 + 1);
        if (endIdx !== -1) {
          endIdx = endIdx + commentEndChar.length - 1;
          text = token.substring(idx, endIdx + 1);
          return {
            idx: endIdx,
            text
          };
        } else {
          var error = "css expression error: unfinished comment in expression!";
          return {
            error
          };
        }
      } else {
        return false;
      }
    };
    CSSOM.CSSValueExpression.prototype._parseJSString = function(token, idx, sep) {
      var endIdx = this._findMatchedIdx(token, idx, sep), text;
      if (endIdx === -1) {
        return false;
      } else {
        text = token.substring(idx, endIdx + sep.length);
        return {
          idx: endIdx,
          text
        };
      }
    };
    CSSOM.CSSValueExpression.prototype._parseJSRexExp = function(token, idx) {
      var before2 = token.substring(0, idx).replace(/\s+$/, ""), legalRegx = [
        /^$/,
        /\($/,
        /\[$/,
        /\!$/,
        /\+$/,
        /\-$/,
        /\*$/,
        /\/\s+/,
        /\%$/,
        /\=$/,
        /\>$/,
        /<$/,
        /\&$/,
        /\|$/,
        /\^$/,
        /\~$/,
        /\?$/,
        /\,$/,
        /delete$/,
        /in$/,
        /instanceof$/,
        /new$/,
        /typeof$/,
        /void$/
      ];
      var isLegal = legalRegx.some(function(reg) {
        return reg.test(before2);
      });
      if (!isLegal) {
        return false;
      } else {
        var sep = "/";
        return this._parseJSString(token, idx, sep);
      }
    };
    CSSOM.CSSValueExpression.prototype._findMatchedIdx = function(token, idx, sep) {
      var startIdx = idx, endIdx;
      var NOT_FOUND = -1;
      while (true) {
        endIdx = token.indexOf(sep, startIdx + 1);
        if (endIdx === -1) {
          endIdx = NOT_FOUND;
          break;
        } else {
          var text = token.substring(idx + 1, endIdx), matched = text.match(/\\+$/);
          if (!matched || matched[0] % 2 === 0) {
            break;
          } else {
            startIdx = endIdx;
          }
        }
      }
      var nextNewLineIdx = token.indexOf("\n", idx + 1);
      if (nextNewLineIdx < endIdx) {
        endIdx = NOT_FOUND;
      }
      return endIdx;
    };
    exports2.CSSValueExpression = CSSOM.CSSValueExpression;
  }
});

// node_modules/cssom/lib/MatcherList.js
var require_MatcherList = __commonJS({
  "node_modules/cssom/lib/MatcherList.js"(exports2) {
    var CSSOM = {};
    CSSOM.MatcherList = function MatcherList() {
      this.length = 0;
    };
    CSSOM.MatcherList.prototype = {
      constructor: CSSOM.MatcherList,
      /**
       * @return {string}
       */
      get matcherText() {
        return Array.prototype.join.call(this, ", ");
      },
      /**
       * @param {string} value
       */
      set matcherText(value) {
        var values = value.split(",");
        var length = this.length = values.length;
        for (var i = 0; i < length; i++) {
          this[i] = values[i].trim();
        }
      },
      /**
       * @param {string} matcher
       */
      appendMatcher: function(matcher) {
        if (Array.prototype.indexOf.call(this, matcher) === -1) {
          this[this.length] = matcher;
          this.length++;
        }
      },
      /**
       * @param {string} matcher
       */
      deleteMatcher: function(matcher) {
        var index = Array.prototype.indexOf.call(this, matcher);
        if (index !== -1) {
          Array.prototype.splice.call(this, index, 1);
        }
      }
    };
    exports2.MatcherList = CSSOM.MatcherList;
  }
});

// node_modules/cssom/lib/CSSDocumentRule.js
var require_CSSDocumentRule = __commonJS({
  "node_modules/cssom/lib/CSSDocumentRule.js"(exports2) {
    var CSSOM = {
      CSSRule: require_CSSRule().CSSRule,
      MatcherList: require_MatcherList().MatcherList
    };
    CSSOM.CSSDocumentRule = function CSSDocumentRule() {
      CSSOM.CSSRule.call(this);
      this.matcher = new CSSOM.MatcherList();
      this.cssRules = [];
    };
    CSSOM.CSSDocumentRule.prototype = new CSSOM.CSSRule();
    CSSOM.CSSDocumentRule.prototype.constructor = CSSOM.CSSDocumentRule;
    CSSOM.CSSDocumentRule.prototype.type = 10;
    Object.defineProperty(CSSOM.CSSDocumentRule.prototype, "cssText", {
      get: function() {
        var cssTexts = [];
        for (var i = 0, length = this.cssRules.length; i < length; i++) {
          cssTexts.push(this.cssRules[i].cssText);
        }
        return "@-moz-document " + this.matcher.matcherText + " {" + cssTexts.join("") + "}";
      }
    });
    exports2.CSSDocumentRule = CSSOM.CSSDocumentRule;
  }
});

// node_modules/cssom/lib/parse.js
var require_parse2 = __commonJS({
  "node_modules/cssom/lib/parse.js"(exports2) {
    var CSSOM = {};
    CSSOM.parse = function parse6(token) {
      var i = 0;
      var state = "before-selector";
      var index;
      var buffer = "";
      var valueParenthesisDepth = 0;
      var SIGNIFICANT_WHITESPACE = {
        "selector": true,
        "value": true,
        "value-parenthesis": true,
        "atRule": true,
        "importRule-begin": true,
        "importRule": true,
        "atBlock": true,
        "conditionBlock": true,
        "documentRule-begin": true
      };
      var styleSheet = new CSSOM.CSSStyleSheet();
      var currentScope = styleSheet;
      var parentRule;
      var ancestorRules = [];
      var hasAncestors = false;
      var prevScope;
      var name, priority = "", styleRule, mediaRule, supportsRule, importRule, fontFaceRule, keyframesRule, documentRule, hostRule;
      var atKeyframesRegExp = /@(-(?:\w+-)+)?keyframes/g;
      var parseError = function(message) {
        var lines = token.substring(0, i).split("\n");
        var lineCount = lines.length;
        var charCount = lines.pop().length + 1;
        var error = new Error(message + " (line " + lineCount + ", char " + charCount + ")");
        error.line = lineCount;
        error["char"] = charCount;
        error.styleSheet = styleSheet;
        throw error;
      };
      for (var character; character = token.charAt(i); i++) {
        switch (character) {
          case " ":
          case "	":
          case "\r":
          case "\n":
          case "\f":
            if (SIGNIFICANT_WHITESPACE[state]) {
              buffer += character;
            }
            break;
          // String
          case '"':
            index = i + 1;
            do {
              index = token.indexOf('"', index) + 1;
              if (!index) {
                parseError('Unmatched "');
              }
            } while (token[index - 2] === "\\");
            buffer += token.slice(i, index);
            i = index - 1;
            switch (state) {
              case "before-value":
                state = "value";
                break;
              case "importRule-begin":
                state = "importRule";
                break;
            }
            break;
          case "'":
            index = i + 1;
            do {
              index = token.indexOf("'", index) + 1;
              if (!index) {
                parseError("Unmatched '");
              }
            } while (token[index - 2] === "\\");
            buffer += token.slice(i, index);
            i = index - 1;
            switch (state) {
              case "before-value":
                state = "value";
                break;
              case "importRule-begin":
                state = "importRule";
                break;
            }
            break;
          // Comment
          case "/":
            if (token.charAt(i + 1) === "*") {
              i += 2;
              index = token.indexOf("*/", i);
              if (index === -1) {
                parseError("Missing */");
              } else {
                i = index + 1;
              }
            } else {
              buffer += character;
            }
            if (state === "importRule-begin") {
              buffer += " ";
              state = "importRule";
            }
            break;
          // At-rule
          case "@":
            if (token.indexOf("@-moz-document", i) === i) {
              state = "documentRule-begin";
              documentRule = new CSSOM.CSSDocumentRule();
              documentRule.__starts = i;
              i += "-moz-document".length;
              buffer = "";
              break;
            } else if (token.indexOf("@media", i) === i) {
              state = "atBlock";
              mediaRule = new CSSOM.CSSMediaRule();
              mediaRule.__starts = i;
              i += "media".length;
              buffer = "";
              break;
            } else if (token.indexOf("@supports", i) === i) {
              state = "conditionBlock";
              supportsRule = new CSSOM.CSSSupportsRule();
              supportsRule.__starts = i;
              i += "supports".length;
              buffer = "";
              break;
            } else if (token.indexOf("@host", i) === i) {
              state = "hostRule-begin";
              i += "host".length;
              hostRule = new CSSOM.CSSHostRule();
              hostRule.__starts = i;
              buffer = "";
              break;
            } else if (token.indexOf("@import", i) === i) {
              state = "importRule-begin";
              i += "import".length;
              buffer += "@import";
              break;
            } else if (token.indexOf("@font-face", i) === i) {
              state = "fontFaceRule-begin";
              i += "font-face".length;
              fontFaceRule = new CSSOM.CSSFontFaceRule();
              fontFaceRule.__starts = i;
              buffer = "";
              break;
            } else {
              atKeyframesRegExp.lastIndex = i;
              var matchKeyframes = atKeyframesRegExp.exec(token);
              if (matchKeyframes && matchKeyframes.index === i) {
                state = "keyframesRule-begin";
                keyframesRule = new CSSOM.CSSKeyframesRule();
                keyframesRule.__starts = i;
                keyframesRule._vendorPrefix = matchKeyframes[1];
                i += matchKeyframes[0].length - 1;
                buffer = "";
                break;
              } else if (state === "selector") {
                state = "atRule";
              }
            }
            buffer += character;
            break;
          case "{":
            if (state === "selector" || state === "atRule") {
              styleRule.selectorText = buffer.trim();
              styleRule.style.__starts = i;
              buffer = "";
              state = "before-name";
            } else if (state === "atBlock") {
              mediaRule.media.mediaText = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
              }
              currentScope = parentRule = mediaRule;
              mediaRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            } else if (state === "conditionBlock") {
              supportsRule.conditionText = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
              }
              currentScope = parentRule = supportsRule;
              supportsRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            } else if (state === "hostRule-begin") {
              if (parentRule) {
                ancestorRules.push(parentRule);
              }
              currentScope = parentRule = hostRule;
              hostRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            } else if (state === "fontFaceRule-begin") {
              if (parentRule) {
                fontFaceRule.parentRule = parentRule;
              }
              fontFaceRule.parentStyleSheet = styleSheet;
              styleRule = fontFaceRule;
              buffer = "";
              state = "before-name";
            } else if (state === "keyframesRule-begin") {
              keyframesRule.name = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
                keyframesRule.parentRule = parentRule;
              }
              keyframesRule.parentStyleSheet = styleSheet;
              currentScope = parentRule = keyframesRule;
              buffer = "";
              state = "keyframeRule-begin";
            } else if (state === "keyframeRule-begin") {
              styleRule = new CSSOM.CSSKeyframeRule();
              styleRule.keyText = buffer.trim();
              styleRule.__starts = i;
              buffer = "";
              state = "before-name";
            } else if (state === "documentRule-begin") {
              documentRule.matcher.matcherText = buffer.trim();
              if (parentRule) {
                ancestorRules.push(parentRule);
                documentRule.parentRule = parentRule;
              }
              currentScope = parentRule = documentRule;
              documentRule.parentStyleSheet = styleSheet;
              buffer = "";
              state = "before-selector";
            }
            break;
          case ":":
            if (state === "name") {
              name = buffer.trim();
              buffer = "";
              state = "before-value";
            } else {
              buffer += character;
            }
            break;
          case "(":
            if (state === "value") {
              if (buffer.trim() === "expression") {
                var info = new CSSOM.CSSValueExpression(token, i).parse();
                if (info.error) {
                  parseError(info.error);
                } else {
                  buffer += info.expression;
                  i = info.idx;
                }
              } else {
                state = "value-parenthesis";
                valueParenthesisDepth = 1;
                buffer += character;
              }
            } else if (state === "value-parenthesis") {
              valueParenthesisDepth++;
              buffer += character;
            } else {
              buffer += character;
            }
            break;
          case ")":
            if (state === "value-parenthesis") {
              valueParenthesisDepth--;
              if (valueParenthesisDepth === 0) state = "value";
            }
            buffer += character;
            break;
          case "!":
            if (state === "value" && token.indexOf("!important", i) === i) {
              priority = "important";
              i += "important".length;
            } else {
              buffer += character;
            }
            break;
          case ";":
            switch (state) {
              case "value":
                styleRule.style.setProperty(name, buffer.trim(), priority);
                priority = "";
                buffer = "";
                state = "before-name";
                break;
              case "atRule":
                buffer = "";
                state = "before-selector";
                break;
              case "importRule":
                importRule = new CSSOM.CSSImportRule();
                importRule.parentStyleSheet = importRule.styleSheet.parentStyleSheet = styleSheet;
                importRule.cssText = buffer + character;
                styleSheet.cssRules.push(importRule);
                buffer = "";
                state = "before-selector";
                break;
              default:
                buffer += character;
                break;
            }
            break;
          case "}":
            switch (state) {
              case "value":
                styleRule.style.setProperty(name, buffer.trim(), priority);
                priority = "";
              /* falls through */
              case "before-name":
              case "name":
                styleRule.__ends = i + 1;
                if (parentRule) {
                  styleRule.parentRule = parentRule;
                }
                styleRule.parentStyleSheet = styleSheet;
                currentScope.cssRules.push(styleRule);
                buffer = "";
                if (currentScope.constructor === CSSOM.CSSKeyframesRule) {
                  state = "keyframeRule-begin";
                } else {
                  state = "before-selector";
                }
                break;
              case "keyframeRule-begin":
              case "before-selector":
              case "selector":
                if (!parentRule) {
                  parseError("Unexpected }");
                }
                hasAncestors = ancestorRules.length > 0;
                while (ancestorRules.length > 0) {
                  parentRule = ancestorRules.pop();
                  if (parentRule.constructor.name === "CSSMediaRule" || parentRule.constructor.name === "CSSSupportsRule") {
                    prevScope = currentScope;
                    currentScope = parentRule;
                    currentScope.cssRules.push(prevScope);
                    break;
                  }
                  if (ancestorRules.length === 0) {
                    hasAncestors = false;
                  }
                }
                if (!hasAncestors) {
                  currentScope.__ends = i + 1;
                  styleSheet.cssRules.push(currentScope);
                  currentScope = styleSheet;
                  parentRule = null;
                }
                buffer = "";
                state = "before-selector";
                break;
            }
            break;
          default:
            switch (state) {
              case "before-selector":
                state = "selector";
                styleRule = new CSSOM.CSSStyleRule();
                styleRule.__starts = i;
                break;
              case "before-name":
                state = "name";
                break;
              case "before-value":
                state = "value";
                break;
              case "importRule-begin":
                state = "importRule";
                break;
            }
            buffer += character;
            break;
        }
      }
      return styleSheet;
    };
    exports2.parse = CSSOM.parse;
    CSSOM.CSSStyleSheet = require_CSSStyleSheet().CSSStyleSheet;
    CSSOM.CSSStyleRule = require_CSSStyleRule().CSSStyleRule;
    CSSOM.CSSImportRule = require_CSSImportRule().CSSImportRule;
    CSSOM.CSSGroupingRule = require_CSSGroupingRule().CSSGroupingRule;
    CSSOM.CSSMediaRule = require_CSSMediaRule().CSSMediaRule;
    CSSOM.CSSConditionRule = require_CSSConditionRule().CSSConditionRule;
    CSSOM.CSSSupportsRule = require_CSSSupportsRule().CSSSupportsRule;
    CSSOM.CSSFontFaceRule = require_CSSFontFaceRule().CSSFontFaceRule;
    CSSOM.CSSHostRule = require_CSSHostRule().CSSHostRule;
    CSSOM.CSSStyleDeclaration = require_CSSStyleDeclaration().CSSStyleDeclaration;
    CSSOM.CSSKeyframeRule = require_CSSKeyframeRule().CSSKeyframeRule;
    CSSOM.CSSKeyframesRule = require_CSSKeyframesRule().CSSKeyframesRule;
    CSSOM.CSSValueExpression = require_CSSValueExpression().CSSValueExpression;
    CSSOM.CSSDocumentRule = require_CSSDocumentRule().CSSDocumentRule;
  }
});

// node_modules/cssom/lib/CSSStyleDeclaration.js
var require_CSSStyleDeclaration = __commonJS({
  "node_modules/cssom/lib/CSSStyleDeclaration.js"(exports2) {
    var CSSOM = {};
    CSSOM.CSSStyleDeclaration = function CSSStyleDeclaration2() {
      this.length = 0;
      this.parentRule = null;
      this._importants = {};
    };
    CSSOM.CSSStyleDeclaration.prototype = {
      constructor: CSSOM.CSSStyleDeclaration,
      /**
       *
       * @param {string} name
       * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-getPropertyValue
       * @return {string} the value of the property if it has been explicitly set for this declaration block.
       * Returns the empty string if the property has not been set.
       */
      getPropertyValue: function(name) {
        return this[name] || "";
      },
      /**
       *
       * @param {string} name
       * @param {string} value
       * @param {string} [priority=null] "important" or null
       * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-setProperty
       */
      setProperty: function(name, value, priority) {
        if (this[name]) {
          var index = Array.prototype.indexOf.call(this, name);
          if (index < 0) {
            this[this.length] = name;
            this.length++;
          }
        } else {
          this[this.length] = name;
          this.length++;
        }
        this[name] = value + "";
        this._importants[name] = priority;
      },
      /**
       *
       * @param {string} name
       * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-removeProperty
       * @return {string} the value of the property if it has been explicitly set for this declaration block.
       * Returns the empty string if the property has not been set or the property name does not correspond to a known CSS property.
       */
      removeProperty: function(name) {
        if (!(name in this)) {
          return "";
        }
        var index = Array.prototype.indexOf.call(this, name);
        if (index < 0) {
          return "";
        }
        var prevValue = this[name];
        this[name] = "";
        Array.prototype.splice.call(this, index, 1);
        return prevValue;
      },
      getPropertyCSSValue: function() {
      },
      /**
       *
       * @param {String} name
       */
      getPropertyPriority: function(name) {
        return this._importants[name] || "";
      },
      /**
       *   element.style.overflow = "auto"
       *   element.style.getPropertyShorthand("overflow-x")
       *   -> "overflow"
       */
      getPropertyShorthand: function() {
      },
      isPropertyImplicit: function() {
      },
      // Doesn't work in IE < 9
      get cssText() {
        var properties = [];
        for (var i = 0, length = this.length; i < length; ++i) {
          var name = this[i];
          var value = this.getPropertyValue(name);
          var priority = this.getPropertyPriority(name);
          if (priority) {
            priority = " !" + priority;
          }
          properties[i] = name + ": " + value + priority + ";";
        }
        return properties.join(" ");
      },
      set cssText(text) {
        var i, name;
        for (i = this.length; i--; ) {
          name = this[i];
          this[name] = "";
        }
        Array.prototype.splice.call(this, 0, this.length);
        this._importants = {};
        var dummyRule = CSSOM.parse("#bogus{" + text + "}").cssRules[0].style;
        var length = dummyRule.length;
        for (i = 0; i < length; ++i) {
          name = dummyRule[i];
          this.setProperty(dummyRule[i], dummyRule.getPropertyValue(name), dummyRule.getPropertyPriority(name));
        }
      }
    };
    exports2.CSSStyleDeclaration = CSSOM.CSSStyleDeclaration;
    CSSOM.parse = require_parse2().parse;
  }
});

// node_modules/cssom/lib/clone.js
var require_clone = __commonJS({
  "node_modules/cssom/lib/clone.js"(exports2) {
    var CSSOM = {
      CSSStyleSheet: require_CSSStyleSheet().CSSStyleSheet,
      CSSRule: require_CSSRule().CSSRule,
      CSSStyleRule: require_CSSStyleRule().CSSStyleRule,
      CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
      CSSConditionRule: require_CSSConditionRule().CSSConditionRule,
      CSSMediaRule: require_CSSMediaRule().CSSMediaRule,
      CSSSupportsRule: require_CSSSupportsRule().CSSSupportsRule,
      CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
      CSSKeyframeRule: require_CSSKeyframeRule().CSSKeyframeRule,
      CSSKeyframesRule: require_CSSKeyframesRule().CSSKeyframesRule
    };
    CSSOM.clone = function clone(stylesheet) {
      var cloned = new CSSOM.CSSStyleSheet();
      var rules = stylesheet.cssRules;
      if (!rules) {
        return cloned;
      }
      for (var i = 0, rulesLength = rules.length; i < rulesLength; i++) {
        var rule = rules[i];
        var ruleClone = cloned.cssRules[i] = new rule.constructor();
        var style = rule.style;
        if (style) {
          var styleClone = ruleClone.style = new CSSOM.CSSStyleDeclaration();
          for (var j = 0, styleLength = style.length; j < styleLength; j++) {
            var name = styleClone[j] = style[j];
            styleClone[name] = style[name];
            styleClone._importants[name] = style.getPropertyPriority(name);
          }
          styleClone.length = style.length;
        }
        if (rule.hasOwnProperty("keyText")) {
          ruleClone.keyText = rule.keyText;
        }
        if (rule.hasOwnProperty("selectorText")) {
          ruleClone.selectorText = rule.selectorText;
        }
        if (rule.hasOwnProperty("mediaText")) {
          ruleClone.mediaText = rule.mediaText;
        }
        if (rule.hasOwnProperty("conditionText")) {
          ruleClone.conditionText = rule.conditionText;
        }
        if (rule.hasOwnProperty("cssRules")) {
          ruleClone.cssRules = clone(rule).cssRules;
        }
      }
      return cloned;
    };
    exports2.clone = CSSOM.clone;
  }
});

// node_modules/cssom/lib/index.js
var require_lib = __commonJS({
  "node_modules/cssom/lib/index.js"(exports2) {
    "use strict";
    exports2.CSSStyleDeclaration = require_CSSStyleDeclaration().CSSStyleDeclaration;
    exports2.CSSRule = require_CSSRule().CSSRule;
    exports2.CSSGroupingRule = require_CSSGroupingRule().CSSGroupingRule;
    exports2.CSSConditionRule = require_CSSConditionRule().CSSConditionRule;
    exports2.CSSStyleRule = require_CSSStyleRule().CSSStyleRule;
    exports2.MediaList = require_MediaList().MediaList;
    exports2.CSSMediaRule = require_CSSMediaRule().CSSMediaRule;
    exports2.CSSSupportsRule = require_CSSSupportsRule().CSSSupportsRule;
    exports2.CSSImportRule = require_CSSImportRule().CSSImportRule;
    exports2.CSSFontFaceRule = require_CSSFontFaceRule().CSSFontFaceRule;
    exports2.CSSHostRule = require_CSSHostRule().CSSHostRule;
    exports2.StyleSheet = require_StyleSheet().StyleSheet;
    exports2.CSSStyleSheet = require_CSSStyleSheet().CSSStyleSheet;
    exports2.CSSKeyframesRule = require_CSSKeyframesRule().CSSKeyframesRule;
    exports2.CSSKeyframeRule = require_CSSKeyframeRule().CSSKeyframeRule;
    exports2.MatcherList = require_MatcherList().MatcherList;
    exports2.CSSDocumentRule = require_CSSDocumentRule().CSSDocumentRule;
    exports2.CSSValue = require_CSSValue().CSSValue;
    exports2.CSSValueExpression = require_CSSValueExpression().CSSValueExpression;
    exports2.parse = require_parse2().parse;
    exports2.clone = require_clone().clone;
  }
});

// node_modules/linkedom/commonjs/canvas-shim.cjs
var require_canvas_shim = __commonJS({
  "node_modules/linkedom/commonjs/canvas-shim.cjs"(exports2, module2) {
    var Canvas2 = class {
      constructor(width, height) {
        this.width = width;
        this.height = height;
      }
      getContext() {
        return null;
      }
      toDataURL() {
        return "";
      }
    };
    module2.exports = {
      createCanvas: (width, height) => new Canvas2(width, height)
    };
  }
});

// node_modules/linkedom/commonjs/canvas.cjs
var require_canvas = __commonJS({
  "node_modules/linkedom/commonjs/canvas.cjs"(exports2, module2) {
    try {
      module2.exports = require("canvas");
    } catch (fallback) {
      module2.exports = require_canvas_shim();
    }
  }
});

// node_modules/bpmn-js/dist/bpmn-viewer.production.min.js
var require_bpmn_viewer_production_min = __commonJS({
  "node_modules/bpmn-js/dist/bpmn-viewer.production.min.js"(exports2, module2) {
    !(function(e, t) {
      "object" == typeof exports2 && "undefined" != typeof module2 ? module2.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).BpmnJS = t();
    })(exports2, (function() {
      "use strict";
      function e(e2, t2) {
        t2 && (e2.super_ = t2, e2.prototype = Object.create(t2.prototype, { constructor: { value: e2, enumerable: false, writable: true, configurable: true } }));
      }
      const t = Object.prototype.toString, n = Object.prototype.hasOwnProperty;
      function i(e2) {
        return void 0 === e2;
      }
      function r(e2) {
        return void 0 !== e2;
      }
      function o(e2) {
        return "[object Array]" === t.call(e2);
      }
      function a(e2) {
        return "[object Object]" === t.call(e2);
      }
      function s(e2) {
        return "[object Number]" === t.call(e2);
      }
      function l(e2) {
        const n2 = t.call(e2);
        return "[object Function]" === n2 || "[object AsyncFunction]" === n2 || "[object GeneratorFunction]" === n2 || "[object AsyncGeneratorFunction]" === n2 || "[object Proxy]" === n2;
      }
      function p(e2) {
        return "[object String]" === t.call(e2);
      }
      function c(e2, t2) {
        return n.call(e2, t2);
      }
      function u(e2, t2) {
        const n2 = v(t2);
        let i2;
        return f(e2, (function(e3, t3) {
          if (n2(e3, t3)) return i2 = e3, false;
        })), i2;
      }
      function h(e2, t2) {
        const n2 = v(t2);
        let i2 = [];
        return f(e2, (function(e3, t3) {
          n2(e3, t3) && i2.push(e3);
        })), i2;
      }
      function f(e2, t2) {
        let n2, r2;
        if (i(e2)) return;
        const a2 = o(e2) ? w : x;
        for (let i2 in e2) if (c(e2, i2) && (n2 = e2[i2], r2 = t2(n2, a2(i2)), false === r2)) return n2;
      }
      function m(e2, t2, n2) {
        return f(e2, (function(e3, i2) {
          n2 = t2(n2, e3, i2);
        })), n2;
      }
      function d(e2, t2) {
        return !!m(e2, (function(e3, n2, i2) {
          return e3 && t2(n2, i2);
        }), true);
      }
      function y(e2, t2) {
        return !!u(e2, t2);
      }
      function g(e2) {
        return function(t2) {
          return d(e2, (function(e3, n2) {
            return t2[n2] === e3;
          }));
        };
      }
      function v(e2) {
        return l(e2) ? e2 : (t2) => t2 === e2;
      }
      function x(e2) {
        return e2;
      }
      function w(e2) {
        return Number(e2);
      }
      function b(e2, t2) {
        return e2.bind(t2);
      }
      function E(e2, ...t2) {
        return Object.assign(e2, ...t2);
      }
      var _ = 1e3;
      function A(e2, t2) {
        var n2 = this;
        t2 = t2 || _, e2.on(["render.shape", "render.connection"], t2, (function(e3, t3) {
          var i2 = e3.type, r2 = t3.element, o2 = t3.gfx, a2 = t3.attrs;
          if (n2.canRender(r2)) return "render.shape" === i2 ? n2.drawShape(o2, r2, a2) : n2.drawConnection(o2, r2, a2);
        })), e2.on(["render.getShapePath", "render.getConnectionPath"], t2, (function(e3, t3) {
          if (n2.canRender(t3)) return "render.getShapePath" === e3.type ? n2.getShapePath(t3) : n2.getConnectionPath(t3);
        }));
      }
      function R(e2, t2) {
        var n2 = k(e2);
        return n2 && "function" == typeof n2.$instanceOf && n2.$instanceOf(t2);
      }
      function S(e2, t2) {
        return y(t2, (function(t3) {
          return R(e2, t3);
        }));
      }
      function k(e2) {
        return e2 && e2.businessObject || e2;
      }
      function C(e2) {
        return e2 && e2.di;
      }
      function M(e2, t2) {
        return !R(e2, "bpmn:CallActivity") && (R(e2, "bpmn:SubProcess") ? !(!(t2 = t2 || C(e2)) || !R(t2, "bpmndi:BPMNPlane")) || t2 && !!t2.isExpanded : !R(e2, "bpmn:Participant") || !!k(e2).processRef);
      }
      function P(e2) {
        if (R(e2, "bpmn:Participant") || R(e2, "bpmn:Lane")) {
          var t2 = C(e2).isHorizontal;
          return void 0 === t2 || t2;
        }
      }
      function O(e2) {
        return a(e2) && c(e2, "labelTarget");
      }
      A.prototype.canRender = function(e2) {
      }, A.prototype.drawShape = function(e2, t2) {
      }, A.prototype.drawConnection = function(e2, t2) {
      }, A.prototype.getShapePath = function(e2) {
      }, A.prototype.getConnectionPath = function(e2) {
      };
      var T = { width: 90, height: 20 }, N = 15;
      function D(e2) {
        var t2 = e2.length / 2 - 1, n2 = e2[Math.floor(t2)], i2 = e2[Math.ceil(t2 + 0.01)], r2 = (function(e3) {
          var t3 = e3.length / 2 - 1, n3 = e3[Math.floor(t3)], i3 = e3[Math.ceil(t3 + 0.01)];
          return { x: n3.x + (i3.x - n3.x) / 2, y: n3.y + (i3.y - n3.y) / 2 };
        })(e2), o2 = Math.atan((i2.y - n2.y) / (i2.x - n2.x)), a2 = r2.x, s2 = r2.y;
        return Math.abs(o2) < Math.PI / 2 ? s2 -= N : a2 += N, { x: a2, y: s2 };
      }
      function B(e2, t2) {
        var n2, i2, r2, o2 = e2.label;
        return o2 && o2.bounds ? (r2 = o2.bounds, i2 = { width: Math.max(T.width, r2.width), height: r2.height }, n2 = { x: r2.x + r2.width / 2, y: r2.y + r2.height / 2 }) : (n2 = (function(e3) {
          return e3.waypoints ? D(e3.waypoints) : R(e3, "bpmn:Group") ? { x: e3.x + e3.width / 2, y: e3.y + T.height / 2 } : { x: e3.x + e3.width / 2, y: e3.y + e3.height + T.height / 2 };
        })(t2), i2 = T), E({ x: n2.x - i2.width / 2, y: n2.y - i2.height / 2 }, i2);
      }
      function L(e2) {
        var t2 = e2.businessObject, n2 = (function(e3) {
          return R(e3, "bpmn:FlowElement") || R(e3, "bpmn:Participant") || R(e3, "bpmn:Lane") || R(e3, "bpmn:SequenceFlow") || R(e3, "bpmn:MessageFlow") || R(e3, "bpmn:DataInput") || R(e3, "bpmn:DataOutput") ? "name" : R(e3, "bpmn:TextAnnotation") ? "text" : R(e3, "bpmn:Group") ? "categoryValueRef" : void 0;
        })(t2);
        if (n2) return "categoryValueRef" === n2 ? (function(e3) {
          var t3 = e3.categoryValueRef;
          return t3 && t3.value || "";
        })(t2) : t2[n2] || "";
      }
      function I(e2, t2) {
        return (function(e3, t3) {
          t3.appendChild((function(e4, t4) {
            if (e4.ownerDocument !== t4.ownerDocument) try {
              return t4.ownerDocument.importNode(e4, true);
            } catch (e5) {
            }
            return e4;
          })(e3, t3));
        })(t2, e2), e2;
      }
      var j = 2, F = { "alignment-baseline": 1, "baseline-shift": 1, clip: 1, "clip-path": 1, "clip-rule": 1, color: 1, "color-interpolation": 1, "color-interpolation-filters": 1, "color-profile": 1, "color-rendering": 1, cursor: 1, direction: 1, display: 1, "dominant-baseline": 1, "enable-background": 1, fill: 1, "fill-opacity": 1, "fill-rule": 1, filter: 1, "flood-color": 1, "flood-opacity": 1, font: 1, "font-family": 1, "font-size": j, "font-size-adjust": 1, "font-stretch": 1, "font-style": 1, "font-variant": 1, "font-weight": 1, "glyph-orientation-horizontal": 1, "glyph-orientation-vertical": 1, "image-rendering": 1, kerning: 1, "letter-spacing": 1, "lighting-color": 1, marker: 1, "marker-end": 1, "marker-mid": 1, "marker-start": 1, mask: 1, opacity: 1, overflow: 1, "pointer-events": 1, "shape-rendering": 1, "stop-color": 1, "stop-opacity": 1, stroke: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, "stroke-linecap": 1, "stroke-linejoin": 1, "stroke-miterlimit": 1, "stroke-opacity": 1, "stroke-width": j, "text-anchor": 1, "text-decoration": 1, "text-rendering": 1, "unicode-bidi": 1, visibility: 1, "word-spacing": 1, "writing-mode": 1 };
      function V(e2, t2, n2) {
        var i2 = t2.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), r2 = F[i2];
        r2 ? (r2 === j && "number" == typeof n2 && (n2 = String(n2) + "px"), e2.style[i2] = n2) : e2.setAttributeNS(null, t2, n2);
      }
      function W(e2, t2, n2) {
        if ("string" == typeof t2) {
          if (void 0 === n2) return (function(e3, t3) {
            return F[t3] ? e3.style[t3] : e3.getAttributeNS(null, t3);
          })(e2, t2);
          V(e2, t2, n2);
        } else !(function(e3, t3) {
          var n3, i2, r2 = Object.keys(t3);
          for (n3 = 0; i2 = r2[n3]; n3++) V(e3, i2, t3[i2]);
        })(e2, t2);
        return e2;
      }
      const $ = Object.prototype.toString;
      function z(e2) {
        return new G(e2);
      }
      function G(e2) {
        if (!e2 || !e2.nodeType) throw new Error("A DOM element reference is required");
        this.el = e2, this.list = e2.classList;
      }
      G.prototype.add = function(e2) {
        return this.list.add(e2), this;
      }, G.prototype.remove = function(e2) {
        return "[object RegExp]" == $.call(e2) ? this.removeMatching(e2) : (this.list.remove(e2), this);
      }, G.prototype.removeMatching = function(e2) {
        const t2 = this.array();
        for (let n2 = 0; n2 < t2.length; n2++) e2.test(t2[n2]) && this.remove(t2[n2]);
        return this;
      }, G.prototype.toggle = function(e2, t2) {
        return void 0 !== t2 ? t2 !== this.list.toggle(e2, t2) && this.list.toggle(e2) : this.list.toggle(e2), this;
      }, G.prototype.array = function() {
        return Array.from(this.list);
      }, G.prototype.has = G.prototype.contains = function(e2) {
        return this.list.contains(e2);
      };
      var H = { svg: "http://www.w3.org/2000/svg" }, K = '<svg xmlns="' + H.svg + '"';
      function U(e2) {
        var t2 = false;
        "<svg" === e2.substring(0, 4) ? -1 === e2.indexOf(H.svg) && (e2 = K + e2.substring(4)) : (e2 = K + ">" + e2 + "</svg>", t2 = true);
        var n2 = (function(e3) {
          var t3;
          return (t3 = new DOMParser()).async = false, t3.parseFromString(e3, "text/xml");
        })(e2);
        if (!t2) return n2;
        for (var i2 = document.createDocumentFragment(), r2 = n2.firstChild; r2.firstChild; ) i2.appendChild(r2.firstChild);
        return i2;
      }
      function q(e2, t2) {
        var n2;
        return "<" === (e2 = e2.trim()).charAt(0) ? (n2 = U(e2).firstChild, n2 = document.importNode(n2, true)) : n2 = document.createElementNS(H.svg, e2), t2 && W(n2, t2), n2;
      }
      var Y = null;
      function X() {
        return null === Y && (Y = q("svg")), Y;
      }
      function Z(e2, t2) {
        var n2, i2, r2 = Object.keys(t2);
        for (n2 = 0; i2 = r2[n2]; n2++) e2[i2] = t2[i2];
        return e2;
      }
      function J(e2) {
        return X().createSVGTransform();
      }
      var Q = /([&<>]{1})/g, ee = /([\n\r"]{1})/g, te = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "'" };
      function ne(e2, t2) {
        return e2.replace(t2, (function(e3, t3) {
          return te[t3] || t3;
        }));
      }
      function ie(e2, t2) {
        var n2, i2, r2, o2, a2;
        switch (e2.nodeType) {
          case 3:
            t2.push(ne(e2.textContent, Q));
            break;
          case 1:
            if (t2.push("<", e2.tagName), e2.hasAttributes()) for (n2 = 0, i2 = (r2 = e2.attributes).length; n2 < i2; ++n2) o2 = r2.item(n2), t2.push(" ", o2.name, '="', ne(o2.value, ee), '"');
            if (e2.hasChildNodes()) {
              for (t2.push(">"), n2 = 0, i2 = (a2 = e2.childNodes).length; n2 < i2; ++n2) ie(a2.item(n2), t2);
              t2.push("</", e2.tagName, ">");
            } else t2.push("/>");
            break;
          case 8:
            t2.push("<!--", ne(e2.nodeValue, Q), "-->");
            break;
          case 4:
            t2.push("<![CDATA[", e2.nodeValue, "]]>");
            break;
          default:
            throw new Error("unable to handle node " + e2.nodeType);
        }
        return t2;
      }
      function re(e2, t2) {
        return (function(e3) {
          for (var t3 = e3.firstChild, n2 = []; t3; ) ie(t3, n2), t3 = t3.nextSibling;
          return n2.join("");
        })(e2);
      }
      function oe(e2) {
        var t2 = e2.parentNode;
        return t2 && t2.removeChild(e2), e2;
      }
      function ae(e2, t2) {
        return t2 instanceof SVGMatrix ? e2.createSVGTransformFromMatrix(t2) : t2;
      }
      function se(e2, t2) {
        var n2 = e2.transform.baseVal;
        return t2 && (Array.isArray(t2) || (t2 = [t2]), (function(e3, t3) {
          var n3, i2;
          for (e3.clear(), n3 = 0; i2 = t3[n3]; n3++) e3.appendItem(ae(e3, i2));
        })(n2, t2)), n2.consolidate();
      }
      function le(e2) {
        return e2.flat().join(",").replace(/,?([A-z]),?/g, "$1");
      }
      function pe2(e2) {
        return ["L", e2.x, e2.y];
      }
      function ce(e2, t2) {
        const n2 = e2.length, i2 = [(r2 = e2[0], ["M", r2.x, r2.y])];
        var r2, o2, a2, s2;
        for (let r3 = 1; r3 < n2; r3++) {
          const n3 = e2[r3 - 1], l2 = e2[r3], p2 = e2[r3 + 1];
          if (!p2 || !t2) {
            i2.push(pe2(l2));
            continue;
          }
          const c2 = Math.min(t2, he(l2.x - n3.x, l2.y - n3.y), he(p2.x - l2.x, p2.y - l2.y));
          if (!c2) {
            i2.push(pe2(l2));
            continue;
          }
          const u2 = ue(l2, n3, c2), h2 = ue(l2, n3, 0.5 * c2), f2 = ue(l2, p2, c2), m2 = ue(l2, p2, 0.5 * c2);
          i2.push(pe2(u2)), i2.push((a2 = m2, s2 = f2, ["C", (o2 = h2).x, o2.y, a2.x, a2.y, s2.x, s2.y]));
        }
        return i2;
      }
      function ue(e2, t2, n2) {
        const i2 = t2.x - e2.x, r2 = t2.y - e2.y, o2 = n2 / he(i2, r2);
        return { x: e2.x + i2 * o2, y: e2.y + r2 * o2 };
      }
      function he(e2, t2) {
        return Math.sqrt(Math.pow(e2, 2) + Math.pow(t2, 2));
      }
      function fe(e2, t2, n2) {
        s(t2) && (n2 = t2, t2 = null), t2 || (t2 = {});
        const i2 = q("path", t2);
        return s(n2) && (i2.dataset.cornerRadius = String(n2)), me(i2, e2);
      }
      function me(e2, t2) {
        return W(e2, { d: le(ce(t2, parseInt(e2.dataset.cornerRadius, 10) || 0)) }), e2;
      }
      var de = "hsl(225, 10%, 15%)", ye = "white";
      function ge(e2, t2) {
        return y(e2.eventDefinitions, (function(e3) {
          return e3.$type === t2;
        }));
      }
      function ve(e2, t2, n2) {
        var i2 = C(e2);
        return n2 || i2.get("color:background-color") || i2.get("bioc:fill") || t2 || ye;
      }
      function xe(e2, t2, n2) {
        var i2 = C(e2);
        return n2 || i2.get("color:border-color") || i2.get("bioc:stroke") || t2 || de;
      }
      function we(e2, t2, n2, i2) {
        var r2 = C(e2).get("label");
        return i2 || r2 && r2.get("color:color") || t2 || xe(e2, n2);
      }
      function be(e2, t2 = {}) {
        return { width: Ee(e2, t2), height: _e(e2, t2) };
      }
      function Ee(e2, t2 = {}) {
        return c(t2, "width") ? t2.width : e2.width;
      }
      function _e(e2, t2 = {}) {
        return c(t2, "height") ? t2.height : e2.height;
      }
      function Ae(e2, t2) {
        return t2.forEach((function(t3) {
          t3 && "string" != typeof t3 && !Array.isArray(t3) && Object.keys(t3).forEach((function(n2) {
            if ("default" !== n2 && !(n2 in e2)) {
              var i2 = Object.getOwnPropertyDescriptor(t3, n2);
              Object.defineProperty(e2, n2, i2.get ? i2 : { enumerable: true, get: function() {
                return t3[n2];
              } });
            }
          }));
        })), Object.freeze(e2);
      }
      const Re = Object.prototype.toString, Se = Object.prototype.hasOwnProperty;
      function ke(e2, t2) {
        return Se.call(e2, t2);
      }
      function Ce(e2, t2) {
        let n2, i2;
        if (void 0 === e2) return;
        const r2 = (function(e3) {
          return "[object Array]" === Re.call(e3);
        })(e2) ? Pe : Me;
        for (let o2 in e2) if (ke(e2, o2) && (n2 = e2[o2], i2 = t2(n2, r2(o2)), false === i2)) return n2;
      }
      function Me(e2) {
        return e2;
      }
      function Pe(e2) {
        return Number(e2);
      }
      function Oe(e2, ...t2) {
        const n2 = e2.style;
        return Ce(t2, (function(e3) {
          e3 && Ce(e3, (function(e4, t3) {
            n2[t3] = e4;
          }));
        })), e2;
      }
      const Te = Object.prototype.toString;
      function Ne(e2) {
        return new De(e2);
      }
      function De(e2) {
        if (!e2 || !e2.nodeType) throw new Error("A DOM element reference is required");
        this.el = e2, this.list = e2.classList;
      }
      function Be(e2) {
        for (var t2; t2 = e2.firstChild; ) e2.removeChild(t2);
        return e2;
      }
      De.prototype.add = function(e2) {
        return this.list.add(e2), this;
      }, De.prototype.remove = function(e2) {
        return "[object RegExp]" == Te.call(e2) ? this.removeMatching(e2) : (this.list.remove(e2), this);
      }, De.prototype.removeMatching = function(e2) {
        const t2 = this.array();
        for (let n2 = 0; n2 < t2.length; n2++) e2.test(t2[n2]) && this.remove(t2[n2]);
        return this;
      }, De.prototype.toggle = function(e2, t2) {
        return void 0 !== t2 ? t2 !== this.list.toggle(e2, t2) && this.list.toggle(e2) : this.list.toggle(e2), this;
      }, De.prototype.array = function() {
        return Array.from(this.list);
      }, De.prototype.has = De.prototype.contains = function(e2) {
        return this.list.contains(e2);
      };
      var Le, Ie, je, Fe = {};
      function Ve() {
        Le = window.addEventListener ? "addEventListener" : "attachEvent", Ie = window.removeEventListener ? "removeEventListener" : "detachEvent", je = "addEventListener" !== Le ? "on" : "";
      }
      var We = Ae({ __proto__: null, bind: Fe.bind = function(e2, t2, n2, i2) {
        return Le || Ve(), e2[Le](je + t2, n2, i2 || false), n2;
      }, unbind: Fe.unbind = function(e2, t2, n2, i2) {
        return Ie || Ve(), e2[Ie](je + t2, n2, i2 || false), n2;
      }, default: Fe }, [Fe]), $e = ["focus", "blur"];
      var ze, Ge = { bind: function(e2, t2, n2, i2, r2) {
        return -1 !== $e.indexOf(n2) && (r2 = true), We.bind(e2, n2, (function(n3) {
          var r3 = n3.target || n3.srcElement;
          n3.delegateTarget = (function(e3, t3, n4) {
            var i3 = n4 ? e3 : e3.parentNode;
            return i3 && "function" == typeof i3.closest && i3.closest(t3) || null;
          })(r3, t2, true), n3.delegateTarget && i2.call(e2, n3);
        }), r2);
      }, unbind: function(e2, t2, n2, i2) {
        return -1 !== $e.indexOf(t2) && (i2 = true), We.unbind(e2, t2, n2, i2);
      } }, He = function(e2, t2) {
        if ("string" != typeof e2) throw new TypeError("String expected");
        t2 || (t2 = document);
        var n2 = /<([\w:]+)/.exec(e2);
        if (!n2) return t2.createTextNode(e2);
        e2 = e2.replace(/^\s+|\s+$/g, "");
        var i2 = n2[1];
        if ("body" == i2) {
          return (r2 = t2.createElement("html")).innerHTML = e2, r2.removeChild(r2.lastChild);
        }
        var r2, o2 = Object.prototype.hasOwnProperty.call(Ue, i2) ? Ue[i2] : Ue._default, a2 = o2[0], s2 = o2[1], l2 = o2[2];
        (r2 = t2.createElement("div")).innerHTML = s2 + e2 + l2;
        for (; a2--; ) r2 = r2.lastChild;
        if (r2.firstChild == r2.lastChild) return r2.removeChild(r2.firstChild);
        var p2 = t2.createDocumentFragment();
        for (; r2.firstChild; ) p2.appendChild(r2.removeChild(r2.firstChild));
        return p2;
      }, Ke = false;
      "undefined" != typeof document && ((ze = document.createElement("div")).innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>', Ke = !ze.getElementsByTagName("link").length, ze = void 0);
      var Ue = { legend: [1, "<fieldset>", "</fieldset>"], tr: [2, "<table><tbody>", "</tbody></table>"], col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], _default: Ke ? [1, "X<div>", "</div>"] : [0, "", ""] };
      Ue.td = Ue.th = [3, "<table><tbody><tr>", "</tr></tbody></table>"], Ue.option = Ue.optgroup = [1, '<select multiple="multiple">', "</select>"], Ue.thead = Ue.tbody = Ue.colgroup = Ue.caption = Ue.tfoot = [1, "<table>", "</table>"], Ue.polyline = Ue.ellipse = Ue.polygon = Ue.circle = Ue.text = Ue.line = Ue.path = Ue.rect = Ue.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', "</svg>"];
      var qe = He;
      function Ye(e2, t2) {
        return (t2 = t2 || document).querySelector(e2);
      }
      function Xe(e2) {
        e2.parentNode && e2.parentNode.removeChild(e2);
      }
      function Ze(e2, t2, n2, i2, r2) {
        var o2 = J();
        o2.setTranslate(t2, n2);
        var a2 = J();
        a2.setRotate(i2 || 0, 0, 0);
        var s2 = J();
        s2.setScale(1, 1), se(e2, [o2, a2, s2]);
      }
      function Je(e2, t2, n2) {
        var i2 = J();
        i2.setTranslate(t2, n2), se(e2, i2);
      }
      var Qe = (function(e2, t2) {
        return e2(t2 = { exports: {} }, t2.exports), t2.exports;
      })((function(e2) {
        var t2 = e2.exports = function(e3, n2) {
          if (n2 || (n2 = 16), void 0 === e3 && (e3 = 128), e3 <= 0) return "0";
          for (var i2 = Math.log(Math.pow(2, e3)) / Math.log(n2), r2 = 2; i2 === 1 / 0; r2 *= 2) i2 = Math.log(Math.pow(2, e3 / r2)) / Math.log(n2) * r2;
          var o2 = i2 - Math.floor(i2), a2 = "";
          for (r2 = 0; r2 < Math.floor(i2); r2++) {
            a2 = Math.floor(Math.random() * n2).toString(n2) + a2;
          }
          if (o2) {
            var s2 = Math.pow(n2, o2);
            a2 = Math.floor(Math.random() * s2).toString(n2) + a2;
          }
          var l2 = parseInt(a2, n2);
          return l2 !== 1 / 0 && l2 >= Math.pow(2, e3) ? t2(e3, n2) : a2;
        };
        t2.rack = function(e3, n2, i2) {
          var r2 = function(r3) {
            var a2 = 0;
            do {
              if (a2++ > 10) {
                if (!i2) throw new Error("too many ID collisions, use more bits");
                e3 += i2;
              }
              var s2 = t2(e3, n2);
            } while (Object.hasOwnProperty.call(o2, s2));
            return o2[s2] = r3, s2;
          }, o2 = r2.hats = {};
          return r2.get = function(e4) {
            return r2.hats[e4];
          }, r2.set = function(e4, t3) {
            return r2.hats[e4] = t3, r2;
          }, r2.bits = e3 || 128, r2.base = n2 || 16, r2;
        };
      }));
      function et(e2) {
        if (!(this instanceof et)) return new et(e2);
        e2 = e2 || [128, 36, 1], this._seed = e2.length ? Qe.rack(e2[0], e2[1], e2[2]) : e2;
      }
      et.prototype.next = function(e2) {
        return this._seed(e2 || true);
      }, et.prototype.nextPrefixed = function(e2, t2) {
        var n2;
        do {
          n2 = e2 + this.next(true);
        } while (this.assigned(n2));
        return this.claim(n2, t2), n2;
      }, et.prototype.claim = function(e2, t2) {
        this._seed.set(e2, t2 || true);
      }, et.prototype.assigned = function(e2) {
        return this._seed.get(e2) || false;
      }, et.prototype.unclaim = function(e2) {
        delete this._seed.hats[e2];
      }, et.prototype.clear = function() {
        var e2, t2 = this._seed.hats;
        for (e2 in t2) this.unclaim(e2);
      };
      var tt = new et(), nt = 0.95;
      function it(e2, t2, n2, i2, r2, o2, s2) {
        A.call(this, t2, s2);
        var l2 = e2 && e2.defaultFillColor, p2 = e2 && e2.defaultStrokeColor, c2 = e2 && e2.defaultLabelColor;
        function u2(e3) {
          return n2.computeStyle(e3, { strokeLinecap: "round", strokeLinejoin: "round", stroke: de, strokeWidth: 2, fill: "white" });
        }
        function h2(e3) {
          return n2.computeStyle(e3, ["no-fill"], { strokeLinecap: "round", strokeLinejoin: "round", stroke: de, strokeWidth: 2 });
        }
        function m2(e3, t3) {
          var { ref: n3 = { x: 0, y: 0 }, scale: i3 = 1, element: o3, parentGfx: a2 = r2._svg } = t3, s3 = q("marker", { id: e3, viewBox: "0 0 20 20", refX: n3.x, refY: n3.y, markerWidth: 20 * i3, markerHeight: 20 * i3, orient: "auto" });
          I(s3, o3);
          var l3 = Ye(":scope > defs", a2);
          l3 || I(a2, l3 = q("defs")), I(l3, s3);
        }
        function d2(e3, t3, n3, i3) {
          var r3 = tt.nextPrefixed("marker-");
          return (function(e4, t4, n4, i4, r4) {
            if ("sequenceflow-end" === n4) {
              m2(t4, { element: q("path", { d: "M 1 5 L 11 10 L 1 15 Z", ...u2({ fill: r4, stroke: r4, strokeWidth: 1 }) }), ref: { x: 11, y: 10 }, scale: 0.5, parentGfx: e4 });
            }
            if ("messageflow-start" === n4) {
              m2(t4, { element: q("circle", { cx: 6, cy: 6, r: 3.5, ...u2({ fill: i4, stroke: r4, strokeWidth: 1, strokeDasharray: [1e4, 1] }) }), ref: { x: 6, y: 6 }, parentGfx: e4 });
            }
            if ("messageflow-end" === n4) {
              m2(t4, { element: q("path", { d: "m 1 5 l 0 -3 l 7 3 l -7 3 z", ...u2({ fill: i4, stroke: r4, strokeWidth: 1, strokeDasharray: [1e4, 1] }) }), ref: { x: 8.5, y: 5 }, parentGfx: e4 });
            }
            if ("association-start" === n4) {
              m2(t4, { element: q("path", { d: "M 11 5 L 1 10 L 11 15", ...h2({ fill: "none", stroke: r4, strokeWidth: 1.5, strokeDasharray: [1e4, 1] }) }), ref: { x: 1, y: 10 }, scale: 0.5, parentGfx: e4 });
            }
            if ("association-end" === n4) {
              m2(t4, { element: q("path", { d: "M 1 5 L 11 10 L 1 15", ...h2({ fill: "none", stroke: r4, strokeWidth: 1.5, strokeDasharray: [1e4, 1] }) }), ref: { x: 11, y: 10 }, scale: 0.5, parentGfx: e4 });
            }
            if ("conditional-flow-marker" === n4) {
              m2(t4, { element: q("path", { d: "M 0 10 L 8 6 L 16 10 L 8 14 Z", ...u2({ fill: i4, stroke: r4 }) }), ref: { x: -1, y: 10 }, scale: 0.5, parentGfx: e4 });
            }
            if ("conditional-default-flow-marker" === n4) {
              m2(t4, { element: q("path", { d: "M 6 4 L 10 16", ...u2({ stroke: r4, fill: "none" }) }), ref: { x: 0, y: 10 }, scale: 0.5, parentGfx: e4 });
            }
          })(e3, r3, t3, n3, i3), "url(#" + r3 + ")";
        }
        function y2(e3, t3, n3, i3, r3 = {}) {
          a(i3) && (r3 = i3, i3 = 0), i3 = i3 || 0, r3 = u2(r3);
          var o3 = q("circle", { cx: t3 / 2, cy: n3 / 2, r: Math.round((t3 + n3) / 4 - i3), ...r3 });
          return I(e3, o3), o3;
        }
        function g2(e3, t3, n3, i3, r3, o3) {
          a(r3) && (o3 = r3, r3 = 0), r3 = r3 || 0, o3 = u2(o3);
          var s3 = q("rect", { x: r3, y: r3, width: t3 - 2 * r3, height: n3 - 2 * r3, rx: i3, ry: i3, ...o3 });
          return I(e3, s3), s3;
        }
        function v2(e3, t3, n3, i3) {
          var r3 = fe(t3, n3 = h2(n3), i3);
          return I(e3, r3), r3;
        }
        function x2(e3, t3, n3) {
          return v2(e3, t3, n3, 5);
        }
        function w2(e3, t3, n3) {
          n3 = h2(n3);
          var i3 = q("path", { ...n3, d: t3 });
          return I(e3, i3), i3;
        }
        function b2(e3, t3, n3, i3) {
          return w2(t3, n3, E({ "data-marker": e3 }, i3));
        }
        function _2(e3) {
          return ue2[e3];
        }
        function S2(e3) {
          return function(t3, n3, i3) {
            return _2(e3)(t3, n3, i3);
          };
        }
        var O2 = function(e3, t3, n3 = {}, r3) {
          return w2(e3, i2.getScaledPath("EVENT_MESSAGE", { xScaleFactor: 0.9, yScaleFactor: 0.9, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.235, my: 0.315 } }), { fill: r3 ? xe(t3, p2, n3.stroke) : ve(t3, l2, n3.fill), stroke: r3 ? ve(t3, l2, n3.fill) : xe(t3, p2, n3.stroke), strokeWidth: 1 });
        }, T2 = function(e3, t3, n3 = {}) {
          var r3 = y2(e3, t3.width, t3.height, 0.2 * t3.height, { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 2 });
          w2(e3, i2.getScaledPath("EVENT_TIMER_WH", { xScaleFactor: 0.75, yScaleFactor: 0.75, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.5, my: 0.5 } }), { stroke: xe(t3, p2, n3.stroke), strokeWidth: 2 });
          for (var o3 = 0; o3 < 12; o3++) {
            var a2 = i2.getScaledPath("EVENT_TIMER_LINE", { xScaleFactor: 0.75, yScaleFactor: 0.75, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.5, my: 0.5 } }), s3 = t3.width / 2, c3 = t3.height / 2;
            w2(e3, a2, { strokeWidth: 1, stroke: xe(t3, p2, n3.stroke), transform: "rotate(" + 30 * o3 + "," + c3 + "," + s3 + ")" });
          }
          return r3;
        }, N2 = function(e3, t3, n3 = {}, r3) {
          return w2(e3, i2.getScaledPath("EVENT_ESCALATION", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.5, my: 0.2 } }), { fill: r3 ? xe(t3, p2, n3.stroke) : ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 });
        }, D2 = function(e3, t3, n3 = {}) {
          return w2(e3, i2.getScaledPath("EVENT_CONDITIONAL", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.5, my: 0.222 } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 });
        }, B2 = function(e3, t3, n3 = {}, r3) {
          return w2(e3, i2.getScaledPath("EVENT_LINK", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.57, my: 0.263 } }), { fill: r3 ? xe(t3, p2, n3.stroke) : ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 });
        }, j2 = function(e3, t3, n3 = {}, r3) {
          return w2(e3, i2.getScaledPath("EVENT_ERROR", { xScaleFactor: 1.1, yScaleFactor: 1.1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.2, my: 0.722 } }), { fill: r3 ? xe(t3, p2, n3.stroke) : ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 });
        }, F2 = function(e3, t3, n3 = {}, r3) {
          var o3 = w2(e3, i2.getScaledPath("EVENT_CANCEL_45", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.638, my: -0.055 } }), { fill: r3 ? xe(t3, p2, n3.stroke) : "none", stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 });
          return (function(e4, t4) {
            var n4 = J();
            n4.setRotate(t4, 0, 0), se(e4, n4);
          })(o3, 45), o3;
        }, V2 = function(e3, t3, n3 = {}, r3) {
          return w2(e3, i2.getScaledPath("EVENT_COMPENSATION", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.22, my: 0.5 } }), { fill: r3 ? xe(t3, p2, n3.stroke) : ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 });
        }, $2 = function(e3, t3, n3 = {}, r3) {
          return w2(e3, i2.getScaledPath("EVENT_SIGNAL", { xScaleFactor: 0.9, yScaleFactor: 0.9, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.5, my: 0.2 } }), { strokeWidth: 1, fill: r3 ? xe(t3, p2, n3.stroke) : ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke) });
        }, G2 = function(e3, t3, n3 = {}, r3) {
          return w2(e3, i2.getScaledPath("EVENT_MULTIPLE", { xScaleFactor: 1.1, yScaleFactor: 1.1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.222, my: 0.36 } }), { fill: r3 ? xe(t3, p2, n3.stroke) : ve(t3, l2, n3.fill), strokeWidth: 1 });
        }, H2 = function(e3, t3, n3 = {}) {
          return w2(e3, i2.getScaledPath("EVENT_PARALLEL_MULTIPLE", { xScaleFactor: 1.2, yScaleFactor: 1.2, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.458, my: 0.194 } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 });
        }, K2 = function(e3, t3, n3 = {}) {
          return y2(e3, t3.width, t3.height, 8, { fill: xe(t3, p2, n3.stroke), stroke: xe(t3, p2, n3.stroke), strokeWidth: 4 });
        };
        function U2(e3, t3, n3 = {}) {
          var i3 = k(e3), r3 = (function(e4) {
            return "bpmn:IntermediateThrowEvent" === e4.$type || "bpmn:EndEvent" === e4.$type;
          })(i3);
          return i3.get("eventDefinitions") && i3.get("eventDefinitions").length > 1 ? i3.get("parallelMultiple") ? H2(t3, e3, n3, r3) : G2(t3, e3, n3, r3) : ge(i3, "bpmn:MessageEventDefinition") ? O2(t3, e3, n3, r3) : ge(i3, "bpmn:TimerEventDefinition") ? T2(t3, e3, n3, r3) : ge(i3, "bpmn:ConditionalEventDefinition") ? D2(t3, e3, n3, r3) : ge(i3, "bpmn:SignalEventDefinition") ? $2(t3, e3, n3, r3) : ge(i3, "bpmn:EscalationEventDefinition") ? N2(t3, e3, n3, r3) : ge(i3, "bpmn:LinkEventDefinition") ? B2(t3, e3, n3, r3) : ge(i3, "bpmn:ErrorEventDefinition") ? j2(t3, e3, n3, r3) : ge(i3, "bpmn:CancelEventDefinition") ? F2(t3, e3, n3, r3) : ge(i3, "bpmn:CompensateEventDefinition") ? V2(t3, e3, n3, r3) : ge(i3, "bpmn:TerminateEventDefinition") ? K2(t3, e3, n3, r3) : null;
        }
        var Y2 = { ParticipantMultiplicityMarker: function(e3, t3, n3 = {}) {
          var r3 = Ee(t3, n3), o3 = _e(t3, n3);
          b2("participant-multiplicity", e3, i2.getScaledPath("MARKER_PARALLEL", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: r3, containerHeight: o3, position: { mx: (r3 / 2 - 6) / r3, my: (o3 - 15) / o3 } }), { strokeWidth: 2, fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke) });
        }, SubProcessMarker: function(e3, t3, n3 = {}) {
          Je(g2(e3, 14, 14, 0, { strokeWidth: 1, fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke) }), t3.width / 2 - 7.5, t3.height - 20), b2("sub-process", e3, i2.getScaledPath("MARKER_SUB_PROCESS", { xScaleFactor: 1.5, yScaleFactor: 1.5, containerWidth: t3.width, containerHeight: t3.height, position: { mx: (t3.width / 2 - 7.5) / t3.width, my: (t3.height - 20) / t3.height } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke) });
        }, ParallelMarker: function(e3, t3, n3) {
          var r3 = Ee(t3, n3), o3 = _e(t3, n3);
          b2("parallel", e3, i2.getScaledPath("MARKER_PARALLEL", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: r3, containerHeight: o3, position: { mx: (r3 / 2 + n3.parallel) / r3, my: (o3 - 20) / o3 } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke) });
        }, SequentialMarker: function(e3, t3, n3) {
          b2("sequential", e3, i2.getScaledPath("MARKER_SEQUENTIAL", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: (t3.width / 2 + n3.seq) / t3.width, my: (t3.height - 19) / t3.height } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke) });
        }, CompensationMarker: function(e3, t3, n3) {
          b2("compensation", e3, i2.getScaledPath("MARKER_COMPENSATION", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: (t3.width / 2 + n3.compensation) / t3.width, my: (t3.height - 13) / t3.height } }), { strokeWidth: 1, fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke) });
        }, LoopMarker: function(e3, t3, n3) {
          var r3 = Ee(t3, n3), o3 = _e(t3, n3);
          b2("loop", e3, i2.getScaledPath("MARKER_LOOP", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: r3, containerHeight: o3, position: { mx: (r3 / 2 + n3.loop) / r3, my: (o3 - 7) / o3 } }), { strokeWidth: 1.5, fill: "none", stroke: xe(t3, p2, n3.stroke), strokeMiterlimit: 0.5 });
        }, AdhocMarker: function(e3, t3, n3) {
          var r3 = Ee(t3, n3), o3 = _e(t3, n3);
          b2("adhoc", e3, i2.getScaledPath("MARKER_ADHOC", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: r3, containerHeight: o3, position: { mx: (r3 / 2 + n3.adhoc) / r3, my: (o3 - 15) / o3 } }), { strokeWidth: 1, fill: xe(t3, p2, n3.stroke), stroke: xe(t3, p2, n3.stroke) });
        } };
        function X2(e3, t3, n3, i3) {
          Y2[e3](t3, n3, i3);
        }
        function Z2(e3, t3, n3, i3 = {}) {
          i3 = { fill: i3.fill, stroke: i3.stroke, width: Ee(t3, i3), height: _e(t3, i3) };
          var r3 = k(t3), o3 = n3 && n3.includes("SubProcessMarker");
          i3 = o3 ? { ...i3, seq: -21, parallel: -22, compensation: -42, loop: -18, adhoc: 10 } : { ...i3, seq: -5, parallel: -6, compensation: -27, loop: 0, adhoc: 10 }, f(n3, (function(n4) {
            X2(n4, e3, t3, i3);
          })), r3.get("isForCompensation") && X2("CompensationMarker", e3, t3, i3), R(r3, "bpmn:AdHocSubProcess") && X2("AdhocMarker", e3, t3, i3);
          var a2 = r3.get("loopCharacteristics"), s3 = a2 && a2.get("isSequential");
          a2 && (void 0 === s3 && X2("LoopMarker", e3, t3, i3), false === s3 && X2("ParallelMarker", e3, t3, i3), true === s3 && X2("SequentialMarker", e3, t3, i3));
        }
        function Q2(e3, t3, n3 = {}) {
          n3 = E({ size: { width: 100 } }, n3);
          var i3 = o2.createText(t3 || "", n3);
          return z(i3).add("djs-label"), I(e3, i3), i3;
        }
        function ee2(e3, t3, n3, i3 = {}) {
          var r3 = k(t3), o3 = be({ x: t3.x, y: t3.y, width: t3.width, height: t3.height }, i3);
          return Q2(e3, r3.name, { align: n3, box: o3, padding: 7, style: { fill: we(t3, c2, p2, i3.stroke) } });
        }
        function te2(e3, t3, n3, i3 = {}) {
          var r3 = P(n3), o3 = Q2(e3, t3, { box: { height: 30, width: r3 ? _e(n3, i3) : Ee(n3, i3) }, align: "center-middle", style: { fill: we(n3, c2, p2, i3.stroke) } });
          r3 && Ze(o3, 0, -(-1 * _e(n3, i3)), 270);
        }
        function ne2(e3, t3, n3 = {}) {
          var { width: i3, height: r3 } = be(t3, n3);
          return g2(e3, i3, r3, 10, { ...n3, fill: ve(t3, l2, n3.fill), fillOpacity: nt, stroke: xe(t3, p2, n3.stroke) });
        }
        function ie2(e3, t3, n3 = {}) {
          var i3 = k(t3), r3 = ve(t3, l2, n3.fill), o3 = xe(t3, p2, n3.stroke);
          return "One" !== i3.get("associationDirection") && "Both" !== i3.get("associationDirection") || (n3.markerEnd = d2(e3, "association-end", r3, o3)), "Both" === i3.get("associationDirection") && (n3.markerStart = d2(e3, "association-start", r3, o3)), n3 = rt(n3, ["markerStart", "markerEnd"]), x2(e3, t3.waypoints, { ...n3, stroke: o3, strokeDasharray: "0, 5" });
        }
        function re2(e3, t3, n3 = {}) {
          var r3 = ve(t3, l2, n3.fill), o3 = xe(t3, p2, n3.stroke), a2 = w2(e3, i2.getScaledPath("DATA_OBJECT_PATH", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.474, my: 0.296 } }), { fill: r3, fillOpacity: nt, stroke: o3 });
          (function(e4) {
            var t4 = e4.dataObjectRef;
            return e4.isCollection || t4 && t4.isCollection;
          })(k(t3)) && w2(e3, i2.getScaledPath("DATA_OBJECT_COLLECTION_PATH", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.33, my: (t3.height - 18) / t3.height } }), { strokeWidth: 2, fill: r3, stroke: o3 });
          return a2;
        }
        function oe2(e3, t3, n3 = {}) {
          return y2(e3, t3.width, t3.height, { fillOpacity: nt, ...n3, fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke) });
        }
        function ae2(e3, t3, n3 = {}) {
          return (function(e4, t4, n4, i3) {
            var r3 = t4 / 2, o3 = n4 / 2, a2 = [{ x: r3, y: 0 }, { x: t4, y: o3 }, { x: r3, y: n4 }, { x: 0, y: o3 }].map((function(e5) {
              return e5.x + "," + e5.y;
            })).join(" ");
            i3 = u2(i3);
            var s3 = q("polygon", { ...i3, points: a2 });
            return I(e4, s3), s3;
          })(e3, t3.width, t3.height, { fill: ve(t3, l2, n3.fill), fillOpacity: nt, stroke: xe(t3, p2, n3.stroke) });
        }
        function le2(e3, t3, n3 = {}) {
          var i3 = g2(e3, Ee(t3, n3), _e(t3, n3), 0, { fill: ve(t3, l2, n3.fill), fillOpacity: n3.fillOpacity || nt, stroke: xe(t3, p2, n3.stroke), strokeWidth: 1.5 }), r3 = k(t3);
          R(r3, "bpmn:Lane") && te2(e3, r3.get("name"), t3, n3);
          return i3;
        }
        function pe3(e3, t3, n3 = {}) {
          var i3 = ne2(e3, t3, n3);
          (function(e4) {
            return e4 && !!k(e4).triggeredByEvent;
          })(t3) && W(i3, { strokeDasharray: "0, 5.5", strokeWidth: 2.5 });
          var r3 = M(t3);
          return ee2(e3, t3, r3 ? "center-top" : "center-middle", n3), Z2(e3, t3, r3 ? void 0 : ["SubProcessMarker"], n3), i3;
        }
        function ce2(e3, t3, n3 = {}) {
          var i3 = ne2(e3, t3, n3);
          return ee2(e3, t3, "center-middle", n3), Z2(e3, t3, void 0, n3), i3;
        }
        var ue2 = this.handlers = { "bpmn:AdHocSubProcess": function(e3, t3, n3 = {}) {
          return pe3(e3, t3, n3 = M(t3) ? rt(n3, ["fill", "stroke", "width", "height"]) : rt(n3, ["fill", "stroke"]));
        }, "bpmn:Association": function(e3, t3, n3 = {}) {
          return ie2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
        }, "bpmn:BoundaryEvent": function(e3, t3, n3 = {}) {
          var { renderIcon: i3 = true } = n3;
          n3 = rt(n3, ["fill", "stroke"]);
          var r3 = k(t3).get("cancelActivity");
          n3 = { strokeWidth: 1.5, fill: ve(t3, l2, n3.fill), fillOpacity: 1, stroke: xe(t3, p2, n3.stroke) }, r3 || (n3.strokeDasharray = "6");
          var o3 = oe2(e3, t3, n3);
          return y2(e3, t3.width, t3.height, 3, { ...n3, fill: "none" }), i3 && U2(t3, e3, n3), o3;
        }, "bpmn:BusinessRuleTask": function(e3, t3, n3 = {}) {
          var r3 = ce2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
          return W(w2(e3, i2.getScaledPath("TASK_TYPE_BUSINESS_RULE_MAIN", { abspos: { x: 8, y: 8 } })), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), W(w2(e3, i2.getScaledPath("TASK_TYPE_BUSINESS_RULE_HEADER", { abspos: { x: 8, y: 8 } })), { fill: xe(t3, p2, n3.stroke), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), r3;
        }, "bpmn:CallActivity": function(e3, t3, n3 = {}) {
          return n3 = rt(n3, ["fill", "stroke"]), pe3(e3, t3, { strokeWidth: 5, ...n3 });
        }, "bpmn:ComplexGateway": function(e3, t3, n3 = {}) {
          var r3 = ae2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
          return w2(e3, i2.getScaledPath("GATEWAY_COMPLEX", { xScaleFactor: 0.5, yScaleFactor: 0.5, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.46, my: 0.26 } }), { fill: xe(t3, p2, n3.stroke), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), r3;
        }, "bpmn:DataInput": function(e3, t3, n3 = {}) {
          n3 = rt(n3, ["fill", "stroke"]);
          var r3 = i2.getRawPath("DATA_ARROW"), o3 = re2(e3, t3, n3);
          return w2(e3, r3, { fill: "none", stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), o3;
        }, "bpmn:DataInputAssociation": function(e3, t3, n3 = {}) {
          return n3 = rt(n3, ["fill", "stroke"]), ie2(e3, t3, { ...n3, markerEnd: d2(e3, "association-end", ve(t3, l2, n3.fill), xe(t3, p2, n3.stroke)) });
        }, "bpmn:DataObject": function(e3, t3, n3 = {}) {
          return re2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
        }, "bpmn:DataObjectReference": S2("bpmn:DataObject"), "bpmn:DataOutput": function(e3, t3, n3 = {}) {
          n3 = rt(n3, ["fill", "stroke"]);
          var r3 = i2.getRawPath("DATA_ARROW"), o3 = re2(e3, t3, n3);
          return w2(e3, r3, { strokeWidth: 1, fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke) }), o3;
        }, "bpmn:DataOutputAssociation": function(e3, t3, n3 = {}) {
          return n3 = rt(n3, ["fill", "stroke"]), ie2(e3, t3, { ...n3, markerEnd: d2(e3, "association-end", ve(t3, l2, n3.fill), xe(t3, p2, n3.stroke)) });
        }, "bpmn:DataStoreReference": function(e3, t3, n3 = {}) {
          return n3 = rt(n3, ["fill", "stroke"]), w2(e3, i2.getScaledPath("DATA_STORE", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0, my: 0.133 } }), { fill: ve(t3, l2, n3.fill), fillOpacity: nt, stroke: xe(t3, p2, n3.stroke), strokeWidth: 2 });
        }, "bpmn:EndEvent": function(e3, t3, n3 = {}) {
          var { renderIcon: i3 = true } = n3;
          n3 = rt(n3, ["fill", "stroke"]);
          var r3 = oe2(e3, t3, { ...n3, strokeWidth: 4 });
          return i3 && U2(t3, e3, n3), r3;
        }, "bpmn:EventBasedGateway": function(e3, t3, n3 = {}) {
          n3 = rt(n3, ["fill", "stroke"]);
          var r3 = k(t3), o3 = ae2(e3, t3, n3);
          y2(e3, t3.width, t3.height, 0.2 * t3.height, { fill: ve(t3, "none", n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 });
          var a2 = r3.get("eventGatewayType"), s3 = !!r3.get("instantiate");
          if ("Parallel" === a2) {
            var l3 = i2.getScaledPath("GATEWAY_PARALLEL", { xScaleFactor: 0.4, yScaleFactor: 0.4, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.474, my: 0.296 } });
            w2(e3, l3, { fill: "none", stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 });
          } else "Exclusive" === a2 && (s3 || y2(e3, t3.width, t3.height, 0.26 * t3.height, { fill: "none", stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), (function() {
            var r4 = i2.getScaledPath("GATEWAY_EVENT_BASED", { xScaleFactor: 0.18, yScaleFactor: 0.18, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.36, my: 0.44 } });
            w2(e3, r4, { fill: "none", stroke: xe(t3, p2, n3.stroke), strokeWidth: 2 });
          })());
          return o3;
        }, "bpmn:ExclusiveGateway": function(e3, t3, n3 = {}) {
          var r3 = ae2(e3, t3, n3 = rt(n3, ["fill", "stroke"])), o3 = i2.getScaledPath("GATEWAY_EXCLUSIVE", { xScaleFactor: 0.4, yScaleFactor: 0.4, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.32, my: 0.3 } });
          return C(t3).get("isMarkerVisible") && w2(e3, o3, { fill: xe(t3, p2, n3.stroke), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), r3;
        }, "bpmn:Gateway": function(e3, t3, n3 = {}) {
          return ae2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
        }, "bpmn:Group": function(e3, t3, n3 = {}) {
          return n3 = rt(n3, ["fill", "stroke", "width", "height"]), g2(e3, t3.width, t3.height, 10, { stroke: xe(t3, p2, n3.stroke), strokeWidth: 1.5, strokeDasharray: "10, 6, 0, 6", fill: "none", pointerEvents: "none", width: Ee(t3, n3), height: _e(t3, n3) });
        }, "bpmn:InclusiveGateway": function(e3, t3, n3 = {}) {
          var i3 = ae2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
          return y2(e3, t3.width, t3.height, 0.24 * t3.height, { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 2.5 }), i3;
        }, "bpmn:IntermediateEvent": function(e3, t3, n3 = {}) {
          var { renderIcon: i3 = true } = n3;
          n3 = rt(n3, ["fill", "stroke"]);
          var r3 = oe2(e3, t3, { ...n3, strokeWidth: 1.5 });
          return y2(e3, t3.width, t3.height, 3, { fill: "none", stroke: xe(t3, p2, n3.stroke), strokeWidth: 1.5 }), i3 && U2(t3, e3, n3), r3;
        }, "bpmn:IntermediateCatchEvent": S2("bpmn:IntermediateEvent"), "bpmn:IntermediateThrowEvent": S2("bpmn:IntermediateEvent"), "bpmn:Lane": function(e3, t3, n3 = {}) {
          return n3 = rt(n3, ["fill", "stroke", "width", "height"]), le2(e3, t3, { ...n3, fillOpacity: 0.25 });
        }, "bpmn:ManualTask": function(e3, t3, n3 = {}) {
          var r3 = ce2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
          return w2(e3, i2.getScaledPath("TASK_TYPE_MANUAL", { abspos: { x: 17, y: 15 } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 0.5 }), r3;
        }, "bpmn:MessageFlow": function(e3, t3, n3 = {}) {
          n3 = rt(n3, ["fill", "stroke"]);
          var r3 = k(t3), o3 = C(t3), a2 = ve(t3, l2, n3.fill), s3 = xe(t3, p2, n3.stroke), c3 = x2(e3, t3.waypoints, { markerEnd: d2(e3, "messageflow-end", a2, s3), markerStart: d2(e3, "messageflow-start", a2, s3), stroke: s3, strokeDasharray: "10, 11", strokeWidth: 1.5 });
          if (r3.get("messageRef")) {
            var u3 = c3.getPointAtLength(c3.getTotalLength() / 2), h3 = i2.getScaledPath("MESSAGE_FLOW_MARKER", { abspos: { x: u3.x, y: u3.y } }), f2 = { strokeWidth: 1 };
            "initiating" === o3.get("messageVisibleKind") ? (f2.fill = a2, f2.stroke = s3) : (f2.fill = s3, f2.stroke = a2);
            var m3 = w2(e3, h3, f2), y3 = Q2(e3, r3.get("messageRef").get("name"), { align: "center-top", fitBox: true, style: { fill: s3 } }), g3 = m3.getBBox(), v3 = y3.getBBox();
            Ze(y3, u3.x - v3.width / 2, u3.y + g3.height / 2 + 10, 0);
          }
          return c3;
        }, "bpmn:ParallelGateway": function(e3, t3, n3 = {}) {
          var r3 = ae2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
          return w2(e3, i2.getScaledPath("GATEWAY_PARALLEL", { xScaleFactor: 0.6, yScaleFactor: 0.6, containerWidth: t3.width, containerHeight: t3.height, position: { mx: 0.46, my: 0.2 } }), { fill: xe(t3, p2, n3.stroke), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), r3;
        }, "bpmn:Participant": function(e3, t3, n3 = {}) {
          var i3 = le2(e3, t3, n3 = rt(n3, ["fill", "stroke", "width", "height"])), r3 = M(t3), o3 = P(t3), a2 = k(t3), s3 = a2.get("name");
          if (r3) {
            v2(e3, o3 ? [{ x: 30, y: 0 }, { x: 30, y: _e(t3, n3) }] : [{ x: 0, y: 30 }, { x: Ee(t3, n3), y: 30 }], { stroke: xe(t3, p2, n3.stroke), strokeWidth: 1.5 }), te2(e3, s3, t3, n3);
          } else {
            var l3 = be(t3, n3);
            o3 || (l3.height = Ee(t3, n3), l3.width = _e(t3, n3));
            var u3 = Q2(e3, s3, { box: l3, align: "center-middle", style: { fill: we(t3, c2, p2, n3.stroke) } });
            if (!o3) Ze(u3, 0, -(-1 * _e(t3, n3)), 270);
          }
          return a2.get("participantMultiplicity") && X2("ParticipantMultiplicityMarker", e3, t3, n3), i3;
        }, "bpmn:ReceiveTask": function(e3, t3, n3 = {}) {
          n3 = rt(n3, ["fill", "stroke"]);
          var r3, o3 = k(t3), a2 = ce2(e3, t3, n3);
          return o3.get("instantiate") ? (y2(e3, 28, 28, 4.4, { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), r3 = i2.getScaledPath("TASK_TYPE_INSTANTIATING_SEND", { abspos: { x: 7.77, y: 9.52 } })) : r3 = i2.getScaledPath("TASK_TYPE_SEND", { xScaleFactor: 0.9, yScaleFactor: 0.9, containerWidth: 21, containerHeight: 14, position: { mx: 0.3, my: 0.4 } }), w2(e3, r3, { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), a2;
        }, "bpmn:ScriptTask": function(e3, t3, n3 = {}) {
          var r3 = ce2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
          return w2(e3, i2.getScaledPath("TASK_TYPE_SCRIPT", { abspos: { x: 15, y: 20 } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), r3;
        }, "bpmn:SendTask": function(e3, t3, n3 = {}) {
          var r3 = ce2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
          return w2(e3, i2.getScaledPath("TASK_TYPE_SEND", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: 21, containerHeight: 14, position: { mx: 0.285, my: 0.357 } }), { fill: xe(t3, p2, n3.stroke), stroke: ve(t3, l2, n3.fill), strokeWidth: 1 }), r3;
        }, "bpmn:SequenceFlow": function(e3, t3, n3 = {}) {
          n3 = rt(n3, ["fill", "stroke"]);
          var i3 = ve(t3, l2, n3.fill), r3 = xe(t3, p2, n3.stroke), o3 = x2(e3, t3.waypoints, { markerEnd: d2(e3, "sequenceflow-end", i3, r3), stroke: r3 }), a2 = k(t3), { source: s3 } = t3;
          if (s3) {
            var c3 = k(s3);
            a2.get("conditionExpression") && R(c3, "bpmn:Activity") && W(o3, { markerStart: d2(e3, "conditional-flow-marker", i3, r3) }), c3.get("default") && (R(c3, "bpmn:Gateway") || R(c3, "bpmn:Activity")) && c3.get("default") === a2 && W(o3, { markerStart: d2(e3, "conditional-default-flow-marker", i3, r3) });
          }
          return o3;
        }, "bpmn:ServiceTask": function(e3, t3, n3 = {}) {
          var r3 = ce2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
          return y2(e3, 10, 10, { fill: ve(t3, l2, n3.fill), stroke: "none", transform: "translate(6, 6)" }), w2(e3, i2.getScaledPath("TASK_TYPE_SERVICE", { abspos: { x: 12, y: 18 } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), y2(e3, 10, 10, { fill: ve(t3, l2, n3.fill), stroke: "none", transform: "translate(11, 10)" }), w2(e3, i2.getScaledPath("TASK_TYPE_SERVICE", { abspos: { x: 17, y: 22 } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 1 }), r3;
        }, "bpmn:StartEvent": function(e3, t3, n3 = {}) {
          var { renderIcon: i3 = true } = n3;
          n3 = rt(n3, ["fill", "stroke"]), k(t3).get("isInterrupting") || (n3 = { ...n3, strokeDasharray: "6" });
          var r3 = oe2(e3, t3, n3);
          return i3 && U2(t3, e3, n3), r3;
        }, "bpmn:SubProcess": function(e3, t3, n3 = {}) {
          return pe3(e3, t3, n3 = M(t3) ? rt(n3, ["fill", "stroke", "width", "height"]) : rt(n3, ["fill", "stroke"]));
        }, "bpmn:Task": function(e3, t3, n3 = {}) {
          return ce2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
        }, "bpmn:TextAnnotation": function(e3, t3, n3 = {}) {
          n3 = rt(n3, ["fill", "stroke", "width", "height"]);
          var { width: r3, height: o3 } = be(t3, n3), a2 = g2(e3, r3, o3, 0, 0, { fill: "none", stroke: "none" });
          return w2(e3, i2.getScaledPath("TEXT_ANNOTATION", { xScaleFactor: 1, yScaleFactor: 1, containerWidth: r3, containerHeight: o3, position: { mx: 0, my: 0 } }), { stroke: xe(t3, p2, n3.stroke) }), Q2(e3, k(t3).get("text") || "", { align: "left-top", box: be(t3, n3), padding: 7, style: { fill: we(t3, c2, p2, n3.stroke) } }), a2;
        }, "bpmn:Transaction": function(e3, t3, i3 = {}) {
          i3 = M(t3) ? rt(i3, ["fill", "stroke", "width", "height"]) : rt(i3, ["fill", "stroke"]);
          var r3 = pe3(e3, t3, { strokeWidth: 1.5, ...i3 }), o3 = n2.style(["no-fill", "no-events"], { stroke: xe(t3, p2, i3.stroke), strokeWidth: 1.5 });
          return M(t3) || (i3 = {}), g2(e3, Ee(t3, i3), _e(t3, i3), 7, 3, o3), r3;
        }, "bpmn:UserTask": function(e3, t3, n3 = {}) {
          var r3 = ce2(e3, t3, n3 = rt(n3, ["fill", "stroke"]));
          return w2(e3, i2.getScaledPath("TASK_TYPE_USER_1", { abspos: { x: 15, y: 12 } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 0.5 }), w2(e3, i2.getScaledPath("TASK_TYPE_USER_2", { abspos: { x: 15, y: 12 } }), { fill: ve(t3, l2, n3.fill), stroke: xe(t3, p2, n3.stroke), strokeWidth: 0.5 }), w2(e3, i2.getScaledPath("TASK_TYPE_USER_3", { abspos: { x: 15, y: 12 } }), { fill: xe(t3, p2, n3.stroke), stroke: xe(t3, p2, n3.stroke), strokeWidth: 0.5 }), r3;
        }, label: function(e3, t3, n3 = {}) {
          return (function(e4, t4, n4 = {}) {
            var i3 = { width: 90, height: 30, x: t4.width / 2 + t4.x, y: t4.height / 2 + t4.y };
            return Q2(e4, L(t4), { box: i3, fitBox: true, style: E({}, o2.getExternalStyle(), { fill: we(t4, c2, p2, n4.stroke) }) });
          })(e3, t3, n3);
        } };
        this._drawPath = w2, this._renderer = _2;
      }
      function rt(e2, t2 = []) {
        return t2.reduce(((t3, n2) => (e2[n2] && (t3[n2] = e2[n2]), t3)), {});
      }
      e(it, A), it.$inject = ["config.bpmnRenderer", "eventBus", "styles", "pathMap", "canvas", "textRenderer"], it.prototype.canRender = function(e2) {
        return R(e2, "bpmn:BaseElement");
      }, it.prototype.drawShape = function(e2, t2, n2 = {}) {
        var { type: i2 } = t2;
        return this._renderer(i2)(e2, t2, n2);
      }, it.prototype.drawConnection = function(e2, t2, n2 = {}) {
        var { type: i2 } = t2;
        return this._renderer(i2)(e2, t2, n2);
      }, it.prototype.getShapePath = function(e2) {
        return R(e2, "bpmn:Event") ? (function(e3) {
          var t2 = e3.x + e3.width / 2, n2 = e3.y + e3.height / 2, i2 = e3.width / 2;
          return le([["M", t2, n2], ["m", 0, -i2], ["a", i2, i2, 0, 1, 1, 0, 2 * i2], ["a", i2, i2, 0, 1, 1, 0, -2 * i2], ["z"]]);
        })(e2) : R(e2, "bpmn:Activity") ? (function(e3, t2) {
          var n2 = e3.x, i2 = e3.y, r2 = e3.width, o2 = e3.height;
          return le([["M", n2 + t2, i2], ["l", r2 - 2 * t2, 0], ["a", t2, t2, 0, 0, 1, t2, t2], ["l", 0, o2 - 2 * t2], ["a", t2, t2, 0, 0, 1, -t2, t2], ["l", 2 * t2 - r2, 0], ["a", t2, t2, 0, 0, 1, -t2, -t2], ["l", 0, 2 * t2 - o2], ["a", t2, t2, 0, 0, 1, t2, -t2], ["z"]]);
        })(e2, 10) : R(e2, "bpmn:Gateway") ? (function(e3) {
          var t2 = e3.width / 2, n2 = e3.height / 2;
          return le([["M", e3.x + t2, e3.y], ["l", t2, n2], ["l", -t2, n2], ["l", -t2, -n2], ["z"]]);
        })(e2) : (function(e3) {
          var t2 = e3.x, n2 = e3.y, i2 = e3.width;
          return le([["M", t2, n2], ["l", i2, 0], ["l", 0, e3.height], ["l", -i2, 0], ["z"]]);
        })(e2);
      };
      var ot = 0, at = { width: 150, height: 50 };
      function st(e2, t2) {
        var n2;
        t2.textContent = e2;
        try {
          var i2, r2 = "" === e2;
          return t2.textContent = r2 ? "dummy" : e2, i2 = { width: (n2 = t2.getBBox()).width + 2 * n2.x, height: n2.height }, r2 && (i2.width = 0), i2;
        } catch (e3) {
          return { width: 0, height: 0 };
        }
      }
      function lt(e2, t2, n2) {
        for (var i2, r2 = e2.shift(), o2 = r2; ; ) {
          if ((i2 = st(o2, n2)).width = o2 ? i2.width : 0, " " === o2 || "" === o2 || i2.width < Math.round(t2) || o2.length < 2) return pt(e2, o2, r2, i2);
          o2 = ut(o2, i2.width, t2);
        }
      }
      function pt(e2, t2, n2, i2) {
        if (t2.length < n2.length) {
          var r2 = n2.slice(t2.length).trim();
          e2.unshift(r2);
        }
        return { width: i2.width, height: i2.height, text: t2 };
      }
      var ct = "\xAD";
      function ut(e2, t2, n2) {
        var i2 = Math.max(e2.length * (n2 / t2), 1), r2 = (function(e3, t3) {
          var n3, i3 = e3.split(/(\s|-|\u00AD)/g), r3 = [], o2 = 0;
          if (i3.length > 1) for (; n3 = i3.shift(); ) {
            if (!(n3.length + o2 < t3)) {
              "-" !== n3 && n3 !== ct || r3.pop();
              break;
            }
            r3.push(n3), o2 += n3.length;
          }
          var a2 = r3[r3.length - 1];
          return a2 && a2 === ct && (r3[r3.length - 1] = "-"), r3.join("");
        })(e2, i2);
        return r2 || (r2 = e2.slice(0, Math.max(Math.round(i2 - 1), 1))), r2;
      }
      function ht(e2) {
        this._config = E({}, { size: at, padding: ot, style: {}, align: "center-top" }, e2 || {});
      }
      ht.prototype.createText = function(e2, t2) {
        return this.layoutText(e2, t2).element;
      }, ht.prototype.getDimensions = function(e2, t2) {
        return this.layoutText(e2, t2).dimensions;
      }, ht.prototype.layoutText = function(e2, t2) {
        var n2 = E({}, this._config.size, t2.box), i2 = E({}, this._config.style, t2.style), r2 = (function(e3) {
          var t3 = e3.split("-");
          return { horizontal: t3[0] || "center", vertical: t3[1] || "top" };
        })(t2.align || this._config.align), o2 = (function(e3) {
          return a(e3) ? E({ top: 0, left: 0, right: 0, bottom: 0 }, e3) : { top: e3, left: e3, right: e3, bottom: e3 };
        })(void 0 !== t2.padding ? t2.padding : this._config.padding), s2 = t2.fitBox || false, l2 = (function(e3) {
          if ("fontSize" in e3 && "lineHeight" in e3) return e3.lineHeight * parseInt(e3.fontSize, 10);
        })(i2), p2 = e2.split(/\u00AD?\r?\n/), c2 = [], u2 = n2.width - o2.left - o2.right, h2 = q("text");
        for (W(h2, { x: 0, y: 0 }), W(h2, i2), I((function() {
          var e3 = document.getElementById("helper-svg");
          return e3 || (W(e3 = q("svg"), { id: "helper-svg" }), Oe(e3, { visibility: "hidden", position: "fixed", width: 0, height: 0 }), document.body.appendChild(e3)), e3;
        })(), h2); p2.length; ) c2.push(lt(p2, u2, h2));
        "middle" === r2.vertical && (o2.top = o2.bottom = 0);
        var d2 = m(c2, (function(e3, t3, n3) {
          return e3 + (l2 || t3.height);
        }), 0) + o2.top + o2.bottom, y2 = m(c2, (function(e3, t3, n3) {
          return t3.width > e3 ? t3.width : e3;
        }), 0), g2 = o2.top;
        "middle" === r2.vertical && (g2 += (n2.height - d2) / 2), g2 -= (l2 || c2[0].height) / 4;
        var v2 = q("text");
        return W(v2, i2), f(c2, (function(e3) {
          var t3;
          switch (g2 += l2 || e3.height, r2.horizontal) {
            case "left":
              t3 = o2.left;
              break;
            case "right":
              t3 = (s2 ? y2 : u2) - o2.right - e3.width;
              break;
            default:
              t3 = Math.max(((s2 ? y2 : u2) - e3.width) / 2 + o2.left, 0);
          }
          var n3 = q("tspan");
          W(n3, { x: t3, y: g2 }), n3.textContent = e3.text, I(v2, n3);
        })), oe(h2), { dimensions: { width: y2, height: d2 }, element: v2 };
      };
      function ft(e2) {
        var t2 = E({ fontFamily: "Arial, sans-serif", fontSize: 12, fontWeight: "normal", lineHeight: 1.2 }, e2 && e2.defaultStyle || {}), n2 = parseInt(t2.fontSize, 10) - 1, i2 = E({}, t2, { fontSize: n2 }, e2 && e2.externalStyle || {}), r2 = new ht({ style: t2 });
        this.getExternalLabelBounds = function(e3, t3) {
          var n3 = r2.getDimensions(t3, { box: { width: 90, height: 30 }, style: i2 });
          return { x: Math.round(e3.x + e3.width / 2 - n3.width / 2), y: Math.round(e3.y), width: Math.ceil(n3.width), height: Math.ceil(n3.height) };
        }, this.getTextAnnotationBounds = function(e3, n3) {
          var i3 = r2.getDimensions(n3, { box: e3, style: t2, align: "left-top", padding: 5 });
          return { x: e3.x, y: e3.y, width: e3.width, height: Math.max(30, Math.round(i3.height)) };
        }, this.createText = function(e3, t3) {
          return r2.createText(e3, t3 || {});
        }, this.getDefaultStyle = function() {
          return t2;
        }, this.getExternalStyle = function() {
          return i2;
        };
      }
      ft.$inject = ["config.textRenderer"];
      var mt = /\{([^{}]+)\}/g, dt = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g;
      var yt = { __init__: ["bpmnRenderer"], bpmnRenderer: ["type", it], textRenderer: ["type", ft], pathMap: ["type", function() {
        this.pathMap = { EVENT_MESSAGE: { d: "m {mx},{my} l 0,{e.y1} l {e.x1},0 l 0,-{e.y1} z l {e.x0},{e.y0} l {e.x0},-{e.y0}", height: 36, width: 36, heightElements: [6, 14], widthElements: [10.5, 21] }, EVENT_SIGNAL: { d: "M {mx},{my} l {e.x0},{e.y0} l -{e.x1},0 Z", height: 36, width: 36, heightElements: [18], widthElements: [10, 20] }, EVENT_ESCALATION: { d: "M {mx},{my} l {e.x0},{e.y0} l -{e.x0},-{e.y1} l -{e.x0},{e.y1} Z", height: 36, width: 36, heightElements: [20, 7], widthElements: [8] }, EVENT_CONDITIONAL: { d: "M {e.x0},{e.y0} l {e.x1},0 l 0,{e.y2} l -{e.x1},0 Z M {e.x2},{e.y3} l {e.x0},0 M {e.x2},{e.y4} l {e.x0},0 M {e.x2},{e.y5} l {e.x0},0 M {e.x2},{e.y6} l {e.x0},0 M {e.x2},{e.y7} l {e.x0},0 M {e.x2},{e.y8} l {e.x0},0 ", height: 36, width: 36, heightElements: [8.5, 14.5, 18, 11.5, 14.5, 17.5, 20.5, 23.5, 26.5], widthElements: [10.5, 14.5, 12.5] }, EVENT_LINK: { d: "m {mx},{my} 0,{e.y0} -{e.x1},0 0,{e.y1} {e.x1},0 0,{e.y0} {e.x0},-{e.y2} -{e.x0},-{e.y2} z", height: 36, width: 36, heightElements: [4.4375, 6.75, 7.8125], widthElements: [9.84375, 13.5] }, EVENT_ERROR: { d: "m {mx},{my} {e.x0},-{e.y0} {e.x1},-{e.y1} {e.x2},{e.y2} {e.x3},-{e.y3} -{e.x4},{e.y4} -{e.x5},-{e.y5} z", height: 36, width: 36, heightElements: [0.023, 8.737, 8.151, 16.564, 10.591, 8.714], widthElements: [0.085, 6.672, 6.97, 4.273, 5.337, 6.636] }, EVENT_CANCEL_45: { d: "m {mx},{my} -{e.x1},0 0,{e.x0} {e.x1},0 0,{e.y1} {e.x0},0 0,-{e.y1} {e.x1},0 0,-{e.y0} -{e.x1},0 0,-{e.y1} -{e.x0},0 z", height: 36, width: 36, heightElements: [4.75, 8.5], widthElements: [4.75, 8.5] }, EVENT_COMPENSATION: { d: "m {mx},{my} {e.x0},-{e.y0} 0,{e.y1} z m {e.x1},-{e.y2} {e.x2},-{e.y3} 0,{e.y1} -{e.x2},-{e.y3} z", height: 36, width: 36, heightElements: [6.5, 13, 0.4, 6.1], widthElements: [9, 9.3, 8.7] }, EVENT_TIMER_WH: { d: "M {mx},{my} l {e.x0},-{e.y0} m -{e.x0},{e.y0} l {e.x1},{e.y1} ", height: 36, width: 36, heightElements: [10, 2], widthElements: [3, 7] }, EVENT_TIMER_LINE: { d: "M {mx},{my} m {e.x0},{e.y0} l -{e.x1},{e.y1} ", height: 36, width: 36, heightElements: [10, 3], widthElements: [0, 0] }, EVENT_MULTIPLE: { d: "m {mx},{my} {e.x1},-{e.y0} {e.x1},{e.y0} -{e.x0},{e.y1} -{e.x2},0 z", height: 36, width: 36, heightElements: [6.28099, 12.56199], widthElements: [3.1405, 9.42149, 12.56198] }, EVENT_PARALLEL_MULTIPLE: { d: "m {mx},{my} {e.x0},0 0,{e.y1} {e.x1},0 0,{e.y0} -{e.x1},0 0,{e.y1} -{e.x0},0 0,-{e.y1} -{e.x1},0 0,-{e.y0} {e.x1},0 z", height: 36, width: 36, heightElements: [2.56228, 7.68683], widthElements: [2.56228, 7.68683] }, GATEWAY_EXCLUSIVE: { d: "m {mx},{my} {e.x0},{e.y0} {e.x1},{e.y0} {e.x2},0 {e.x4},{e.y2} {e.x4},{e.y1} {e.x2},0 {e.x1},{e.y3} {e.x0},{e.y3} {e.x3},0 {e.x5},{e.y1} {e.x5},{e.y2} {e.x3},0 z", height: 17.5, width: 17.5, heightElements: [8.5, 6.5312, -6.5312, -8.5], widthElements: [6.5, -6.5, 3, -3, 5, -5] }, GATEWAY_PARALLEL: { d: "m {mx},{my} 0,{e.y1} -{e.x1},0 0,{e.y0} {e.x1},0 0,{e.y1} {e.x0},0 0,-{e.y1} {e.x1},0 0,-{e.y0} -{e.x1},0 0,-{e.y1} -{e.x0},0 z", height: 30, width: 30, heightElements: [5, 12.5], widthElements: [5, 12.5] }, GATEWAY_EVENT_BASED: { d: "m {mx},{my} {e.x0},{e.y0} {e.x0},{e.y1} {e.x1},{e.y2} {e.x2},0 z", height: 11, width: 11, heightElements: [-6, 6, 12, -12], widthElements: [9, -3, -12] }, GATEWAY_COMPLEX: { d: "m {mx},{my} 0,{e.y0} -{e.x0},-{e.y1} -{e.x1},{e.y2} {e.x0},{e.y1} -{e.x2},0 0,{e.y3} {e.x2},0  -{e.x0},{e.y1} l {e.x1},{e.y2} {e.x0},-{e.y1} 0,{e.y0} {e.x3},0 0,-{e.y0} {e.x0},{e.y1} {e.x1},-{e.y2} -{e.x0},-{e.y1} {e.x2},0 0,-{e.y3} -{e.x2},0 {e.x0},-{e.y1} -{e.x1},-{e.y2} -{e.x0},{e.y1} 0,-{e.y0} -{e.x3},0 z", height: 17.125, width: 17.125, heightElements: [4.875, 3.4375, 2.125, 3], widthElements: [3.4375, 2.125, 4.875, 3] }, DATA_OBJECT_PATH: { d: "m 0,0 {e.x1},0 {e.x0},{e.y0} 0,{e.y1} -{e.x2},0 0,-{e.y2} {e.x1},0 0,{e.y0} {e.x0},0", height: 61, width: 51, heightElements: [10, 50, 60], widthElements: [10, 40, 50, 60] }, DATA_OBJECT_COLLECTION_PATH: { d: "m{mx},{my} m 3,2 l 0,10 m 3,-10 l 0,10 m 3,-10 l 0,10", height: 10, width: 10, heightElements: [], widthElements: [] }, DATA_ARROW: { d: "m 5,9 9,0 0,-3 5,5 -5,5 0,-3 -9,0 z", height: 61, width: 51, heightElements: [], widthElements: [] }, DATA_STORE: { d: "m  {mx},{my} l  0,{e.y2} c  {e.x0},{e.y1} {e.x1},{e.y1}  {e.x2},0 l  0,-{e.y2} c -{e.x0},-{e.y1} -{e.x1},-{e.y1} -{e.x2},0c  {e.x0},{e.y1} {e.x1},{e.y1}  {e.x2},0 m  -{e.x2},{e.y0}c  {e.x0},{e.y1} {e.x1},{e.y1} {e.x2},0m  -{e.x2},{e.y0}c  {e.x0},{e.y1} {e.x1},{e.y1}  {e.x2},0", height: 61, width: 61, heightElements: [7, 10, 45], widthElements: [2, 58, 60] }, TEXT_ANNOTATION: { d: "m {mx}, {my} m 10,0 l -10,0 l 0,{e.y0} l 10,0", height: 30, width: 10, heightElements: [30], widthElements: [10] }, MARKER_SUB_PROCESS: { d: "m{mx},{my} m 7,2 l 0,10 m -5,-5 l 10,0", height: 10, width: 10, heightElements: [], widthElements: [] }, MARKER_PARALLEL: { d: "m{mx},{my} m 3,2 l 0,10 m 3,-10 l 0,10 m 3,-10 l 0,10", height: 10, width: 10, heightElements: [], widthElements: [] }, MARKER_SEQUENTIAL: { d: "m{mx},{my} m 0,3 l 10,0 m -10,3 l 10,0 m -10,3 l 10,0", height: 10, width: 10, heightElements: [], widthElements: [] }, MARKER_COMPENSATION: { d: "m {mx},{my} 7,-5 0,10 z m 7.1,-0.3 6.9,-4.7 0,10 -6.9,-4.7 z", height: 10, width: 21, heightElements: [], widthElements: [] }, MARKER_LOOP: { d: "m {mx},{my} c 3.526979,0 6.386161,-2.829858 6.386161,-6.320661 0,-3.490806 -2.859182,-6.320661 -6.386161,-6.320661 -3.526978,0 -6.38616,2.829855 -6.38616,6.320661 0,1.745402 0.714797,3.325567 1.870463,4.469381 0.577834,0.571908 1.265885,1.034728 2.029916,1.35457 l -0.718163,-3.909793 m 0.718163,3.909793 -3.885211,0.802902", height: 13.9, width: 13.7, heightElements: [], widthElements: [] }, MARKER_ADHOC: { d: "m {mx},{my} m 0.84461,2.64411 c 1.05533,-1.23780996 2.64337,-2.07882 4.29653,-1.97997996 2.05163,0.0805 3.85579,1.15803 5.76082,1.79107 1.06385,0.34139996 2.24454,0.1438 3.18759,-0.43767 0.61743,-0.33642 1.2775,-0.64078 1.7542,-1.17511 0,0.56023 0,1.12046 0,1.6807 -0.98706,0.96237996 -2.29792,1.62393996 -3.6918,1.66181996 -1.24459,0.0927 -2.46671,-0.2491 -3.59505,-0.74812 -1.35789,-0.55965 -2.75133,-1.33436996 -4.27027,-1.18121996 -1.37741,0.14601 -2.41842,1.13685996 -3.44288,1.96782996 z", height: 4, width: 15, heightElements: [], widthElements: [] }, TASK_TYPE_SEND: { d: "m {mx},{my} l 0,{e.y1} l {e.x1},0 l 0,-{e.y1} z l {e.x0},{e.y0} l {e.x0},-{e.y0}", height: 14, width: 21, heightElements: [6, 14], widthElements: [10.5, 21] }, TASK_TYPE_SCRIPT: { d: "m {mx},{my} c 9.966553,-6.27276 -8.000926,-7.91932 2.968968,-14.938 l -8.802728,0 c -10.969894,7.01868 6.997585,8.66524 -2.968967,14.938 z m -7,-12 l 5,0 m -4.5,3 l 4.5,0 m -3,3 l 5,0m -4,3 l 5,0", height: 15, width: 12.6, heightElements: [6, 14], widthElements: [10.5, 21] }, TASK_TYPE_USER_1: { d: "m {mx},{my} c 0.909,-0.845 1.594,-2.049 1.594,-3.385 0,-2.554 -1.805,-4.62199999 -4.357,-4.62199999 -2.55199998,0 -4.28799998,2.06799999 -4.28799998,4.62199999 0,1.348 0.974,2.562 1.89599998,3.405 -0.52899998,0.187 -5.669,2.097 -5.794,4.7560005 v 6.718 h 17 v -6.718 c 0,-2.2980005 -5.5279996,-4.5950005 -6.0509996,-4.7760005 zm -8,6 l 0,5.5 m 11,0 l 0,-5" }, TASK_TYPE_USER_2: { d: "m {mx},{my} m 2.162,1.009 c 0,2.4470005 -2.158,4.4310005 -4.821,4.4310005 -2.66499998,0 -4.822,-1.981 -4.822,-4.4310005 " }, TASK_TYPE_USER_3: { d: "m {mx},{my} m -6.9,-3.80 c 0,0 2.25099998,-2.358 4.27399998,-1.177 2.024,1.181 4.221,1.537 4.124,0.965 -0.098,-0.57 -0.117,-3.79099999 -4.191,-4.13599999 -3.57499998,0.001 -4.20799998,3.36699999 -4.20699998,4.34799999 z" }, TASK_TYPE_MANUAL: { d: "m {mx},{my} c 0.234,-0.01 5.604,0.008 8.029,0.004 0.808,0 1.271,-0.172 1.417,-0.752 0.227,-0.898 -0.334,-1.314 -1.338,-1.316 -2.467,-0.01 -7.886,-0.004 -8.108,-0.004 -0.014,-0.079 0.016,-0.533 0,-0.61 0.195,-0.042 8.507,0.006 9.616,0.002 0.877,-0.007 1.35,-0.438 1.353,-1.208 0.003,-0.768 -0.479,-1.09 -1.35,-1.091 -2.968,-0.002 -9.619,-0.013 -9.619,-0.013 v -0.591 c 0,0 5.052,-0.016 7.225,-0.016 0.888,-0.002 1.354,-0.416 1.351,-1.193 -0.006,-0.761 -0.492,-1.196 -1.361,-1.196 -3.473,-0.005 -10.86,-0.003 -11.0829995,-0.003 -0.022,-0.047 -0.045,-0.094 -0.069,-0.139 0.3939995,-0.319 2.0409995,-1.626 2.4149995,-2.017 0.469,-0.4870005 0.519,-1.1650005 0.162,-1.6040005 -0.414,-0.511 -0.973,-0.5 -1.48,-0.236 -1.4609995,0.764 -6.5999995,3.6430005 -7.7329995,4.2710005 -0.9,0.499 -1.516,1.253 -1.882,2.19 -0.37000002,0.95 -0.17,2.01 -0.166,2.979 0.004,0.718 -0.27300002,1.345 -0.055,2.063 0.629,2.087 2.425,3.312 4.859,3.318 4.6179995,0.014 9.2379995,-0.139 13.8569995,-0.158 0.755,-0.004 1.171,-0.301 1.182,-1.033 0.012,-0.754 -0.423,-0.969 -1.183,-0.973 -1.778,-0.01 -5.824,-0.004 -6.04,-0.004 10e-4,-0.084 0.003,-0.586 10e-4,-0.67 z" }, TASK_TYPE_INSTANTIATING_SEND: { d: "m {mx},{my} l 0,8.4 l 12.6,0 l 0,-8.4 z l 6.3,3.6 l 6.3,-3.6" }, TASK_TYPE_SERVICE: { d: "m {mx},{my} v -1.71335 c 0.352326,-0.0705 0.703932,-0.17838 1.047628,-0.32133 0.344416,-0.14465 0.665822,-0.32133 0.966377,-0.52145 l 1.19431,1.18005 1.567487,-1.57688 -1.195028,-1.18014 c 0.403376,-0.61394 0.683079,-1.29908 0.825447,-2.01824 l 1.622133,-0.01 v -2.2196 l -1.636514,0.01 c -0.07333,-0.35153 -0.178319,-0.70024 -0.323564,-1.04372 -0.145244,-0.34406 -0.321407,-0.6644 -0.522735,-0.96217 l 1.131035,-1.13631 -1.583305,-1.56293 -1.129598,1.13589 c -0.614052,-0.40108 -1.302883,-0.68093 -2.022633,-0.82247 l 0.0093,-1.61852 h -2.241173 l 0.0042,1.63124 c -0.353763,0.0736 -0.705369,0.17977 -1.049785,0.32371 -0.344415,0.14437 -0.665102,0.32092 -0.9635006,0.52046 l -1.1698628,-1.15823 -1.5667691,1.5792 1.1684265,1.15669 c -0.4026573,0.61283 -0.68308,1.29797 -0.8247287,2.01713 l -1.6588041,0.003 v 2.22174 l 1.6724648,-0.006 c 0.073327,0.35077 0.1797598,0.70243 0.3242851,1.04472 0.1452428,0.34448 0.3214064,0.6644 0.5227339,0.96066 l -1.1993431,1.19723 1.5840256,1.56011 1.1964668,-1.19348 c 0.6140517,0.40346 1.3028827,0.68232 2.0233517,0.82331 l 7.19e-4,1.69892 h 2.226848 z m 0.221462,-3.9957 c -1.788948,0.7502 -3.8576,-0.0928 -4.6097055,-1.87438 -0.7521065,-1.78321 0.090598,-3.84627 1.8802645,-4.59604 1.78823,-0.74936 3.856881,0.0929 4.608987,1.87437 0.752106,1.78165 -0.0906,3.84612 -1.879546,4.59605 z" }, TASK_TYPE_SERVICE_FILL: { d: "m {mx},{my} c -1.788948,0.7502 -3.8576,-0.0928 -4.6097055,-1.87438 -0.7521065,-1.78321 0.090598,-3.84627 1.8802645,-4.59604 1.78823,-0.74936 3.856881,0.0929 4.608987,1.87437 0.752106,1.78165 -0.0906,3.84612 -1.879546,4.59605 z" }, TASK_TYPE_BUSINESS_RULE_HEADER: { d: "m {mx},{my} 0,4 20,0 0,-4 z" }, TASK_TYPE_BUSINESS_RULE_MAIN: { d: "m {mx},{my} 0,12 20,0 0,-12 zm 0,8 l 20,0 m -13,-4 l 0,8" }, MESSAGE_FLOW_MARKER: { d: "m {mx},{my} m -10.5 ,-7 l 0,14 l 21,0 l 0,-14 z l 10.5,6 l 10.5,-6" } }, this.getRawPath = function(e2) {
          return this.pathMap[e2].d;
        }, this.getScaledPath = function(e2, t2) {
          var n2, i2, r2 = this.pathMap[e2];
          t2.abspos ? (n2 = t2.abspos.x, i2 = t2.abspos.y) : (n2 = t2.containerWidth * t2.position.mx, i2 = t2.containerHeight * t2.position.my);
          var o2 = {};
          if (t2.position) {
            for (var a2 = t2.containerHeight / r2.height * t2.yScaleFactor, s2 = t2.containerWidth / r2.width * t2.xScaleFactor, l2 = 0; l2 < r2.heightElements.length; l2++) o2["y" + l2] = r2.heightElements[l2] * a2;
            for (var p2 = 0; p2 < r2.widthElements.length; p2++) o2["x" + p2] = r2.widthElements[p2] * s2;
          }
          var c2, u2, h2 = (c2 = r2.d, u2 = { mx: n2, my: i2, e: o2 }, String(c2).replace(mt, (function(e3, t3) {
            return (function(e4, t4, n3) {
              var i3 = n3;
              return t4.replace(dt, (function(e5, t5, n4, r3, o3) {
                t5 = t5 || r3, i3 && (t5 in i3 && (i3 = i3[t5]), "function" == typeof i3 && o3 && (i3 = i3()));
              })), i3 = (null == i3 || i3 == n3 ? e4 : i3) + "";
            })(e3, t3, u2);
          })));
          return h2;
        };
      }] };
      var gt = { translate: ["value", function(e2, t2) {
        return t2 = t2 || {}, e2.replace(/{([^}]+)}/g, (function(e3, n2) {
          return t2[n2] || "{" + n2 + "}";
        }));
      }] };
      function vt(e2) {
        return { top: e2.y, right: e2.x + (e2.width || 0), bottom: e2.y + (e2.height || 0), left: e2.x };
      }
      function xt(e2) {
        return t2 = { x: e2.x + (e2.width || 0) / 2, y: e2.y + (e2.height || 0) / 2 }, { x: Math.round(t2.x), y: Math.round(t2.y) };
        var t2;
      }
      function wt(e2) {
        for (var t2 = e2.waypoints, n2 = t2.reduce((function(e3, n3, i3) {
          var r3, o3, a3 = t2[i3 - 1];
          if (a3) {
            var s2 = e3[e3.length - 1], l2 = s2 && s2.endLength || 0, p2 = (r3 = a3, o3 = n3, Math.sqrt(Math.pow(r3.x - o3.x, 2) + Math.pow(r3.y - o3.y, 2)));
            e3.push({ start: a3, end: n3, startLength: l2, endLength: l2 + p2, length: p2 });
          }
          return e3;
        }), []), i2 = n2.reduce((function(e3, t3) {
          return e3 + t3.length;
        }), 0) / 2, r2 = 0, o2 = n2[r2]; o2.endLength < i2; ) o2 = n2[++r2];
        var a2 = (i2 - o2.startLength) / o2.length;
        return { x: o2.start.x + (o2.end.x - o2.start.x) * a2, y: o2.start.y + (o2.end.y - o2.start.y) * a2 };
      }
      function bt(e2) {
        return a(t2 = e2) && c(t2, "waypoints") ? wt(e2) : xt(e2);
        var t2;
      }
      function Et(e2) {
        return e2 ? "<" + e2.$type + (e2.id ? ' id="' + e2.id : "") + '" />' : "<null>";
      }
      function _t(e2, t2, n2) {
        return E({ id: e2.id, type: e2.$type, businessObject: e2, di: t2 }, n2);
      }
      function At(e2, t2, n2) {
        var i2 = e2.waypoint;
        return !i2 || i2.length < 2 ? [bt(t2), bt(n2)] : i2.map((function(e3) {
          return { x: e3.x, y: e3.y };
        }));
      }
      function Rt(e2, t2, n2) {
        return new Error(`element ${Et(t2)} referenced by ${Et(e2)}#${n2} not yet drawn`);
      }
      function St(e2, t2, n2, i2, r2) {
        this._eventBus = e2, this._canvas = t2, this._elementFactory = n2, this._elementRegistry = i2, this._textRenderer = r2;
      }
      St.$inject = ["eventBus", "canvas", "elementFactory", "elementRegistry", "textRenderer"], St.prototype.add = function(e2, t2, n2) {
        var i2, r2, o2, a2, s2, l2, p2;
        if (R(t2, "bpmndi:BPMNPlane")) {
          var c2 = R(e2, "bpmn:SubProcess") ? { id: e2.id + "_plane" } : {};
          i2 = this._elementFactory.createRoot(_t(e2, t2, c2)), this._canvas.addRootElement(i2);
        } else if (R(t2, "bpmndi:BPMNShape")) {
          var u2 = !M(e2, t2), h2 = (function(e3) {
            return R(e3, "bpmn:Group");
          })(e2);
          r2 = n2 && (n2.hidden || n2.collapsed);
          var f2 = t2.bounds;
          i2 = this._elementFactory.createShape(_t(e2, t2, { collapsed: u2, hidden: r2, x: Math.round(f2.x), y: Math.round(f2.y), width: Math.round(f2.width), height: Math.round(f2.height), isFrame: h2 })), R(e2, "bpmn:BoundaryEvent") && this._attachBoundary(e2, i2), R(e2, "bpmn:Lane") && (o2 = 0), R(e2, "bpmn:DataStoreReference") && (a2 = n2, s2 = bt(f2), l2 = s2.x, p2 = s2.y, l2 >= a2.x && l2 <= a2.x + a2.width && p2 >= a2.y && p2 <= a2.y + a2.height || (n2 = this._canvas.findRoot(n2))), this._canvas.addShape(i2, n2, o2);
        } else {
          if (!R(t2, "bpmndi:BPMNEdge")) throw new Error(`unknown di ${Et(t2)} for element ${Et(e2)}`);
          var m2 = this._getSource(e2), d2 = this._getTarget(e2);
          r2 = n2 && (n2.hidden || n2.collapsed), i2 = this._elementFactory.createConnection(_t(e2, t2, { hidden: r2, source: m2, target: d2, waypoints: At(t2, m2, d2) })), R(e2, "bpmn:DataAssociation") && (n2 = this._canvas.findRoot(n2)), this._canvas.addConnection(i2, n2, o2);
        }
        return (function(e3) {
          return R(e3, "bpmn:Event") || R(e3, "bpmn:Gateway") || R(e3, "bpmn:DataStoreReference") || R(e3, "bpmn:DataObjectReference") || R(e3, "bpmn:DataInput") || R(e3, "bpmn:DataOutput") || R(e3, "bpmn:SequenceFlow") || R(e3, "bpmn:MessageFlow") || R(e3, "bpmn:Group");
        })(e2) && L(i2) && this.addLabel(e2, t2, i2), this._eventBus.fire("bpmnElement.added", { element: i2 }), i2;
      }, St.prototype._attachBoundary = function(e2, t2) {
        var n2 = e2.attachedToRef;
        if (!n2) throw new Error(`missing ${Et(e2)}#attachedToRef`);
        var i2 = this._elementRegistry.get(n2.id), r2 = i2 && i2.attachers;
        if (!i2) throw Rt(e2, n2, "attachedToRef");
        t2.host = i2, r2 || (i2.attachers = r2 = []), -1 === r2.indexOf(t2) && r2.push(t2);
      }, St.prototype.addLabel = function(e2, t2, n2) {
        var i2, r2, o2;
        return i2 = B(t2, n2), (r2 = L(n2)) && (i2 = this._textRenderer.getExternalLabelBounds(i2, r2)), o2 = this._elementFactory.createLabel(_t(e2, t2, { id: e2.id + "_label", labelTarget: n2, type: "label", hidden: n2.hidden || !L(n2), x: Math.round(i2.x), y: Math.round(i2.y), width: Math.round(i2.width), height: Math.round(i2.height) })), this._canvas.addShape(o2, n2.parent);
      }, St.prototype._getConnectedElement = function(e2, t2) {
        var n2, i2, r2 = e2.$type;
        if (i2 = e2[t2 + "Ref"], "source" === t2 && "bpmn:DataInputAssociation" === r2 && (i2 = i2 && i2[0]), ("source" === t2 && "bpmn:DataOutputAssociation" === r2 || "target" === t2 && "bpmn:DataInputAssociation" === r2) && (i2 = e2.$parent), n2 = i2 && this._getElement(i2)) return n2;
        throw i2 ? Rt(e2, i2, t2 + "Ref") : new Error(`${Et(e2)}#${t2} Ref not specified`);
      }, St.prototype._getSource = function(e2) {
        return this._getConnectedElement(e2, "source");
      }, St.prototype._getTarget = function(e2) {
        return this._getConnectedElement(e2, "target");
      }, St.prototype._getElement = function(e2) {
        return this._elementRegistry.get(e2.id);
      };
      var kt = { __depends__: [yt, { __depends__: [gt], bpmnImporter: ["type", St] }] };
      function Ct(e2, t2) {
        var n2, i2, r2, a2;
        return t2 = !!t2, o(e2) || (e2 = [e2]), f(e2, (function(e3) {
          var o2 = e3;
          e3.waypoints && !t2 && (o2 = Ct(e3.waypoints, true));
          var s2 = o2.x, l2 = o2.y, p2 = o2.height || 0, c2 = o2.width || 0;
          (s2 < n2 || void 0 === n2) && (n2 = s2), (l2 < i2 || void 0 === i2) && (i2 = l2), (s2 + c2 > r2 || void 0 === r2) && (r2 = s2 + c2), (l2 + p2 > a2 || void 0 === a2) && (a2 = l2 + p2);
        })), { x: n2, y: i2, height: a2 - i2, width: r2 - n2 };
      }
      function Mt(e2) {
        return "waypoints" in e2 ? "connection" : "x" in e2 ? "shape" : "root";
      }
      function Pt(e2) {
        return !(!e2 || !e2.isFrame);
      }
      function Ot(e2) {
        this._counter = 0, this._prefix = (e2 ? e2 + "-" : "") + Math.floor(1e9 * Math.random()) + "-";
      }
      Ot.prototype.next = function() {
        return this._prefix + ++this._counter;
      };
      var Tt = new Ot("ov");
      function Nt(e2, t2, n2, i2) {
        var r2, o2;
        this._eventBus = t2, this._canvas = n2, this._elementRegistry = i2, this._ids = Tt, this._overlayDefaults = E({ show: null, scale: true }, e2 && e2.defaults), this._overlays = {}, this._overlayContainers = [], this._overlayRoot = (r2 = n2.getContainer(), Oe(o2 = qe('<div class="djs-overlay-container" />'), { position: "absolute", width: 0, height: 0 }), r2.insertBefore(o2, r2.firstChild), o2), this._init();
      }
      function Dt(e2, t2, n2) {
        Oe(e2, { left: t2 + "px", top: n2 + "px" });
      }
      function Bt(e2, t2) {
        e2.style.display = false === t2 ? "none" : "";
      }
      function Lt(e2, t2) {
        e2.style["transform-origin"] = "top left", ["", "-ms-", "-webkit-"].forEach((function(n2) {
          e2.style[n2 + "transform"] = t2;
        }));
      }
      Nt.$inject = ["config.overlays", "eventBus", "canvas", "elementRegistry"], Nt.prototype.get = function(e2) {
        if (p(e2) && (e2 = { id: e2 }), p(e2.element) && (e2.element = this._elementRegistry.get(e2.element)), e2.element) {
          var t2 = this._getOverlayContainer(e2.element, true);
          return t2 ? e2.type ? h(t2.overlays, g({ type: e2.type })) : t2.overlays.slice() : [];
        }
        return e2.type ? h(this._overlays, g({ type: e2.type })) : e2.id ? this._overlays[e2.id] : null;
      }, Nt.prototype.add = function(e2, t2, n2) {
        if (a(t2) && (n2 = t2, t2 = null), e2.id || (e2 = this._elementRegistry.get(e2)), !n2.position) throw new Error("must specifiy overlay position");
        if (!n2.html) throw new Error("must specifiy overlay html");
        if (!e2) throw new Error("invalid element specified");
        var i2 = this._ids.next();
        return n2 = E({}, this._overlayDefaults, n2, { id: i2, type: t2, element: e2, html: n2.html }), this._addOverlay(n2), i2;
      }, Nt.prototype.remove = function(e2) {
        var t2 = this.get(e2) || [];
        o(t2) || (t2 = [t2]);
        var n2 = this;
        f(t2, (function(e3) {
          var t3 = n2._getOverlayContainer(e3.element, true);
          if (e3 && (Xe(e3.html), Xe(e3.htmlContainer), delete e3.htmlContainer, delete e3.element, delete n2._overlays[e3.id]), t3) {
            var i2 = t3.overlays.indexOf(e3);
            -1 !== i2 && t3.overlays.splice(i2, 1);
          }
        }));
      }, Nt.prototype.isShown = function() {
        return "none" !== this._overlayRoot.style.display;
      }, Nt.prototype.show = function() {
        Bt(this._overlayRoot);
      }, Nt.prototype.hide = function() {
        Bt(this._overlayRoot, false);
      }, Nt.prototype.clear = function() {
        this._overlays = {}, this._overlayContainers = [], Be(this._overlayRoot);
      }, Nt.prototype._updateOverlayContainer = function(e2) {
        var t2 = e2.element, n2 = e2.html, i2 = t2.x, r2 = t2.y;
        if (t2.waypoints) {
          var o2 = Ct(t2);
          i2 = o2.x, r2 = o2.y;
        }
        Dt(n2, i2, r2), (function(e3, t3, n3) {
          2 == arguments.length ? e3.getAttribute(t3) : null === n3 ? e3.removeAttribute(t3) : e3.setAttribute(t3, n3);
        })(e2.html, "data-container-id", t2.id);
      }, Nt.prototype._updateOverlay = function(e2) {
        var t2, n2, i2 = e2.position, r2 = e2.htmlContainer, o2 = e2.element, a2 = i2.left, s2 = i2.top;
        void 0 !== i2.right && (t2 = o2.waypoints ? Ct(o2).width : o2.width, a2 = -1 * i2.right + t2);
        void 0 !== i2.bottom && (n2 = o2.waypoints ? Ct(o2).height : o2.height, s2 = -1 * i2.bottom + n2);
        Dt(r2, a2 || 0, s2 || 0), this._updateOverlayVisibilty(e2, this._canvas.viewbox());
      }, Nt.prototype._createOverlayContainer = function(e2) {
        var t2 = qe('<div class="djs-overlays" />');
        Oe(t2, { position: "absolute" }), this._overlayRoot.appendChild(t2);
        var n2 = { html: t2, element: e2, overlays: [] };
        return this._updateOverlayContainer(n2), this._overlayContainers.push(n2), n2;
      }, Nt.prototype._updateRoot = function(e2) {
        var t2 = e2.scale || 1, n2 = "matrix(" + [t2, 0, 0, t2, -1 * e2.x * t2, -1 * e2.y * t2].join(",") + ")";
        Lt(this._overlayRoot, n2);
      }, Nt.prototype._getOverlayContainer = function(e2, t2) {
        var n2 = u(this._overlayContainers, (function(t3) {
          return t3.element === e2;
        }));
        return n2 || t2 ? n2 : this._createOverlayContainer(e2);
      }, Nt.prototype._addOverlay = function(e2) {
        var t2, n2, i2 = e2.id, r2 = e2.element, o2 = e2.html;
        o2.get && o2.constructor.prototype.jquery && (o2 = o2.get(0)), p(o2) && (o2 = qe(o2)), n2 = this._getOverlayContainer(r2), Oe(t2 = qe('<div class="djs-overlay" data-overlay-id="' + i2 + '">'), { position: "absolute" }), t2.appendChild(o2), e2.type && Ne(t2).add("djs-overlay-" + e2.type), Bt(t2, this._canvas.findRoot(r2) === this._canvas.getRootElement()), e2.htmlContainer = t2, n2.overlays.push(e2), n2.html.appendChild(t2), this._overlays[i2] = e2, this._updateOverlay(e2), this._updateOverlayVisibilty(e2, this._canvas.viewbox());
      }, Nt.prototype._updateOverlayVisibilty = function(e2, t2) {
        var n2 = e2.show, i2 = this._canvas.findRoot(e2.element), o2 = n2 && n2.minZoom, a2 = n2 && n2.maxZoom, s2 = e2.htmlContainer, l2 = true;
        (i2 !== this._canvas.getRootElement() || n2 && (r(o2) && o2 > t2.scale || r(a2) && a2 < t2.scale)) && (l2 = false), Bt(s2, l2), this._updateOverlayScale(e2, t2);
      }, Nt.prototype._updateOverlayScale = function(e2, t2) {
        var n2, i2, o2, a2 = e2.scale, s2 = e2.htmlContainer, l2 = "";
        true !== a2 && (false === a2 ? (n2 = 1, i2 = 1) : (n2 = a2.min, i2 = a2.max), r(n2) && t2.scale < n2 && (o2 = (1 / t2.scale || 1) * n2), r(i2) && t2.scale > i2 && (o2 = (1 / t2.scale || 1) * i2)), r(o2) && (l2 = "scale(" + o2 + "," + o2 + ")"), Lt(s2, l2);
      }, Nt.prototype._updateOverlaysVisibilty = function(e2) {
        var t2 = this;
        f(this._overlays, (function(n2) {
          t2._updateOverlayVisibilty(n2, e2);
        }));
      }, Nt.prototype._init = function() {
        var e2 = this._eventBus, t2 = this;
        e2.on("canvas.viewbox.changing", (function(e3) {
          t2.hide();
        })), e2.on("canvas.viewbox.changed", (function(e3) {
          var n2;
          n2 = e3.viewbox, t2._updateRoot(n2), t2._updateOverlaysVisibilty(n2), t2.show();
        })), e2.on(["shape.remove", "connection.remove"], (function(e3) {
          var n2 = e3.element;
          f(t2.get({ element: n2 }), (function(e4) {
            t2.remove(e4.id);
          }));
          var i2 = t2._getOverlayContainer(n2);
          if (i2) {
            Xe(i2.html);
            var r2 = t2._overlayContainers.indexOf(i2);
            -1 !== r2 && t2._overlayContainers.splice(r2, 1);
          }
        })), e2.on("element.changed", 500, (function(e3) {
          var n2 = e3.element, i2 = t2._getOverlayContainer(n2, true);
          i2 && (f(i2.overlays, (function(e4) {
            t2._updateOverlay(e4);
          })), t2._updateOverlayContainer(i2));
        })), e2.on("element.marker.update", (function(e3) {
          var n2 = t2._getOverlayContainer(e3.element, true);
          n2 && Ne(n2.html)[e3.add ? "add" : "remove"](e3.marker);
        })), e2.on("root.set", (function() {
          t2._updateOverlaysVisibilty(t2._canvas.viewbox());
        })), e2.on("diagram.clear", this.clear, this);
      };
      var It = { __init__: ["overlays"], overlays: ["type", Nt] };
      function jt(e2, t2, n2, i2) {
        e2.on("element.changed", (function(i3) {
          var r2 = i3.element;
          (r2.parent || r2 === t2.getRootElement()) && (i3.gfx = n2.getGraphics(r2)), i3.gfx && e2.fire(Mt(r2) + ".changed", i3);
        })), e2.on("elements.changed", (function(t3) {
          var n3 = t3.elements;
          n3.forEach((function(t4) {
            e2.fire("element.changed", { element: t4 });
          })), i2.updateContainments(n3);
        })), e2.on("shape.changed", (function(e3) {
          i2.update("shape", e3.element, e3.gfx);
        })), e2.on("connection.changed", (function(e3) {
          i2.update("connection", e3.element, e3.gfx);
        }));
      }
      jt.$inject = ["eventBus", "canvas", "elementRegistry", "graphicsFactory"];
      var Ft = { __init__: ["changeSupport"], changeSupport: ["type", jt] };
      function Vt(e2) {
        this._eventBus = e2;
      }
      function Wt(e2) {
        return function(t2, n2, i2, r2, o2) {
          (l(t2) || s(t2)) && (o2 = r2, r2 = i2, i2 = n2, n2 = t2, t2 = null), this.on(t2, e2, n2, i2, r2, o2);
        };
      }
      function $t(e2, t2) {
        t2.invoke(Vt, this), this.executed((function(t3) {
          var n2 = t3.context;
          n2.rootElement ? e2.setRootElement(n2.rootElement) : n2.rootElement = e2.getRootElement();
        })), this.revert((function(t3) {
          var n2 = t3.context;
          n2.rootElement && e2.setRootElement(n2.rootElement);
        }));
      }
      Vt.$inject = ["eventBus"], Vt.prototype.on = function(e2, t2, n2, i2, r2, p2) {
        if ((l(t2) || s(t2)) && (p2 = r2, r2 = i2, i2 = n2, n2 = t2, t2 = null), l(n2) && (p2 = r2, r2 = i2, i2 = n2, n2 = 1e3), a(r2) && (p2 = r2, r2 = false), !l(i2)) throw new Error("handlerFn must be a function");
        o(e2) || (e2 = [e2]);
        var c2 = this._eventBus;
        f(e2, (function(e3) {
          var o2 = ["commandStack", e3, t2].filter((function(e4) {
            return e4;
          })).join(".");
          c2.on(o2, n2, r2 ? /* @__PURE__ */ (function(e4, t3) {
            return function(n3) {
              return e4.call(t3 || null, n3.context, n3.command, n3);
            };
          })(i2, p2) : i2, p2);
        }));
      }, Vt.prototype.canExecute = Wt("canExecute"), Vt.prototype.preExecute = Wt("preExecute"), Vt.prototype.preExecuted = Wt("preExecuted"), Vt.prototype.execute = Wt("execute"), Vt.prototype.executed = Wt("executed"), Vt.prototype.postExecute = Wt("postExecute"), Vt.prototype.postExecuted = Wt("postExecuted"), Vt.prototype.revert = Wt("revert"), Vt.prototype.reverted = Wt("reverted"), e($t, Vt), $t.$inject = ["canvas", "injector"];
      var zt = { __init__: ["rootElementsBehavior"], rootElementsBehavior: ["type", $t] }, Gt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      var Ht = "_plane";
      function Kt(e2) {
        var t2 = e2.id;
        return R(e2, "bpmn:SubProcess") ? (function(e3) {
          return e3 + Ht;
        })(t2) : t2;
      }
      function Ut(e2, t2, n2) {
        var i2 = qe('<ul class="bjs-breadcrumbs"></ul>'), r2 = n2.getContainer(), o2 = Ne(r2);
        r2.appendChild(i2);
        var a2 = [];
        function s2(e3) {
          e3 && (a2 = (function(e4) {
            for (var t3 = k(e4), n3 = [], i3 = t3; i3; i3 = i3.$parent) (R(i3, "bpmn:SubProcess") || R(i3, "bpmn:Process")) && n3.push(i3);
            return n3.reverse();
          })(e3));
          var r3 = a2.flatMap((function(e4) {
            var i3 = n2.findRoot(Kt(e4)) || n2.findRoot(e4.id);
            if (!i3 && R(e4, "bpmn:Process")) {
              var r4 = t2.find((function(t3) {
                var n3 = k(t3);
                return n3 && n3.get("processRef") === e4;
              }));
              i3 = r4 && n2.findRoot(r4.id);
            }
            if (!i3) return [];
            var o3, a3 = (o3 = "" + (o3 = e4.name || e4.id)) && o3.replace(/[&<>"']/g, (function(e5) {
              return Gt[e5];
            })), s4 = qe('<li><span class="bjs-crumb"><a title="' + a3 + '">' + a3 + "</a></span></li>");
            return s4.addEventListener("click", (function() {
              n2.setRootElement(i3);
            })), s4;
          }));
          i2.innerHTML = "";
          var s3 = r3.length > 1;
          o2.toggle("bjs-breadcrumbs-shown", s3), r3.forEach((function(e4) {
            i2.appendChild(e4);
          }));
        }
        e2.on("element.changed", (function(e3) {
          var t3 = k(e3.element);
          u(a2, (function(e4) {
            return e4 === t3;
          })) && s2();
        })), e2.on("root.set", (function(e3) {
          s2(e3.element);
        }));
      }
      function qt(e2, t2) {
        var n2 = null, i2 = new Yt();
        e2.on("root.set", (function(e3) {
          var r2 = e3.element, o2 = t2.viewbox(), a2 = i2.get(r2);
          if (i2.set(n2, { x: o2.x, y: o2.y, zoom: o2.scale }), n2 = r2, R(r2, "bpmn:SubProcess") || a2) {
            a2 = a2 || { x: 0, y: 0, zoom: 1 };
            var s2 = (o2.x - a2.x) * o2.scale, l2 = (o2.y - a2.y) * o2.scale;
            0 === s2 && 0 === l2 || t2.scroll({ dx: s2, dy: l2 }), a2.zoom !== o2.scale && t2.zoom(a2.zoom, { x: 0, y: 0 });
          }
        })), e2.on("diagram.clear", (function() {
          i2.clear(), n2 = null;
        }));
      }
      function Yt() {
        this._entries = [], this.set = function(e2, t2) {
          var n2 = false;
          for (var i2 in this._entries) if (this._entries[i2][0] === e2) {
            this._entries[i2][1] = t2, n2 = true;
            break;
          }
          n2 || this._entries.push([e2, t2]);
        }, this.get = function(e2) {
          for (var t2 in this._entries) if (this._entries[t2][0] === e2) return this._entries[t2][1];
          return null;
        }, this.clear = function() {
          this._entries.length = 0;
        }, this.remove = function(e2) {
          var t2 = -1;
          for (var n2 in this._entries) if (this._entries[n2][0] === e2) {
            t2 = n2;
            break;
          }
          -1 !== t2 && this._entries.splice(t2, 1);
        };
      }
      Ut.$inject = ["eventBus", "elementRegistry", "canvas"], qt.$inject = ["eventBus", "canvas"];
      var Xt = 180, Zt = 160;
      function Jt(e2, t2) {
        this._eventBus = e2, this._moddle = t2;
        var n2 = this;
        e2.on("import.render.start", 1500, (function(e3, t3) {
          n2._handleImport(t3.definitions);
        }));
      }
      function Qt(e2) {
        return R(e2, "bpmndi:BPMNDiagram") ? e2 : Qt(e2.$parent);
      }
      Jt.prototype._handleImport = function(e2) {
        if (e2.diagrams) {
          var t2 = this;
          this._definitions = e2, this._processToDiagramMap = {}, e2.diagrams.forEach((function(e3) {
            e3.plane && e3.plane.bpmnElement && (t2._processToDiagramMap[e3.plane.bpmnElement.id] = e3);
          })), e2.diagrams.filter(((e3) => e3.plane)).flatMap(((e3) => t2._createNewDiagrams(e3.plane))).forEach((function(e3) {
            t2._movePlaneElementsToOrigin(e3.plane);
          }));
        }
      }, Jt.prototype._createNewDiagrams = function(e2) {
        var t2 = this, n2 = [], i2 = [];
        e2.get("planeElement").forEach((function(t3) {
          var r3 = t3.bpmnElement;
          if (r3) {
            var o2 = r3.$parent;
            R(r3, "bpmn:SubProcess") && !t3.isExpanded && n2.push(r3), (function(e3, t4) {
              var n3 = e3.$parent;
              if (!R(n3, "bpmn:SubProcess") || n3 === t4.bpmnElement) return false;
              if (S(e3, ["bpmn:DataInputAssociation", "bpmn:DataOutputAssociation"])) return false;
              return true;
            })(r3, e2) && i2.push({ diElement: t3, parent: o2 });
          }
        }));
        var r2 = [];
        return n2.forEach((function(e3) {
          if (!t2._processToDiagramMap[e3.id]) {
            var n3 = t2._createDiagram(e3);
            t2._processToDiagramMap[e3.id] = n3, r2.push(n3);
          }
        })), i2.forEach((function(e3) {
          for (var i3 = e3.diElement, r3 = e3.parent; r3 && -1 === n2.indexOf(r3); ) r3 = r3.$parent;
          if (r3) {
            var o2 = t2._processToDiagramMap[r3.id];
            t2._moveToDiPlane(i3, o2.plane);
          }
        })), r2;
      }, Jt.prototype._movePlaneElementsToOrigin = function(e2) {
        var t2 = e2.get("planeElement"), n2 = (function(e3) {
          var t3 = { top: 1 / 0, right: -1 / 0, bottom: -1 / 0, left: 1 / 0 };
          return e3.planeElement.forEach((function(e4) {
            if (e4.bounds) {
              var n3 = vt(e4.bounds);
              t3.top = Math.min(n3.top, t3.top), t3.left = Math.min(n3.left, t3.left);
            }
          })), (function(e4) {
            return { x: e4.left, y: e4.top, width: e4.right - e4.left, height: e4.bottom - e4.top };
          })(t3);
        })(e2), i2 = n2.x - Xt, r2 = n2.y - Zt;
        t2.forEach((function(e3) {
          e3.waypoint ? e3.waypoint.forEach((function(e4) {
            e4.x = e4.x - i2, e4.y = e4.y - r2;
          })) : e3.bounds && (e3.bounds.x = e3.bounds.x - i2, e3.bounds.y = e3.bounds.y - r2);
        }));
      }, Jt.prototype._moveToDiPlane = function(e2, t2) {
        var n2 = Qt(e2).plane.get("planeElement");
        n2.splice(n2.indexOf(e2), 1), t2.get("planeElement").push(e2);
      }, Jt.prototype._createDiagram = function(e2) {
        var t2 = this._moddle.create("bpmndi:BPMNPlane", { bpmnElement: e2 }), n2 = this._moddle.create("bpmndi:BPMNDiagram", { plane: t2 });
        return t2.$parent = n2, t2.bpmnElement = e2, n2.$parent = this._definitions, this._definitions.diagrams.push(n2), n2;
      }, Jt.$inject = ["eventBus", "moddle"];
      var en = 250;
      function tn(e2, t2, n2, i2, r2) {
        Vt.call(this, t2), this._canvas = e2, this._eventBus = t2, this._elementRegistry = n2, this._overlays = i2, this._translate = r2;
        var o2 = this;
        this.executed("shape.toggleCollapse", en, (function(e3) {
          var t3 = e3.shape;
          o2._canDrillDown(t3) ? o2._addOverlay(t3) : o2._removeOverlay(t3);
        }), true), this.reverted("shape.toggleCollapse", en, (function(e3) {
          var t3 = e3.shape;
          o2._canDrillDown(t3) ? o2._addOverlay(t3) : o2._removeOverlay(t3);
        }), true), this.executed(["shape.create", "shape.move", "shape.delete"], en, (function(e3) {
          var t3 = e3.oldParent, n3 = e3.newParent || e3.parent, i3 = e3.shape;
          o2._canDrillDown(i3) && o2._addOverlay(i3), o2._updateDrilldownOverlay(t3), o2._updateDrilldownOverlay(n3), o2._updateDrilldownOverlay(i3);
        }), true), this.reverted(["shape.create", "shape.move", "shape.delete"], en, (function(e3) {
          var t3 = e3.oldParent, n3 = e3.newParent || e3.parent, i3 = e3.shape;
          o2._canDrillDown(i3) && o2._addOverlay(i3), o2._updateDrilldownOverlay(t3), o2._updateDrilldownOverlay(n3), o2._updateDrilldownOverlay(i3);
        }), true), t2.on("import.render.complete", (function() {
          n2.filter((function(e3) {
            return o2._canDrillDown(e3);
          })).map((function(e3) {
            o2._addOverlay(e3);
          }));
        }));
      }
      e(tn, Vt), tn.prototype._updateDrilldownOverlay = function(e2) {
        var t2 = this._canvas;
        if (e2) {
          var n2 = t2.findRoot(e2);
          n2 && this._updateOverlayVisibility(n2);
        }
      }, tn.prototype._canDrillDown = function(e2) {
        var t2 = this._canvas;
        return R(e2, "bpmn:SubProcess") && t2.findRoot(Kt(e2));
      }, tn.prototype._updateOverlayVisibility = function(e2) {
        var t2 = this._overlays, n2 = k(e2), i2 = t2.get({ element: n2.id, type: "drilldown" })[0];
        if (i2) {
          var r2 = n2 && n2.get("flowElements") && n2.get("flowElements").length;
          Ne(i2.html).toggle("bjs-drilldown-empty", !r2);
        }
      }, tn.prototype._addOverlay = function(e2) {
        var t2 = this._canvas, n2 = this._overlays, i2 = k(e2);
        n2.get({ element: e2, type: "drilldown" }).length && this._removeOverlay(e2);
        var r2 = qe('<button type="button" class="bjs-drilldown"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.81801948,3.50735931 L10.4996894,9.1896894 L10.5,4 L12,4 L12,12 L4,12 L4,10.5 L9.6896894,10.4996894 L3.75735931,4.56801948 C3.46446609,4.27512627 3.46446609,3.80025253 3.75735931,3.50735931 C4.05025253,3.21446609 4.52512627,3.21446609 4.81801948,3.50735931 Z"/></svg></button>'), o2 = i2.get("name") || i2.get("id"), a2 = this._translate("Open {element}", { element: o2 });
        r2.setAttribute("title", a2), r2.addEventListener("click", (function() {
          t2.setRootElement(t2.findRoot(Kt(e2)));
        })), n2.add(e2, "drilldown", { position: { bottom: -7, right: -8 }, html: r2 }), this._updateOverlayVisibility(e2);
      }, tn.prototype._removeOverlay = function(e2) {
        this._overlays.remove({ element: e2, type: "drilldown" });
      }, tn.$inject = ["canvas", "eventBus", "elementRegistry", "overlays", "translate"];
      var nn = { __depends__: [It, Ft, zt], __init__: ["drilldownBreadcrumbs", "drilldownOverlayBehavior", "drilldownCentering", "subprocessCompatibility"], drilldownBreadcrumbs: ["type", Ut], drilldownCentering: ["type", qt], drilldownOverlayBehavior: ["type", tn], subprocessCompatibility: ["type", Jt] };
      function rn(e2, t2) {
        this._eventBus = e2, this.offset = 5;
        var n2 = t2.cls("djs-outline", ["no-fill"]), i2 = this;
        function r2(e3) {
          var t3 = q("rect");
          return W(t3, E({ x: 0, y: 0, rx: 4, width: 100, height: 100 }, n2)), t3;
        }
        e2.on(["shape.added", "shape.changed"], 500, (function(e3) {
          var t3 = e3.element, n3 = e3.gfx, o2 = Ye(".djs-outline", n3);
          o2 || I(n3, o2 = i2.getOutline(t3) || r2()), i2.updateShapeOutline(o2, t3);
        })), e2.on(["connection.added", "connection.changed"], (function(e3) {
          var t3 = e3.element, n3 = e3.gfx, o2 = Ye(".djs-outline", n3);
          o2 || I(n3, o2 = r2()), i2.updateConnectionOutline(o2, t3);
        }));
      }
      rn.prototype.updateShapeOutline = function(e2, t2) {
        var n2 = false, i2 = this._getProviders();
        i2.length && f(i2, (function(i3) {
          n2 = n2 || i3.updateOutline(t2, e2);
        })), n2 || W(e2, { x: -this.offset, y: -this.offset, width: t2.width + 2 * this.offset, height: t2.height + 2 * this.offset });
      }, rn.prototype.updateConnectionOutline = function(e2, t2) {
        var n2 = Ct(t2);
        W(e2, { x: n2.x - this.offset, y: n2.y - this.offset, width: n2.width + 2 * this.offset, height: n2.height + 2 * this.offset });
      }, rn.prototype.registerProvider = function(e2, t2) {
        t2 || (t2 = e2, e2 = 1e3), this._eventBus.on("outline.getProviders", e2, (function(e3) {
          e3.providers.push(t2);
        }));
      }, rn.prototype._getProviders = function() {
        var e2 = this._eventBus.createEvent({ type: "outline.getProviders", providers: [] });
        return this._eventBus.fire(e2), e2.providers;
      }, rn.prototype.getOutline = function(e2) {
        var t2;
        return f(this._getProviders(), (function(n2) {
          l(n2.getOutline) && (t2 = t2 || n2.getOutline(e2));
        })), t2;
      }, rn.$inject = ["eventBus", "styles", "elementRegistry"];
      var on = { __init__: ["outline"], outline: ["type", rn] };
      const an = { width: 36, height: 50 }, sn = { width: 50, height: 50 };
      function ln(e2, t2, n2) {
        return q("path", { d: e2, strokeWidth: 2, transform: `translate(${t2.x}, ${t2.y})`, ...n2 });
      }
      function pn(e2, t2) {
        this._styles = t2, e2.registerProvider(this);
      }
      function cn(e2, t2) {
        var n2;
        return "bpmn:DataObjectReference" === t2 ? n2 = an : "bpmn:DataStoreReference" === t2 && (n2 = sn), e2.width === n2.width && e2.height === n2.height;
      }
      pn.$inject = ["outline", "styles"], pn.prototype.getOutline = function(e2) {
        const t2 = this._styles.cls("djs-outline", ["no-fill"]);
        var n2;
        if (!O(e2)) return R(e2, "bpmn:Gateway") ? (E((n2 = q("rect")).style, { "transform-box": "fill-box", transform: "rotate(45deg)", "transform-origin": "center" }), W(n2, E({ x: 2, y: 2, rx: 4, width: e2.width - 4, height: e2.height - 4 }, t2))) : S(e2, ["bpmn:Task", "bpmn:SubProcess", "bpmn:Group", "bpmn:CallActivity"]) ? W(n2 = q("rect"), E({ x: -5, y: -5, rx: 14, width: e2.width + 10, height: e2.height + 10 }, t2)) : R(e2, "bpmn:EndEvent") ? W(n2 = q("circle"), E({ cx: e2.width / 2, cy: e2.height / 2, r: e2.width / 2 + 5 + 1 }, t2)) : R(e2, "bpmn:Event") ? W(n2 = q("circle"), E({ cx: e2.width / 2, cy: e2.height / 2, r: e2.width / 2 + 5 }, t2)) : R(e2, "bpmn:DataObjectReference") && cn(e2, "bpmn:DataObjectReference") ? n2 = ln("M44.7648 11.3263L36.9892 2.64074C36.0451 1.58628 34.5651 0.988708 33.1904 0.988708H5.98667C3.22688 0.988708 0.989624 3.34892 0.989624 6.26039V55.0235C0.989624 57.9349 3.22688 60.2952 5.98667 60.2952H40.966C43.7257 60.2952 45.963 57.9349 45.963 55.0235V14.9459C45.963 13.5998 45.6407 12.3048 44.7648 11.3263Z", { x: -6, y: -6 }, t2) : R(e2, "bpmn:DataStoreReference") && cn(e2, "bpmn:DataStoreReference") && (n2 = ln("M1.03845 48.1347C1.03845 49.3511 1.07295 50.758 1.38342 52.064C1.69949 53.3938 2.32428 54.7154 3.56383 55.6428C6.02533 57.4841 10.1161 58.7685 14.8212 59.6067C19.5772 60.4538 25.1388 60.8738 30.6831 60.8738C36.2276 60.8738 41.7891 60.4538 46.545 59.6067C51.2504 58.7687 55.3412 57.4842 57.8028 55.6429C59.0424 54.7156 59.6673 53.3938 59.9834 52.064C60.2938 50.7579 60.3285 49.351 60.3285 48.1344V13.8415C60.3285 12.6249 60.2938 11.218 59.9834 9.91171C59.6673 8.58194 59.0423 7.2602 57.8027 6.33294C55.341 4.49168 51.2503 3.20723 46.545 2.36914C41.7891 1.522 36.2276 1.10204 30.6831 1.10205C25.1388 1.10206 19.5772 1.52206 14.8213 2.36923C10.1162 3.20734 6.02543 4.49183 3.5639 6.33314C2.32433 7.26038 1.69951 8.58206 1.38343 9.91181C1.07295 11.2179 1.03845 12.6247 1.03845 13.8411V48.1347Z", { x: -6, y: -6 }, t2)), n2;
      }, pn.prototype.updateOutline = function(e2, t2) {
        if (!O(e2)) return S(e2, ["bpmn:SubProcess", "bpmn:Group"]) ? (W(t2, { width: e2.width + 10, height: e2.height + 10 }), true) : !!S(e2, ["bpmn:Event", "bpmn:Gateway", "bpmn:DataStoreReference", "bpmn:DataObjectReference"]);
      };
      var un = { __depends__: [on], __init__: ["outlineProvider"], outlineProvider: ["type", pn] };
      function hn(e2) {
        return e2.originalEvent || e2.srcEvent;
      }
      function fn(e2, t2) {
        return (hn(e2) || e2).button === t2;
      }
      function mn(e2) {
        return fn(e2, 0);
      }
      function dn(e2) {
        return true;
      }
      function yn(e2) {
        return mn(e2) || (function(e3) {
          return fn(e3, 1);
        })(e2);
      }
      function gn(e2, t2, n2) {
        var i2 = this;
        function r2(n3, i3, r3) {
          var o3, a3;
          (function(e3, t3) {
            var n4 = l2[e3] || mn;
            return !n4(t3);
          })(n3, i3) || (r3 ? a3 = t2.getGraphics(r3) : (o3 = i3.delegateTarget || i3.target) && (a3 = o3, r3 = t2.get(a3)), a3 && r3 && false === e2.fire(n3, { element: r3, gfx: a3, originalEvent: i3 }) && (i3.stopPropagation(), i3.preventDefault()));
        }
        var o2 = {};
        function a2(e3) {
          return o2[e3];
        }
        var s2 = { click: "element.click", contextmenu: "element.contextmenu", dblclick: "element.dblclick", mousedown: "element.mousedown", mousemove: "element.mousemove", mouseover: "element.hover", mouseout: "element.out", mouseup: "element.mouseup" }, l2 = { "element.contextmenu": dn, "element.mousedown": yn, "element.mouseup": yn, "element.click": yn, "element.dblclick": yn };
        var p2 = "svg, .djs-element";
        function c2(e3, t3, n3, i3) {
          var a3 = o2[n3] = function(e4) {
            r2(n3, e4);
          };
          i3 && (l2[n3] = i3), a3.$delegate = Ge.bind(e3, p2, t3, a3);
        }
        function u2(e3, t3, n3) {
          var i3 = a2(n3);
          i3 && Ge.unbind(e3, t3, i3.$delegate);
        }
        e2.on("canvas.destroy", (function(e3) {
          var t3;
          t3 = e3.svg, f(s2, (function(e4, n3) {
            u2(t3, n3, e4);
          }));
        })), e2.on("canvas.init", (function(e3) {
          var t3;
          t3 = e3.svg, f(s2, (function(e4, n3) {
            c2(t3, n3, e4);
          }));
        })), e2.on(["shape.added", "connection.added"], (function(t3) {
          var n3 = t3.element, i3 = t3.gfx;
          e2.fire("interactionEvents.createHit", { element: n3, gfx: i3 });
        })), e2.on(["shape.changed", "connection.changed"], 500, (function(t3) {
          var n3 = t3.element, i3 = t3.gfx;
          e2.fire("interactionEvents.updateHit", { element: n3, gfx: i3 });
        })), e2.on("interactionEvents.createHit", 500, (function(e3) {
          var t3 = e3.element, n3 = e3.gfx;
          i2.createDefaultHit(t3, n3);
        })), e2.on("interactionEvents.updateHit", (function(e3) {
          var t3 = e3.element, n3 = e3.gfx;
          i2.updateDefaultHit(t3, n3);
        }));
        var h2 = y2("djs-hit djs-hit-stroke"), m2 = y2("djs-hit djs-hit-click-stroke"), d2 = { all: y2("djs-hit djs-hit-all"), "click-stroke": m2, stroke: h2, "no-move": y2("djs-hit djs-hit-no-move") };
        function y2(e3, t3) {
          return t3 = E({ stroke: "white", strokeWidth: 15 }, t3 || {}), n2.cls(e3, ["no-fill", "no-border"], t3);
        }
        function g2(e3, t3) {
          var n3 = d2[t3];
          if (!n3) throw new Error("invalid hit type <" + t3 + ">");
          return W(e3, n3), e3;
        }
        function v2(e3, t3) {
          I(e3, t3);
        }
        this.removeHits = function(e3) {
          var t3;
          f((t3 = ".djs-hit", (e3 || document).querySelectorAll(t3)), oe);
        }, this.createDefaultHit = function(e3, t3) {
          var n3, i3 = e3.waypoints, r3 = e3.isFrame;
          return i3 ? this.createWaypointsHit(t3, i3) : (n3 = r3 ? "stroke" : "all", this.createBoxHit(t3, n3, { width: e3.width, height: e3.height }));
        }, this.createWaypointsHit = function(e3, t3) {
          var n3 = fe(t3);
          return g2(n3, "stroke"), v2(e3, n3), n3;
        }, this.createBoxHit = function(e3, t3, n3) {
          n3 = E({ x: 0, y: 0 }, n3);
          var i3 = q("rect");
          return g2(i3, t3), W(i3, n3), v2(e3, i3), i3;
        }, this.updateDefaultHit = function(e3, t3) {
          var n3 = Ye(".djs-hit", t3);
          if (n3) return e3.waypoints ? me(n3, e3.waypoints) : W(n3, { width: e3.width, height: e3.height }), n3;
        }, this.fire = r2, this.triggerMouseEvent = function(e3, t3, n3) {
          var i3 = s2[e3];
          if (!i3) throw new Error("unmapped DOM event name <" + e3 + ">");
          return r2(i3, t3, n3);
        }, this.mouseHandler = a2, this.registerEvent = c2, this.unregisterEvent = u2;
      }
      gn.$inject = ["eventBus", "elementRegistry", "styles"];
      var vn = { __init__: ["interactionEvents"], interactionEvents: ["type", gn] };
      function xn(e2, t2) {
        this._eventBus = e2, this._canvas = t2, this._selectedElements = [];
        var n2 = this;
        e2.on(["shape.remove", "connection.remove"], (function(e3) {
          var t3 = e3.element;
          n2.deselect(t3);
        })), e2.on(["diagram.clear", "root.set"], (function(e3) {
          n2.select(null);
        }));
      }
      xn.$inject = ["eventBus", "canvas"], xn.prototype.deselect = function(e2) {
        var t2 = this._selectedElements, n2 = t2.indexOf(e2);
        if (-1 !== n2) {
          var i2 = t2.slice();
          t2.splice(n2, 1), this._eventBus.fire("selection.changed", { oldSelection: i2, newSelection: t2 });
        }
      }, xn.prototype.get = function() {
        return this._selectedElements;
      }, xn.prototype.isSelected = function(e2) {
        return -1 !== this._selectedElements.indexOf(e2);
      }, xn.prototype.select = function(e2, t2) {
        var n2 = this._selectedElements, i2 = n2.slice();
        o(e2) || (e2 = e2 ? [e2] : []);
        var r2 = this._canvas, a2 = r2.getRootElement();
        e2 = e2.filter((function(e3) {
          var t3 = r2.findRoot(e3);
          return a2 === t3;
        })), t2 ? f(e2, (function(e3) {
          -1 === n2.indexOf(e3) && n2.push(e3);
        })) : this._selectedElements = n2 = e2.slice(), this._eventBus.fire("selection.changed", { oldSelection: i2, newSelection: n2 });
      };
      var wn = "hover", bn = "selected";
      function En(e2, t2, n2) {
        this._canvas = e2;
        var i2 = this;
        function r2(t3, n3) {
          e2.addMarker(t3, n3);
        }
        function o2(t3, n3) {
          e2.removeMarker(t3, n3);
        }
        this._multiSelectionBox = null, t2.on("element.hover", (function(e3) {
          r2(e3.element, wn);
        })), t2.on("element.out", (function(e3) {
          o2(e3.element, wn);
        })), t2.on("selection.changed", (function(e3) {
          var t3 = e3.oldSelection, n3 = e3.newSelection;
          f(t3, (function(e4) {
            -1 === n3.indexOf(e4) && o2(e4, bn);
          })), f(n3, (function(e4) {
            -1 === t3.indexOf(e4) && r2(e4, bn);
          })), i2._updateSelectionOutline(n3);
        })), t2.on("element.changed", (function(e3) {
          n2.isSelected(e3.element) && i2._updateSelectionOutline(n2.get());
        }));
      }
      function _n(e2, t2, n2, i2) {
        e2.on("create.end", 500, (function(e3) {
          var n3 = e3.context, i3 = n3.canExecute, r2 = n3.elements, a2 = (n3.hints || {}).autoSelect;
          if (i3) {
            if (false === a2) return;
            o(a2) ? t2.select(a2) : t2.select(r2.filter(An));
          }
        })), e2.on("connect.end", 500, (function(e3) {
          var n3 = e3.context.connection;
          n3 && t2.select(n3);
        })), e2.on("shape.move.end", 500, (function(e3) {
          var n3 = e3.previousSelection || [], r2 = i2.get(e3.context.shape.id);
          u(n3, (function(e4) {
            return r2.id === e4.id;
          })) || t2.select(r2);
        })), e2.on("element.click", (function(e3) {
          if (mn(e3)) {
            var i3 = e3.element;
            i3 === n2.getRootElement() && (i3 = null);
            var r2 = t2.isSelected(i3), o2 = t2.get().length > 1, a2 = (function(e4) {
              var t3 = hn(e4) || e4;
              return mn(e4) && t3.shiftKey;
            })(e3);
            if (r2 && o2) return a2 ? t2.deselect(i3) : t2.select(i3);
            r2 ? t2.deselect(i3) : t2.select(i3, a2);
          }
        }));
      }
      function An(e2) {
        return !e2.hidden;
      }
      En.$inject = ["canvas", "eventBus", "selection"], En.prototype._updateSelectionOutline = function(e2) {
        var t2 = this._canvas.getLayer("selectionOutline");
        !(function(e3) {
          for (var t3; t3 = e3.firstChild; ) e3.removeChild(t3);
        })(t2);
        var n2 = e2.length > 1;
        if (z(this._canvas.getContainer())[n2 ? "add" : "remove"]("djs-multi-select"), n2) {
          var i2 = (function(e3) {
            return { x: e3.x - 6, y: e3.y - 6, width: e3.width + 12, height: e3.height + 12 };
          })(Ct(e2)), r2 = q("rect");
          W(r2, E({ rx: 3 }, i2)), z(r2).add("djs-selection-outline"), I(t2, r2);
        }
      }, _n.$inject = ["eventBus", "selection", "canvas", "elementRegistry"];
      var Rn = { __init__: ["selectionVisuals", "selectionBehavior"], __depends__: [vn, on], selection: ["type", xn], selectionVisuals: ["type", En], selectionBehavior: ["type", _n] };
      const Sn = /^class[ {]/;
      function kn(e2) {
        return Array.isArray(e2);
      }
      function Cn(e2, t2) {
        return Object.prototype.hasOwnProperty.call(e2, t2);
      }
      function Mn(...e2) {
        1 === e2.length && kn(e2[0]) && (e2 = e2[0]);
        const t2 = (e2 = [...e2]).pop();
        return t2.$inject = e2, t2;
      }
      const Pn = /constructor\s*[^(]*\(\s*([^)]*)\)/m, On = /^(?:async\s+)?(?:function\s*[^(]*)?(?:\(\s*([^)]*)\)|(\w+))/m, Tn = /\/\*([^*]*)\*\//m;
      function Nn(e2) {
        if ("function" != typeof e2) throw new Error(`Cannot annotate "${e2}". Expected a function!`);
        const t2 = e2.toString().match((function(e3) {
          return Sn.test(e3.toString());
        })(e2) ? Pn : On);
        if (!t2) return [];
        const n2 = t2[1] || t2[2];
        return n2 && n2.split(",").map(((e3) => {
          const t3 = e3.match(Tn);
          return (t3 && t3[1] || e3).trim();
        })) || [];
      }
      function Dn(e2, t2) {
        const n2 = t2 || { get: function(e3, t3) {
          if (i2.push(e3), false === t3) return null;
          throw s2(`No provider for "${e3}"!`);
        } }, i2 = [], r2 = this._providers = Object.create(n2._providers || null), o2 = this._instances = /* @__PURE__ */ Object.create(null), a2 = o2.injector = this, s2 = function(e3) {
          const t3 = i2.join(" -> ");
          return i2.length = 0, new Error(t3 ? `${e3} (Resolving: ${t3})` : e3);
        };
        function l2(e3, t3) {
          if (!r2[e3] && e3.includes(".")) {
            const t4 = e3.split(".");
            let n3 = l2(t4.shift());
            for (; t4.length; ) n3 = n3[t4.shift()];
            return n3;
          }
          if (Cn(o2, e3)) return o2[e3];
          if (Cn(r2, e3)) {
            if (-1 !== i2.indexOf(e3)) throw i2.push(e3), s2("Cannot resolve circular dependency!");
            return i2.push(e3), o2[e3] = r2[e3][0](r2[e3][1]), i2.pop(), o2[e3];
          }
          return n2.get(e3, t3);
        }
        function p2(e3, t3) {
          if (void 0 === t3 && (t3 = {}), "function" != typeof e3) {
            if (!kn(e3)) throw s2(`Cannot invoke "${e3}". Expected a function!`);
            e3 = Mn(e3.slice());
          }
          return { fn: e3, dependencies: (e3.$inject || Nn(e3)).map(((e4) => Cn(t3, e4) ? t3[e4] : l2(e4))) };
        }
        function c2(e3) {
          const { fn: t3, dependencies: n3 } = p2(e3);
          return new (Function.prototype.bind.call(t3, null, ...n3))();
        }
        function u2(e3, t3, n3) {
          const { fn: i3, dependencies: r3 } = p2(e3, n3);
          return i3.apply(t3, r3);
        }
        function h2(e3) {
          return Mn(((t3) => e3.get(t3)));
        }
        function f2(e3, t3) {
          if (t3 && t3.length) {
            const n3 = /* @__PURE__ */ Object.create(null), i3 = /* @__PURE__ */ Object.create(null), o3 = [], a3 = [], s3 = [];
            let l3, p3, c3, u3;
            for (let e4 in r2) l3 = r2[e4], -1 !== t3.indexOf(e4) && ("private" === l3[2] ? (p3 = o3.indexOf(l3[3]), -1 === p3 ? (c3 = l3[3].createChild([], t3), u3 = h2(c3), o3.push(l3[3]), a3.push(c3), s3.push(u3), n3[e4] = [u3, e4, "private", c3]) : n3[e4] = [s3[p3], e4, "private", a3[p3]]) : n3[e4] = [l3[2], l3[1]], i3[e4] = true), "factory" !== l3[2] && "type" !== l3[2] || !l3[1].$scope || t3.forEach(((t4) => {
              -1 !== l3[1].$scope.indexOf(t4) && (n3[e4] = [l3[2], l3[1]], i3[t4] = true);
            }));
            t3.forEach(((e4) => {
              if (!i3[e4]) throw new Error('No provider for "' + e4 + '". Cannot use provider from the parent!');
            })), e3.unshift(n3);
          }
          return new Dn(e3, a2);
        }
        const m2 = { factory: u2, type: c2, value: function(e3) {
          return e3;
        } };
        function d2(e3, t3) {
          const n3 = e3.__init__ || [];
          return function() {
            n3.forEach(((e4) => {
              "string" == typeof e4 ? t3.get(e4) : t3.invoke(e4);
            }));
          };
        }
        function y2(e3) {
          const t3 = e3.__exports__;
          if (t3) {
            const n3 = e3.__modules__, i3 = Object.keys(e3).reduce(((t4, n4) => ("__exports__" !== n4 && "__modules__" !== n4 && "__init__" !== n4 && "__depends__" !== n4 && (t4[n4] = e3[n4]), t4)), /* @__PURE__ */ Object.create(null)), o3 = f2((n3 || []).concat(i3)), a3 = Mn((function(e4) {
              return o3.get(e4);
            }));
            t3.forEach((function(e4) {
              r2[e4] = [a3, e4, "private", o3];
            }));
            const s3 = (e3.__init__ || []).slice();
            return s3.unshift((function() {
              o3.init();
            })), d2(e3 = Object.assign({}, e3, { __init__: s3 }), o3);
          }
          return Object.keys(e3).forEach((function(t4) {
            if ("__init__" === t4 || "__depends__" === t4) return;
            const n3 = e3[t4];
            if ("private" === n3[2]) return void (r2[t4] = n3);
            const i3 = n3[0], o3 = n3[1];
            r2[t4] = [m2[i3], Bn(i3, o3), i3];
          })), d2(e3, a2);
        }
        function g2(e3, t3) {
          return -1 !== e3.indexOf(t3) || -1 !== (e3 = (t3.__depends__ || []).reduce(g2, e3)).indexOf(t3) ? e3 : e3.concat(t3);
        }
        this.get = l2, this.invoke = u2, this.instantiate = c2, this.createChild = f2, this.init = (function(e3) {
          const t3 = e3.reduce(g2, []).map(y2);
          let n3 = false;
          return function() {
            n3 || (n3 = true, t3.forEach(((e4) => e4())));
          };
        })(e2);
      }
      function Bn(e2, t2) {
        return "value" !== e2 && kn(t2) && (t2 = Mn(t2.slice())), t2;
      }
      function Ln(e2, t2) {
        A.call(this, e2, 1), this.CONNECTION_STYLE = t2.style(["no-fill"], { strokeWidth: 5, stroke: "fuchsia" }), this.SHAPE_STYLE = t2.style({ fill: "white", stroke: "fuchsia", strokeWidth: 2 }), this.FRAME_STYLE = t2.style(["no-fill"], { stroke: "fuchsia", strokeDasharray: 4, strokeWidth: 2 });
      }
      e(Ln, A), Ln.prototype.canRender = function() {
        return true;
      }, Ln.prototype.drawShape = function(e2, t2, n2) {
        var i2 = q("rect");
        return W(i2, { x: 0, y: 0, width: t2.width || 0, height: t2.height || 0 }), Pt(t2) ? W(i2, E({}, this.FRAME_STYLE, n2 || {})) : W(i2, E({}, this.SHAPE_STYLE, n2 || {})), I(e2, i2), i2;
      }, Ln.prototype.drawConnection = function(e2, t2, n2) {
        var i2 = fe(t2.waypoints, E({}, this.CONNECTION_STYLE, n2 || {}));
        return I(e2, i2), i2;
      }, Ln.prototype.getShapePath = function(e2) {
        var t2 = e2.x, n2 = e2.y, i2 = e2.width;
        return le([["M", t2, n2], ["l", i2, 0], ["l", 0, e2.height], ["l", -i2, 0], ["z"]]);
      }, Ln.prototype.getConnectionPath = function(e2) {
        var t2, n2, i2 = e2.waypoints, r2 = [];
        for (t2 = 0; n2 = i2[t2]; t2++) n2 = n2.original || n2, r2.push([0 === t2 ? "M" : "L", n2.x, n2.y]);
        return le(r2);
      }, Ln.$inject = ["eventBus", "styles"];
      var In = { __init__: ["defaultRenderer"], defaultRenderer: ["type", Ln], styles: ["type", function() {
        var e2 = { "no-fill": { fill: "none" }, "no-border": { strokeOpacity: 0 }, "no-events": { pointerEvents: "none" } }, t2 = this;
        this.cls = function(e3, t3, n2) {
          return E(this.style(t3, n2), { class: e3 });
        }, this.style = function(t3, n2) {
          o(t3) || n2 || (n2 = t3, t3 = []);
          var i2 = m(t3, (function(t4, n3) {
            return E(t4, e2[n3] || {});
          }), {});
          return n2 ? E(i2, n2) : i2;
        }, this.computeStyle = function(e3, n2, i2) {
          return o(n2) || (i2 = n2, n2 = []), t2.style(n2 || [], E({}, i2, e3 || {}));
        };
      }] };
      function jn(e2, t2) {
        return Math.round(e2 * t2) / t2;
      }
      function Fn(e2) {
        return s(e2) ? e2 + "px" : e2;
      }
      function Vn(e2, t2, n2) {
        const i2 = q("g");
        z(i2).add(t2);
        const r2 = void 0 !== n2 ? n2 : e2.childNodes.length - 1;
        return e2.insertBefore(i2, e2.childNodes[r2] || null), i2;
      }
      const Wn = { shape: ["x", "y", "width", "height"], connection: ["waypoints"] };
      function $n(e2, t2, n2, i2) {
        this._eventBus = t2, this._elementRegistry = i2, this._graphicsFactory = n2, this._rootsIdx = 0, this._layers = {}, this._planes = [], this._rootElement = null, this._init(e2 || {});
      }
      function zn(e2, t2) {
        const n2 = "matrix(" + t2.a + "," + t2.b + "," + t2.c + "," + t2.d + "," + t2.e + "," + t2.f + ")";
        e2.setAttribute("transform", n2);
      }
      $n.$inject = ["config.canvas", "eventBus", "graphicsFactory", "elementRegistry"], $n.prototype._init = function(e2) {
        const t2 = this._eventBus, n2 = this._container = (function(e3) {
          const t3 = (e3 = E({}, { width: "100%", height: "100%" }, e3)).container || document.body, n3 = document.createElement("div");
          return n3.setAttribute("class", "djs-container djs-parent"), Oe(n3, { position: "relative", overflow: "hidden", width: Fn(e3.width), height: Fn(e3.height) }), t3.appendChild(n3), n3;
        })(e2), i2 = this._svg = q("svg");
        W(i2, { width: "100%", height: "100%" }), I(n2, i2);
        const r2 = this._viewport = Vn(i2, "viewport");
        e2.deferUpdate && (this._viewboxChanged = (function(e3, t3) {
          let n3, i3, r3, o2;
          function a2(n4) {
            let a3 = Date.now(), p3 = n4 ? 0 : o2 + t3 - a3;
            if (p3 > 0) return s2(p3);
            e3.apply(r3, i3), l2();
          }
          function s2(e4) {
            n3 = setTimeout(a2, e4);
          }
          function l2() {
            n3 && clearTimeout(n3), n3 = o2 = i3 = r3 = void 0;
          }
          function p2(...e4) {
            o2 = Date.now(), i3 = e4, r3 = this, n3 || s2(t3);
          }
          return p2.flush = function() {
            n3 && a2(true), l2();
          }, p2.cancel = l2, p2;
        })(b(this._viewboxChanged, this), 300)), t2.on("diagram.init", (() => {
          t2.fire("canvas.init", { svg: i2, viewport: r2 });
        })), t2.on(["shape.added", "connection.added", "shape.removed", "connection.removed", "elements.changed", "root.set"], (() => {
          delete this._cachedViewbox;
        })), t2.on("diagram.destroy", 500, this._destroy, this), t2.on("diagram.clear", 500, this._clear, this);
      }, $n.prototype._destroy = function() {
        this._eventBus.fire("canvas.destroy", { svg: this._svg, viewport: this._viewport });
        const e2 = this._container.parentNode;
        e2 && e2.removeChild(this._container), delete this._svg, delete this._container, delete this._layers, delete this._planes, delete this._rootElement, delete this._viewport;
      }, $n.prototype._clear = function() {
        this._elementRegistry.getAll().forEach(((e2) => {
          const t2 = Mt(e2);
          "root" === t2 ? this.removeRootElement(e2) : this._removeElement(e2, t2);
        })), this._planes = [], this._rootElement = null, delete this._cachedViewbox;
      }, $n.prototype.getDefaultLayer = function() {
        return this.getLayer("base", 0);
      }, $n.prototype.getLayer = function(e2, t2) {
        if (!e2) throw new Error("must specify a name");
        let n2 = this._layers[e2];
        if (n2 || (n2 = this._layers[e2] = this._createLayer(e2, t2)), void 0 !== t2 && n2.index !== t2) throw new Error("layer <" + e2 + "> already created at index <" + t2 + ">");
        return n2.group;
      }, $n.prototype._getChildIndex = function(e2) {
        return m(this._layers, (function(t2, n2) {
          return n2.visible && e2 >= n2.index && t2++, t2;
        }), 0);
      }, $n.prototype._createLayer = function(e2, t2) {
        void 0 === t2 && (t2 = 1);
        const n2 = this._getChildIndex(t2);
        return { group: Vn(this._viewport, "layer-" + e2, n2), index: t2, visible: true };
      }, $n.prototype.showLayer = function(e2) {
        if (!e2) throw new Error("must specify a name");
        const t2 = this._layers[e2];
        if (!t2) throw new Error("layer <" + e2 + "> does not exist");
        const n2 = this._viewport, i2 = t2.group, r2 = t2.index;
        if (t2.visible) return i2;
        const o2 = this._getChildIndex(r2);
        return n2.insertBefore(i2, n2.childNodes[o2] || null), t2.visible = true, i2;
      }, $n.prototype.hideLayer = function(e2) {
        if (!e2) throw new Error("must specify a name");
        const t2 = this._layers[e2];
        if (!t2) throw new Error("layer <" + e2 + "> does not exist");
        const n2 = t2.group;
        return t2.visible ? (oe(n2), t2.visible = false, n2) : n2;
      }, $n.prototype._removeLayer = function(e2) {
        const t2 = this._layers[e2];
        t2 && (delete this._layers[e2], oe(t2.group));
      }, $n.prototype.getActiveLayer = function() {
        const e2 = this._findPlaneForRoot(this.getRootElement());
        return e2 ? e2.layer : null;
      }, $n.prototype.findRoot = function(e2) {
        if ("string" == typeof e2 && (e2 = this._elementRegistry.get(e2)), !e2) return;
        const t2 = this._findPlaneForRoot((function(e3) {
          for (; e3.parent; ) e3 = e3.parent;
          return e3;
        })(e2)) || {};
        return t2.rootElement;
      }, $n.prototype.getRootElements = function() {
        return this._planes.map((function(e2) {
          return e2.rootElement;
        }));
      }, $n.prototype._findPlaneForRoot = function(e2) {
        return u(this._planes, (function(t2) {
          return t2.rootElement === e2;
        }));
      }, $n.prototype.getContainer = function() {
        return this._container;
      }, $n.prototype._updateMarker = function(e2, t2, n2) {
        let i2;
        e2.id || (e2 = this._elementRegistry.get(e2)), e2.markers = e2.markers || /* @__PURE__ */ new Set(), i2 = this._elementRegistry._elements[e2.id], i2 && (f([i2.gfx, i2.secondaryGfx], (function(i3) {
          i3 && (n2 ? (e2.markers.add(t2), z(i3).add(t2)) : (e2.markers.delete(t2), z(i3).remove(t2)));
        })), this._eventBus.fire("element.marker.update", { element: e2, gfx: i2.gfx, marker: t2, add: !!n2 }));
      }, $n.prototype.addMarker = function(e2, t2) {
        this._updateMarker(e2, t2, true);
      }, $n.prototype.removeMarker = function(e2, t2) {
        this._updateMarker(e2, t2, false);
      }, $n.prototype.hasMarker = function(e2, t2) {
        return e2.id || (e2 = this._elementRegistry.get(e2)), !!e2.markers && e2.markers.has(t2);
      }, $n.prototype.toggleMarker = function(e2, t2) {
        this.hasMarker(e2, t2) ? this.removeMarker(e2, t2) : this.addMarker(e2, t2);
      }, $n.prototype.getRootElement = function() {
        const e2 = this._rootElement;
        return e2 || this._planes.length ? e2 : this.setRootElement(this.addRootElement(null));
      }, $n.prototype.addRootElement = function(e2) {
        const t2 = this._rootsIdx++;
        e2 || (e2 = { id: "__implicitroot_" + t2, children: [], isImplicit: true });
        const n2 = e2.layer = "root-" + t2;
        this._ensureValid("root", e2);
        const i2 = this.getLayer(n2, 0);
        return this.hideLayer(n2), this._addRoot(e2, i2), this._planes.push({ rootElement: e2, layer: i2 }), e2;
      }, $n.prototype.removeRootElement = function(e2) {
        "string" == typeof e2 && (e2 = this._elementRegistry.get(e2));
        if (this._findPlaneForRoot(e2)) return this._removeRoot(e2), this._removeLayer(e2.layer), this._planes = this._planes.filter((function(t2) {
          return t2.rootElement !== e2;
        })), this._rootElement === e2 && (this._rootElement = null), e2;
      }, $n.prototype.setRootElement = function(e2) {
        if (e2 === this._rootElement) return e2;
        let t2;
        if (!e2) throw new Error("rootElement required");
        return t2 = this._findPlaneForRoot(e2), t2 || (e2 = this.addRootElement(e2)), this._setRoot(e2), e2;
      }, $n.prototype._removeRoot = function(e2) {
        const t2 = this._elementRegistry, n2 = this._eventBus;
        n2.fire("root.remove", { element: e2 }), n2.fire("root.removed", { element: e2 }), t2.remove(e2);
      }, $n.prototype._addRoot = function(e2, t2) {
        const n2 = this._elementRegistry, i2 = this._eventBus;
        i2.fire("root.add", { element: e2 }), n2.add(e2, t2), i2.fire("root.added", { element: e2, gfx: t2 });
      }, $n.prototype._setRoot = function(e2, t2) {
        const n2 = this._rootElement;
        n2 && (this._elementRegistry.updateGraphics(n2, null, true), this.hideLayer(n2.layer)), e2 && (t2 || (t2 = this._findPlaneForRoot(e2).layer), this._elementRegistry.updateGraphics(e2, this._svg, true), this.showLayer(e2.layer)), this._rootElement = e2, this._eventBus.fire("root.set", { element: e2 });
      }, $n.prototype._ensureValid = function(e2, t2) {
        if (!t2.id) throw new Error("element must have an id");
        if (this._elementRegistry.get(t2.id)) throw new Error("element <" + t2.id + "> already exists");
        const n2 = Wn[e2], i2 = d(n2, (function(e3) {
          return void 0 !== t2[e3];
        }));
        if (!i2) throw new Error("must supply { " + n2.join(", ") + " } with " + e2);
      }, $n.prototype._setParent = function(e2, t2, n2) {
        !(function(e3, t3, n3) {
          if (e3 && t3) {
            "number" != typeof n3 && (n3 = -1);
            var i2 = e3.indexOf(t3);
            if (-1 !== i2) {
              if (i2 === n3) return;
              if (-1 === n3) return;
              e3.splice(i2, 1);
            }
            -1 !== n3 ? e3.splice(n3, 0, t3) : e3.push(t3);
          }
        })(t2.children, e2, n2), e2.parent = t2;
      }, $n.prototype._addElement = function(e2, t2, n2, i2) {
        n2 = n2 || this.getRootElement();
        const r2 = this._eventBus, o2 = this._graphicsFactory;
        this._ensureValid(e2, t2), r2.fire(e2 + ".add", { element: t2, parent: n2 }), this._setParent(t2, n2, i2);
        const a2 = o2.create(e2, t2, i2);
        return this._elementRegistry.add(t2, a2), o2.update(e2, t2, a2), r2.fire(e2 + ".added", { element: t2, gfx: a2 }), t2;
      }, $n.prototype.addShape = function(e2, t2, n2) {
        return this._addElement("shape", e2, t2, n2);
      }, $n.prototype.addConnection = function(e2, t2, n2) {
        return this._addElement("connection", e2, t2, n2);
      }, $n.prototype._removeElement = function(e2, t2) {
        const n2 = this._elementRegistry, i2 = this._graphicsFactory, r2 = this._eventBus;
        if (e2 = n2.get(e2.id || e2)) return r2.fire(t2 + ".remove", { element: e2 }), i2.remove(e2), (function(e3, t3) {
          if (!e3 || !t3) return -1;
          var n3 = e3.indexOf(t3);
          -1 !== n3 && e3.splice(n3, 1);
        })(e2.parent && e2.parent.children, e2), e2.parent = null, r2.fire(t2 + ".removed", { element: e2 }), n2.remove(e2), e2;
      }, $n.prototype.removeShape = function(e2) {
        return this._removeElement(e2, "shape");
      }, $n.prototype.removeConnection = function(e2) {
        return this._removeElement(e2, "connection");
      }, $n.prototype.getGraphics = function(e2, t2) {
        return this._elementRegistry.getGraphics(e2, t2);
      }, $n.prototype._changeViewbox = function(e2) {
        this._eventBus.fire("canvas.viewbox.changing"), e2.apply(this), this._cachedViewbox = null, this._viewboxChanged();
      }, $n.prototype._viewboxChanged = function() {
        this._eventBus.fire("canvas.viewbox.changed", { viewbox: this.viewbox() });
      }, $n.prototype.viewbox = function(e2) {
        if (void 0 === e2 && this._cachedViewbox) return this._cachedViewbox;
        const t2 = this._viewport, n2 = this.getSize();
        let i2, r2, o2, a2, s2, l2, p2;
        return e2 ? (this._changeViewbox((function() {
          s2 = Math.min(n2.width / e2.width, n2.height / e2.height);
          const i3 = this._svg.createSVGMatrix().scale(s2).translate(-e2.x, -e2.y);
          se(t2, i3);
        })), e2) : (o2 = this._rootElement ? this.getActiveLayer() : null, i2 = o2 && o2.getBBox() || {}, a2 = se(t2), r2 = a2 ? a2.matrix : (function(e3, t3, n3, i3, r3, o3) {
          var a3 = X().createSVGMatrix();
          switch (arguments.length) {
            case 0:
              return a3;
            case 1:
              return Z(a3, e3);
            case 6:
              return Z(a3, { a: e3, b: t3, c: n3, d: i3, e: r3, f: o3 });
          }
        })(), s2 = jn(r2.a, 1e3), l2 = jn(-r2.e || 0, 1e3), p2 = jn(-r2.f || 0, 1e3), e2 = this._cachedViewbox = { x: l2 ? l2 / s2 : 0, y: p2 ? p2 / s2 : 0, width: n2.width / s2, height: n2.height / s2, scale: s2, inner: { width: i2.width || 0, height: i2.height || 0, x: i2.x || 0, y: i2.y || 0 }, outer: n2 });
      }, $n.prototype.scroll = function(e2) {
        const t2 = this._viewport;
        let n2 = t2.getCTM();
        return e2 && this._changeViewbox((function() {
          e2 = E({ dx: 0, dy: 0 }, e2 || {}), n2 = this._svg.createSVGMatrix().translate(e2.dx, e2.dy).multiply(n2), zn(t2, n2);
        })), { x: n2.e, y: n2.f };
      }, $n.prototype.scrollToElement = function(e2, t2) {
        let n2 = 100;
        "string" == typeof e2 && (e2 = this._elementRegistry.get(e2));
        const i2 = this.findRoot(e2);
        if (i2 !== this.getRootElement() && this.setRootElement(i2), i2 === e2) return;
        t2 || (t2 = {}), "number" == typeof t2 && (n2 = t2), t2 = { top: t2.top || n2, right: t2.right || n2, bottom: t2.bottom || n2, left: t2.left || n2 };
        const r2 = Ct(e2), o2 = vt(r2), a2 = this.viewbox(), s2 = this.zoom();
        let l2, p2;
        a2.y += t2.top / s2, a2.x += t2.left / s2, a2.width -= (t2.right + t2.left) / s2, a2.height -= (t2.bottom + t2.top) / s2;
        const c2 = vt(a2);
        if (r2.width < a2.width && r2.height < a2.height) {
          const e3 = Math.max(0, o2.right - c2.right), t3 = Math.min(0, o2.left - c2.left), n3 = Math.max(0, o2.bottom - c2.bottom), i3 = Math.min(0, o2.top - c2.top);
          l2 = e3 || t3, p2 = n3 || i3;
        } else l2 = r2.x - a2.x, p2 = r2.y - a2.y;
        this.scroll({ dx: -l2 * s2, dy: -p2 * s2 });
      }, $n.prototype.zoom = function(e2, t2) {
        if (!e2) return this.viewbox(e2).scale;
        if ("fit-viewport" === e2) return this._fitViewport(t2);
        let n2, i2;
        return this._changeViewbox((function() {
          "object" != typeof t2 && (n2 = this.viewbox().outer, t2 = { x: n2.width / 2, y: n2.height / 2 }), i2 = this._setZoom(e2, t2);
        })), jn(i2.a, 1e3);
      }, $n.prototype._fitViewport = function(e2) {
        const t2 = this.viewbox(), n2 = t2.outer, i2 = t2.inner;
        let r2, o2;
        return i2.x >= 0 && i2.y >= 0 && i2.x + i2.width <= n2.width && i2.y + i2.height <= n2.height && !e2 ? o2 = { x: 0, y: 0, width: Math.max(i2.width + i2.x, n2.width), height: Math.max(i2.height + i2.y, n2.height) } : (r2 = Math.min(1, n2.width / i2.width, n2.height / i2.height), o2 = { x: i2.x + (e2 ? i2.width / 2 - n2.width / r2 / 2 : 0), y: i2.y + (e2 ? i2.height / 2 - n2.height / r2 / 2 : 0), width: n2.width / r2, height: n2.height / r2 }), this.viewbox(o2), this.viewbox(false).scale;
      }, $n.prototype._setZoom = function(e2, t2) {
        const n2 = this._svg, i2 = this._viewport, r2 = n2.createSVGMatrix(), o2 = n2.createSVGPoint();
        let a2, s2, l2, p2, c2;
        l2 = i2.getCTM();
        const u2 = l2.a;
        return t2 ? (a2 = E(o2, t2), s2 = a2.matrixTransform(l2.inverse()), p2 = r2.translate(s2.x, s2.y).scale(1 / u2 * e2).translate(-s2.x, -s2.y), c2 = l2.multiply(p2)) : c2 = r2.scale(e2), zn(this._viewport, c2), c2;
      }, $n.prototype.getSize = function() {
        return { width: this._container.clientWidth, height: this._container.clientHeight };
      }, $n.prototype.getAbsoluteBBox = function(e2) {
        const t2 = this.viewbox();
        let n2;
        if (e2.waypoints) {
          n2 = this.getGraphics(e2).getBBox();
        } else n2 = e2;
        return { x: n2.x * t2.scale - t2.x * t2.scale, y: n2.y * t2.scale - t2.y * t2.scale, width: n2.width * t2.scale, height: n2.height * t2.scale };
      }, $n.prototype.resized = function() {
        delete this._cachedViewbox, this._eventBus.fire("canvas.resized");
      };
      var Gn = "data-element-id";
      function Hn(e2) {
        this._elements = {}, this._eventBus = e2;
      }
      function Kn(e2, t2, n2) {
        var i2 = (function(e3, t3, n3, i3) {
          var r2 = n3.inverse;
          return Object.defineProperty(e3, "remove", { value: function(e4) {
            var n4 = this.indexOf(e4);
            return -1 !== n4 && (this.splice(n4, 1), t3.unset(e4, r2, i3)), e4;
          } }), Object.defineProperty(e3, "contains", { value: function(e4) {
            return -1 !== this.indexOf(e4);
          } }), Object.defineProperty(e3, "add", { value: function(e4, n4) {
            var o2 = this.indexOf(e4);
            if (void 0 === n4) {
              if (-1 !== o2) return;
              n4 = this.length;
            }
            -1 !== o2 && this.splice(o2, 1), this.splice(n4, 0, e4), -1 === o2 && t3.set(e4, r2, i3);
          } }), Object.defineProperty(e3, "__refs_collection", { value: true }), e3;
        })(n2[t2.name] || [], e2, t2, n2);
        Object.defineProperty(n2, t2.name, { enumerable: t2.enumerable, value: i2 }), i2.length && i2.forEach((function(i3) {
          e2.set(i3, t2.inverse, n2);
        }));
      }
      function Un(e2, t2) {
        if (!(this instanceof Un)) return new Un(e2, t2);
        e2.inverse = t2, t2.inverse = e2, this.props = {}, this.props[e2.name] = e2, this.props[t2.name] = t2;
      }
      Hn.$inject = ["eventBus"], Hn.prototype.add = function(e2, t2, n2) {
        var i2 = e2.id;
        this._validateId(i2), W(t2, Gn, i2), n2 && W(n2, Gn, i2), this._elements[i2] = { element: e2, gfx: t2, secondaryGfx: n2 };
      }, Hn.prototype.remove = function(e2) {
        var t2 = this._elements, n2 = e2.id || e2, i2 = n2 && t2[n2];
        i2 && (W(i2.gfx, Gn, ""), i2.secondaryGfx && W(i2.secondaryGfx, Gn, ""), delete t2[n2]);
      }, Hn.prototype.updateId = function(e2, t2) {
        this._validateId(t2), "string" == typeof e2 && (e2 = this.get(e2)), this._eventBus.fire("element.updateId", { element: e2, newId: t2 });
        var n2 = this.getGraphics(e2), i2 = this.getGraphics(e2, true);
        this.remove(e2), e2.id = t2, this.add(e2, n2, i2);
      }, Hn.prototype.updateGraphics = function(e2, t2, n2) {
        var i2 = e2.id || e2, r2 = this._elements[i2];
        return n2 ? r2.secondaryGfx = t2 : r2.gfx = t2, t2 && W(t2, Gn, i2), t2;
      }, Hn.prototype.get = function(e2) {
        var t2;
        t2 = "string" == typeof e2 ? e2 : e2 && W(e2, Gn);
        var n2 = this._elements[t2];
        return n2 && n2.element;
      }, Hn.prototype.filter = function(e2) {
        var t2 = [];
        return this.forEach((function(n2, i2) {
          e2(n2, i2) && t2.push(n2);
        })), t2;
      }, Hn.prototype.find = function(e2) {
        for (var t2 = this._elements, n2 = Object.keys(t2), i2 = 0; i2 < n2.length; i2++) {
          var r2 = t2[n2[i2]], o2 = r2.element;
          if (e2(o2, r2.gfx)) return o2;
        }
      }, Hn.prototype.getAll = function() {
        return this.filter((function(e2) {
          return e2;
        }));
      }, Hn.prototype.forEach = function(e2) {
        var t2 = this._elements;
        Object.keys(t2).forEach((function(n2) {
          var i2 = t2[n2], r2 = i2.element, o2 = i2.gfx;
          return e2(r2, o2);
        }));
      }, Hn.prototype.getGraphics = function(e2, t2) {
        var n2 = e2.id || e2, i2 = this._elements[n2];
        return i2 && (t2 ? i2.secondaryGfx : i2.gfx);
      }, Hn.prototype._validateId = function(e2) {
        if (!e2) throw new Error("element must have an id");
        if (this._elements[e2]) throw new Error("element with id " + e2 + " already added");
      }, Un.prototype.bind = function(e2, t2) {
        if ("string" == typeof t2) {
          if (!this.props[t2]) throw new Error("no property <" + t2 + "> in ref");
          t2 = this.props[t2];
        }
        t2.collection ? Kn(this, t2, e2) : (function(e3, t3, n2) {
          var i2 = t3.inverse, r2 = n2[t3.name];
          Object.defineProperty(n2, t3.name, { configurable: t3.configurable, enumerable: t3.enumerable, get: function() {
            return r2;
          }, set: function(t4) {
            if (t4 !== r2) {
              var o2 = r2;
              r2 = null, o2 && e3.unset(o2, i2, n2), r2 = t4, e3.set(r2, i2, n2);
            }
          } });
        })(this, t2, e2);
      }, Un.prototype.ensureRefsCollection = function(e2, t2) {
        var n2 = e2[t2.name];
        return (function(e3) {
          return true === e3.__refs_collection;
        })(n2) || Kn(this, t2, e2), n2;
      }, Un.prototype.ensureBound = function(e2, t2) {
        (function(e3, t3) {
          return Object.prototype.hasOwnProperty.call(e3, t3.name || t3);
        })(e2, t2) || this.bind(e2, t2);
      }, Un.prototype.unset = function(e2, t2, n2) {
        e2 && (this.ensureBound(e2, t2), t2.collection ? this.ensureRefsCollection(e2, t2).remove(n2) : e2[t2.name] = void 0);
      }, Un.prototype.set = function(e2, t2, n2) {
        e2 && (this.ensureBound(e2, t2), t2.collection ? this.ensureRefsCollection(e2, t2).add(n2) : e2[t2.name] = n2);
      };
      var qn = new Un({ name: "children", enumerable: true, collection: true }, { name: "parent" }), Yn = new Un({ name: "labels", enumerable: true, collection: true }, { name: "labelTarget" }), Xn = new Un({ name: "attachers", collection: true }, { name: "host" }), Zn = new Un({ name: "outgoing", collection: true }, { name: "source" }), Jn = new Un({ name: "incoming", collection: true }, { name: "target" });
      function Qn() {
        Object.defineProperty(this, "businessObject", { writable: true }), Object.defineProperty(this, "label", { get: function() {
          return this.labels[0];
        }, set: function(e2) {
          var t2 = this.label, n2 = this.labels;
          !e2 && t2 ? n2.remove(t2) : n2.add(e2, 0);
        } }), qn.bind(this, "parent"), Yn.bind(this, "labels"), Zn.bind(this, "outgoing"), Jn.bind(this, "incoming");
      }
      function ei() {
        Qn.call(this), qn.bind(this, "children"), Xn.bind(this, "host"), Xn.bind(this, "attachers");
      }
      function ti() {
        Qn.call(this), qn.bind(this, "children");
      }
      function ni() {
        ei.call(this), Yn.bind(this, "labelTarget");
      }
      function ii() {
        Qn.call(this), Zn.bind(this, "source"), Jn.bind(this, "target");
      }
      e(ei, Qn), e(ti, ei), e(ni, ei), e(ii, Qn);
      var ri = { connection: ii, shape: ei, label: ni, root: ti };
      function oi() {
        this._uid = 12;
      }
      oi.prototype.createRoot = function(e2) {
        return this.create("root", e2);
      }, oi.prototype.createLabel = function(e2) {
        return this.create("label", e2);
      }, oi.prototype.createShape = function(e2) {
        return this.create("shape", e2);
      }, oi.prototype.createConnection = function(e2) {
        return this.create("connection", e2);
      }, oi.prototype.create = function(e2, t2) {
        return (t2 = E({}, t2 || {})).id || (t2.id = e2 + "_" + this._uid++), (function(e3, t3) {
          var n2 = ri[e3];
          if (!n2) throw new Error("unknown type: <" + e3 + ">");
          return E(new n2(), t3);
        })(e2, t2);
      };
      var ai = "__fn", si = Array.prototype.slice;
      function li() {
        this._listeners = {}, this.on("diagram.destroy", 1, this._destroy, this);
      }
      function pi() {
      }
      function ci(e2, t2) {
        this._eventBus = e2, this._elementRegistry = t2;
      }
      function ui(e2, t2, n2) {
        var i2 = n2 || t2.firstChild;
        e2 !== i2 && t2.insertBefore(e2, i2);
      }
      li.prototype.on = function(e2, t2, n2, i2) {
        if (e2 = o(e2) ? e2 : [e2], l(t2) && (i2 = n2, n2 = t2, t2 = 1e3), !s(t2)) throw new Error("priority must be a number");
        var r2 = n2;
        i2 && ((r2 = b(n2, i2))[ai] = n2[ai] || n2);
        var a2 = this;
        e2.forEach((function(e3) {
          a2._addListener(e3, { priority: t2, callback: r2, next: null });
        }));
      }, li.prototype.once = function(e2, t2, n2, i2) {
        var r2 = this;
        if (l(t2) && (i2 = n2, n2 = t2, t2 = 1e3), !s(t2)) throw new Error("priority must be a number");
        function o2() {
          o2.__isTomb = true;
          var t3 = n2.apply(i2, arguments);
          return r2.off(e2, o2), t3;
        }
        o2[ai] = n2, this.on(e2, t2, o2);
      }, li.prototype.off = function(e2, t2) {
        e2 = o(e2) ? e2 : [e2];
        var n2 = this;
        e2.forEach((function(e3) {
          n2._removeListener(e3, t2);
        }));
      }, li.prototype.createEvent = function(e2) {
        var t2 = new pi();
        return t2.init(e2), t2;
      }, li.prototype.fire = function(e2, t2) {
        var n2, i2, r2, o2;
        if (o2 = si.call(arguments), "object" == typeof e2 && (e2 = (t2 = e2).type), !e2) throw new Error("no event type specified");
        if (i2 = this._listeners[e2]) {
          n2 = t2 instanceof pi ? t2 : this.createEvent(t2), o2[0] = n2;
          var a2 = n2.type;
          e2 !== a2 && (n2.type = e2);
          try {
            r2 = this._invokeListeners(n2, o2, i2);
          } finally {
            e2 !== a2 && (n2.type = a2);
          }
          return void 0 === r2 && n2.defaultPrevented && (r2 = false), r2;
        }
      }, li.prototype.handleError = function(e2) {
        return false === this.fire("error", { error: e2 });
      }, li.prototype._destroy = function() {
        this._listeners = {};
      }, li.prototype._invokeListeners = function(e2, t2, n2) {
        for (var i2; n2 && !e2.cancelBubble; ) i2 = this._invokeListener(e2, t2, n2), n2 = n2.next;
        return i2;
      }, li.prototype._invokeListener = function(e2, t2, n2) {
        var i2;
        if (n2.callback.__isTomb) return i2;
        try {
          i2 = (function(e3, t3) {
            return e3.apply(null, t3);
          })(n2.callback, t2), void 0 !== i2 && (e2.returnValue = i2, e2.stopPropagation()), false === i2 && e2.preventDefault();
        } catch (e3) {
          if (!this.handleError(e3)) throw console.error("unhandled error in event listener", e3), e3;
        }
        return i2;
      }, li.prototype._addListener = function(e2, t2) {
        var n2, i2 = this._getListeners(e2);
        if (i2) {
          for (; i2; ) {
            if (i2.priority < t2.priority) return t2.next = i2, void (n2 ? n2.next = t2 : this._setListeners(e2, t2));
            n2 = i2, i2 = i2.next;
          }
          n2.next = t2;
        } else this._setListeners(e2, t2);
      }, li.prototype._getListeners = function(e2) {
        return this._listeners[e2];
      }, li.prototype._setListeners = function(e2, t2) {
        this._listeners[e2] = t2;
      }, li.prototype._removeListener = function(e2, t2) {
        var n2, i2, r2, o2 = this._getListeners(e2);
        if (t2) for (; o2; ) n2 = o2.next, (r2 = o2.callback) !== t2 && r2[ai] !== t2 || (i2 ? i2.next = n2 : this._setListeners(e2, n2)), i2 = o2, o2 = n2;
        else this._setListeners(e2, null);
      }, pi.prototype.stopPropagation = function() {
        this.cancelBubble = true;
      }, pi.prototype.preventDefault = function() {
        this.defaultPrevented = true;
      }, pi.prototype.init = function(e2) {
        E(this, e2 || {});
      }, ci.$inject = ["eventBus", "elementRegistry"], ci.prototype._getChildrenContainer = function(e2) {
        var t2, n2 = this._elementRegistry.getGraphics(e2);
        return e2.parent ? (t2 = (function(e3) {
          return e3.parentNode.childNodes[1];
        })(n2), t2 || (z(t2 = q("g")).add("djs-children"), I(n2.parentNode, t2))) : t2 = n2, t2;
      }, ci.prototype._clear = function(e2) {
        var t2 = (function(e3) {
          return e3.childNodes[0];
        })(e2);
        return Be(t2), t2;
      }, ci.prototype._createContainer = function(e2, t2, n2, i2) {
        var r2 = q("g");
        z(r2).add("djs-group"), void 0 !== n2 ? ui(r2, t2, t2.childNodes[n2]) : I(t2, r2);
        var o2 = q("g");
        z(o2).add("djs-element"), z(o2).add("djs-" + e2), i2 && z(o2).add("djs-frame"), I(r2, o2);
        var a2 = q("g");
        return z(a2).add("djs-visual"), I(o2, a2), o2;
      }, ci.prototype.create = function(e2, t2, n2) {
        var i2 = this._getChildrenContainer(t2.parent);
        return this._createContainer(e2, i2, n2, Pt(t2));
      }, ci.prototype.updateContainments = function(e2) {
        var t2, n2 = this, i2 = this._elementRegistry;
        t2 = m(e2, (function(e3, t3) {
          return t3.parent && (e3[t3.parent.id] = t3.parent), e3;
        }), {}), f(t2, (function(e3) {
          var t3 = e3.children;
          if (t3) {
            var r2 = n2._getChildrenContainer(e3);
            f(t3.slice().reverse(), (function(e4) {
              ui(i2.getGraphics(e4).parentNode, r2);
            }));
          }
        }));
      }, ci.prototype.drawShape = function(e2, t2, n2 = {}) {
        return this._eventBus.fire("render.shape", { gfx: e2, element: t2, attrs: n2 });
      }, ci.prototype.getShapePath = function(e2) {
        return this._eventBus.fire("render.getShapePath", e2);
      }, ci.prototype.drawConnection = function(e2, t2, n2 = {}) {
        return this._eventBus.fire("render.connection", { gfx: e2, element: t2, attrs: n2 });
      }, ci.prototype.getConnectionPath = function(e2) {
        return this._eventBus.fire("render.getConnectionPath", e2);
      }, ci.prototype.update = function(e2, t2, n2) {
        if (t2.parent) {
          var i2 = this._clear(n2);
          if ("shape" === e2) this.drawShape(i2, t2), Je(n2, t2.x, t2.y);
          else {
            if ("connection" !== e2) throw new Error("unknown type: " + e2);
            this.drawConnection(i2, t2);
          }
          t2.hidden ? W(n2, "display", "none") : W(n2, "display", "block");
        }
      }, ci.prototype.remove = function(e2) {
        oe(this._elementRegistry.getGraphics(e2).parentNode);
      };
      var hi = { __depends__: [In], __init__: ["canvas"], canvas: ["type", $n], elementRegistry: ["type", Hn], elementFactory: ["type", oi], eventBus: ["type", li], graphicsFactory: ["type", ci] };
      function fi(e2) {
        return (function(e3) {
          var t2 = new Dn(e3);
          return t2.init(), t2;
        })([{ config: ["value", e2 = e2 || {}] }, hi].concat(e2.modules || []));
      }
      function mi(e2, t2) {
        this._injector = t2 || fi(e2), this.get("eventBus").fire("diagram.init");
      }
      function di() {
      }
      function yi(e2, t2) {
        this.model = e2, this.properties = t2;
      }
      mi.prototype.get = function(e2, t2) {
        return this._injector.get(e2, t2);
      }, mi.prototype.invoke = function(e2, t2, n2) {
        return this._injector.invoke(e2, t2, n2);
      }, mi.prototype.destroy = function() {
        this.get("eventBus").fire("diagram.destroy");
      }, mi.prototype.clear = function() {
        this.get("eventBus").fire("diagram.clear");
      }, di.prototype.get = function(e2) {
        return this.$model.properties.get(this, e2);
      }, di.prototype.set = function(e2, t2) {
        this.$model.properties.set(this, e2, t2);
      }, yi.prototype.createType = function(e2) {
        var t2 = this.model, n2 = this.properties, i2 = Object.create(di.prototype);
        f(e2.properties, (function(e3) {
          e3.isMany || void 0 === e3.default || (i2[e3.name] = e3.default);
        })), n2.defineModel(i2, t2), n2.defineDescriptor(i2, e2);
        var r2 = e2.ns.name;
        function o2(e3) {
          n2.define(this, "$type", { value: r2, enumerable: true }), n2.define(this, "$attrs", { value: {} }), n2.define(this, "$parent", { writable: true }), f(e3, b((function(e4, t3) {
            this.set(t3, e4);
          }), this));
        }
        return o2.prototype = i2, o2.hasType = i2.$instanceOf = this.model.hasType, n2.defineModel(o2, t2), n2.defineDescriptor(o2, e2), o2;
      };
      var gi = { String: true, Boolean: true, Integer: true, Real: true, Element: true }, vi = { String: function(e2) {
        return e2;
      }, Boolean: function(e2) {
        return "true" === e2;
      }, Integer: function(e2) {
        return parseInt(e2, 10);
      }, Real: function(e2) {
        return parseFloat(e2);
      } };
      function xi(e2, t2) {
        var n2 = vi[e2];
        return n2 ? n2(t2) : t2;
      }
      function wi(e2) {
        return !!gi[e2];
      }
      function bi(e2) {
        return !!vi[e2];
      }
      function Ei(e2, t2) {
        var n2, i2, r2 = e2.split(/:/);
        if (1 === r2.length) n2 = e2, i2 = t2;
        else {
          if (2 !== r2.length) throw new Error("expected <prefix:localName> or <localName>, got " + e2);
          n2 = r2[1], i2 = r2[0];
        }
        return { name: e2 = (i2 ? i2 + ":" : "") + n2, prefix: i2, localName: n2 };
      }
      function _i(e2) {
        this.ns = e2, this.name = e2.name, this.allTypes = [], this.allTypesByName = {}, this.properties = [], this.propertiesByName = {};
      }
      function Ai(e2, t2) {
        this.packageMap = {}, this.typeMap = {}, this.packages = [], this.properties = t2, f(e2, b(this.registerPackage, this));
      }
      function Ri(e2, t2, n2) {
        var i2 = t2[n2];
        if (i2 in e2) throw new Error("package with " + n2 + " <" + i2 + "> already defined");
      }
      function Si(e2) {
        this.model = e2;
      }
      function ki(e2, t2, n2) {
        Object.defineProperty(e2, t2.name, { enumerable: !t2.isReference, writable: true, value: n2, configurable: true });
      }
      function Ci(e2) {
        return e2.replace(/^:/, "");
      }
      function Mi(e2, t2 = {}) {
        this.properties = new Si(this), this.factory = new yi(this, this.properties), this.registry = new Ai(e2, this.properties), this.typeCache = {}, this.config = t2;
      }
      _i.prototype.build = function() {
        return (function(e2, t2) {
          let n2 = {}, i2 = Object(e2);
          return f(t2, (function(t3) {
            t3 in i2 && (n2[t3] = e2[t3]);
          })), n2;
        })(this, ["ns", "name", "allTypes", "allTypesByName", "properties", "propertiesByName", "bodyProperty", "idProperty"]);
      }, _i.prototype.addProperty = function(e2, t2, n2) {
        "boolean" == typeof t2 && (n2 = t2, t2 = void 0), this.addNamedProperty(e2, false !== n2);
        var i2 = this.properties;
        void 0 !== t2 ? i2.splice(t2, 0, e2) : i2.push(e2);
      }, _i.prototype.replaceProperty = function(e2, t2, n2) {
        var i2 = e2.ns, r2 = this.properties, o2 = this.propertiesByName, a2 = e2.name !== t2.name;
        if (e2.isId) {
          if (!t2.isId) throw new Error("property <" + t2.ns.name + "> must be id property to refine <" + e2.ns.name + ">");
          this.setIdProperty(t2, false);
        }
        if (e2.isBody) {
          if (!t2.isBody) throw new Error("property <" + t2.ns.name + "> must be body property to refine <" + e2.ns.name + ">");
          this.setBodyProperty(t2, false);
        }
        var s2 = r2.indexOf(e2);
        if (-1 === s2) throw new Error("property <" + i2.name + "> not found in property list");
        r2.splice(s2, 1), this.addProperty(t2, n2 ? void 0 : s2, a2), o2[i2.name] = o2[i2.localName] = t2;
      }, _i.prototype.redefineProperty = function(e2, t2, n2) {
        var i2 = e2.ns.prefix, r2 = t2.split("#"), o2 = Ei(r2[0], i2), a2 = Ei(r2[1], o2.prefix).name, s2 = this.propertiesByName[a2];
        if (!s2) throw new Error("refined property <" + a2 + "> not found");
        this.replaceProperty(s2, e2, n2), delete e2.redefines;
      }, _i.prototype.addNamedProperty = function(e2, t2) {
        var n2 = e2.ns, i2 = this.propertiesByName;
        t2 && (this.assertNotDefined(e2, n2.name), this.assertNotDefined(e2, n2.localName)), i2[n2.name] = i2[n2.localName] = e2;
      }, _i.prototype.removeNamedProperty = function(e2) {
        var t2 = e2.ns, n2 = this.propertiesByName;
        delete n2[t2.name], delete n2[t2.localName];
      }, _i.prototype.setBodyProperty = function(e2, t2) {
        if (t2 && this.bodyProperty) throw new Error("body property defined multiple times (<" + this.bodyProperty.ns.name + ">, <" + e2.ns.name + ">)");
        this.bodyProperty = e2;
      }, _i.prototype.setIdProperty = function(e2, t2) {
        if (t2 && this.idProperty) throw new Error("id property defined multiple times (<" + this.idProperty.ns.name + ">, <" + e2.ns.name + ">)");
        this.idProperty = e2;
      }, _i.prototype.assertNotTrait = function(e2) {
        if ((e2.extends || []).length) throw new Error(`cannot create <${e2.name}> extending <${e2.extends}>`);
      }, _i.prototype.assertNotDefined = function(e2, t2) {
        var n2 = e2.name, i2 = this.propertiesByName[n2];
        if (i2) throw new Error("property <" + n2 + "> already defined; override of <" + i2.definedBy.ns.name + "#" + i2.ns.name + "> by <" + e2.definedBy.ns.name + "#" + e2.ns.name + "> not allowed without redefines");
      }, _i.prototype.hasProperty = function(e2) {
        return this.propertiesByName[e2];
      }, _i.prototype.addTrait = function(e2, t2) {
        t2 && this.assertNotTrait(e2);
        var n2 = this.allTypesByName, i2 = this.allTypes, r2 = e2.name;
        r2 in n2 || (f(e2.properties, b((function(n3) {
          n3 = E({}, n3, { name: n3.ns.localName, inherited: t2 }), Object.defineProperty(n3, "definedBy", { value: e2 });
          var i3 = n3.replaces, r3 = n3.redefines;
          i3 || r3 ? this.redefineProperty(n3, i3 || r3, i3) : (n3.isBody && this.setBodyProperty(n3), n3.isId && this.setIdProperty(n3), this.addProperty(n3));
        }), this)), i2.push(e2), n2[r2] = e2);
      }, Ai.prototype.getPackage = function(e2) {
        return this.packageMap[e2];
      }, Ai.prototype.getPackages = function() {
        return this.packages;
      }, Ai.prototype.registerPackage = function(e2) {
        e2 = E({}, e2);
        var t2 = this.packageMap;
        Ri(t2, e2, "prefix"), Ri(t2, e2, "uri"), f(e2.types, b((function(t3) {
          this.registerType(t3, e2);
        }), this)), t2[e2.uri] = t2[e2.prefix] = e2, this.packages.push(e2);
      }, Ai.prototype.registerType = function(e2, t2) {
        var n2 = Ei((e2 = E({}, e2, { superClass: (e2.superClass || []).slice(), extends: (e2.extends || []).slice(), properties: (e2.properties || []).slice(), meta: E(e2.meta || {}) })).name, t2.prefix), i2 = n2.name, r2 = {};
        f(e2.properties, b((function(e3) {
          var t3 = Ei(e3.name, n2.prefix), i3 = t3.name;
          wi(e3.type) || (e3.type = Ei(e3.type, t3.prefix).name), E(e3, { ns: t3, name: i3 }), r2[i3] = e3;
        }), this)), E(e2, { ns: n2, name: i2, propertiesByName: r2 }), f(e2.extends, b((function(e3) {
          var t3 = Ei(e3, n2.prefix), r3 = this.typeMap[t3.name];
          r3.traits = r3.traits || [], r3.traits.push(i2);
        }), this)), this.definePackage(e2, t2), this.typeMap[i2] = e2;
      }, Ai.prototype.mapTypes = function(e2, t2, n2) {
        var i2 = wi(e2.name) ? { name: e2.name } : this.typeMap[e2.name], r2 = this;
        function o2(n3, i3) {
          var o3 = Ei(n3, wi(n3) ? "" : e2.prefix);
          r2.mapTypes(o3, t2, i3);
        }
        function a2(e3) {
          return o2(e3, true);
        }
        if (!i2) throw new Error("unknown type <" + e2.name + ">");
        f(i2.superClass, n2 ? a2 : function(e3) {
          return o2(e3, false);
        }), t2(i2, !n2), f(i2.traits, a2);
      }, Ai.prototype.getEffectiveDescriptor = function(e2) {
        var t2 = Ei(e2), n2 = new _i(t2);
        this.mapTypes(t2, (function(e3, t3) {
          n2.addTrait(e3, t3);
        }));
        var i2 = n2.build();
        return this.definePackage(i2, i2.allTypes[i2.allTypes.length - 1].$pkg), i2;
      }, Ai.prototype.definePackage = function(e2, t2) {
        this.properties.define(e2, "$pkg", { value: t2 });
      }, Si.prototype.set = function(e2, t2, n2) {
        if (!p(t2) || !t2.length) throw new TypeError("property name must be a non-empty string");
        var i2 = this.getProperty(e2, t2), r2 = i2 && i2.name;
        void 0 === n2 ? i2 ? delete e2[r2] : delete e2.$attrs[Ci(t2)] : i2 ? r2 in e2 ? e2[r2] = n2 : ki(e2, i2, n2) : e2.$attrs[Ci(t2)] = n2;
      }, Si.prototype.get = function(e2, t2) {
        var n2 = this.getProperty(e2, t2);
        if (!n2) return e2.$attrs[Ci(t2)];
        var i2 = n2.name;
        return !e2[i2] && n2.isMany && ki(e2, n2, []), e2[i2];
      }, Si.prototype.define = function(e2, t2, n2) {
        if (!n2.writable) {
          var i2 = n2.value;
          delete (n2 = E({}, n2, { get: function() {
            return i2;
          } })).value;
        }
        Object.defineProperty(e2, t2, n2);
      }, Si.prototype.defineDescriptor = function(e2, t2) {
        this.define(e2, "$descriptor", { value: t2 });
      }, Si.prototype.defineModel = function(e2, t2) {
        this.define(e2, "$model", { value: t2 });
      }, Si.prototype.getProperty = function(e2, t2) {
        var n2 = this.model, i2 = n2.getPropertyDescriptor(e2, t2);
        if (i2) return i2;
        if (t2.includes(":")) return null;
        const r2 = n2.config.strict;
        if (void 0 !== r2) {
          const n3 = new TypeError(`unknown property <${t2}> on <${e2.$type}>`);
          if (r2) throw n3;
          "undefined" != typeof console && console.warn(n3);
        }
        return null;
      }, Mi.prototype.create = function(e2, t2) {
        var n2 = this.getType(e2);
        if (!n2) throw new Error("unknown type <" + e2 + ">");
        return new n2(t2);
      }, Mi.prototype.getType = function(e2) {
        var t2 = this.typeCache, n2 = p(e2) ? e2 : e2.ns.name, i2 = t2[n2];
        return i2 || (e2 = this.registry.getEffectiveDescriptor(n2), i2 = t2[n2] = this.factory.createType(e2)), i2;
      }, Mi.prototype.createAny = function(e2, t2, n2) {
        var o2 = Ei(e2), s2 = { $type: e2, $instanceOf: function(e3) {
          return e3 === this.$type;
        }, get: function(e3) {
          return this[e3];
        }, set: function(e3, t3) {
          !(function(e4, t4, n3) {
            let o3 = e4;
            f(t4, (function(e5, a2) {
              if ("number" != typeof e5 && "string" != typeof e5) throw new Error("illegal key type: " + typeof e5 + ". Key should be of type number or string.");
              if ("constructor" === e5) throw new Error("illegal key: constructor");
              if ("__proto__" === e5) throw new Error("illegal key: __proto__");
              let s3 = t4[a2 + 1], l3 = o3[e5];
              r(s3) && null == l3 && (l3 = o3[e5] = isNaN(+s3) ? {} : []), i(s3) ? i(n3) ? delete o3[e5] : o3[e5] = n3 : o3 = l3;
            }));
          })(this, [e3], t3);
        } }, l2 = { name: e2, isGeneric: true, ns: { prefix: o2.prefix, localName: o2.localName, uri: t2 } };
        return this.properties.defineDescriptor(s2, l2), this.properties.defineModel(s2, this), this.properties.define(s2, "get", { enumerable: false, writable: true }), this.properties.define(s2, "set", { enumerable: false, writable: true }), this.properties.define(s2, "$parent", { enumerable: false, writable: true }), this.properties.define(s2, "$instanceOf", { enumerable: false, writable: true }), f(n2, (function(e3, t3) {
          a(e3) && void 0 !== e3.value ? s2[e3.name] = e3.value : s2[t3] = e3;
        })), s2;
      }, Mi.prototype.getPackage = function(e2) {
        return this.registry.getPackage(e2);
      }, Mi.prototype.getPackages = function() {
        return this.registry.getPackages();
      }, Mi.prototype.getElementDescriptor = function(e2) {
        return e2.$descriptor;
      }, Mi.prototype.hasType = function(e2, t2) {
        return void 0 === t2 && (t2 = e2, e2 = this), t2 in e2.$model.getElementDescriptor(e2).allTypesByName;
      }, Mi.prototype.getPropertyDescriptor = function(e2, t2) {
        return this.getElementDescriptor(e2).propertiesByName[t2];
      }, Mi.prototype.getTypeDescriptor = function(e2) {
        return this.registry.typeMap[e2];
      };
      var Pi = String.fromCharCode, Oi = Object.prototype.hasOwnProperty, Ti = /&#(\d+);|&#x([0-9a-f]+);|&(\w+);/gi, Ni = { amp: "&", apos: "'", gt: ">", lt: "<", quot: '"' };
      function Di(e2, t2, n2, i2) {
        return i2 ? Oi.call(Ni, i2) ? Ni[i2] : "&" + i2 + ";" : Pi(t2 || parseInt(n2, 16));
      }
      function Bi(e2) {
        return e2.length > 3 && -1 !== e2.indexOf("&") ? e2.replace(Ti, Di) : e2;
      }
      Object.keys(Ni).forEach((function(e2) {
        Ni[e2.toUpperCase()] = Ni[e2];
      }));
      var Li = "xsi:type", Ii = "non-whitespace outside of root node";
      function ji(e2) {
        return new Error(e2);
      }
      function Fi(e2) {
        return "missing namespace for prefix <" + e2 + ">";
      }
      function Vi(e2) {
        return { get: e2, enumerable: true };
      }
      function Wi(e2) {
        var t2, n2 = {};
        for (t2 in e2) n2[t2] = e2[t2];
        return n2;
      }
      function $i(e2) {
        return e2 + "$uri";
      }
      function zi() {
        return { line: 0, column: 0 };
      }
      function Gi(e2) {
        throw e2;
      }
      function Hi(e2) {
        if (!this) return new Hi(e2);
        var t2, n2, i2, r2, o2, a2, s2, l2, p2, c2 = e2 && e2.proxy, u2 = Gi, h2 = zi, f2 = false, m2 = false, d2 = null, y2 = false;
        function g2(e3) {
          e3 instanceof Error || (e3 = ji(e3)), d2 = e3, u2(e3, h2);
        }
        function v2(e3) {
          o2 && (e3 instanceof Error || (e3 = ji(e3)), o2(e3, h2));
        }
        this.on = function(e3, p3) {
          if ("function" != typeof p3) throw ji("required args <name, cb>");
          switch (e3) {
            case "openTag":
              n2 = p3;
              break;
            case "text":
              t2 = p3;
              break;
            case "closeTag":
              i2 = p3;
              break;
            case "error":
              u2 = p3;
              break;
            case "warn":
              o2 = p3;
              break;
            case "cdata":
              r2 = p3;
              break;
            case "attention":
              l2 = p3;
              break;
            case "question":
              s2 = p3;
              break;
            case "comment":
              a2 = p3;
              break;
            default:
              throw ji("unsupported event: " + e3);
          }
          return this;
        }, this.ns = function(e3) {
          if (void 0 === e3 && (e3 = {}), "object" != typeof e3) throw ji("required args <nsMap={}>");
          var t3, n3 = {};
          for (t3 in e3) n3[t3] = e3[t3];
          return n3["http://www.w3.org/2001/XMLSchema-instance"] = "xsi", m2 = true, p2 = n3, this;
        }, this.parse = function(e3) {
          if ("string" != typeof e3) throw ji("required args <xml=string>");
          return d2 = null, (function(e4) {
            var o3, u3, d3, x2, w2, b2, E2, _2, A2, R2, S2, k2 = m2 ? [] : null, C2 = m2 ? (function(e5) {
              var t3, n3, i3 = {};
              for (t3 in e5) i3[n3 = e5[t3]] = n3, i3[$i(n3)] = t3;
              return i3;
            })(p2) : null, M2 = [], P2 = 0, O2 = false, T2 = false, N2 = 0, D2 = 0, B2 = "", L2 = 0;
            function I2() {
              if (null !== S2) return S2;
              var e5, t3, n3, i3, r3, o4, a3, s3, l3, c3, u4, h3 = m2 && C2.xmlns, d4 = m2 && f2 ? [] : null, y3 = L2, g3 = B2, x3 = g3.length, w3 = {}, b3 = {};
              e: for (; y3 < x3; y3++) if (l3 = false, !(32 === (c3 = g3.charCodeAt(y3)) || c3 < 14 && c3 > 8)) {
                for ((c3 < 65 || c3 > 122 || c3 > 90 && c3 < 97) && 95 !== c3 && 58 !== c3 && (v2("illegal first char attribute name"), l3 = true), u4 = y3 + 1; u4 < x3; u4++) if (!((c3 = g3.charCodeAt(u4)) > 96 && c3 < 123 || c3 > 64 && c3 < 91 || c3 > 47 && c3 < 59 || 46 === c3 || 45 === c3 || 95 === c3)) {
                  if (32 === c3 || c3 < 14 && c3 > 8) {
                    v2("missing attribute value"), y3 = u4;
                    continue e;
                  }
                  if (61 === c3) break;
                  v2("illegal attribute name char"), l3 = true;
                }
                if ("xmlns:xmlns" === (s3 = g3.substring(y3, u4)) && (v2("illegal declaration of xmlns"), l3 = true), 34 === (c3 = g3.charCodeAt(u4 + 1))) -1 === (u4 = g3.indexOf('"', y3 = u4 + 2)) && -1 !== (u4 = g3.indexOf("'", y3)) && (v2("attribute value quote missmatch"), l3 = true);
                else if (39 === c3) -1 === (u4 = g3.indexOf("'", y3 = u4 + 2)) && -1 !== (u4 = g3.indexOf('"', y3)) && (v2("attribute value quote missmatch"), l3 = true);
                else for (v2("missing attribute value quotes"), l3 = true, u4 += 1; u4 < x3 && !(32 === (c3 = g3.charCodeAt(u4 + 1)) || c3 < 14 && c3 > 8); u4++) ;
                for (-1 === u4 && (v2("missing closing quotes"), u4 = x3, l3 = true), l3 || (o4 = g3.substring(y3, u4)), y3 = u4; u4 + 1 < x3 && !(32 === (c3 = g3.charCodeAt(u4 + 1)) || c3 < 14 && c3 > 8); u4++) y3 === u4 && (v2("illegal character after attribute end"), l3 = true);
                if (y3 = u4 + 1, !l3) if (s3 in b3) v2("attribute <" + s3 + "> already defined");
                else if (b3[s3] = true, m2) if (f2) {
                  if (null !== (r3 = "xmlns" === s3 ? "xmlns" : 120 === s3.charCodeAt(0) && "xmlns:" === s3.substr(0, 6) ? s3.substr(6) : null)) {
                    if (e5 = Bi(o4), t3 = $i(r3), !(a3 = p2[e5])) {
                      if ("xmlns" === r3 || t3 in C2 && C2[t3] !== e5) do {
                        a3 = "ns" + P2++;
                      } while (void 0 !== C2[a3]);
                      else a3 = r3;
                      p2[e5] = a3;
                    }
                    C2[r3] !== a3 && (i3 || (C2 = Wi(C2), i3 = true), C2[r3] = a3, "xmlns" === r3 && (C2[$i(a3)] = e5, h3 = a3), C2[t3] = e5), w3[s3] = o4;
                    continue;
                  }
                  d4.push(s3, o4);
                } else -1 !== (c3 = s3.indexOf(":")) ? (n3 = C2[s3.substring(0, c3)]) ? ((s3 = h3 === n3 ? s3.substr(c3 + 1) : n3 + s3.substr(c3)) === Li && (-1 !== (c3 = o4.indexOf(":")) ? (n3 = o4.substring(0, c3), o4 = (n3 = C2[n3] || n3) + o4.substring(c3)) : o4 = h3 + ":" + o4), w3[s3] = o4) : v2(Fi(s3.substring(0, c3))) : w3[s3] = o4;
                else w3[s3] = o4;
              }
              if (f2) for (y3 = 0, x3 = d4.length; y3 < x3; y3++) {
                if (s3 = d4[y3++], o4 = d4[y3], -1 !== (c3 = s3.indexOf(":"))) {
                  if (!(n3 = C2[s3.substring(0, c3)])) {
                    v2(Fi(s3.substring(0, c3)));
                    continue;
                  }
                  (s3 = h3 === n3 ? s3.substr(c3 + 1) : n3 + s3.substr(c3)) === Li && (-1 !== (c3 = o4.indexOf(":")) ? (n3 = o4.substring(0, c3), o4 = (n3 = C2[n3] || n3) + o4.substring(c3)) : o4 = h3 + ":" + o4);
                }
                w3[s3] = o4;
              }
              return S2 = w3;
            }
            function j2() {
              for (var t3, n3, i3 = /(\r\n|\r|\n)/g, r3 = 0, o4 = 0, a3 = 0, s3 = D2; N2 >= a3 && (t3 = i3.exec(e4)) && !((s3 = t3[0].length + t3.index) > N2); ) r3 += 1, a3 = s3;
              return -1 == N2 ? (o4 = s3, n3 = e4.substring(D2)) : 0 === D2 ? n3 = e4.substring(D2, N2) : (o4 = N2 - a3, n3 = -1 == D2 ? e4.substring(N2) : e4.substring(N2, D2 + 1)), { data: n3, line: r3, column: o4 };
            }
            h2 = j2, c2 && (R2 = Object.create({}, { name: Vi((function() {
              return _2;
            })), originalName: Vi((function() {
              return A2;
            })), attrs: Vi(I2), ns: Vi((function() {
              return C2;
            })) }));
            for (; -1 !== D2; ) {
              if (-1 === (N2 = 60 === e4.charCodeAt(D2) ? D2 : e4.indexOf("<", D2))) return M2.length ? g2("unexpected end of file") : 0 === D2 ? g2("missing start tag") : void (D2 < e4.length && e4.substring(D2).trim() && v2(Ii));
              if (D2 !== N2) {
                if (M2.length) {
                  if (t2 && (t2(e4.substring(D2, N2), Bi, h2), y2)) return;
                } else if (e4.substring(D2, N2).trim() && (v2(Ii), y2)) return;
              }
              if (33 === (w2 = e4.charCodeAt(N2 + 1))) {
                if (91 === (x2 = e4.charCodeAt(N2 + 2)) && "CDATA[" === e4.substr(N2 + 3, 6)) {
                  if (-1 === (D2 = e4.indexOf("]]>", N2))) return g2("unclosed cdata");
                  if (r2 && (r2(e4.substring(N2 + 9, D2), h2), y2)) return;
                  D2 += 3;
                  continue;
                }
                if (45 === x2 && 45 === e4.charCodeAt(N2 + 3)) {
                  if (-1 === (D2 = e4.indexOf("-->", N2))) return g2("unclosed comment");
                  if (a2 && (a2(e4.substring(N2 + 4, D2), Bi, h2), y2)) return;
                  D2 += 3;
                  continue;
                }
              }
              if (63 !== w2) {
                for (u3 = N2 + 1; ; u3++) {
                  if (b2 = e4.charCodeAt(u3), isNaN(b2)) return D2 = -1, g2("unclosed tag");
                  if (34 === b2) u3 = -1 !== (x2 = e4.indexOf('"', u3 + 1)) ? x2 : u3;
                  else if (39 === b2) u3 = -1 !== (x2 = e4.indexOf("'", u3 + 1)) ? x2 : u3;
                  else if (62 === b2) {
                    D2 = u3;
                    break;
                  }
                }
                if (33 !== w2) {
                  if (S2 = {}, 47 === w2) {
                    if (O2 = false, T2 = true, !M2.length) return g2("missing open tag");
                    if (u3 = _2 = M2.pop(), x2 = N2 + 2 + u3.length, e4.substring(N2 + 2, x2) !== u3) return g2("closing tag mismatch");
                    for (; x2 < D2; x2++) if (!(32 === (w2 = e4.charCodeAt(x2)) || w2 > 8 && w2 < 14)) return g2("close tag");
                  } else {
                    if (47 === e4.charCodeAt(D2 - 1) ? (u3 = _2 = e4.substring(N2 + 1, D2 - 1), O2 = true, T2 = true) : (u3 = _2 = e4.substring(N2 + 1, D2), O2 = true, T2 = false), !(w2 > 96 && w2 < 123 || w2 > 64 && w2 < 91 || 95 === w2 || 58 === w2)) return g2("illegal first char nodeName");
                    for (x2 = 1, d3 = u3.length; x2 < d3; x2++) if (!((w2 = u3.charCodeAt(x2)) > 96 && w2 < 123 || w2 > 64 && w2 < 91 || w2 > 47 && w2 < 59 || 45 === w2 || 95 === w2 || 46 == w2)) {
                      if (32 === w2 || w2 < 14 && w2 > 8) {
                        _2 = u3.substring(0, x2), S2 = null;
                        break;
                      }
                      return g2("invalid nodeName");
                    }
                    T2 || M2.push(_2);
                  }
                  if (m2) {
                    if (o3 = C2, O2 && (T2 || k2.push(o3), null === S2 && (f2 = -1 !== u3.indexOf("xmlns", x2)) && (L2 = x2, B2 = u3, I2(), f2 = false)), A2 = _2, -1 !== (w2 = _2.indexOf(":"))) {
                      if (!(E2 = C2[_2.substring(0, w2)])) return g2("missing namespace on <" + A2 + ">");
                      _2 = _2.substr(w2 + 1);
                    } else E2 = C2.xmlns;
                    E2 && (_2 = E2 + ":" + _2);
                  }
                  if (O2 && (L2 = x2, B2 = u3, n2 && (c2 ? n2(R2, Bi, T2, h2) : n2(_2, I2, Bi, T2, h2), y2))) return;
                  if (T2) {
                    if (i2 && (i2(c2 ? R2 : _2, Bi, O2, h2), y2)) return;
                    m2 && (C2 = O2 ? o3 : k2.pop());
                  }
                  D2 += 1;
                } else {
                  if (l2 && (l2(e4.substring(N2, D2 + 1), Bi, h2), y2)) return;
                  D2 += 1;
                }
              } else {
                if (-1 === (D2 = e4.indexOf("?>", N2))) return g2("unclosed question");
                if (s2 && (s2(e4.substring(N2, D2 + 2), h2), y2)) return;
                D2 += 2;
              }
            }
          })(e3), h2 = zi, y2 = false, d2;
        }, this.stop = function() {
          y2 = true;
        };
      }
      function Ki(e2) {
        return e2.xml && "lowerCase" === e2.xml.tagAlias;
      }
      var Ui = { xsi: "http://www.w3.org/2001/XMLSchema-instance", xml: "http://www.w3.org/XML/1998/namespace" }, qi = "xsi:type";
      function Yi(e2) {
        return e2.xml && e2.xml.serialize;
      }
      function Xi(e2) {
        return Yi(e2) === qi;
      }
      function Zi(e2, t2) {
        return Ki(t2) ? e2.prefix + ":" + ((n2 = e2.localName).charAt(0).toUpperCase() + n2.slice(1)) : e2.name;
        var n2;
      }
      function Ji(e2) {
        return new Error(e2);
      }
      function Qi(e2) {
        return e2.$descriptor;
      }
      function er(e2) {
        E(this, e2), this.elementsById = {}, this.references = [], this.warnings = [], this.addReference = function(e3) {
          this.references.push(e3);
        }, this.addElement = function(e3) {
          if (!e3) throw Ji("expected element");
          var t2, n2 = this.elementsById, i2 = Qi(e3).idProperty;
          if (i2 && (t2 = e3.get(i2.name))) {
            if (!/^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i.test(t2)) throw new Error("illegal ID <" + t2 + ">");
            if (n2[t2]) throw Ji("duplicate ID <" + t2 + ">");
            n2[t2] = e3;
          }
        }, this.addWarning = function(e3) {
          this.warnings.push(e3);
        };
      }
      function tr() {
      }
      function nr() {
      }
      function ir() {
      }
      function rr(e2, t2) {
        this.property = e2, this.context = t2;
      }
      function or(e2, t2) {
        this.element = t2, this.propertyDesc = e2;
      }
      function ar() {
      }
      function sr(e2, t2, n2) {
        this.model = e2, this.type = e2.getType(t2), this.context = n2;
      }
      function lr(e2, t2, n2) {
        sr.call(this, e2, t2, n2);
      }
      function pr(e2, t2, n2) {
        this.model = e2, this.context = n2;
      }
      function cr(e2) {
        e2 instanceof Mi && (e2 = { model: e2 }), E(this, { lax: false }, e2);
      }
      tr.prototype.handleEnd = function() {
      }, tr.prototype.handleText = function() {
      }, tr.prototype.handleNode = function() {
      }, nr.prototype = Object.create(tr.prototype), nr.prototype.handleNode = function() {
        return this;
      }, ir.prototype = Object.create(tr.prototype), ir.prototype.handleText = function(e2) {
        this.body = (this.body || "") + e2;
      }, rr.prototype = Object.create(ir.prototype), rr.prototype.handleNode = function(e2) {
        if (this.element) throw Ji("expected no sub nodes");
        return this.element = this.createReference(e2), this;
      }, rr.prototype.handleEnd = function() {
        this.element.id = this.body;
      }, rr.prototype.createReference = function(e2) {
        return { property: this.property.ns.name, id: "" };
      }, or.prototype = Object.create(ir.prototype), or.prototype.handleEnd = function() {
        var e2 = this.body || "", t2 = this.element, n2 = this.propertyDesc;
        e2 = xi(n2.type, e2), n2.isMany ? t2.get(n2.name).push(e2) : t2.set(n2.name, e2);
      }, ar.prototype = Object.create(ir.prototype), ar.prototype.handleNode = function(e2) {
        var t2 = this, n2 = this.element;
        return n2 ? t2 = this.handleChild(e2) : (n2 = this.element = this.createElement(e2), this.context.addElement(n2)), t2;
      }, sr.prototype = Object.create(ar.prototype), sr.prototype.addReference = function(e2) {
        this.context.addReference(e2);
      }, sr.prototype.handleText = function(e2) {
        if (!Qi(this.element).bodyProperty) throw Ji("unexpected body text <" + e2 + ">");
        ir.prototype.handleText.call(this, e2);
      }, sr.prototype.handleEnd = function() {
        var e2 = this.body, t2 = this.element, n2 = Qi(t2).bodyProperty;
        n2 && void 0 !== e2 && (e2 = xi(n2.type, e2), t2.set(n2.name, e2));
      }, sr.prototype.createElement = function(e2) {
        var t2, n2 = e2.attributes, i2 = this.type, r2 = Qi(i2), o2 = this.context, a2 = new i2({}), s2 = this.model;
        return f(n2, (function(e3, n3) {
          var i3 = r2.propertiesByName[n3];
          i3 && i3.isReference ? i3.isMany ? f(e3.split(" "), (function(e4) {
            o2.addReference({ element: a2, property: i3.ns.name, id: e4 });
          })) : o2.addReference({ element: a2, property: i3.ns.name, id: e3 }) : (i3 ? e3 = xi(i3.type, e3) : "xmlns" !== n3 && (t2 = Ei(n3, r2.ns.prefix), s2.getPackage(t2.prefix) && o2.addWarning({ message: "unknown attribute <" + n3 + ">", element: a2, property: n3, value: e3 })), a2.set(n3, e3));
        })), a2;
      }, sr.prototype.getPropertyForNode = function(e2) {
        var t2, n2, i2 = Ei(e2.name), r2 = this.type, o2 = this.model, a2 = Qi(r2), s2 = i2.name, l2 = a2.propertiesByName[s2];
        if (l2 && !l2.isAttr) return Xi(l2) && (t2 = e2.attributes[qi]) ? (t2 = (function(e3, t3) {
          var n3 = Ei(e3);
          return (function(e4, t4) {
            var n4 = e4.name, i3 = e4.localName, r3 = t4.xml && t4.xml.typePrefix;
            return r3 && 0 === i3.indexOf(r3) ? e4.prefix + ":" + i3.slice(r3.length) : n4;
          })(n3, t3.getPackage(n3.prefix));
        })(t2, o2), E({}, l2, { effectiveType: Qi(n2 = o2.getType(t2)).name })) : l2;
        var p2 = o2.getPackage(i2.prefix);
        if (p2) {
          if (t2 = Zi(i2, p2), n2 = o2.getType(t2), l2 = u(a2.properties, (function(e3) {
            return !e3.isVirtual && !e3.isReference && !e3.isAttribute && n2.hasType(e3.type);
          }))) return E({}, l2, { effectiveType: Qi(n2).name });
        } else if (l2 = u(a2.properties, (function(e3) {
          return !e3.isReference && !e3.isAttribute && "Element" === e3.type;
        }))) return l2;
        throw Ji("unrecognized element <" + i2.name + ">");
      }, sr.prototype.toString = function() {
        return "ElementDescriptor[" + Qi(this.type).name + "]";
      }, sr.prototype.valueHandler = function(e2, t2) {
        return new or(e2, t2);
      }, sr.prototype.referenceHandler = function(e2) {
        return new rr(e2, this.context);
      }, sr.prototype.handler = function(e2) {
        return "Element" === e2 ? new pr(this.model, e2, this.context) : new sr(this.model, e2, this.context);
      }, sr.prototype.handleChild = function(e2) {
        var t2, n2, i2, r2;
        if (t2 = this.getPropertyForNode(e2), i2 = this.element, bi(n2 = t2.effectiveType || t2.type)) return this.valueHandler(t2, i2);
        var o2 = (r2 = t2.isReference ? this.referenceHandler(t2).handleNode(e2) : this.handler(n2).handleNode(e2)).element;
        return void 0 !== o2 && (t2.isMany ? i2.get(t2.name).push(o2) : i2.set(t2.name, o2), t2.isReference ? (E(o2, { element: i2 }), this.context.addReference(o2)) : o2.$parent = i2), r2;
      }, lr.prototype = Object.create(sr.prototype), lr.prototype.createElement = function(e2) {
        var t2 = e2.name, n2 = Ei(t2), i2 = this.model, r2 = this.type, o2 = i2.getPackage(n2.prefix), a2 = o2 && Zi(n2, o2) || t2;
        if (!r2.hasType(a2)) throw Ji("unexpected element <" + e2.originalName + ">");
        return sr.prototype.createElement.call(this, e2);
      }, pr.prototype = Object.create(ar.prototype), pr.prototype.createElement = function(e2) {
        var t2 = e2.name, n2 = Ei(t2).prefix, i2 = e2.ns[n2 + "$uri"], r2 = e2.attributes;
        return this.model.createAny(t2, i2, r2);
      }, pr.prototype.handleChild = function(e2) {
        var t2 = new pr(this.model, "Element", this.context).handleNode(e2), n2 = this.element, i2 = t2.element;
        return void 0 !== i2 && ((n2.$children = n2.$children || []).push(i2), i2.$parent = n2), t2;
      }, pr.prototype.handleEnd = function() {
        this.body && (this.element.$body = this.body);
      }, cr.prototype.fromXML = function(e2, t2, n2) {
        var i2 = t2.rootHandler;
        t2 instanceof sr ? (i2 = t2, t2 = {}) : "string" == typeof t2 ? (i2 = this.handler(t2), t2 = {}) : "string" == typeof i2 && (i2 = this.handler(i2));
        var r2 = this.model, o2 = this.lax, a2 = new er(E({}, t2, { rootHandler: i2 })), s2 = new Hi({ proxy: true }), l2 = (function() {
          var e3 = [];
          return Object.defineProperty(e3, "peek", { value: function() {
            return this[this.length - 1];
          } }), e3;
        })();
        function p2(e3, t3, n3) {
          var i3 = t3(), r3 = i3.line, o3 = i3.column, s3 = i3.data;
          "<" === s3.charAt(0) && -1 !== s3.indexOf(" ") && (s3 = s3.slice(0, s3.indexOf(" ")) + ">");
          var l3 = "unparsable content " + (s3 ? s3 + " " : "") + "detected\n	line: " + r3 + "\n	column: " + o3 + "\n	nested error: " + e3.message;
          if (n3) return a2.addWarning({ message: l3, error: e3 }), true;
          throw Ji(l3);
        }
        function c2(e3, t3) {
          return p2(e3, t3, true);
        }
        i2.context = a2, l2.push(i2);
        var u2 = /^<\?xml /i, h2 = / encoding="([^"]+)"/i, f2 = /^utf-8$/i;
        function m2(e3, t3) {
          try {
            l2.peek().handleText(e3);
          } catch (e4) {
            c2(e4, t3);
          }
        }
        var d2 = r2.getPackages().reduce((function(e3, t3) {
          return e3[t3.uri] = t3.prefix, e3;
        }), { "http://www.w3.org/XML/1998/namespace": "xml" });
        return s2.ns(d2).on("openTag", (function(e3, t3, n3, i3) {
          var r3 = e3.attrs || {}, a3 = Object.keys(r3).reduce((function(e4, n4) {
            var i4 = t3(r3[n4]);
            return e4[n4] = i4, e4;
          }), {});
          !(function(e4, t4) {
            var n4 = l2.peek();
            try {
              l2.push(n4.handleNode(e4));
            } catch (e5) {
              p2(e5, t4, o2) && l2.push(new nr());
            }
          })({ name: e3.name, originalName: e3.originalName, attributes: a3, ns: e3.ns }, i3);
        })).on("question", (function(e3) {
          if (u2.test(e3)) {
            var t3 = h2.exec(e3), n3 = t3 && t3[1];
            n3 && !f2.test(n3) && a2.addWarning({ message: "unsupported document encoding <" + n3 + ">, falling back to UTF-8" });
          }
        })).on("closeTag", (function() {
          l2.pop().handleEnd();
        })).on("cdata", m2).on("text", (function(e3, t3, n3) {
          !(function(e4, t4) {
            e4.trim() && m2(e4, t4);
          })(t3(e3), n3);
        })).on("error", p2).on("warn", c2), new Promise((function(t3, n3) {
          var r3;
          try {
            s2.parse(e2), (function() {
              var e3, t4, n4 = a2.elementsById, i3 = a2.references;
              for (e3 = 0; t4 = i3[e3]; e3++) {
                var r4 = t4.element, o4 = n4[t4.id], s3 = Qi(r4).propertiesByName[t4.property];
                if (o4 || a2.addWarning({ message: "unresolved reference <" + t4.id + ">", element: t4.element, property: t4.property, value: t4.id }), s3.isMany) {
                  var l4 = r4.get(s3.name), p4 = l4.indexOf(t4);
                  -1 === p4 && (p4 = l4.length), o4 ? l4[p4] = o4 : l4.splice(p4, 1);
                } else r4.set(s3.name, o4);
              }
            })();
          } catch (e3) {
            r3 = e3;
          }
          var o3 = i2.element;
          r3 || o3 || (r3 = Ji("failed to parse document as <" + i2.type.$descriptor.name + ">"));
          var l3 = a2.warnings, p3 = a2.references, c3 = a2.elementsById;
          return r3 ? (r3.warnings = l3, n3(r3)) : t3({ rootElement: o3, elementsById: c3, references: p3, warnings: l3 });
        }));
      }, cr.prototype.handler = function(e2) {
        return new lr(this.model, e2);
      };
      var ur = /<|>|'|"|&|\n\r|\n/g, hr = /<|>|&/g;
      function fr(e2) {
        var t2 = {}, n2 = {}, i2 = {}, r2 = [], o2 = [];
        this.byUri = function(t3) {
          return n2[t3] || e2 && e2.byUri(t3);
        }, this.add = function(e3, t3) {
          n2[e3.uri] = e3, t3 ? r2.push(e3) : o2.push(e3), this.mapPrefix(e3.prefix, e3.uri);
        }, this.uriByPrefix = function(e3) {
          return t2[e3 || "xmlns"];
        }, this.mapPrefix = function(e3, n3) {
          t2[e3 || "xmlns"] = n3;
        }, this.getNSKey = function(e3) {
          return void 0 !== e3.prefix ? e3.uri + "|" + e3.prefix : e3.uri;
        }, this.logUsed = function(t3) {
          var n3 = t3.uri, r3 = this.getNSKey(t3);
          i2[r3] = this.byUri(n3), e2 && e2.logUsed(t3);
        }, this.getUsed = function(e3) {
          var t3 = this;
          return [].concat(r2, o2).filter((function(e4) {
            var n3 = t3.getNSKey(e4);
            return i2[n3];
          }));
        };
      }
      function mr(e2, t2) {
        return Ki(t2) ? (n2 = e2).charAt(0).toLowerCase() + n2.slice(1) : e2;
        var n2;
      }
      function dr(e2, t2) {
        e2.super_ = t2, e2.prototype = Object.create(t2.prototype, { constructor: { value: e2, enumerable: false, writable: true, configurable: true } });
      }
      function yr(e2) {
        return p(e2) ? e2 : (e2.prefix ? e2.prefix + ":" : "") + e2.localName;
      }
      var gr = { "\n": "#10", "\n\r": "#10", '"': "#34", "'": "#39", "<": "#60", ">": "#62", "&": "#38" }, vr = { "<": "lt", ">": "gt", "&": "amp" };
      function xr(e2, t2, n2) {
        return (e2 = p(e2) ? e2 : "" + e2).replace(t2, (function(e3) {
          return "&" + n2[e3] + ";";
        }));
      }
      function wr(e2) {
        this.tagName = e2;
      }
      function br() {
      }
      function Er(e2) {
        this.tagName = e2;
      }
      function _r(e2, t2) {
        this.body = [], this.attrs = [], this.parent = e2, this.propertyDescriptor = t2;
      }
      function Ar(e2, t2) {
        _r.call(this, e2, t2);
      }
      function Rr() {
        this.value = "", this.write = function(e2) {
          this.value += e2;
        };
      }
      function Sr(e2, t2) {
        var n2 = [""];
        this.append = function(t3) {
          return e2.write(t3), this;
        }, this.appendNewLine = function() {
          return t2 && e2.write("\n"), this;
        }, this.appendIndent = function() {
          return t2 && e2.write(n2.join("  ")), this;
        }, this.indent = function() {
          return n2.push(""), this;
        }, this.unindent = function() {
          return n2.pop(), this;
        };
      }
      function kr(e2) {
        return e2 = E({ format: false, preamble: true }, e2 || {}), { toXML: function(t2, n2) {
          var i2 = n2 || new Rr(), r2 = new Sr(i2, e2.format);
          if (e2.preamble && r2.append('<?xml version="1.0" encoding="UTF-8"?>\n'), new _r().build(t2).serializeTo(r2), !n2) return i2.value;
        } };
      }
      function Cr(e2, t2) {
        Mi.call(this, e2, t2);
      }
      wr.prototype.build = function(e2) {
        return this.element = e2, this;
      }, wr.prototype.serializeTo = function(e2) {
        e2.appendIndent().append("<" + this.tagName + ">" + this.element.id + "</" + this.tagName + ">").appendNewLine();
      }, br.prototype.serializeValue = br.prototype.serializeTo = function(e2) {
        e2.append(this.escape ? xr(this.value, hr, vr) : this.value);
      }, br.prototype.build = function(e2, t2) {
        return this.value = t2, "String" === e2.type && -1 !== t2.search(hr) && (this.escape = true), this;
      }, dr(Er, br), Er.prototype.serializeTo = function(e2) {
        e2.appendIndent().append("<" + this.tagName + ">"), this.serializeValue(e2), e2.append("</" + this.tagName + ">").appendNewLine();
      }, _r.prototype.build = function(e2) {
        this.element = e2;
        var t2, n2, i2 = e2.$descriptor, r2 = this.propertyDescriptor, o2 = i2.isGeneric;
        return t2 = o2 ? this.parseGeneric(e2) : this.parseNsAttributes(e2), this.ns = r2 ? this.nsPropertyTagName(r2) : this.nsTagName(i2), this.tagName = this.addTagName(this.ns), o2 || (n2 = (function(e3) {
          return h(e3.$descriptor.properties, (function(t3) {
            var n3 = t3.name;
            if (t3.isVirtual) return false;
            if (!c(e3, n3)) return false;
            var i3 = e3[n3];
            return i3 !== t3.default && null !== i3 && (!t3.isMany || i3.length);
          }));
        })(e2), this.parseAttributes(h(n2, (function(e3) {
          return e3.isAttr;
        }))), this.parseContainments((function(e3) {
          return h(e3, (function(e4) {
            return !e4.isAttr;
          }));
        })(n2))), this.parseGenericAttributes(e2, t2), this;
      }, _r.prototype.nsTagName = function(e2) {
        return (function(e3, t2) {
          return t2.isGeneric ? E({ localName: t2.ns.localName }, e3) : E({ localName: mr(t2.ns.localName, t2.$pkg) }, e3);
        })(this.logNamespaceUsed(e2.ns), e2);
      }, _r.prototype.nsPropertyTagName = function(e2) {
        return (function(e3, t2) {
          return E({ localName: t2.ns.localName }, e3);
        })(this.logNamespaceUsed(e2.ns), e2);
      }, _r.prototype.isLocalNs = function(e2) {
        return e2.uri === this.ns.uri;
      }, _r.prototype.nsAttributeName = function(e2) {
        var t2;
        if (t2 = p(e2) ? Ei(e2) : e2.ns, e2.inherited) return { localName: t2.localName };
        var n2 = this.logNamespaceUsed(t2);
        return this.getNamespaces().logUsed(n2), this.isLocalNs(n2) ? { localName: t2.localName } : E({ localName: t2.localName }, n2);
      }, _r.prototype.parseGeneric = function(e2) {
        var t2 = this, n2 = this.body, i2 = [];
        return f(e2, (function(r2, o2) {
          "$body" === o2 ? n2.push(new br().build({ type: "String" }, r2)) : "$children" === o2 ? f(r2, (function(e3) {
            n2.push(new _r(t2).build(e3));
          })) : 0 !== o2.indexOf("$") && t2.parseNsAttribute(e2, o2, r2) && i2.push({ name: o2, value: r2 });
        })), i2;
      }, _r.prototype.parseNsAttribute = function(e2, t2, n2) {
        var i2, r2 = e2.$model, o2 = Ei(t2);
        if ("xmlns" === o2.prefix && (i2 = { prefix: o2.localName, uri: n2 }), o2.prefix || "xmlns" !== o2.localName || (i2 = { uri: n2 }), !i2) return { name: t2, value: n2 };
        if (r2 && r2.getPackage(n2)) this.logNamespace(i2, true, true);
        else {
          var a2 = this.logNamespaceUsed(i2, true);
          this.getNamespaces().logUsed(a2);
        }
      }, _r.prototype.parseNsAttributes = function(e2, t2) {
        var n2 = this, i2 = e2.$attrs, r2 = [];
        return f(i2, (function(t3, i3) {
          var o2 = n2.parseNsAttribute(e2, i3, t3);
          o2 && r2.push(o2);
        })), r2;
      }, _r.prototype.parseGenericAttributes = function(e2, t2) {
        var n2 = this;
        f(t2, (function(t3) {
          if (t3.name !== qi) try {
            n2.addAttribute(n2.nsAttributeName(t3.name), t3.value);
          } catch (n3) {
            console.warn("missing namespace information for ", t3.name, "=", t3.value, "on", e2, n3);
          }
        }));
      }, _r.prototype.parseContainments = function(e2) {
        var t2 = this, n2 = this.body, i2 = this.element;
        f(e2, (function(e3) {
          var r2 = i2.get(e3.name), o2 = e3.isReference;
          if (e3.isMany || (r2 = [r2]), e3.isBody) n2.push(new br().build(e3, r2[0]));
          else if (bi(e3.type)) f(r2, (function(i3) {
            n2.push(new Er(t2.addTagName(t2.nsPropertyTagName(e3))).build(e3, i3));
          }));
          else if (o2) f(r2, (function(i3) {
            n2.push(new wr(t2.addTagName(t2.nsPropertyTagName(e3))).build(i3));
          }));
          else {
            var a2 = Xi(e3), s2 = (function(e4) {
              return "property" === Yi(e4);
            })(e3);
            f(r2, (function(i3) {
              var r3;
              r3 = a2 ? new Ar(t2, e3) : s2 ? new _r(t2, e3) : new _r(t2), n2.push(r3.build(i3));
            }));
          }
        }));
      }, _r.prototype.getNamespaces = function(e2) {
        var t2, n2 = this.namespaces, i2 = this.parent;
        return n2 || (t2 = i2 && i2.getNamespaces(), e2 || !t2 ? this.namespaces = n2 = new fr(t2) : n2 = t2), n2;
      }, _r.prototype.logNamespace = function(e2, t2, n2) {
        var i2 = this.getNamespaces(n2), r2 = e2.uri, o2 = e2.prefix;
        return i2.byUri(r2) && !n2 || i2.add(e2, t2), i2.mapPrefix(o2, r2), e2;
      }, _r.prototype.logNamespaceUsed = function(e2, t2) {
        var n2, i2, r2, o2 = this.element.$model, a2 = this.getNamespaces(t2), s2 = e2.prefix, l2 = e2.uri;
        if (!s2 && !l2) return { localName: e2.localName };
        if (r2 = Ui[s2] || o2 && (o2.getPackage(s2) || {}).uri, !(l2 = l2 || r2 || a2.uriByPrefix(s2))) throw new Error("no namespace uri given for prefix <" + s2 + ">");
        if (!(e2 = a2.byUri(l2))) {
          for (n2 = s2, i2 = 1; a2.uriByPrefix(n2); ) n2 = s2 + "_" + i2++;
          e2 = this.logNamespace({ prefix: n2, uri: l2 }, r2 === l2);
        }
        return s2 && a2.mapPrefix(s2, l2), e2;
      }, _r.prototype.parseAttributes = function(e2) {
        var t2 = this, n2 = this.element;
        f(e2, (function(e3) {
          var i2 = n2.get(e3.name);
          if (e3.isReference) if (e3.isMany) {
            var r2 = [];
            f(i2, (function(e4) {
              r2.push(e4.id);
            })), i2 = r2.join(" ");
          } else i2 = i2.id;
          t2.addAttribute(t2.nsAttributeName(e3), i2);
        }));
      }, _r.prototype.addTagName = function(e2) {
        var t2 = this.logNamespaceUsed(e2);
        return this.getNamespaces().logUsed(t2), yr(e2);
      }, _r.prototype.addAttribute = function(e2, t2) {
        var n2 = this.attrs;
        p(t2) && (t2 = xr(t2, ur, gr));
        var i2 = (function(e3, t3) {
          const n3 = v(t3);
          let i3 = o(e3) ? -1 : void 0;
          return f(e3, (function(e4, t4) {
            if (n3(e4, t4)) return i3 = t4, false;
          })), i3;
        })(n2, (function(t3) {
          return t3.name.localName === e2.localName && t3.name.uri === e2.uri && t3.name.prefix === e2.prefix;
        })), r2 = { name: e2, value: t2 };
        -1 !== i2 ? n2.splice(i2, 1, r2) : n2.push(r2);
      }, _r.prototype.serializeAttributes = function(e2) {
        var t2 = this.attrs, n2 = this.namespaces;
        n2 && (t2 = (function(e3) {
          return e3.getUsed().filter((function(e4) {
            return "xml" !== e4.prefix;
          })).map((function(e4) {
            return { name: "xmlns" + (e4.prefix ? ":" + e4.prefix : ""), value: e4.uri };
          }));
        })(n2).concat(t2)), f(t2, (function(t3) {
          e2.append(" ").append(yr(t3.name)).append('="').append(t3.value).append('"');
        }));
      }, _r.prototype.serializeTo = function(e2) {
        var t2 = this.body[0], n2 = t2 && t2.constructor !== br;
        e2.appendIndent().append("<" + this.tagName), this.serializeAttributes(e2), e2.append(t2 ? ">" : " />"), t2 && (n2 && e2.appendNewLine().indent(), f(this.body, (function(t3) {
          t3.serializeTo(e2);
        })), n2 && e2.unindent().appendIndent(), e2.append("</" + this.tagName + ">")), e2.appendNewLine();
      }, dr(Ar, _r), Ar.prototype.parseNsAttributes = function(e2) {
        var t2 = _r.prototype.parseNsAttributes.call(this, e2), n2 = e2.$descriptor;
        if (n2.name === this.propertyDescriptor.type) return t2;
        var i2 = this.typeNs = this.nsTagName(n2);
        this.getNamespaces().logUsed(this.typeNs);
        var r2 = e2.$model.getPackage(i2.uri), o2 = r2.xml && r2.xml.typePrefix || "";
        return this.addAttribute(this.nsAttributeName(qi), (i2.prefix ? i2.prefix + ":" : "") + o2 + n2.ns.localName), t2;
      }, Ar.prototype.isLocalNs = function(e2) {
        return e2.uri === (this.typeNs || this.ns).uri;
      }, Cr.prototype = Object.create(Mi.prototype), Cr.prototype.fromXML = function(e2, t2, n2) {
        p(t2) || (n2 = t2, t2 = "bpmn:Definitions");
        var i2 = new cr(E({ model: this, lax: true }, n2)), r2 = i2.handler(t2);
        return i2.fromXML(e2, r2);
      }, Cr.prototype.toXML = function(e2, t2) {
        var n2 = new kr(t2);
        return new Promise((function(t3, i2) {
          try {
            return t3({ xml: n2.toXML(e2) });
          } catch (e3) {
            return i2(e3);
          }
        }));
      };
      var Mr = { bpmn: { name: "BPMN20", uri: "http://www.omg.org/spec/BPMN/20100524/MODEL", prefix: "bpmn", associations: [], types: [{ name: "Interface", superClass: ["RootElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "operations", type: "Operation", isMany: true }, { name: "implementationRef", isAttr: true, type: "String" }] }, { name: "Operation", superClass: ["BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "inMessageRef", type: "Message", isReference: true }, { name: "outMessageRef", type: "Message", isReference: true }, { name: "errorRef", type: "Error", isMany: true, isReference: true }, { name: "implementationRef", isAttr: true, type: "String" }] }, { name: "EndPoint", superClass: ["RootElement"] }, { name: "Auditing", superClass: ["BaseElement"] }, { name: "GlobalTask", superClass: ["CallableElement"], properties: [{ name: "resources", type: "ResourceRole", isMany: true }] }, { name: "Monitoring", superClass: ["BaseElement"] }, { name: "Performer", superClass: ["ResourceRole"] }, { name: "Process", superClass: ["FlowElementsContainer", "CallableElement"], properties: [{ name: "processType", type: "ProcessType", isAttr: true }, { name: "isClosed", isAttr: true, type: "Boolean" }, { name: "auditing", type: "Auditing" }, { name: "monitoring", type: "Monitoring" }, { name: "properties", type: "Property", isMany: true }, { name: "laneSets", isMany: true, replaces: "FlowElementsContainer#laneSets", type: "LaneSet" }, { name: "flowElements", isMany: true, replaces: "FlowElementsContainer#flowElements", type: "FlowElement" }, { name: "artifacts", type: "Artifact", isMany: true }, { name: "resources", type: "ResourceRole", isMany: true }, { name: "correlationSubscriptions", type: "CorrelationSubscription", isMany: true }, { name: "supports", type: "Process", isMany: true, isReference: true }, { name: "definitionalCollaborationRef", type: "Collaboration", isAttr: true, isReference: true }, { name: "isExecutable", isAttr: true, type: "Boolean" }] }, { name: "LaneSet", superClass: ["BaseElement"], properties: [{ name: "lanes", type: "Lane", isMany: true }, { name: "name", isAttr: true, type: "String" }] }, { name: "Lane", superClass: ["BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "partitionElementRef", type: "BaseElement", isAttr: true, isReference: true }, { name: "partitionElement", type: "BaseElement" }, { name: "flowNodeRef", type: "FlowNode", isMany: true, isReference: true }, { name: "childLaneSet", type: "LaneSet", xml: { serialize: "xsi:type" } }] }, { name: "GlobalManualTask", superClass: ["GlobalTask"] }, { name: "ManualTask", superClass: ["Task"] }, { name: "UserTask", superClass: ["Task"], properties: [{ name: "renderings", type: "Rendering", isMany: true }, { name: "implementation", isAttr: true, type: "String" }] }, { name: "Rendering", superClass: ["BaseElement"] }, { name: "HumanPerformer", superClass: ["Performer"] }, { name: "PotentialOwner", superClass: ["HumanPerformer"] }, { name: "GlobalUserTask", superClass: ["GlobalTask"], properties: [{ name: "implementation", isAttr: true, type: "String" }, { name: "renderings", type: "Rendering", isMany: true }] }, { name: "Gateway", isAbstract: true, superClass: ["FlowNode"], properties: [{ name: "gatewayDirection", type: "GatewayDirection", default: "Unspecified", isAttr: true }] }, { name: "EventBasedGateway", superClass: ["Gateway"], properties: [{ name: "instantiate", default: false, isAttr: true, type: "Boolean" }, { name: "eventGatewayType", type: "EventBasedGatewayType", isAttr: true, default: "Exclusive" }] }, { name: "ComplexGateway", superClass: ["Gateway"], properties: [{ name: "activationCondition", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "default", type: "SequenceFlow", isAttr: true, isReference: true }] }, { name: "ExclusiveGateway", superClass: ["Gateway"], properties: [{ name: "default", type: "SequenceFlow", isAttr: true, isReference: true }] }, { name: "InclusiveGateway", superClass: ["Gateway"], properties: [{ name: "default", type: "SequenceFlow", isAttr: true, isReference: true }] }, { name: "ParallelGateway", superClass: ["Gateway"] }, { name: "RootElement", isAbstract: true, superClass: ["BaseElement"] }, { name: "Relationship", superClass: ["BaseElement"], properties: [{ name: "type", isAttr: true, type: "String" }, { name: "direction", type: "RelationshipDirection", isAttr: true }, { name: "source", isMany: true, isReference: true, type: "Element" }, { name: "target", isMany: true, isReference: true, type: "Element" }] }, { name: "BaseElement", isAbstract: true, properties: [{ name: "id", isAttr: true, type: "String", isId: true }, { name: "documentation", type: "Documentation", isMany: true }, { name: "extensionDefinitions", type: "ExtensionDefinition", isMany: true, isReference: true }, { name: "extensionElements", type: "ExtensionElements" }] }, { name: "Extension", properties: [{ name: "mustUnderstand", default: false, isAttr: true, type: "Boolean" }, { name: "definition", type: "ExtensionDefinition", isAttr: true, isReference: true }] }, { name: "ExtensionDefinition", properties: [{ name: "name", isAttr: true, type: "String" }, { name: "extensionAttributeDefinitions", type: "ExtensionAttributeDefinition", isMany: true }] }, { name: "ExtensionAttributeDefinition", properties: [{ name: "name", isAttr: true, type: "String" }, { name: "type", isAttr: true, type: "String" }, { name: "isReference", default: false, isAttr: true, type: "Boolean" }, { name: "extensionDefinition", type: "ExtensionDefinition", isAttr: true, isReference: true }] }, { name: "ExtensionElements", properties: [{ name: "valueRef", isAttr: true, isReference: true, type: "Element" }, { name: "values", type: "Element", isMany: true }, { name: "extensionAttributeDefinition", type: "ExtensionAttributeDefinition", isAttr: true, isReference: true }] }, { name: "Documentation", superClass: ["BaseElement"], properties: [{ name: "text", type: "String", isBody: true }, { name: "textFormat", default: "text/plain", isAttr: true, type: "String" }] }, { name: "Event", isAbstract: true, superClass: ["FlowNode", "InteractionNode"], properties: [{ name: "properties", type: "Property", isMany: true }] }, { name: "IntermediateCatchEvent", superClass: ["CatchEvent"] }, { name: "IntermediateThrowEvent", superClass: ["ThrowEvent"] }, { name: "EndEvent", superClass: ["ThrowEvent"] }, { name: "StartEvent", superClass: ["CatchEvent"], properties: [{ name: "isInterrupting", default: true, isAttr: true, type: "Boolean" }] }, { name: "ThrowEvent", isAbstract: true, superClass: ["Event"], properties: [{ name: "dataInputs", type: "DataInput", isMany: true }, { name: "dataInputAssociations", type: "DataInputAssociation", isMany: true }, { name: "inputSet", type: "InputSet" }, { name: "eventDefinitions", type: "EventDefinition", isMany: true }, { name: "eventDefinitionRef", type: "EventDefinition", isMany: true, isReference: true }] }, { name: "CatchEvent", isAbstract: true, superClass: ["Event"], properties: [{ name: "parallelMultiple", isAttr: true, type: "Boolean", default: false }, { name: "dataOutputs", type: "DataOutput", isMany: true }, { name: "dataOutputAssociations", type: "DataOutputAssociation", isMany: true }, { name: "outputSet", type: "OutputSet" }, { name: "eventDefinitions", type: "EventDefinition", isMany: true }, { name: "eventDefinitionRef", type: "EventDefinition", isMany: true, isReference: true }] }, { name: "BoundaryEvent", superClass: ["CatchEvent"], properties: [{ name: "cancelActivity", default: true, isAttr: true, type: "Boolean" }, { name: "attachedToRef", type: "Activity", isAttr: true, isReference: true }] }, { name: "EventDefinition", isAbstract: true, superClass: ["RootElement"] }, { name: "CancelEventDefinition", superClass: ["EventDefinition"] }, { name: "ErrorEventDefinition", superClass: ["EventDefinition"], properties: [{ name: "errorRef", type: "Error", isAttr: true, isReference: true }] }, { name: "TerminateEventDefinition", superClass: ["EventDefinition"] }, { name: "EscalationEventDefinition", superClass: ["EventDefinition"], properties: [{ name: "escalationRef", type: "Escalation", isAttr: true, isReference: true }] }, { name: "Escalation", properties: [{ name: "structureRef", type: "ItemDefinition", isAttr: true, isReference: true }, { name: "name", isAttr: true, type: "String" }, { name: "escalationCode", isAttr: true, type: "String" }], superClass: ["RootElement"] }, { name: "CompensateEventDefinition", superClass: ["EventDefinition"], properties: [{ name: "waitForCompletion", isAttr: true, type: "Boolean", default: true }, { name: "activityRef", type: "Activity", isAttr: true, isReference: true }] }, { name: "TimerEventDefinition", superClass: ["EventDefinition"], properties: [{ name: "timeDate", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "timeCycle", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "timeDuration", type: "Expression", xml: { serialize: "xsi:type" } }] }, { name: "LinkEventDefinition", superClass: ["EventDefinition"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "target", type: "LinkEventDefinition", isReference: true }, { name: "source", type: "LinkEventDefinition", isMany: true, isReference: true }] }, { name: "MessageEventDefinition", superClass: ["EventDefinition"], properties: [{ name: "messageRef", type: "Message", isAttr: true, isReference: true }, { name: "operationRef", type: "Operation", isAttr: true, isReference: true }] }, { name: "ConditionalEventDefinition", superClass: ["EventDefinition"], properties: [{ name: "condition", type: "Expression", xml: { serialize: "xsi:type" } }] }, { name: "SignalEventDefinition", superClass: ["EventDefinition"], properties: [{ name: "signalRef", type: "Signal", isAttr: true, isReference: true }] }, { name: "Signal", superClass: ["RootElement"], properties: [{ name: "structureRef", type: "ItemDefinition", isAttr: true, isReference: true }, { name: "name", isAttr: true, type: "String" }] }, { name: "ImplicitThrowEvent", superClass: ["ThrowEvent"] }, { name: "DataState", superClass: ["BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }] }, { name: "ItemAwareElement", superClass: ["BaseElement"], properties: [{ name: "itemSubjectRef", type: "ItemDefinition", isAttr: true, isReference: true }, { name: "dataState", type: "DataState" }] }, { name: "DataAssociation", superClass: ["BaseElement"], properties: [{ name: "sourceRef", type: "ItemAwareElement", isMany: true, isReference: true }, { name: "targetRef", type: "ItemAwareElement", isReference: true }, { name: "transformation", type: "FormalExpression", xml: { serialize: "property" } }, { name: "assignment", type: "Assignment", isMany: true }] }, { name: "DataInput", superClass: ["ItemAwareElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "isCollection", default: false, isAttr: true, type: "Boolean" }, { name: "inputSetRef", type: "InputSet", isMany: true, isVirtual: true, isReference: true }, { name: "inputSetWithOptional", type: "InputSet", isMany: true, isVirtual: true, isReference: true }, { name: "inputSetWithWhileExecuting", type: "InputSet", isMany: true, isVirtual: true, isReference: true }] }, { name: "DataOutput", superClass: ["ItemAwareElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "isCollection", default: false, isAttr: true, type: "Boolean" }, { name: "outputSetRef", type: "OutputSet", isMany: true, isVirtual: true, isReference: true }, { name: "outputSetWithOptional", type: "OutputSet", isMany: true, isVirtual: true, isReference: true }, { name: "outputSetWithWhileExecuting", type: "OutputSet", isMany: true, isVirtual: true, isReference: true }] }, { name: "InputSet", superClass: ["BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "dataInputRefs", type: "DataInput", isMany: true, isReference: true }, { name: "optionalInputRefs", type: "DataInput", isMany: true, isReference: true }, { name: "whileExecutingInputRefs", type: "DataInput", isMany: true, isReference: true }, { name: "outputSetRefs", type: "OutputSet", isMany: true, isReference: true }] }, { name: "OutputSet", superClass: ["BaseElement"], properties: [{ name: "dataOutputRefs", type: "DataOutput", isMany: true, isReference: true }, { name: "name", isAttr: true, type: "String" }, { name: "inputSetRefs", type: "InputSet", isMany: true, isReference: true }, { name: "optionalOutputRefs", type: "DataOutput", isMany: true, isReference: true }, { name: "whileExecutingOutputRefs", type: "DataOutput", isMany: true, isReference: true }] }, { name: "Property", superClass: ["ItemAwareElement"], properties: [{ name: "name", isAttr: true, type: "String" }] }, { name: "DataInputAssociation", superClass: ["DataAssociation"] }, { name: "DataOutputAssociation", superClass: ["DataAssociation"] }, { name: "InputOutputSpecification", superClass: ["BaseElement"], properties: [{ name: "dataInputs", type: "DataInput", isMany: true }, { name: "dataOutputs", type: "DataOutput", isMany: true }, { name: "inputSets", type: "InputSet", isMany: true }, { name: "outputSets", type: "OutputSet", isMany: true }] }, { name: "DataObject", superClass: ["FlowElement", "ItemAwareElement"], properties: [{ name: "isCollection", default: false, isAttr: true, type: "Boolean" }] }, { name: "InputOutputBinding", properties: [{ name: "inputDataRef", type: "InputSet", isAttr: true, isReference: true }, { name: "outputDataRef", type: "OutputSet", isAttr: true, isReference: true }, { name: "operationRef", type: "Operation", isAttr: true, isReference: true }] }, { name: "Assignment", superClass: ["BaseElement"], properties: [{ name: "from", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "to", type: "Expression", xml: { serialize: "xsi:type" } }] }, { name: "DataStore", superClass: ["RootElement", "ItemAwareElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "capacity", isAttr: true, type: "Integer" }, { name: "isUnlimited", default: true, isAttr: true, type: "Boolean" }] }, { name: "DataStoreReference", superClass: ["ItemAwareElement", "FlowElement"], properties: [{ name: "dataStoreRef", type: "DataStore", isAttr: true, isReference: true }] }, { name: "DataObjectReference", superClass: ["ItemAwareElement", "FlowElement"], properties: [{ name: "dataObjectRef", type: "DataObject", isAttr: true, isReference: true }] }, { name: "ConversationLink", superClass: ["BaseElement"], properties: [{ name: "sourceRef", type: "InteractionNode", isAttr: true, isReference: true }, { name: "targetRef", type: "InteractionNode", isAttr: true, isReference: true }, { name: "name", isAttr: true, type: "String" }] }, { name: "ConversationAssociation", superClass: ["BaseElement"], properties: [{ name: "innerConversationNodeRef", type: "ConversationNode", isAttr: true, isReference: true }, { name: "outerConversationNodeRef", type: "ConversationNode", isAttr: true, isReference: true }] }, { name: "CallConversation", superClass: ["ConversationNode"], properties: [{ name: "calledCollaborationRef", type: "Collaboration", isAttr: true, isReference: true }, { name: "participantAssociations", type: "ParticipantAssociation", isMany: true }] }, { name: "Conversation", superClass: ["ConversationNode"] }, { name: "SubConversation", superClass: ["ConversationNode"], properties: [{ name: "conversationNodes", type: "ConversationNode", isMany: true }] }, { name: "ConversationNode", isAbstract: true, superClass: ["InteractionNode", "BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "participantRef", type: "Participant", isMany: true, isReference: true }, { name: "messageFlowRefs", type: "MessageFlow", isMany: true, isReference: true }, { name: "correlationKeys", type: "CorrelationKey", isMany: true }] }, { name: "GlobalConversation", superClass: ["Collaboration"] }, { name: "PartnerEntity", superClass: ["RootElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "participantRef", type: "Participant", isMany: true, isReference: true }] }, { name: "PartnerRole", superClass: ["RootElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "participantRef", type: "Participant", isMany: true, isReference: true }] }, { name: "CorrelationProperty", superClass: ["RootElement"], properties: [{ name: "correlationPropertyRetrievalExpression", type: "CorrelationPropertyRetrievalExpression", isMany: true }, { name: "name", isAttr: true, type: "String" }, { name: "type", type: "ItemDefinition", isAttr: true, isReference: true }] }, { name: "Error", superClass: ["RootElement"], properties: [{ name: "structureRef", type: "ItemDefinition", isAttr: true, isReference: true }, { name: "name", isAttr: true, type: "String" }, { name: "errorCode", isAttr: true, type: "String" }] }, { name: "CorrelationKey", superClass: ["BaseElement"], properties: [{ name: "correlationPropertyRef", type: "CorrelationProperty", isMany: true, isReference: true }, { name: "name", isAttr: true, type: "String" }] }, { name: "Expression", superClass: ["BaseElement"], isAbstract: false, properties: [{ name: "body", isBody: true, type: "String" }] }, { name: "FormalExpression", superClass: ["Expression"], properties: [{ name: "language", isAttr: true, type: "String" }, { name: "evaluatesToTypeRef", type: "ItemDefinition", isAttr: true, isReference: true }] }, { name: "Message", superClass: ["RootElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "itemRef", type: "ItemDefinition", isAttr: true, isReference: true }] }, { name: "ItemDefinition", superClass: ["RootElement"], properties: [{ name: "itemKind", type: "ItemKind", isAttr: true }, { name: "structureRef", isAttr: true, type: "String" }, { name: "isCollection", default: false, isAttr: true, type: "Boolean" }, { name: "import", type: "Import", isAttr: true, isReference: true }] }, { name: "FlowElement", isAbstract: true, superClass: ["BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "auditing", type: "Auditing" }, { name: "monitoring", type: "Monitoring" }, { name: "categoryValueRef", type: "CategoryValue", isMany: true, isReference: true }] }, { name: "SequenceFlow", superClass: ["FlowElement"], properties: [{ name: "isImmediate", isAttr: true, type: "Boolean" }, { name: "conditionExpression", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "sourceRef", type: "FlowNode", isAttr: true, isReference: true }, { name: "targetRef", type: "FlowNode", isAttr: true, isReference: true }] }, { name: "FlowElementsContainer", isAbstract: true, superClass: ["BaseElement"], properties: [{ name: "laneSets", type: "LaneSet", isMany: true }, { name: "flowElements", type: "FlowElement", isMany: true }] }, { name: "CallableElement", isAbstract: true, superClass: ["RootElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "ioSpecification", type: "InputOutputSpecification", xml: { serialize: "property" } }, { name: "supportedInterfaceRef", type: "Interface", isMany: true, isReference: true }, { name: "ioBinding", type: "InputOutputBinding", isMany: true, xml: { serialize: "property" } }] }, { name: "FlowNode", isAbstract: true, superClass: ["FlowElement"], properties: [{ name: "incoming", type: "SequenceFlow", isMany: true, isReference: true }, { name: "outgoing", type: "SequenceFlow", isMany: true, isReference: true }, { name: "lanes", type: "Lane", isMany: true, isVirtual: true, isReference: true }] }, { name: "CorrelationPropertyRetrievalExpression", superClass: ["BaseElement"], properties: [{ name: "messagePath", type: "FormalExpression" }, { name: "messageRef", type: "Message", isAttr: true, isReference: true }] }, { name: "CorrelationPropertyBinding", superClass: ["BaseElement"], properties: [{ name: "dataPath", type: "FormalExpression" }, { name: "correlationPropertyRef", type: "CorrelationProperty", isAttr: true, isReference: true }] }, { name: "Resource", superClass: ["RootElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "resourceParameters", type: "ResourceParameter", isMany: true }] }, { name: "ResourceParameter", superClass: ["BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "isRequired", isAttr: true, type: "Boolean" }, { name: "type", type: "ItemDefinition", isAttr: true, isReference: true }] }, { name: "CorrelationSubscription", superClass: ["BaseElement"], properties: [{ name: "correlationKeyRef", type: "CorrelationKey", isAttr: true, isReference: true }, { name: "correlationPropertyBinding", type: "CorrelationPropertyBinding", isMany: true }] }, { name: "MessageFlow", superClass: ["BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "sourceRef", type: "InteractionNode", isAttr: true, isReference: true }, { name: "targetRef", type: "InteractionNode", isAttr: true, isReference: true }, { name: "messageRef", type: "Message", isAttr: true, isReference: true }] }, { name: "MessageFlowAssociation", superClass: ["BaseElement"], properties: [{ name: "innerMessageFlowRef", type: "MessageFlow", isAttr: true, isReference: true }, { name: "outerMessageFlowRef", type: "MessageFlow", isAttr: true, isReference: true }] }, { name: "InteractionNode", isAbstract: true, properties: [{ name: "incomingConversationLinks", type: "ConversationLink", isMany: true, isVirtual: true, isReference: true }, { name: "outgoingConversationLinks", type: "ConversationLink", isMany: true, isVirtual: true, isReference: true }] }, { name: "Participant", superClass: ["InteractionNode", "BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "interfaceRef", type: "Interface", isMany: true, isReference: true }, { name: "participantMultiplicity", type: "ParticipantMultiplicity" }, { name: "endPointRefs", type: "EndPoint", isMany: true, isReference: true }, { name: "processRef", type: "Process", isAttr: true, isReference: true }] }, { name: "ParticipantAssociation", superClass: ["BaseElement"], properties: [{ name: "innerParticipantRef", type: "Participant", isAttr: true, isReference: true }, { name: "outerParticipantRef", type: "Participant", isAttr: true, isReference: true }] }, { name: "ParticipantMultiplicity", properties: [{ name: "minimum", default: 0, isAttr: true, type: "Integer" }, { name: "maximum", default: 1, isAttr: true, type: "Integer" }], superClass: ["BaseElement"] }, { name: "Collaboration", superClass: ["RootElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "isClosed", isAttr: true, type: "Boolean" }, { name: "participants", type: "Participant", isMany: true }, { name: "messageFlows", type: "MessageFlow", isMany: true }, { name: "artifacts", type: "Artifact", isMany: true }, { name: "conversations", type: "ConversationNode", isMany: true }, { name: "conversationAssociations", type: "ConversationAssociation" }, { name: "participantAssociations", type: "ParticipantAssociation", isMany: true }, { name: "messageFlowAssociations", type: "MessageFlowAssociation", isMany: true }, { name: "correlationKeys", type: "CorrelationKey", isMany: true }, { name: "choreographyRef", type: "Choreography", isMany: true, isReference: true }, { name: "conversationLinks", type: "ConversationLink", isMany: true }] }, { name: "ChoreographyActivity", isAbstract: true, superClass: ["FlowNode"], properties: [{ name: "participantRef", type: "Participant", isMany: true, isReference: true }, { name: "initiatingParticipantRef", type: "Participant", isAttr: true, isReference: true }, { name: "correlationKeys", type: "CorrelationKey", isMany: true }, { name: "loopType", type: "ChoreographyLoopType", default: "None", isAttr: true }] }, { name: "CallChoreography", superClass: ["ChoreographyActivity"], properties: [{ name: "calledChoreographyRef", type: "Choreography", isAttr: true, isReference: true }, { name: "participantAssociations", type: "ParticipantAssociation", isMany: true }] }, { name: "SubChoreography", superClass: ["ChoreographyActivity", "FlowElementsContainer"], properties: [{ name: "artifacts", type: "Artifact", isMany: true }] }, { name: "ChoreographyTask", superClass: ["ChoreographyActivity"], properties: [{ name: "messageFlowRef", type: "MessageFlow", isMany: true, isReference: true }] }, { name: "Choreography", superClass: ["Collaboration", "FlowElementsContainer"] }, { name: "GlobalChoreographyTask", superClass: ["Choreography"], properties: [{ name: "initiatingParticipantRef", type: "Participant", isAttr: true, isReference: true }] }, { name: "TextAnnotation", superClass: ["Artifact"], properties: [{ name: "text", type: "String" }, { name: "textFormat", default: "text/plain", isAttr: true, type: "String" }] }, { name: "Group", superClass: ["Artifact"], properties: [{ name: "categoryValueRef", type: "CategoryValue", isAttr: true, isReference: true }] }, { name: "Association", superClass: ["Artifact"], properties: [{ name: "associationDirection", type: "AssociationDirection", isAttr: true }, { name: "sourceRef", type: "BaseElement", isAttr: true, isReference: true }, { name: "targetRef", type: "BaseElement", isAttr: true, isReference: true }] }, { name: "Category", superClass: ["RootElement"], properties: [{ name: "categoryValue", type: "CategoryValue", isMany: true }, { name: "name", isAttr: true, type: "String" }] }, { name: "Artifact", isAbstract: true, superClass: ["BaseElement"] }, { name: "CategoryValue", superClass: ["BaseElement"], properties: [{ name: "categorizedFlowElements", type: "FlowElement", isMany: true, isVirtual: true, isReference: true }, { name: "value", isAttr: true, type: "String" }] }, { name: "Activity", isAbstract: true, superClass: ["FlowNode"], properties: [{ name: "isForCompensation", default: false, isAttr: true, type: "Boolean" }, { name: "default", type: "SequenceFlow", isAttr: true, isReference: true }, { name: "ioSpecification", type: "InputOutputSpecification", xml: { serialize: "property" } }, { name: "boundaryEventRefs", type: "BoundaryEvent", isMany: true, isReference: true }, { name: "properties", type: "Property", isMany: true }, { name: "dataInputAssociations", type: "DataInputAssociation", isMany: true }, { name: "dataOutputAssociations", type: "DataOutputAssociation", isMany: true }, { name: "startQuantity", default: 1, isAttr: true, type: "Integer" }, { name: "resources", type: "ResourceRole", isMany: true }, { name: "completionQuantity", default: 1, isAttr: true, type: "Integer" }, { name: "loopCharacteristics", type: "LoopCharacteristics" }] }, { name: "ServiceTask", superClass: ["Task"], properties: [{ name: "implementation", isAttr: true, type: "String" }, { name: "operationRef", type: "Operation", isAttr: true, isReference: true }] }, { name: "SubProcess", superClass: ["Activity", "FlowElementsContainer", "InteractionNode"], properties: [{ name: "triggeredByEvent", default: false, isAttr: true, type: "Boolean" }, { name: "artifacts", type: "Artifact", isMany: true }] }, { name: "LoopCharacteristics", isAbstract: true, superClass: ["BaseElement"] }, { name: "MultiInstanceLoopCharacteristics", superClass: ["LoopCharacteristics"], properties: [{ name: "isSequential", default: false, isAttr: true, type: "Boolean" }, { name: "behavior", type: "MultiInstanceBehavior", default: "All", isAttr: true }, { name: "loopCardinality", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "loopDataInputRef", type: "ItemAwareElement", isReference: true }, { name: "loopDataOutputRef", type: "ItemAwareElement", isReference: true }, { name: "inputDataItem", type: "DataInput", xml: { serialize: "property" } }, { name: "outputDataItem", type: "DataOutput", xml: { serialize: "property" } }, { name: "complexBehaviorDefinition", type: "ComplexBehaviorDefinition", isMany: true }, { name: "completionCondition", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "oneBehaviorEventRef", type: "EventDefinition", isAttr: true, isReference: true }, { name: "noneBehaviorEventRef", type: "EventDefinition", isAttr: true, isReference: true }] }, { name: "StandardLoopCharacteristics", superClass: ["LoopCharacteristics"], properties: [{ name: "testBefore", default: false, isAttr: true, type: "Boolean" }, { name: "loopCondition", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "loopMaximum", type: "Integer", isAttr: true }] }, { name: "CallActivity", superClass: ["Activity", "InteractionNode"], properties: [{ name: "calledElement", type: "String", isAttr: true }] }, { name: "Task", superClass: ["Activity", "InteractionNode"] }, { name: "SendTask", superClass: ["Task"], properties: [{ name: "implementation", isAttr: true, type: "String" }, { name: "operationRef", type: "Operation", isAttr: true, isReference: true }, { name: "messageRef", type: "Message", isAttr: true, isReference: true }] }, { name: "ReceiveTask", superClass: ["Task"], properties: [{ name: "implementation", isAttr: true, type: "String" }, { name: "instantiate", default: false, isAttr: true, type: "Boolean" }, { name: "operationRef", type: "Operation", isAttr: true, isReference: true }, { name: "messageRef", type: "Message", isAttr: true, isReference: true }] }, { name: "ScriptTask", superClass: ["Task"], properties: [{ name: "scriptFormat", isAttr: true, type: "String" }, { name: "script", type: "String" }] }, { name: "BusinessRuleTask", superClass: ["Task"], properties: [{ name: "implementation", isAttr: true, type: "String" }] }, { name: "AdHocSubProcess", superClass: ["SubProcess"], properties: [{ name: "completionCondition", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "ordering", type: "AdHocOrdering", isAttr: true }, { name: "cancelRemainingInstances", default: true, isAttr: true, type: "Boolean" }] }, { name: "Transaction", superClass: ["SubProcess"], properties: [{ name: "protocol", isAttr: true, type: "String" }, { name: "method", isAttr: true, type: "String" }] }, { name: "GlobalScriptTask", superClass: ["GlobalTask"], properties: [{ name: "scriptLanguage", isAttr: true, type: "String" }, { name: "script", isAttr: true, type: "String" }] }, { name: "GlobalBusinessRuleTask", superClass: ["GlobalTask"], properties: [{ name: "implementation", isAttr: true, type: "String" }] }, { name: "ComplexBehaviorDefinition", superClass: ["BaseElement"], properties: [{ name: "condition", type: "FormalExpression" }, { name: "event", type: "ImplicitThrowEvent" }] }, { name: "ResourceRole", superClass: ["BaseElement"], properties: [{ name: "resourceRef", type: "Resource", isReference: true }, { name: "resourceParameterBindings", type: "ResourceParameterBinding", isMany: true }, { name: "resourceAssignmentExpression", type: "ResourceAssignmentExpression" }, { name: "name", isAttr: true, type: "String" }] }, { name: "ResourceParameterBinding", properties: [{ name: "expression", type: "Expression", xml: { serialize: "xsi:type" } }, { name: "parameterRef", type: "ResourceParameter", isAttr: true, isReference: true }], superClass: ["BaseElement"] }, { name: "ResourceAssignmentExpression", properties: [{ name: "expression", type: "Expression", xml: { serialize: "xsi:type" } }], superClass: ["BaseElement"] }, { name: "Import", properties: [{ name: "importType", isAttr: true, type: "String" }, { name: "location", isAttr: true, type: "String" }, { name: "namespace", isAttr: true, type: "String" }] }, { name: "Definitions", superClass: ["BaseElement"], properties: [{ name: "name", isAttr: true, type: "String" }, { name: "targetNamespace", isAttr: true, type: "String" }, { name: "expressionLanguage", default: "http://www.w3.org/1999/XPath", isAttr: true, type: "String" }, { name: "typeLanguage", default: "http://www.w3.org/2001/XMLSchema", isAttr: true, type: "String" }, { name: "imports", type: "Import", isMany: true }, { name: "extensions", type: "Extension", isMany: true }, { name: "rootElements", type: "RootElement", isMany: true }, { name: "diagrams", isMany: true, type: "bpmndi:BPMNDiagram" }, { name: "exporter", isAttr: true, type: "String" }, { name: "relationships", type: "Relationship", isMany: true }, { name: "exporterVersion", isAttr: true, type: "String" }] }], enumerations: [{ name: "ProcessType", literalValues: [{ name: "None" }, { name: "Public" }, { name: "Private" }] }, { name: "GatewayDirection", literalValues: [{ name: "Unspecified" }, { name: "Converging" }, { name: "Diverging" }, { name: "Mixed" }] }, { name: "EventBasedGatewayType", literalValues: [{ name: "Parallel" }, { name: "Exclusive" }] }, { name: "RelationshipDirection", literalValues: [{ name: "None" }, { name: "Forward" }, { name: "Backward" }, { name: "Both" }] }, { name: "ItemKind", literalValues: [{ name: "Physical" }, { name: "Information" }] }, { name: "ChoreographyLoopType", literalValues: [{ name: "None" }, { name: "Standard" }, { name: "MultiInstanceSequential" }, { name: "MultiInstanceParallel" }] }, { name: "AssociationDirection", literalValues: [{ name: "None" }, { name: "One" }, { name: "Both" }] }, { name: "MultiInstanceBehavior", literalValues: [{ name: "None" }, { name: "One" }, { name: "All" }, { name: "Complex" }] }, { name: "AdHocOrdering", literalValues: [{ name: "Parallel" }, { name: "Sequential" }] }], xml: { tagAlias: "lowerCase", typePrefix: "t" } }, bpmndi: { name: "BPMNDI", uri: "http://www.omg.org/spec/BPMN/20100524/DI", prefix: "bpmndi", types: [{ name: "BPMNDiagram", properties: [{ name: "plane", type: "BPMNPlane", redefines: "di:Diagram#rootElement" }, { name: "labelStyle", type: "BPMNLabelStyle", isMany: true }], superClass: ["di:Diagram"] }, { name: "BPMNPlane", properties: [{ name: "bpmnElement", isAttr: true, isReference: true, type: "bpmn:BaseElement", redefines: "di:DiagramElement#modelElement" }], superClass: ["di:Plane"] }, { name: "BPMNShape", properties: [{ name: "bpmnElement", isAttr: true, isReference: true, type: "bpmn:BaseElement", redefines: "di:DiagramElement#modelElement" }, { name: "isHorizontal", isAttr: true, type: "Boolean" }, { name: "isExpanded", isAttr: true, type: "Boolean" }, { name: "isMarkerVisible", isAttr: true, type: "Boolean" }, { name: "label", type: "BPMNLabel" }, { name: "isMessageVisible", isAttr: true, type: "Boolean" }, { name: "participantBandKind", type: "ParticipantBandKind", isAttr: true }, { name: "choreographyActivityShape", type: "BPMNShape", isAttr: true, isReference: true }], superClass: ["di:LabeledShape"] }, { name: "BPMNEdge", properties: [{ name: "label", type: "BPMNLabel" }, { name: "bpmnElement", isAttr: true, isReference: true, type: "bpmn:BaseElement", redefines: "di:DiagramElement#modelElement" }, { name: "sourceElement", isAttr: true, isReference: true, type: "di:DiagramElement", redefines: "di:Edge#source" }, { name: "targetElement", isAttr: true, isReference: true, type: "di:DiagramElement", redefines: "di:Edge#target" }, { name: "messageVisibleKind", type: "MessageVisibleKind", isAttr: true, default: "initiating" }], superClass: ["di:LabeledEdge"] }, { name: "BPMNLabel", properties: [{ name: "labelStyle", type: "BPMNLabelStyle", isAttr: true, isReference: true, redefines: "di:DiagramElement#style" }], superClass: ["di:Label"] }, { name: "BPMNLabelStyle", properties: [{ name: "font", type: "dc:Font" }], superClass: ["di:Style"] }], enumerations: [{ name: "ParticipantBandKind", literalValues: [{ name: "top_initiating" }, { name: "middle_initiating" }, { name: "bottom_initiating" }, { name: "top_non_initiating" }, { name: "middle_non_initiating" }, { name: "bottom_non_initiating" }] }, { name: "MessageVisibleKind", literalValues: [{ name: "initiating" }, { name: "non_initiating" }] }], associations: [] }, dc: { name: "DC", uri: "http://www.omg.org/spec/DD/20100524/DC", prefix: "dc", types: [{ name: "Boolean" }, { name: "Integer" }, { name: "Real" }, { name: "String" }, { name: "Font", properties: [{ name: "name", type: "String", isAttr: true }, { name: "size", type: "Real", isAttr: true }, { name: "isBold", type: "Boolean", isAttr: true }, { name: "isItalic", type: "Boolean", isAttr: true }, { name: "isUnderline", type: "Boolean", isAttr: true }, { name: "isStrikeThrough", type: "Boolean", isAttr: true }] }, { name: "Point", properties: [{ name: "x", type: "Real", default: "0", isAttr: true }, { name: "y", type: "Real", default: "0", isAttr: true }] }, { name: "Bounds", properties: [{ name: "x", type: "Real", default: "0", isAttr: true }, { name: "y", type: "Real", default: "0", isAttr: true }, { name: "width", type: "Real", isAttr: true }, { name: "height", type: "Real", isAttr: true }] }], associations: [] }, di: { name: "DI", uri: "http://www.omg.org/spec/DD/20100524/DI", prefix: "di", types: [{ name: "DiagramElement", isAbstract: true, properties: [{ name: "id", isAttr: true, isId: true, type: "String" }, { name: "extension", type: "Extension" }, { name: "owningDiagram", type: "Diagram", isReadOnly: true, isVirtual: true, isReference: true }, { name: "owningElement", type: "DiagramElement", isReadOnly: true, isVirtual: true, isReference: true }, { name: "modelElement", isReadOnly: true, isVirtual: true, isReference: true, type: "Element" }, { name: "style", type: "Style", isReadOnly: true, isVirtual: true, isReference: true }, { name: "ownedElement", type: "DiagramElement", isReadOnly: true, isMany: true, isVirtual: true }] }, { name: "Node", isAbstract: true, superClass: ["DiagramElement"] }, { name: "Edge", isAbstract: true, superClass: ["DiagramElement"], properties: [{ name: "source", type: "DiagramElement", isReadOnly: true, isVirtual: true, isReference: true }, { name: "target", type: "DiagramElement", isReadOnly: true, isVirtual: true, isReference: true }, { name: "waypoint", isUnique: false, isMany: true, type: "dc:Point", xml: { serialize: "xsi:type" } }] }, { name: "Diagram", isAbstract: true, properties: [{ name: "id", isAttr: true, isId: true, type: "String" }, { name: "rootElement", type: "DiagramElement", isReadOnly: true, isVirtual: true }, { name: "name", isAttr: true, type: "String" }, { name: "documentation", isAttr: true, type: "String" }, { name: "resolution", isAttr: true, type: "Real" }, { name: "ownedStyle", type: "Style", isReadOnly: true, isMany: true, isVirtual: true }] }, { name: "Shape", isAbstract: true, superClass: ["Node"], properties: [{ name: "bounds", type: "dc:Bounds" }] }, { name: "Plane", isAbstract: true, superClass: ["Node"], properties: [{ name: "planeElement", type: "DiagramElement", subsettedProperty: "DiagramElement-ownedElement", isMany: true }] }, { name: "LabeledEdge", isAbstract: true, superClass: ["Edge"], properties: [{ name: "ownedLabel", type: "Label", isReadOnly: true, subsettedProperty: "DiagramElement-ownedElement", isMany: true, isVirtual: true }] }, { name: "LabeledShape", isAbstract: true, superClass: ["Shape"], properties: [{ name: "ownedLabel", type: "Label", isReadOnly: true, subsettedProperty: "DiagramElement-ownedElement", isMany: true, isVirtual: true }] }, { name: "Label", isAbstract: true, superClass: ["Node"], properties: [{ name: "bounds", type: "dc:Bounds" }] }, { name: "Style", isAbstract: true, properties: [{ name: "id", isAttr: true, isId: true, type: "String" }] }, { name: "Extension", properties: [{ name: "values", isMany: true, type: "Element" }] }], associations: [], xml: { tagAlias: "lowerCase" } }, bioc: { name: "bpmn.io colors for BPMN", uri: "http://bpmn.io/schema/bpmn/biocolor/1.0", prefix: "bioc", types: [{ name: "ColoredShape", extends: ["bpmndi:BPMNShape"], properties: [{ name: "stroke", isAttr: true, type: "String" }, { name: "fill", isAttr: true, type: "String" }] }, { name: "ColoredEdge", extends: ["bpmndi:BPMNEdge"], properties: [{ name: "stroke", isAttr: true, type: "String" }, { name: "fill", isAttr: true, type: "String" }] }], enumerations: [], associations: [] }, color: { name: "BPMN in Color", uri: "http://www.omg.org/spec/BPMN/non-normative/color/1.0", prefix: "color", types: [{ name: "ColoredLabel", extends: ["bpmndi:BPMNLabel"], properties: [{ name: "color", isAttr: true, type: "String" }] }, { name: "ColoredShape", extends: ["bpmndi:BPMNShape"], properties: [{ name: "background-color", isAttr: true, type: "String" }, { name: "border-color", isAttr: true, type: "String" }] }, { name: "ColoredEdge", extends: ["bpmndi:BPMNEdge"], properties: [{ name: "border-color", isAttr: true, type: "String" }] }], enumerations: [], associations: [] } };
      function Pr(e2, t2) {
        return new Cr(E({}, Mr, e2), t2);
      }
      var Or = "Tried to access di from the businessObject. The di is available through the diagram element only. For more information, see https://github.com/bpmn-io/bpmn-js/issues/1472";
      function Tr(e2, t2) {
        return e2.$instanceOf(t2);
      }
      function Nr(e2) {
        var t2 = {}, n2 = [], i2 = {};
        function r2(e3, t3) {
          return function(n3) {
            e3(n3, t3);
          };
        }
        function o2(e3) {
          t2[e3.id] = e3;
        }
        function a2(t3, n3) {
          try {
            var r3 = i2[t3.id] && (function(t4, n4) {
              if (t4.gfx) throw new Error(`already rendered ${Et(t4)}`);
              return e2.element(t4, i2[t4.id], n4);
            })(t3, n3);
            return o2(t3), r3;
          } catch (e3) {
            s2(e3.message, { element: t3, error: e3 }), console.error(`failed to import ${Et(t3)}`, e3);
          }
        }
        function s2(t3, n3) {
          e2.error(t3, n3);
        }
        var l2 = this.registerDi = function(e3) {
          var t3, n3 = e3.bpmnElement;
          n3 ? i2[n3.id] ? s2(`multiple DI elements defined for ${Et(n3)}`, { element: n3 }) : (i2[n3.id] = e3, c(t3 = n3, "di") || Object.defineProperty(t3, "di", { enumerable: false, get: function() {
            throw new Error(Or);
          } })) : s2(`no bpmnElement referenced in ${Et(e3)}`, { element: e3 });
        };
        function p2(e3) {
          var t3;
          t3 = e3.plane, l2(t3), f(t3.planeElement, m2);
        }
        function m2(e3) {
          l2(e3);
        }
        this.handleDefinitions = function(o3, a3) {
          var c2 = o3.diagrams;
          if (a3 && -1 === c2.indexOf(a3)) throw new Error("diagram not part of <bpmn:Definitions />");
          if (!a3 && c2 && c2.length && (a3 = c2[0]), !a3) throw new Error("no diagram to display");
          i2 = {}, p2(a3);
          var m3 = a3.plane;
          if (!m3) throw new Error(`no plane for ${Et(a3)}`);
          var v3 = m3.bpmnElement;
          if (!v3) {
            if (v3 = (function(e3) {
              return u(e3.rootElements, (function(e4) {
                return Tr(e4, "bpmn:Process") || Tr(e4, "bpmn:Collaboration");
              }));
            })(o3), !v3) throw new Error("no process or collaboration to display");
            s2(`correcting missing bpmnElement on ${Et(m3)} to ${Et(v3)}`), m3.bpmnElement = v3, l2(m3);
          }
          var x3, w3, b3 = (function(t3, n3) {
            return e2.root(t3, i2[t3.id], n3);
          })(v3, m3);
          if (Tr(v3, "bpmn:Process") || Tr(v3, "bpmn:SubProcess")) y2(v3, b3);
          else {
            if (!Tr(v3, "bpmn:Collaboration")) throw new Error(`unsupported bpmnElement for ${Et(m3)}: ${Et(v3)}`);
            w3 = b3, f((x3 = v3).participants, r2(P2, w3)), E2(x3.artifacts, w3), n2.push((function() {
              !(function(e3, t3) {
                f(e3, r2(g2, t3));
              })(x3.messageFlows, w3);
            })), (function(e3, n3) {
              var i3 = h(e3, (function(e4) {
                return !t2[e4.id] && Tr(e4, "bpmn:Process") && e4.laneSets;
              }));
              i3.forEach(r2(y2, n3));
            })(o3.rootElements, b3);
          }
          d2(n2);
        };
        var d2 = this.handleDeferred = function() {
          for (; n2.length; ) n2.shift()();
        };
        function y2(e3, t3) {
          M2(e3, t3), _2(e3.ioSpecification, t3), E2(e3.artifacts, t3), o2(e3);
        }
        function g2(e3, t3) {
          a2(e3, t3);
        }
        function v2(e3, t3) {
          a2(e3, t3);
        }
        function x2(e3, t3) {
          a2(e3, t3);
        }
        function w2(e3, t3) {
          a2(e3, t3);
        }
        function b2(e3, t3) {
          a2(e3, t3);
        }
        function E2(e3, t3) {
          f(e3, (function(e4) {
            Tr(e4, "bpmn:Association") ? n2.push((function() {
              b2(e4, t3);
            })) : b2(e4, t3);
          }));
        }
        function _2(e3, t3) {
          e3 && (f(e3.dataInputs, r2(x2, t3)), f(e3.dataOutputs, r2(w2, t3)));
        }
        var A2 = this.handleSubProcess = function(e3, t3) {
          M2(e3, t3), E2(e3.artifacts, t3);
        };
        function R2(e3, t3) {
          var i3 = a2(e3, t3);
          Tr(e3, "bpmn:SubProcess") && A2(e3, i3 || t3), Tr(e3, "bpmn:Activity") && _2(e3.ioSpecification, t3), n2.push((function() {
            f(e3.dataInputAssociations, r2(v2, t3)), f(e3.dataOutputAssociations, r2(v2, t3));
          }));
        }
        function S2(e3, t3) {
          a2(e3, t3);
        }
        function k2(e3, t3) {
          n2.push((function() {
            var n3 = a2(e3, t3);
            e3.childLaneSet && C2(e3.childLaneSet, n3 || t3), (function(e4) {
              f(e4.flowNodeRef, (function(t4) {
                var n4 = t4.get("lanes");
                n4 && n4.push(e4);
              }));
            })(e3);
          }));
        }
        function C2(e3, t3) {
          f(e3.lanes, r2(k2, t3));
        }
        function M2(e3, t3) {
          !(function(e4, t4) {
            f(e4, (function(e5) {
              Tr(e5, "bpmn:SequenceFlow") ? n2.push((function() {
                !(function(e6, t5) {
                  a2(e6, t5);
                })(e5, t4);
              })) : Tr(e5, "bpmn:BoundaryEvent") ? n2.unshift((function() {
                R2(e5, t4);
              })) : Tr(e5, "bpmn:FlowNode") ? R2(e5, t4) : Tr(e5, "bpmn:DataObject") || (Tr(e5, "bpmn:DataStoreReference") || Tr(e5, "bpmn:DataObjectReference") ? S2(e5, t4) : s2(`unrecognized flowElement ${Et(e5)} in context ${Et(t4 && t4.businessObject)}`, { element: e5, context: t4 }));
            }));
          })(e3.flowElements, t3), e3.laneSets && (function(e4, t4) {
            f(e4, r2(C2, t4));
          })(e3.laneSets, t3);
        }
        function P2(e3, t3) {
          var n3 = a2(e3, t3), i3 = e3.processRef;
          i3 && y2(i3, n3 || t3);
        }
      }
      function Dr(e2, t2, n2) {
        var i2, r2, o2, a2 = [];
        function s2(e3, t3) {
          var n3 = new Nr({ root: function(e4, t4) {
            return i2.add(e4, t4);
          }, element: function(e4, t4, n4) {
            return i2.add(e4, t4, n4);
          }, error: function(e4, t4) {
            a2.push({ message: e4, context: t4 });
          } });
          t3 = t3 || e3.diagrams && e3.diagrams[0];
          var r3 = (function(e4, t4) {
            if (!t4 || !t4.plane) return;
            var n4, i3 = t4.plane.bpmnElement, r4 = i3;
            R(i3, "bpmn:Process") || R(i3, "bpmn:Collaboration") || (r4 = (function(e5) {
              var t5 = e5;
              for (; t5; ) {
                if (R(t5, "bpmn:Process")) return t5;
                t5 = t5.$parent;
              }
            })(i3));
            n4 = R(r4, "bpmn:Collaboration") ? r4 : u(e4.rootElements, (function(e5) {
              if (R(e5, "bpmn:Collaboration")) return u(e5.participants, (function(e6) {
                return e6.processRef === r4;
              }));
            }));
            var o3 = [r4];
            n4 && (o3 = (function(e5, t5) {
              let n5 = [];
              return f(e5, (function(e6, i4) {
                n5.push(t5(e6, i4));
              })), n5;
            })(n4.participants, (function(e5) {
              return e5.processRef;
            }))).push(n4);
            var a3 = Br(o3), s4 = [t4], l2 = [i3];
            return f(e4.diagrams, (function(e5) {
              if (e5.plane) {
                var t5 = e5.plane.bpmnElement;
                -1 !== a3.indexOf(t5) && -1 === l2.indexOf(t5) && (s4.push(e5), l2.push(t5));
              }
            })), s4;
          })(e3, t3);
          if (!r3) throw new Error("no diagram to display");
          f(r3, (function(t4) {
            n3.handleDefinitions(e3, t4);
          }));
          var s3 = t3.plane.bpmnElement.id;
          o2.setRootElement(o2.findRoot(s3 + "_plane") || o2.findRoot(s3));
        }
        return new Promise((function(l2, p2) {
          try {
            return i2 = e2.get("bpmnImporter"), r2 = e2.get("eventBus"), o2 = e2.get("canvas"), r2.fire("import.render.start", { definitions: t2 }), s2(t2, n2), r2.fire("import.render.complete", { error: void 0, warnings: a2 }), l2({ warnings: a2 });
          } catch (e3) {
            return e3.warnings = a2, p2(e3);
          }
        }));
      }
      function Br(e2) {
        var t2 = [];
        return f(e2, (function(e3) {
          e3 && (t2.push(e3), t2 = t2.concat(Br(e3.flowElements)));
        })), t2;
      }
      var Lr, Ir = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.02 5.57" width="53" height="21"><path fill="currentColor" d="M1.88.92v.14c0 .41-.13.68-.4.8.33.14.46.44.46.86v.33c0 .61-.33.95-.95.95H0V0h.95c.65 0 .93.3.93.92zM.63.57v1.06h.24c.24 0 .38-.1.38-.43V.98c0-.28-.1-.4-.32-.4zm0 1.63v1.22h.36c.2 0 .32-.1.32-.39v-.35c0-.37-.12-.48-.4-.48H.63zM4.18.99v.52c0 .64-.31.98-.94.98h-.3V4h-.62V0h.92c.63 0 .94.35.94.99zM2.94.57v1.35h.3c.2 0 .3-.09.3-.37v-.6c0-.29-.1-.38-.3-.38h-.3zm2.89 2.27L6.25 0h.88v4h-.6V1.12L6.1 3.99h-.6l-.46-2.82v2.82h-.55V0h.87zM8.14 1.1V4h-.56V0h.79L9 2.4V0h.56v4h-.64zm2.49 2.29v.6h-.6v-.6zM12.12 1c0-.63.33-1 .95-1 .61 0 .95.37.95 1v2.04c0 .64-.34 1-.95 1-.62 0-.95-.37-.95-1zm.62 2.08c0 .28.13.39.33.39s.32-.1.32-.4V.98c0-.29-.12-.4-.32-.4s-.33.11-.33.4z"/><path fill="currentColor" d="M0 4.53h14.02v1.04H0zM11.08 0h.63v.62h-.63zm.63 4V1h-.63v2.98z"/></svg>', jr = { verticalAlign: "middle" }, Fr = { color: "#404040" }, Vr = { zIndex: "1001", position: "fixed", top: "0", left: "0", right: "0", bottom: "0" }, Wr = { width: "100%", height: "100%", background: "rgba(40,40,40,0.2)" }, $r = { position: "absolute", left: "50%", top: "40%", transform: "translate(-50%)", width: "260px", padding: "10px", background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.3)", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "14px", display: "flex", lineHeight: "1.3" }, zr = '<div class="bjs-powered-by-lightbox"><div class="backdrop"></div><div class="notice"><a href="https://bpmn.io" target="_blank" rel="noopener" class="link">' + Ir + '</a><span>Web-based tooling for BPMN, DMN and forms powered by <a href="https://bpmn.io" target="_blank" rel="noopener">bpmn.io</a>.</span></div></div>';
      function Gr() {
        Lr || (Oe(Lr = qe(zr), Vr), Oe(Ye("svg", Lr), jr), Oe(Ye(".backdrop", Lr), Wr), Oe(Ye(".notice", Lr), $r), Oe(Ye(".link", Lr), Fr, { margin: "15px 20px 15px 10px", alignSelf: "center" }), Ge.bind(Lr, ".backdrop", "click", (function(e2) {
          document.body.removeChild(Lr);
        }))), document.body.appendChild(Lr);
      }
      function Hr(e2) {
        e2 = E({}, Ur, e2), this._moddle = this._createModdle(e2), this._container = this._createContainer(e2), /**
           * Adds the project logo to the diagram container as
           * required by the bpmn.io license.
           *
           * @see http://bpmn.io/license
           *
           * @param {Element} container
           */
        (function(e3) {
          const t2 = qe('<a href="http://bpmn.io" target="_blank" class="bjs-powered-by" title="Powered by bpmn.io" >' + Ir + "</a>");
          Oe(Ye("svg", t2), jr), Oe(t2, Fr, { position: "absolute", bottom: "15px", right: "15px", zIndex: "100" }), e3.appendChild(t2), We.bind(t2, "click", (function(e4) {
            Gr(), e4.preventDefault();
          }));
        })(this._container), this._init(this._container, this._moddle, e2);
      }
      function Kr(e2, t2) {
        return e2.warnings = t2, e2;
      }
      e(Hr, mi), Hr.prototype.importXML = async function(e2, t2) {
        const n2 = this;
        let i2 = [];
        try {
          let o2;
          e2 = this._emit("import.parse.start", { xml: e2 }) || e2;
          try {
            o2 = await this._moddle.fromXML(e2, "bpmn:Definitions");
          } catch (e3) {
            throw this._emit("import.parse.complete", { error: e3 }), e3;
          }
          let a2 = o2.rootElement;
          const s2 = o2.references, l2 = o2.warnings, p2 = o2.elementsById;
          i2 = i2.concat(l2), a2 = this._emit("import.parse.complete", (r2 = { error: null, definitions: a2, elementsById: p2, references: s2, warnings: i2 }, n2.get("eventBus").createEvent(r2))) || a2;
          const c2 = await this.importDefinitions(a2, t2);
          return i2 = i2.concat(c2.warnings), this._emit("import.done", { error: null, warnings: i2 }), { warnings: i2 };
        } catch (e3) {
          let t3 = e3;
          throw i2 = i2.concat(t3.warnings || []), Kr(t3, i2), t3 = (function(e4) {
            const t4 = /unparsable content <([^>]+)> detected([\s\S]*)$/.exec(e4.message);
            t4 && (e4.message = "unparsable content <" + t4[1] + "> detected; this may indicate an invalid BPMN 2.0 diagram file" + t4[2]);
            return e4;
          })(t3), this._emit("import.done", { error: t3, warnings: t3.warnings }), t3;
        }
        var r2;
      }, Hr.prototype.importDefinitions = async function(e2, t2) {
        this._setDefinitions(e2);
        return { warnings: (await this.open(t2)).warnings };
      }, Hr.prototype.open = async function(e2) {
        const t2 = this._definitions;
        let n2 = e2;
        if (!t2) {
          const e3 = new Error("no XML imported");
          throw Kr(e3, []), e3;
        }
        if ("string" == typeof e2 && (n2 = (function(e3, t3) {
          if (!t3) return null;
          return u(e3.diagrams, (function(e4) {
            return e4.id === t3;
          })) || null;
        })(t2, e2), !n2)) {
          const t3 = new Error("BPMNDiagram <" + e2 + "> not found");
          throw Kr(t3, []), t3;
        }
        try {
          this.clear();
        } catch (e3) {
          throw Kr(e3, []), e3;
        }
        const { warnings: i2 } = await Dr(this, t2, n2);
        return { warnings: i2 };
      }, Hr.prototype.saveXML = async function(e2) {
        e2 = e2 || {};
        let t2, n2, i2 = this._definitions;
        try {
          if (!i2) throw new Error("no definitions loaded");
          i2 = this._emit("saveXML.start", { definitions: i2 }) || i2;
          n2 = (await this._moddle.toXML(i2, e2)).xml, n2 = this._emit("saveXML.serialized", { xml: n2 }) || n2;
        } catch (e3) {
          t2 = e3;
        }
        const r2 = t2 ? { error: t2 } : { xml: n2 };
        if (this._emit("saveXML.done", r2), t2) throw t2;
        return r2;
      }, Hr.prototype.saveSVG = async function() {
        let e2, t2;
        this._emit("saveSVG.start");
        try {
          const t3 = this.get("canvas"), n2 = t3.getActiveLayer(), i2 = Ye(":scope > defs", t3._svg), r2 = re(n2), o2 = i2 ? "<defs>" + re(i2) + "</defs>" : "", a2 = n2.getBBox();
          e2 = '<?xml version="1.0" encoding="utf-8"?>\n<!-- created with bpmn-js / http://bpmn.io -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + a2.width + '" height="' + a2.height + '" viewBox="' + a2.x + " " + a2.y + " " + a2.width + " " + a2.height + '" version="1.1">' + o2 + r2 + "</svg>";
        } catch (e3) {
          t2 = e3;
        }
        if (this._emit("saveSVG.done", { error: t2, svg: e2 }), t2) throw t2;
        return { svg: e2 };
      }, Hr.prototype._setDefinitions = function(e2) {
        this._definitions = e2;
      }, Hr.prototype.getModules = function() {
        return this._modules;
      }, Hr.prototype.clear = function() {
        this.getDefinitions() && mi.prototype.clear.call(this);
      }, Hr.prototype.destroy = function() {
        mi.prototype.destroy.call(this), Xe(this._container);
      }, Hr.prototype.on = function(e2, t2, n2, i2) {
        return this.get("eventBus").on(e2, t2, n2, i2);
      }, Hr.prototype.off = function(e2, t2) {
        this.get("eventBus").off(e2, t2);
      }, Hr.prototype.attachTo = function(e2) {
        if (!e2) throw new Error("parentNode required");
        this.detach(), e2.get && e2.constructor.prototype.jquery && (e2 = e2.get(0)), "string" == typeof e2 && (e2 = Ye(e2)), e2.appendChild(this._container), this._emit("attach", {}), this.get("canvas").resized();
      }, Hr.prototype.getDefinitions = function() {
        return this._definitions;
      }, Hr.prototype.detach = function() {
        const e2 = this._container, t2 = e2.parentNode;
        t2 && (this._emit("detach", {}), t2.removeChild(e2));
      }, Hr.prototype._init = function(e2, t2, n2) {
        const i2 = n2.modules || this.getModules(n2), r2 = n2.additionalModules || [], o2 = [].concat([{ bpmnjs: ["value", this], moddle: ["value", t2] }], i2, r2), a2 = E((function(e3, t3) {
          let n3 = {};
          return f(Object(e3), (function(e4, i3) {
            -1 === t3.indexOf(i3) && (n3[i3] = e4);
          })), n3;
        })(n2, ["additionalModules"]), { canvas: E({}, n2.canvas, { container: e2 }), modules: o2 });
        mi.call(this, a2), n2 && n2.container && this.attachTo(n2.container);
      }, Hr.prototype._emit = function(e2, t2) {
        return this.get("eventBus").fire(e2, t2);
      }, Hr.prototype._createContainer = function(e2) {
        const t2 = qe('<div class="bjs-container"></div>');
        return Oe(t2, { width: qr(e2.width), height: qr(e2.height), position: e2.position }), t2;
      }, Hr.prototype._createModdle = function(e2) {
        return new Pr(E({}, this._moddleExtensions, e2.moddleExtensions));
      }, Hr.prototype._modules = [];
      const Ur = { width: "100%", height: "100%", position: "relative" };
      function qr(e2) {
        return e2 + (s(e2) ? "px" : "");
      }
      function Yr(e2) {
        Hr.call(this, e2);
      }
      return e(Yr, Hr), Yr.prototype._modules = [kt, nn, un, It, Rn, gt], Yr.prototype._moddleExtensions = {}, Yr;
    }));
  }
});

// node_modules/linkedom/esm/shared/symbols.js
var CHANGED = Symbol("changed");
var CLASS_LIST = Symbol("classList");
var CUSTOM_ELEMENTS = Symbol("CustomElements");
var CONTENT = Symbol("content");
var DATASET = Symbol("dataset");
var DOCTYPE = Symbol("doctype");
var DOM_PARSER = Symbol("DOMParser");
var END = Symbol("end");
var EVENT_TARGET = Symbol("EventTarget");
var GLOBALS = Symbol("globals");
var IMAGE = Symbol("image");
var MIME = Symbol("mime");
var MUTATION_OBSERVER = Symbol("MutationObserver");
var NEXT = Symbol("next");
var OWNER_ELEMENT = Symbol("ownerElement");
var PREV = Symbol("prev");
var PRIVATE = Symbol("private");
var SHEET = Symbol("sheet");
var START = Symbol("start");
var STYLE = Symbol("style");
var UPGRADE = Symbol("upgrade");
var VALUE = Symbol("value");

// node_modules/htmlparser2/dist/esm/index.js
var esm_exports3 = {};
__export(esm_exports3, {
  DefaultHandler: () => DomHandler,
  DomHandler: () => DomHandler,
  DomUtils: () => esm_exports2,
  ElementType: () => esm_exports,
  Parser: () => Parser,
  QuoteType: () => QuoteType,
  Tokenizer: () => Tokenizer,
  createDocumentStream: () => createDocumentStream,
  createDomStream: () => createDomStream,
  getFeed: () => getFeed,
  parseDOM: () => parseDOM,
  parseDocument: () => parseDocument,
  parseFeed: () => parseFeed
});

// node_modules/htmlparser2/node_modules/entities/dist/esm/decode-codepoint.js
var _a;
var decodeMap = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
var fromCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, n/no-unsupported-features/es-builtins
  (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : ((codePoint) => {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  })
);
function replaceCodePoint(codePoint) {
  var _a3;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a3 = decodeMap.get(codePoint)) !== null && _a3 !== void 0 ? _a3 : codePoint;
}

// node_modules/htmlparser2/node_modules/entities/dist/esm/internal/decode-shared.js
function decodeBase64(input) {
  const binary = (
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    typeof atob === "function" ? (
      // Browser (and Node >=16)
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      atob(input)
    ) : (
      // Older Node versions (<16)
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      typeof Buffer.from === "function" ? (
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        Buffer.from(input, "base64").toString("binary")
      ) : (
        // eslint-disable-next-line unicorn/no-new-buffer, n/no-deprecated-api
        new Buffer(input, "base64").toString("binary")
      )
    )
  );
  const evenLength = binary.length & ~1;
  const out = new Uint16Array(evenLength / 2);
  for (let index = 0, outIndex = 0; index < evenLength; index += 2) {
    const lo = binary.charCodeAt(index);
    const hi = binary.charCodeAt(index + 1);
    out[outIndex++] = lo | hi << 8;
  }
  return out;
}

// node_modules/htmlparser2/node_modules/entities/dist/esm/generated/decode-data-html.js
var htmlDecodeTree = /* @__PURE__ */ decodeBase64("QR08ALkAAgH6AYsDNQR2BO0EPgXZBQEGLAbdBxMISQrvCmQLfQurDKQNLw4fD4YPpA+6D/IPAAAAAAAAAAAAAAAAKhBMEY8TmxUWF2EYLBkxGuAa3RsJHDscWR8YIC8jSCSIJcMl6ie3Ku8rEC0CLjoupS7kLgAIRU1hYmNmZ2xtbm9wcnN0dVQAWgBeAGUAaQBzAHcAfgCBAIQAhwCSAJoAoACsALMAbABpAGcAO4DGAMZAUAA7gCYAJkBjAHUAdABlADuAwQDBQHIiZXZlAAJhAAFpeW0AcgByAGMAO4DCAMJAEGRyAADgNdgE3XIAYQB2AGUAO4DAAMBA8CFoYZFj4SFjcgBhZAAAoFMqAAFncIsAjgBvAG4ABGFmAADgNdg43fAlbHlGdW5jdGlvbgCgYSBpAG4AZwA7gMUAxUAAAWNzpACoAHIAAOA12Jzc6SFnbgCgVCJpAGwAZABlADuAwwDDQG0AbAA7gMQAxEAABGFjZWZvcnN1xQDYANoA7QDxAPYA+QD8AAABY3LJAM8AayNzbGFzaAAAoBYidgHTANUAAKDnKmUAZAAAoAYjeQARZIABY3J0AOAA5QDrAGEidXNlAACgNSLuI291bGxpcwCgLCFhAJJjcgAA4DXYBd1wAGYAAOA12Dnd5SF2ZdhiYwDyAOoAbSJwZXEAAKBOIgAHSE9hY2RlZmhpbG9yc3UXARoBHwE6AVIBVQFiAWQBZgGCAakB6QHtAfIBYwB5ACdkUABZADuAqQCpQIABY3B5ACUBKAE1AfUhdGUGYWmg0iJ0KGFsRGlmZmVyZW50aWFsRAAAoEUhbCJleXMAAKAtIQACYWVpb0EBRAFKAU0B8iFvbgxhZABpAGwAO4DHAMdAcgBjAAhhbiJpbnQAAKAwIm8AdAAKYQABZG5ZAV0BaSJsbGEAuGB0I2VyRG90ALdg8gA5AWkAp2NyImNsZQAAAkRNUFRwAXQBeQF9AW8AdAAAoJkiaSJudXMAAKCWIuwhdXMAoJUiaSJtZXMAAKCXIm8AAAFjc4cBlAFrKndpc2VDb250b3VySW50ZWdyYWwAAKAyImUjQ3VybHkAAAFEUZwBpAFvJXVibGVRdW90ZQAAoB0gdSJvdGUAAKAZIAACbG5wdbABtgHNAdgBbwBuAGWgNyIAoHQqgAFnaXQAvAHBAcUB8iJ1ZW50AKBhIm4AdAAAoC8i7yV1ckludGVncmFsAKAuIgABZnLRAdMBAKACIe8iZHVjdACgECJuLnRlckNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbAAAoDMi7yFzcwCgLypjAHIAAOA12J7ccABDoNMiYQBwAACgTSKABURKU1phY2VmaW9zAAsCEgIVAhgCGwIsAjQCOQI9AnMCfwNvoEUh9CJyYWhkAKARKWMAeQACZGMAeQAFZGMAeQAPZIABZ3JzACECJQIoAuchZXIAoCEgcgAAoKEhaAB2AACg5CoAAWF5MAIzAvIhb24OYRRkbAB0oAciYQCUY3IAAOA12AfdAAFhZkECawIAAWNtRQJnAvIjaXRpY2FsAAJBREdUUAJUAl8CYwJjInV0ZQC0YG8AdAFZAloC2WJiJGxlQWN1dGUA3WJyImF2ZQBgYGkibGRlANxi7yFuZACgxCJmJWVyZW50aWFsRAAAoEYhcAR9AgAAAAAAAIECjgIAABoDZgAA4DXYO91EoagAhQKJAm8AdAAAoNwgcSJ1YWwAAKBQIuIhbGUAA0NETFJVVpkCqAK1Au8C/wIRA28AbgB0AG8AdQByAEkAbgB0AGUAZwByAGEA7ADEAW8AdAKvAgAAAACwAqhgbiNBcnJvdwAAoNMhAAFlb7kC0AJmAHQAgAFBUlQAwQLGAs0CciJyb3cAAKDQIekkZ2h0QXJyb3cAoNQhZQDlACsCbgBnAAABTFLWAugC5SFmdAABQVLcAuECciJyb3cAAKD4J+kkZ2h0QXJyb3cAoPon6SRnaHRBcnJvdwCg+SdpImdodAAAAUFU9gL7AnIicm93AACg0iFlAGUAAKCoInAAQQIGAwAAAAALA3Iicm93AACg0SFvJHduQXJyb3cAAKDVIWUlcnRpY2FsQmFyAACgJSJuAAADQUJMUlRhJAM2AzoDWgNxA3oDciJyb3cAAKGTIUJVLAMwA2EAcgAAoBMpcCNBcnJvdwAAoPUhciJldmUAEWPlIWZ00gJDAwAASwMAAFIDaSVnaHRWZWN0b3IAAKBQKWUkZVZlY3RvcgAAoF4p5SJjdG9yQqC9IWEAcgAAoFYpaSJnaHQA1AFiAwAAaQNlJGVWZWN0b3IAAKBfKeUiY3RvckKgwSFhAHIAAKBXKWUAZQBBoKQiciJyb3cAAKCnIXIAcgBvAPcAtAIAAWN0gwOHA3IAAOA12J/c8iFvaxBhAAhOVGFjZGZnbG1vcHFzdHV4owOlA6kDsAO/A8IDxgPNA9ID8gP9AwEEFAQeBCAEJQRHAEphSAA7gNAA0EBjAHUAdABlADuAyQDJQIABYWl5ALYDuQO+A/Ihb24aYXIAYwA7gMoAykAtZG8AdAAWYXIAAOA12AjdcgBhAHYAZQA7gMgAyEDlIm1lbnQAoAgiAAFhcNYD2QNjAHIAEmF0AHkAUwLhAwAAAADpA20lYWxsU3F1YXJlAACg+yVlJ3J5U21hbGxTcXVhcmUAAKCrJQABZ3D2A/kDbwBuABhhZgAA4DXYPN3zImlsb26VY3UAAAFhaQYEDgRsAFSgdSppImxkZQAAoEIi7CNpYnJpdW0AoMwhAAFjaRgEGwRyAACgMCFtAACgcyphAJdjbQBsADuAywDLQAABaXApBC0E8yF0cwCgAyLvJG5lbnRpYWxFAKBHIYACY2Zpb3MAPQQ/BEMEXQRyBHkAJGRyAADgNdgJ3WwibGVkAFMCTAQAAAAAVARtJWFsbFNxdWFyZQAAoPwlZSdyeVNtYWxsU3F1YXJlAACgqiVwA2UEAABpBAAAAABtBGYAAOA12D3dwSFsbACgACLyI2llcnRyZgCgMSFjAPIAcQQABkpUYWJjZGZnb3JzdIgEiwSOBJMElwSkBKcEqwStBLIE5QTqBGMAeQADZDuAPgA+QO0hbWFkoJMD3GNyImV2ZQAeYYABZWl5AJ0EoASjBOQhaWwiYXIAYwAcYRNkbwB0ACBhcgAA4DXYCt0AoNkicABmAADgNdg+3eUiYXRlcgADRUZHTFNUvwTIBM8E1QTZBOAEcSJ1YWwATKBlIuUhc3MAoNsidSRsbEVxdWFsAACgZyJyI2VhdGVyAACgoirlIXNzAKB3IuwkYW50RXF1YWwAoH4qaSJsZGUAAKBzImMAcgAA4DXYotwAoGsiAARBYWNmaW9zdfkE/QQFBQgFCwUTBSIFKwVSIkRjeQAqZAABY3QBBQQFZQBrAMdiXmDpIXJjJGFyAACgDCFsJWJlcnRTcGFjZQAAoAsh8AEYBQAAGwVmAACgDSHpJXpvbnRhbExpbmUAoAAlAAFjdCYFKAXyABIF8iFvayZhbQBwAEQBMQU5BW8AdwBuAEgAdQBtAPAAAAFxInVhbAAAoE8iAAdFSk9hY2RmZ21ub3N0dVMFVgVZBVwFYwVtBXAFcwV6BZAFtgXFBckFzQVjAHkAFWTsIWlnMmFjAHkAAWRjAHUAdABlADuAzQDNQAABaXlnBWwFcgBjADuAzgDOQBhkbwB0ADBhcgAAoBEhcgBhAHYAZQA7gMwAzEAAoREhYXB/BYsFAAFjZ4MFhQVyACphaSNuYXJ5SQAAoEghbABpAGUA8wD6AvQBlQUAAKUFZaAsIgABZ3KaBZ4F8iFhbACgKyLzI2VjdGlvbgCgwiJpI3NpYmxlAAABQ1SsBbEFbyJtbWEAAKBjIGkibWVzAACgYiCAAWdwdAC8Bb8FwwVvAG4ALmFmAADgNdhA3WEAmWNjAHIAAKAQIWkibGRlAChh6wHSBQAA1QVjAHkABmRsADuAzwDPQIACY2Zvc3UA4QXpBe0F8gX9BQABaXnlBegFcgBjADRhGWRyAADgNdgN3XAAZgAA4DXYQd3jAfcFAAD7BXIAAOA12KXc8iFjeQhk6yFjeQRkgANISmFjZm9zAAwGDwYSBhUGHQYhBiYGYwB5ACVkYwB5AAxk8CFwYZpjAAFleRkGHAbkIWlsNmEaZHIAAOA12A7dcABmAADgNdhC3WMAcgAA4DXYptyABUpUYWNlZmxtb3N0AD0GQAZDBl4GawZkB2gHcAd0B80H2gdjAHkACWQ7gDwAPECAAmNtbnByAEwGTwZSBlUGWwb1IXRlOWHiIWRhm2NnAACg6ifsI2FjZXRyZgCgEiFyAACgniGAAWFleQBkBmcGagbyIW9uPWHkIWlsO2EbZAABZnNvBjQHdAAABUFDREZSVFVWYXKABp4GpAbGBssG3AYDByEHwQIqBwABbnKEBowGZyVsZUJyYWNrZXQAAKDoJ/Ihb3cAoZAhQlKTBpcGYQByAACg5CHpJGdodEFycm93AKDGIWUjaWxpbmcAAKAII28A9QGqBgAAsgZiJWxlQnJhY2tldAAAoOYnbgDUAbcGAAC+BmUkZVZlY3RvcgAAoGEp5SJjdG9yQqDDIWEAcgAAoFkpbCJvb3IAAKAKI2kiZ2h0AAABQVbSBtcGciJyb3cAAKCUIeUiY3RvcgCgTikAAWVy4AbwBmUAAKGjIkFW5gbrBnIicm93AACgpCHlImN0b3IAoFopaSNhbmdsZQBCorIi+wYAAAAA/wZhAHIAAKDPKXEidWFsAACgtCJwAIABRFRWAAoHEQcYB+8kd25WZWN0b3IAoFEpZSRlVmVjdG9yAACgYCnlImN0b3JCoL8hYQByAACgWCnlImN0b3JCoLwhYQByAACgUilpAGcAaAB0AGEAcgByAG8A9wDMAnMAAANFRkdMU1Q/B0cHTgdUB1gHXwfxJXVhbEdyZWF0ZXIAoNoidSRsbEVxdWFsAACgZiJyI2VhdGVyAACgdiLlIXNzAKChKuwkYW50RXF1YWwAoH0qaSJsZGUAAKByInIAAOA12A/dZaDYIuYjdGFycm93AKDaIWkiZG90AD9hgAFucHcAege1B7kHZwAAAkxSbHKCB5QHmwerB+UhZnQAAUFSiAeNB3Iicm93AACg9SfpJGdodEFycm93AKD3J+kkZ2h0QXJyb3cAoPYn5SFmdAABYXLcAqEHaQBnAGgAdABhAHIAcgBvAPcA5wJpAGcAaAB0AGEAcgByAG8A9wDuAmYAAOA12EPdZQByAAABTFK/B8YHZSRmdEFycm93AACgmSHpJGdodEFycm93AKCYIYABY2h0ANMH1QfXB/IAWgYAoLAh8iFva0FhAKBqIgAEYWNlZmlvc3XpB+wH7gf/BwMICQgOCBEIcAAAoAUpeQAcZAABZGzyB/kHaSR1bVNwYWNlAACgXyBsI2ludHJmAACgMyFyAADgNdgQ3e4jdXNQbHVzAKATInAAZgAA4DXYRN1jAPIA/gecY4AESmFjZWZvc3R1ACEIJAgoCDUIgQiFCDsKQApHCmMAeQAKZGMidXRlAENhgAFhZXkALggxCDQI8iFvbkdh5CFpbEVhHWSAAWdzdwA7CGEIfQjhInRpdmWAAU1UVgBECEwIWQhlJWRpdW1TcGFjZQAAoAsgaABpAAABY25SCFMIawBTAHAAYQBjAOUASwhlAHIAeQBUAGgAaQDuAFQI9CFlZAABR0xnCHUIcgBlAGEAdABlAHIARwByAGUAYQB0AGUA8gDrBGUAcwBzAEwAZQBzAPMA2wdMImluZQAKYHIAAOA12BHdAAJCbnB0jAiRCJkInAhyImVhawAAoGAgwiZyZWFraW5nU3BhY2WgYGYAAKAVIUOq7CqzCMIIzQgAAOcIGwkAAAAAAAAtCQAAbwkAAIcJAACdCcAJGQoAADQKAAFvdbYIvAjuI2dydWVudACgYiJwIkNhcAAAoG0ibyh1YmxlVmVydGljYWxCYXIAAKAmIoABbHF4ANII1wjhCOUibWVudACgCSL1IWFsVKBgImkibGRlAADgQiI4A2kic3RzAACgBCJyI2VhdGVyAACjbyJFRkdMU1T1CPoIAgkJCQ0JFQlxInVhbAAAoHEidSRsbEVxdWFsAADgZyI4A3IjZWF0ZXIAAOBrIjgD5SFzcwCgeSLsJGFudEVxdWFsAOB+KjgDaSJsZGUAAKB1IvUhbXBEASAJJwnvI3duSHVtcADgTiI4A3EidWFsAADgTyI4A2UAAAFmczEJRgn0JFRyaWFuZ2xlQqLqIj0JAAAAAEIJYQByAADgzyk4A3EidWFsAACg7CJzAICibiJFR0xTVABRCVYJXAlhCWkJcSJ1YWwAAKBwInIjZWF0ZXIAAKB4IuUhc3MA4GoiOAPsJGFudEVxdWFsAOB9KjgDaSJsZGUAAKB0IuUic3RlZAABR0x1CX8J8iZlYXRlckdyZWF0ZXIA4KIqOAPlI3NzTGVzcwDgoSo4A/IjZWNlZGVzAKGAIkVTjwmVCXEidWFsAADgryo4A+wkYW50RXF1YWwAoOAiAAFlaaAJqQl2JmVyc2VFbGVtZW50AACgDCLnJWh0VHJpYW5nbGVCousitgkAAAAAuwlhAHIAAODQKTgDcSJ1YWwAAKDtIgABcXXDCeAJdSNhcmVTdQAAAWJwywnVCfMhZXRF4I8iOANxInVhbAAAoOIi5SJyc2V0ReCQIjgDcSJ1YWwAAKDjIoABYmNwAOYJ8AkNCvMhZXRF4IIi0iBxInVhbAAAoIgi4yJlZWRzgKGBIkVTVAD6CQAKBwpxInVhbAAA4LAqOAPsJGFudEVxdWFsAKDhImkibGRlAADgfyI4A+UicnNldEXggyLSIHEidWFsAACgiSJpImxkZQCAoUEiRUZUACIKJwouCnEidWFsAACgRCJ1JGxsRXF1YWwAAKBHImkibGRlAACgSSJlJXJ0aWNhbEJhcgAAoCQiYwByAADgNdip3GkAbABkAGUAO4DRANFAnWMAB0VhY2RmZ21vcHJzdHV2XgphCmgKcgp2CnoKgQqRCpYKqwqtCrsKyArNCuwhaWdSYWMAdQB0AGUAO4DTANNAAAFpeWwKcQpyAGMAO4DUANRAHmRiImxhYwBQYXIAAOA12BLdcgBhAHYAZQA7gNIA0kCAAWFlaQCHCooKjQpjAHIATGFnAGEAqWNjInJvbgCfY3AAZgAA4DXYRt3lI25DdXJseQABRFGeCqYKbyV1YmxlUXVvdGUAAKAcIHUib3RlAACgGCAAoFQqAAFjbLEKtQpyAADgNdiq3GEAcwBoADuA2ADYQGkAbAHACsUKZABlADuA1QDVQGUAcwAAoDcqbQBsADuA1gDWQGUAcgAAAUJQ0wrmCgABYXLXCtoKcgAAoD4gYQBjAAABZWvgCuIKAKDeI2UAdAAAoLQjYSVyZW50aGVzaXMAAKDcI4AEYWNmaGlsb3JzAP0KAwsFCwkLCwsMCxELIwtaC3IjdGlhbEQAAKACInkAH2RyAADgNdgT3WkApmOgY/Ujc01pbnVzsWAAAWlwFQsgC24AYwBhAHIAZQBwAGwAYQBuAOUACgVmAACgGSGAobsqZWlvACoLRQtJC+MiZWRlc4CheiJFU1QANAs5C0ALcSJ1YWwAAKCvKuwkYW50RXF1YWwAoHwiaSJsZGUAAKB+Im0AZQAAoDMgAAFkcE0LUQv1IWN0AKAPIm8jcnRpb24AYaA3ImwAAKAdIgABY2leC2ILcgAA4DXYq9yoYwACVWZvc2oLbwtzC3cLTwBUADuAIgAiQHIAAOA12BTdcABmAACgGiFjAHIAAOA12KzcAAZCRWFjZWZoaW9yc3WPC5MLlwupC7YL2AvbC90LhQyTDJoMowzhIXJyAKAQKUcAO4CuAK5AgAFjbnIAnQugC6ML9SF0ZVRhZwAAoOsncgB0oKAhbAAAoBYpgAFhZXkArwuyC7UL8iFvblhh5CFpbFZhIGR2oBwhZSJyc2UAAAFFVb8LzwsAAWxxwwvIC+UibWVudACgCyL1JGlsaWJyaXVtAKDLIXAmRXF1aWxpYnJpdW0AAKBvKXIAAKAcIW8AoWPnIWh0AARBQ0RGVFVWYewLCgwQDDIMNwxeDHwM9gIAAW5y8Av4C2clbGVCcmFja2V0AACg6SfyIW93AKGSIUJM/wsDDGEAcgAAoOUhZSRmdEFycm93AACgxCFlI2lsaW5nAACgCSNvAPUBFgwAAB4MYiVsZUJyYWNrZXQAAKDnJ24A1AEjDAAAKgxlJGVWZWN0b3IAAKBdKeUiY3RvckKgwiFhAHIAAKBVKWwib29yAACgCyMAAWVyOwxLDGUAAKGiIkFWQQxGDHIicm93AACgpiHlImN0b3IAoFspaSNhbmdsZQBCorMiVgwAAAAAWgxhAHIAAKDQKXEidWFsAACgtSJwAIABRFRWAGUMbAxzDO8kd25WZWN0b3IAoE8pZSRlVmVjdG9yAACgXCnlImN0b3JCoL4hYQByAACgVCnlImN0b3JCoMAhYQByAACgUykAAXB1iQyMDGYAAKAdIe4kZEltcGxpZXMAoHAp6SRnaHRhcnJvdwCg2yEAAWNongyhDHIAAKAbIQCgsSHsJGVEZWxheWVkAKD0KYAGSE9hY2ZoaW1vcXN0dQC/DMgMzAzQDOIM5gwKDQ0NFA0ZDU8NVA1YDQABQ2PDDMYMyCFjeSlkeQAoZEYiVGN5ACxkYyJ1dGUAWmEAorwqYWVpedgM2wzeDOEM8iFvbmBh5CFpbF5hcgBjAFxhIWRyAADgNdgW3e8hcnQAAkRMUlXvDPYM/QwEDW8kd25BcnJvdwAAoJMhZSRmdEFycm93AACgkCHpJGdodEFycm93AKCSIXAjQXJyb3cAAKCRIechbWGjY+EkbGxDaXJjbGUAoBgicABmAADgNdhK3XICHw0AAAAAIg10AACgGiLhIXJlgKGhJUlTVQAqDTINSg3uJXRlcnNlY3Rpb24AoJMidQAAAWJwNw1ADfMhZXRFoI8icSJ1YWwAAKCRIuUicnNldEWgkCJxInVhbAAAoJIibiJpb24AAKCUImMAcgAA4DXYrtxhAHIAAKDGIgACYmNtcF8Nag2ODZANc6DQImUAdABFoNAicSJ1YWwAAKCGIgABY2huDYkNZSJlZHMAgKF7IkVTVAB4DX0NhA1xInVhbAAAoLAq7CRhbnRFcXVhbACgfSJpImxkZQAAoH8iVABoAGEA9ADHCwCgESIAodEiZXOVDZ8NciJzZXQARaCDInEidWFsAACghyJlAHQAAKDRIoAFSFJTYWNmaGlvcnMAtQ27Db8NyA3ODdsN3w3+DRgOHQ4jDk8AUgBOADuA3gDeQMEhREUAoCIhAAFIY8MNxg1jAHkAC2R5ACZkAAFidcwNzQ0JYKRjgAFhZXkA1A3XDdoN8iFvbmRh5CFpbGJhImRyAADgNdgX3QABZWnjDe4N8gHoDQAA7Q3lImZvcmUAoDQiYQCYYwABY27yDfkNayNTcGFjZQAA4F8gCiDTInBhY2UAoAkg7CFkZYChPCJFRlQABw4MDhMOcSJ1YWwAAKBDInUkbGxFcXVhbAAAoEUiaSJsZGUAAKBIInAAZgAA4DXYS93pI3BsZURvdACg2yAAAWN0Jw4rDnIAAOA12K/c8iFva2Zh4QpFDlYOYA5qDgAAbg5yDgAAAAAAAAAAAAB5DnwOqA6zDgAADg8RDxYPGg8AAWNySA5ODnUAdABlADuA2gDaQHIAb6CfIeMhaXIAoEkpcgDjAVsOAABdDnkADmR2AGUAbGEAAWl5Yw5oDnIAYwA7gNsA20AjZGIibGFjAHBhcgAA4DXYGN1yAGEAdgBlADuA2QDZQOEhY3JqYQABZGl/Dp8OZQByAAABQlCFDpcOAAFhcokOiw5yAF9gYQBjAAABZWuRDpMOAKDfI2UAdAAAoLUjYSVyZW50aGVzaXMAAKDdI28AbgBQoMMi7CF1cwCgjiIAAWdwqw6uDm8AbgByYWYAAOA12EzdAARBREVUYWRwc78O0g7ZDuEOBQPqDvMOBw9yInJvdwDCoZEhyA4AAMwOYQByAACgEilvJHduQXJyb3cAAKDFIW8kd25BcnJvdwAAoJUhcSV1aWxpYnJpdW0AAKBuKWUAZQBBoKUiciJyb3cAAKClIW8AdwBuAGEAcgByAG8A9wAQA2UAcgAAAUxS+Q4AD2UkZnRBcnJvdwAAoJYh6SRnaHRBcnJvdwCglyFpAGyg0gNvAG4ApWPpIW5nbmFjAHIAAOA12LDcaSJsZGUAaGFtAGwAO4DcANxAgAREYmNkZWZvc3YALQ8xDzUPNw89D3IPdg97D4AP4SFzaACgqyJhAHIAAKDrKnkAEmThIXNobKCpIgCg5ioAAWVyQQ9DDwCgwSKAAWJ0eQBJD00Paw9hAHIAAKAWIGmgFiDjIWFsAAJCTFNUWA9cD18PZg9hAHIAAKAjIukhbmV8YGUkcGFyYXRvcgAAoFgnaSJsZGUAAKBAItQkaGluU3BhY2UAoAogcgAA4DXYGd1wAGYAAOA12E3dYwByAADgNdix3GQiYXNoAACgqiKAAmNlZm9zAI4PkQ+VD5kPng/pIXJjdGHkIWdlAKDAInIAAOA12BrdcABmAADgNdhO3WMAcgAA4DXYstwAAmZpb3OqD64Prw+0D3IAAOA12BvdnmNwAGYAAOA12E/dYwByAADgNdiz3IAEQUlVYWNmb3N1AMgPyw/OD9EP2A/gD+QP6Q/uD2MAeQAvZGMAeQAHZGMAeQAuZGMAdQB0AGUAO4DdAN1AAAFpedwP3w9yAGMAdmErZHIAAOA12BzdcABmAADgNdhQ3WMAcgAA4DXYtNxtAGwAeGEABEhhY2RlZm9z/g8BEAUQDRAQEB0QIBAkEGMAeQAWZGMidXRlAHlhAAFheQkQDBDyIW9ufWEXZG8AdAB7YfIBFRAAABwQbwBXAGkAZAB0AOgAVAhhAJZjcgAAoCghcABmAACgJCFjAHIAAOA12LXc4QtCEEkQTRAAAGcQbRByEAAAAAAAAAAAeRCKEJcQ8hD9EAAAGxEhETIROREAAD4RYwB1AHQAZQA7gOEA4UByImV2ZQADYYCiPiJFZGl1eQBWEFkQWxBgEGUQAOA+IjMDAKA/InIAYwA7gOIA4kB0AGUAO4C0ALRAMGRsAGkAZwA7gOYA5kByoGEgAOA12B7dcgBhAHYAZQA7gOAA4EAAAWVwfBCGEAABZnCAEIQQ8yF5bQCgNSHoAIMQaABhALFjAAFhcI0QWwAAAWNskRCTEHIAAWFnAACgPypkApwQAAAAALEQAKInImFkc3ajEKcQqRCuEG4AZAAAoFUqAKBcKmwib3BlAACgWCoAoFoqAKMgImVsbXJzersQvRDAEN0Q5RDtEACgpCllAACgICJzAGQAYaAhImEEzhDQENIQ1BDWENgQ2hDcEACgqCkAoKkpAKCqKQCgqykAoKwpAKCtKQCgrikAoK8pdAB2oB8iYgBkoL4iAKCdKQABcHTpEOwQaAAAoCIixWDhIXJyAKB8IwABZ3D1EPgQbwBuAAVhZgAA4DXYUt0Ao0giRWFlaW9wBxEJEQ0RDxESERQRAKBwKuMhaXIAoG8qAKBKImQAAKBLInMAJ2DyIW94ZaBIIvEADhFpAG4AZwA7gOUA5UCAAWN0eQAmESoRKxFyAADgNdi23CpgbQBwAGWgSCLxAPgBaQBsAGQAZQA7gOMA40BtAGwAO4DkAORAAAFjaUERRxFvAG4AaQBuAPQA6AFuAHQAAKARKgAITmFiY2RlZmlrbG5vcHJzdWQRaBGXEZ8RpxGrEdIR1hErEjASexKKEn0RThNbE3oTbwB0AACg7SoAAWNybBGJEWsAAAJjZXBzdBF4EX0RghHvIW5nAKBMInAjc2lsb24A9mNyImltZQAAoDUgaQBtAGWgPSJxAACgzSJ2AY0RkRFlAGUAAKC9ImUAZABnoAUjZQAAoAUjcgBrAHSgtSPiIXJrAKC2IwABb3mjEaYRbgDnAHcRMWTxIXVvAKAeIIACY21wcnQAtBG5Eb4RwRHFEeEhdXPloDUi5ABwInR5dgAAoLApcwDpAH0RbgBvAPUA6gCAAWFodwDLEcwRzhGyYwCgNiHlIWVuAKBsInIAAOA12B/dZwCAA2Nvc3R1dncA4xHyEQUSEhIhEiYSKRKAAWFpdQDpEesR7xHwAKMFcgBjAACg7yVwAACgwyKAAWRwdAD4EfwRABJvAHQAAKAAKuwhdXMAoAEqaSJtZXMAAKACKnECCxIAAAAADxLjIXVwAKAGKmEAcgAAoAUm8iNpYW5nbGUAAWR1GhIeEu8hd24AoL0lcAAAoLMlcCJsdXMAAKAEKmUA5QBCD+UAkg9hInJvdwAAoA0pgAFha28ANhJoEncSAAFjbjoSZRJrAIABbHN0AEESRxJNEm8jemVuZ2UAAKDrKXEAdQBhAHIA5QBcBPIjaWFuZ2xlgKG0JWRscgBYElwSYBLvIXduAKC+JeUhZnQAoMIlaSJnaHQAAKC4JWsAAKAjJLEBbRIAAHUSsgFxEgAAcxIAoJIlAKCRJTQAAKCTJWMAawAAoIglAAFlb38ShxJx4D0A5SD1IWl2AOBhIuUgdAAAoBAjAAJwdHd4kRKVEpsSnxJmAADgNdhT3XSgpSJvAG0AAKClIvQhaWUAoMgiAAZESFVWYmRobXB0dXayEsES0RLgEvcS+xIKExoTHxMjEygTNxMAAkxSbHK5ErsSvRK/EgCgVyUAoFQlAKBWJQCgUyUAolAlRFVkdckSyxLNEs8SAKBmJQCgaSUAoGQlAKBnJQACTFJsctgS2hLcEt4SAKBdJQCgWiUAoFwlAKBZJQCjUSVITFJobHLrEu0S7xLxEvMS9RIAoGwlAKBjJQCgYCUAoGslAKBiJQCgXyVvAHgAAKDJKQACTFJscgITBBMGEwgTAKBVJQCgUiUAoBAlAKAMJQCiACVEVWR1EhMUExYTGBMAoGUlAKBoJQCgLCUAoDQlaSJudXMAAKCfIuwhdXMAoJ4iaSJtZXMAAKCgIgACTFJsci8TMRMzEzUTAKBbJQCgWCUAoBglAKAUJQCjAiVITFJobHJCE0QTRhNIE0oTTBMAoGolAKBhJQCgXiUAoDwlAKAkJQCgHCUAAWV2UhNVE3YA5QD5AGIAYQByADuApgCmQAACY2Vpb2ITZhNqE24TcgAA4DXYt9xtAGkAAKBPIG0A5aA9IogRbAAAoVwAYmh0E3YTAKDFKfMhdWIAoMgnbAF+E4QTbABloCIgdAAAoCIgcAAAoU4iRWWJE4sTAKCuKvGgTyI8BeEMqRMAAN8TABQDFB8UAAAjFDQUAAAAAIUUAAAAAI0UAAAAANcU4xT3FPsUAACIFQAAlhWAAWNwcgCuE7ET1RP1IXRlB2GAoikiYWJjZHMAuxO/E8QTzhPSE24AZAAAoEQqciJjdXAAAKBJKgABYXXIE8sTcAAAoEsqcAAAoEcqbwB0AACgQCoA4CkiAP4AAWVv2RPcE3QAAKBBIO4ABAUAAmFlaXXlE+8T9RP4E/AB6hMAAO0TcwAAoE0qbwBuAA1hZABpAGwAO4DnAOdAcgBjAAlhcABzAHOgTCptAACgUCpvAHQAC2GAAWRtbgAIFA0UEhRpAGwAO4C4ALhAcCJ0eXYAAKCyKXQAAIGiADtlGBQZFKJAcgBkAG8A9ABiAXIAAOA12CDdgAFjZWkAKBQqFDIUeQBHZGMAawBtoBMn4SFyawCgEyfHY3IAAKPLJUVjZWZtcz8UQRRHFHcUfBSAFACgwykAocYCZWxGFEkUcQAAoFciZQBhAlAUAAAAAGAUciJyb3cAAAFsclYUWhTlIWZ0AKC6IWkiZ2h0AACguyGAAlJTYWNkAGgUaRRrFG8UcxSuYACgyCRzAHQAAKCbIukhcmMAoJoi4SFzaACgnSJuImludAAAoBAqaQBkAACg7yrjIWlyAKDCKfUhYnN1oGMmaQB0AACgYybsApMUmhS2FAAAwxRvAG4AZaA6APGgVCKrAG0CnxQAAAAAoxRhAHSgLABAYAChASJmbKcUqRTuABMNZQAAAW14rhSyFOUhbnQAoAEiZQDzANIB5wG6FAAAwBRkoEUibwB0AACgbSpuAPQAzAGAAWZyeQDIFMsUzhQA4DXYVN1vAOQA1wEAgakAO3MeAdMUcgAAoBchAAFhb9oU3hRyAHIAAKC1IXMAcwAAoBcnAAFjdeYU6hRyAADgNdi43AABYnDuFPIUZaDPKgCg0SploNAqAKDSKuQhb3QAoO8igANkZWxwcnZ3AAYVEBUbFSEVRBVlFYQV4SFycgABbHIMFQ4VAKA4KQCgNSlwAhYVAAAAABkVcgAAoN4iYwAAoN8i4SFycnCgtiEAoD0pgKIqImJjZG9zACsVMBU6FT4VQRVyImNhcAAAoEgqAAFhdTQVNxVwAACgRipwAACgSipvAHQAAKCNInIAAKBFKgDgKiIA/gACYWxydksVURVuFXMVcgByAG2gtyEAoDwpeQCAAWV2dwBYFWUVaRVxAHACXxUAAAAAYxVyAGUA4wAXFXUA4wAZFWUAZQAAoM4iZSJkZ2UAAKDPImUAbgA7gKQApEBlI2Fycm93AAABbHJ7FX8V5SFmdACgtiFpImdodAAAoLchZQDkAG0VAAFjaYsVkRVvAG4AaQBuAPQAkwFuAHQAAKAxImwiY3R5AACgLSOACUFIYWJjZGVmaGlqbG9yc3R1d3oAuBW7Fb8V1RXgFegV+RUKFhUWHxZUFlcWZRbFFtsW7xb7FgUXChdyAPIAtAJhAHIAAKBlKQACZ2xyc8YVyhXOFdAV5yFlcgCgICDlIXRoAKA4IfIA9QxoAHagECAAoKMiawHZFd4VYSJyb3cAAKAPKWEA4wBfAgABYXnkFecV8iFvbg9hNGQAoUYhYW/tFfQVAAFnciEC8RVyAACgyiF0InNlcQAAoHcqgAFnbG0A/xUCFgUWO4CwALBAdABhALRjcCJ0eXYAAKCxKQABaXIOFhIW8yFodACgfykA4DXYId1hAHIAAAFschsWHRYAoMMhAKDCIYACYWVnc3YAKBauAjYWOhY+Fm0AAKHEIm9zLhY0Fm4AZABzoMQi9SFpdACgZiZhIm1tYQDdY2kAbgAAoPIiAKH3AGlvQxZRFmQAZQAAgfcAO29KFksW90BuI3RpbWVzAACgxyJuAPgAUBZjAHkAUmRjAG8CXhYAAAAAYhZyAG4AAKAeI28AcAAAoA0jgAJscHR1dwBuFnEWdRaSFp4W7CFhciRgZgAA4DXYVd0AotkCZW1wc30WhBaJFo0WcQBkoFAibwB0AACgUSJpIm51cwAAoDgi7CF1cwCgFCLxInVhcmUAoKEiYgBsAGUAYgBhAHIAdwBlAGQAZwDlANcAbgCAAWFkaAClFqoWtBZyAHIAbwD3APUMbwB3AG4AYQByAHIAbwB3APMA8xVhI3Jwb29uAAABbHK8FsAWZQBmAPQAHBZpAGcAaAD0AB4WYgHJFs8WawBhAHIAbwD3AJILbwLUFgAAAADYFnIAbgAAoB8jbwBwAACgDCOAAWNvdADhFukW7BYAAXJ55RboFgDgNdi53FVkbAAAoPYp8iFvaxFhAAFkcvMW9xZvAHQAAKDxImkA5qC/JVsSAAFhaP8WAhdyAPIANQNhAPIA1wvhIm5nbGUAoKYpAAFjaQ4XEBd5AF9k5yJyYXJyAKD/JwAJRGFjZGVmZ2xtbm9wcXJzdHV4MRc4F0YXWxcyBF4XaRd5F40XrBe0F78X2RcVGCEYLRg1GEAYAAFEbzUXgRZvAPQA+BUAAWNzPBdCF3UAdABlADuA6QDpQPQhZXIAoG4qAAJhaW95TRdQF1YXWhfyIW9uG2FyAGOgViI7gOoA6kDsIW9uAKBVIk1kbwB0ABdhAAFEcmIXZhdvAHQAAKBSIgDgNdgi3XKhmipuF3QXYQB2AGUAO4DoAOhAZKCWKm8AdAAAoJgqgKGZKmlscwCAF4UXhxfuInRlcnMAoOcjAKATIWSglSpvAHQAAKCXKoABYXBzAJMXlheiF2MAcgATYXQAeQBzogUinxcAAAAAoRdlAHQAAKAFInAAMaADIDMBqRerFwCgBCAAoAUgAAFnc7AXsRdLYXAAAKACIAABZ3C4F7sXbwBuABlhZgAA4DXYVt2AAWFscwDFF8sXzxdyAHOg1SJsAACg4yl1AHMAAKBxKmkAAKG1A2x21RfYF28AbgC1Y/VjAAJjc3V24BfoF/0XEBgAAWlv5BdWF3IAYwAAoFYiaQLuFwAAAADwF+0ADQThIW50AAFnbPUX+Rd0AHIAAKCWKuUhc3MAoJUqgAFhZWkAAxgGGAoYbABzAD1gcwB0AACgXyJ2AESgYSJEAACgeCrwImFyc2wAoOUpAAFEYRkYHRhvAHQAAKBTInIAcgAAoHEpgAFjZGkAJxgqGO0XcgAAoC8hbwD0AIwCAAFhaDEYMhi3YzuA8ADwQAABbXI5GD0YbAA7gOsA60BvAACgrCCAAWNpcABGGEgYSxhsACFgcwD0ACwEAAFlb08YVxhjAHQAYQB0AGkAbwDuABoEbgBlAG4AdABpAGEAbADlADME4Ql1GAAAgRgAAIMYiBgAAAAAoRilGAAAqhgAALsYvhjRGAAA1xgnGWwAbABpAG4AZwBkAG8AdABzAGUA8QBlF3kARGRtImFsZQAAoEAmgAFpbHIAjRiRGJ0Y7CFpZwCgA/tpApcYAAAAAJoYZwAAoAD7aQBnAACgBPsA4DXYI93sIWlnAKAB++whaWcA4GYAagCAAWFsdACvGLIYthh0AACgbSZpAGcAAKAC+24AcwAAoLElbwBmAJJh8AHCGAAAxhhmAADgNdhX3QABYWvJGMwYbADsAGsEdqDUIgCg2SphI3J0aW50AACgDSoAAWFv2hgiGQABY3PeGB8ZsQPnGP0YBRkSGRUZAAAdGbID7xjyGPQY9xj5GAAA+xg7gL0AvUAAoFMhO4C8ALxAAKBVIQCgWSEAoFshswEBGQAAAxkAoFQhAKBWIbQCCxkOGQAAAAAQGTuAvgC+QACgVyEAoFwhNQAAoFghtgEZGQAAGxkAoFohAKBdITgAAKBeIWwAAKBEIHcAbgAAoCIjYwByAADgNdi73IAIRWFiY2RlZmdpamxub3JzdHYARhlKGVoZXhlmGWkZkhmWGZkZnRmgGa0ZxhnLGc8Z4BkjGmygZyIAoIwqgAFjbXAAUBlTGVgZ9SF0ZfVhbQBhAOSgswM6FgCghipyImV2ZQAfYQABaXliGWUZcgBjAB1hM2RvAHQAIWGAoWUibHFzAMYEcBl6GfGhZSLOBAAAdhlsAGEAbgD0AN8EgKF+KmNkbACBGYQZjBljAACgqSpvAHQAb6CAKmyggioAoIQqZeDbIgD+cwAAoJQqcgAA4DXYJN3noGsirATtIWVsAKA3IWMAeQBTZIChdyJFYWoApxmpGasZAKCSKgCgpSoAoKQqAAJFYWVztBm2Gb0ZwhkAoGkicABwoIoq8iFveACgiipxoIgq8aCIKrUZaQBtAACg5yJwAGYAAOA12FjdYQB2AOUAYwIAAWNp0xnWGXIAAKAKIW0AAKFzImVs3BneGQCgjioAoJAqAIM+ADtjZGxxco0E6xn0GfgZ/BkBGgABY2nvGfEZAKCnKnIAAKB6Km8AdAAAoNci0CFhcgCglSl1ImVzdAAAoHwqgAJhZGVscwAKGvQZFhrVBCAa8AEPGgAAFBpwAHIAbwD4AFkZcgAAoHgpcQAAAWxxxAQbGmwAZQBzAPMASRlpAO0A5AQAAWVuJxouGnIjdG5lcXEAAOBpIgD+xQAsGgAFQWFiY2Vma29zeUAaQxpmGmoabRqDGocalhrCGtMacgDyAMwCAAJpbG1yShpOGlAaVBpyAHMA8ABxD2YAvWBpAGwA9AASBQABZHJYGlsaYwB5AEpkAKGUIWN3YBpkGmkAcgAAoEgpAKCtIWEAcgAAoA8h6SFyYyVhgAFhbHIAcxp7Gn8a8iF0c3WgZSZpAHQAAKBlJuwhaXAAoCYg4yFvbgCguSJyAADgNdgl3XMAAAFld4wakRphInJvdwAAoCUpYSJyb3cAAKAmKYACYW1vcHIAnxqjGqcauhq+GnIAcgAAoP8h9CFodACgOyJrAAABbHKsGrMaZSRmdGFycm93AACgqSHpJGdodGFycm93AKCqIWYAAOA12Fnd4iFhcgCgFSCAAWNsdADIGswa0BpyAADgNdi93GEAcwDoAGka8iFvaydhAAFicNca2xr1IWxsAKBDIOghZW4AoBAg4Qr2GgAA/RoAAAgbExsaGwAAIRs7GwAAAAA+G2IbmRuVG6sbAACyG80b0htjAHUAdABlADuA7QDtQAChYyBpeQEbBhtyAGMAO4DuAO5AOGQAAWN4CxsNG3kANWRjAGwAO4ChAKFAAAFmcssCFhsA4DXYJt1yAGEAdgBlADuA7ADsQIChSCFpbm8AJxsyGzYbAAFpbisbLxtuAHQAAKAMKnQAAKAtIuYhaW4AoNwpdABhAACgKSHsIWlnM2GAAWFvcABDG1sbXhuAAWNndABJG0sbWRtyACthgAFlbHAAcQVRG1UbaQBuAOUAyAVhAHIA9AByBWgAMWFmAACgtyJlAGQAtWEAoggiY2ZvdGkbbRt1G3kb4SFyZQCgBSFpAG4AdKAeImkAZQAAoN0pZABvAPQAWxsAoisiY2VscIEbhRuPG5QbYQBsAACguiIAAWdyiRuNG2UAcgDzACMQ4wCCG2EicmhrAACgFyryIW9kAKA8KgACY2dwdJ8boRukG6gbeQBRZG8AbgAvYWYAAOA12FrdYQC5Y3UAZQBzAHQAO4C/AL9AAAFjabUbuRtyAADgNdi+3G4AAKIIIkVkc3bCG8QbyBvQAwCg+SJvAHQAAKD1Inag9CIAoPMiaaBiIOwhZGUpYesB1hsAANkbYwB5AFZkbAA7gO8A70AAA2NmbW9zdeYb7hvyG/Ub+hsFHAABaXnqG+0bcgBjADVhOWRyAADgNdgn3eEhdGg3YnAAZgAA4DXYW93jAf8bAAADHHIAAOA12L/c8iFjeVhk6yFjeVRkAARhY2ZnaGpvcxUcGhwiHCYcKhwtHDAcNRzwIXBhdqC6A/BjAAFleR4cIRzkIWlsN2E6ZHIAAOA12CjdciJlZW4AOGFjAHkARWRjAHkAXGRwAGYAAOA12FzdYwByAADgNdjA3IALQUJFSGFiY2RlZmdoamxtbm9wcnN0dXYAXhxtHHEcdRx5HN8cBx0dHTwd3B3tHfEdAR4EHh0eLB5FHrwewx7hHgkfPR9LH4ABYXJ0AGQcZxxpHHIA8gBvB/IAxQLhIWlsAKAbKeEhcnIAoA4pZ6BmIgCgiyphAHIAAKBiKWMJjRwAAJAcAACVHAAAAAAAAAAAAACZHJwcAACmHKgcrRwAANIc9SF0ZTph7SJwdHl2AKC0KXIAYQDuAFoG4iFkYbtjZwAAoegnZGyhHKMcAKCRKeUAiwYAoIUqdQBvADuAqwCrQHIAgKOQIWJmaGxwc3QAuhy/HMIcxBzHHMoczhxmoOQhcwAAoB8pcwAAoB0p6wCyGnAAAKCrIWwAAKA5KWkAbQAAoHMpbAAAoKIhAKGrKmFl1hzaHGkAbAAAoBkpc6CtKgDgrSoA/oABYWJyAOUc6RztHHIAcgAAoAwpcgBrAACgcicAAWFr8Rz4HGMAAAFla/Yc9xx7YFtgAAFlc/wc/hwAoIspbAAAAWR1Ax0FHQCgjykAoI0pAAJhZXV5Dh0RHRodHB3yIW9uPmEAAWRpFR0YHWkAbAA8YewAowbiAPccO2QAAmNxcnMkHScdLB05HWEAAKA2KXUAbwDyoBwgqhEAAWR1MB00HeghYXIAoGcpcyJoYXIAAKBLKWgAAKCyIQCiZCJmZ3FzRB1FB5Qdnh10AIACYWhscnQATh1WHWUdbB2NHXIicm93AHSgkCFhAOkAzxxhI3Jwb29uAAABZHVeHWId7yF3bgCgvSFwAACgvCHlJGZ0YXJyb3dzAKDHIWkiZ2h0AIABYWhzAHUdex2DHXIicm93APOglCGdBmEAcgBwAG8AbwBuAPMAzgtxAHUAaQBnAGEAcgByAG8A9wBlGugkcmVldGltZXMAoMsi8aFkIk0HAACaHWwAYQBuAPQAXgcAon0qY2Rnc6YdqR2xHbcdYwAAoKgqbwB0AG+gfypyoIEqAKCDKmXg2iIA/nMAAKCTKoACYWRlZ3MAwB3GHcod1h3ZHXAAcAByAG8A+ACmHG8AdAAAoNYicQAAAWdxzx3SHXQA8gBGB2cAdADyAHQcdADyAFMHaQDtAGMHgAFpbHIA4h3mHeod8yFodACgfClvAG8A8gDKBgDgNdgp3UWgdiIAoJEqYQH1Hf4dcgAAAWR1YB35HWygvCEAoGopbABrAACghCVjAHkAWWQAomoiYWNodAweDx4VHhkecgDyAGsdbwByAG4AZQDyAGAW4SFyZACgaylyAGkAAKD6JQABaW8hHiQe5CFvdEBh9SFzdGGgsCPjIWhlAKCwIwACRWFlczMeNR48HkEeAKBoInAAcKCJKvIhb3gAoIkqcaCHKvGghyo0HmkAbQAAoOYiAARhYm5vcHR3elIeXB5fHoUelh6mHqsetB4AAW5yVh5ZHmcAAKDsJ3IAAKD9IXIA6wCwBmcAgAFsbXIAZh52Hnse5SFmdAABYXKIB2weaQBnAGgAdABhAHIAcgBvAPcAkwfhInBzdG8AoPwnaQBnAGgAdABhAHIAcgBvAPcAmgdwI2Fycm93AAABbHKNHpEeZQBmAPQAxhxpImdodAAAoKwhgAFhZmwAnB6fHqIecgAAoIUpAOA12F3ddQBzAACgLSppIm1lcwAAoDQqYQGvHrMecwB0AACgFyLhAIoOZaHKJbkeRhLuIWdlAKDKJWEAcgBsoCgAdAAAoJMpgAJhY2htdADMHs8e1R7bHt0ecgDyAJ0GbwByAG4AZQDyANYWYQByAGSgyyEAoG0pAKAOIHIAaQAAoL8iAANhY2hpcXTrHu8e1QfzHv0eBh/xIXVvAKA5IHIAAOA12MHcbQDloXIi+h4AAPweAKCNKgCgjyoAAWJ19xwBH28AcqAYIACgGiDyIW9rQmEAhDwAO2NkaGlscXJCBhcfxh0gHyQfKB8sHzEfAAFjaRsfHR8AoKYqcgAAoHkqcgBlAOUAkx3tIWVzAKDJIuEhcnIAoHYpdSJlc3QAAKB7KgABUGk1HzkfYQByAACglillocMlAgdfEnIAAAFkdUIfRx9zImhhcgAAoEop6CFhcgCgZikAAWVuTx9WH3IjdG5lcXEAAOBoIgD+xQBUHwAHRGFjZGVmaGlsbm9wc3VuH3Ifoh+rH68ftx+7H74f5h/uH/MfBwj/HwsgxCFvdACgOiIAAmNscHJ5H30fiR+eH3IAO4CvAK9AAAFldIEfgx8AoEImZaAgJ3MAZQAAoCAnc6CmIXQAbwCAoaYhZGx1AJQfmB+cH28AdwDuAHkDZQBmAPQA6gbwAOkO6yFlcgCgriUAAW95ph+qH+0hbWEAoCkqPGThIXNoAKAUIOElc3VyZWRhbmdsZQCgISJyAADgNdgq3W8AAKAnIYABY2RuAMQfyR/bH3IAbwA7gLUAtUBhoiMi0B8AANMf1x9zAPQAKxFpAHIAAKDwKm8AdAA7gLcAt0B1AHMA4qESIh4TAADjH3WgOCIAoCoqYwHqH+0fcAAAoNsq8gB+GnAAbAB1APMACAgAAWRw9x/7H+UhbHMAoKciZgAA4DXYXt0AAWN0AyAHIHIAAOA12MLc8CFvcwCgPiJsobwDECAVIPQiaW1hcACguCJhAPAAEyAADEdMUlZhYmNkZWZnaGlqbG1vcHJzdHV2dzwgRyBmIG0geSCqILgg2iDeIBEhFSEyIUMhTSFQIZwhnyHSIQAiIyKLIrEivyIUIwABZ3RAIEMgAODZIjgD9uBrItIgBwmAAWVsdABNIF8gYiBmAHQAAAFhclMgWCByInJvdwAAoM0h6SRnaHRhcnJvdwCgziEA4NgiOAP24Goi0iBfCekkZ2h0YXJyb3cAoM8hAAFEZHEgdSDhIXNoAKCvIuEhc2gAoK4igAJiY25wdACCIIYgiSCNIKIgbABhAACgByL1IXRlRGFnAADgICLSIACiSSJFaW9wlSCYIJwgniAA4HAqOANkAADgSyI4A3MASWFyAG8A+AAyCnUAcgBhoG4mbADzoG4mmwjzAa8gAACzIHAAO4CgAKBAbQBwAOXgTiI4AyoJgAJhZW91eQDBIMogzSDWINkg8AHGIAAAyCAAoEMqbwBuAEhh5CFpbEZhbgBnAGSgRyJvAHQAAOBtKjgDcAAAoEIqPWThIXNoAKATIACjYCJBYWRxc3jpIO0g+SD+IAIhDCFyAHIAAKDXIXIAAAFocvIg9SBrAACgJClvoJch9wAGD28AdAAA4FAiOAN1AGkA9gC7CAABZWkGIQohYQByAACgKCntAN8I6SFzdPOgBCLlCHIAAOA12CvdAAJFZXN0/wgcISshLiHxoXEiIiEAABMJ8aFxIgAJAAAnIWwAYQBuAPQAEwlpAO0AGQlyoG8iAKBvIoABQWFwADghOyE/IXIA8gBeIHIAcgAAoK4hYQByAACg8ipzogsiSiEAAAAAxwtkoPwiAKD6ImMAeQBaZIADQUVhZGVzdABcIV8hYiFmIWkhkyGWIXIA8gBXIADgZiI4A3IAcgAAoJohcgAAoCUggKFwImZxcwBwIYQhjiF0AAABYXJ1IXohcgByAG8A9wBlIWkAZwBoAHQAYQByAHIAbwD3AD4h8aFwImAhAACKIWwAYQBuAPQAZwlz4H0qOAMAoG4iaQDtAG0JcqBuImkA5aDqIkUJaQDkADoKAAFwdKMhpyFmAADgNdhf3YCBrAA7aW4AriGvIcchrEBuAIChCSJFZHYAtyG6Ib8hAOD5IjgDbwB0AADg9SI4A+EB1gjEIcYhAKD3IgCg9iJpAHagDCLhAagJzyHRIQCg/iIAoP0igAFhb3IA2CHsIfEhcgCAoSYiYXN0AOAh5SHpIWwAbABlAOwAywhsAADg/SrlIADgAiI4A2wiaW50AACgFCrjoYAi9yEAAPohdQDlAJsJY+CvKjgDZaCAIvEAkwkAAkFhaXQHIgoiFyIeInIA8gBsIHIAcgAAoZshY3cRIhQiAOAzKTgDAOCdITgDZyRodGFycm93AACgmyFyAGkA5aDrIr4JgANjaGltcHF1AC8iPCJHIpwhTSJQIloigKGBImNlcgA2Iv0JOSJ1AOUABgoA4DXYw9zvIXJ0bQKdIQAAAABEImEAcgDhAOEhbQBloEEi8aBEIiYKYQDyAMsIcwB1AAABYnBWIlgi5QDUCeUA3wmAAWJjcABgInMieCKAoYQiRWVzAGci7glqIgDgxSo4A2UAdABl4IIi0iBxAPGgiCJoImMAZaCBIvEA/gmAoYUiRWVzAH8iFgqCIgDgxio4A2UAdABl4IMi0iBxAPGgiSKAIgACZ2lscpIilCKaIpwi7AAMCWwAZABlADuA8QDxQOcAWwlpI2FuZ2xlAAABbHKkIqoi5SFmdGWg6iLxAEUJaSJnaHQAZaDrIvEAvgltoL0DAKEjAGVzuCK8InIAbwAAoBYhcAAAoAcggARESGFkZ2lscnMAziLSItYi2iLeIugi7SICIw8j4SFzaACgrSLhIXJyAKAEKXAAAOBNItIg4SFzaACgrCIAAWV04iLlIgDgZSLSIADgPgDSIG4iZmluAACg3imAAUFldADzIvci+iJyAHIAAKACKQDgZCLSIHLgPADSIGkAZQAA4LQi0iAAAUF0BiMKI3IAcgAAoAMp8iFpZQDgtSLSIGkAbQAA4Dwi0iCAAUFhbgAaIx4jKiNyAHIAAKDWIXIAAAFociMjJiNrAACgIylvoJYh9wD/DuUhYXIAoCcpUxJqFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVCMAAF4jaSN/I4IjjSOeI8AUAAAAAKYjwCMAANoj3yMAAO8jHiQvJD8kRCQAAWNzVyNsFHUAdABlADuA8wDzQAABaXlhI2cjcgBjoJoiO4D0APRAPmSAAmFiaW9zAHEjdCN3I3EBeiNzAOgAdhTsIWFjUWF2AACgOCrvIWxkAKC8KewhaWdTYQABY3KFI4kjaQByAACgvykA4DXYLN1vA5QjAAAAAJYjAACcI24A22JhAHYAZQA7gPIA8kAAoMEpAAFibaEjjAphAHIAAKC1KQACYWNpdKwjryO6I70jcgDyAFkUAAFpcrMjtiNyAACgvinvIXNzAKC7KW4A5QDZCgCgwCmAAWFlaQDFI8gjyyNjAHIATWFnAGEAyWOAAWNkbgDRI9Qj1iPyIW9uv2MAoLYpdQDzAHgBcABmAADgNdhg3YABYWVsAOQj5yPrI3IAAKC3KXIAcAAAoLkpdQDzAHwBAKMoImFkaW9zdvkj/CMPJBMkFiQbJHIA8gBeFIChXSplZm0AAyQJJAwkcgBvoDQhZgAAoDQhO4CqAKpAO4C6ALpA5yFvZgCgtiJyAACgVipsIm9wZQAAoFcqAKBbKoABY2xvACMkJSQrJPIACCRhAHMAaAA7gPgA+EBsAACgmCJpAGwBMyQ4JGQAZQA7gPUA9UBlAHMAYaCXInMAAKA2Km0AbAA7gPYA9kDiIWFyAKA9I+EKXiQAAHokAAB8JJQkAACYJKkkAAAAALUkEQsAAPAkAAAAAAQleiUAAIMlcgCAoSUiYXN0AGUkbyQBCwCBtgA7bGokayS2QGwAZQDsABgDaQJ1JAAAAAB4JG0AAKDzKgCg/Sp5AD9kcgCAAmNpbXB0AIUkiCSLJJkSjyRuAHQAJWBvAGQALmBpAGwAAKAwIOUhbmsAoDEgcgAA4DXYLd2AAWltbwCdJKAkpCR2oMYD1WNtAGEA9AD+B24AZQAAoA4m9KHAA64kAAC0JGMjaGZvcmsAAKDUItZjAAFhdbgkxCRuAAABY2u9JMIkawBooA8hAKAOIfYAaRpzAACkKwBhYmNkZW1zdNMkIRPXJNsk4STjJOck6yTjIWlyAKAjKmkAcgAAoCIqAAFvdYsW3yQAoCUqAKByKm4AO4CxALFAaQBtAACgJip3AG8AAKAnKoABaXB1APUk+iT+JO4idGludACgFSpmAADgNdhh3W4AZAA7gKMAo0CApHoiRWFjZWlub3N1ABMlFSUYJRslTCVRJVklSSV1JQCgsypwAACgtyp1AOUAPwtjoK8qgKJ6ImFjZW5zACclLSU0JTYlSSVwAHAAcgBvAPgAFyV1AHIAbAB5AGUA8QA/C/EAOAuAAWFlcwA8JUElRSXwInByb3gAoLkqcQBxAACgtSppAG0AAKDoImkA7QBEC20AZQDzoDIgIguAAUVhcwBDJVclRSXwAEAlgAFkZnAATwtfJXElgAFhbHMAZSVpJW0l7CFhcgCgLiPpIW5lAKASI/UhcmYAoBMjdKAdIu8AWQvyIWVsAKCwIgABY2l9JYElcgAA4DXYxdzIY24iY3NwAACgCCAAA2Zpb3BzdZElKxuVJZolnyWkJXIAAOA12C7dcABmAADgNdhi3XIiaW1lAACgVyBjAHIAAOA12MbcgAFhZW8AqiW6JcAldAAAAWVpryW2JXIAbgBpAG8AbgDzABkFbgB0AACgFipzAHQAZaA/APEACRj0AG0LgApBQkhhYmNkZWZoaWxtbm9wcnN0dXgA4yXyJfYl+iVpJpAmpia9JtUm5ib4JlonaCdxJ3UnnietJ7EnyCfiJ+cngAFhcnQA6SXsJe4lcgDyAJkM8gD6AuEhaWwAoBwpYQByAPIA3BVhAHIAAKBkKYADY2RlbnFydAAGJhAmEyYYJiYmKyZaJgABZXUKJg0mAOA9IjEDdABlAFVhaQDjACAN7SJwdHl2AKCzKWcAgKHpJ2RlbAAgJiImJCYAoJIpAKClKeUA9wt1AG8AO4C7ALtAcgAApZIhYWJjZmhscHN0dz0mQCZFJkcmSiZMJk4mUSZVJlgmcAAAoHUpZqDlIXMAAKAgKQCgMylzAACgHinrALka8ACVHmwAAKBFKWkAbQAAoHQpbAAAoKMhAKCdIQABYWleJmImaQBsAACgGilvAG6gNiJhAGwA8wB2C4ABYWJyAG8mciZ2JnIA8gAvEnIAawAAoHMnAAFha3omgSZjAAABZWt/JoAmfWBdYAABZXOFJocmAKCMKWwAAAFkdYwmjiYAoI4pAKCQKQACYWV1eZcmmiajJqUm8iFvbllhAAFkaZ4moSZpAGwAV2HsAA8M4gCAJkBkAAJjbHFzrSawJrUmuiZhAACgNylkImhhcgAAoGkpdQBvAPKgHSCjAWgAAKCzIYABYWNnAMMm0iaUC2wAgKEcIWlwcwDLJs4migxuAOUAoAxhAHIA9ADaC3QAAKCtJYABaWxyANsm3ybjJvMhaHQAoH0pbwBvAPIANgwA4DXYL90AAWFv6ib1JnIAAAFkde8m8SYAoMEhbKDAIQCgbCl2oMED8WOAAWducwD+Jk4nUCdoAHQAAANhaGxyc3QKJxInISc1Jz0nRydyInJvdwB0oJIhYQDpAFYmYSNycG9vbgAAAWR1GiceJ28AdwDuAPAmcAAAoMAh5SFmdAABYWgnJy0ncgByAG8AdwDzAAkMYQByAHAAbwBvAG4A8wATBGklZ2h0YXJyb3dzAACgySFxAHUAaQBnAGEAcgByAG8A9wBZJugkcmVldGltZXMAoMwiZwDaYmkAbgBnAGQAbwB0AHMAZQDxABwYgAFhaG0AYCdjJ2YncgDyAAkMYQDyABMEAKAPIG8idXN0AGGgsSPjIWhlAKCxI+0haWQAoO4qAAJhYnB0fCeGJ4knmScAAW5ygCeDJ2cAAKDtJ3IAAKD+IXIA6wAcDIABYWZsAI8nkieVJ3IAAKCGKQDgNdhj3XUAcwAAoC4qaSJtZXMAAKA1KgABYXCiJ6gncgBnoCkAdAAAoJQp7yJsaW50AKASKmEAcgDyADwnAAJhY2hxuCe8J6EMwCfxIXVvAKA6IHIAAOA12MfcAAFidYAmxCdvAPKgGSCoAYABaGlyAM4n0ifWJ3IAZQDlAE0n7SFlcwCgyiJpAIChuSVlZmwAXAxjEt4n9CFyaQCgzinsInVoYXIAoGgpAKAeIWENBSgJKA0oSyhVKIYoAACLKLAoAAAAAOMo5ygAABApJCkxKW0pcSmHKaYpAACYKgAAAACxKmMidXRlAFthcQB1AO8ABR+ApHsiRWFjZWlucHN5ABwoHignKCooLygyKEEoRihJKACgtCrwASMoAAAlKACguCpvAG4AYWF1AOUAgw1koLAqaQBsAF9hcgBjAF1hgAFFYXMAOCg6KD0oAKC2KnAAAKC6KmkAbQAAoOki7yJsaW50AKATKmkA7QCIDUFkbwB0AGKixSKRFgAAAABTKACgZiqAA0FhY21zdHgAYChkKG8ocyh1KHkogihyAHIAAKDYIXIAAAFocmkoayjrAJAab6CYIfcAzAd0ADuApwCnQGkAO2D3IWFyAKApKW0AAAFpbn4ozQBuAHUA8wDOAHQAAKA2J3IA7+A12DDdIxkAAmFjb3mRKJUonSisKHIAcAAAoG8mAAFoeZkonChjAHkASWRIZHIAdABtAqUoAAAAAKgoaQDkAFsPYQByAGEA7ABsJDuArQCtQAABZ22zKLsobQBhAAChwwNmdroouijCY4CjPCJkZWdsbnByAMgozCjPKNMo1yjaKN4obwB0AACgairxoEMiCw5FoJ4qAKCgKkWgnSoAoJ8qZQAAoEYi7CF1cwCgJCrhIXJyAKByKWEAcgDyAPwMAAJhZWl07Sj8KAEpCCkAAWxz8Sj4KGwAcwBlAHQAbQDpAH8oaABwAACgMyrwImFyc2wAoOQpAAFkbFoPBSllAACgIyNloKoqc6CsKgDgrCoA/oABZmxwABUpGCkfKfQhY3lMZGKgLwBhoMQpcgAAoD8jZgAA4DXYZN1hAAABZHIoKRcDZQBzAHWgYCZpAHQAAKBgJoABY3N1ADYpRilhKQABYXU6KUApcABzoJMiAOCTIgD+cABzoJQiAOCUIgD+dQAAAWJwSylWKQChjyJlcz4NUCllAHQAZaCPIvEAPw0AoZAiZXNIDVspZQB0AGWgkCLxAEkNAKGhJWFmZilbBHIAZQFrKVwEAKChJWEAcgDyAAMNAAJjZW10dyl7KX8pgilyAADgNdjI3HQAbQDuAM4AaQDsAAYpYQByAOYAVw0AAWFyiimOKXIA5qAGJhESAAFhbpIpoylpImdodAAAAWVwmSmgKXAAcwBpAGwAbwDuANkXaADpAKAkcwCvYIACYmNtbnAArin8KY4NJSooKgCkgiJFZGVtbnByc7wpvinCKcgpzCnUKdgp3CkAoMUqbwB0AACgvSpkoIYibwB0AACgwyr1IWx0AKDBKgABRWXQKdIpAKDLKgCgiiLsIXVzAKC/KuEhcnIAoHkpgAFlaXUA4inxKfQpdAAAoYIiZW7oKewpcQDxoIYivSllAHEA8aCKItEpbQAAoMcqAAFicPgp+ikAoNUqAKDTKmMAgKJ7ImFjZW5zAAcqDSoUKhYqRihwAHAAcgBvAPgAIyh1AHIAbAB5AGUA8QCDDfEAfA2AAWFlcwAcKiIqPShwAHAAcgBvAPgAPChxAPEAOShnAACgaiYApoMiMTIzRWRlaGxtbnBzPCo/KkIqRSpHKlIqWCpjKmcqaypzKncqO4C5ALlAO4CyALJAO4CzALNAAKDGKgABb3NLKk4qdAAAoL4qdQBiAACg2CpkoIcibwB0AACgxCpzAAABb3VdKmAqbAAAoMknYgAAoNcq4SFycgCgeyn1IWx0AKDCKgABRWVvKnEqAKDMKgCgiyLsIXVzAKDAKoABZWl1AH0qjCqPKnQAAKGDImVugyqHKnEA8aCHIkYqZQBxAPGgiyJwKm0AAKDIKgABYnCTKpUqAKDUKgCg1iqAAUFhbgCdKqEqrCpyAHIAAKDZIXIAAAFocqYqqCrrAJUab6CZIfcAxQf3IWFyAKAqKWwAaQBnADuA3wDfQOELzyrZKtwq6SrsKvEqAAD1KjQrAAAAAAAAAAAAAEwrbCsAAHErvSsAAAAAAADRK3IC1CoAAAAA2CrnIWV0AKAWI8RjcgDrAOUKgAFhZXkA4SrkKucq8iFvbmVh5CFpbGNhQmRvAPQAIg5sInJlYwAAoBUjcgAA4DXYMd0AAmVpa2/7KhIrKCsuK/IBACsAAAkrZQAAATRm6g0EK28AcgDlAOsNYQBzorgDECsAAAAAEit5AG0A0WMAAWNuFislK2sAAAFhcxsrIStwAHAAcgBvAPgAFw5pAG0AAKA8InMA8AD9DQABYXMsKyEr8AAXDnIAbgA7gP4A/kDsATgrOyswG2QA5QBnAmUAcwCAgdcAO2JkAEMrRCtJK9dAYaCgInIAAKAxKgCgMCqAAWVwcwBRK1MraSvhAAkh4qKkIlsrXysAAAAAYytvAHQAAKA2I2kAcgAAoPEqb+A12GXdcgBrAACg2irhAHgociJpbWUAAKA0IIABYWlwAHYreSu3K2QA5QC+DYADYWRlbXBzdACFK6MrmiunK6wrsCuzK24iZ2xlAACitSVkbHFykCuUK5ornCvvIXduAKC/JeUhZnRloMMl8QACBwCgXCJpImdodABloLkl8QBdDG8AdAAAoOwlaSJudXMAAKA6KuwhdXMAoDkqYgAAoM0p6SFtZQCgOyrlInppdW0AoOIjgAFjaHQAwivKK80rAAFyecYrySsA4DXYydxGZGMAeQBbZPIhb2tnYQABaW/UK9creAD0ANERaCJlYWQAAAFsct4r5ytlAGYAdABhAHIAcgBvAPcAXQbpJGdodGFycm93AKCgIQAJQUhhYmNkZmdobG1vcHJzdHV3CiwNLBEsHSwnLDEsQCxLLFIsYix6LIQsjyzLLOgs7Sz/LAotcgDyAAkDYQByAACgYykAAWNyFSwbLHUAdABlADuA+gD6QPIACQ1yAOMBIywAACUseQBeZHYAZQBtYQABaXkrLDAscgBjADuA+wD7QENkgAFhYmgANyw6LD0scgDyANEO7CFhY3FhYQDyAOAOAAFpckQsSCzzIWh0AKB+KQDgNdgy3XIAYQB2AGUAO4D5APlAYQFWLF8scgAAAWxyWixcLACgvyEAoL4hbABrAACggCUAAWN0Zix2LG8CbCwAAAAAcyxyAG4AZaAcI3IAAKAcI28AcAAAoA8jcgBpAACg+CUAAWFsfiyBLGMAcgBrYTuAqACoQAABZ3CILIssbwBuAHNhZgAA4DXYZt0AA2FkaGxzdZksniynLLgsuyzFLHIAcgBvAPcACQ1vAHcAbgBhAHIAcgBvAPcA2A5hI3Jwb29uAAABbHKvLLMsZQBmAPQAWyxpAGcAaAD0AF0sdQDzAKYOaQAAocUDaGzBLMIs0mNvAG4AxWPwI2Fycm93cwCgyCGAAWNpdADRLOEs5CxvAtcsAAAAAN4scgBuAGWgHSNyAACgHSNvAHAAAKAOI24AZwBvYXIAaQAAoPklYwByAADgNdjK3IABZGlyAPMs9yz6LG8AdAAAoPAi7CFkZWlhaQBmoLUlAKC0JQABYW0DLQYtcgDyAMosbAA7gPwA/EDhIm5nbGUAoKcpgAdBQkRhY2RlZmxub3Byc3oAJy0qLTAtNC2bLZ0toS2/LcMtxy3TLdgt3C3gLfwtcgDyABADYQByAHag6CoAoOkqYQBzAOgA/gIAAW5yOC08LechcnQAoJwpgANla25wcnN0AJkpSC1NLVQtXi1iLYItYQBwAHAA4QAaHG8AdABoAGkAbgDnAKEXgAFoaXIAoSmzJFotbwBwAPQAdCVooJUh7wD4JgABaXVmLWotZwBtAOEAuygAAWJwbi14LXMjZXRuZXEAceCKIgD+AODLKgD+cyNldG5lcQBx4IsiAP4A4MwqAP4AAWhyhi2KLWUAdADhABIraSNhbmdsZQAAAWxyki2WLeUhZnQAoLIiaSJnaHQAAKCzInkAMmThIXNoAKCiIoABZWxyAKcttC24LWKiKCKuLQAAAACyLWEAcgAAoLsicQAAoFoi7CFpcACg7iIAAWJ0vC1eD2EA8gBfD3IAAOA12DPddAByAOkAlS1zAHUAAAFicM0t0C0A4IIi0iAA4IMi0iBwAGYAAOA12GfdcgBvAPAAWQt0AHIA6QCaLQABY3XkLegtcgAA4DXYy9wAAWJw7C30LW4AAAFFZXUt8S0A4IoiAP5uAAABRWV/LfktAOCLIgD+6SJnemFnAKCaKYADY2Vmb3BycwANLhAuJS4pLiMuLi40LukhcmN1YQABZGkULiEuAAFiZxguHC5hAHIAAKBfKmUAcaAnIgCgWSLlIXJwAKAYIXIAAOA12DTdcABmAADgNdho3WWgQCJhAHQA6ABqD2MAcgAA4DXYzNzjCuQRUC4AAFQuAABYLmIuAAAAAGMubS5wLnQuAAAAAIguki4AAJouJxIqEnQAcgDpAB0ScgAA4DXYNd0AAUFhWy5eLnIA8gDnAnIA8gCTB75jAAFBYWYuaS5yAPIA4AJyAPIAjAdhAPAAeh5pAHMAAKD7IoABZHB0APgReS6DLgABZmx9LoAuAOA12GnddQDzAP8RaQBtAOUABBIAAUFhiy6OLnIA8gDuAnIA8gCaBwABY3GVLgoScgAA4DXYzdwAAXB0nS6hLmwAdQDzACUScgDpACASAARhY2VmaW9zdbEuvC7ELsguzC7PLtQu2S5jAAABdXm2LrsudABlADuA/QD9QE9kAAFpecAuwy5yAGMAd2FLZG4AO4ClAKVAcgAA4DXYNt1jAHkAV2RwAGYAAOA12GrdYwByAADgNdjO3AABY23dLt8ueQBOZGwAO4D/AP9AAAVhY2RlZmhpb3N38y73Lv8uAi8MLxAvEy8YLx0vIi9jInV0ZQB6YQABYXn7Lv4u8iFvbn5hN2RvAHQAfGEAAWV0Bi8KL3QAcgDmAB8QYQC2Y3IAAOA12DfdYwB5ADZk5yJyYXJyAKDdIXAAZgAA4DXYa91jAHIAAOA12M/cAAFqbiYvKC8AoA0gagAAoAwg");

// node_modules/htmlparser2/node_modules/entities/dist/esm/generated/decode-data-xml.js
var xmlDecodeTree = /* @__PURE__ */ decodeBase64("AAJhZ2xxBwARABMAFQBtAg0AAAAAAA8AcAAmYG8AcwAnYHQAPmB0ADxg9SFvdCJg");

// node_modules/htmlparser2/node_modules/entities/dist/esm/internal/bin-trie-flags.js
var BinTrieFlags;
(function(BinTrieFlags3) {
  BinTrieFlags3[BinTrieFlags3["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags3[BinTrieFlags3["FLAG13"] = 8192] = "FLAG13";
  BinTrieFlags3[BinTrieFlags3["BRANCH_LENGTH"] = 8064] = "BRANCH_LENGTH";
  BinTrieFlags3[BinTrieFlags3["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));

// node_modules/htmlparser2/node_modules/entities/dist/esm/decode.js
var CharCodes;
(function(CharCodes4) {
  CharCodes4[CharCodes4["NUM"] = 35] = "NUM";
  CharCodes4[CharCodes4["SEMI"] = 59] = "SEMI";
  CharCodes4[CharCodes4["EQUALS"] = 61] = "EQUALS";
  CharCodes4[CharCodes4["ZERO"] = 48] = "ZERO";
  CharCodes4[CharCodes4["NINE"] = 57] = "NINE";
  CharCodes4[CharCodes4["LOWER_A"] = 97] = "LOWER_A";
  CharCodes4[CharCodes4["LOWER_F"] = 102] = "LOWER_F";
  CharCodes4[CharCodes4["LOWER_X"] = 120] = "LOWER_X";
  CharCodes4[CharCodes4["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes4[CharCodes4["UPPER_A"] = 65] = "UPPER_A";
  CharCodes4[CharCodes4["UPPER_F"] = 70] = "UPPER_F";
  CharCodes4[CharCodes4["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
var TO_LOWER_BIT = 32;
function isNumber(code) {
  return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
function isEntityInAttributeInvalidEnd(code) {
  return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
}
var EntityDecoderState;
(function(EntityDecoderState3) {
  EntityDecoderState3[EntityDecoderState3["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState3[EntityDecoderState3["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState3[EntityDecoderState3["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState3[EntityDecoderState3["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState3[EntityDecoderState3["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode3) {
  DecodingMode3[DecodingMode3["Legacy"] = 0] = "Legacy";
  DecodingMode3[DecodingMode3["Strict"] = 1] = "Strict";
  DecodingMode3[DecodingMode3["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
var EntityDecoder = class {
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
    this.state = EntityDecoderState.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode.Strict;
    this.runConsumed = 0;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
    this.runConsumed = 0;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(input, offset) {
    switch (this.state) {
      case EntityDecoderState.EntityStart: {
        if (input.charCodeAt(offset) === CharCodes.NUM) {
          this.state = EntityDecoderState.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(input, offset + 1);
        }
        this.state = EntityDecoderState.NamedEntity;
        return this.stateNamedEntity(input, offset);
      }
      case EntityDecoderState.NumericStart: {
        return this.stateNumericStart(input, offset);
      }
      case EntityDecoderState.NumericDecimal: {
        return this.stateNumericDecimal(input, offset);
      }
      case EntityDecoderState.NumericHex: {
        return this.stateNumericHex(input, offset);
      }
      case EntityDecoderState.NamedEntity: {
        return this.stateNamedEntity(input, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(input, offset) {
    if (offset >= input.length) {
      return -1;
    }
    if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
      this.state = EntityDecoderState.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(input, offset + 1);
    }
    this.state = EntityDecoderState.NumericDecimal;
    return this.stateNumericDecimal(input, offset);
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(input, offset) {
    while (offset < input.length) {
      const char = input.charCodeAt(offset);
      if (isNumber(char) || isHexadecimalCharacter(char)) {
        const digit = char <= CharCodes.NINE ? char - CharCodes.ZERO : (char | TO_LOWER_BIT) - CharCodes.LOWER_A + 10;
        this.result = this.result * 16 + digit;
        this.consumed++;
        offset++;
      } else {
        return this.emitNumericEntity(char, 3);
      }
    }
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(input, offset) {
    while (offset < input.length) {
      const char = input.charCodeAt(offset);
      if (isNumber(char)) {
        this.result = this.result * 10 + (char - CharCodes.ZERO);
        this.consumed++;
        offset++;
      } else {
        return this.emitNumericEntity(char, 2);
      }
    }
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a3;
    if (this.consumed <= expectedLength) {
      (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param input The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(input, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
    while (offset < input.length) {
      if (valueLength === 0 && (current & BinTrieFlags.FLAG13) !== 0) {
        const runLength = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
        if (this.runConsumed === 0) {
          const firstChar = current & BinTrieFlags.JUMP_TABLE;
          if (input.charCodeAt(offset) !== firstChar) {
            return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
          }
          offset++;
          this.excess++;
          this.runConsumed++;
        }
        while (this.runConsumed < runLength) {
          if (offset >= input.length) {
            return -1;
          }
          const charIndexInPacked = this.runConsumed - 1;
          const packedWord = decodeTree[this.treeIndex + 1 + (charIndexInPacked >> 1)];
          const expectedChar = charIndexInPacked % 2 === 0 ? packedWord & 255 : packedWord >> 8 & 255;
          if (input.charCodeAt(offset) !== expectedChar) {
            this.runConsumed = 0;
            return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
          }
          offset++;
          this.excess++;
          this.runConsumed++;
        }
        this.runConsumed = 0;
        this.treeIndex += 1 + (runLength >> 1);
        current = decodeTree[this.treeIndex];
        valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      }
      if (offset >= input.length)
        break;
      const char = input.charCodeAt(offset);
      if (char === CharCodes.SEMI && valueLength !== 0 && (current & BinTrieFlags.FLAG13) !== 0) {
        return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
      }
      this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode.Strict && (current & BinTrieFlags.FLAG13) === 0) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
      offset++;
      this.excess++;
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a3;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~(BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13) : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a3;
    switch (this.state) {
      case EntityDecoderState.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      // Otherwise, emit a numeric entity if we have one.
      case EntityDecoderState.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState.NumericStart: {
        (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState.EntityStart: {
        return 0;
      }
    }
  }
};
function determineBranch(decodeTree, current, nodeIndex, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
  }
  const packedKeySlots = branchCount + 1 >> 1;
  let lo = 0;
  let hi = branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const slot = mid >> 1;
    const packed = decodeTree[nodeIndex + slot];
    const midKey = packed >> (mid & 1) * 8 & 255;
    if (midKey < char) {
      lo = mid + 1;
    } else if (midKey > char) {
      hi = mid - 1;
    } else {
      return decodeTree[nodeIndex + packedKeySlots + mid];
    }
  }
  return -1;
}

// node_modules/htmlparser2/dist/esm/Tokenizer.js
var CharCodes2;
(function(CharCodes4) {
  CharCodes4[CharCodes4["Tab"] = 9] = "Tab";
  CharCodes4[CharCodes4["NewLine"] = 10] = "NewLine";
  CharCodes4[CharCodes4["FormFeed"] = 12] = "FormFeed";
  CharCodes4[CharCodes4["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes4[CharCodes4["Space"] = 32] = "Space";
  CharCodes4[CharCodes4["ExclamationMark"] = 33] = "ExclamationMark";
  CharCodes4[CharCodes4["Number"] = 35] = "Number";
  CharCodes4[CharCodes4["Amp"] = 38] = "Amp";
  CharCodes4[CharCodes4["SingleQuote"] = 39] = "SingleQuote";
  CharCodes4[CharCodes4["DoubleQuote"] = 34] = "DoubleQuote";
  CharCodes4[CharCodes4["Dash"] = 45] = "Dash";
  CharCodes4[CharCodes4["Slash"] = 47] = "Slash";
  CharCodes4[CharCodes4["Zero"] = 48] = "Zero";
  CharCodes4[CharCodes4["Nine"] = 57] = "Nine";
  CharCodes4[CharCodes4["Semi"] = 59] = "Semi";
  CharCodes4[CharCodes4["Lt"] = 60] = "Lt";
  CharCodes4[CharCodes4["Eq"] = 61] = "Eq";
  CharCodes4[CharCodes4["Gt"] = 62] = "Gt";
  CharCodes4[CharCodes4["Questionmark"] = 63] = "Questionmark";
  CharCodes4[CharCodes4["UpperA"] = 65] = "UpperA";
  CharCodes4[CharCodes4["LowerA"] = 97] = "LowerA";
  CharCodes4[CharCodes4["UpperF"] = 70] = "UpperF";
  CharCodes4[CharCodes4["LowerF"] = 102] = "LowerF";
  CharCodes4[CharCodes4["UpperZ"] = 90] = "UpperZ";
  CharCodes4[CharCodes4["LowerZ"] = 122] = "LowerZ";
  CharCodes4[CharCodes4["LowerX"] = 120] = "LowerX";
  CharCodes4[CharCodes4["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes2 || (CharCodes2 = {}));
var State;
(function(State2) {
  State2[State2["Text"] = 1] = "Text";
  State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
  State2[State2["InTagName"] = 3] = "InTagName";
  State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
  State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
  State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
  State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
  State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
  State2[State2["InAttributeName"] = 9] = "InAttributeName";
  State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
  State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
  State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
  State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
  State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
  State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
  State2[State2["InDeclaration"] = 16] = "InDeclaration";
  State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
  State2[State2["BeforeComment"] = 18] = "BeforeComment";
  State2[State2["CDATASequence"] = 19] = "CDATASequence";
  State2[State2["InSpecialComment"] = 20] = "InSpecialComment";
  State2[State2["InCommentLike"] = 21] = "InCommentLike";
  State2[State2["BeforeSpecialS"] = 22] = "BeforeSpecialS";
  State2[State2["BeforeSpecialT"] = 23] = "BeforeSpecialT";
  State2[State2["SpecialStartSequence"] = 24] = "SpecialStartSequence";
  State2[State2["InSpecialTag"] = 25] = "InSpecialTag";
  State2[State2["InEntity"] = 26] = "InEntity";
})(State || (State = {}));
function isWhitespace(c) {
  return c === CharCodes2.Space || c === CharCodes2.NewLine || c === CharCodes2.Tab || c === CharCodes2.FormFeed || c === CharCodes2.CarriageReturn;
}
function isEndOfTagSection(c) {
  return c === CharCodes2.Slash || c === CharCodes2.Gt || isWhitespace(c);
}
function isASCIIAlpha(c) {
  return c >= CharCodes2.LowerA && c <= CharCodes2.LowerZ || c >= CharCodes2.UpperA && c <= CharCodes2.UpperZ;
}
var QuoteType;
(function(QuoteType2) {
  QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
  QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
  QuoteType2[QuoteType2["Single"] = 2] = "Single";
  QuoteType2[QuoteType2["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
var Sequences = {
  Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
  // CDATA[
  CdataEnd: new Uint8Array([93, 93, 62]),
  // ]]>
  CommentEnd: new Uint8Array([45, 45, 62]),
  // `-->`
  ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
  // `</script`
  StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
  // `</style`
  TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
  // `</title`
  TextareaEnd: new Uint8Array([
    60,
    47,
    116,
    101,
    120,
    116,
    97,
    114,
    101,
    97
  ]),
  // `</textarea`
  XmpEnd: new Uint8Array([60, 47, 120, 109, 112])
  // `</xmp`
};
var Tokenizer = class {
  constructor({ xmlMode = false, decodeEntities = true }, cbs) {
    this.cbs = cbs;
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.entityStart = 0;
    this.baseState = State.Text;
    this.isSpecial = false;
    this.running = true;
    this.offset = 0;
    this.currentSequence = void 0;
    this.sequenceIndex = 0;
    this.xmlMode = xmlMode;
    this.decodeEntities = decodeEntities;
    this.entityDecoder = new EntityDecoder(xmlMode ? xmlDecodeTree : htmlDecodeTree, (cp, consumed) => this.emitCodePoint(cp, consumed));
  }
  reset() {
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.currentSequence = void 0;
    this.running = true;
    this.offset = 0;
  }
  write(chunk) {
    this.offset += this.buffer.length;
    this.buffer = chunk;
    this.parse();
  }
  end() {
    if (this.running)
      this.finish();
  }
  pause() {
    this.running = false;
  }
  resume() {
    this.running = true;
    if (this.index < this.buffer.length + this.offset) {
      this.parse();
    }
  }
  stateText(c) {
    if (c === CharCodes2.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes2.Lt)) {
      if (this.index > this.sectionStart) {
        this.cbs.ontext(this.sectionStart, this.index);
      }
      this.state = State.BeforeTagName;
      this.sectionStart = this.index;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.startEntity();
    }
  }
  stateSpecialStartSequence(c) {
    const isEnd = this.sequenceIndex === this.currentSequence.length;
    const isMatch = isEnd ? (
      // If we are at the end of the sequence, make sure the tag name has ended
      isEndOfTagSection(c)
    ) : (
      // Otherwise, do a case-insensitive comparison
      (c | 32) === this.currentSequence[this.sequenceIndex]
    );
    if (!isMatch) {
      this.isSpecial = false;
    } else if (!isEnd) {
      this.sequenceIndex++;
      return;
    }
    this.sequenceIndex = 0;
    this.state = State.InTagName;
    this.stateInTagName(c);
  }
  /** Look for an end tag. For <title> tags, also decode entities. */
  stateInSpecialTag(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (c === CharCodes2.Gt || isWhitespace(c)) {
        const endOfText = this.index - this.currentSequence.length;
        if (this.sectionStart < endOfText) {
          const actualIndex = this.index;
          this.index = endOfText;
          this.cbs.ontext(this.sectionStart, endOfText);
          this.index = actualIndex;
        }
        this.isSpecial = false;
        this.sectionStart = endOfText + 2;
        this.stateInClosingTagName(c);
        return;
      }
      this.sequenceIndex = 0;
    }
    if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (this.sequenceIndex === 0) {
      if (this.currentSequence === Sequences.TitleEnd) {
        if (this.decodeEntities && c === CharCodes2.Amp) {
          this.startEntity();
        }
      } else if (this.fastForwardTo(CharCodes2.Lt)) {
        this.sequenceIndex = 1;
      }
    } else {
      this.sequenceIndex = Number(c === CharCodes2.Lt);
    }
  }
  stateCDATASequence(c) {
    if (c === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length) {
        this.state = State.InCommentLike;
        this.currentSequence = Sequences.CdataEnd;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      }
    } else {
      this.sequenceIndex = 0;
      this.state = State.InDeclaration;
      this.stateInDeclaration(c);
    }
  }
  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   *
   * @returns Whether the character was found.
   */
  fastForwardTo(c) {
    while (++this.index < this.buffer.length + this.offset) {
      if (this.buffer.charCodeAt(this.index - this.offset) === c) {
        return true;
      }
    }
    this.index = this.buffer.length + this.offset - 1;
    return false;
  }
  /**
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   */
  stateInCommentLike(c) {
    if (c === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        } else {
          this.cbs.oncomment(this.sectionStart, this.index, 2);
        }
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
        this.state = State.Text;
      }
    } else if (this.sequenceIndex === 0) {
      if (this.fastForwardTo(this.currentSequence[0])) {
        this.sequenceIndex = 1;
      }
    } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
      this.sequenceIndex = 0;
    }
  }
  /**
   * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
   *
   * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
   * We allow anything that wouldn't end the tag.
   */
  isTagStartChar(c) {
    return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
  }
  startSpecial(sequence, offset) {
    this.isSpecial = true;
    this.currentSequence = sequence;
    this.sequenceIndex = offset;
    this.state = State.SpecialStartSequence;
  }
  stateBeforeTagName(c) {
    if (c === CharCodes2.ExclamationMark) {
      this.state = State.BeforeDeclaration;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Questionmark) {
      this.state = State.InProcessingInstruction;
      this.sectionStart = this.index + 1;
    } else if (this.isTagStartChar(c)) {
      const lower = c | 32;
      this.sectionStart = this.index;
      if (this.xmlMode) {
        this.state = State.InTagName;
      } else if (lower === Sequences.ScriptEnd[2]) {
        this.state = State.BeforeSpecialS;
      } else if (lower === Sequences.TitleEnd[2] || lower === Sequences.XmpEnd[2]) {
        this.state = State.BeforeSpecialT;
      } else {
        this.state = State.InTagName;
      }
    } else if (c === CharCodes2.Slash) {
      this.state = State.BeforeClosingTagName;
    } else {
      this.state = State.Text;
      this.stateText(c);
    }
  }
  stateInTagName(c) {
    if (isEndOfTagSection(c)) {
      this.cbs.onopentagname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateBeforeClosingTagName(c) {
    if (isWhitespace(c)) {
    } else if (c === CharCodes2.Gt) {
      this.state = State.Text;
    } else {
      this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
      this.sectionStart = this.index;
    }
  }
  stateInClosingTagName(c) {
    if (c === CharCodes2.Gt || isWhitespace(c)) {
      this.cbs.onclosetag(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterClosingTagName;
      this.stateAfterClosingTagName(c);
    }
  }
  stateAfterClosingTagName(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeAttributeName(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onopentagend(this.index);
      if (this.isSpecial) {
        this.state = State.InSpecialTag;
        this.sequenceIndex = 0;
      } else {
        this.state = State.Text;
      }
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.Slash) {
      this.state = State.InSelfClosingTag;
    } else if (!isWhitespace(c)) {
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateInSelfClosingTag(c) {
    if (c === CharCodes2.Gt) {
      this.cbs.onselfclosingtag(this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
      this.isSpecial = false;
    } else if (!isWhitespace(c)) {
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateInAttributeName(c) {
    if (c === CharCodes2.Eq || isEndOfTagSection(c)) {
      this.cbs.onattribname(this.sectionStart, this.index);
      this.sectionStart = this.index;
      this.state = State.AfterAttributeName;
      this.stateAfterAttributeName(c);
    }
  }
  stateAfterAttributeName(c) {
    if (c === CharCodes2.Eq) {
      this.state = State.BeforeAttributeValue;
    } else if (c === CharCodes2.Slash || c === CharCodes2.Gt) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (!isWhitespace(c)) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateBeforeAttributeValue(c) {
    if (c === CharCodes2.DoubleQuote) {
      this.state = State.InAttributeValueDq;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes2.SingleQuote) {
      this.state = State.InAttributeValueSq;
      this.sectionStart = this.index + 1;
    } else if (!isWhitespace(c)) {
      this.sectionStart = this.index;
      this.state = State.InAttributeValueNq;
      this.stateInAttributeValueNoQuotes(c);
    }
  }
  handleInAttributeValue(c, quote) {
    if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(quote === CharCodes2.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index + 1);
      this.state = State.BeforeAttributeName;
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.startEntity();
    }
  }
  stateInAttributeValueDoubleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.DoubleQuote);
  }
  stateInAttributeValueSingleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes2.SingleQuote);
  }
  stateInAttributeValueNoQuotes(c) {
    if (isWhitespace(c) || c === CharCodes2.Gt) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(QuoteType.Unquoted, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (this.decodeEntities && c === CharCodes2.Amp) {
      this.startEntity();
    }
  }
  stateBeforeDeclaration(c) {
    if (c === CharCodes2.OpeningSquareBracket) {
      this.state = State.CDATASequence;
      this.sequenceIndex = 0;
    } else {
      this.state = c === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
    }
  }
  stateInDeclaration(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.ondeclaration(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateInProcessingInstruction(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeComment(c) {
    if (c === CharCodes2.Dash) {
      this.state = State.InCommentLike;
      this.currentSequence = Sequences.CommentEnd;
      this.sequenceIndex = 2;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InDeclaration;
    }
  }
  stateInSpecialComment(c) {
    if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeSpecialS(c) {
    const lower = c | 32;
    if (lower === Sequences.ScriptEnd[3]) {
      this.startSpecial(Sequences.ScriptEnd, 4);
    } else if (lower === Sequences.StyleEnd[3]) {
      this.startSpecial(Sequences.StyleEnd, 4);
    } else {
      this.state = State.InTagName;
      this.stateInTagName(c);
    }
  }
  stateBeforeSpecialT(c) {
    const lower = c | 32;
    switch (lower) {
      case Sequences.TitleEnd[3]: {
        this.startSpecial(Sequences.TitleEnd, 4);
        break;
      }
      case Sequences.TextareaEnd[3]: {
        this.startSpecial(Sequences.TextareaEnd, 4);
        break;
      }
      case Sequences.XmpEnd[3]: {
        this.startSpecial(Sequences.XmpEnd, 4);
        break;
      }
      default: {
        this.state = State.InTagName;
        this.stateInTagName(c);
      }
    }
  }
  startEntity() {
    this.baseState = this.state;
    this.state = State.InEntity;
    this.entityStart = this.index;
    this.entityDecoder.startEntity(this.xmlMode ? DecodingMode.Strict : this.baseState === State.Text || this.baseState === State.InSpecialTag ? DecodingMode.Legacy : DecodingMode.Attribute);
  }
  stateInEntity() {
    const indexInBuffer = this.index - this.offset;
    const length = this.entityDecoder.write(this.buffer, indexInBuffer);
    if (length >= 0) {
      this.state = this.baseState;
      if (length === 0) {
        this.index -= 1;
      }
    } else {
      if (indexInBuffer < this.buffer.length && this.buffer.charCodeAt(indexInBuffer) === CharCodes2.Amp) {
        this.state = this.baseState;
        this.index -= 1;
        return;
      }
      this.index = this.offset + this.buffer.length - 1;
    }
  }
  /**
   * Remove data that has already been consumed from the buffer.
   */
  cleanup() {
    if (this.running && this.sectionStart !== this.index) {
      if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
        this.cbs.ontext(this.sectionStart, this.index);
        this.sectionStart = this.index;
      } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = this.index;
      }
    }
  }
  shouldContinue() {
    return this.index < this.buffer.length + this.offset && this.running;
  }
  /**
   * Iterates through the buffer, calling the function corresponding to the current state.
   *
   * States that are more likely to be hit are higher up, as a performance improvement.
   */
  parse() {
    while (this.shouldContinue()) {
      const c = this.buffer.charCodeAt(this.index - this.offset);
      switch (this.state) {
        case State.Text: {
          this.stateText(c);
          break;
        }
        case State.SpecialStartSequence: {
          this.stateSpecialStartSequence(c);
          break;
        }
        case State.InSpecialTag: {
          this.stateInSpecialTag(c);
          break;
        }
        case State.CDATASequence: {
          this.stateCDATASequence(c);
          break;
        }
        case State.InAttributeValueDq: {
          this.stateInAttributeValueDoubleQuotes(c);
          break;
        }
        case State.InAttributeName: {
          this.stateInAttributeName(c);
          break;
        }
        case State.InCommentLike: {
          this.stateInCommentLike(c);
          break;
        }
        case State.InSpecialComment: {
          this.stateInSpecialComment(c);
          break;
        }
        case State.BeforeAttributeName: {
          this.stateBeforeAttributeName(c);
          break;
        }
        case State.InTagName: {
          this.stateInTagName(c);
          break;
        }
        case State.InClosingTagName: {
          this.stateInClosingTagName(c);
          break;
        }
        case State.BeforeTagName: {
          this.stateBeforeTagName(c);
          break;
        }
        case State.AfterAttributeName: {
          this.stateAfterAttributeName(c);
          break;
        }
        case State.InAttributeValueSq: {
          this.stateInAttributeValueSingleQuotes(c);
          break;
        }
        case State.BeforeAttributeValue: {
          this.stateBeforeAttributeValue(c);
          break;
        }
        case State.BeforeClosingTagName: {
          this.stateBeforeClosingTagName(c);
          break;
        }
        case State.AfterClosingTagName: {
          this.stateAfterClosingTagName(c);
          break;
        }
        case State.BeforeSpecialS: {
          this.stateBeforeSpecialS(c);
          break;
        }
        case State.BeforeSpecialT: {
          this.stateBeforeSpecialT(c);
          break;
        }
        case State.InAttributeValueNq: {
          this.stateInAttributeValueNoQuotes(c);
          break;
        }
        case State.InSelfClosingTag: {
          this.stateInSelfClosingTag(c);
          break;
        }
        case State.InDeclaration: {
          this.stateInDeclaration(c);
          break;
        }
        case State.BeforeDeclaration: {
          this.stateBeforeDeclaration(c);
          break;
        }
        case State.BeforeComment: {
          this.stateBeforeComment(c);
          break;
        }
        case State.InProcessingInstruction: {
          this.stateInProcessingInstruction(c);
          break;
        }
        case State.InEntity: {
          this.stateInEntity();
          break;
        }
      }
      this.index++;
    }
    this.cleanup();
  }
  finish() {
    if (this.state === State.InEntity) {
      this.entityDecoder.end();
      this.state = this.baseState;
    }
    this.handleTrailingData();
    this.cbs.onend();
  }
  /** Handle any trailing data. */
  handleTrailingData() {
    const endIndex = this.buffer.length + this.offset;
    if (this.sectionStart >= endIndex) {
      return;
    }
    if (this.state === State.InCommentLike) {
      if (this.currentSequence === Sequences.CdataEnd) {
        this.cbs.oncdata(this.sectionStart, endIndex, 0);
      } else {
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
      }
    } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
    } else {
      this.cbs.ontext(this.sectionStart, endIndex);
    }
  }
  emitCodePoint(cp, consumed) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      if (this.sectionStart < this.entityStart) {
        this.cbs.onattribdata(this.sectionStart, this.entityStart);
      }
      this.sectionStart = this.entityStart + consumed;
      this.index = this.sectionStart - 1;
      this.cbs.onattribentity(cp);
    } else {
      if (this.sectionStart < this.entityStart) {
        this.cbs.ontext(this.sectionStart, this.entityStart);
      }
      this.sectionStart = this.entityStart + consumed;
      this.index = this.sectionStart - 1;
      this.cbs.ontextentity(cp, this.sectionStart);
    }
  }
};

// node_modules/htmlparser2/dist/esm/Parser.js
var formTags = /* @__PURE__ */ new Set([
  "input",
  "option",
  "optgroup",
  "select",
  "button",
  "datalist",
  "textarea"
]);
var pTag = /* @__PURE__ */ new Set(["p"]);
var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
var openImpliesClose = /* @__PURE__ */ new Map([
  ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
  ["th", /* @__PURE__ */ new Set(["th"])],
  ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
  ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
  ["li", /* @__PURE__ */ new Set(["li"])],
  ["p", pTag],
  ["h1", pTag],
  ["h2", pTag],
  ["h3", pTag],
  ["h4", pTag],
  ["h5", pTag],
  ["h6", pTag],
  ["select", formTags],
  ["input", formTags],
  ["output", formTags],
  ["button", formTags],
  ["datalist", formTags],
  ["textarea", formTags],
  ["option", /* @__PURE__ */ new Set(["option"])],
  ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
  ["dd", ddtTags],
  ["dt", ddtTags],
  ["address", pTag],
  ["article", pTag],
  ["aside", pTag],
  ["blockquote", pTag],
  ["details", pTag],
  ["div", pTag],
  ["dl", pTag],
  ["fieldset", pTag],
  ["figcaption", pTag],
  ["figure", pTag],
  ["footer", pTag],
  ["form", pTag],
  ["header", pTag],
  ["hr", pTag],
  ["main", pTag],
  ["nav", pTag],
  ["ol", pTag],
  ["pre", pTag],
  ["section", pTag],
  ["table", pTag],
  ["ul", pTag],
  ["rt", rtpTags],
  ["rp", rtpTags],
  ["tbody", tableSectionTags],
  ["tfoot", tableSectionTags]
]);
var voidElements = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
var htmlIntegrationElements = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignobject",
  "desc",
  "title"
]);
var reNameEnd = /\s|\//;
var Parser = class {
  constructor(cbs, options = {}) {
    var _a3, _b, _c, _d, _e, _f;
    this.options = options;
    this.startIndex = 0;
    this.endIndex = 0;
    this.openTagStart = 0;
    this.tagname = "";
    this.attribname = "";
    this.attribvalue = "";
    this.attribs = null;
    this.stack = [];
    this.buffers = [];
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
    this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
    this.htmlMode = !this.options.xmlMode;
    this.lowerCaseTagNames = (_a3 = options.lowerCaseTags) !== null && _a3 !== void 0 ? _a3 : this.htmlMode;
    this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : this.htmlMode;
    this.recognizeSelfClosing = (_c = options.recognizeSelfClosing) !== null && _c !== void 0 ? _c : !this.htmlMode;
    this.tokenizer = new ((_d = options.Tokenizer) !== null && _d !== void 0 ? _d : Tokenizer)(this.options, this);
    this.foreignContext = [!this.htmlMode];
    (_f = (_e = this.cbs).onparserinit) === null || _f === void 0 ? void 0 : _f.call(_e, this);
  }
  // Tokenizer event handlers
  /** @internal */
  ontext(start, endIndex) {
    var _a3, _b;
    const data = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1;
    (_b = (_a3 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a3, data);
    this.startIndex = endIndex;
  }
  /** @internal */
  ontextentity(cp, endIndex) {
    var _a3, _b;
    this.endIndex = endIndex - 1;
    (_b = (_a3 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a3, fromCodePoint(cp));
    this.startIndex = endIndex;
  }
  /**
   * Checks if the current tag is a void element. Override this if you want
   * to specify your own additional void elements.
   */
  isVoidElement(name) {
    return this.htmlMode && voidElements.has(name);
  }
  /** @internal */
  onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    this.emitOpenTag(name);
  }
  emitOpenTag(name) {
    var _a3, _b, _c, _d;
    this.openTagStart = this.startIndex;
    this.tagname = name;
    const impliesClose = this.htmlMode && openImpliesClose.get(name);
    if (impliesClose) {
      while (this.stack.length > 0 && impliesClose.has(this.stack[0])) {
        const element = this.stack.shift();
        (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, element, true);
      }
    }
    if (!this.isVoidElement(name)) {
      this.stack.unshift(name);
      if (this.htmlMode) {
        if (foreignContextElements.has(name)) {
          this.foreignContext.unshift(true);
        } else if (htmlIntegrationElements.has(name)) {
          this.foreignContext.unshift(false);
        }
      }
    }
    (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
    if (this.cbs.onopentag)
      this.attribs = {};
  }
  endOpenTag(isImplied) {
    var _a3, _b;
    this.startIndex = this.openTagStart;
    if (this.attribs) {
      (_b = (_a3 = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a3, this.tagname, this.attribs, isImplied);
      this.attribs = null;
    }
    if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
      this.cbs.onclosetag(this.tagname, true);
    }
    this.tagname = "";
  }
  /** @internal */
  onopentagend(endIndex) {
    this.endIndex = endIndex;
    this.endOpenTag(false);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onclosetag(start, endIndex) {
    var _a3, _b, _c, _d, _e, _f, _g, _h;
    this.endIndex = endIndex;
    let name = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    if (this.htmlMode && (foreignContextElements.has(name) || htmlIntegrationElements.has(name))) {
      this.foreignContext.shift();
    }
    if (!this.isVoidElement(name)) {
      const pos = this.stack.indexOf(name);
      if (pos !== -1) {
        for (let index = 0; index <= pos; index++) {
          const element = this.stack.shift();
          (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, element, index !== pos);
        }
      } else if (this.htmlMode && name === "p") {
        this.emitOpenTag("p");
        this.closeCurrentTag(true);
      }
    } else if (this.htmlMode && name === "br") {
      (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, "br");
      (_f = (_e = this.cbs).onopentag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", {}, true);
      (_h = (_g = this.cbs).onclosetag) === null || _h === void 0 ? void 0 : _h.call(_g, "br", false);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onselfclosingtag(endIndex) {
    this.endIndex = endIndex;
    if (this.recognizeSelfClosing || this.foreignContext[0]) {
      this.closeCurrentTag(false);
      this.startIndex = endIndex + 1;
    } else {
      this.onopentagend(endIndex);
    }
  }
  closeCurrentTag(isOpenImplied) {
    var _a3, _b;
    const name = this.tagname;
    this.endOpenTag(isOpenImplied);
    if (this.stack[0] === name) {
      (_b = (_a3 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a3, name, !isOpenImplied);
      this.stack.shift();
    }
  }
  /** @internal */
  onattribname(start, endIndex) {
    this.startIndex = start;
    const name = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
  }
  /** @internal */
  onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  /** @internal */
  onattribentity(cp) {
    this.attribvalue += fromCodePoint(cp);
  }
  /** @internal */
  onattribend(quote, endIndex) {
    var _a3, _b;
    this.endIndex = endIndex;
    (_b = (_a3 = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a3, this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
    if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
      this.attribs[this.attribname] = this.attribvalue;
    }
    this.attribvalue = "";
  }
  getInstructionName(value) {
    const index = value.search(reNameEnd);
    let name = index < 0 ? value : value.substr(0, index);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    return name;
  }
  /** @internal */
  ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncomment(start, endIndex, offset) {
    var _a3, _b, _c, _d;
    this.endIndex = endIndex;
    (_b = (_a3 = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a3, this.getSlice(start, endIndex - offset));
    (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncdata(start, endIndex, offset) {
    var _a3, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex - offset);
    if (!this.htmlMode || this.options.recognizeCDATA) {
      (_b = (_a3 = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a3);
      (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
      (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
    } else {
      (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, `[CDATA[${value}]]`);
      (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onend() {
    var _a3, _b;
    if (this.cbs.onclosetag) {
      this.endIndex = this.startIndex;
      for (let index = 0; index < this.stack.length; index++) {
        this.cbs.onclosetag(this.stack[index], true);
      }
    }
    (_b = (_a3 = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a3);
  }
  /**
   * Resets the parser to a blank state, ready to parse a new HTML document
   */
  reset() {
    var _a3, _b, _c, _d;
    (_b = (_a3 = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a3);
    this.tokenizer.reset();
    this.tagname = "";
    this.attribname = "";
    this.attribs = null;
    this.stack.length = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    this.buffers.length = 0;
    this.foreignContext.length = 0;
    this.foreignContext.unshift(!this.htmlMode);
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
  }
  /**
   * Resets the parser, then parses a complete document and
   * pushes it to the handler.
   *
   * @param data Document to parse.
   */
  parseComplete(data) {
    this.reset();
    this.end(data);
  }
  getSlice(start, end) {
    while (start - this.bufferOffset >= this.buffers[0].length) {
      this.shiftBuffer();
    }
    let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
    while (end - this.bufferOffset > this.buffers[0].length) {
      this.shiftBuffer();
      slice += this.buffers[0].slice(0, end - this.bufferOffset);
    }
    return slice;
  }
  shiftBuffer() {
    this.bufferOffset += this.buffers[0].length;
    this.writeIndex--;
    this.buffers.shift();
  }
  /**
   * Parses a chunk of data and calls the corresponding callbacks.
   *
   * @param chunk Chunk to parse.
   */
  write(chunk) {
    var _a3, _b;
    if (this.ended) {
      (_b = (_a3 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a3, new Error(".write() after done!"));
      return;
    }
    this.buffers.push(chunk);
    if (this.tokenizer.running) {
      this.tokenizer.write(chunk);
      this.writeIndex++;
    }
  }
  /**
   * Parses the end of the buffer and clears the stack, calls onend.
   *
   * @param chunk Optional final chunk to parse.
   */
  end(chunk) {
    var _a3, _b;
    if (this.ended) {
      (_b = (_a3 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a3, new Error(".end() after done!"));
      return;
    }
    if (chunk)
      this.write(chunk);
    this.ended = true;
    this.tokenizer.end();
  }
  /**
   * Pauses parsing. The parser won't emit events until `resume` is called.
   */
  pause() {
    this.tokenizer.pause();
  }
  /**
   * Resumes parsing after `pause` was called.
   */
  resume() {
    this.tokenizer.resume();
    while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
      this.tokenizer.write(this.buffers[this.writeIndex++]);
    }
    if (this.ended)
      this.tokenizer.end();
  }
  /**
   * Alias of `write`, for backwards compatibility.
   *
   * @param chunk Chunk to parse.
   * @deprecated
   */
  parseChunk(chunk) {
    this.write(chunk);
  }
  /**
   * Alias of `end`, for backwards compatibility.
   *
   * @param chunk Optional final chunk to parse.
   * @deprecated
   */
  done(chunk) {
    this.end(chunk);
  }
};

// node_modules/domelementtype/lib/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  CDATA: () => CDATA,
  Comment: () => Comment,
  Directive: () => Directive,
  Doctype: () => Doctype,
  ElementType: () => ElementType,
  Root: () => Root,
  Script: () => Script,
  Style: () => Style,
  Tag: () => Tag,
  Text: () => Text,
  isTag: () => isTag
});
var ElementType;
(function(ElementType2) {
  ElementType2["Root"] = "root";
  ElementType2["Text"] = "text";
  ElementType2["Directive"] = "directive";
  ElementType2["Comment"] = "comment";
  ElementType2["Script"] = "script";
  ElementType2["Style"] = "style";
  ElementType2["Tag"] = "tag";
  ElementType2["CDATA"] = "cdata";
  ElementType2["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
function isTag(elem) {
  return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
}
var Root = ElementType.Root;
var Text = ElementType.Text;
var Directive = ElementType.Directive;
var Comment = ElementType.Comment;
var Script = ElementType.Script;
var Style = ElementType.Style;
var Tag = ElementType.Tag;
var CDATA = ElementType.CDATA;
var Doctype = ElementType.Doctype;

// node_modules/domhandler/lib/esm/node.js
var Node = class {
  constructor() {
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.startIndex = null;
    this.endIndex = null;
  }
  // Read-write aliases for properties
  /**
   * Same as {@link parent}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get parentNode() {
    return this.parent;
  }
  set parentNode(parent) {
    this.parent = parent;
  }
  /**
   * Same as {@link prev}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get previousSibling() {
    return this.prev;
  }
  set previousSibling(prev) {
    this.prev = prev;
  }
  /**
   * Same as {@link next}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nextSibling() {
    return this.next;
  }
  set nextSibling(next) {
    this.next = next;
  }
  /**
   * Clone this node, and optionally its children.
   *
   * @param recursive Clone child nodes as well.
   * @returns A clone of the node.
   */
  cloneNode(recursive = false) {
    return cloneNode(this, recursive);
  }
};
var DataNode = class extends Node {
  /**
   * @param data The content of the data node
   */
  constructor(data) {
    super();
    this.data = data;
  }
  /**
   * Same as {@link data}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nodeValue() {
    return this.data;
  }
  set nodeValue(data) {
    this.data = data;
  }
};
var Text2 = class extends DataNode {
  constructor() {
    super(...arguments);
    this.type = ElementType.Text;
  }
  get nodeType() {
    return 3;
  }
};
var Comment2 = class extends DataNode {
  constructor() {
    super(...arguments);
    this.type = ElementType.Comment;
  }
  get nodeType() {
    return 8;
  }
};
var ProcessingInstruction = class extends DataNode {
  constructor(name, data) {
    super(data);
    this.name = name;
    this.type = ElementType.Directive;
  }
  get nodeType() {
    return 1;
  }
};
var NodeWithChildren = class extends Node {
  /**
   * @param children Children of the node. Only certain node types can have children.
   */
  constructor(children) {
    super();
    this.children = children;
  }
  // Aliases
  /** First child of the node. */
  get firstChild() {
    var _a3;
    return (_a3 = this.children[0]) !== null && _a3 !== void 0 ? _a3 : null;
  }
  /** Last child of the node. */
  get lastChild() {
    return this.children.length > 0 ? this.children[this.children.length - 1] : null;
  }
  /**
   * Same as {@link children}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get childNodes() {
    return this.children;
  }
  set childNodes(children) {
    this.children = children;
  }
};
var CDATA2 = class extends NodeWithChildren {
  constructor() {
    super(...arguments);
    this.type = ElementType.CDATA;
  }
  get nodeType() {
    return 4;
  }
};
var Document = class extends NodeWithChildren {
  constructor() {
    super(...arguments);
    this.type = ElementType.Root;
  }
  get nodeType() {
    return 9;
  }
};
var Element = class extends NodeWithChildren {
  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
   */
  constructor(name, attribs, children = [], type = name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag) {
    super(children);
    this.name = name;
    this.attribs = attribs;
    this.type = type;
  }
  get nodeType() {
    return 1;
  }
  // DOM Level 1 aliases
  /**
   * Same as {@link name}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get tagName() {
    return this.name;
  }
  set tagName(name) {
    this.name = name;
  }
  get attributes() {
    return Object.keys(this.attribs).map((name) => {
      var _a3, _b;
      return {
        name,
        value: this.attribs[name],
        namespace: (_a3 = this["x-attribsNamespace"]) === null || _a3 === void 0 ? void 0 : _a3[name],
        prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
      };
    });
  }
};
function isTag2(node) {
  return isTag(node);
}
function isCDATA(node) {
  return node.type === ElementType.CDATA;
}
function isText(node) {
  return node.type === ElementType.Text;
}
function isComment(node) {
  return node.type === ElementType.Comment;
}
function isDirective(node) {
  return node.type === ElementType.Directive;
}
function isDocument(node) {
  return node.type === ElementType.Root;
}
function hasChildren(node) {
  return Object.prototype.hasOwnProperty.call(node, "children");
}
function cloneNode(node, recursive = false) {
  let result;
  if (isText(node)) {
    result = new Text2(node.data);
  } else if (isComment(node)) {
    result = new Comment2(node.data);
  } else if (isTag2(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Element(node.name, { ...node.attribs }, children);
    children.forEach((child) => child.parent = clone);
    if (node.namespace != null) {
      clone.namespace = node.namespace;
    }
    if (node["x-attribsNamespace"]) {
      clone["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
    }
    if (node["x-attribsPrefix"]) {
      clone["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
    }
    result = clone;
  } else if (isCDATA(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new CDATA2(children);
    children.forEach((child) => child.parent = clone);
    result = clone;
  } else if (isDocument(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Document(children);
    children.forEach((child) => child.parent = clone);
    if (node["x-mode"]) {
      clone["x-mode"] = node["x-mode"];
    }
    result = clone;
  } else if (isDirective(node)) {
    const instruction = new ProcessingInstruction(node.name, node.data);
    if (node["x-name"] != null) {
      instruction["x-name"] = node["x-name"];
      instruction["x-publicId"] = node["x-publicId"];
      instruction["x-systemId"] = node["x-systemId"];
    }
    result = instruction;
  } else {
    throw new Error(`Not implemented yet: ${node.type}`);
  }
  result.startIndex = node.startIndex;
  result.endIndex = node.endIndex;
  if (node.sourceCodeLocation != null) {
    result.sourceCodeLocation = node.sourceCodeLocation;
  }
  return result;
}
function cloneChildren(childs) {
  const children = childs.map((child) => cloneNode(child, true));
  for (let i = 1; i < children.length; i++) {
    children[i].prev = children[i - 1];
    children[i - 1].next = children[i];
  }
  return children;
}

// node_modules/domhandler/lib/esm/index.js
var defaultOpts = {
  withStartIndices: false,
  withEndIndices: false,
  xmlMode: false
};
var DomHandler = class {
  /**
   * @param callback Called once parsing has completed.
   * @param options Settings for the handler.
   * @param elementCB Callback whenever a tag is closed.
   */
  constructor(callback, options, elementCB) {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
    if (typeof options === "function") {
      elementCB = options;
      options = defaultOpts;
    }
    if (typeof callback === "object") {
      options = callback;
      callback = void 0;
    }
    this.callback = callback !== null && callback !== void 0 ? callback : null;
    this.options = options !== null && options !== void 0 ? options : defaultOpts;
    this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
  }
  onparserinit(parser) {
    this.parser = parser;
  }
  // Resets the handler back to starting state
  onreset() {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
  }
  // Signals the handler that parsing is done
  onend() {
    if (this.done)
      return;
    this.done = true;
    this.parser = null;
    this.handleCallback(null);
  }
  onerror(error) {
    this.handleCallback(error);
  }
  onclosetag() {
    this.lastNode = null;
    const elem = this.tagStack.pop();
    if (this.options.withEndIndices) {
      elem.endIndex = this.parser.endIndex;
    }
    if (this.elementCB)
      this.elementCB(elem);
  }
  onopentag(name, attribs) {
    const type = this.options.xmlMode ? ElementType.Tag : void 0;
    const element = new Element(name, attribs, void 0, type);
    this.addNode(element);
    this.tagStack.push(element);
  }
  ontext(data) {
    const { lastNode } = this;
    if (lastNode && lastNode.type === ElementType.Text) {
      lastNode.data += data;
      if (this.options.withEndIndices) {
        lastNode.endIndex = this.parser.endIndex;
      }
    } else {
      const node = new Text2(data);
      this.addNode(node);
      this.lastNode = node;
    }
  }
  oncomment(data) {
    if (this.lastNode && this.lastNode.type === ElementType.Comment) {
      this.lastNode.data += data;
      return;
    }
    const node = new Comment2(data);
    this.addNode(node);
    this.lastNode = node;
  }
  oncommentend() {
    this.lastNode = null;
  }
  oncdatastart() {
    const text = new Text2("");
    const node = new CDATA2([text]);
    this.addNode(node);
    text.parent = node;
    this.lastNode = text;
  }
  oncdataend() {
    this.lastNode = null;
  }
  onprocessinginstruction(name, data) {
    const node = new ProcessingInstruction(name, data);
    this.addNode(node);
  }
  handleCallback(error) {
    if (typeof this.callback === "function") {
      this.callback(error, this.dom);
    } else if (error) {
      throw error;
    }
  }
  addNode(node) {
    const parent = this.tagStack[this.tagStack.length - 1];
    const previousSibling2 = parent.children[parent.children.length - 1];
    if (this.options.withStartIndices) {
      node.startIndex = this.parser.startIndex;
    }
    if (this.options.withEndIndices) {
      node.endIndex = this.parser.endIndex;
    }
    parent.children.push(node);
    if (previousSibling2) {
      node.prev = previousSibling2;
      previousSibling2.next = node;
    }
    node.parent = parent;
    this.lastNode = null;
  }
};

// node_modules/domutils/lib/esm/index.js
var esm_exports2 = {};
__export(esm_exports2, {
  DocumentPosition: () => DocumentPosition,
  append: () => append,
  appendChild: () => appendChild,
  compareDocumentPosition: () => compareDocumentPosition,
  existsOne: () => existsOne,
  filter: () => filter,
  find: () => find,
  findAll: () => findAll,
  findOne: () => findOne,
  findOneChild: () => findOneChild,
  getAttributeValue: () => getAttributeValue,
  getChildren: () => getChildren,
  getElementById: () => getElementById,
  getElements: () => getElements,
  getElementsByClassName: () => getElementsByClassName,
  getElementsByTagName: () => getElementsByTagName,
  getElementsByTagType: () => getElementsByTagType,
  getFeed: () => getFeed,
  getInnerHTML: () => getInnerHTML,
  getName: () => getName,
  getOuterHTML: () => getOuterHTML,
  getParent: () => getParent,
  getSiblings: () => getSiblings,
  getText: () => getText,
  hasAttrib: () => hasAttrib,
  hasChildren: () => hasChildren,
  innerText: () => innerText,
  isCDATA: () => isCDATA,
  isComment: () => isComment,
  isDocument: () => isDocument,
  isTag: () => isTag2,
  isText: () => isText,
  nextElementSibling: () => nextElementSibling,
  prepend: () => prepend,
  prependChild: () => prependChild,
  prevElementSibling: () => prevElementSibling,
  removeElement: () => removeElement,
  removeSubsets: () => removeSubsets,
  replaceElement: () => replaceElement,
  testElement: () => testElement,
  textContent: () => textContent,
  uniqueSort: () => uniqueSort
});

// node_modules/entities/lib/esm/generated/decode-data-html.js
var decode_data_html_default = new Uint16Array(
  // prettier-ignore
  '\u1D41<\xD5\u0131\u028A\u049D\u057B\u05D0\u0675\u06DE\u07A2\u07D6\u080F\u0A4A\u0A91\u0DA1\u0E6D\u0F09\u0F26\u10CA\u1228\u12E1\u1415\u149D\u14C3\u14DF\u1525\0\0\0\0\0\0\u156B\u16CD\u198D\u1C12\u1DDD\u1F7E\u2060\u21B0\u228D\u23C0\u23FB\u2442\u2824\u2912\u2D08\u2E48\u2FCE\u3016\u32BA\u3639\u37AC\u38FE\u3A28\u3A71\u3AE0\u3B2E\u0800EMabcfglmnoprstu\\bfms\x7F\x84\x8B\x90\x95\x98\xA6\xB3\xB9\xC8\xCFlig\u803B\xC6\u40C6P\u803B&\u4026cute\u803B\xC1\u40C1reve;\u4102\u0100iyx}rc\u803B\xC2\u40C2;\u4410r;\uC000\u{1D504}rave\u803B\xC0\u40C0pha;\u4391acr;\u4100d;\u6A53\u0100gp\x9D\xA1on;\u4104f;\uC000\u{1D538}plyFunction;\u6061ing\u803B\xC5\u40C5\u0100cs\xBE\xC3r;\uC000\u{1D49C}ign;\u6254ilde\u803B\xC3\u40C3ml\u803B\xC4\u40C4\u0400aceforsu\xE5\xFB\xFE\u0117\u011C\u0122\u0127\u012A\u0100cr\xEA\xF2kslash;\u6216\u0176\xF6\xF8;\u6AE7ed;\u6306y;\u4411\u0180crt\u0105\u010B\u0114ause;\u6235noullis;\u612Ca;\u4392r;\uC000\u{1D505}pf;\uC000\u{1D539}eve;\u42D8c\xF2\u0113mpeq;\u624E\u0700HOacdefhilorsu\u014D\u0151\u0156\u0180\u019E\u01A2\u01B5\u01B7\u01BA\u01DC\u0215\u0273\u0278\u027Ecy;\u4427PY\u803B\xA9\u40A9\u0180cpy\u015D\u0162\u017Aute;\u4106\u0100;i\u0167\u0168\u62D2talDifferentialD;\u6145leys;\u612D\u0200aeio\u0189\u018E\u0194\u0198ron;\u410Cdil\u803B\xC7\u40C7rc;\u4108nint;\u6230ot;\u410A\u0100dn\u01A7\u01ADilla;\u40B8terDot;\u40B7\xF2\u017Fi;\u43A7rcle\u0200DMPT\u01C7\u01CB\u01D1\u01D6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01E2\u01F8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020FoubleQuote;\u601Duote;\u6019\u0200lnpu\u021E\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6A74\u0180git\u022F\u0236\u023Aruent;\u6261nt;\u622FourIntegral;\u622E\u0100fr\u024C\u024E;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6A2Fcr;\uC000\u{1D49E}p\u0100;C\u0284\u0285\u62D3ap;\u624D\u0580DJSZacefios\u02A0\u02AC\u02B0\u02B4\u02B8\u02CB\u02D7\u02E1\u02E6\u0333\u048D\u0100;o\u0179\u02A5trahd;\u6911cy;\u4402cy;\u4405cy;\u440F\u0180grs\u02BF\u02C4\u02C7ger;\u6021r;\u61A1hv;\u6AE4\u0100ay\u02D0\u02D5ron;\u410E;\u4414l\u0100;t\u02DD\u02DE\u6207a;\u4394r;\uC000\u{1D507}\u0100af\u02EB\u0327\u0100cm\u02F0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031Ccute;\u40B4o\u0174\u030B\u030D;\u42D9bleAcute;\u42DDrave;\u4060ilde;\u42DCond;\u62C4ferentialD;\u6146\u0470\u033D\0\0\0\u0342\u0354\0\u0405f;\uC000\u{1D53B}\u0180;DE\u0348\u0349\u034D\u40A8ot;\u60DCqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03CF\u03E2\u03F8ontourIntegra\xEC\u0239o\u0274\u0379\0\0\u037B\xBB\u0349nArrow;\u61D3\u0100eo\u0387\u03A4ft\u0180ART\u0390\u0396\u03A1rrow;\u61D0ightArrow;\u61D4e\xE5\u02CAng\u0100LR\u03AB\u03C4eft\u0100AR\u03B3\u03B9rrow;\u67F8ightArrow;\u67FAightArrow;\u67F9ight\u0100AT\u03D8\u03DErrow;\u61D2ee;\u62A8p\u0241\u03E9\0\0\u03EFrrow;\u61D1ownArrow;\u61D5erticalBar;\u6225n\u0300ABLRTa\u0412\u042A\u0430\u045E\u047F\u037Crrow\u0180;BU\u041D\u041E\u0422\u6193ar;\u6913pArrow;\u61F5reve;\u4311eft\u02D2\u043A\0\u0446\0\u0450ightVector;\u6950eeVector;\u695Eector\u0100;B\u0459\u045A\u61BDar;\u6956ight\u01D4\u0467\0\u0471eeVector;\u695Fector\u0100;B\u047A\u047B\u61C1ar;\u6957ee\u0100;A\u0486\u0487\u62A4rrow;\u61A7\u0100ct\u0492\u0497r;\uC000\u{1D49F}rok;\u4110\u0800NTacdfglmopqstux\u04BD\u04C0\u04C4\u04CB\u04DE\u04E2\u04E7\u04EE\u04F5\u0521\u052F\u0536\u0552\u055D\u0560\u0565G;\u414AH\u803B\xD0\u40D0cute\u803B\xC9\u40C9\u0180aiy\u04D2\u04D7\u04DCron;\u411Arc\u803B\xCA\u40CA;\u442Dot;\u4116r;\uC000\u{1D508}rave\u803B\xC8\u40C8ement;\u6208\u0100ap\u04FA\u04FEcr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65FBerySmallSquare;\u65AB\u0100gp\u0526\u052Aon;\u4118f;\uC000\u{1D53C}silon;\u4395u\u0100ai\u053C\u0549l\u0100;T\u0542\u0543\u6A75ilde;\u6242librium;\u61CC\u0100ci\u0557\u055Ar;\u6130m;\u6A73a;\u4397ml\u803B\xCB\u40CB\u0100ip\u056A\u056Fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058D\u05B2\u05CCy;\u4424r;\uC000\u{1D509}lled\u0253\u0597\0\0\u05A3mallSquare;\u65FCerySmallSquare;\u65AA\u0370\u05BA\0\u05BF\0\0\u05C4f;\uC000\u{1D53D}All;\u6200riertrf;\u6131c\xF2\u05CB\u0600JTabcdfgorst\u05E8\u05EC\u05EF\u05FA\u0600\u0612\u0616\u061B\u061D\u0623\u066C\u0672cy;\u4403\u803B>\u403Emma\u0100;d\u05F7\u05F8\u4393;\u43DCreve;\u411E\u0180eiy\u0607\u060C\u0610dil;\u4122rc;\u411C;\u4413ot;\u4120r;\uC000\u{1D50A};\u62D9pf;\uC000\u{1D53E}eater\u0300EFGLST\u0635\u0644\u064E\u0656\u065B\u0666qual\u0100;L\u063E\u063F\u6265ess;\u62DBullEqual;\u6267reater;\u6AA2ess;\u6277lantEqual;\u6A7Eilde;\u6273cr;\uC000\u{1D4A2};\u626B\u0400Aacfiosu\u0685\u068B\u0696\u069B\u069E\u06AA\u06BE\u06CARDcy;\u442A\u0100ct\u0690\u0694ek;\u42C7;\u405Eirc;\u4124r;\u610ClbertSpace;\u610B\u01F0\u06AF\0\u06B2f;\u610DizontalLine;\u6500\u0100ct\u06C3\u06C5\xF2\u06A9rok;\u4126mp\u0144\u06D0\u06D8ownHum\xF0\u012Fqual;\u624F\u0700EJOacdfgmnostu\u06FA\u06FE\u0703\u0707\u070E\u071A\u071E\u0721\u0728\u0744\u0778\u078B\u078F\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803B\xCD\u40CD\u0100iy\u0713\u0718rc\u803B\xCE\u40CE;\u4418ot;\u4130r;\u6111rave\u803B\xCC\u40CC\u0180;ap\u0720\u072F\u073F\u0100cg\u0734\u0737r;\u412AinaryI;\u6148lie\xF3\u03DD\u01F4\u0749\0\u0762\u0100;e\u074D\u074E\u622C\u0100gr\u0753\u0758ral;\u622Bsection;\u62C2isible\u0100CT\u076C\u0772omma;\u6063imes;\u6062\u0180gpt\u077F\u0783\u0788on;\u412Ef;\uC000\u{1D540}a;\u4399cr;\u6110ilde;\u4128\u01EB\u079A\0\u079Ecy;\u4406l\u803B\xCF\u40CF\u0280cfosu\u07AC\u07B7\u07BC\u07C2\u07D0\u0100iy\u07B1\u07B5rc;\u4134;\u4419r;\uC000\u{1D50D}pf;\uC000\u{1D541}\u01E3\u07C7\0\u07CCr;\uC000\u{1D4A5}rcy;\u4408kcy;\u4404\u0380HJacfos\u07E4\u07E8\u07EC\u07F1\u07FD\u0802\u0808cy;\u4425cy;\u440Cppa;\u439A\u0100ey\u07F6\u07FBdil;\u4136;\u441Ar;\uC000\u{1D50E}pf;\uC000\u{1D542}cr;\uC000\u{1D4A6}\u0580JTaceflmost\u0825\u0829\u082C\u0850\u0863\u09B3\u09B8\u09C7\u09CD\u0A37\u0A47cy;\u4409\u803B<\u403C\u0280cmnpr\u0837\u083C\u0841\u0844\u084Dute;\u4139bda;\u439Bg;\u67EAlacetrf;\u6112r;\u619E\u0180aey\u0857\u085C\u0861ron;\u413Ddil;\u413B;\u441B\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087E\u08A9\u08B1\u08E0\u08E6\u08FC\u092F\u095B\u0390\u096A\u0100nr\u0883\u088FgleBracket;\u67E8row\u0180;BR\u0899\u089A\u089E\u6190ar;\u61E4ightArrow;\u61C6eiling;\u6308o\u01F5\u08B7\0\u08C3bleBracket;\u67E6n\u01D4\u08C8\0\u08D2eeVector;\u6961ector\u0100;B\u08DB\u08DC\u61C3ar;\u6959loor;\u630Aight\u0100AV\u08EF\u08F5rrow;\u6194ector;\u694E\u0100er\u0901\u0917e\u0180;AV\u0909\u090A\u0910\u62A3rrow;\u61A4ector;\u695Aiangle\u0180;BE\u0924\u0925\u0929\u62B2ar;\u69CFqual;\u62B4p\u0180DTV\u0937\u0942\u094CownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61BFar;\u6958ector\u0100;B\u0965\u0966\u61BCar;\u6952ight\xE1\u039Cs\u0300EFGLST\u097E\u098B\u0995\u099D\u09A2\u09ADqualGreater;\u62DAullEqual;\u6266reater;\u6276ess;\u6AA1lantEqual;\u6A7Dilde;\u6272r;\uC000\u{1D50F}\u0100;e\u09BD\u09BE\u62D8ftarrow;\u61DAidot;\u413F\u0180npw\u09D4\u0A16\u0A1Bg\u0200LRlr\u09DE\u09F7\u0A02\u0A10eft\u0100AR\u09E6\u09ECrrow;\u67F5ightArrow;\u67F7ightArrow;\u67F6eft\u0100ar\u03B3\u0A0Aight\xE1\u03BFight\xE1\u03CAf;\uC000\u{1D543}er\u0100LR\u0A22\u0A2CeftArrow;\u6199ightArrow;\u6198\u0180cht\u0A3E\u0A40\u0A42\xF2\u084C;\u61B0rok;\u4141;\u626A\u0400acefiosu\u0A5A\u0A5D\u0A60\u0A77\u0A7C\u0A85\u0A8B\u0A8Ep;\u6905y;\u441C\u0100dl\u0A65\u0A6FiumSpace;\u605Flintrf;\u6133r;\uC000\u{1D510}nusPlus;\u6213pf;\uC000\u{1D544}c\xF2\u0A76;\u439C\u0480Jacefostu\u0AA3\u0AA7\u0AAD\u0AC0\u0B14\u0B19\u0D91\u0D97\u0D9Ecy;\u440Acute;\u4143\u0180aey\u0AB4\u0AB9\u0ABEron;\u4147dil;\u4145;\u441D\u0180gsw\u0AC7\u0AF0\u0B0Eative\u0180MTV\u0AD3\u0ADF\u0AE8ediumSpace;\u600Bhi\u0100cn\u0AE6\u0AD8\xEB\u0AD9eryThi\xEE\u0AD9ted\u0100GL\u0AF8\u0B06reaterGreate\xF2\u0673essLes\xF3\u0A48Line;\u400Ar;\uC000\u{1D511}\u0200Bnpt\u0B22\u0B28\u0B37\u0B3Areak;\u6060BreakingSpace;\u40A0f;\u6115\u0680;CDEGHLNPRSTV\u0B55\u0B56\u0B6A\u0B7C\u0BA1\u0BEB\u0C04\u0C5E\u0C84\u0CA6\u0CD8\u0D61\u0D85\u6AEC\u0100ou\u0B5B\u0B64ngruent;\u6262pCap;\u626DoubleVerticalBar;\u6226\u0180lqx\u0B83\u0B8A\u0B9Bement;\u6209ual\u0100;T\u0B92\u0B93\u6260ilde;\uC000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0BB6\u0BB7\u0BBD\u0BC9\u0BD3\u0BD8\u0BE5\u626Fqual;\u6271ullEqual;\uC000\u2267\u0338reater;\uC000\u226B\u0338ess;\u6279lantEqual;\uC000\u2A7E\u0338ilde;\u6275ump\u0144\u0BF2\u0BFDownHump;\uC000\u224E\u0338qual;\uC000\u224F\u0338e\u0100fs\u0C0A\u0C27tTriangle\u0180;BE\u0C1A\u0C1B\u0C21\u62EAar;\uC000\u29CF\u0338qual;\u62ECs\u0300;EGLST\u0C35\u0C36\u0C3C\u0C44\u0C4B\u0C58\u626Equal;\u6270reater;\u6278ess;\uC000\u226A\u0338lantEqual;\uC000\u2A7D\u0338ilde;\u6274ested\u0100GL\u0C68\u0C79reaterGreater;\uC000\u2AA2\u0338essLess;\uC000\u2AA1\u0338recedes\u0180;ES\u0C92\u0C93\u0C9B\u6280qual;\uC000\u2AAF\u0338lantEqual;\u62E0\u0100ei\u0CAB\u0CB9verseElement;\u620CghtTriangle\u0180;BE\u0CCB\u0CCC\u0CD2\u62EBar;\uC000\u29D0\u0338qual;\u62ED\u0100qu\u0CDD\u0D0CuareSu\u0100bp\u0CE8\u0CF9set\u0100;E\u0CF0\u0CF3\uC000\u228F\u0338qual;\u62E2erset\u0100;E\u0D03\u0D06\uC000\u2290\u0338qual;\u62E3\u0180bcp\u0D13\u0D24\u0D4Eset\u0100;E\u0D1B\u0D1E\uC000\u2282\u20D2qual;\u6288ceeds\u0200;EST\u0D32\u0D33\u0D3B\u0D46\u6281qual;\uC000\u2AB0\u0338lantEqual;\u62E1ilde;\uC000\u227F\u0338erset\u0100;E\u0D58\u0D5B\uC000\u2283\u20D2qual;\u6289ilde\u0200;EFT\u0D6E\u0D6F\u0D75\u0D7F\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uC000\u{1D4A9}ilde\u803B\xD1\u40D1;\u439D\u0700Eacdfgmoprstuv\u0DBD\u0DC2\u0DC9\u0DD5\u0DDB\u0DE0\u0DE7\u0DFC\u0E02\u0E20\u0E22\u0E32\u0E3F\u0E44lig;\u4152cute\u803B\xD3\u40D3\u0100iy\u0DCE\u0DD3rc\u803B\xD4\u40D4;\u441Eblac;\u4150r;\uC000\u{1D512}rave\u803B\xD2\u40D2\u0180aei\u0DEE\u0DF2\u0DF6cr;\u414Cga;\u43A9cron;\u439Fpf;\uC000\u{1D546}enCurly\u0100DQ\u0E0E\u0E1AoubleQuote;\u601Cuote;\u6018;\u6A54\u0100cl\u0E27\u0E2Cr;\uC000\u{1D4AA}ash\u803B\xD8\u40D8i\u016C\u0E37\u0E3Cde\u803B\xD5\u40D5es;\u6A37ml\u803B\xD6\u40D6er\u0100BP\u0E4B\u0E60\u0100ar\u0E50\u0E53r;\u603Eac\u0100ek\u0E5A\u0E5C;\u63DEet;\u63B4arenthesis;\u63DC\u0480acfhilors\u0E7F\u0E87\u0E8A\u0E8F\u0E92\u0E94\u0E9D\u0EB0\u0EFCrtialD;\u6202y;\u441Fr;\uC000\u{1D513}i;\u43A6;\u43A0usMinus;\u40B1\u0100ip\u0EA2\u0EADncareplan\xE5\u069Df;\u6119\u0200;eio\u0EB9\u0EBA\u0EE0\u0EE4\u6ABBcedes\u0200;EST\u0EC8\u0EC9\u0ECF\u0EDA\u627Aqual;\u6AAFlantEqual;\u627Cilde;\u627Eme;\u6033\u0100dp\u0EE9\u0EEEuct;\u620Fortion\u0100;a\u0225\u0EF9l;\u621D\u0100ci\u0F01\u0F06r;\uC000\u{1D4AB};\u43A8\u0200Ufos\u0F11\u0F16\u0F1B\u0F1FOT\u803B"\u4022r;\uC000\u{1D514}pf;\u611Acr;\uC000\u{1D4AC}\u0600BEacefhiorsu\u0F3E\u0F43\u0F47\u0F60\u0F73\u0FA7\u0FAA\u0FAD\u1096\u10A9\u10B4\u10BEarr;\u6910G\u803B\xAE\u40AE\u0180cnr\u0F4E\u0F53\u0F56ute;\u4154g;\u67EBr\u0100;t\u0F5C\u0F5D\u61A0l;\u6916\u0180aey\u0F67\u0F6C\u0F71ron;\u4158dil;\u4156;\u4420\u0100;v\u0F78\u0F79\u611Cerse\u0100EU\u0F82\u0F99\u0100lq\u0F87\u0F8Eement;\u620Builibrium;\u61CBpEquilibrium;\u696Fr\xBB\u0F79o;\u43A1ght\u0400ACDFTUVa\u0FC1\u0FEB\u0FF3\u1022\u1028\u105B\u1087\u03D8\u0100nr\u0FC6\u0FD2gleBracket;\u67E9row\u0180;BL\u0FDC\u0FDD\u0FE1\u6192ar;\u61E5eftArrow;\u61C4eiling;\u6309o\u01F5\u0FF9\0\u1005bleBracket;\u67E7n\u01D4\u100A\0\u1014eeVector;\u695Dector\u0100;B\u101D\u101E\u61C2ar;\u6955loor;\u630B\u0100er\u102D\u1043e\u0180;AV\u1035\u1036\u103C\u62A2rrow;\u61A6ector;\u695Biangle\u0180;BE\u1050\u1051\u1055\u62B3ar;\u69D0qual;\u62B5p\u0180DTV\u1063\u106E\u1078ownVector;\u694FeeVector;\u695Cector\u0100;B\u1082\u1083\u61BEar;\u6954ector\u0100;B\u1091\u1092\u61C0ar;\u6953\u0100pu\u109B\u109Ef;\u611DndImplies;\u6970ightarrow;\u61DB\u0100ch\u10B9\u10BCr;\u611B;\u61B1leDelayed;\u69F4\u0680HOacfhimoqstu\u10E4\u10F1\u10F7\u10FD\u1119\u111E\u1151\u1156\u1161\u1167\u11B5\u11BB\u11BF\u0100Cc\u10E9\u10EEHcy;\u4429y;\u4428FTcy;\u442Ccute;\u415A\u0280;aeiy\u1108\u1109\u110E\u1113\u1117\u6ABCron;\u4160dil;\u415Erc;\u415C;\u4421r;\uC000\u{1D516}ort\u0200DLRU\u112A\u1134\u113E\u1149ownArrow\xBB\u041EeftArrow\xBB\u089AightArrow\xBB\u0FDDpArrow;\u6191gma;\u43A3allCircle;\u6218pf;\uC000\u{1D54A}\u0272\u116D\0\0\u1170t;\u621Aare\u0200;ISU\u117B\u117C\u1189\u11AF\u65A1ntersection;\u6293u\u0100bp\u118F\u119Eset\u0100;E\u1197\u1198\u628Fqual;\u6291erset\u0100;E\u11A8\u11A9\u6290qual;\u6292nion;\u6294cr;\uC000\u{1D4AE}ar;\u62C6\u0200bcmp\u11C8\u11DB\u1209\u120B\u0100;s\u11CD\u11CE\u62D0et\u0100;E\u11CD\u11D5qual;\u6286\u0100ch\u11E0\u1205eeds\u0200;EST\u11ED\u11EE\u11F4\u11FF\u627Bqual;\u6AB0lantEqual;\u627Dilde;\u627FTh\xE1\u0F8C;\u6211\u0180;es\u1212\u1213\u1223\u62D1rset\u0100;E\u121C\u121D\u6283qual;\u6287et\xBB\u1213\u0580HRSacfhiors\u123E\u1244\u1249\u1255\u125E\u1271\u1276\u129F\u12C2\u12C8\u12D1ORN\u803B\xDE\u40DEADE;\u6122\u0100Hc\u124E\u1252cy;\u440By;\u4426\u0100bu\u125A\u125C;\u4009;\u43A4\u0180aey\u1265\u126A\u126Fron;\u4164dil;\u4162;\u4422r;\uC000\u{1D517}\u0100ei\u127B\u1289\u01F2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128E\u1298kSpace;\uC000\u205F\u200ASpace;\u6009lde\u0200;EFT\u12AB\u12AC\u12B2\u12BC\u623Cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uC000\u{1D54B}ipleDot;\u60DB\u0100ct\u12D6\u12DBr;\uC000\u{1D4AF}rok;\u4166\u0AE1\u12F7\u130E\u131A\u1326\0\u132C\u1331\0\0\0\0\0\u1338\u133D\u1377\u1385\0\u13FF\u1404\u140A\u1410\u0100cr\u12FB\u1301ute\u803B\xDA\u40DAr\u0100;o\u1307\u1308\u619Fcir;\u6949r\u01E3\u1313\0\u1316y;\u440Eve;\u416C\u0100iy\u131E\u1323rc\u803B\xDB\u40DB;\u4423blac;\u4170r;\uC000\u{1D518}rave\u803B\xD9\u40D9acr;\u416A\u0100di\u1341\u1369er\u0100BP\u1348\u135D\u0100ar\u134D\u1350r;\u405Fac\u0100ek\u1357\u1359;\u63DFet;\u63B5arenthesis;\u63DDon\u0100;P\u1370\u1371\u62C3lus;\u628E\u0100gp\u137B\u137Fon;\u4172f;\uC000\u{1D54C}\u0400ADETadps\u1395\u13AE\u13B8\u13C4\u03E8\u13D2\u13D7\u13F3rrow\u0180;BD\u1150\u13A0\u13A4ar;\u6912ownArrow;\u61C5ownArrow;\u6195quilibrium;\u696Eee\u0100;A\u13CB\u13CC\u62A5rrow;\u61A5own\xE1\u03F3er\u0100LR\u13DE\u13E8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13F9\u13FA\u43D2on;\u43A5ing;\u416Ecr;\uC000\u{1D4B0}ilde;\u4168ml\u803B\xDC\u40DC\u0480Dbcdefosv\u1427\u142C\u1430\u1433\u143E\u1485\u148A\u1490\u1496ash;\u62ABar;\u6AEBy;\u4412ash\u0100;l\u143B\u143C\u62A9;\u6AE6\u0100er\u1443\u1445;\u62C1\u0180bty\u144C\u1450\u147Aar;\u6016\u0100;i\u144F\u1455cal\u0200BLST\u1461\u1465\u146A\u1474ar;\u6223ine;\u407Ceparator;\u6758ilde;\u6240ThinSpace;\u600Ar;\uC000\u{1D519}pf;\uC000\u{1D54D}cr;\uC000\u{1D4B1}dash;\u62AA\u0280cefos\u14A7\u14AC\u14B1\u14B6\u14BCirc;\u4174dge;\u62C0r;\uC000\u{1D51A}pf;\uC000\u{1D54E}cr;\uC000\u{1D4B2}\u0200fios\u14CB\u14D0\u14D2\u14D8r;\uC000\u{1D51B};\u439Epf;\uC000\u{1D54F}cr;\uC000\u{1D4B3}\u0480AIUacfosu\u14F1\u14F5\u14F9\u14FD\u1504\u150F\u1514\u151A\u1520cy;\u442Fcy;\u4407cy;\u442Ecute\u803B\xDD\u40DD\u0100iy\u1509\u150Drc;\u4176;\u442Br;\uC000\u{1D51C}pf;\uC000\u{1D550}cr;\uC000\u{1D4B4}ml;\u4178\u0400Hacdefos\u1535\u1539\u153F\u154B\u154F\u155D\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417D;\u4417ot;\u417B\u01F2\u1554\0\u155BoWidt\xE8\u0AD9a;\u4396r;\u6128pf;\u6124cr;\uC000\u{1D4B5}\u0BE1\u1583\u158A\u1590\0\u15B0\u15B6\u15BF\0\0\0\0\u15C6\u15DB\u15EB\u165F\u166D\0\u1695\u169B\u16B2\u16B9\0\u16BEcute\u803B\xE1\u40E1reve;\u4103\u0300;Ediuy\u159C\u159D\u15A1\u15A3\u15A8\u15AD\u623E;\uC000\u223E\u0333;\u623Frc\u803B\xE2\u40E2te\u80BB\xB4\u0306;\u4430lig\u803B\xE6\u40E6\u0100;r\xB2\u15BA;\uC000\u{1D51E}rave\u803B\xE0\u40E0\u0100ep\u15CA\u15D6\u0100fp\u15CF\u15D4sym;\u6135\xE8\u15D3ha;\u43B1\u0100ap\u15DFc\u0100cl\u15E4\u15E7r;\u4101g;\u6A3F\u0264\u15F0\0\0\u160A\u0280;adsv\u15FA\u15FB\u15FF\u1601\u1607\u6227nd;\u6A55;\u6A5Clope;\u6A58;\u6A5A\u0380;elmrsz\u1618\u1619\u161B\u161E\u163F\u164F\u1659\u6220;\u69A4e\xBB\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163A\u163C\u163E;\u69A8;\u69A9;\u69AA;\u69AB;\u69AC;\u69AD;\u69AE;\u69AFt\u0100;v\u1645\u1646\u621Fb\u0100;d\u164C\u164D\u62BE;\u699D\u0100pt\u1654\u1657h;\u6222\xBB\xB9arr;\u637C\u0100gp\u1663\u1667on;\u4105f;\uC000\u{1D552}\u0380;Eaeiop\u12C1\u167B\u167D\u1682\u1684\u1687\u168A;\u6A70cir;\u6A6F;\u624Ad;\u624Bs;\u4027rox\u0100;e\u12C1\u1692\xF1\u1683ing\u803B\xE5\u40E5\u0180cty\u16A1\u16A6\u16A8r;\uC000\u{1D4B6};\u402Amp\u0100;e\u12C1\u16AF\xF1\u0288ilde\u803B\xE3\u40E3ml\u803B\xE4\u40E4\u0100ci\u16C2\u16C8onin\xF4\u0272nt;\u6A11\u0800Nabcdefiklnoprsu\u16ED\u16F1\u1730\u173C\u1743\u1748\u1778\u177D\u17E0\u17E6\u1839\u1850\u170D\u193D\u1948\u1970ot;\u6AED\u0100cr\u16F6\u171Ek\u0200ceps\u1700\u1705\u170D\u1713ong;\u624Cpsilon;\u43F6rime;\u6035im\u0100;e\u171A\u171B\u623Dq;\u62CD\u0176\u1722\u1726ee;\u62BDed\u0100;g\u172C\u172D\u6305e\xBB\u172Drk\u0100;t\u135C\u1737brk;\u63B6\u0100oy\u1701\u1741;\u4431quo;\u601E\u0280cmprt\u1753\u175B\u1761\u1764\u1768aus\u0100;e\u010A\u0109ptyv;\u69B0s\xE9\u170Cno\xF5\u0113\u0180ahw\u176F\u1771\u1773;\u43B2;\u6136een;\u626Cr;\uC000\u{1D51F}g\u0380costuvw\u178D\u179D\u17B3\u17C1\u17D5\u17DB\u17DE\u0180aiu\u1794\u1796\u179A\xF0\u0760rc;\u65EFp\xBB\u1371\u0180dpt\u17A4\u17A8\u17ADot;\u6A00lus;\u6A01imes;\u6A02\u0271\u17B9\0\0\u17BEcup;\u6A06ar;\u6605riangle\u0100du\u17CD\u17D2own;\u65BDp;\u65B3plus;\u6A04e\xE5\u1444\xE5\u14ADarow;\u690D\u0180ako\u17ED\u1826\u1835\u0100cn\u17F2\u1823k\u0180lst\u17FA\u05AB\u1802ozenge;\u69EBriangle\u0200;dlr\u1812\u1813\u1818\u181D\u65B4own;\u65BEeft;\u65C2ight;\u65B8k;\u6423\u01B1\u182B\0\u1833\u01B2\u182F\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183E\u184D\u0100;q\u1843\u1846\uC000=\u20E5uiv;\uC000\u2261\u20E5t;\u6310\u0200ptwx\u1859\u185E\u1867\u186Cf;\uC000\u{1D553}\u0100;t\u13CB\u1863om\xBB\u13CCtie;\u62C8\u0600DHUVbdhmptuv\u1885\u1896\u18AA\u18BB\u18D7\u18DB\u18EC\u18FF\u1905\u190A\u1910\u1921\u0200LRlr\u188E\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18A1\u18A2\u18A4\u18A6\u18A8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18B3\u18B5\u18B7\u18B9;\u655D;\u655A;\u655C;\u6559\u0380;HLRhlr\u18CA\u18CB\u18CD\u18CF\u18D1\u18D3\u18D5\u6551;\u656C;\u6563;\u6560;\u656B;\u6562;\u655Fox;\u69C9\u0200LRlr\u18E4\u18E6\u18E8\u18EA;\u6555;\u6552;\u6510;\u650C\u0280;DUdu\u06BD\u18F7\u18F9\u18FB\u18FD;\u6565;\u6568;\u652C;\u6534inus;\u629Flus;\u629Eimes;\u62A0\u0200LRlr\u1919\u191B\u191D\u191F;\u655B;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193B\u6502;\u656A;\u6561;\u655E;\u653C;\u6524;\u651C\u0100ev\u0123\u1942bar\u803B\xA6\u40A6\u0200ceio\u1951\u1956\u195A\u1960r;\uC000\u{1D4B7}mi;\u604Fm\u0100;e\u171A\u171Cl\u0180;bh\u1968\u1969\u196B\u405C;\u69C5sub;\u67C8\u016C\u1974\u197El\u0100;e\u1979\u197A\u6022t\xBB\u197Ap\u0180;Ee\u012F\u1985\u1987;\u6AAE\u0100;q\u06DC\u06DB\u0CE1\u19A7\0\u19E8\u1A11\u1A15\u1A32\0\u1A37\u1A50\0\0\u1AB4\0\0\u1AC1\0\0\u1B21\u1B2E\u1B4D\u1B52\0\u1BFD\0\u1C0C\u0180cpr\u19AD\u19B2\u19DDute;\u4107\u0300;abcds\u19BF\u19C0\u19C4\u19CA\u19D5\u19D9\u6229nd;\u6A44rcup;\u6A49\u0100au\u19CF\u19D2p;\u6A4Bp;\u6A47ot;\u6A40;\uC000\u2229\uFE00\u0100eo\u19E2\u19E5t;\u6041\xEE\u0693\u0200aeiu\u19F0\u19FB\u1A01\u1A05\u01F0\u19F5\0\u19F8s;\u6A4Don;\u410Ddil\u803B\xE7\u40E7rc;\u4109ps\u0100;s\u1A0C\u1A0D\u6A4Cm;\u6A50ot;\u410B\u0180dmn\u1A1B\u1A20\u1A26il\u80BB\xB8\u01ADptyv;\u69B2t\u8100\xA2;e\u1A2D\u1A2E\u40A2r\xE4\u01B2r;\uC000\u{1D520}\u0180cei\u1A3D\u1A40\u1A4Dy;\u4447ck\u0100;m\u1A47\u1A48\u6713ark\xBB\u1A48;\u43C7r\u0380;Ecefms\u1A5F\u1A60\u1A62\u1A6B\u1AA4\u1AAA\u1AAE\u65CB;\u69C3\u0180;el\u1A69\u1A6A\u1A6D\u42C6q;\u6257e\u0261\u1A74\0\0\u1A88rrow\u0100lr\u1A7C\u1A81eft;\u61BAight;\u61BB\u0280RSacd\u1A92\u1A94\u1A96\u1A9A\u1A9F\xBB\u0F47;\u64C8st;\u629Birc;\u629Aash;\u629Dnint;\u6A10id;\u6AEFcir;\u69C2ubs\u0100;u\u1ABB\u1ABC\u6663it\xBB\u1ABC\u02EC\u1AC7\u1AD4\u1AFA\0\u1B0Aon\u0100;e\u1ACD\u1ACE\u403A\u0100;q\xC7\xC6\u026D\u1AD9\0\0\u1AE2a\u0100;t\u1ADE\u1ADF\u402C;\u4040\u0180;fl\u1AE8\u1AE9\u1AEB\u6201\xEE\u1160e\u0100mx\u1AF1\u1AF6ent\xBB\u1AE9e\xF3\u024D\u01E7\u1AFE\0\u1B07\u0100;d\u12BB\u1B02ot;\u6A6Dn\xF4\u0246\u0180fry\u1B10\u1B14\u1B17;\uC000\u{1D554}o\xE4\u0254\u8100\xA9;s\u0155\u1B1Dr;\u6117\u0100ao\u1B25\u1B29rr;\u61B5ss;\u6717\u0100cu\u1B32\u1B37r;\uC000\u{1D4B8}\u0100bp\u1B3C\u1B44\u0100;e\u1B41\u1B42\u6ACF;\u6AD1\u0100;e\u1B49\u1B4A\u6AD0;\u6AD2dot;\u62EF\u0380delprvw\u1B60\u1B6C\u1B77\u1B82\u1BAC\u1BD4\u1BF9arr\u0100lr\u1B68\u1B6A;\u6938;\u6935\u0270\u1B72\0\0\u1B75r;\u62DEc;\u62DFarr\u0100;p\u1B7F\u1B80\u61B6;\u693D\u0300;bcdos\u1B8F\u1B90\u1B96\u1BA1\u1BA5\u1BA8\u622Arcap;\u6A48\u0100au\u1B9B\u1B9Ep;\u6A46p;\u6A4Aot;\u628Dr;\u6A45;\uC000\u222A\uFE00\u0200alrv\u1BB5\u1BBF\u1BDE\u1BE3rr\u0100;m\u1BBC\u1BBD\u61B7;\u693Cy\u0180evw\u1BC7\u1BD4\u1BD8q\u0270\u1BCE\0\0\u1BD2re\xE3\u1B73u\xE3\u1B75ee;\u62CEedge;\u62CFen\u803B\xA4\u40A4earrow\u0100lr\u1BEE\u1BF3eft\xBB\u1B80ight\xBB\u1BBDe\xE4\u1BDD\u0100ci\u1C01\u1C07onin\xF4\u01F7nt;\u6231lcty;\u632D\u0980AHabcdefhijlorstuwz\u1C38\u1C3B\u1C3F\u1C5D\u1C69\u1C75\u1C8A\u1C9E\u1CAC\u1CB7\u1CFB\u1CFF\u1D0D\u1D7B\u1D91\u1DAB\u1DBB\u1DC6\u1DCDr\xF2\u0381ar;\u6965\u0200glrs\u1C48\u1C4D\u1C52\u1C54ger;\u6020eth;\u6138\xF2\u1133h\u0100;v\u1C5A\u1C5B\u6010\xBB\u090A\u016B\u1C61\u1C67arow;\u690Fa\xE3\u0315\u0100ay\u1C6E\u1C73ron;\u410F;\u4434\u0180;ao\u0332\u1C7C\u1C84\u0100gr\u02BF\u1C81r;\u61CAtseq;\u6A77\u0180glm\u1C91\u1C94\u1C98\u803B\xB0\u40B0ta;\u43B4ptyv;\u69B1\u0100ir\u1CA3\u1CA8sht;\u697F;\uC000\u{1D521}ar\u0100lr\u1CB3\u1CB5\xBB\u08DC\xBB\u101E\u0280aegsv\u1CC2\u0378\u1CD6\u1CDC\u1CE0m\u0180;os\u0326\u1CCA\u1CD4nd\u0100;s\u0326\u1CD1uit;\u6666amma;\u43DDin;\u62F2\u0180;io\u1CE7\u1CE8\u1CF8\u40F7de\u8100\xF7;o\u1CE7\u1CF0ntimes;\u62C7n\xF8\u1CF7cy;\u4452c\u026F\u1D06\0\0\u1D0Arn;\u631Eop;\u630D\u0280lptuw\u1D18\u1D1D\u1D22\u1D49\u1D55lar;\u4024f;\uC000\u{1D555}\u0280;emps\u030B\u1D2D\u1D37\u1D3D\u1D42q\u0100;d\u0352\u1D33ot;\u6251inus;\u6238lus;\u6214quare;\u62A1blebarwedg\xE5\xFAn\u0180adh\u112E\u1D5D\u1D67ownarrow\xF3\u1C83arpoon\u0100lr\u1D72\u1D76ef\xF4\u1CB4igh\xF4\u1CB6\u0162\u1D7F\u1D85karo\xF7\u0F42\u026F\u1D8A\0\0\u1D8Ern;\u631Fop;\u630C\u0180cot\u1D98\u1DA3\u1DA6\u0100ry\u1D9D\u1DA1;\uC000\u{1D4B9};\u4455l;\u69F6rok;\u4111\u0100dr\u1DB0\u1DB4ot;\u62F1i\u0100;f\u1DBA\u1816\u65BF\u0100ah\u1DC0\u1DC3r\xF2\u0429a\xF2\u0FA6angle;\u69A6\u0100ci\u1DD2\u1DD5y;\u445Fgrarr;\u67FF\u0900Dacdefglmnopqrstux\u1E01\u1E09\u1E19\u1E38\u0578\u1E3C\u1E49\u1E61\u1E7E\u1EA5\u1EAF\u1EBD\u1EE1\u1F2A\u1F37\u1F44\u1F4E\u1F5A\u0100Do\u1E06\u1D34o\xF4\u1C89\u0100cs\u1E0E\u1E14ute\u803B\xE9\u40E9ter;\u6A6E\u0200aioy\u1E22\u1E27\u1E31\u1E36ron;\u411Br\u0100;c\u1E2D\u1E2E\u6256\u803B\xEA\u40EAlon;\u6255;\u444Dot;\u4117\u0100Dr\u1E41\u1E45ot;\u6252;\uC000\u{1D522}\u0180;rs\u1E50\u1E51\u1E57\u6A9Aave\u803B\xE8\u40E8\u0100;d\u1E5C\u1E5D\u6A96ot;\u6A98\u0200;ils\u1E6A\u1E6B\u1E72\u1E74\u6A99nters;\u63E7;\u6113\u0100;d\u1E79\u1E7A\u6A95ot;\u6A97\u0180aps\u1E85\u1E89\u1E97cr;\u4113ty\u0180;sv\u1E92\u1E93\u1E95\u6205et\xBB\u1E93p\u01001;\u1E9D\u1EA4\u0133\u1EA1\u1EA3;\u6004;\u6005\u6003\u0100gs\u1EAA\u1EAC;\u414Bp;\u6002\u0100gp\u1EB4\u1EB8on;\u4119f;\uC000\u{1D556}\u0180als\u1EC4\u1ECE\u1ED2r\u0100;s\u1ECA\u1ECB\u62D5l;\u69E3us;\u6A71i\u0180;lv\u1EDA\u1EDB\u1EDF\u43B5on\xBB\u1EDB;\u43F5\u0200csuv\u1EEA\u1EF3\u1F0B\u1F23\u0100io\u1EEF\u1E31rc\xBB\u1E2E\u0269\u1EF9\0\0\u1EFB\xED\u0548ant\u0100gl\u1F02\u1F06tr\xBB\u1E5Dess\xBB\u1E7A\u0180aei\u1F12\u1F16\u1F1Als;\u403Dst;\u625Fv\u0100;D\u0235\u1F20D;\u6A78parsl;\u69E5\u0100Da\u1F2F\u1F33ot;\u6253rr;\u6971\u0180cdi\u1F3E\u1F41\u1EF8r;\u612Fo\xF4\u0352\u0100ah\u1F49\u1F4B;\u43B7\u803B\xF0\u40F0\u0100mr\u1F53\u1F57l\u803B\xEB\u40EBo;\u60AC\u0180cip\u1F61\u1F64\u1F67l;\u4021s\xF4\u056E\u0100eo\u1F6C\u1F74ctatio\xEE\u0559nential\xE5\u0579\u09E1\u1F92\0\u1F9E\0\u1FA1\u1FA7\0\0\u1FC6\u1FCC\0\u1FD3\0\u1FE6\u1FEA\u2000\0\u2008\u205Allingdotse\xF1\u1E44y;\u4444male;\u6640\u0180ilr\u1FAD\u1FB3\u1FC1lig;\u8000\uFB03\u0269\u1FB9\0\0\u1FBDg;\u8000\uFB00ig;\u8000\uFB04;\uC000\u{1D523}lig;\u8000\uFB01lig;\uC000fj\u0180alt\u1FD9\u1FDC\u1FE1t;\u666Dig;\u8000\uFB02ns;\u65B1of;\u4192\u01F0\u1FEE\0\u1FF3f;\uC000\u{1D557}\u0100ak\u05BF\u1FF7\u0100;v\u1FFC\u1FFD\u62D4;\u6AD9artint;\u6A0D\u0100ao\u200C\u2055\u0100cs\u2011\u2052\u03B1\u201A\u2030\u2038\u2045\u2048\0\u2050\u03B2\u2022\u2025\u2027\u202A\u202C\0\u202E\u803B\xBD\u40BD;\u6153\u803B\xBC\u40BC;\u6155;\u6159;\u615B\u01B3\u2034\0\u2036;\u6154;\u6156\u02B4\u203E\u2041\0\0\u2043\u803B\xBE\u40BE;\u6157;\u615C5;\u6158\u01B6\u204C\0\u204E;\u615A;\u615D8;\u615El;\u6044wn;\u6322cr;\uC000\u{1D4BB}\u0880Eabcdefgijlnorstv\u2082\u2089\u209F\u20A5\u20B0\u20B4\u20F0\u20F5\u20FA\u20FF\u2103\u2112\u2138\u0317\u213E\u2152\u219E\u0100;l\u064D\u2087;\u6A8C\u0180cmp\u2090\u2095\u209Dute;\u41F5ma\u0100;d\u209C\u1CDA\u43B3;\u6A86reve;\u411F\u0100iy\u20AA\u20AErc;\u411D;\u4433ot;\u4121\u0200;lqs\u063E\u0642\u20BD\u20C9\u0180;qs\u063E\u064C\u20C4lan\xF4\u0665\u0200;cdl\u0665\u20D2\u20D5\u20E5c;\u6AA9ot\u0100;o\u20DC\u20DD\u6A80\u0100;l\u20E2\u20E3\u6A82;\u6A84\u0100;e\u20EA\u20ED\uC000\u22DB\uFE00s;\u6A94r;\uC000\u{1D524}\u0100;g\u0673\u061Bmel;\u6137cy;\u4453\u0200;Eaj\u065A\u210C\u210E\u2110;\u6A92;\u6AA5;\u6AA4\u0200Eaes\u211B\u211D\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6A8Arox\xBB\u2124\u0100;q\u212E\u212F\u6A88\u0100;q\u212E\u211Bim;\u62E7pf;\uC000\u{1D558}\u0100ci\u2143\u2146r;\u610Am\u0180;el\u066B\u214E\u2150;\u6A8E;\u6A90\u8300>;cdlqr\u05EE\u2160\u216A\u216E\u2173\u2179\u0100ci\u2165\u2167;\u6AA7r;\u6A7Aot;\u62D7Par;\u6995uest;\u6A7C\u0280adels\u2184\u216A\u2190\u0656\u219B\u01F0\u2189\0\u218Epro\xF8\u209Er;\u6978q\u0100lq\u063F\u2196les\xF3\u2088i\xED\u066B\u0100en\u21A3\u21ADrtneqq;\uC000\u2269\uFE00\xC5\u21AA\u0500Aabcefkosy\u21C4\u21C7\u21F1\u21F5\u21FA\u2218\u221D\u222F\u2268\u227Dr\xF2\u03A0\u0200ilmr\u21D0\u21D4\u21D7\u21DBrs\xF0\u1484f\xBB\u2024il\xF4\u06A9\u0100dr\u21E0\u21E4cy;\u444A\u0180;cw\u08F4\u21EB\u21EFir;\u6948;\u61ADar;\u610Firc;\u4125\u0180alr\u2201\u220E\u2213rts\u0100;u\u2209\u220A\u6665it\xBB\u220Alip;\u6026con;\u62B9r;\uC000\u{1D525}s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223A\u223E\u2243\u225E\u2263rr;\u61FFtht;\u623Bk\u0100lr\u2249\u2253eftarrow;\u61A9ightarrow;\u61AAf;\uC000\u{1D559}bar;\u6015\u0180clt\u226F\u2274\u2278r;\uC000\u{1D4BD}as\xE8\u21F4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xBB\u1C5B\u0AE1\u22A3\0\u22AA\0\u22B8\u22C5\u22CE\0\u22D5\u22F3\0\0\u22F8\u2322\u2367\u2362\u237F\0\u2386\u23AA\u23B4cute\u803B\xED\u40ED\u0180;iy\u0771\u22B0\u22B5rc\u803B\xEE\u40EE;\u4438\u0100cx\u22BC\u22BFy;\u4435cl\u803B\xA1\u40A1\u0100fr\u039F\u22C9;\uC000\u{1D526}rave\u803B\xEC\u40EC\u0200;ino\u073E\u22DD\u22E9\u22EE\u0100in\u22E2\u22E6nt;\u6A0Ct;\u622Dfin;\u69DCta;\u6129lig;\u4133\u0180aop\u22FE\u231A\u231D\u0180cgt\u2305\u2308\u2317r;\u412B\u0180elp\u071F\u230F\u2313in\xE5\u078Ear\xF4\u0720h;\u4131f;\u62B7ed;\u41B5\u0280;cfot\u04F4\u232C\u2331\u233D\u2341are;\u6105in\u0100;t\u2338\u2339\u621Eie;\u69DDdo\xF4\u2319\u0280;celp\u0757\u234C\u2350\u235B\u2361al;\u62BA\u0100gr\u2355\u2359er\xF3\u1563\xE3\u234Darhk;\u6A17rod;\u6A3C\u0200cgpt\u236F\u2372\u2376\u237By;\u4451on;\u412Ff;\uC000\u{1D55A}a;\u43B9uest\u803B\xBF\u40BF\u0100ci\u238A\u238Fr;\uC000\u{1D4BE}n\u0280;Edsv\u04F4\u239B\u239D\u23A1\u04F3;\u62F9ot;\u62F5\u0100;v\u23A6\u23A7\u62F4;\u62F3\u0100;i\u0777\u23AElde;\u4129\u01EB\u23B8\0\u23BCcy;\u4456l\u803B\xEF\u40EF\u0300cfmosu\u23CC\u23D7\u23DC\u23E1\u23E7\u23F5\u0100iy\u23D1\u23D5rc;\u4135;\u4439r;\uC000\u{1D527}ath;\u4237pf;\uC000\u{1D55B}\u01E3\u23EC\0\u23F1r;\uC000\u{1D4BF}rcy;\u4458kcy;\u4454\u0400acfghjos\u240B\u2416\u2422\u2427\u242D\u2431\u2435\u243Bppa\u0100;v\u2413\u2414\u43BA;\u43F0\u0100ey\u241B\u2420dil;\u4137;\u443Ar;\uC000\u{1D528}reen;\u4138cy;\u4445cy;\u445Cpf;\uC000\u{1D55C}cr;\uC000\u{1D4C0}\u0B80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248D\u2491\u250E\u253D\u255A\u2580\u264E\u265E\u2665\u2679\u267D\u269A\u26B2\u26D8\u275D\u2768\u278B\u27C0\u2801\u2812\u0180art\u2477\u247A\u247Cr\xF2\u09C6\xF2\u0395ail;\u691Barr;\u690E\u0100;g\u0994\u248B;\u6A8Bar;\u6962\u0963\u24A5\0\u24AA\0\u24B1\0\0\0\0\0\u24B5\u24BA\0\u24C6\u24C8\u24CD\0\u24F9ute;\u413Amptyv;\u69B4ra\xEE\u084Cbda;\u43BBg\u0180;dl\u088E\u24C1\u24C3;\u6991\xE5\u088E;\u6A85uo\u803B\xAB\u40ABr\u0400;bfhlpst\u0899\u24DE\u24E6\u24E9\u24EB\u24EE\u24F1\u24F5\u0100;f\u089D\u24E3s;\u691Fs;\u691D\xEB\u2252p;\u61ABl;\u6939im;\u6973l;\u61A2\u0180;ae\u24FF\u2500\u2504\u6AABil;\u6919\u0100;s\u2509\u250A\u6AAD;\uC000\u2AAD\uFE00\u0180abr\u2515\u2519\u251Drr;\u690Crk;\u6772\u0100ak\u2522\u252Cc\u0100ek\u2528\u252A;\u407B;\u405B\u0100es\u2531\u2533;\u698Bl\u0100du\u2539\u253B;\u698F;\u698D\u0200aeuy\u2546\u254B\u2556\u2558ron;\u413E\u0100di\u2550\u2554il;\u413C\xEC\u08B0\xE2\u2529;\u443B\u0200cqrs\u2563\u2566\u256D\u257Da;\u6936uo\u0100;r\u0E19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694Bh;\u61B2\u0280;fgqs\u258B\u258C\u0989\u25F3\u25FF\u6264t\u0280ahlrt\u2598\u25A4\u25B7\u25C2\u25E8rrow\u0100;t\u0899\u25A1a\xE9\u24F6arpoon\u0100du\u25AF\u25B4own\xBB\u045Ap\xBB\u0966eftarrows;\u61C7ight\u0180ahs\u25CD\u25D6\u25DErrow\u0100;s\u08F4\u08A7arpoon\xF3\u0F98quigarro\xF7\u21F0hreetimes;\u62CB\u0180;qs\u258B\u0993\u25FAlan\xF4\u09AC\u0280;cdgs\u09AC\u260A\u260D\u261D\u2628c;\u6AA8ot\u0100;o\u2614\u2615\u6A7F\u0100;r\u261A\u261B\u6A81;\u6A83\u0100;e\u2622\u2625\uC000\u22DA\uFE00s;\u6A93\u0280adegs\u2633\u2639\u263D\u2649\u264Bppro\xF8\u24C6ot;\u62D6q\u0100gq\u2643\u2645\xF4\u0989gt\xF2\u248C\xF4\u099Bi\xED\u09B2\u0180ilr\u2655\u08E1\u265Asht;\u697C;\uC000\u{1D529}\u0100;E\u099C\u2663;\u6A91\u0161\u2669\u2676r\u0100du\u25B2\u266E\u0100;l\u0965\u2673;\u696Alk;\u6584cy;\u4459\u0280;acht\u0A48\u2688\u268B\u2691\u2696r\xF2\u25C1orne\xF2\u1D08ard;\u696Bri;\u65FA\u0100io\u269F\u26A4dot;\u4140ust\u0100;a\u26AC\u26AD\u63B0che\xBB\u26AD\u0200Eaes\u26BB\u26BD\u26C9\u26D4;\u6268p\u0100;p\u26C3\u26C4\u6A89rox\xBB\u26C4\u0100;q\u26CE\u26CF\u6A87\u0100;q\u26CE\u26BBim;\u62E6\u0400abnoptwz\u26E9\u26F4\u26F7\u271A\u272F\u2741\u2747\u2750\u0100nr\u26EE\u26F1g;\u67ECr;\u61FDr\xEB\u08C1g\u0180lmr\u26FF\u270D\u2714eft\u0100ar\u09E6\u2707ight\xE1\u09F2apsto;\u67FCight\xE1\u09FDparrow\u0100lr\u2725\u2729ef\xF4\u24EDight;\u61AC\u0180afl\u2736\u2739\u273Dr;\u6985;\uC000\u{1D55D}us;\u6A2Dimes;\u6A34\u0161\u274B\u274Fst;\u6217\xE1\u134E\u0180;ef\u2757\u2758\u1800\u65CAnge\xBB\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277C\u2785\u2787r\xF2\u08A8orne\xF2\u1D8Car\u0100;d\u0F98\u2783;\u696D;\u600Eri;\u62BF\u0300achiqt\u2798\u279D\u0A40\u27A2\u27AE\u27BBquo;\u6039r;\uC000\u{1D4C1}m\u0180;eg\u09B2\u27AA\u27AC;\u6A8D;\u6A8F\u0100bu\u252A\u27B3o\u0100;r\u0E1F\u27B9;\u601Arok;\u4142\u8400<;cdhilqr\u082B\u27D2\u2639\u27DC\u27E0\u27E5\u27EA\u27F0\u0100ci\u27D7\u27D9;\u6AA6r;\u6A79re\xE5\u25F2mes;\u62C9arr;\u6976uest;\u6A7B\u0100Pi\u27F5\u27F9ar;\u6996\u0180;ef\u2800\u092D\u181B\u65C3r\u0100du\u2807\u280Dshar;\u694Ahar;\u6966\u0100en\u2817\u2821rtneqq;\uC000\u2268\uFE00\xC5\u281E\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288E\u2893\u28A0\u28A5\u28A8\u28DA\u28E2\u28E4\u0A83\u28F3\u2902Dot;\u623A\u0200clpr\u284E\u2852\u2863\u287Dr\u803B\xAF\u40AF\u0100et\u2857\u2859;\u6642\u0100;e\u285E\u285F\u6720se\xBB\u285F\u0100;s\u103B\u2868to\u0200;dlu\u103B\u2873\u2877\u287Bow\xEE\u048Cef\xF4\u090F\xF0\u13D1ker;\u65AE\u0100oy\u2887\u288Cmma;\u6A29;\u443Cash;\u6014asuredangle\xBB\u1626r;\uC000\u{1D52A}o;\u6127\u0180cdn\u28AF\u28B4\u28C9ro\u803B\xB5\u40B5\u0200;acd\u1464\u28BD\u28C0\u28C4s\xF4\u16A7ir;\u6AF0ot\u80BB\xB7\u01B5us\u0180;bd\u28D2\u1903\u28D3\u6212\u0100;u\u1D3C\u28D8;\u6A2A\u0163\u28DE\u28E1p;\u6ADB\xF2\u2212\xF0\u0A81\u0100dp\u28E9\u28EEels;\u62A7f;\uC000\u{1D55E}\u0100ct\u28F8\u28FDr;\uC000\u{1D4C2}pos\xBB\u159D\u0180;lm\u2909\u290A\u290D\u43BCtimap;\u62B8\u0C00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297E\u2989\u2998\u29DA\u29E9\u2A15\u2A1A\u2A58\u2A5D\u2A83\u2A95\u2AA4\u2AA8\u2B04\u2B07\u2B44\u2B7F\u2BAE\u2C34\u2C67\u2C7C\u2CE9\u0100gt\u2947\u294B;\uC000\u22D9\u0338\u0100;v\u2950\u0BCF\uC000\u226B\u20D2\u0180elt\u295A\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61CDightarrow;\u61CE;\uC000\u22D8\u0338\u0100;v\u297B\u0C47\uC000\u226A\u20D2ightarrow;\u61CF\u0100Dd\u298E\u2993ash;\u62AFash;\u62AE\u0280bcnpt\u29A3\u29A7\u29AC\u29B1\u29CCla\xBB\u02DEute;\u4144g;\uC000\u2220\u20D2\u0280;Eiop\u0D84\u29BC\u29C0\u29C5\u29C8;\uC000\u2A70\u0338d;\uC000\u224B\u0338s;\u4149ro\xF8\u0D84ur\u0100;a\u29D3\u29D4\u666El\u0100;s\u29D3\u0B38\u01F3\u29DF\0\u29E3p\u80BB\xA0\u0B37mp\u0100;e\u0BF9\u0C00\u0280aeouy\u29F4\u29FE\u2A03\u2A10\u2A13\u01F0\u29F9\0\u29FB;\u6A43on;\u4148dil;\u4146ng\u0100;d\u0D7E\u2A0Aot;\uC000\u2A6D\u0338p;\u6A42;\u443Dash;\u6013\u0380;Aadqsx\u0B92\u2A29\u2A2D\u2A3B\u2A41\u2A45\u2A50rr;\u61D7r\u0100hr\u2A33\u2A36k;\u6924\u0100;o\u13F2\u13F0ot;\uC000\u2250\u0338ui\xF6\u0B63\u0100ei\u2A4A\u2A4Ear;\u6928\xED\u0B98ist\u0100;s\u0BA0\u0B9Fr;\uC000\u{1D52B}\u0200Eest\u0BC5\u2A66\u2A79\u2A7C\u0180;qs\u0BBC\u2A6D\u0BE1\u0180;qs\u0BBC\u0BC5\u2A74lan\xF4\u0BE2i\xED\u0BEA\u0100;r\u0BB6\u2A81\xBB\u0BB7\u0180Aap\u2A8A\u2A8D\u2A91r\xF2\u2971rr;\u61AEar;\u6AF2\u0180;sv\u0F8D\u2A9C\u0F8C\u0100;d\u2AA1\u2AA2\u62FC;\u62FAcy;\u445A\u0380AEadest\u2AB7\u2ABA\u2ABE\u2AC2\u2AC5\u2AF6\u2AF9r\xF2\u2966;\uC000\u2266\u0338rr;\u619Ar;\u6025\u0200;fqs\u0C3B\u2ACE\u2AE3\u2AEFt\u0100ar\u2AD4\u2AD9rro\xF7\u2AC1ightarro\xF7\u2A90\u0180;qs\u0C3B\u2ABA\u2AEAlan\xF4\u0C55\u0100;s\u0C55\u2AF4\xBB\u0C36i\xED\u0C5D\u0100;r\u0C35\u2AFEi\u0100;e\u0C1A\u0C25i\xE4\u0D90\u0100pt\u2B0C\u2B11f;\uC000\u{1D55F}\u8180\xAC;in\u2B19\u2B1A\u2B36\u40ACn\u0200;Edv\u0B89\u2B24\u2B28\u2B2E;\uC000\u22F9\u0338ot;\uC000\u22F5\u0338\u01E1\u0B89\u2B33\u2B35;\u62F7;\u62F6i\u0100;v\u0CB8\u2B3C\u01E1\u0CB8\u2B41\u2B43;\u62FE;\u62FD\u0180aor\u2B4B\u2B63\u2B69r\u0200;ast\u0B7B\u2B55\u2B5A\u2B5Flle\xEC\u0B7Bl;\uC000\u2AFD\u20E5;\uC000\u2202\u0338lint;\u6A14\u0180;ce\u0C92\u2B70\u2B73u\xE5\u0CA5\u0100;c\u0C98\u2B78\u0100;e\u0C92\u2B7D\xF1\u0C98\u0200Aait\u2B88\u2B8B\u2B9D\u2BA7r\xF2\u2988rr\u0180;cw\u2B94\u2B95\u2B99\u619B;\uC000\u2933\u0338;\uC000\u219D\u0338ghtarrow\xBB\u2B95ri\u0100;e\u0CCB\u0CD6\u0380chimpqu\u2BBD\u2BCD\u2BD9\u2B04\u0B78\u2BE4\u2BEF\u0200;cer\u0D32\u2BC6\u0D37\u2BC9u\xE5\u0D45;\uC000\u{1D4C3}ort\u026D\u2B05\0\0\u2BD6ar\xE1\u2B56m\u0100;e\u0D6E\u2BDF\u0100;q\u0D74\u0D73su\u0100bp\u2BEB\u2BED\xE5\u0CF8\xE5\u0D0B\u0180bcp\u2BF6\u2C11\u2C19\u0200;Ees\u2BFF\u2C00\u0D22\u2C04\u6284;\uC000\u2AC5\u0338et\u0100;e\u0D1B\u2C0Bq\u0100;q\u0D23\u2C00c\u0100;e\u0D32\u2C17\xF1\u0D38\u0200;Ees\u2C22\u2C23\u0D5F\u2C27\u6285;\uC000\u2AC6\u0338et\u0100;e\u0D58\u2C2Eq\u0100;q\u0D60\u2C23\u0200gilr\u2C3D\u2C3F\u2C45\u2C47\xEC\u0BD7lde\u803B\xF1\u40F1\xE7\u0C43iangle\u0100lr\u2C52\u2C5Ceft\u0100;e\u0C1A\u2C5A\xF1\u0C26ight\u0100;e\u0CCB\u2C65\xF1\u0CD7\u0100;m\u2C6C\u2C6D\u43BD\u0180;es\u2C74\u2C75\u2C79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2C8F\u2C94\u2C99\u2C9E\u2CA3\u2CB0\u2CB6\u2CD3\u2CE3ash;\u62ADarr;\u6904p;\uC000\u224D\u20D2ash;\u62AC\u0100et\u2CA8\u2CAC;\uC000\u2265\u20D2;\uC000>\u20D2nfin;\u69DE\u0180Aet\u2CBD\u2CC1\u2CC5rr;\u6902;\uC000\u2264\u20D2\u0100;r\u2CCA\u2CCD\uC000<\u20D2ie;\uC000\u22B4\u20D2\u0100At\u2CD8\u2CDCrr;\u6903rie;\uC000\u22B5\u20D2im;\uC000\u223C\u20D2\u0180Aan\u2CF0\u2CF4\u2D02rr;\u61D6r\u0100hr\u2CFA\u2CFDk;\u6923\u0100;o\u13E7\u13E5ear;\u6927\u1253\u1A95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2D2D\0\u2D38\u2D48\u2D60\u2D65\u2D72\u2D84\u1B07\0\0\u2D8D\u2DAB\0\u2DC8\u2DCE\0\u2DDC\u2E19\u2E2B\u2E3E\u2E43\u0100cs\u2D31\u1A97ute\u803B\xF3\u40F3\u0100iy\u2D3C\u2D45r\u0100;c\u1A9E\u2D42\u803B\xF4\u40F4;\u443E\u0280abios\u1AA0\u2D52\u2D57\u01C8\u2D5Alac;\u4151v;\u6A38old;\u69BClig;\u4153\u0100cr\u2D69\u2D6Dir;\u69BF;\uC000\u{1D52C}\u036F\u2D79\0\0\u2D7C\0\u2D82n;\u42DBave\u803B\xF2\u40F2;\u69C1\u0100bm\u2D88\u0DF4ar;\u69B5\u0200acit\u2D95\u2D98\u2DA5\u2DA8r\xF2\u1A80\u0100ir\u2D9D\u2DA0r;\u69BEoss;\u69BBn\xE5\u0E52;\u69C0\u0180aei\u2DB1\u2DB5\u2DB9cr;\u414Dga;\u43C9\u0180cdn\u2DC0\u2DC5\u01CDron;\u43BF;\u69B6pf;\uC000\u{1D560}\u0180ael\u2DD4\u2DD7\u01D2r;\u69B7rp;\u69B9\u0380;adiosv\u2DEA\u2DEB\u2DEE\u2E08\u2E0D\u2E10\u2E16\u6228r\xF2\u1A86\u0200;efm\u2DF7\u2DF8\u2E02\u2E05\u6A5Dr\u0100;o\u2DFE\u2DFF\u6134f\xBB\u2DFF\u803B\xAA\u40AA\u803B\xBA\u40BAgof;\u62B6r;\u6A56lope;\u6A57;\u6A5B\u0180clo\u2E1F\u2E21\u2E27\xF2\u2E01ash\u803B\xF8\u40F8l;\u6298i\u016C\u2E2F\u2E34de\u803B\xF5\u40F5es\u0100;a\u01DB\u2E3As;\u6A36ml\u803B\xF6\u40F6bar;\u633D\u0AE1\u2E5E\0\u2E7D\0\u2E80\u2E9D\0\u2EA2\u2EB9\0\0\u2ECB\u0E9C\0\u2F13\0\0\u2F2B\u2FBC\0\u2FC8r\u0200;ast\u0403\u2E67\u2E72\u0E85\u8100\xB6;l\u2E6D\u2E6E\u40B6le\xEC\u0403\u0269\u2E78\0\0\u2E7Bm;\u6AF3;\u6AFDy;\u443Fr\u0280cimpt\u2E8B\u2E8F\u2E93\u1865\u2E97nt;\u4025od;\u402Eil;\u6030enk;\u6031r;\uC000\u{1D52D}\u0180imo\u2EA8\u2EB0\u2EB4\u0100;v\u2EAD\u2EAE\u43C6;\u43D5ma\xF4\u0A76ne;\u660E\u0180;tv\u2EBF\u2EC0\u2EC8\u43C0chfork\xBB\u1FFD;\u43D6\u0100au\u2ECF\u2EDFn\u0100ck\u2ED5\u2EDDk\u0100;h\u21F4\u2EDB;\u610E\xF6\u21F4s\u0480;abcdemst\u2EF3\u2EF4\u1908\u2EF9\u2EFD\u2F04\u2F06\u2F0A\u2F0E\u402Bcir;\u6A23ir;\u6A22\u0100ou\u1D40\u2F02;\u6A25;\u6A72n\u80BB\xB1\u0E9Dim;\u6A26wo;\u6A27\u0180ipu\u2F19\u2F20\u2F25ntint;\u6A15f;\uC000\u{1D561}nd\u803B\xA3\u40A3\u0500;Eaceinosu\u0EC8\u2F3F\u2F41\u2F44\u2F47\u2F81\u2F89\u2F92\u2F7E\u2FB6;\u6AB3p;\u6AB7u\xE5\u0ED9\u0100;c\u0ECE\u2F4C\u0300;acens\u0EC8\u2F59\u2F5F\u2F66\u2F68\u2F7Eppro\xF8\u2F43urlye\xF1\u0ED9\xF1\u0ECE\u0180aes\u2F6F\u2F76\u2F7Approx;\u6AB9qq;\u6AB5im;\u62E8i\xED\u0EDFme\u0100;s\u2F88\u0EAE\u6032\u0180Eas\u2F78\u2F90\u2F7A\xF0\u2F75\u0180dfp\u0EEC\u2F99\u2FAF\u0180als\u2FA0\u2FA5\u2FAAlar;\u632Eine;\u6312urf;\u6313\u0100;t\u0EFB\u2FB4\xEF\u0EFBrel;\u62B0\u0100ci\u2FC0\u2FC5r;\uC000\u{1D4C5};\u43C8ncsp;\u6008\u0300fiopsu\u2FDA\u22E2\u2FDF\u2FE5\u2FEB\u2FF1r;\uC000\u{1D52E}pf;\uC000\u{1D562}rime;\u6057cr;\uC000\u{1D4C6}\u0180aeo\u2FF8\u3009\u3013t\u0100ei\u2FFE\u3005rnion\xF3\u06B0nt;\u6A16st\u0100;e\u3010\u3011\u403F\xF1\u1F19\xF4\u0F14\u0A80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30E0\u310E\u312B\u3147\u3162\u3172\u318E\u3206\u3215\u3224\u3229\u3258\u326E\u3272\u3290\u32B0\u32B7\u0180art\u3047\u304A\u304Cr\xF2\u10B3\xF2\u03DDail;\u691Car\xF2\u1C65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307F\u308F\u3094\u30CC\u0100eu\u306D\u3071;\uC000\u223D\u0331te;\u4155i\xE3\u116Emptyv;\u69B3g\u0200;del\u0FD1\u3089\u308B\u308D;\u6992;\u69A5\xE5\u0FD1uo\u803B\xBB\u40BBr\u0580;abcfhlpstw\u0FDC\u30AC\u30AF\u30B7\u30B9\u30BC\u30BE\u30C0\u30C3\u30C7\u30CAp;\u6975\u0100;f\u0FE0\u30B4s;\u6920;\u6933s;\u691E\xEB\u225D\xF0\u272El;\u6945im;\u6974l;\u61A3;\u619D\u0100ai\u30D1\u30D5il;\u691Ao\u0100;n\u30DB\u30DC\u6236al\xF3\u0F1E\u0180abr\u30E7\u30EA\u30EEr\xF2\u17E5rk;\u6773\u0100ak\u30F3\u30FDc\u0100ek\u30F9\u30FB;\u407D;\u405D\u0100es\u3102\u3104;\u698Cl\u0100du\u310A\u310C;\u698E;\u6990\u0200aeuy\u3117\u311C\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xEC\u0FF2\xE2\u30FA;\u4440\u0200clqs\u3134\u3137\u313D\u3144a;\u6937dhar;\u6969uo\u0100;r\u020E\u020Dh;\u61B3\u0180acg\u314E\u315F\u0F44l\u0200;ips\u0F78\u3158\u315B\u109Cn\xE5\u10BBar\xF4\u0FA9t;\u65AD\u0180ilr\u3169\u1023\u316Esht;\u697D;\uC000\u{1D52F}\u0100ao\u3177\u3186r\u0100du\u317D\u317F\xBB\u047B\u0100;l\u1091\u3184;\u696C\u0100;v\u318B\u318C\u43C1;\u43F1\u0180gns\u3195\u31F9\u31FCht\u0300ahlrst\u31A4\u31B0\u31C2\u31D8\u31E4\u31EErrow\u0100;t\u0FDC\u31ADa\xE9\u30C8arpoon\u0100du\u31BB\u31BFow\xEE\u317Ep\xBB\u1092eft\u0100ah\u31CA\u31D0rrow\xF3\u0FEAarpoon\xF3\u0551ightarrows;\u61C9quigarro\xF7\u30CBhreetimes;\u62CCg;\u42DAingdotse\xF1\u1F32\u0180ahm\u320D\u3210\u3213r\xF2\u0FEAa\xF2\u0551;\u600Foust\u0100;a\u321E\u321F\u63B1che\xBB\u321Fmid;\u6AEE\u0200abpt\u3232\u323D\u3240\u3252\u0100nr\u3237\u323Ag;\u67EDr;\u61FEr\xEB\u1003\u0180afl\u3247\u324A\u324Er;\u6986;\uC000\u{1D563}us;\u6A2Eimes;\u6A35\u0100ap\u325D\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6A12ar\xF2\u31E3\u0200achq\u327B\u3280\u10BC\u3285quo;\u603Ar;\uC000\u{1D4C7}\u0100bu\u30FB\u328Ao\u0100;r\u0214\u0213\u0180hir\u3297\u329B\u32A0re\xE5\u31F8mes;\u62CAi\u0200;efl\u32AA\u1059\u1821\u32AB\u65B9tri;\u69CEluhar;\u6968;\u611E\u0D61\u32D5\u32DB\u32DF\u332C\u3338\u3371\0\u337A\u33A4\0\0\u33EC\u33F0\0\u3428\u3448\u345A\u34AD\u34B1\u34CA\u34F1\0\u3616\0\0\u3633cute;\u415Bqu\xEF\u27BA\u0500;Eaceinpsy\u11ED\u32F3\u32F5\u32FF\u3302\u330B\u330F\u331F\u3326\u3329;\u6AB4\u01F0\u32FA\0\u32FC;\u6AB8on;\u4161u\xE5\u11FE\u0100;d\u11F3\u3307il;\u415Frc;\u415D\u0180Eas\u3316\u3318\u331B;\u6AB6p;\u6ABAim;\u62E9olint;\u6A13i\xED\u1204;\u4441ot\u0180;be\u3334\u1D47\u3335\u62C5;\u6A66\u0380Aacmstx\u3346\u334A\u3357\u335B\u335E\u3363\u336Drr;\u61D8r\u0100hr\u3350\u3352\xEB\u2228\u0100;o\u0A36\u0A34t\u803B\xA7\u40A7i;\u403Bwar;\u6929m\u0100in\u3369\xF0nu\xF3\xF1t;\u6736r\u0100;o\u3376\u2055\uC000\u{1D530}\u0200acoy\u3382\u3386\u3391\u33A0rp;\u666F\u0100hy\u338B\u338Fcy;\u4449;\u4448rt\u026D\u3399\0\0\u339Ci\xE4\u1464ara\xEC\u2E6F\u803B\xAD\u40AD\u0100gm\u33A8\u33B4ma\u0180;fv\u33B1\u33B2\u33B2\u43C3;\u43C2\u0400;deglnpr\u12AB\u33C5\u33C9\u33CE\u33D6\u33DE\u33E1\u33E6ot;\u6A6A\u0100;q\u12B1\u12B0\u0100;E\u33D3\u33D4\u6A9E;\u6AA0\u0100;E\u33DB\u33DC\u6A9D;\u6A9Fe;\u6246lus;\u6A24arr;\u6972ar\xF2\u113D\u0200aeit\u33F8\u3408\u340F\u3417\u0100ls\u33FD\u3404lsetm\xE9\u336Ahp;\u6A33parsl;\u69E4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341C\u341D\u6AAA\u0100;s\u3422\u3423\u6AAC;\uC000\u2AAC\uFE00\u0180flp\u342E\u3433\u3442tcy;\u444C\u0100;b\u3438\u3439\u402F\u0100;a\u343E\u343F\u69C4r;\u633Ff;\uC000\u{1D564}a\u0100dr\u344D\u0402es\u0100;u\u3454\u3455\u6660it\xBB\u3455\u0180csu\u3460\u3479\u349F\u0100au\u3465\u346Fp\u0100;s\u1188\u346B;\uC000\u2293\uFE00p\u0100;s\u11B4\u3475;\uC000\u2294\uFE00u\u0100bp\u347F\u348F\u0180;es\u1197\u119C\u3486et\u0100;e\u1197\u348D\xF1\u119D\u0180;es\u11A8\u11AD\u3496et\u0100;e\u11A8\u349D\xF1\u11AE\u0180;af\u117B\u34A6\u05B0r\u0165\u34AB\u05B1\xBB\u117Car\xF2\u1148\u0200cemt\u34B9\u34BE\u34C2\u34C5r;\uC000\u{1D4C8}tm\xEE\xF1i\xEC\u3415ar\xE6\u11BE\u0100ar\u34CE\u34D5r\u0100;f\u34D4\u17BF\u6606\u0100an\u34DA\u34EDight\u0100ep\u34E3\u34EApsilo\xEE\u1EE0h\xE9\u2EAFs\xBB\u2852\u0280bcmnp\u34FB\u355E\u1209\u358B\u358E\u0480;Edemnprs\u350E\u350F\u3511\u3515\u351E\u3523\u352C\u3531\u3536\u6282;\u6AC5ot;\u6ABD\u0100;d\u11DA\u351Aot;\u6AC3ult;\u6AC1\u0100Ee\u3528\u352A;\u6ACB;\u628Alus;\u6ABFarr;\u6979\u0180eiu\u353D\u3552\u3555t\u0180;en\u350E\u3545\u354Bq\u0100;q\u11DA\u350Feq\u0100;q\u352B\u3528m;\u6AC7\u0100bp\u355A\u355C;\u6AD5;\u6AD3c\u0300;acens\u11ED\u356C\u3572\u3579\u357B\u3326ppro\xF8\u32FAurlye\xF1\u11FE\xF1\u11F3\u0180aes\u3582\u3588\u331Bppro\xF8\u331Aq\xF1\u3317g;\u666A\u0680123;Edehlmnps\u35A9\u35AC\u35AF\u121C\u35B2\u35B4\u35C0\u35C9\u35D5\u35DA\u35DF\u35E8\u35ED\u803B\xB9\u40B9\u803B\xB2\u40B2\u803B\xB3\u40B3;\u6AC6\u0100os\u35B9\u35BCt;\u6ABEub;\u6AD8\u0100;d\u1222\u35C5ot;\u6AC4s\u0100ou\u35CF\u35D2l;\u67C9b;\u6AD7arr;\u697Bult;\u6AC2\u0100Ee\u35E4\u35E6;\u6ACC;\u628Blus;\u6AC0\u0180eiu\u35F4\u3609\u360Ct\u0180;en\u121C\u35FC\u3602q\u0100;q\u1222\u35B2eq\u0100;q\u35E7\u35E4m;\u6AC8\u0100bp\u3611\u3613;\u6AD4;\u6AD6\u0180Aan\u361C\u3620\u362Drr;\u61D9r\u0100hr\u3626\u3628\xEB\u222E\u0100;o\u0A2B\u0A29war;\u692Alig\u803B\xDF\u40DF\u0BE1\u3651\u365D\u3660\u12CE\u3673\u3679\0\u367E\u36C2\0\0\0\0\0\u36DB\u3703\0\u3709\u376C\0\0\0\u3787\u0272\u3656\0\0\u365Bget;\u6316;\u43C4r\xEB\u0E5F\u0180aey\u3666\u366B\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uC000\u{1D531}\u0200eiko\u3686\u369D\u36B5\u36BC\u01F2\u368B\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369B\u43B8ym;\u43D1\u0100cn\u36A2\u36B2k\u0100as\u36A8\u36AEppro\xF8\u12C1im\xBB\u12ACs\xF0\u129E\u0100as\u36BA\u36AE\xF0\u12C1rn\u803B\xFE\u40FE\u01EC\u031F\u36C6\u22E7es\u8180\xD7;bd\u36CF\u36D0\u36D8\u40D7\u0100;a\u190F\u36D5r;\u6A31;\u6A30\u0180eps\u36E1\u36E3\u3700\xE1\u2A4D\u0200;bcf\u0486\u36EC\u36F0\u36F4ot;\u6336ir;\u6AF1\u0100;o\u36F9\u36FC\uC000\u{1D565}rk;\u6ADA\xE1\u3362rime;\u6034\u0180aip\u370F\u3712\u3764d\xE5\u1248\u0380adempst\u3721\u374D\u3740\u3751\u3757\u375C\u375Fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65B5own\xBB\u1DBBeft\u0100;e\u2800\u373E\xF1\u092E;\u625Cight\u0100;e\u32AA\u374B\xF1\u105Aot;\u65ECinus;\u6A3Alus;\u6A39b;\u69CDime;\u6A3Bezium;\u63E2\u0180cht\u3772\u377D\u3781\u0100ry\u3777\u377B;\uC000\u{1D4C9};\u4446cy;\u445Brok;\u4167\u0100io\u378B\u378Ex\xF4\u1777head\u0100lr\u3797\u37A0eftarro\xF7\u084Fightarrow\xBB\u0F5D\u0900AHabcdfghlmoprstuw\u37D0\u37D3\u37D7\u37E4\u37F0\u37FC\u380E\u381C\u3823\u3834\u3851\u385D\u386B\u38A9\u38CC\u38D2\u38EA\u38F6r\xF2\u03EDar;\u6963\u0100cr\u37DC\u37E2ute\u803B\xFA\u40FA\xF2\u1150r\u01E3\u37EA\0\u37EDy;\u445Eve;\u416D\u0100iy\u37F5\u37FArc\u803B\xFB\u40FB;\u4443\u0180abh\u3803\u3806\u380Br\xF2\u13ADlac;\u4171a\xF2\u13C3\u0100ir\u3813\u3818sht;\u697E;\uC000\u{1D532}rave\u803B\xF9\u40F9\u0161\u3827\u3831r\u0100lr\u382C\u382E\xBB\u0957\xBB\u1083lk;\u6580\u0100ct\u3839\u384D\u026F\u383F\0\0\u384Arn\u0100;e\u3845\u3846\u631Cr\xBB\u3846op;\u630Fri;\u65F8\u0100al\u3856\u385Acr;\u416B\u80BB\xA8\u0349\u0100gp\u3862\u3866on;\u4173f;\uC000\u{1D566}\u0300adhlsu\u114B\u3878\u387D\u1372\u3891\u38A0own\xE1\u13B3arpoon\u0100lr\u3888\u388Cef\xF4\u382Digh\xF4\u382Fi\u0180;hl\u3899\u389A\u389C\u43C5\xBB\u13FAon\xBB\u389Aparrows;\u61C8\u0180cit\u38B0\u38C4\u38C8\u026F\u38B6\0\0\u38C1rn\u0100;e\u38BC\u38BD\u631Dr\xBB\u38BDop;\u630Eng;\u416Fri;\u65F9cr;\uC000\u{1D4CA}\u0180dir\u38D9\u38DD\u38E2ot;\u62F0lde;\u4169i\u0100;f\u3730\u38E8\xBB\u1813\u0100am\u38EF\u38F2r\xF2\u38A8l\u803B\xFC\u40FCangle;\u69A7\u0780ABDacdeflnoprsz\u391C\u391F\u3929\u392D\u39B5\u39B8\u39BD\u39DF\u39E4\u39E8\u39F3\u39F9\u39FD\u3A01\u3A20r\xF2\u03F7ar\u0100;v\u3926\u3927\u6AE8;\u6AE9as\xE8\u03E1\u0100nr\u3932\u3937grt;\u699C\u0380eknprst\u34E3\u3946\u394B\u3952\u395D\u3964\u3996app\xE1\u2415othin\xE7\u1E96\u0180hir\u34EB\u2EC8\u3959op\xF4\u2FB5\u0100;h\u13B7\u3962\xEF\u318D\u0100iu\u3969\u396Dgm\xE1\u33B3\u0100bp\u3972\u3984setneq\u0100;q\u397D\u3980\uC000\u228A\uFE00;\uC000\u2ACB\uFE00setneq\u0100;q\u398F\u3992\uC000\u228B\uFE00;\uC000\u2ACC\uFE00\u0100hr\u399B\u399Fet\xE1\u369Ciangle\u0100lr\u39AA\u39AFeft\xBB\u0925ight\xBB\u1051y;\u4432ash\xBB\u1036\u0180elr\u39C4\u39D2\u39D7\u0180;be\u2DEA\u39CB\u39CFar;\u62BBq;\u625Alip;\u62EE\u0100bt\u39DC\u1468a\xF2\u1469r;\uC000\u{1D533}tr\xE9\u39AEsu\u0100bp\u39EF\u39F1\xBB\u0D1C\xBB\u0D59pf;\uC000\u{1D567}ro\xF0\u0EFBtr\xE9\u39B4\u0100cu\u3A06\u3A0Br;\uC000\u{1D4CB}\u0100bp\u3A10\u3A18n\u0100Ee\u3980\u3A16\xBB\u397En\u0100Ee\u3992\u3A1E\xBB\u3990igzag;\u699A\u0380cefoprs\u3A36\u3A3B\u3A56\u3A5B\u3A54\u3A61\u3A6Airc;\u4175\u0100di\u3A40\u3A51\u0100bg\u3A45\u3A49ar;\u6A5Fe\u0100;q\u15FA\u3A4F;\u6259erp;\u6118r;\uC000\u{1D534}pf;\uC000\u{1D568}\u0100;e\u1479\u3A66at\xE8\u1479cr;\uC000\u{1D4CC}\u0AE3\u178E\u3A87\0\u3A8B\0\u3A90\u3A9B\0\0\u3A9D\u3AA8\u3AAB\u3AAF\0\0\u3AC3\u3ACE\0\u3AD8\u17DC\u17DFtr\xE9\u17D1r;\uC000\u{1D535}\u0100Aa\u3A94\u3A97r\xF2\u03C3r\xF2\u09F6;\u43BE\u0100Aa\u3AA1\u3AA4r\xF2\u03B8r\xF2\u09EBa\xF0\u2713is;\u62FB\u0180dpt\u17A4\u3AB5\u3ABE\u0100fl\u3ABA\u17A9;\uC000\u{1D569}im\xE5\u17B2\u0100Aa\u3AC7\u3ACAr\xF2\u03CEr\xF2\u0A01\u0100cq\u3AD2\u17B8r;\uC000\u{1D4CD}\u0100pt\u17D6\u3ADCr\xE9\u17D4\u0400acefiosu\u3AF0\u3AFD\u3B08\u3B0C\u3B11\u3B15\u3B1B\u3B21c\u0100uy\u3AF6\u3AFBte\u803B\xFD\u40FD;\u444F\u0100iy\u3B02\u3B06rc;\u4177;\u444Bn\u803B\xA5\u40A5r;\uC000\u{1D536}cy;\u4457pf;\uC000\u{1D56A}cr;\uC000\u{1D4CE}\u0100cm\u3B26\u3B29y;\u444El\u803B\xFF\u40FF\u0500acdefhiosw\u3B42\u3B48\u3B54\u3B58\u3B64\u3B69\u3B6D\u3B74\u3B7A\u3B80cute;\u417A\u0100ay\u3B4D\u3B52ron;\u417E;\u4437ot;\u417C\u0100et\u3B5D\u3B61tr\xE6\u155Fa;\u43B6r;\uC000\u{1D537}cy;\u4436grarr;\u61DDpf;\uC000\u{1D56B}cr;\uC000\u{1D4CF}\u0100jn\u3B85\u3B87;\u600Dj;\u600C'.split("").map((c) => c.charCodeAt(0))
);

// node_modules/entities/lib/esm/generated/decode-data-xml.js
var decode_data_xml_default = new Uint16Array(
  // prettier-ignore
  "\u0200aglq	\x1B\u026D\0\0p;\u4026os;\u4027t;\u403Et;\u403Cuot;\u4022".split("").map((c) => c.charCodeAt(0))
);

// node_modules/entities/lib/esm/decode_codepoint.js
var _a2;
var decodeMap2 = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
var fromCodePoint2 = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (_a2 = String.fromCodePoint) !== null && _a2 !== void 0 ? _a2 : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  }
);
function replaceCodePoint2(codePoint) {
  var _a3;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a3 = decodeMap2.get(codePoint)) !== null && _a3 !== void 0 ? _a3 : codePoint;
}

// node_modules/entities/lib/esm/decode.js
var CharCodes3;
(function(CharCodes4) {
  CharCodes4[CharCodes4["NUM"] = 35] = "NUM";
  CharCodes4[CharCodes4["SEMI"] = 59] = "SEMI";
  CharCodes4[CharCodes4["EQUALS"] = 61] = "EQUALS";
  CharCodes4[CharCodes4["ZERO"] = 48] = "ZERO";
  CharCodes4[CharCodes4["NINE"] = 57] = "NINE";
  CharCodes4[CharCodes4["LOWER_A"] = 97] = "LOWER_A";
  CharCodes4[CharCodes4["LOWER_F"] = 102] = "LOWER_F";
  CharCodes4[CharCodes4["LOWER_X"] = 120] = "LOWER_X";
  CharCodes4[CharCodes4["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes4[CharCodes4["UPPER_A"] = 65] = "UPPER_A";
  CharCodes4[CharCodes4["UPPER_F"] = 70] = "UPPER_F";
  CharCodes4[CharCodes4["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes3 || (CharCodes3 = {}));
var TO_LOWER_BIT2 = 32;
var BinTrieFlags2;
(function(BinTrieFlags3) {
  BinTrieFlags3[BinTrieFlags3["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags3[BinTrieFlags3["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
  BinTrieFlags3[BinTrieFlags3["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags2 || (BinTrieFlags2 = {}));
function isNumber2(code) {
  return code >= CharCodes3.ZERO && code <= CharCodes3.NINE;
}
function isHexadecimalCharacter2(code) {
  return code >= CharCodes3.UPPER_A && code <= CharCodes3.UPPER_F || code >= CharCodes3.LOWER_A && code <= CharCodes3.LOWER_F;
}
function isAsciiAlphaNumeric2(code) {
  return code >= CharCodes3.UPPER_A && code <= CharCodes3.UPPER_Z || code >= CharCodes3.LOWER_A && code <= CharCodes3.LOWER_Z || isNumber2(code);
}
function isEntityInAttributeInvalidEnd2(code) {
  return code === CharCodes3.EQUALS || isAsciiAlphaNumeric2(code);
}
var EntityDecoderState2;
(function(EntityDecoderState3) {
  EntityDecoderState3[EntityDecoderState3["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState3[EntityDecoderState3["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState3[EntityDecoderState3["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState3[EntityDecoderState3["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState3[EntityDecoderState3["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState2 || (EntityDecoderState2 = {}));
var DecodingMode2;
(function(DecodingMode3) {
  DecodingMode3[DecodingMode3["Legacy"] = 0] = "Legacy";
  DecodingMode3[DecodingMode3["Strict"] = 1] = "Strict";
  DecodingMode3[DecodingMode3["Attribute"] = 2] = "Attribute";
})(DecodingMode2 || (DecodingMode2 = {}));
var EntityDecoder2 = class {
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
    this.state = EntityDecoderState2.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode2.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState2.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(str, offset) {
    switch (this.state) {
      case EntityDecoderState2.EntityStart: {
        if (str.charCodeAt(offset) === CharCodes3.NUM) {
          this.state = EntityDecoderState2.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(str, offset + 1);
        }
        this.state = EntityDecoderState2.NamedEntity;
        return this.stateNamedEntity(str, offset);
      }
      case EntityDecoderState2.NumericStart: {
        return this.stateNumericStart(str, offset);
      }
      case EntityDecoderState2.NumericDecimal: {
        return this.stateNumericDecimal(str, offset);
      }
      case EntityDecoderState2.NumericHex: {
        return this.stateNumericHex(str, offset);
      }
      case EntityDecoderState2.NamedEntity: {
        return this.stateNamedEntity(str, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(str, offset) {
    if (offset >= str.length) {
      return -1;
    }
    if ((str.charCodeAt(offset) | TO_LOWER_BIT2) === CharCodes3.LOWER_X) {
      this.state = EntityDecoderState2.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(str, offset + 1);
    }
    this.state = EntityDecoderState2.NumericDecimal;
    return this.stateNumericDecimal(str, offset);
  }
  addToNumericResult(str, start, end, base) {
    if (start !== end) {
      const digitCount = end - start;
      this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
      this.consumed += digitCount;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber2(char) || isHexadecimalCharacter2(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 16);
        return this.emitNumericEntity(char, 3);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 16);
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber2(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 10);
        return this.emitNumericEntity(char, 2);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 10);
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a3;
    if (this.consumed <= expectedLength) {
      (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes3.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode2.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint2(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes3.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(str, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags2.VALUE_LENGTH) >> 14;
    for (; offset < str.length; offset++, this.excess++) {
      const char = str.charCodeAt(offset);
      this.treeIndex = determineBranch2(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode2.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd2(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags2.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes3.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode2.Strict) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a3;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags2.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags2.VALUE_LENGTH : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a3;
    switch (this.state) {
      case EntityDecoderState2.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode2.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      // Otherwise, emit a numeric entity if we have one.
      case EntityDecoderState2.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState2.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState2.NumericStart: {
        (_a3 = this.errors) === null || _a3 === void 0 ? void 0 : _a3.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState2.EntityStart: {
        return 0;
      }
    }
  }
};
function getDecoder(decodeTree) {
  let ret = "";
  const decoder = new EntityDecoder2(decodeTree, (str) => ret += fromCodePoint2(str));
  return function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder.startEntity(decodeMode);
      const len = decoder.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  };
}
function determineBranch2(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags2.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags2.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo = nodeIdx;
  let hi = lo + branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo = mid + 1;
    } else if (midVal > char) {
      hi = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
var htmlDecoder = getDecoder(decode_data_html_default);
var xmlDecoder = getDecoder(decode_data_xml_default);

// node_modules/entities/lib/esm/generated/encode-html.js
function restoreDiff(arr) {
  for (let i = 1; i < arr.length; i++) {
    arr[i][0] += arr[i - 1][0] + 1;
  }
  return arr;
}
var encode_html_default = new Map(/* @__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]]));

// node_modules/entities/lib/esm/escape.js
var xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
var xmlCodeMap = /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [39, "&apos;"],
  [60, "&lt;"],
  [62, "&gt;"]
]);
var getCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  String.prototype.codePointAt != null ? (str, index) => str.codePointAt(index) : (
    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    (c, index) => (c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index)
  )
);
function encodeXML(str) {
  let ret = "";
  let lastIdx = 0;
  let match;
  while ((match = xmlReplacer.exec(str)) !== null) {
    const i = match.index;
    const char = str.charCodeAt(i);
    const next = xmlCodeMap.get(char);
    if (next !== void 0) {
      ret += str.substring(lastIdx, i) + next;
      lastIdx = i + 1;
    } else {
      ret += `${str.substring(lastIdx, i)}&#x${getCodePoint(str, i).toString(16)};`;
      lastIdx = xmlReplacer.lastIndex += Number((char & 64512) === 55296);
    }
  }
  return ret + str.substr(lastIdx);
}
function getEscaper(regex, map) {
  return function escape3(data) {
    let match;
    let lastIdx = 0;
    let result = "";
    while (match = regex.exec(data)) {
      if (lastIdx !== match.index) {
        result += data.substring(lastIdx, match.index);
      }
      result += map.get(match[0].charCodeAt(0));
      lastIdx = match.index + 1;
    }
    return result + data.substring(lastIdx);
  };
}
var escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
var escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [160, "&nbsp;"]
]));
var escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
  [38, "&amp;"],
  [60, "&lt;"],
  [62, "&gt;"],
  [160, "&nbsp;"]
]));

// node_modules/entities/lib/esm/index.js
var EntityLevel;
(function(EntityLevel2) {
  EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
  EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
var EncodingMode;
(function(EncodingMode2) {
  EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
  EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
  EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
  EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
  EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));

// node_modules/dom-serializer/lib/esm/foreignNames.js
var elementNames = new Map([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "textPath"
].map((val) => [val.toLowerCase(), val]));
var attributeNames = new Map([
  "definitionURL",
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map((val) => [val.toLowerCase(), val]));

// node_modules/dom-serializer/lib/esm/index.js
var unencodedElements = /* @__PURE__ */ new Set([
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
]);
function replaceQuotes(value) {
  return value.replace(/"/g, "&quot;");
}
function formatAttributes(attributes2, opts) {
  var _a3;
  if (!attributes2)
    return;
  const encode = ((_a3 = opts.encodeEntities) !== null && _a3 !== void 0 ? _a3 : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML : escapeAttribute;
  return Object.keys(attributes2).map((key2) => {
    var _a4, _b;
    const value = (_a4 = attributes2[key2]) !== null && _a4 !== void 0 ? _a4 : "";
    if (opts.xmlMode === "foreign") {
      key2 = (_b = attributeNames.get(key2)) !== null && _b !== void 0 ? _b : key2;
    }
    if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
      return key2;
    }
    return `${key2}="${encode(value)}"`;
  }).join(" ");
}
var singleTag = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function render(node, options = {}) {
  const nodes = "length" in node ? node : [node];
  let output = "";
  for (let i = 0; i < nodes.length; i++) {
    output += renderNode(nodes[i], options);
  }
  return output;
}
var esm_default = render;
function renderNode(node, options) {
  switch (node.type) {
    case Root:
      return render(node.children, options);
    // @ts-expect-error We don't use `Doctype` yet
    case Doctype:
    case Directive:
      return renderDirective(node);
    case Comment:
      return renderComment(node);
    case CDATA:
      return renderCdata(node);
    case Script:
    case Style:
    case Tag:
      return renderTag(node, options);
    case Text:
      return renderText(node, options);
  }
}
var foreignModeIntegrationPoints = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignObject",
  "desc",
  "title"
]);
var foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
function renderTag(elem, opts) {
  var _a3;
  if (opts.xmlMode === "foreign") {
    elem.name = (_a3 = elementNames.get(elem.name)) !== null && _a3 !== void 0 ? _a3 : elem.name;
    if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
      opts = { ...opts, xmlMode: false };
    }
  }
  if (!opts.xmlMode && foreignElements.has(elem.name)) {
    opts = { ...opts, xmlMode: "foreign" };
  }
  let tag = `<${elem.name}`;
  const attribs = formatAttributes(elem.attribs, opts);
  if (attribs) {
    tag += ` ${attribs}`;
  }
  if (elem.children.length === 0 && (opts.xmlMode ? (
    // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
    opts.selfClosingTags !== false
  ) : (
    // User explicitly asked for self-closing tags, even in HTML mode
    opts.selfClosingTags && singleTag.has(elem.name)
  ))) {
    if (!opts.xmlMode)
      tag += " ";
    tag += "/>";
  } else {
    tag += ">";
    if (elem.children.length > 0) {
      tag += render(elem.children, opts);
    }
    if (opts.xmlMode || !singleTag.has(elem.name)) {
      tag += `</${elem.name}>`;
    }
  }
  return tag;
}
function renderDirective(elem) {
  return `<${elem.data}>`;
}
function renderText(elem, opts) {
  var _a3;
  let data = elem.data || "";
  if (((_a3 = opts.encodeEntities) !== null && _a3 !== void 0 ? _a3 : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
    data = opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML(data) : escapeText(data);
  }
  return data;
}
function renderCdata(elem) {
  return `<![CDATA[${elem.children[0].data}]]>`;
}
function renderComment(elem) {
  return `<!--${elem.data}-->`;
}

// node_modules/domutils/lib/esm/stringify.js
function getOuterHTML(node, options) {
  return esm_default(node, options);
}
function getInnerHTML(node, options) {
  return hasChildren(node) ? node.children.map((node2) => getOuterHTML(node2, options)).join("") : "";
}
function getText(node) {
  if (Array.isArray(node))
    return node.map(getText).join("");
  if (isTag2(node))
    return node.name === "br" ? "\n" : getText(node.children);
  if (isCDATA(node))
    return getText(node.children);
  if (isText(node))
    return node.data;
  return "";
}
function textContent(node) {
  if (Array.isArray(node))
    return node.map(textContent).join("");
  if (hasChildren(node) && !isComment(node)) {
    return textContent(node.children);
  }
  if (isText(node))
    return node.data;
  return "";
}
function innerText(node) {
  if (Array.isArray(node))
    return node.map(innerText).join("");
  if (hasChildren(node) && (node.type === ElementType.Tag || isCDATA(node))) {
    return innerText(node.children);
  }
  if (isText(node))
    return node.data;
  return "";
}

// node_modules/domutils/lib/esm/traversal.js
function getChildren(elem) {
  return hasChildren(elem) ? elem.children : [];
}
function getParent(elem) {
  return elem.parent || null;
}
function getSiblings(elem) {
  const parent = getParent(elem);
  if (parent != null)
    return getChildren(parent);
  const siblings = [elem];
  let { prev, next } = elem;
  while (prev != null) {
    siblings.unshift(prev);
    ({ prev } = prev);
  }
  while (next != null) {
    siblings.push(next);
    ({ next } = next);
  }
  return siblings;
}
function getAttributeValue(elem, name) {
  var _a3;
  return (_a3 = elem.attribs) === null || _a3 === void 0 ? void 0 : _a3[name];
}
function hasAttrib(elem, name) {
  return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
}
function getName(elem) {
  return elem.name;
}
function nextElementSibling(elem) {
  let { next } = elem;
  while (next !== null && !isTag2(next))
    ({ next } = next);
  return next;
}
function prevElementSibling(elem) {
  let { prev } = elem;
  while (prev !== null && !isTag2(prev))
    ({ prev } = prev);
  return prev;
}

// node_modules/domutils/lib/esm/manipulation.js
function removeElement(elem) {
  if (elem.prev)
    elem.prev.next = elem.next;
  if (elem.next)
    elem.next.prev = elem.prev;
  if (elem.parent) {
    const childs = elem.parent.children;
    const childsIndex = childs.lastIndexOf(elem);
    if (childsIndex >= 0) {
      childs.splice(childsIndex, 1);
    }
  }
  elem.next = null;
  elem.prev = null;
  elem.parent = null;
}
function replaceElement(elem, replacement) {
  const prev = replacement.prev = elem.prev;
  if (prev) {
    prev.next = replacement;
  }
  const next = replacement.next = elem.next;
  if (next) {
    next.prev = replacement;
  }
  const parent = replacement.parent = elem.parent;
  if (parent) {
    const childs = parent.children;
    childs[childs.lastIndexOf(elem)] = replacement;
    elem.parent = null;
  }
}
function appendChild(parent, child) {
  removeElement(child);
  child.next = null;
  child.parent = parent;
  if (parent.children.push(child) > 1) {
    const sibling = parent.children[parent.children.length - 2];
    sibling.next = child;
    child.prev = sibling;
  } else {
    child.prev = null;
  }
}
function append(elem, next) {
  removeElement(next);
  const { parent } = elem;
  const currNext = elem.next;
  next.next = currNext;
  next.prev = elem;
  elem.next = next;
  next.parent = parent;
  if (currNext) {
    currNext.prev = next;
    if (parent) {
      const childs = parent.children;
      childs.splice(childs.lastIndexOf(currNext), 0, next);
    }
  } else if (parent) {
    parent.children.push(next);
  }
}
function prependChild(parent, child) {
  removeElement(child);
  child.parent = parent;
  child.prev = null;
  if (parent.children.unshift(child) !== 1) {
    const sibling = parent.children[1];
    sibling.prev = child;
    child.next = sibling;
  } else {
    child.next = null;
  }
}
function prepend(elem, prev) {
  removeElement(prev);
  const { parent } = elem;
  if (parent) {
    const childs = parent.children;
    childs.splice(childs.indexOf(elem), 0, prev);
  }
  if (elem.prev) {
    elem.prev.next = prev;
  }
  prev.parent = parent;
  prev.prev = elem.prev;
  prev.next = elem;
  elem.prev = prev;
}

// node_modules/domutils/lib/esm/querying.js
function filter(test, node, recurse = true, limit = Infinity) {
  return find(test, Array.isArray(node) ? node : [node], recurse, limit);
}
function find(test, nodes, recurse, limit) {
  const result = [];
  const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (indexStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const elem = nodeStack[0][indexStack[0]++];
    if (test(elem)) {
      result.push(elem);
      if (--limit <= 0)
        return result;
    }
    if (recurse && hasChildren(elem) && elem.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(elem.children);
    }
  }
}
function findOneChild(test, nodes) {
  return nodes.find(test);
}
function findOne(test, nodes, recurse = true) {
  const searchedNodes = Array.isArray(nodes) ? nodes : [nodes];
  for (let i = 0; i < searchedNodes.length; i++) {
    const node = searchedNodes[i];
    if (isTag2(node) && test(node)) {
      return node;
    }
    if (recurse && hasChildren(node) && node.children.length > 0) {
      const found = findOne(test, node.children, true);
      if (found)
        return found;
    }
  }
  return null;
}
function existsOne(test, nodes) {
  return (Array.isArray(nodes) ? nodes : [nodes]).some((node) => isTag2(node) && test(node) || hasChildren(node) && existsOne(test, node.children));
}
function findAll(test, nodes) {
  const result = [];
  const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
  const indexStack = [0];
  for (; ; ) {
    if (indexStack[0] >= nodeStack[0].length) {
      if (nodeStack.length === 1) {
        return result;
      }
      nodeStack.shift();
      indexStack.shift();
      continue;
    }
    const elem = nodeStack[0][indexStack[0]++];
    if (isTag2(elem) && test(elem))
      result.push(elem);
    if (hasChildren(elem) && elem.children.length > 0) {
      indexStack.unshift(0);
      nodeStack.unshift(elem.children);
    }
  }
}

// node_modules/domutils/lib/esm/legacy.js
var Checks = {
  tag_name(name) {
    if (typeof name === "function") {
      return (elem) => isTag2(elem) && name(elem.name);
    } else if (name === "*") {
      return isTag2;
    }
    return (elem) => isTag2(elem) && elem.name === name;
  },
  tag_type(type) {
    if (typeof type === "function") {
      return (elem) => type(elem.type);
    }
    return (elem) => elem.type === type;
  },
  tag_contains(data) {
    if (typeof data === "function") {
      return (elem) => isText(elem) && data(elem.data);
    }
    return (elem) => isText(elem) && elem.data === data;
  }
};
function getAttribCheck(attrib, value) {
  if (typeof value === "function") {
    return (elem) => isTag2(elem) && value(elem.attribs[attrib]);
  }
  return (elem) => isTag2(elem) && elem.attribs[attrib] === value;
}
function combineFuncs(a, b) {
  return (elem) => a(elem) || b(elem);
}
function compileTest(options) {
  const funcs = Object.keys(options).map((key2) => {
    const value = options[key2];
    return Object.prototype.hasOwnProperty.call(Checks, key2) ? Checks[key2](value) : getAttribCheck(key2, value);
  });
  return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
function testElement(options, node) {
  const test = compileTest(options);
  return test ? test(node) : true;
}
function getElements(options, nodes, recurse, limit = Infinity) {
  const test = compileTest(options);
  return test ? filter(test, nodes, recurse, limit) : [];
}
function getElementById(id, nodes, recurse = true) {
  if (!Array.isArray(nodes))
    nodes = [nodes];
  return findOne(getAttribCheck("id", id), nodes, recurse);
}
function getElementsByTagName(tagName19, nodes, recurse = true, limit = Infinity) {
  return filter(Checks["tag_name"](tagName19), nodes, recurse, limit);
}
function getElementsByClassName(className, nodes, recurse = true, limit = Infinity) {
  return filter(getAttribCheck("class", className), nodes, recurse, limit);
}
function getElementsByTagType(type, nodes, recurse = true, limit = Infinity) {
  return filter(Checks["tag_type"](type), nodes, recurse, limit);
}

// node_modules/domutils/lib/esm/helpers.js
function removeSubsets(nodes) {
  let idx = nodes.length;
  while (--idx >= 0) {
    const node = nodes[idx];
    if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
      nodes.splice(idx, 1);
      continue;
    }
    for (let ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
      if (nodes.includes(ancestor)) {
        nodes.splice(idx, 1);
        break;
      }
    }
  }
  return nodes;
}
var DocumentPosition;
(function(DocumentPosition2) {
  DocumentPosition2[DocumentPosition2["DISCONNECTED"] = 1] = "DISCONNECTED";
  DocumentPosition2[DocumentPosition2["PRECEDING"] = 2] = "PRECEDING";
  DocumentPosition2[DocumentPosition2["FOLLOWING"] = 4] = "FOLLOWING";
  DocumentPosition2[DocumentPosition2["CONTAINS"] = 8] = "CONTAINS";
  DocumentPosition2[DocumentPosition2["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition || (DocumentPosition = {}));
function compareDocumentPosition(nodeA, nodeB) {
  const aParents = [];
  const bParents = [];
  if (nodeA === nodeB) {
    return 0;
  }
  let current = hasChildren(nodeA) ? nodeA : nodeA.parent;
  while (current) {
    aParents.unshift(current);
    current = current.parent;
  }
  current = hasChildren(nodeB) ? nodeB : nodeB.parent;
  while (current) {
    bParents.unshift(current);
    current = current.parent;
  }
  const maxIdx = Math.min(aParents.length, bParents.length);
  let idx = 0;
  while (idx < maxIdx && aParents[idx] === bParents[idx]) {
    idx++;
  }
  if (idx === 0) {
    return DocumentPosition.DISCONNECTED;
  }
  const sharedParent = aParents[idx - 1];
  const siblings = sharedParent.children;
  const aSibling = aParents[idx];
  const bSibling = bParents[idx];
  if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
    if (sharedParent === nodeB) {
      return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
    }
    return DocumentPosition.FOLLOWING;
  }
  if (sharedParent === nodeA) {
    return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
  }
  return DocumentPosition.PRECEDING;
}
function uniqueSort(nodes) {
  nodes = nodes.filter((node, i, arr) => !arr.includes(node, i + 1));
  nodes.sort((a, b) => {
    const relative = compareDocumentPosition(a, b);
    if (relative & DocumentPosition.PRECEDING) {
      return -1;
    } else if (relative & DocumentPosition.FOLLOWING) {
      return 1;
    }
    return 0;
  });
  return nodes;
}

// node_modules/domutils/lib/esm/feeds.js
function getFeed(doc) {
  const feedRoot = getOneElement(isValidFeed, doc);
  return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
}
function getAtomFeed(feedRoot) {
  var _a3;
  const childs = feedRoot.children;
  const feed = {
    type: "atom",
    items: getElementsByTagName("entry", childs).map((item) => {
      var _a4;
      const { children } = item;
      const entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "id", children);
      addConditionally(entry, "title", "title", children);
      const href2 = (_a4 = getOneElement("link", children)) === null || _a4 === void 0 ? void 0 : _a4.attribs["href"];
      if (href2) {
        entry.link = href2;
      }
      const description = fetch("summary", children) || fetch("content", children);
      if (description) {
        entry.description = description;
      }
      const pubDate = fetch("updated", children);
      if (pubDate) {
        entry.pubDate = new Date(pubDate);
      }
      return entry;
    })
  };
  addConditionally(feed, "id", "id", childs);
  addConditionally(feed, "title", "title", childs);
  const href = (_a3 = getOneElement("link", childs)) === null || _a3 === void 0 ? void 0 : _a3.attribs["href"];
  if (href) {
    feed.link = href;
  }
  addConditionally(feed, "description", "subtitle", childs);
  const updated = fetch("updated", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "email", childs, true);
  return feed;
}
function getRssFeed(feedRoot) {
  var _a3, _b;
  const childs = (_b = (_a3 = getOneElement("channel", feedRoot.children)) === null || _a3 === void 0 ? void 0 : _a3.children) !== null && _b !== void 0 ? _b : [];
  const feed = {
    type: feedRoot.name.substr(0, 3),
    id: "",
    items: getElementsByTagName("item", feedRoot.children).map((item) => {
      const { children } = item;
      const entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "guid", children);
      addConditionally(entry, "title", "title", children);
      addConditionally(entry, "link", "link", children);
      addConditionally(entry, "description", "description", children);
      const pubDate = fetch("pubDate", children) || fetch("dc:date", children);
      if (pubDate)
        entry.pubDate = new Date(pubDate);
      return entry;
    })
  };
  addConditionally(feed, "title", "title", childs);
  addConditionally(feed, "link", "link", childs);
  addConditionally(feed, "description", "description", childs);
  const updated = fetch("lastBuildDate", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "managingEditor", childs, true);
  return feed;
}
var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = [
  "fileSize",
  "bitrate",
  "framerate",
  "samplingrate",
  "channels",
  "duration",
  "height",
  "width"
];
function getMediaElements(where) {
  return getElementsByTagName("media:content", where).map((elem) => {
    const { attribs } = elem;
    const media = {
      medium: attribs["medium"],
      isDefault: !!attribs["isDefault"]
    };
    for (const attrib of MEDIA_KEYS_STRING) {
      if (attribs[attrib]) {
        media[attrib] = attribs[attrib];
      }
    }
    for (const attrib of MEDIA_KEYS_INT) {
      if (attribs[attrib]) {
        media[attrib] = parseInt(attribs[attrib], 10);
      }
    }
    if (attribs["expression"]) {
      media.expression = attribs["expression"];
    }
    return media;
  });
}
function getOneElement(tagName19, node) {
  return getElementsByTagName(tagName19, node, true, 1)[0];
}
function fetch(tagName19, where, recurse = false) {
  return textContent(getElementsByTagName(tagName19, where, recurse, 1)).trim();
}
function addConditionally(obj, prop2, tagName19, where, recurse = false) {
  const val = fetch(tagName19, where, recurse);
  if (val)
    obj[prop2] = val;
}
function isValidFeed(value) {
  return value === "rss" || value === "feed" || value === "rdf:RDF";
}

// node_modules/htmlparser2/dist/esm/index.js
function parseDocument(data, options) {
  const handler4 = new DomHandler(void 0, options);
  new Parser(handler4, options).end(data);
  return handler4.root;
}
function parseDOM(data, options) {
  return parseDocument(data, options).children;
}
function createDocumentStream(callback, options, elementCallback) {
  const handler4 = new DomHandler((error) => callback(error, handler4.root), options, elementCallback);
  return new Parser(handler4, options);
}
function createDomStream(callback, options, elementCallback) {
  const handler4 = new DomHandler(callback, options, elementCallback);
  return new Parser(handler4, options);
}
var parseFeedDefaultOptions = { xmlMode: true };
function parseFeed(feed, options = parseFeedDefaultOptions) {
  return getFeed(parseDOM(feed, options));
}

// node_modules/linkedom/esm/shared/constants.js
var NODE_END = -1;
var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var CDATA_SECTION_NODE = 4;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = 11;
var BLOCK_ELEMENTS = /* @__PURE__ */ new Set(["ARTICLE", "ASIDE", "BLOCKQUOTE", "BODY", "BR", "BUTTON", "CANVAS", "CAPTION", "COL", "COLGROUP", "DD", "DIV", "DL", "DT", "EMBED", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "UL", "OL", "P"]);
var SHOW_ALL = -1;
var SHOW_ELEMENT = 1;
var SHOW_TEXT = 4;
var SHOW_CDATA_SECTION = 8;
var SHOW_COMMENT = 128;
var DOCUMENT_POSITION_DISCONNECTED = 1;
var DOCUMENT_POSITION_PRECEDING = 2;
var DOCUMENT_POSITION_FOLLOWING = 4;
var DOCUMENT_POSITION_CONTAINS = 8;
var DOCUMENT_POSITION_CONTAINED_BY = 16;
var DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// node_modules/linkedom/esm/shared/object.js
var {
  assign,
  create,
  defineProperties,
  entries,
  getOwnPropertyDescriptors,
  keys,
  setPrototypeOf
} = Object;

// node_modules/linkedom/esm/shared/utils.js
var $String = String;
var getEnd = (node) => node.nodeType === ELEMENT_NODE ? node[END] : node;
var ignoreCase = ({ ownerDocument }) => ownerDocument[MIME].ignoreCase;
var knownAdjacent = (prev, next) => {
  prev[NEXT] = next;
  next[PREV] = prev;
};
var knownBoundaries = (prev, current, next) => {
  knownAdjacent(prev, current);
  knownAdjacent(getEnd(current), next);
};
var knownSegment = (prev, start, end, next) => {
  knownAdjacent(prev, start);
  knownAdjacent(getEnd(end), next);
};
var knownSiblings = (prev, current, next) => {
  knownAdjacent(prev, current);
  knownAdjacent(current, next);
};
var localCase = ({ localName, ownerDocument }) => {
  return ownerDocument[MIME].ignoreCase ? localName.toUpperCase() : localName;
};
var setAdjacent = (prev, next) => {
  if (prev)
    prev[NEXT] = next;
  if (next)
    next[PREV] = prev;
};
var htmlToFragment = (ownerDocument, html) => {
  const fragment = ownerDocument.createDocumentFragment();
  const elem = ownerDocument.createElement("");
  elem.innerHTML = html;
  const { firstChild, lastChild } = elem;
  if (firstChild) {
    knownSegment(fragment, firstChild, lastChild, fragment[END]);
    let child = firstChild;
    do {
      child.parentNode = fragment;
    } while (child !== lastChild && (child = getEnd(child)[NEXT]));
  }
  return fragment;
};

// node_modules/linkedom/esm/shared/shadow-roots.js
var shadowRoots = /* @__PURE__ */ new WeakMap();

// node_modules/linkedom/esm/interface/custom-element-registry.js
var reactive = false;
var Classes = /* @__PURE__ */ new WeakMap();
var customElements = /* @__PURE__ */ new WeakMap();
var attributeChangedCallback = (element, attributeName, oldValue, newValue) => {
  if (reactive && customElements.has(element) && element.attributeChangedCallback && element.constructor.observedAttributes.includes(attributeName)) {
    element.attributeChangedCallback(attributeName, oldValue, newValue);
  }
};
var createTrigger = (method, isConnected2) => (element) => {
  if (customElements.has(element)) {
    const info = customElements.get(element);
    if (info.connected !== isConnected2 && element.isConnected === isConnected2) {
      info.connected = isConnected2;
      if (method in element)
        element[method]();
    }
  }
};
var triggerConnected = createTrigger("connectedCallback", true);
var connectedCallback = (element) => {
  if (reactive) {
    triggerConnected(element);
    if (shadowRoots.has(element))
      element = shadowRoots.get(element).shadowRoot;
    let { [NEXT]: next, [END]: end } = element;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE)
        triggerConnected(next);
      next = next[NEXT];
    }
  }
};
var triggerDisconnected = createTrigger("disconnectedCallback", false);
var disconnectedCallback = (element) => {
  if (reactive) {
    triggerDisconnected(element);
    if (shadowRoots.has(element))
      element = shadowRoots.get(element).shadowRoot;
    let { [NEXT]: next, [END]: end } = element;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE)
        triggerDisconnected(next);
      next = next[NEXT];
    }
  }
};
var CustomElementRegistry = class {
  /**
   * @param {Document} ownerDocument
   */
  constructor(ownerDocument) {
    this.ownerDocument = ownerDocument;
    this.registry = /* @__PURE__ */ new Map();
    this.waiting = /* @__PURE__ */ new Map();
    this.active = false;
  }
  /**
   * @param {string} localName the custom element definition name
   * @param {Function} Class the custom element **Class** definition
   * @param {object?} options the optional object with an `extends` property
   */
  define(localName, Class, options = {}) {
    const { ownerDocument, registry, waiting } = this;
    if (registry.has(localName))
      throw new Error("unable to redefine " + localName);
    if (Classes.has(Class))
      throw new Error("unable to redefine the same class: " + Class);
    this.active = reactive = true;
    const { extends: extend } = options;
    Classes.set(Class, {
      ownerDocument,
      options: { is: extend ? localName : "" },
      localName: extend || localName
    });
    const check = extend ? (element) => {
      return element.localName === extend && element.getAttribute("is") === localName;
    } : (element) => element.localName === localName;
    registry.set(localName, { Class, check });
    if (waiting.has(localName)) {
      for (const resolve of waiting.get(localName))
        resolve(Class);
      waiting.delete(localName);
    }
    ownerDocument.querySelectorAll(
      extend ? `${extend}[is="${localName}"]` : localName
    ).forEach(this.upgrade, this);
  }
  /**
   * @param {Element} element
   */
  upgrade(element) {
    if (customElements.has(element))
      return;
    const { ownerDocument, registry } = this;
    const ce = element.getAttribute("is") || element.localName;
    if (registry.has(ce)) {
      const { Class, check } = registry.get(ce);
      if (check(element)) {
        const { attributes: attributes2, isConnected: isConnected2 } = element;
        for (const attr of attributes2)
          element.removeAttributeNode(attr);
        const values = entries(element);
        for (const [key2] of values)
          delete element[key2];
        setPrototypeOf(element, Class.prototype);
        ownerDocument[UPGRADE] = { element, values };
        new Class(ownerDocument, ce);
        customElements.set(element, { connected: isConnected2 });
        for (const attr of attributes2)
          element.setAttributeNode(attr);
        if (isConnected2 && element.connectedCallback)
          element.connectedCallback();
      }
    }
  }
  /**
   * @param {string} localName the custom element definition name
   */
  whenDefined(localName) {
    const { registry, waiting } = this;
    return new Promise((resolve) => {
      if (registry.has(localName))
        resolve(registry.get(localName).Class);
      else {
        if (!waiting.has(localName))
          waiting.set(localName, []);
        waiting.get(localName).push(resolve);
      }
    });
  }
  /**
   * @param {string} localName the custom element definition name
   * @returns {Function?} the custom element **Class**, if any
   */
  get(localName) {
    const info = this.registry.get(localName);
    return info && info.Class;
  }
  /**
   * @param {Function} Class **Class** of custom element
   * @returns {string?} found tag name or null
   */
  getName(Class) {
    if (Classes.has(Class)) {
      const { localName } = Classes.get(Class);
      return localName;
    }
    return null;
  }
};

// node_modules/linkedom/esm/shared/parse-from-string.js
var { Parser: Parser2 } = esm_exports3;
var notParsing = true;
var append2 = (self2, node, active) => {
  const end = self2[END];
  node.parentNode = self2;
  knownBoundaries(end[PREV], node, end);
  if (active && node.nodeType === ELEMENT_NODE)
    connectedCallback(node);
  return node;
};
var attribute = (element, end, attribute2, value, active) => {
  attribute2[VALUE] = value;
  attribute2.ownerElement = element;
  knownSiblings(end[PREV], attribute2, end);
  if (attribute2.name === "class")
    element.className = value;
  if (active)
    attributeChangedCallback(element, attribute2.name, null, value);
};
var parseFromString = (document2, isHTML, markupLanguage) => {
  const { active, registry } = document2[CUSTOM_ELEMENTS];
  let node = document2;
  let ownerSVGElement = null;
  let parsingCData = false;
  notParsing = false;
  const content = new Parser2({
    // <!DOCTYPE ...>
    onprocessinginstruction(name, data) {
      if (name.toLowerCase() === "!doctype")
        document2.doctype = data.slice(name.length).trim();
    },
    // <tagName>
    onopentag(name, attributes2) {
      let create3 = true;
      if (isHTML) {
        if (ownerSVGElement) {
          node = append2(node, document2.createElementNS(SVG_NAMESPACE, name), active);
          node.ownerSVGElement = ownerSVGElement;
          create3 = false;
        } else if (name === "svg" || name === "SVG") {
          ownerSVGElement = document2.createElementNS(SVG_NAMESPACE, name);
          node = append2(node, ownerSVGElement, active);
          create3 = false;
        } else if (active) {
          const ce = name.includes("-") ? name : attributes2.is || "";
          if (ce && registry.has(ce)) {
            const { Class } = registry.get(ce);
            node = append2(node, new Class(), active);
            delete attributes2.is;
            create3 = false;
          }
        }
      }
      if (create3)
        node = append2(node, document2.createElement(name), false);
      let end = node[END];
      for (const name2 of keys(attributes2))
        attribute(node, end, document2.createAttribute(name2), attributes2[name2], active);
    },
    // #text, #comment
    oncomment(data) {
      append2(node, document2.createComment(data), active);
    },
    ontext(text) {
      if (parsingCData) {
        append2(node, document2.createCDATASection(text), active);
      } else {
        append2(node, document2.createTextNode(text), active);
      }
    },
    // #cdata
    oncdatastart() {
      parsingCData = true;
    },
    oncdataend() {
      parsingCData = false;
    },
    // </tagName>
    onclosetag() {
      if (isHTML && node === ownerSVGElement)
        ownerSVGElement = null;
      node = node.parentNode;
    }
  }, {
    lowerCaseAttributeNames: false,
    decodeEntities: true,
    xmlMode: !isHTML
  });
  content.write(markupLanguage);
  content.end();
  notParsing = true;
  return document2;
};

// node_modules/linkedom/esm/shared/register-html-class.js
var htmlClasses = /* @__PURE__ */ new Map();
var registerHTMLClass = (names, Class) => {
  for (const name of [].concat(names)) {
    htmlClasses.set(name, Class);
    htmlClasses.set(name.toUpperCase(), Class);
  }
};

// node_modules/linkedom/esm/shared/jsdon.js
var loopSegment = ({ [NEXT]: next, [END]: end }, json) => {
  while (next !== end) {
    switch (next.nodeType) {
      case ATTRIBUTE_NODE:
        attrAsJSON(next, json);
        break;
      case TEXT_NODE:
      case COMMENT_NODE:
      case CDATA_SECTION_NODE:
        characterDataAsJSON(next, json);
        break;
      case ELEMENT_NODE:
        elementAsJSON(next, json);
        next = getEnd(next);
        break;
      case DOCUMENT_TYPE_NODE:
        documentTypeAsJSON(next, json);
        break;
    }
    next = next[NEXT];
  }
  const last = json.length - 1;
  const value = json[last];
  if (typeof value === "number" && value < 0)
    json[last] += NODE_END;
  else
    json.push(NODE_END);
};
var attrAsJSON = (attr, json) => {
  json.push(ATTRIBUTE_NODE, attr.name);
  const value = attr[VALUE].trim();
  if (value)
    json.push(value);
};
var characterDataAsJSON = (node, json) => {
  const value = node[VALUE];
  if (value.trim())
    json.push(node.nodeType, value);
};
var nonElementAsJSON = (node, json) => {
  json.push(node.nodeType);
  loopSegment(node, json);
};
var documentTypeAsJSON = ({ name, publicId, systemId }, json) => {
  json.push(DOCUMENT_TYPE_NODE, name);
  if (publicId)
    json.push(publicId);
  if (systemId)
    json.push(systemId);
};
var elementAsJSON = (element, json) => {
  json.push(ELEMENT_NODE, element.localName);
  loopSegment(element, json);
};

// node_modules/linkedom/esm/interface/mutation-observer.js
var createRecord = (type, target, element, addedNodes, removedNodes, attributeName, oldValue) => ({
  type,
  target,
  addedNodes,
  removedNodes,
  attributeName,
  oldValue,
  previousSibling: element?.previousSibling || null,
  nextSibling: element?.nextSibling || null
});
var queueAttribute = (observer, target, attributeName, attributeFilter, attributeOldValue, oldValue) => {
  if (!attributeFilter || attributeFilter.includes(attributeName)) {
    const { callback, records, scheduled } = observer;
    records.push(createRecord(
      "attributes",
      target,
      null,
      [],
      [],
      attributeName,
      attributeOldValue ? oldValue : void 0
    ));
    if (!scheduled) {
      observer.scheduled = true;
      Promise.resolve().then(() => {
        observer.scheduled = false;
        callback(records.splice(0), observer);
      });
    }
  }
};
var attributeChangedCallback2 = (element, attributeName, oldValue) => {
  const { ownerDocument } = element;
  const { active, observers } = ownerDocument[MUTATION_OBSERVER];
  if (active) {
    for (const observer of observers) {
      for (const [
        target,
        {
          childList,
          subtree,
          attributes: attributes2,
          attributeFilter,
          attributeOldValue
        }
      ] of observer.nodes) {
        if (childList) {
          if (subtree && (target === ownerDocument || target.contains(element)) || !subtree && target.children.includes(element)) {
            queueAttribute(
              observer,
              element,
              attributeName,
              attributeFilter,
              attributeOldValue,
              oldValue
            );
            break;
          }
        } else if (attributes2 && target === element) {
          queueAttribute(
            observer,
            element,
            attributeName,
            attributeFilter,
            attributeOldValue,
            oldValue
          );
          break;
        }
      }
    }
  }
};
var moCallback = (element, parentNode) => {
  const { ownerDocument } = element;
  const { active, observers } = ownerDocument[MUTATION_OBSERVER];
  if (active) {
    for (const observer of observers) {
      for (const [target, { subtree, childList, characterData }] of observer.nodes) {
        if (childList) {
          if (parentNode && (target === parentNode || /* c8 ignore next */
          subtree && target.contains(parentNode)) || !parentNode && (subtree && (target === ownerDocument || /* c8 ignore next */
          target.contains(element)) || !subtree && target[characterData ? "childNodes" : "children"].includes(element))) {
            const { callback, records, scheduled } = observer;
            records.push(createRecord(
              "childList",
              target,
              element,
              parentNode ? [] : [element],
              parentNode ? [element] : []
            ));
            if (!scheduled) {
              observer.scheduled = true;
              Promise.resolve().then(() => {
                observer.scheduled = false;
                callback(records.splice(0), observer);
              });
            }
            break;
          }
        }
      }
    }
  }
};
var MutationObserverClass = class {
  constructor(ownerDocument) {
    const observers = /* @__PURE__ */ new Set();
    this.observers = observers;
    this.active = false;
    this.class = class MutationObserver {
      constructor(callback) {
        this.callback = callback;
        this.nodes = /* @__PURE__ */ new Map();
        this.records = [];
        this.scheduled = false;
      }
      disconnect() {
        this.records.splice(0);
        this.nodes.clear();
        observers.delete(this);
        ownerDocument[MUTATION_OBSERVER].active = !!observers.size;
      }
      /**
       * @param {Element} target
       * @param {MutationObserverInit} options
       */
      observe(target, options = {
        subtree: false,
        childList: false,
        attributes: false,
        attributeFilter: null,
        attributeOldValue: false,
        characterData: false
        // TODO: not implemented yet
        // characterDataOldValue: false
      }) {
        if ("attributeOldValue" in options || "attributeFilter" in options)
          options.attributes = true;
        options.childList = !!options.childList;
        options.subtree = !!options.subtree;
        this.nodes.set(target, options);
        observers.add(this);
        ownerDocument[MUTATION_OBSERVER].active = true;
      }
      /**
       * @returns {MutationRecord[]}
       */
      takeRecords() {
        return this.records.splice(0);
      }
    };
  }
};

// node_modules/linkedom/esm/shared/attributes.js
var emptyAttributes = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "class",
  "contenteditable",
  "controls",
  "default",
  "defer",
  "disabled",
  "draggable",
  "formnovalidate",
  "hidden",
  "id",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "style",
  "truespeed"
]);
var setAttribute = (element, attribute2) => {
  const { [VALUE]: value, name } = attribute2;
  attribute2.ownerElement = element;
  knownSiblings(element, attribute2, element[NEXT]);
  if (name === "class")
    element.className = value;
  attributeChangedCallback2(element, name, null);
  attributeChangedCallback(element, name, null, value);
};
var removeAttribute = (element, attribute2) => {
  const { [VALUE]: value, name } = attribute2;
  knownAdjacent(attribute2[PREV], attribute2[NEXT]);
  attribute2.ownerElement = attribute2[PREV] = attribute2[NEXT] = null;
  if (name === "class")
    element[CLASS_LIST] = null;
  attributeChangedCallback2(element, name, value);
  attributeChangedCallback(element, name, value, null);
};
var booleanAttribute = {
  get(element, name) {
    return element.hasAttribute(name);
  },
  set(element, name, value) {
    if (value)
      element.setAttribute(name, "");
    else
      element.removeAttribute(name);
  }
};
var numericAttribute = {
  get(element, name) {
    return parseFloat(element.getAttribute(name) || 0);
  },
  set(element, name, value) {
    element.setAttribute(name, value);
  }
};
var stringAttribute = {
  get(element, name) {
    return element.getAttribute(name) || "";
  },
  set(element, name, value) {
    element.setAttribute(name, value);
  }
};

// node_modules/linkedom/esm/interface/event-target.js
var wm = /* @__PURE__ */ new WeakMap();
function dispatch(event, listener) {
  if (typeof listener === "function")
    listener.call(event.target, event);
  else
    listener.handleEvent(event);
  return event._stopImmediatePropagationFlag;
}
function invokeListeners({ currentTarget, target }) {
  const map = wm.get(currentTarget);
  if (map && map.has(this.type)) {
    const listeners = map.get(this.type);
    if (currentTarget === target) {
      this.eventPhase = this.AT_TARGET;
    } else {
      this.eventPhase = this.BUBBLING_PHASE;
    }
    this.currentTarget = currentTarget;
    this.target = target;
    for (const [listener, options] of listeners) {
      if (options && options.once)
        listeners.delete(listener);
      if (dispatch(this, listener))
        break;
    }
    delete this.currentTarget;
    delete this.target;
    return this.cancelBubble;
  }
}
var DOMEventTarget = class {
  constructor() {
    wm.set(this, /* @__PURE__ */ new Map());
  }
  /**
   * @protected
   */
  _getParent() {
    return null;
  }
  addEventListener(type, listener, options) {
    const map = wm.get(this);
    if (!map.has(type))
      map.set(type, /* @__PURE__ */ new Map());
    map.get(type).set(listener, options);
  }
  removeEventListener(type, listener) {
    const map = wm.get(this);
    if (map.has(type)) {
      const listeners = map.get(type);
      if (listeners.delete(listener) && !listeners.size)
        map.delete(type);
    }
  }
  dispatchEvent(event) {
    let node = this;
    event.eventPhase = event.CAPTURING_PHASE;
    while (node) {
      if (node.dispatchEvent)
        event._path.push({ currentTarget: node, target: this });
      node = event.bubbles && node._getParent && node._getParent();
    }
    event._path.some(invokeListeners, event);
    event._path = [];
    event.eventPhase = event.NONE;
    return !event.defaultPrevented;
  }
};

// node_modules/linkedom/esm/interface/node-list.js
var NodeList = class extends Array {
  item(i) {
    return i < this.length ? this[i] : null;
  }
};

// node_modules/linkedom/esm/interface/node.js
var getParentNodeCount = ({ parentNode }) => {
  let count = 0;
  while (parentNode) {
    count++;
    parentNode = parentNode.parentNode;
  }
  return count;
};
var Node2 = class extends DOMEventTarget {
  static get ELEMENT_NODE() {
    return ELEMENT_NODE;
  }
  static get ATTRIBUTE_NODE() {
    return ATTRIBUTE_NODE;
  }
  static get TEXT_NODE() {
    return TEXT_NODE;
  }
  static get CDATA_SECTION_NODE() {
    return CDATA_SECTION_NODE;
  }
  static get COMMENT_NODE() {
    return COMMENT_NODE;
  }
  static get DOCUMENT_NODE() {
    return DOCUMENT_NODE;
  }
  static get DOCUMENT_FRAGMENT_NODE() {
    return DOCUMENT_FRAGMENT_NODE;
  }
  static get DOCUMENT_TYPE_NODE() {
    return DOCUMENT_TYPE_NODE;
  }
  constructor(ownerDocument, localName, nodeType) {
    super();
    this.ownerDocument = ownerDocument;
    this.localName = localName;
    this.nodeType = nodeType;
    this.parentNode = null;
    this[NEXT] = null;
    this[PREV] = null;
  }
  get ELEMENT_NODE() {
    return ELEMENT_NODE;
  }
  get ATTRIBUTE_NODE() {
    return ATTRIBUTE_NODE;
  }
  get TEXT_NODE() {
    return TEXT_NODE;
  }
  get CDATA_SECTION_NODE() {
    return CDATA_SECTION_NODE;
  }
  get COMMENT_NODE() {
    return COMMENT_NODE;
  }
  get DOCUMENT_NODE() {
    return DOCUMENT_NODE;
  }
  get DOCUMENT_FRAGMENT_NODE() {
    return DOCUMENT_FRAGMENT_NODE;
  }
  get DOCUMENT_TYPE_NODE() {
    return DOCUMENT_TYPE_NODE;
  }
  get baseURI() {
    const ownerDocument = this.nodeType === DOCUMENT_NODE ? this : this.ownerDocument;
    if (ownerDocument) {
      const base = ownerDocument.querySelector("base");
      if (base)
        return base.getAttribute("href");
      const { location } = ownerDocument.defaultView;
      if (location)
        return location.href;
    }
    return null;
  }
  /* c8 ignore start */
  // mixin: node
  get isConnected() {
    return false;
  }
  get nodeName() {
    return this.localName;
  }
  get parentElement() {
    return null;
  }
  get previousSibling() {
    return null;
  }
  get previousElementSibling() {
    return null;
  }
  get nextSibling() {
    return null;
  }
  get nextElementSibling() {
    return null;
  }
  get childNodes() {
    return new NodeList();
  }
  get firstChild() {
    return null;
  }
  get lastChild() {
    return null;
  }
  // default values
  get nodeValue() {
    return null;
  }
  set nodeValue(value) {
  }
  get textContent() {
    return null;
  }
  set textContent(value) {
  }
  normalize() {
  }
  cloneNode() {
    return null;
  }
  contains() {
    return false;
  }
  /**
   * Inserts a node before a reference node as a child of this parent node.
   * @param {Node} newNode The node to be inserted.
   * @param {Node} referenceNode The node before which newNode is inserted. If this is null, then newNode is inserted at the end of node's child nodes.
   * @returns The added child
   */
  // eslint-disable-next-line no-unused-vars
  insertBefore(newNode, referenceNode) {
    return newNode;
  }
  /**
   * Adds a node to the end of the list of children of this node.
   * @param {Node} child The node to append to the given parent node.
   * @returns The appended child.
   */
  appendChild(child) {
    return child;
  }
  /**
   * Replaces a child node within this node
   * @param {Node} newChild The new node to replace oldChild.
   * @param {Node} oldChild The child to be replaced.
   * @returns The replaced Node. This is the same node as oldChild.
   */
  replaceChild(newChild, oldChild) {
    return oldChild;
  }
  /**
   * Removes a child node from the DOM.
   * @param {Node} child A Node that is the child node to be removed from the DOM.
   * @returns The removed node.
   */
  removeChild(child) {
    return child;
  }
  toString() {
    return "";
  }
  /* c8 ignore stop */
  hasChildNodes() {
    return !!this.lastChild;
  }
  isSameNode(node) {
    return this === node;
  }
  // TODO: attributes?
  compareDocumentPosition(target) {
    let result = 0;
    if (this !== target) {
      let self2 = getParentNodeCount(this);
      let other = getParentNodeCount(target);
      if (self2 < other) {
        result += DOCUMENT_POSITION_FOLLOWING;
        if (this.contains(target))
          result += DOCUMENT_POSITION_CONTAINED_BY;
      } else if (other < self2) {
        result += DOCUMENT_POSITION_PRECEDING;
        if (target.contains(this))
          result += DOCUMENT_POSITION_CONTAINS;
      } else if (self2 && other) {
        const { childNodes } = this.parentNode;
        if (childNodes.indexOf(this) < childNodes.indexOf(target))
          result += DOCUMENT_POSITION_FOLLOWING;
        else
          result += DOCUMENT_POSITION_PRECEDING;
      }
      if (!self2 || !other) {
        result += DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
        result += DOCUMENT_POSITION_DISCONNECTED;
      }
    }
    return result;
  }
  isEqualNode(node) {
    if (this === node)
      return true;
    if (this.nodeType === node.nodeType) {
      switch (this.nodeType) {
        case DOCUMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE: {
          const aNodes = this.childNodes;
          const bNodes = node.childNodes;
          return aNodes.length === bNodes.length && aNodes.every((node2, i) => node2.isEqualNode(bNodes[i]));
        }
      }
      return this.toString() === node.toString();
    }
    return false;
  }
  /**
   * @protected
   */
  _getParent() {
    return this.parentNode;
  }
  /**
   * Calling it on an element inside a standard web page will return an HTMLDocument object representing the entire page (or <iframe>).
   * Calling it on an element inside a shadow DOM will return the associated ShadowRoot.
   * @return {ShadowRoot | HTMLDocument}
   */
  getRootNode() {
    let root = this;
    while (root.parentNode)
      root = root.parentNode;
    return root;
  }
};

// node_modules/linkedom/esm/shared/text-escaper.js
var { replace } = "";
var ca = /[<>&\xA0]/g;
var esca = {
  "\xA0": "&#160;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
var pe = (m) => esca[m];
var escape2 = (es) => replace.call(es, ca, pe);

// node_modules/linkedom/esm/interface/attr.js
var QUOTE = /"/g;
var Attr = class _Attr extends Node2 {
  constructor(ownerDocument, name, value = "") {
    super(ownerDocument, name, ATTRIBUTE_NODE);
    this.ownerElement = null;
    this.name = $String(name);
    this[VALUE] = $String(value);
    this[CHANGED] = false;
  }
  get value() {
    return this[VALUE];
  }
  set value(newValue) {
    const { [VALUE]: oldValue, name, ownerElement } = this;
    this[VALUE] = $String(newValue);
    this[CHANGED] = true;
    if (ownerElement) {
      attributeChangedCallback2(ownerElement, name, oldValue);
      attributeChangedCallback(ownerElement, name, oldValue, this[VALUE]);
    }
  }
  cloneNode() {
    const { ownerDocument, name, [VALUE]: value } = this;
    return new _Attr(ownerDocument, name, value);
  }
  toString() {
    const { name, [VALUE]: value } = this;
    if (emptyAttributes.has(name) && !value) {
      return ignoreCase(this) ? name : `${name}=""`;
    }
    const escapedValue = (ignoreCase(this) ? value : escape2(value)).replace(QUOTE, "&quot;");
    return `${name}="${escapedValue}"`;
  }
  toJSON() {
    const json = [];
    attrAsJSON(this, json);
    return json;
  }
};

// node_modules/linkedom/esm/shared/node.js
var isConnected = ({ ownerDocument, parentNode }) => {
  while (parentNode) {
    if (parentNode === ownerDocument)
      return true;
    parentNode = parentNode.parentNode || parentNode.host;
  }
  return false;
};
var parentElement = ({ parentNode }) => {
  if (parentNode) {
    switch (parentNode.nodeType) {
      case DOCUMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        return null;
    }
  }
  return parentNode;
};
var previousSibling = ({ [PREV]: prev }) => {
  switch (prev ? prev.nodeType : 0) {
    case NODE_END:
      return prev[START];
    case TEXT_NODE:
    case COMMENT_NODE:
    case CDATA_SECTION_NODE:
      return prev;
  }
  return null;
};
var nextSibling = (node) => {
  const next = getEnd(node)[NEXT];
  return next && (next.nodeType === NODE_END ? null : next);
};

// node_modules/linkedom/esm/mixin/non-document-type-child-node.js
var nextElementSibling2 = (node) => {
  let next = nextSibling(node);
  while (next && next.nodeType !== ELEMENT_NODE)
    next = nextSibling(next);
  return next;
};
var previousElementSibling = (node) => {
  let prev = previousSibling(node);
  while (prev && prev.nodeType !== ELEMENT_NODE)
    prev = previousSibling(prev);
  return prev;
};

// node_modules/linkedom/esm/mixin/child-node.js
var asFragment = (ownerDocument, nodes) => {
  const fragment = ownerDocument.createDocumentFragment();
  fragment.append(...nodes);
  return fragment;
};
var before = (node, nodes) => {
  const { ownerDocument, parentNode } = node;
  if (parentNode)
    parentNode.insertBefore(
      asFragment(ownerDocument, nodes),
      node
    );
};
var after = (node, nodes) => {
  const { ownerDocument, parentNode } = node;
  if (parentNode)
    parentNode.insertBefore(
      asFragment(ownerDocument, nodes),
      getEnd(node)[NEXT]
    );
};
var replaceWith = (node, nodes) => {
  const { ownerDocument, parentNode } = node;
  if (parentNode) {
    if (nodes.includes(node))
      replaceWith(node, [node = node.cloneNode()]);
    parentNode.insertBefore(
      asFragment(ownerDocument, nodes),
      node
    );
    node.remove();
  }
};
var remove = (prev, current, next) => {
  const { parentNode, nodeType } = current;
  if (prev || next) {
    setAdjacent(prev, next);
    current[PREV] = null;
    getEnd(current)[NEXT] = null;
  }
  if (parentNode) {
    current.parentNode = null;
    moCallback(current, parentNode);
    if (nodeType === ELEMENT_NODE)
      disconnectedCallback(current);
  }
};

// node_modules/linkedom/esm/interface/character-data.js
var CharacterData = class extends Node2 {
  constructor(ownerDocument, localName, nodeType, data) {
    super(ownerDocument, localName, nodeType);
    this[VALUE] = $String(data);
  }
  // <Mixins>
  get isConnected() {
    return isConnected(this);
  }
  get parentElement() {
    return parentElement(this);
  }
  get previousSibling() {
    return previousSibling(this);
  }
  get nextSibling() {
    return nextSibling(this);
  }
  get previousElementSibling() {
    return previousElementSibling(this);
  }
  get nextElementSibling() {
    return nextElementSibling2(this);
  }
  before(...nodes) {
    before(this, nodes);
  }
  after(...nodes) {
    after(this, nodes);
  }
  replaceWith(...nodes) {
    replaceWith(this, nodes);
  }
  remove() {
    remove(this[PREV], this, this[NEXT]);
  }
  // </Mixins>
  // CharacterData only
  /* c8 ignore start */
  get data() {
    return this[VALUE];
  }
  set data(value) {
    this[VALUE] = $String(value);
    moCallback(this, this.parentNode);
  }
  get nodeValue() {
    return this.data;
  }
  set nodeValue(value) {
    this.data = value;
  }
  get textContent() {
    return this.data;
  }
  set textContent(value) {
    this.data = value;
  }
  get length() {
    return this.data.length;
  }
  substringData(offset, count) {
    return this.data.substr(offset, count);
  }
  appendData(data) {
    this.data += data;
  }
  insertData(offset, data) {
    const { data: t } = this;
    this.data = t.slice(0, offset) + data + t.slice(offset);
  }
  deleteData(offset, count) {
    const { data: t } = this;
    this.data = t.slice(0, offset) + t.slice(offset + count);
  }
  replaceData(offset, count, data) {
    const { data: t } = this;
    this.data = t.slice(0, offset) + data + t.slice(offset + count);
  }
  /* c8 ignore stop */
  toJSON() {
    const json = [];
    characterDataAsJSON(this, json);
    return json;
  }
};

// node_modules/linkedom/esm/interface/cdata-section.js
var CDATASection = class _CDATASection extends CharacterData {
  constructor(ownerDocument, data = "") {
    super(ownerDocument, "#cdatasection", CDATA_SECTION_NODE, data);
  }
  cloneNode() {
    const { ownerDocument, [VALUE]: data } = this;
    return new _CDATASection(ownerDocument, data);
  }
  toString() {
    return `<![CDATA[${this[VALUE]}]]>`;
  }
};

// node_modules/linkedom/esm/interface/comment.js
var Comment3 = class _Comment extends CharacterData {
  constructor(ownerDocument, data = "") {
    super(ownerDocument, "#comment", COMMENT_NODE, data);
  }
  cloneNode() {
    const { ownerDocument, [VALUE]: data } = this;
    return new _Comment(ownerDocument, data);
  }
  toString() {
    return `<!--${this[VALUE]}-->`;
  }
};

// node_modules/css-select/lib/esm/index.js
var import_boolbase6 = __toESM(require_boolbase(), 1);

// node_modules/css-select/lib/esm/compile.js
var import_css_what4 = __toESM(require_commonjs(), 1);
var import_boolbase5 = __toESM(require_boolbase(), 1);

// node_modules/css-select/lib/esm/sort.js
var import_css_what = __toESM(require_commonjs(), 1);
var procedure = /* @__PURE__ */ new Map([
  [import_css_what.SelectorType.Universal, 50],
  [import_css_what.SelectorType.Tag, 30],
  [import_css_what.SelectorType.Attribute, 1],
  [import_css_what.SelectorType.Pseudo, 0]
]);
function isTraversal(token) {
  return !procedure.has(token.type);
}
var attributes = /* @__PURE__ */ new Map([
  [import_css_what.AttributeAction.Exists, 10],
  [import_css_what.AttributeAction.Equals, 8],
  [import_css_what.AttributeAction.Not, 7],
  [import_css_what.AttributeAction.Start, 6],
  [import_css_what.AttributeAction.End, 6],
  [import_css_what.AttributeAction.Any, 5]
]);
function sortByProcedure(arr) {
  const procs = arr.map(getProcedure);
  for (let i = 1; i < arr.length; i++) {
    const procNew = procs[i];
    if (procNew < 0)
      continue;
    for (let j = i - 1; j >= 0 && procNew < procs[j]; j--) {
      const token = arr[j + 1];
      arr[j + 1] = arr[j];
      arr[j] = token;
      procs[j + 1] = procs[j];
      procs[j] = procNew;
    }
  }
}
function getProcedure(token) {
  var _a3, _b;
  let proc = (_a3 = procedure.get(token.type)) !== null && _a3 !== void 0 ? _a3 : -1;
  if (token.type === import_css_what.SelectorType.Attribute) {
    proc = (_b = attributes.get(token.action)) !== null && _b !== void 0 ? _b : 4;
    if (token.action === import_css_what.AttributeAction.Equals && token.name === "id") {
      proc = 9;
    }
    if (token.ignoreCase) {
      proc >>= 1;
    }
  } else if (token.type === import_css_what.SelectorType.Pseudo) {
    if (!token.data) {
      proc = 3;
    } else if (token.name === "has" || token.name === "contains") {
      proc = 0;
    } else if (Array.isArray(token.data)) {
      proc = Math.min(...token.data.map((d) => Math.min(...d.map(getProcedure))));
      if (proc < 0) {
        proc = 0;
      }
    } else {
      proc = 2;
    }
  }
  return proc;
}

// node_modules/css-select/lib/esm/attributes.js
var import_boolbase = __toESM(require_boolbase(), 1);
var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
function escapeRegex(value) {
  return value.replace(reChars, "\\$&");
}
var caseInsensitiveAttributes = /* @__PURE__ */ new Set([
  "accept",
  "accept-charset",
  "align",
  "alink",
  "axis",
  "bgcolor",
  "charset",
  "checked",
  "clear",
  "codetype",
  "color",
  "compact",
  "declare",
  "defer",
  "dir",
  "direction",
  "disabled",
  "enctype",
  "face",
  "frame",
  "hreflang",
  "http-equiv",
  "lang",
  "language",
  "link",
  "media",
  "method",
  "multiple",
  "nohref",
  "noresize",
  "noshade",
  "nowrap",
  "readonly",
  "rel",
  "rev",
  "rules",
  "scope",
  "scrolling",
  "selected",
  "shape",
  "target",
  "text",
  "type",
  "valign",
  "valuetype",
  "vlink"
]);
function shouldIgnoreCase(selector, options) {
  return typeof selector.ignoreCase === "boolean" ? selector.ignoreCase : selector.ignoreCase === "quirks" ? !!options.quirksMode : !options.xmlMode && caseInsensitiveAttributes.has(selector.name);
}
var attributeRules = {
  equals(next, data, options) {
    const { adapter: adapter2 } = options;
    const { name } = data;
    let { value } = data;
    if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return (elem) => {
        const attr = adapter2.getAttributeValue(elem, name);
        return attr != null && attr.length === value.length && attr.toLowerCase() === value && next(elem);
      };
    }
    return (elem) => adapter2.getAttributeValue(elem, name) === value && next(elem);
  },
  hyphen(next, data, options) {
    const { adapter: adapter2 } = options;
    const { name } = data;
    let { value } = data;
    const len = value.length;
    if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return function hyphenIC(elem) {
        const attr = adapter2.getAttributeValue(elem, name);
        return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len).toLowerCase() === value && next(elem);
      };
    }
    return function hyphen(elem) {
      const attr = adapter2.getAttributeValue(elem, name);
      return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len) === value && next(elem);
    };
  },
  element(next, data, options) {
    const { adapter: adapter2 } = options;
    const { name, value } = data;
    if (/\s/.test(value)) {
      return import_boolbase.default.falseFunc;
    }
    const regex = new RegExp(`(?:^|\\s)${escapeRegex(value)}(?:$|\\s)`, shouldIgnoreCase(data, options) ? "i" : "");
    return function element(elem) {
      const attr = adapter2.getAttributeValue(elem, name);
      return attr != null && attr.length >= value.length && regex.test(attr) && next(elem);
    };
  },
  exists(next, { name }, { adapter: adapter2 }) {
    return (elem) => adapter2.hasAttrib(elem, name) && next(elem);
  },
  start(next, data, options) {
    const { adapter: adapter2 } = options;
    const { name } = data;
    let { value } = data;
    const len = value.length;
    if (len === 0) {
      return import_boolbase.default.falseFunc;
    }
    if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return (elem) => {
        const attr = adapter2.getAttributeValue(elem, name);
        return attr != null && attr.length >= len && attr.substr(0, len).toLowerCase() === value && next(elem);
      };
    }
    return (elem) => {
      var _a3;
      return !!((_a3 = adapter2.getAttributeValue(elem, name)) === null || _a3 === void 0 ? void 0 : _a3.startsWith(value)) && next(elem);
    };
  },
  end(next, data, options) {
    const { adapter: adapter2 } = options;
    const { name } = data;
    let { value } = data;
    const len = -value.length;
    if (len === 0) {
      return import_boolbase.default.falseFunc;
    }
    if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return (elem) => {
        var _a3;
        return ((_a3 = adapter2.getAttributeValue(elem, name)) === null || _a3 === void 0 ? void 0 : _a3.substr(len).toLowerCase()) === value && next(elem);
      };
    }
    return (elem) => {
      var _a3;
      return !!((_a3 = adapter2.getAttributeValue(elem, name)) === null || _a3 === void 0 ? void 0 : _a3.endsWith(value)) && next(elem);
    };
  },
  any(next, data, options) {
    const { adapter: adapter2 } = options;
    const { name, value } = data;
    if (value === "") {
      return import_boolbase.default.falseFunc;
    }
    if (shouldIgnoreCase(data, options)) {
      const regex = new RegExp(escapeRegex(value), "i");
      return function anyIC(elem) {
        const attr = adapter2.getAttributeValue(elem, name);
        return attr != null && attr.length >= value.length && regex.test(attr) && next(elem);
      };
    }
    return (elem) => {
      var _a3;
      return !!((_a3 = adapter2.getAttributeValue(elem, name)) === null || _a3 === void 0 ? void 0 : _a3.includes(value)) && next(elem);
    };
  },
  not(next, data, options) {
    const { adapter: adapter2 } = options;
    const { name } = data;
    let { value } = data;
    if (value === "") {
      return (elem) => !!adapter2.getAttributeValue(elem, name) && next(elem);
    } else if (shouldIgnoreCase(data, options)) {
      value = value.toLowerCase();
      return (elem) => {
        const attr = adapter2.getAttributeValue(elem, name);
        return (attr == null || attr.length !== value.length || attr.toLowerCase() !== value) && next(elem);
      };
    }
    return (elem) => adapter2.getAttributeValue(elem, name) !== value && next(elem);
  }
};

// node_modules/css-select/lib/esm/pseudo-selectors/index.js
var import_css_what2 = __toESM(require_commonjs(), 1);

// node_modules/nth-check/lib/esm/parse.js
var whitespace = /* @__PURE__ */ new Set([9, 10, 12, 13, 32]);
var ZERO = "0".charCodeAt(0);
var NINE = "9".charCodeAt(0);
function parse(formula) {
  formula = formula.trim().toLowerCase();
  if (formula === "even") {
    return [2, 0];
  } else if (formula === "odd") {
    return [2, 1];
  }
  let idx = 0;
  let a = 0;
  let sign = readSign();
  let number = readNumber();
  if (idx < formula.length && formula.charAt(idx) === "n") {
    idx++;
    a = sign * (number !== null && number !== void 0 ? number : 1);
    skipWhitespace();
    if (idx < formula.length) {
      sign = readSign();
      skipWhitespace();
      number = readNumber();
    } else {
      sign = number = 0;
    }
  }
  if (number === null || idx < formula.length) {
    throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
  }
  return [a, sign * number];
  function readSign() {
    if (formula.charAt(idx) === "-") {
      idx++;
      return -1;
    }
    if (formula.charAt(idx) === "+") {
      idx++;
    }
    return 1;
  }
  function readNumber() {
    const start = idx;
    let value = 0;
    while (idx < formula.length && formula.charCodeAt(idx) >= ZERO && formula.charCodeAt(idx) <= NINE) {
      value = value * 10 + (formula.charCodeAt(idx) - ZERO);
      idx++;
    }
    return idx === start ? null : value;
  }
  function skipWhitespace() {
    while (idx < formula.length && whitespace.has(formula.charCodeAt(idx))) {
      idx++;
    }
  }
}

// node_modules/nth-check/lib/esm/compile.js
var import_boolbase2 = __toESM(require_boolbase(), 1);
function compile(parsed) {
  const a = parsed[0];
  const b = parsed[1] - 1;
  if (b < 0 && a <= 0)
    return import_boolbase2.default.falseFunc;
  if (a === -1)
    return (index) => index <= b;
  if (a === 0)
    return (index) => index === b;
  if (a === 1)
    return b < 0 ? import_boolbase2.default.trueFunc : (index) => index >= b;
  const absA = Math.abs(a);
  const bMod = (b % absA + absA) % absA;
  return a > 1 ? (index) => index >= b && index % absA === bMod : (index) => index <= b && index % absA === bMod;
}

// node_modules/nth-check/lib/esm/index.js
function nthCheck(formula) {
  return compile(parse(formula));
}

// node_modules/css-select/lib/esm/pseudo-selectors/filters.js
var import_boolbase3 = __toESM(require_boolbase(), 1);
function getChildFunc(next, adapter2) {
  return (elem) => {
    const parent = adapter2.getParent(elem);
    return parent != null && adapter2.isTag(parent) && next(elem);
  };
}
var filters = {
  contains(next, text, { adapter: adapter2 }) {
    return function contains(elem) {
      return next(elem) && adapter2.getText(elem).includes(text);
    };
  },
  icontains(next, text, { adapter: adapter2 }) {
    const itext = text.toLowerCase();
    return function icontains(elem) {
      return next(elem) && adapter2.getText(elem).toLowerCase().includes(itext);
    };
  },
  // Location specific methods
  "nth-child"(next, rule, { adapter: adapter2, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next, adapter2);
    return function nthChild(elem) {
      const siblings = adapter2.getSiblings(elem);
      let pos = 0;
      for (let i = 0; i < siblings.length; i++) {
        if (equals(elem, siblings[i]))
          break;
        if (adapter2.isTag(siblings[i])) {
          pos++;
        }
      }
      return func(pos) && next(elem);
    };
  },
  "nth-last-child"(next, rule, { adapter: adapter2, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next, adapter2);
    return function nthLastChild(elem) {
      const siblings = adapter2.getSiblings(elem);
      let pos = 0;
      for (let i = siblings.length - 1; i >= 0; i--) {
        if (equals(elem, siblings[i]))
          break;
        if (adapter2.isTag(siblings[i])) {
          pos++;
        }
      }
      return func(pos) && next(elem);
    };
  },
  "nth-of-type"(next, rule, { adapter: adapter2, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next, adapter2);
    return function nthOfType(elem) {
      const siblings = adapter2.getSiblings(elem);
      let pos = 0;
      for (let i = 0; i < siblings.length; i++) {
        const currentSibling = siblings[i];
        if (equals(elem, currentSibling))
          break;
        if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === adapter2.getName(elem)) {
          pos++;
        }
      }
      return func(pos) && next(elem);
    };
  },
  "nth-last-of-type"(next, rule, { adapter: adapter2, equals }) {
    const func = nthCheck(rule);
    if (func === import_boolbase3.default.falseFunc)
      return import_boolbase3.default.falseFunc;
    if (func === import_boolbase3.default.trueFunc)
      return getChildFunc(next, adapter2);
    return function nthLastOfType(elem) {
      const siblings = adapter2.getSiblings(elem);
      let pos = 0;
      for (let i = siblings.length - 1; i >= 0; i--) {
        const currentSibling = siblings[i];
        if (equals(elem, currentSibling))
          break;
        if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === adapter2.getName(elem)) {
          pos++;
        }
      }
      return func(pos) && next(elem);
    };
  },
  // TODO determine the actual root element
  root(next, _rule, { adapter: adapter2 }) {
    return (elem) => {
      const parent = adapter2.getParent(elem);
      return (parent == null || !adapter2.isTag(parent)) && next(elem);
    };
  },
  scope(next, rule, options, context) {
    const { equals } = options;
    if (!context || context.length === 0) {
      return filters["root"](next, rule, options);
    }
    if (context.length === 1) {
      return (elem) => equals(context[0], elem) && next(elem);
    }
    return (elem) => context.includes(elem) && next(elem);
  },
  hover: dynamicStatePseudo("isHovered"),
  visited: dynamicStatePseudo("isVisited"),
  active: dynamicStatePseudo("isActive")
};
function dynamicStatePseudo(name) {
  return function dynamicPseudo(next, _rule, { adapter: adapter2 }) {
    const func = adapter2[name];
    if (typeof func !== "function") {
      return import_boolbase3.default.falseFunc;
    }
    return function active(elem) {
      return func(elem) && next(elem);
    };
  };
}

// node_modules/css-select/lib/esm/pseudo-selectors/pseudos.js
var pseudos = {
  empty(elem, { adapter: adapter2 }) {
    return !adapter2.getChildren(elem).some((elem2) => (
      // FIXME: `getText` call is potentially expensive.
      adapter2.isTag(elem2) || adapter2.getText(elem2) !== ""
    ));
  },
  "first-child"(elem, { adapter: adapter2, equals }) {
    if (adapter2.prevElementSibling) {
      return adapter2.prevElementSibling(elem) == null;
    }
    const firstChild = adapter2.getSiblings(elem).find((elem2) => adapter2.isTag(elem2));
    return firstChild != null && equals(elem, firstChild);
  },
  "last-child"(elem, { adapter: adapter2, equals }) {
    const siblings = adapter2.getSiblings(elem);
    for (let i = siblings.length - 1; i >= 0; i--) {
      if (equals(elem, siblings[i]))
        return true;
      if (adapter2.isTag(siblings[i]))
        break;
    }
    return false;
  },
  "first-of-type"(elem, { adapter: adapter2, equals }) {
    const siblings = adapter2.getSiblings(elem);
    const elemName = adapter2.getName(elem);
    for (let i = 0; i < siblings.length; i++) {
      const currentSibling = siblings[i];
      if (equals(elem, currentSibling))
        return true;
      if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === elemName) {
        break;
      }
    }
    return false;
  },
  "last-of-type"(elem, { adapter: adapter2, equals }) {
    const siblings = adapter2.getSiblings(elem);
    const elemName = adapter2.getName(elem);
    for (let i = siblings.length - 1; i >= 0; i--) {
      const currentSibling = siblings[i];
      if (equals(elem, currentSibling))
        return true;
      if (adapter2.isTag(currentSibling) && adapter2.getName(currentSibling) === elemName) {
        break;
      }
    }
    return false;
  },
  "only-of-type"(elem, { adapter: adapter2, equals }) {
    const elemName = adapter2.getName(elem);
    return adapter2.getSiblings(elem).every((sibling) => equals(elem, sibling) || !adapter2.isTag(sibling) || adapter2.getName(sibling) !== elemName);
  },
  "only-child"(elem, { adapter: adapter2, equals }) {
    return adapter2.getSiblings(elem).every((sibling) => equals(elem, sibling) || !adapter2.isTag(sibling));
  }
};
function verifyPseudoArgs(func, name, subselect, argIndex) {
  if (subselect === null) {
    if (func.length > argIndex) {
      throw new Error(`Pseudo-class :${name} requires an argument`);
    }
  } else if (func.length === argIndex) {
    throw new Error(`Pseudo-class :${name} doesn't have any arguments`);
  }
}

// node_modules/css-select/lib/esm/pseudo-selectors/aliases.js
var aliases = {
  // Links
  "any-link": ":is(a, area, link)[href]",
  link: ":any-link:not(:visited)",
  // Forms
  // https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
  disabled: `:is(
        :is(button, input, select, textarea, optgroup, option)[disabled],
        optgroup[disabled] > option,
        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)
    )`,
  enabled: ":not(:disabled)",
  checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
  required: ":is(input, select, textarea)[required]",
  optional: ":is(input, select, textarea):not([required])",
  // JQuery extensions
  // https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-selectedness
  selected: "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
  checkbox: "[type=checkbox]",
  file: "[type=file]",
  password: "[type=password]",
  radio: "[type=radio]",
  reset: "[type=reset]",
  image: "[type=image]",
  submit: "[type=submit]",
  parent: ":not(:empty)",
  header: ":is(h1, h2, h3, h4, h5, h6)",
  button: ":is(button, input[type=button])",
  input: ":is(input, textarea, select, button)",
  text: "input:is(:not([type!='']), [type=text])"
};

// node_modules/css-select/lib/esm/pseudo-selectors/subselects.js
var import_boolbase4 = __toESM(require_boolbase(), 1);
var PLACEHOLDER_ELEMENT = {};
function ensureIsTag(next, adapter2) {
  if (next === import_boolbase4.default.falseFunc)
    return import_boolbase4.default.falseFunc;
  return (elem) => adapter2.isTag(elem) && next(elem);
}
function getNextSiblings(elem, adapter2) {
  const siblings = adapter2.getSiblings(elem);
  if (siblings.length <= 1)
    return [];
  const elemIndex = siblings.indexOf(elem);
  if (elemIndex < 0 || elemIndex === siblings.length - 1)
    return [];
  return siblings.slice(elemIndex + 1).filter(adapter2.isTag);
}
function copyOptions(options) {
  return {
    xmlMode: !!options.xmlMode,
    lowerCaseAttributeNames: !!options.lowerCaseAttributeNames,
    lowerCaseTags: !!options.lowerCaseTags,
    quirksMode: !!options.quirksMode,
    cacheResults: !!options.cacheResults,
    pseudos: options.pseudos,
    adapter: options.adapter,
    equals: options.equals
  };
}
var is = (next, token, options, context, compileToken2) => {
  const func = compileToken2(token, copyOptions(options), context);
  return func === import_boolbase4.default.trueFunc ? next : func === import_boolbase4.default.falseFunc ? import_boolbase4.default.falseFunc : (elem) => func(elem) && next(elem);
};
var subselects = {
  is,
  /**
   * `:matches` and `:where` are aliases for `:is`.
   */
  matches: is,
  where: is,
  not(next, token, options, context, compileToken2) {
    const func = compileToken2(token, copyOptions(options), context);
    return func === import_boolbase4.default.falseFunc ? next : func === import_boolbase4.default.trueFunc ? import_boolbase4.default.falseFunc : (elem) => !func(elem) && next(elem);
  },
  has(next, subselect, options, _context, compileToken2) {
    const { adapter: adapter2 } = options;
    const opts = copyOptions(options);
    opts.relativeSelector = true;
    const context = subselect.some((s) => s.some(isTraversal)) ? (
      // Used as a placeholder. Will be replaced with the actual element.
      [PLACEHOLDER_ELEMENT]
    ) : void 0;
    const compiled = compileToken2(subselect, opts, context);
    if (compiled === import_boolbase4.default.falseFunc)
      return import_boolbase4.default.falseFunc;
    const hasElement = ensureIsTag(compiled, adapter2);
    if (context && compiled !== import_boolbase4.default.trueFunc) {
      const { shouldTestNextSiblings = false } = compiled;
      return (elem) => {
        if (!next(elem))
          return false;
        context[0] = elem;
        const childs = adapter2.getChildren(elem);
        const nextElements = shouldTestNextSiblings ? [...childs, ...getNextSiblings(elem, adapter2)] : childs;
        return adapter2.existsOne(hasElement, nextElements);
      };
    }
    return (elem) => next(elem) && adapter2.existsOne(hasElement, adapter2.getChildren(elem));
  }
};

// node_modules/css-select/lib/esm/pseudo-selectors/index.js
function compilePseudoSelector(next, selector, options, context, compileToken2) {
  var _a3;
  const { name, data } = selector;
  if (Array.isArray(data)) {
    if (!(name in subselects)) {
      throw new Error(`Unknown pseudo-class :${name}(${data})`);
    }
    return subselects[name](next, data, options, context, compileToken2);
  }
  const userPseudo = (_a3 = options.pseudos) === null || _a3 === void 0 ? void 0 : _a3[name];
  const stringPseudo = typeof userPseudo === "string" ? userPseudo : aliases[name];
  if (typeof stringPseudo === "string") {
    if (data != null) {
      throw new Error(`Pseudo ${name} doesn't have any arguments`);
    }
    const alias = (0, import_css_what2.parse)(stringPseudo);
    return subselects["is"](next, alias, options, context, compileToken2);
  }
  if (typeof userPseudo === "function") {
    verifyPseudoArgs(userPseudo, name, data, 1);
    return (elem) => userPseudo(elem, data) && next(elem);
  }
  if (name in filters) {
    return filters[name](next, data, options, context);
  }
  if (name in pseudos) {
    const pseudo = pseudos[name];
    verifyPseudoArgs(pseudo, name, data, 2);
    return (elem) => pseudo(elem, options, data) && next(elem);
  }
  throw new Error(`Unknown pseudo-class :${name}`);
}

// node_modules/css-select/lib/esm/general.js
var import_css_what3 = __toESM(require_commonjs(), 1);
function getElementParent(node, adapter2) {
  const parent = adapter2.getParent(node);
  if (parent && adapter2.isTag(parent)) {
    return parent;
  }
  return null;
}
function compileGeneralSelector(next, selector, options, context, compileToken2) {
  const { adapter: adapter2, equals } = options;
  switch (selector.type) {
    case import_css_what3.SelectorType.PseudoElement: {
      throw new Error("Pseudo-elements are not supported by css-select");
    }
    case import_css_what3.SelectorType.ColumnCombinator: {
      throw new Error("Column combinators are not yet supported by css-select");
    }
    case import_css_what3.SelectorType.Attribute: {
      if (selector.namespace != null) {
        throw new Error("Namespaced attributes are not yet supported by css-select");
      }
      if (!options.xmlMode || options.lowerCaseAttributeNames) {
        selector.name = selector.name.toLowerCase();
      }
      return attributeRules[selector.action](next, selector, options);
    }
    case import_css_what3.SelectorType.Pseudo: {
      return compilePseudoSelector(next, selector, options, context, compileToken2);
    }
    // Tags
    case import_css_what3.SelectorType.Tag: {
      if (selector.namespace != null) {
        throw new Error("Namespaced tag names are not yet supported by css-select");
      }
      let { name } = selector;
      if (!options.xmlMode || options.lowerCaseTags) {
        name = name.toLowerCase();
      }
      return function tag(elem) {
        return adapter2.getName(elem) === name && next(elem);
      };
    }
    // Traversal
    case import_css_what3.SelectorType.Descendant: {
      if (options.cacheResults === false || typeof WeakSet === "undefined") {
        return function descendant(elem) {
          let current = elem;
          while (current = getElementParent(current, adapter2)) {
            if (next(current)) {
              return true;
            }
          }
          return false;
        };
      }
      const isFalseCache = /* @__PURE__ */ new WeakSet();
      return function cachedDescendant(elem) {
        let current = elem;
        while (current = getElementParent(current, adapter2)) {
          if (!isFalseCache.has(current)) {
            if (adapter2.isTag(current) && next(current)) {
              return true;
            }
            isFalseCache.add(current);
          }
        }
        return false;
      };
    }
    case "_flexibleDescendant": {
      return function flexibleDescendant(elem) {
        let current = elem;
        do {
          if (next(current))
            return true;
        } while (current = getElementParent(current, adapter2));
        return false;
      };
    }
    case import_css_what3.SelectorType.Parent: {
      return function parent(elem) {
        return adapter2.getChildren(elem).some((elem2) => adapter2.isTag(elem2) && next(elem2));
      };
    }
    case import_css_what3.SelectorType.Child: {
      return function child(elem) {
        const parent = adapter2.getParent(elem);
        return parent != null && adapter2.isTag(parent) && next(parent);
      };
    }
    case import_css_what3.SelectorType.Sibling: {
      return function sibling(elem) {
        const siblings = adapter2.getSiblings(elem);
        for (let i = 0; i < siblings.length; i++) {
          const currentSibling = siblings[i];
          if (equals(elem, currentSibling))
            break;
          if (adapter2.isTag(currentSibling) && next(currentSibling)) {
            return true;
          }
        }
        return false;
      };
    }
    case import_css_what3.SelectorType.Adjacent: {
      if (adapter2.prevElementSibling) {
        return function adjacent(elem) {
          const previous = adapter2.prevElementSibling(elem);
          return previous != null && next(previous);
        };
      }
      return function adjacent(elem) {
        const siblings = adapter2.getSiblings(elem);
        let lastElement;
        for (let i = 0; i < siblings.length; i++) {
          const currentSibling = siblings[i];
          if (equals(elem, currentSibling))
            break;
          if (adapter2.isTag(currentSibling)) {
            lastElement = currentSibling;
          }
        }
        return !!lastElement && next(lastElement);
      };
    }
    case import_css_what3.SelectorType.Universal: {
      if (selector.namespace != null && selector.namespace !== "*") {
        throw new Error("Namespaced universal selectors are not yet supported by css-select");
      }
      return next;
    }
  }
}

// node_modules/css-select/lib/esm/compile.js
function compile2(selector, options, context) {
  const next = compileUnsafe(selector, options, context);
  return ensureIsTag(next, options.adapter);
}
function compileUnsafe(selector, options, context) {
  const token = typeof selector === "string" ? (0, import_css_what4.parse)(selector) : selector;
  return compileToken(token, options, context);
}
function includesScopePseudo(t) {
  return t.type === import_css_what4.SelectorType.Pseudo && (t.name === "scope" || Array.isArray(t.data) && t.data.some((data) => data.some(includesScopePseudo)));
}
var DESCENDANT_TOKEN = { type: import_css_what4.SelectorType.Descendant };
var FLEXIBLE_DESCENDANT_TOKEN = {
  type: "_flexibleDescendant"
};
var SCOPE_TOKEN = {
  type: import_css_what4.SelectorType.Pseudo,
  name: "scope",
  data: null
};
function absolutize(token, { adapter: adapter2 }, context) {
  const hasContext = !!(context === null || context === void 0 ? void 0 : context.every((e) => {
    const parent = adapter2.isTag(e) && adapter2.getParent(e);
    return e === PLACEHOLDER_ELEMENT || parent && adapter2.isTag(parent);
  }));
  for (const t of token) {
    if (t.length > 0 && isTraversal(t[0]) && t[0].type !== import_css_what4.SelectorType.Descendant) {
    } else if (hasContext && !t.some(includesScopePseudo)) {
      t.unshift(DESCENDANT_TOKEN);
    } else {
      continue;
    }
    t.unshift(SCOPE_TOKEN);
  }
}
function compileToken(token, options, context) {
  var _a3;
  token.forEach(sortByProcedure);
  context = (_a3 = options.context) !== null && _a3 !== void 0 ? _a3 : context;
  const isArrayContext = Array.isArray(context);
  const finalContext = context && (Array.isArray(context) ? context : [context]);
  if (options.relativeSelector !== false) {
    absolutize(token, options, finalContext);
  } else if (token.some((t) => t.length > 0 && isTraversal(t[0]))) {
    throw new Error("Relative selectors are not allowed when the `relativeSelector` option is disabled");
  }
  let shouldTestNextSiblings = false;
  const query2 = token.map((rules) => {
    if (rules.length >= 2) {
      const [first, second] = rules;
      if (first.type !== import_css_what4.SelectorType.Pseudo || first.name !== "scope") {
      } else if (isArrayContext && second.type === import_css_what4.SelectorType.Descendant) {
        rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
      } else if (second.type === import_css_what4.SelectorType.Adjacent || second.type === import_css_what4.SelectorType.Sibling) {
        shouldTestNextSiblings = true;
      }
    }
    return compileRules(rules, options, finalContext);
  }).reduce(reduceRules, import_boolbase5.default.falseFunc);
  query2.shouldTestNextSiblings = shouldTestNextSiblings;
  return query2;
}
function compileRules(rules, options, context) {
  var _a3;
  return rules.reduce((previous, rule) => previous === import_boolbase5.default.falseFunc ? import_boolbase5.default.falseFunc : compileGeneralSelector(previous, rule, options, context, compileToken), (_a3 = options.rootFunc) !== null && _a3 !== void 0 ? _a3 : import_boolbase5.default.trueFunc);
}
function reduceRules(a, b) {
  if (b === import_boolbase5.default.falseFunc || a === import_boolbase5.default.trueFunc) {
    return a;
  }
  if (a === import_boolbase5.default.falseFunc || b === import_boolbase5.default.trueFunc) {
    return b;
  }
  return function combine(elem) {
    return a(elem) || b(elem);
  };
}

// node_modules/css-select/lib/esm/index.js
var defaultEquals = (a, b) => a === b;
var defaultOptions = {
  adapter: esm_exports2,
  equals: defaultEquals
};
function convertOptionFormats(options) {
  var _a3, _b, _c, _d;
  const opts = options !== null && options !== void 0 ? options : defaultOptions;
  (_a3 = opts.adapter) !== null && _a3 !== void 0 ? _a3 : opts.adapter = esm_exports2;
  (_b = opts.equals) !== null && _b !== void 0 ? _b : opts.equals = (_d = (_c = opts.adapter) === null || _c === void 0 ? void 0 : _c.equals) !== null && _d !== void 0 ? _d : defaultEquals;
  return opts;
}
function wrapCompile(func) {
  return function addAdapter(selector, options, context) {
    const opts = convertOptionFormats(options);
    return func(selector, opts, context);
  };
}
var compile3 = wrapCompile(compile2);
var _compileUnsafe = wrapCompile(compileUnsafe);
var _compileToken = wrapCompile(compileToken);
function getSelectorFunc(searchFunc) {
  return function select(query2, elements, options) {
    const opts = convertOptionFormats(options);
    if (typeof query2 !== "function") {
      query2 = compileUnsafe(query2, opts, elements);
    }
    const filteredElements = prepareContext(elements, opts.adapter, query2.shouldTestNextSiblings);
    return searchFunc(query2, filteredElements, opts);
  };
}
function prepareContext(elems, adapter2, shouldTestNextSiblings = false) {
  if (shouldTestNextSiblings) {
    elems = appendNextSiblings(elems, adapter2);
  }
  return Array.isArray(elems) ? adapter2.removeSubsets(elems) : adapter2.getChildren(elems);
}
function appendNextSiblings(elem, adapter2) {
  const elems = Array.isArray(elem) ? elem.slice(0) : [elem];
  const elemsLength = elems.length;
  for (let i = 0; i < elemsLength; i++) {
    const nextSiblings = getNextSiblings(elems[i], adapter2);
    elems.push(...nextSiblings);
  }
  return elems;
}
var selectAll = getSelectorFunc((query2, elems, options) => query2 === import_boolbase6.default.falseFunc || !elems || elems.length === 0 ? [] : options.adapter.findAll(query2, elems));
var selectOne = getSelectorFunc((query2, elems, options) => query2 === import_boolbase6.default.falseFunc || !elems || elems.length === 0 ? null : options.adapter.findOne(query2, elems));
function is2(elem, query2, options) {
  const opts = convertOptionFormats(options);
  return (typeof query2 === "function" ? query2 : compile2(query2, opts))(elem);
}

// node_modules/linkedom/esm/shared/matches.js
var { isArray } = Array;
var isTag3 = ({ nodeType }) => nodeType === ELEMENT_NODE;
var existsOne2 = (test, elements) => elements.some(
  (element) => isTag3(element) && (test(element) || existsOne2(test, getChildren2(element)))
);
var getAttributeValue2 = (element, name) => name === "class" ? element.classList.value : element.getAttribute(name);
var getChildren2 = ({ childNodes }) => childNodes;
var getName2 = (element) => {
  const { localName } = element;
  return ignoreCase(element) ? localName.toLowerCase() : localName;
};
var getParent2 = ({ parentNode }) => parentNode;
var getSiblings2 = (element) => {
  const { parentNode } = element;
  return parentNode ? getChildren2(parentNode) : element;
};
var getText2 = (node) => {
  if (isArray(node))
    return node.map(getText2).join("");
  if (isTag3(node))
    return getText2(getChildren2(node));
  if (node.nodeType === TEXT_NODE)
    return node.data;
  return "";
};
var hasAttrib2 = (element, name) => element.hasAttribute(name);
var removeSubsets2 = (nodes) => {
  let { length } = nodes;
  while (length--) {
    const node = nodes[length];
    if (length && -1 < nodes.lastIndexOf(node, length - 1)) {
      nodes.splice(length, 1);
      continue;
    }
    for (let { parentNode } = node; parentNode; parentNode = parentNode.parentNode) {
      if (nodes.includes(parentNode)) {
        nodes.splice(length, 1);
        break;
      }
    }
  }
  return nodes;
};
var findAll2 = (test, nodes) => {
  const matches2 = [];
  for (const node of nodes) {
    if (isTag3(node)) {
      if (test(node))
        matches2.push(node);
      matches2.push(...findAll2(test, getChildren2(node)));
    }
  }
  return matches2;
};
var findOne2 = (test, nodes) => {
  for (let node of nodes)
    if (test(node) || (node = findOne2(test, getChildren2(node))))
      return node;
  return null;
};
var adapter = {
  isTag: isTag3,
  existsOne: existsOne2,
  getAttributeValue: getAttributeValue2,
  getChildren: getChildren2,
  getName: getName2,
  getParent: getParent2,
  getSiblings: getSiblings2,
  getText: getText2,
  hasAttrib: hasAttrib2,
  removeSubsets: removeSubsets2,
  findAll: findAll2,
  findOne: findOne2
};
var prepareMatch = (element, selectors) => compile3(
  selectors,
  {
    context: selectors.includes(":scope") ? element : void 0,
    xmlMode: !ignoreCase(element),
    adapter
  }
);
var matches = (element, selectors) => is2(
  element,
  selectors,
  {
    strict: true,
    context: selectors.includes(":scope") ? element : void 0,
    xmlMode: !ignoreCase(element),
    adapter
  }
);

// node_modules/linkedom/esm/interface/text.js
var Text3 = class _Text extends CharacterData {
  constructor(ownerDocument, data = "") {
    super(ownerDocument, "#text", TEXT_NODE, data);
  }
  get wholeText() {
    const text = [];
    let { previousSibling: previousSibling2, nextSibling: nextSibling2 } = this;
    while (previousSibling2) {
      if (previousSibling2.nodeType === TEXT_NODE)
        text.unshift(previousSibling2[VALUE]);
      else
        break;
      previousSibling2 = previousSibling2.previousSibling;
    }
    text.push(this[VALUE]);
    while (nextSibling2) {
      if (nextSibling2.nodeType === TEXT_NODE)
        text.push(nextSibling2[VALUE]);
      else
        break;
      nextSibling2 = nextSibling2.nextSibling;
    }
    return text.join("");
  }
  cloneNode() {
    const { ownerDocument, [VALUE]: data } = this;
    return new _Text(ownerDocument, data);
  }
  toString() {
    return escape2(this[VALUE]);
  }
};

// node_modules/linkedom/esm/mixin/parent-node.js
var isNode = (node) => node instanceof Node2;
var insert = (parentNode, child, nodes) => {
  const { ownerDocument } = parentNode;
  for (const node of nodes)
    parentNode.insertBefore(
      isNode(node) ? node : new Text3(ownerDocument, node),
      child
    );
};
var ParentNode = class extends Node2 {
  constructor(ownerDocument, localName, nodeType) {
    super(ownerDocument, localName, nodeType);
    this[PRIVATE] = null;
    this[NEXT] = this[END] = {
      [NEXT]: null,
      [PREV]: this,
      [START]: this,
      nodeType: NODE_END,
      ownerDocument: this.ownerDocument,
      parentNode: null
    };
  }
  get childNodes() {
    const childNodes = new NodeList();
    let { firstChild } = this;
    while (firstChild) {
      childNodes.push(firstChild);
      firstChild = nextSibling(firstChild);
    }
    return childNodes;
  }
  get children() {
    const children = new NodeList();
    let { firstElementChild } = this;
    while (firstElementChild) {
      children.push(firstElementChild);
      firstElementChild = nextElementSibling2(firstElementChild);
    }
    return children;
  }
  /**
   * @returns {NodeStruct | null}
   */
  get firstChild() {
    let { [NEXT]: next, [END]: end } = this;
    while (next.nodeType === ATTRIBUTE_NODE)
      next = next[NEXT];
    return next === end ? null : next;
  }
  /**
   * @returns {NodeStruct | null}
   */
  get firstElementChild() {
    let { firstChild } = this;
    while (firstChild) {
      if (firstChild.nodeType === ELEMENT_NODE)
        return firstChild;
      firstChild = nextSibling(firstChild);
    }
    return null;
  }
  get lastChild() {
    const prev = this[END][PREV];
    switch (prev.nodeType) {
      case NODE_END:
        return prev[START];
      case ATTRIBUTE_NODE:
        return null;
    }
    return prev === this ? null : prev;
  }
  get lastElementChild() {
    let { lastChild } = this;
    while (lastChild) {
      if (lastChild.nodeType === ELEMENT_NODE)
        return lastChild;
      lastChild = previousSibling(lastChild);
    }
    return null;
  }
  get childElementCount() {
    return this.children.length;
  }
  prepend(...nodes) {
    insert(this, this.firstChild, nodes);
  }
  append(...nodes) {
    insert(this, this[END], nodes);
  }
  replaceChildren(...nodes) {
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end && next.nodeType === ATTRIBUTE_NODE)
      next = next[NEXT];
    while (next !== end) {
      const after2 = getEnd(next)[NEXT];
      next.remove();
      next = after2;
    }
    if (nodes.length)
      insert(this, end, nodes);
  }
  getElementsByClassName(className) {
    const elements = new NodeList();
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && next.hasAttribute("class") && next.classList.has(className))
        elements.push(next);
      next = next[NEXT];
    }
    return elements;
  }
  getElementsByTagName(tagName19) {
    const elements = new NodeList();
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && (next.localName === tagName19 || localCase(next) === tagName19))
        elements.push(next);
      next = next[NEXT];
    }
    return elements;
  }
  querySelector(selectors) {
    const matches2 = prepareMatch(this, selectors);
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && matches2(next))
        return next;
      next = next.nodeType === ELEMENT_NODE && next.localName === "template" ? next[END] : next[NEXT];
    }
    return null;
  }
  querySelectorAll(selectors) {
    const matches2 = prepareMatch(this, selectors);
    const elements = new NodeList();
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && matches2(next))
        elements.push(next);
      next = next.nodeType === ELEMENT_NODE && next.localName === "template" ? next[END] : next[NEXT];
    }
    return elements;
  }
  appendChild(node) {
    return this.insertBefore(node, this[END]);
  }
  contains(node) {
    let parentNode = node;
    while (parentNode && parentNode !== this)
      parentNode = parentNode.parentNode;
    return parentNode === this;
  }
  insertBefore(node, before2 = null) {
    if (node === before2)
      return node;
    if (node === this)
      throw new Error("unable to append a node to itself");
    const next = before2 || this[END];
    switch (node.nodeType) {
      case ELEMENT_NODE:
        node.remove();
        node.parentNode = this;
        knownBoundaries(next[PREV], node, next);
        moCallback(node, null);
        connectedCallback(node);
        break;
      case DOCUMENT_FRAGMENT_NODE: {
        let { [PRIVATE]: parentNode, firstChild, lastChild } = node;
        if (firstChild) {
          knownSegment(next[PREV], firstChild, lastChild, next);
          knownAdjacent(node, node[END]);
          if (parentNode)
            parentNode.replaceChildren();
          do {
            firstChild.parentNode = this;
            moCallback(firstChild, null);
            if (firstChild.nodeType === ELEMENT_NODE)
              connectedCallback(firstChild);
          } while (firstChild !== lastChild && (firstChild = nextSibling(firstChild)));
        }
        break;
      }
      case TEXT_NODE:
      case COMMENT_NODE:
      case CDATA_SECTION_NODE:
        node.remove();
      /* eslint no-fallthrough:0 */
      // this covers DOCUMENT_TYPE_NODE too
      default:
        node.parentNode = this;
        knownSiblings(next[PREV], node, next);
        moCallback(node, null);
        break;
    }
    return node;
  }
  normalize() {
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      const { [NEXT]: $next, [PREV]: $prev, nodeType } = next;
      if (nodeType === TEXT_NODE) {
        if (!next[VALUE])
          next.remove();
        else if ($prev && $prev.nodeType === TEXT_NODE) {
          $prev.textContent += next.textContent;
          next.remove();
        }
      }
      next = $next;
    }
  }
  removeChild(node) {
    if (node.parentNode !== this)
      throw new Error("node is not a child");
    node.remove();
    return node;
  }
  replaceChild(node, replaced) {
    const next = getEnd(replaced)[NEXT];
    replaced.remove();
    this.insertBefore(node, next);
    return replaced;
  }
};

// node_modules/linkedom/esm/mixin/non-element-parent-node.js
var NonElementParentNode = class extends ParentNode {
  getElementById(id) {
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE && next.id === id)
        return next;
      next = next[NEXT];
    }
    return null;
  }
  cloneNode(deep) {
    const { ownerDocument, constructor } = this;
    const nonEPN = new constructor(ownerDocument);
    if (deep) {
      const { [END]: end } = nonEPN;
      for (const node of this.childNodes)
        nonEPN.insertBefore(node.cloneNode(deep), end);
    }
    return nonEPN;
  }
  toString() {
    const { childNodes, localName } = this;
    return `<${localName}>${childNodes.join("")}</${localName}>`;
  }
  toJSON() {
    const json = [];
    nonElementAsJSON(this, json);
    return json;
  }
};

// node_modules/linkedom/esm/interface/document-fragment.js
var DocumentFragment = class extends NonElementParentNode {
  constructor(ownerDocument) {
    super(ownerDocument, "#document-fragment", DOCUMENT_FRAGMENT_NODE);
  }
};

// node_modules/linkedom/esm/interface/document-type.js
var DocumentType = class _DocumentType extends Node2 {
  constructor(ownerDocument, name, publicId = "", systemId = "") {
    super(ownerDocument, "#document-type", DOCUMENT_TYPE_NODE);
    this.name = name;
    this.publicId = publicId;
    this.systemId = systemId;
  }
  cloneNode() {
    const { ownerDocument, name, publicId, systemId } = this;
    return new _DocumentType(ownerDocument, name, publicId, systemId);
  }
  toString() {
    const { name, publicId, systemId } = this;
    const hasPublic = 0 < publicId.length;
    const str = [name];
    if (hasPublic)
      str.push("PUBLIC", `"${publicId}"`);
    if (systemId.length) {
      if (!hasPublic)
        str.push("SYSTEM");
      str.push(`"${systemId}"`);
    }
    return `<!DOCTYPE ${str.join(" ")}>`;
  }
  toJSON() {
    const json = [];
    documentTypeAsJSON(this, json);
    return json;
  }
};

// node_modules/linkedom/esm/mixin/inner-html.js
var getInnerHtml = (node) => node.childNodes.join("");
var setInnerHtml = (node, html) => {
  const { ownerDocument } = node;
  const { constructor } = ownerDocument;
  const document2 = new constructor();
  document2[CUSTOM_ELEMENTS] = ownerDocument[CUSTOM_ELEMENTS];
  const { childNodes } = parseFromString(document2, ignoreCase(node), html);
  node.replaceChildren(...childNodes.map(setOwnerDocument, ownerDocument));
};
function setOwnerDocument(node) {
  node.ownerDocument = this;
  switch (node.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      node.childNodes.forEach(setOwnerDocument, this);
      break;
  }
  return node;
}

// node_modules/uhyphen/esm/index.js
var esm_default2 = (camel) => camel.replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z0-9]+)([A-Z]))/g, "$2$5-$3$6").toLowerCase();

// node_modules/linkedom/esm/dom/string-map.js
var refs = /* @__PURE__ */ new WeakMap();
var key = (name) => `data-${esm_default2(name)}`;
var prop = (name) => name.slice(5).replace(/-([a-z])/g, (_, $1) => $1.toUpperCase());
var handler = {
  get(dataset, name) {
    if (name in dataset)
      return refs.get(dataset).getAttribute(key(name));
  },
  set(dataset, name, value) {
    dataset[name] = value;
    refs.get(dataset).setAttribute(key(name), value);
    return true;
  },
  deleteProperty(dataset, name) {
    if (name in dataset)
      refs.get(dataset).removeAttribute(key(name));
    return delete dataset[name];
  }
};
var DOMStringMap = class {
  /**
   * @param {Element} ref
   */
  constructor(ref) {
    for (const { name, value } of ref.attributes) {
      if (/^data-/.test(name))
        this[prop(name)] = value;
    }
    refs.set(this, ref);
    return new Proxy(this, handler);
  }
};
setPrototypeOf(DOMStringMap.prototype, null);

// node_modules/linkedom/esm/dom/token-list.js
var { add } = Set.prototype;
var addTokens = (self2, tokens) => {
  for (const token of tokens) {
    if (token)
      add.call(self2, token);
  }
};
var update = ({ [OWNER_ELEMENT]: ownerElement, value }) => {
  const attribute2 = ownerElement.getAttributeNode("class");
  if (attribute2)
    attribute2.value = value;
  else
    setAttribute(
      ownerElement,
      new Attr(ownerElement.ownerDocument, "class", value)
    );
};
var DOMTokenList = class extends Set {
  constructor(ownerElement) {
    super();
    this[OWNER_ELEMENT] = ownerElement;
    const attribute2 = ownerElement.getAttributeNode("class");
    if (attribute2)
      addTokens(this, attribute2.value.split(/\s+/));
  }
  get length() {
    return this.size;
  }
  get value() {
    return [...this].join(" ");
  }
  /**
   * @param  {...string} tokens
   */
  add(...tokens) {
    addTokens(this, tokens);
    update(this);
  }
  /**
   * @param {string} token
   */
  contains(token) {
    return this.has(token);
  }
  /**
   * @param  {...string} tokens
   */
  remove(...tokens) {
    for (const token of tokens)
      this.delete(token);
    update(this);
  }
  /**
   * @param {string} token
   * @param {boolean?} force
   */
  toggle(token, force) {
    if (this.has(token)) {
      if (force)
        return true;
      this.delete(token);
      update(this);
    } else if (force || arguments.length === 1) {
      super.add(token);
      update(this);
      return true;
    }
    return false;
  }
  /**
   * @param {string} token
   * @param {string} newToken
   */
  replace(token, newToken) {
    if (this.has(token)) {
      this.delete(token);
      super.add(newToken);
      update(this);
      return true;
    }
    return false;
  }
  /**
   * @param {string} token
   */
  supports() {
    return true;
  }
};

// node_modules/linkedom/esm/interface/css-style-declaration.js
var refs2 = /* @__PURE__ */ new WeakMap();
var getKeys = (style) => [...style.keys()].filter((key2) => key2 !== PRIVATE);
var updateKeys = (style) => {
  const attr = refs2.get(style).getAttributeNode("style");
  if (!attr || attr[CHANGED] || style.get(PRIVATE) !== attr) {
    style.clear();
    if (attr) {
      style.set(PRIVATE, attr);
      for (const rule of attr[VALUE].split(/\s*;\s*/)) {
        let [key2, ...rest] = rule.split(":");
        if (rest.length > 0) {
          key2 = key2.trim();
          const value = rest.join(":").trim();
          if (key2 && value)
            style.set(key2, value);
        }
      }
    }
  }
  return attr;
};
var handler2 = {
  get(style, name) {
    if (name in prototype)
      return style[name];
    updateKeys(style);
    if (name === "length")
      return getKeys(style).length;
    if (/^\d+$/.test(name))
      return getKeys(style)[name];
    return style.get(esm_default2(name));
  },
  set(style, name, value) {
    if (name === "cssText")
      style[name] = value;
    else {
      let attr = updateKeys(style);
      if (value == null)
        style.delete(esm_default2(name));
      else
        style.set(esm_default2(name), value);
      if (!attr) {
        const element = refs2.get(style);
        attr = element.ownerDocument.createAttribute("style");
        element.setAttributeNode(attr);
        style.set(PRIVATE, attr);
      }
      attr[CHANGED] = false;
      attr[VALUE] = style.toString();
    }
    return true;
  }
};
var CSSStyleDeclaration = class extends Map {
  constructor(element) {
    super();
    refs2.set(this, element);
    return new Proxy(this, handler2);
  }
  get cssText() {
    return this.toString();
  }
  set cssText(value) {
    refs2.get(this).setAttribute("style", value);
  }
  getPropertyValue(name) {
    const self2 = this[PRIVATE];
    return handler2.get(self2, name);
  }
  setProperty(name, value) {
    const self2 = this[PRIVATE];
    handler2.set(self2, name, value);
  }
  removeProperty(name) {
    const self2 = this[PRIVATE];
    handler2.set(self2, name, null);
  }
  [Symbol.iterator]() {
    const self2 = this[PRIVATE];
    updateKeys(self2);
    const keys2 = getKeys(self2);
    const { length } = keys2;
    let i = 0;
    return {
      next() {
        const done = i === length;
        return { done, value: done ? null : keys2[i++] };
      }
    };
  }
  get [PRIVATE]() {
    return this;
  }
  toString() {
    const self2 = this[PRIVATE];
    updateKeys(self2);
    const cssText = [];
    self2.forEach(push, cssText);
    return cssText.join(";");
  }
};
var { prototype } = CSSStyleDeclaration;
function push(value, key2) {
  if (key2 !== PRIVATE)
    this.push(`${key2}:${value}`);
}

// node_modules/linkedom/esm/interface/event.js
var BUBBLING_PHASE = 3;
var AT_TARGET = 2;
var CAPTURING_PHASE = 1;
var NONE = 0;
function getCurrentTarget(ev) {
  return ev.currentTarget;
}
var GlobalEvent = class {
  static get BUBBLING_PHASE() {
    return BUBBLING_PHASE;
  }
  static get AT_TARGET() {
    return AT_TARGET;
  }
  static get CAPTURING_PHASE() {
    return CAPTURING_PHASE;
  }
  static get NONE() {
    return NONE;
  }
  constructor(type, eventInitDict = {}) {
    this.type = type;
    this.bubbles = !!eventInitDict.bubbles;
    this.cancelBubble = false;
    this._stopImmediatePropagationFlag = false;
    this.cancelable = !!eventInitDict.cancelable;
    this.eventPhase = this.NONE;
    this.timeStamp = Date.now();
    this.defaultPrevented = false;
    this.originalTarget = null;
    this.returnValue = null;
    this.srcElement = null;
    this.target = null;
    this._path = [];
  }
  get BUBBLING_PHASE() {
    return BUBBLING_PHASE;
  }
  get AT_TARGET() {
    return AT_TARGET;
  }
  get CAPTURING_PHASE() {
    return CAPTURING_PHASE;
  }
  get NONE() {
    return NONE;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  // simplified implementation, should be https://dom.spec.whatwg.org/#dom-event-composedpath
  composedPath() {
    return this._path.map(getCurrentTarget);
  }
  stopPropagation() {
    this.cancelBubble = true;
  }
  stopImmediatePropagation() {
    this.stopPropagation();
    this._stopImmediatePropagationFlag = true;
  }
};

// node_modules/linkedom/esm/interface/named-node-map.js
var NamedNodeMap = class extends Array {
  constructor(ownerElement) {
    super();
    this.ownerElement = ownerElement;
  }
  getNamedItem(name) {
    return this.ownerElement.getAttributeNode(name);
  }
  setNamedItem(attr) {
    this.ownerElement.setAttributeNode(attr);
    this.unshift(attr);
  }
  removeNamedItem(name) {
    const item = this.getNamedItem(name);
    this.ownerElement.removeAttribute(name);
    this.splice(this.indexOf(item), 1);
  }
  item(index) {
    return index < this.length ? this[index] : null;
  }
  /* c8 ignore start */
  getNamedItemNS(_, name) {
    return this.getNamedItem(name);
  }
  setNamedItemNS(_, attr) {
    return this.setNamedItem(attr);
  }
  removeNamedItemNS(_, name) {
    return this.removeNamedItem(name);
  }
  /* c8 ignore stop */
};

// node_modules/linkedom/esm/interface/shadow-root.js
var ShadowRoot = class extends NonElementParentNode {
  constructor(host) {
    super(host.ownerDocument, "#shadow-root", DOCUMENT_FRAGMENT_NODE);
    this.host = host;
  }
  get innerHTML() {
    return getInnerHtml(this);
  }
  set innerHTML(html) {
    setInnerHtml(this, html);
  }
};

// node_modules/linkedom/esm/interface/element.js
var attributesHandler = {
  get(target, key2) {
    return key2 in target ? target[key2] : target.find(({ name }) => name === key2);
  }
};
var create2 = (ownerDocument, element, localName) => {
  if ("ownerSVGElement" in element) {
    const svg = ownerDocument.createElementNS(SVG_NAMESPACE, localName);
    svg.ownerSVGElement = element.ownerSVGElement;
    return svg;
  }
  return ownerDocument.createElement(localName);
};
var isVoid = ({ localName, ownerDocument }) => {
  return ownerDocument[MIME].voidElements.test(localName);
};
var Element2 = class extends ParentNode {
  constructor(ownerDocument, localName) {
    super(ownerDocument, localName, ELEMENT_NODE);
    this[CLASS_LIST] = null;
    this[DATASET] = null;
    this[STYLE] = null;
  }
  // <Mixins>
  get isConnected() {
    return isConnected(this);
  }
  get parentElement() {
    return parentElement(this);
  }
  get previousSibling() {
    return previousSibling(this);
  }
  get nextSibling() {
    return nextSibling(this);
  }
  get namespaceURI() {
    return "http://www.w3.org/1999/xhtml";
  }
  get previousElementSibling() {
    return previousElementSibling(this);
  }
  get nextElementSibling() {
    return nextElementSibling2(this);
  }
  before(...nodes) {
    before(this, nodes);
  }
  after(...nodes) {
    after(this, nodes);
  }
  replaceWith(...nodes) {
    replaceWith(this, nodes);
  }
  remove() {
    remove(this[PREV], this, this[END][NEXT]);
  }
  // </Mixins>
  // <specialGetters>
  get id() {
    return stringAttribute.get(this, "id");
  }
  set id(value) {
    stringAttribute.set(this, "id", value);
  }
  get className() {
    return this.classList.value;
  }
  set className(value) {
    const { classList } = this;
    classList.clear();
    classList.add(...$String(value).split(/\s+/));
  }
  get nodeName() {
    return localCase(this);
  }
  get tagName() {
    return localCase(this);
  }
  get classList() {
    return this[CLASS_LIST] || (this[CLASS_LIST] = new DOMTokenList(this));
  }
  get dataset() {
    return this[DATASET] || (this[DATASET] = new DOMStringMap(this));
  }
  getBoundingClientRect() {
    return {
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    };
  }
  get nonce() {
    return stringAttribute.get(this, "nonce");
  }
  set nonce(value) {
    stringAttribute.set(this, "nonce", value);
  }
  get style() {
    return this[STYLE] || (this[STYLE] = new CSSStyleDeclaration(this));
  }
  get tabIndex() {
    return numericAttribute.get(this, "tabindex") || -1;
  }
  set tabIndex(value) {
    numericAttribute.set(this, "tabindex", value);
  }
  get slot() {
    return stringAttribute.get(this, "slot");
  }
  set slot(value) {
    stringAttribute.set(this, "slot", value);
  }
  // </specialGetters>
  // <contentRelated>
  get innerText() {
    const text = [];
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      if (next.nodeType === TEXT_NODE) {
        text.push(next.textContent.replace(/\s+/g, " "));
      } else if (text.length && next[NEXT] != end && BLOCK_ELEMENTS.has(next.tagName)) {
        text.push("\n");
      }
      next = next[NEXT];
    }
    return text.join("");
  }
  /**
   * @returns {String}
   */
  get textContent() {
    const text = [];
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      const nodeType = next.nodeType;
      if (nodeType === TEXT_NODE || nodeType === CDATA_SECTION_NODE)
        text.push(next.textContent);
      next = next[NEXT];
    }
    return text.join("");
  }
  set textContent(text) {
    this.replaceChildren();
    if (text != null && text !== "")
      this.appendChild(new Text3(this.ownerDocument, text));
  }
  get innerHTML() {
    return getInnerHtml(this);
  }
  set innerHTML(html) {
    setInnerHtml(this, html);
  }
  get outerHTML() {
    return this.toString();
  }
  set outerHTML(html) {
    const template = this.ownerDocument.createElement("");
    template.innerHTML = html;
    this.replaceWith(...template.childNodes);
  }
  // </contentRelated>
  // <attributes>
  get attributes() {
    const attributes2 = new NamedNodeMap(this);
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      attributes2.push(next);
      next = next[NEXT];
    }
    return new Proxy(attributes2, attributesHandler);
  }
  focus() {
    this.dispatchEvent(new GlobalEvent("focus"));
  }
  getAttribute(name) {
    if (name === "class")
      return this.className;
    const attribute2 = this.getAttributeNode(name);
    return attribute2 && (ignoreCase(this) ? attribute2.value : escape2(attribute2.value));
  }
  getAttributeNode(name) {
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      if (next.name === name)
        return next;
      next = next[NEXT];
    }
    return null;
  }
  getAttributeNames() {
    const attributes2 = new NodeList();
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      attributes2.push(next.name);
      next = next[NEXT];
    }
    return attributes2;
  }
  hasAttribute(name) {
    return !!this.getAttributeNode(name);
  }
  hasAttributes() {
    return this[NEXT].nodeType === ATTRIBUTE_NODE;
  }
  removeAttribute(name) {
    if (name === "class" && this[CLASS_LIST])
      this[CLASS_LIST].clear();
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      if (next.name === name) {
        removeAttribute(this, next);
        return;
      }
      next = next[NEXT];
    }
  }
  removeAttributeNode(attribute2) {
    let next = this[NEXT];
    while (next.nodeType === ATTRIBUTE_NODE) {
      if (next === attribute2) {
        removeAttribute(this, next);
        return;
      }
      next = next[NEXT];
    }
  }
  setAttribute(name, value) {
    if (name === "class")
      this.className = value;
    else {
      const attribute2 = this.getAttributeNode(name);
      if (attribute2)
        attribute2.value = value;
      else
        setAttribute(this, new Attr(this.ownerDocument, name, value));
    }
  }
  setAttributeNode(attribute2) {
    const { name } = attribute2;
    const previously = this.getAttributeNode(name);
    if (previously !== attribute2) {
      if (previously)
        this.removeAttributeNode(previously);
      const { ownerElement } = attribute2;
      if (ownerElement)
        ownerElement.removeAttributeNode(attribute2);
      setAttribute(this, attribute2);
    }
    return previously;
  }
  toggleAttribute(name, force) {
    if (this.hasAttribute(name)) {
      if (!force) {
        this.removeAttribute(name);
        return false;
      }
      return true;
    } else if (force || arguments.length === 1) {
      this.setAttribute(name, "");
      return true;
    }
    return false;
  }
  // </attributes>
  // <ShadowDOM>
  get shadowRoot() {
    if (shadowRoots.has(this)) {
      const { mode, shadowRoot } = shadowRoots.get(this);
      if (mode === "open")
        return shadowRoot;
    }
    return null;
  }
  attachShadow(init) {
    if (shadowRoots.has(this))
      throw new Error("operation not supported");
    const shadowRoot = new ShadowRoot(this);
    shadowRoots.set(this, {
      mode: init.mode,
      shadowRoot
    });
    return shadowRoot;
  }
  // </ShadowDOM>
  // <selectors>
  matches(selectors) {
    return matches(this, selectors);
  }
  closest(selectors) {
    let parentElement2 = this;
    const matches2 = prepareMatch(parentElement2, selectors);
    while (parentElement2 && !matches2(parentElement2))
      parentElement2 = parentElement2.parentElement;
    return parentElement2;
  }
  // </selectors>
  // <insertAdjacent>
  insertAdjacentElement(position, element) {
    const { parentElement: parentElement2 } = this;
    switch (position) {
      case "beforebegin":
        if (parentElement2) {
          parentElement2.insertBefore(element, this);
          break;
        }
        return null;
      case "afterbegin":
        this.insertBefore(element, this.firstChild);
        break;
      case "beforeend":
        this.insertBefore(element, null);
        break;
      case "afterend":
        if (parentElement2) {
          parentElement2.insertBefore(element, this.nextSibling);
          break;
        }
        return null;
    }
    return element;
  }
  insertAdjacentHTML(position, html) {
    this.insertAdjacentElement(position, htmlToFragment(this.ownerDocument, html));
  }
  insertAdjacentText(position, text) {
    const node = this.ownerDocument.createTextNode(text);
    this.insertAdjacentElement(position, node);
  }
  // </insertAdjacent>
  cloneNode(deep = false) {
    const { ownerDocument, localName } = this;
    const addNext = (next2) => {
      next2.parentNode = parentNode;
      knownAdjacent($next, next2);
      $next = next2;
    };
    const clone = create2(ownerDocument, this, localName);
    let parentNode = clone, $next = clone;
    let { [NEXT]: next, [END]: prev } = this;
    while (next !== prev && (deep || next.nodeType === ATTRIBUTE_NODE)) {
      switch (next.nodeType) {
        case NODE_END:
          knownAdjacent($next, parentNode[END]);
          $next = parentNode[END];
          parentNode = parentNode.parentNode;
          break;
        case ELEMENT_NODE: {
          const node = create2(ownerDocument, next, next.localName);
          addNext(node);
          parentNode = node;
          break;
        }
        case ATTRIBUTE_NODE: {
          const attr = next.cloneNode(deep);
          attr.ownerElement = parentNode;
          addNext(attr);
          break;
        }
        case TEXT_NODE:
        case COMMENT_NODE:
        case CDATA_SECTION_NODE:
          addNext(next.cloneNode(deep));
          break;
      }
      next = next[NEXT];
    }
    knownAdjacent($next, clone[END]);
    return clone;
  }
  // <custom>
  toString() {
    const out = [];
    const { [END]: end } = this;
    let next = { [NEXT]: this };
    let isOpened = false;
    do {
      next = next[NEXT];
      switch (next.nodeType) {
        case ATTRIBUTE_NODE: {
          const attr = " " + next;
          switch (attr) {
            case " id":
            case " class":
            case " style":
              break;
            default:
              out.push(attr);
          }
          break;
        }
        case NODE_END: {
          const start = next[START];
          if (isOpened) {
            if ("ownerSVGElement" in start)
              out.push(" />");
            else if (isVoid(start))
              out.push(ignoreCase(start) ? ">" : " />");
            else
              out.push(`></${start.localName}>`);
            isOpened = false;
          } else
            out.push(`</${start.localName}>`);
          break;
        }
        case ELEMENT_NODE:
          if (isOpened)
            out.push(">");
          if (next.toString !== this.toString) {
            out.push(next.toString());
            next = next[END];
            isOpened = false;
          } else {
            out.push(`<${next.localName}`);
            isOpened = true;
          }
          break;
        case TEXT_NODE:
        case COMMENT_NODE:
        case CDATA_SECTION_NODE:
          out.push((isOpened ? ">" : "") + next);
          isOpened = false;
          break;
      }
    } while (next !== end);
    return out.join("");
  }
  toJSON() {
    const json = [];
    elementAsJSON(this, json);
    return json;
  }
  // </custom>
  /* c8 ignore start */
  getAttributeNS(_, name) {
    return this.getAttribute(name);
  }
  getElementsByTagNameNS(_, name) {
    return this.getElementsByTagName(name);
  }
  hasAttributeNS(_, name) {
    return this.hasAttribute(name);
  }
  removeAttributeNS(_, name) {
    this.removeAttribute(name);
  }
  setAttributeNS(_, name, value) {
    this.setAttribute(name, value);
  }
  setAttributeNodeNS(attr) {
    return this.setAttributeNode(attr);
  }
  /* c8 ignore stop */
};

// node_modules/linkedom/esm/svg/element.js
var classNames = /* @__PURE__ */ new WeakMap();
var handler3 = {
  get(target, name) {
    return target[name];
  },
  set(target, name, value) {
    target[name] = value;
    return true;
  }
};
var SVGElement = class extends Element2 {
  constructor(ownerDocument, localName, ownerSVGElement = null) {
    super(ownerDocument, localName);
    this.ownerSVGElement = ownerSVGElement;
  }
  get className() {
    if (!classNames.has(this))
      classNames.set(this, new Proxy({ baseVal: "", animVal: "" }, handler3));
    return classNames.get(this);
  }
  /* c8 ignore start */
  set className(value) {
    const { classList } = this;
    classList.clear();
    classList.add(...$String(value).split(/\s+/));
  }
  /* c8 ignore stop */
  get namespaceURI() {
    return "http://www.w3.org/2000/svg";
  }
  getAttribute(name) {
    return name === "class" ? [...this.classList].join(" ") : super.getAttribute(name);
  }
  setAttribute(name, value) {
    if (name === "class")
      this.className = value;
    else if (name === "style") {
      const { className } = this;
      className.baseVal = className.animVal = value;
    }
    super.setAttribute(name, value);
  }
};

// node_modules/linkedom/esm/shared/facades.js
var illegalConstructor = () => {
  throw new TypeError("Illegal constructor");
};
function Attr2() {
  illegalConstructor();
}
setPrototypeOf(Attr2, Attr);
Attr2.prototype = Attr.prototype;
function CDATASection2() {
  illegalConstructor();
}
setPrototypeOf(CDATASection2, CDATASection);
CDATASection2.prototype = CDATASection.prototype;
function CharacterData2() {
  illegalConstructor();
}
setPrototypeOf(CharacterData2, CharacterData);
CharacterData2.prototype = CharacterData.prototype;
function Comment4() {
  illegalConstructor();
}
setPrototypeOf(Comment4, Comment3);
Comment4.prototype = Comment3.prototype;
function DocumentFragment2() {
  illegalConstructor();
}
setPrototypeOf(DocumentFragment2, DocumentFragment);
DocumentFragment2.prototype = DocumentFragment.prototype;
function DocumentType2() {
  illegalConstructor();
}
setPrototypeOf(DocumentType2, DocumentType);
DocumentType2.prototype = DocumentType.prototype;
function Element3() {
  illegalConstructor();
}
setPrototypeOf(Element3, Element2);
Element3.prototype = Element2.prototype;
function Node3() {
  illegalConstructor();
}
setPrototypeOf(Node3, Node2);
Node3.prototype = Node2.prototype;
function ShadowRoot2() {
  illegalConstructor();
}
setPrototypeOf(ShadowRoot2, ShadowRoot);
ShadowRoot2.prototype = ShadowRoot.prototype;
function Text4() {
  illegalConstructor();
}
setPrototypeOf(Text4, Text3);
Text4.prototype = Text3.prototype;
function SVGElement2() {
  illegalConstructor();
}
setPrototypeOf(SVGElement2, SVGElement);
SVGElement2.prototype = SVGElement.prototype;
var Facades = {
  Attr: Attr2,
  CDATASection: CDATASection2,
  CharacterData: CharacterData2,
  Comment: Comment4,
  DocumentFragment: DocumentFragment2,
  DocumentType: DocumentType2,
  Element: Element3,
  Node: Node3,
  ShadowRoot: ShadowRoot2,
  Text: Text4,
  SVGElement: SVGElement2
};

// node_modules/linkedom/esm/html/element.js
var Level0 = /* @__PURE__ */ new WeakMap();
var level0 = {
  get(element, name) {
    return Level0.has(element) && Level0.get(element)[name] || null;
  },
  set(element, name, value) {
    if (!Level0.has(element))
      Level0.set(element, {});
    const handlers = Level0.get(element);
    const type = name.slice(2);
    if (handlers[name])
      element.removeEventListener(type, handlers[name], false);
    if (handlers[name] = value)
      element.addEventListener(type, value, false);
  }
};
var HTMLElement = class extends Element2 {
  static get observedAttributes() {
    return [];
  }
  constructor(ownerDocument = null, localName = "") {
    super(ownerDocument, localName);
    const ownerLess = !ownerDocument;
    let options;
    if (ownerLess) {
      const { constructor: Class } = this;
      if (!Classes.has(Class))
        throw new Error("unable to initialize this Custom Element");
      ({ ownerDocument, localName, options } = Classes.get(Class));
    }
    if (ownerDocument[UPGRADE]) {
      const { element, values } = ownerDocument[UPGRADE];
      ownerDocument[UPGRADE] = null;
      for (const [key2, value] of values)
        element[key2] = value;
      return element;
    }
    if (ownerLess) {
      this.ownerDocument = this[END].ownerDocument = ownerDocument;
      this.localName = localName;
      customElements.set(this, { connected: false });
      if (options.is)
        this.setAttribute("is", options.is);
    }
  }
  /* c8 ignore start */
  /* TODO: what about these?
  offsetHeight
  offsetLeft
  offsetParent
  offsetTop
  offsetWidth
  */
  blur() {
    this.dispatchEvent(new GlobalEvent("blur"));
  }
  click() {
    const clickEvent = new GlobalEvent("click", { bubbles: true, cancelable: true });
    clickEvent.button = 0;
    this.dispatchEvent(clickEvent);
  }
  // Boolean getters
  get accessKeyLabel() {
    const { accessKey } = this;
    return accessKey && `Alt+Shift+${accessKey}`;
  }
  get isContentEditable() {
    return this.hasAttribute("contenteditable");
  }
  // Boolean Accessors
  get contentEditable() {
    return booleanAttribute.get(this, "contenteditable");
  }
  set contentEditable(value) {
    booleanAttribute.set(this, "contenteditable", value);
  }
  get draggable() {
    return booleanAttribute.get(this, "draggable");
  }
  set draggable(value) {
    booleanAttribute.set(this, "draggable", value);
  }
  get hidden() {
    return booleanAttribute.get(this, "hidden");
  }
  set hidden(value) {
    booleanAttribute.set(this, "hidden", value);
  }
  get spellcheck() {
    return booleanAttribute.get(this, "spellcheck");
  }
  set spellcheck(value) {
    booleanAttribute.set(this, "spellcheck", value);
  }
  // String Accessors
  get accessKey() {
    return stringAttribute.get(this, "accesskey");
  }
  set accessKey(value) {
    stringAttribute.set(this, "accesskey", value);
  }
  get dir() {
    return stringAttribute.get(this, "dir");
  }
  set dir(value) {
    stringAttribute.set(this, "dir", value);
  }
  get lang() {
    return stringAttribute.get(this, "lang");
  }
  set lang(value) {
    stringAttribute.set(this, "lang", value);
  }
  get title() {
    return stringAttribute.get(this, "title");
  }
  set title(value) {
    stringAttribute.set(this, "title", value);
  }
  // DOM Level 0
  get onabort() {
    return level0.get(this, "onabort");
  }
  set onabort(value) {
    level0.set(this, "onabort", value);
  }
  get onblur() {
    return level0.get(this, "onblur");
  }
  set onblur(value) {
    level0.set(this, "onblur", value);
  }
  get oncancel() {
    return level0.get(this, "oncancel");
  }
  set oncancel(value) {
    level0.set(this, "oncancel", value);
  }
  get oncanplay() {
    return level0.get(this, "oncanplay");
  }
  set oncanplay(value) {
    level0.set(this, "oncanplay", value);
  }
  get oncanplaythrough() {
    return level0.get(this, "oncanplaythrough");
  }
  set oncanplaythrough(value) {
    level0.set(this, "oncanplaythrough", value);
  }
  get onchange() {
    return level0.get(this, "onchange");
  }
  set onchange(value) {
    level0.set(this, "onchange", value);
  }
  get onclick() {
    return level0.get(this, "onclick");
  }
  set onclick(value) {
    level0.set(this, "onclick", value);
  }
  get onclose() {
    return level0.get(this, "onclose");
  }
  set onclose(value) {
    level0.set(this, "onclose", value);
  }
  get oncontextmenu() {
    return level0.get(this, "oncontextmenu");
  }
  set oncontextmenu(value) {
    level0.set(this, "oncontextmenu", value);
  }
  get oncuechange() {
    return level0.get(this, "oncuechange");
  }
  set oncuechange(value) {
    level0.set(this, "oncuechange", value);
  }
  get ondblclick() {
    return level0.get(this, "ondblclick");
  }
  set ondblclick(value) {
    level0.set(this, "ondblclick", value);
  }
  get ondrag() {
    return level0.get(this, "ondrag");
  }
  set ondrag(value) {
    level0.set(this, "ondrag", value);
  }
  get ondragend() {
    return level0.get(this, "ondragend");
  }
  set ondragend(value) {
    level0.set(this, "ondragend", value);
  }
  get ondragenter() {
    return level0.get(this, "ondragenter");
  }
  set ondragenter(value) {
    level0.set(this, "ondragenter", value);
  }
  get ondragleave() {
    return level0.get(this, "ondragleave");
  }
  set ondragleave(value) {
    level0.set(this, "ondragleave", value);
  }
  get ondragover() {
    return level0.get(this, "ondragover");
  }
  set ondragover(value) {
    level0.set(this, "ondragover", value);
  }
  get ondragstart() {
    return level0.get(this, "ondragstart");
  }
  set ondragstart(value) {
    level0.set(this, "ondragstart", value);
  }
  get ondrop() {
    return level0.get(this, "ondrop");
  }
  set ondrop(value) {
    level0.set(this, "ondrop", value);
  }
  get ondurationchange() {
    return level0.get(this, "ondurationchange");
  }
  set ondurationchange(value) {
    level0.set(this, "ondurationchange", value);
  }
  get onemptied() {
    return level0.get(this, "onemptied");
  }
  set onemptied(value) {
    level0.set(this, "onemptied", value);
  }
  get onended() {
    return level0.get(this, "onended");
  }
  set onended(value) {
    level0.set(this, "onended", value);
  }
  get onerror() {
    return level0.get(this, "onerror");
  }
  set onerror(value) {
    level0.set(this, "onerror", value);
  }
  get onfocus() {
    return level0.get(this, "onfocus");
  }
  set onfocus(value) {
    level0.set(this, "onfocus", value);
  }
  get oninput() {
    return level0.get(this, "oninput");
  }
  set oninput(value) {
    level0.set(this, "oninput", value);
  }
  get oninvalid() {
    return level0.get(this, "oninvalid");
  }
  set oninvalid(value) {
    level0.set(this, "oninvalid", value);
  }
  get onkeydown() {
    return level0.get(this, "onkeydown");
  }
  set onkeydown(value) {
    level0.set(this, "onkeydown", value);
  }
  get onkeypress() {
    return level0.get(this, "onkeypress");
  }
  set onkeypress(value) {
    level0.set(this, "onkeypress", value);
  }
  get onkeyup() {
    return level0.get(this, "onkeyup");
  }
  set onkeyup(value) {
    level0.set(this, "onkeyup", value);
  }
  get onload() {
    return level0.get(this, "onload");
  }
  set onload(value) {
    level0.set(this, "onload", value);
  }
  get onloadeddata() {
    return level0.get(this, "onloadeddata");
  }
  set onloadeddata(value) {
    level0.set(this, "onloadeddata", value);
  }
  get onloadedmetadata() {
    return level0.get(this, "onloadedmetadata");
  }
  set onloadedmetadata(value) {
    level0.set(this, "onloadedmetadata", value);
  }
  get onloadstart() {
    return level0.get(this, "onloadstart");
  }
  set onloadstart(value) {
    level0.set(this, "onloadstart", value);
  }
  get onmousedown() {
    return level0.get(this, "onmousedown");
  }
  set onmousedown(value) {
    level0.set(this, "onmousedown", value);
  }
  get onmouseenter() {
    return level0.get(this, "onmouseenter");
  }
  set onmouseenter(value) {
    level0.set(this, "onmouseenter", value);
  }
  get onmouseleave() {
    return level0.get(this, "onmouseleave");
  }
  set onmouseleave(value) {
    level0.set(this, "onmouseleave", value);
  }
  get onmousemove() {
    return level0.get(this, "onmousemove");
  }
  set onmousemove(value) {
    level0.set(this, "onmousemove", value);
  }
  get onmouseout() {
    return level0.get(this, "onmouseout");
  }
  set onmouseout(value) {
    level0.set(this, "onmouseout", value);
  }
  get onmouseover() {
    return level0.get(this, "onmouseover");
  }
  set onmouseover(value) {
    level0.set(this, "onmouseover", value);
  }
  get onmouseup() {
    return level0.get(this, "onmouseup");
  }
  set onmouseup(value) {
    level0.set(this, "onmouseup", value);
  }
  get onmousewheel() {
    return level0.get(this, "onmousewheel");
  }
  set onmousewheel(value) {
    level0.set(this, "onmousewheel", value);
  }
  get onpause() {
    return level0.get(this, "onpause");
  }
  set onpause(value) {
    level0.set(this, "onpause", value);
  }
  get onplay() {
    return level0.get(this, "onplay");
  }
  set onplay(value) {
    level0.set(this, "onplay", value);
  }
  get onplaying() {
    return level0.get(this, "onplaying");
  }
  set onplaying(value) {
    level0.set(this, "onplaying", value);
  }
  get onprogress() {
    return level0.get(this, "onprogress");
  }
  set onprogress(value) {
    level0.set(this, "onprogress", value);
  }
  get onratechange() {
    return level0.get(this, "onratechange");
  }
  set onratechange(value) {
    level0.set(this, "onratechange", value);
  }
  get onreset() {
    return level0.get(this, "onreset");
  }
  set onreset(value) {
    level0.set(this, "onreset", value);
  }
  get onresize() {
    return level0.get(this, "onresize");
  }
  set onresize(value) {
    level0.set(this, "onresize", value);
  }
  get onscroll() {
    return level0.get(this, "onscroll");
  }
  set onscroll(value) {
    level0.set(this, "onscroll", value);
  }
  get onseeked() {
    return level0.get(this, "onseeked");
  }
  set onseeked(value) {
    level0.set(this, "onseeked", value);
  }
  get onseeking() {
    return level0.get(this, "onseeking");
  }
  set onseeking(value) {
    level0.set(this, "onseeking", value);
  }
  get onselect() {
    return level0.get(this, "onselect");
  }
  set onselect(value) {
    level0.set(this, "onselect", value);
  }
  get onshow() {
    return level0.get(this, "onshow");
  }
  set onshow(value) {
    level0.set(this, "onshow", value);
  }
  get onstalled() {
    return level0.get(this, "onstalled");
  }
  set onstalled(value) {
    level0.set(this, "onstalled", value);
  }
  get onsubmit() {
    return level0.get(this, "onsubmit");
  }
  set onsubmit(value) {
    level0.set(this, "onsubmit", value);
  }
  get onsuspend() {
    return level0.get(this, "onsuspend");
  }
  set onsuspend(value) {
    level0.set(this, "onsuspend", value);
  }
  get ontimeupdate() {
    return level0.get(this, "ontimeupdate");
  }
  set ontimeupdate(value) {
    level0.set(this, "ontimeupdate", value);
  }
  get ontoggle() {
    return level0.get(this, "ontoggle");
  }
  set ontoggle(value) {
    level0.set(this, "ontoggle", value);
  }
  get onvolumechange() {
    return level0.get(this, "onvolumechange");
  }
  set onvolumechange(value) {
    level0.set(this, "onvolumechange", value);
  }
  get onwaiting() {
    return level0.get(this, "onwaiting");
  }
  set onwaiting(value) {
    level0.set(this, "onwaiting", value);
  }
  get onauxclick() {
    return level0.get(this, "onauxclick");
  }
  set onauxclick(value) {
    level0.set(this, "onauxclick", value);
  }
  get ongotpointercapture() {
    return level0.get(this, "ongotpointercapture");
  }
  set ongotpointercapture(value) {
    level0.set(this, "ongotpointercapture", value);
  }
  get onlostpointercapture() {
    return level0.get(this, "onlostpointercapture");
  }
  set onlostpointercapture(value) {
    level0.set(this, "onlostpointercapture", value);
  }
  get onpointercancel() {
    return level0.get(this, "onpointercancel");
  }
  set onpointercancel(value) {
    level0.set(this, "onpointercancel", value);
  }
  get onpointerdown() {
    return level0.get(this, "onpointerdown");
  }
  set onpointerdown(value) {
    level0.set(this, "onpointerdown", value);
  }
  get onpointerenter() {
    return level0.get(this, "onpointerenter");
  }
  set onpointerenter(value) {
    level0.set(this, "onpointerenter", value);
  }
  get onpointerleave() {
    return level0.get(this, "onpointerleave");
  }
  set onpointerleave(value) {
    level0.set(this, "onpointerleave", value);
  }
  get onpointermove() {
    return level0.get(this, "onpointermove");
  }
  set onpointermove(value) {
    level0.set(this, "onpointermove", value);
  }
  get onpointerout() {
    return level0.get(this, "onpointerout");
  }
  set onpointerout(value) {
    level0.set(this, "onpointerout", value);
  }
  get onpointerover() {
    return level0.get(this, "onpointerover");
  }
  set onpointerover(value) {
    level0.set(this, "onpointerover", value);
  }
  get onpointerup() {
    return level0.get(this, "onpointerup");
  }
  set onpointerup(value) {
    level0.set(this, "onpointerup", value);
  }
  /* c8 ignore stop */
};

// node_modules/linkedom/esm/html/template-element.js
var tagName = "template";
var HTMLTemplateElement = class extends HTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, tagName);
    const content = this.ownerDocument.createDocumentFragment();
    (this[CONTENT] = content)[PRIVATE] = this;
  }
  get content() {
    if (this.hasChildNodes() && !this[CONTENT].hasChildNodes()) {
      for (const node of this.childNodes)
        this[CONTENT].appendChild(node.cloneNode(true));
    }
    return this[CONTENT];
  }
};
registerHTMLClass(tagName, HTMLTemplateElement);

// node_modules/linkedom/esm/html/html-element.js
var HTMLHtmlElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "html") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/text-element.js
var { toString } = HTMLElement.prototype;
var TextElement = class extends HTMLElement {
  get innerHTML() {
    return this.textContent;
  }
  set innerHTML(html) {
    this.textContent = html;
  }
  toString() {
    const outerHTML = toString.call(this.cloneNode());
    return outerHTML.replace("><", () => `>${this.textContent}<`);
  }
};

// node_modules/linkedom/esm/html/script-element.js
var tagName2 = "script";
var HTMLScriptElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName2) {
    super(ownerDocument, localName);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get defer() {
    return booleanAttribute.get(this, "defer");
  }
  set defer(value) {
    booleanAttribute.set(this, "defer", value);
  }
  get crossOrigin() {
    return stringAttribute.get(this, "crossorigin");
  }
  set crossOrigin(value) {
    stringAttribute.set(this, "crossorigin", value);
  }
  get nomodule() {
    return booleanAttribute.get(this, "nomodule");
  }
  set nomodule(value) {
    booleanAttribute.set(this, "nomodule", value);
  }
  get referrerPolicy() {
    return stringAttribute.get(this, "referrerpolicy");
  }
  set referrerPolicy(value) {
    stringAttribute.set(this, "referrerpolicy", value);
  }
  get nonce() {
    return stringAttribute.get(this, "nonce");
  }
  set nonce(value) {
    stringAttribute.set(this, "nonce", value);
  }
  get async() {
    return booleanAttribute.get(this, "async");
  }
  set async(value) {
    booleanAttribute.set(this, "async", value);
  }
  get text() {
    return this.textContent;
  }
  set text(content) {
    this.textContent = content;
  }
};
registerHTMLClass(tagName2, HTMLScriptElement);

// node_modules/linkedom/esm/html/frame-element.js
var HTMLFrameElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "frame") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/i-frame-element.js
var tagName3 = "iframe";
var HTMLIFrameElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName3) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get srcdoc() {
    return stringAttribute.get(this, "srcdoc");
  }
  set srcdoc(value) {
    stringAttribute.set(this, "srcdoc", value);
  }
  get name() {
    return stringAttribute.get(this, "name");
  }
  set name(value) {
    stringAttribute.set(this, "name", value);
  }
  get allow() {
    return stringAttribute.get(this, "allow");
  }
  set allow(value) {
    stringAttribute.set(this, "allow", value);
  }
  get allowFullscreen() {
    return booleanAttribute.get(this, "allowfullscreen");
  }
  set allowFullscreen(value) {
    booleanAttribute.set(this, "allowfullscreen", value);
  }
  get referrerPolicy() {
    return stringAttribute.get(this, "referrerpolicy");
  }
  set referrerPolicy(value) {
    stringAttribute.set(this, "referrerpolicy", value);
  }
  get loading() {
    return stringAttribute.get(this, "loading");
  }
  set loading(value) {
    stringAttribute.set(this, "loading", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName3, HTMLIFrameElement);

// node_modules/linkedom/esm/html/object-element.js
var HTMLObjectElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "object") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/head-element.js
var HTMLHeadElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "head") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/body-element.js
var HTMLBodyElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "body") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/style-element.js
var import_cssom = __toESM(require_lib(), 1);
var tagName4 = "style";
var HTMLStyleElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName4) {
    super(ownerDocument, localName);
    this[SHEET] = null;
  }
  get sheet() {
    const sheet = this[SHEET];
    if (sheet !== null) {
      return sheet;
    }
    return this[SHEET] = (0, import_cssom.parse)(this.textContent);
  }
  get innerHTML() {
    return super.innerHTML || "";
  }
  set innerHTML(value) {
    super.textContent = value;
    this[SHEET] = null;
  }
  get innerText() {
    return super.innerText || "";
  }
  set innerText(value) {
    super.textContent = value;
    this[SHEET] = null;
  }
  get textContent() {
    return super.textContent || "";
  }
  set textContent(value) {
    super.textContent = value;
    this[SHEET] = null;
  }
};
registerHTMLClass(tagName4, HTMLStyleElement);

// node_modules/linkedom/esm/html/time-element.js
var HTMLTimeElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "time") {
    super(ownerDocument, localName);
  }
  /**
   * @type {string}
   */
  get dateTime() {
    return stringAttribute.get(this, "datetime");
  }
  set dateTime(value) {
    stringAttribute.set(this, "datetime", value);
  }
};
registerHTMLClass("time", HTMLTimeElement);

// node_modules/linkedom/esm/html/field-set-element.js
var HTMLFieldSetElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "fieldset") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/embed-element.js
var HTMLEmbedElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "embed") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/hr-element.js
var HTMLHRElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "hr") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/progress-element.js
var HTMLProgressElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "progress") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/paragraph-element.js
var HTMLParagraphElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "p") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/table-element.js
var HTMLTableElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "table") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/frame-set-element.js
var HTMLFrameSetElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "frameset") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/li-element.js
var HTMLLIElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "li") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/base-element.js
var HTMLBaseElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "base") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/data-list-element.js
var HTMLDataListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "datalist") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/input-element.js
var tagName5 = "input";
var HTMLInputElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName5) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get autofocus() {
    return booleanAttribute.get(this, "autofocus") || -1;
  }
  set autofocus(value) {
    booleanAttribute.set(this, "autofocus", value);
  }
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get placeholder() {
    return this.getAttribute("placeholder");
  }
  set placeholder(value) {
    this.setAttribute("placeholder", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  get value() {
    return stringAttribute.get(this, "value");
  }
  set value(value) {
    stringAttribute.set(this, "value", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName5, HTMLInputElement);

// node_modules/linkedom/esm/html/param-element.js
var HTMLParamElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "param") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/media-element.js
var HTMLMediaElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "media") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/audio-element.js
var HTMLAudioElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "audio") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/heading-element.js
var tagName6 = "h1";
var HTMLHeadingElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName6) {
    super(ownerDocument, localName);
  }
};
registerHTMLClass([tagName6, "h2", "h3", "h4", "h5", "h6"], HTMLHeadingElement);

// node_modules/linkedom/esm/html/directory-element.js
var HTMLDirectoryElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "dir") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/quote-element.js
var HTMLQuoteElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "quote") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/canvas-element.js
var import_canvas = __toESM(require_canvas(), 1);
var { createCanvas } = import_canvas.default;
var tagName7 = "canvas";
var HTMLCanvasElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName7) {
    super(ownerDocument, localName);
    this[IMAGE] = createCanvas(300, 150);
  }
  get width() {
    return this[IMAGE].width;
  }
  set width(value) {
    numericAttribute.set(this, "width", value);
    this[IMAGE].width = value;
  }
  get height() {
    return this[IMAGE].height;
  }
  set height(value) {
    numericAttribute.set(this, "height", value);
    this[IMAGE].height = value;
  }
  getContext(type) {
    return this[IMAGE].getContext(type);
  }
  toDataURL(...args) {
    return this[IMAGE].toDataURL(...args);
  }
};
registerHTMLClass(tagName7, HTMLCanvasElement);

// node_modules/linkedom/esm/html/legend-element.js
var HTMLLegendElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "legend") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/option-element.js
var tagName8 = "option";
var HTMLOptionElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName8) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get value() {
    return stringAttribute.get(this, "value");
  }
  set value(value) {
    stringAttribute.set(this, "value", value);
  }
  /* c8 ignore stop */
  get selected() {
    return booleanAttribute.get(this, "selected");
  }
  set selected(value) {
    const option = this.parentElement?.querySelector("option[selected]");
    if (option && option !== this)
      option.selected = false;
    booleanAttribute.set(this, "selected", value);
  }
};
registerHTMLClass(tagName8, HTMLOptionElement);

// node_modules/linkedom/esm/html/span-element.js
var HTMLSpanElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "span") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/meter-element.js
var HTMLMeterElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "meter") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/video-element.js
var HTMLVideoElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "video") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/table-cell-element.js
var HTMLTableCellElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "td") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/title-element.js
var tagName9 = "title";
var HTMLTitleElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName9) {
    super(ownerDocument, localName);
  }
};
registerHTMLClass(tagName9, HTMLTitleElement);

// node_modules/linkedom/esm/html/output-element.js
var HTMLOutputElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "output") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/table-row-element.js
var HTMLTableRowElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "tr") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/data-element.js
var HTMLDataElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "data") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/menu-element.js
var HTMLMenuElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "menu") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/select-element.js
var tagName10 = "select";
var HTMLSelectElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName10) {
    super(ownerDocument, localName);
  }
  get options() {
    let children = new NodeList();
    let { firstElementChild } = this;
    while (firstElementChild) {
      if (firstElementChild.tagName === "OPTGROUP")
        children.push(...firstElementChild.children);
      else
        children.push(firstElementChild);
      firstElementChild = firstElementChild.nextElementSibling;
    }
    return children;
  }
  /* c8 ignore start */
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  /* c8 ignore stop */
  get value() {
    return this.querySelector("option[selected]")?.value;
  }
};
registerHTMLClass(tagName10, HTMLSelectElement);

// node_modules/linkedom/esm/html/br-element.js
var HTMLBRElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "br") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/button-element.js
var tagName11 = "button";
var HTMLButtonElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName11) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName11, HTMLButtonElement);

// node_modules/linkedom/esm/html/map-element.js
var HTMLMapElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "map") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/opt-group-element.js
var HTMLOptGroupElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "optgroup") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/d-list-element.js
var HTMLDListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "dl") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/text-area-element.js
var tagName12 = "textarea";
var HTMLTextAreaElement = class extends TextElement {
  constructor(ownerDocument, localName = tagName12) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get placeholder() {
    return this.getAttribute("placeholder");
  }
  set placeholder(value) {
    this.setAttribute("placeholder", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  get value() {
    return this.textContent;
  }
  set value(content) {
    this.textContent = content;
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName12, HTMLTextAreaElement);

// node_modules/linkedom/esm/html/font-element.js
var HTMLFontElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "font") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/div-element.js
var HTMLDivElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "div") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/link-element.js
var tagName13 = "link";
var HTMLLinkElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName13) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  // copy paste from img.src, already covered
  get disabled() {
    return booleanAttribute.get(this, "disabled");
  }
  set disabled(value) {
    booleanAttribute.set(this, "disabled", value);
  }
  get href() {
    return stringAttribute.get(this, "href").trim();
  }
  set href(value) {
    stringAttribute.set(this, "href", value);
  }
  get hreflang() {
    return stringAttribute.get(this, "hreflang");
  }
  set hreflang(value) {
    stringAttribute.set(this, "hreflang", value);
  }
  get media() {
    return stringAttribute.get(this, "media");
  }
  set media(value) {
    stringAttribute.set(this, "media", value);
  }
  get rel() {
    return stringAttribute.get(this, "rel");
  }
  set rel(value) {
    stringAttribute.set(this, "rel", value);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName13, HTMLLinkElement);

// node_modules/linkedom/esm/html/slot-element.js
var tagName14 = "slot";
var HTMLSlotElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName14) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  assign() {
  }
  assignedNodes(options) {
    const isNamedSlot = !!this.name;
    const hostChildNodes = this.getRootNode().host?.childNodes ?? [];
    let slottables;
    if (isNamedSlot) {
      slottables = [...hostChildNodes].filter((node) => node.slot === this.name);
    } else {
      slottables = [...hostChildNodes].filter((node) => !node.slot);
    }
    if (options?.flatten) {
      const result = [];
      for (let slottable of slottables) {
        if (slottable.localName === "slot") {
          result.push(...slottable.assignedNodes({ flatten: true }));
        } else {
          result.push(slottable);
        }
      }
      slottables = result;
    }
    return slottables.length ? slottables : [...this.childNodes];
  }
  assignedElements(options) {
    const slottables = this.assignedNodes(options).filter((n) => n.nodeType === 1);
    return slottables.length ? slottables : [...this.children];
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName14, HTMLSlotElement);

// node_modules/linkedom/esm/html/form-element.js
var HTMLFormElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "form") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/image-element.js
var tagName15 = "img";
var HTMLImageElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName15) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get alt() {
    return stringAttribute.get(this, "alt");
  }
  set alt(value) {
    stringAttribute.set(this, "alt", value);
  }
  get sizes() {
    return stringAttribute.get(this, "sizes");
  }
  set sizes(value) {
    stringAttribute.set(this, "sizes", value);
  }
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get srcset() {
    return stringAttribute.get(this, "srcset");
  }
  set srcset(value) {
    stringAttribute.set(this, "srcset", value);
  }
  get title() {
    return stringAttribute.get(this, "title");
  }
  set title(value) {
    stringAttribute.set(this, "title", value);
  }
  get width() {
    return numericAttribute.get(this, "width");
  }
  set width(value) {
    numericAttribute.set(this, "width", value);
  }
  get height() {
    return numericAttribute.get(this, "height");
  }
  set height(value) {
    numericAttribute.set(this, "height", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName15, HTMLImageElement);

// node_modules/linkedom/esm/html/pre-element.js
var HTMLPreElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "pre") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/u-list-element.js
var HTMLUListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "ul") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/meta-element.js
var tagName16 = "meta";
var HTMLMetaElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName16) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get name() {
    return stringAttribute.get(this, "name");
  }
  set name(value) {
    stringAttribute.set(this, "name", value);
  }
  get httpEquiv() {
    return stringAttribute.get(this, "http-equiv");
  }
  set httpEquiv(value) {
    stringAttribute.set(this, "http-equiv", value);
  }
  get content() {
    return stringAttribute.get(this, "content");
  }
  set content(value) {
    stringAttribute.set(this, "content", value);
  }
  get charset() {
    return stringAttribute.get(this, "charset");
  }
  set charset(value) {
    stringAttribute.set(this, "charset", value);
  }
  get media() {
    return stringAttribute.get(this, "media");
  }
  set media(value) {
    stringAttribute.set(this, "media", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName16, HTMLMetaElement);

// node_modules/linkedom/esm/html/picture-element.js
var HTMLPictureElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "picture") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/area-element.js
var HTMLAreaElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "area") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/o-list-element.js
var HTMLOListElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "ol") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/table-caption-element.js
var HTMLTableCaptionElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "caption") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/anchor-element.js
var tagName17 = "a";
var HTMLAnchorElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName17) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  // copy paste from img.src, already covered
  get href() {
    return encodeURI(decodeURI(stringAttribute.get(this, "href"))).trim();
  }
  set href(value) {
    stringAttribute.set(this, "href", decodeURI(value));
  }
  get download() {
    return encodeURI(decodeURI(stringAttribute.get(this, "download")));
  }
  set download(value) {
    stringAttribute.set(this, "download", decodeURI(value));
  }
  get target() {
    return stringAttribute.get(this, "target");
  }
  set target(value) {
    stringAttribute.set(this, "target", value);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  get rel() {
    return stringAttribute.get(this, "rel");
  }
  set rel(value) {
    stringAttribute.set(this, "rel", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName17, HTMLAnchorElement);

// node_modules/linkedom/esm/html/label-element.js
var HTMLLabelElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "label") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/unknown-element.js
var HTMLUnknownElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "unknown") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/mod-element.js
var HTMLModElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "mod") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/details-element.js
var HTMLDetailsElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "details") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/source-element.js
var tagName18 = "source";
var HTMLSourceElement = class extends HTMLElement {
  constructor(ownerDocument, localName = tagName18) {
    super(ownerDocument, localName);
  }
  /* c8 ignore start */
  get src() {
    return stringAttribute.get(this, "src");
  }
  set src(value) {
    stringAttribute.set(this, "src", value);
  }
  get srcset() {
    return stringAttribute.get(this, "srcset");
  }
  set srcset(value) {
    stringAttribute.set(this, "srcset", value);
  }
  get sizes() {
    return stringAttribute.get(this, "sizes");
  }
  set sizes(value) {
    stringAttribute.set(this, "sizes", value);
  }
  get type() {
    return stringAttribute.get(this, "type");
  }
  set type(value) {
    stringAttribute.set(this, "type", value);
  }
  /* c8 ignore stop */
};
registerHTMLClass(tagName18, HTMLSourceElement);

// node_modules/linkedom/esm/html/track-element.js
var HTMLTrackElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "track") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/html/marquee-element.js
var HTMLMarqueeElement = class extends HTMLElement {
  constructor(ownerDocument, localName = "marquee") {
    super(ownerDocument, localName);
  }
};

// node_modules/linkedom/esm/shared/html-classes.js
var HTMLClasses = {
  HTMLElement,
  HTMLTemplateElement,
  HTMLHtmlElement,
  HTMLScriptElement,
  HTMLFrameElement,
  HTMLIFrameElement,
  HTMLObjectElement,
  HTMLHeadElement,
  HTMLBodyElement,
  HTMLStyleElement,
  HTMLTimeElement,
  HTMLFieldSetElement,
  HTMLEmbedElement,
  HTMLHRElement,
  HTMLProgressElement,
  HTMLParagraphElement,
  HTMLTableElement,
  HTMLFrameSetElement,
  HTMLLIElement,
  HTMLBaseElement,
  HTMLDataListElement,
  HTMLInputElement,
  HTMLParamElement,
  HTMLMediaElement,
  HTMLAudioElement,
  HTMLHeadingElement,
  HTMLDirectoryElement,
  HTMLQuoteElement,
  HTMLCanvasElement,
  HTMLLegendElement,
  HTMLOptionElement,
  HTMLSpanElement,
  HTMLMeterElement,
  HTMLVideoElement,
  HTMLTableCellElement,
  HTMLTitleElement,
  HTMLOutputElement,
  HTMLTableRowElement,
  HTMLDataElement,
  HTMLMenuElement,
  HTMLSelectElement,
  HTMLBRElement,
  HTMLButtonElement,
  HTMLMapElement,
  HTMLOptGroupElement,
  HTMLDListElement,
  HTMLTextAreaElement,
  HTMLFontElement,
  HTMLDivElement,
  HTMLLinkElement,
  HTMLSlotElement,
  HTMLFormElement,
  HTMLImageElement,
  HTMLPreElement,
  HTMLUListElement,
  HTMLMetaElement,
  HTMLPictureElement,
  HTMLAreaElement,
  HTMLOListElement,
  HTMLTableCaptionElement,
  HTMLAnchorElement,
  HTMLLabelElement,
  HTMLUnknownElement,
  HTMLModElement,
  HTMLDetailsElement,
  HTMLSourceElement,
  HTMLTrackElement,
  HTMLMarqueeElement
};

// node_modules/linkedom/esm/shared/mime.js
var voidElements2 = { test: () => true };
var Mime = {
  "text/html": {
    docType: "<!DOCTYPE html>",
    ignoreCase: true,
    voidElements: /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i
  },
  "image/svg+xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements2
  },
  "text/xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements2
  },
  "application/xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements2
  },
  "application/xhtml+xml": {
    docType: '<?xml version="1.0" encoding="utf-8"?>',
    ignoreCase: false,
    voidElements: voidElements2
  }
};

// node_modules/linkedom/esm/interface/custom-event.js
var CustomEvent = class extends GlobalEvent {
  constructor(type, eventInitDict = {}) {
    super(type, eventInitDict);
    this.detail = eventInitDict.detail;
  }
};

// node_modules/linkedom/esm/interface/input-event.js
var InputEvent = class extends GlobalEvent {
  constructor(type, inputEventInit = {}) {
    super(type, inputEventInit);
    this.inputType = inputEventInit.inputType;
    this.data = inputEventInit.data;
    this.dataTransfer = inputEventInit.dataTransfer;
    this.isComposing = inputEventInit.isComposing || false;
    this.ranges = inputEventInit.ranges;
  }
};

// node_modules/linkedom/esm/interface/image.js
var ImageClass = (ownerDocument) => (
  /**
   * @implements globalThis.Image
   */
  class Image extends HTMLImageElement {
    constructor(width, height) {
      super(ownerDocument);
      switch (arguments.length) {
        case 1:
          this.height = width;
          this.width = width;
          break;
        case 2:
          this.height = height;
          this.width = width;
          break;
      }
    }
  }
);

// node_modules/linkedom/esm/interface/range.js
var deleteContents = ({ [START]: start, [END]: end }, fragment = null) => {
  setAdjacent(start[PREV], end[NEXT]);
  do {
    const after2 = getEnd(start);
    const next = after2 === end ? after2 : after2[NEXT];
    if (fragment)
      fragment.insertBefore(start, fragment[END]);
    else
      start.remove();
    start = next;
  } while (start !== end);
};
var Range = class _Range {
  constructor() {
    this[START] = null;
    this[END] = null;
    this.commonAncestorContainer = null;
  }
  /* TODO: this is more complicated than it looks
    setStart(node, offset) {
      this[START] = node.childNodes[offset];
    }
  
    setEnd(node, offset) {
      this[END] = getEnd(node.childNodes[offset]);
    }
    //*/
  insertNode(newNode) {
    this[END].parentNode.insertBefore(newNode, this[START]);
  }
  selectNode(node) {
    this[START] = node;
    this[END] = getEnd(node);
  }
  // TODO: SVG elements should then create contextual fragments
  //       that return SVG nodes
  selectNodeContents(node) {
    this.selectNode(node);
    this.commonAncestorContainer = node;
  }
  surroundContents(parentNode) {
    parentNode.replaceChildren(this.extractContents());
  }
  setStartBefore(node) {
    this[START] = node;
  }
  setStartAfter(node) {
    this[START] = node.nextSibling;
  }
  setEndBefore(node) {
    this[END] = getEnd(node.previousSibling);
  }
  setEndAfter(node) {
    this[END] = getEnd(node);
  }
  cloneContents() {
    let { [START]: start, [END]: end } = this;
    const fragment = start.ownerDocument.createDocumentFragment();
    while (start !== end) {
      fragment.insertBefore(start.cloneNode(true), fragment[END]);
      start = getEnd(start);
      if (start !== end)
        start = start[NEXT];
    }
    return fragment;
  }
  deleteContents() {
    deleteContents(this);
  }
  extractContents() {
    const fragment = this[START].ownerDocument.createDocumentFragment();
    deleteContents(this, fragment);
    return fragment;
  }
  createContextualFragment(html) {
    const { commonAncestorContainer: doc } = this;
    const isSVG = "ownerSVGElement" in doc;
    const document2 = isSVG ? doc.ownerDocument : doc;
    let content = htmlToFragment(document2, html);
    if (isSVG) {
      const childNodes = [...content.childNodes];
      content = document2.createDocumentFragment();
      Object.setPrototypeOf(content, SVGElement.prototype);
      content.ownerSVGElement = document2;
      for (const child of childNodes) {
        Object.setPrototypeOf(child, SVGElement.prototype);
        child.ownerSVGElement = document2;
        content.appendChild(child);
      }
    } else
      this.selectNode(content);
    return content;
  }
  cloneRange() {
    const range = new _Range();
    range[START] = this[START];
    range[END] = this[END];
    return range;
  }
};

// node_modules/linkedom/esm/interface/tree-walker.js
var isOK = ({ nodeType }, mask) => {
  switch (nodeType) {
    case ELEMENT_NODE:
      return mask & SHOW_ELEMENT;
    case TEXT_NODE:
      return mask & SHOW_TEXT;
    case COMMENT_NODE:
      return mask & SHOW_COMMENT;
    case CDATA_SECTION_NODE:
      return mask & SHOW_CDATA_SECTION;
  }
  return 0;
};
var TreeWalker = class {
  constructor(root, whatToShow = SHOW_ALL) {
    this.root = root;
    this.currentNode = root;
    this.whatToShow = whatToShow;
    let { [NEXT]: next, [END]: end } = root;
    if (root.nodeType === DOCUMENT_NODE) {
      const { documentElement } = root;
      next = documentElement;
      end = documentElement[END];
    }
    const nodes = [];
    while (next && next !== end) {
      if (isOK(next, whatToShow))
        nodes.push(next);
      next = next[NEXT];
    }
    this[PRIVATE] = { i: 0, nodes };
  }
  nextNode() {
    const $ = this[PRIVATE];
    this.currentNode = $.i < $.nodes.length ? $.nodes[$.i++] : null;
    return this.currentNode;
  }
};

// node_modules/linkedom/esm/interface/document.js
var query = (method, ownerDocument, selectors) => {
  let { [NEXT]: next, [END]: end } = ownerDocument;
  return method.call({ ownerDocument, [NEXT]: next, [END]: end }, selectors);
};
var globalExports = assign(
  {},
  Facades,
  HTMLClasses,
  {
    CustomEvent,
    Event: GlobalEvent,
    EventTarget: DOMEventTarget,
    InputEvent,
    NamedNodeMap,
    NodeList
  }
);
var window2 = /* @__PURE__ */ new WeakMap();
var Document2 = class extends NonElementParentNode {
  constructor(type) {
    super(null, "#document", DOCUMENT_NODE);
    this[CUSTOM_ELEMENTS] = { active: false, registry: null };
    this[MUTATION_OBSERVER] = { active: false, class: null };
    this[MIME] = Mime[type];
    this[DOCTYPE] = null;
    this[DOM_PARSER] = null;
    this[GLOBALS] = null;
    this[IMAGE] = null;
    this[UPGRADE] = null;
  }
  /**
   * @type {globalThis.Document['defaultView']}
   */
  get defaultView() {
    if (!window2.has(this))
      window2.set(this, new Proxy(globalThis, {
        set: (target, name, value) => {
          switch (name) {
            case "addEventListener":
            case "removeEventListener":
            case "dispatchEvent":
              this[EVENT_TARGET][name] = value;
              break;
            default:
              target[name] = value;
              break;
          }
          return true;
        },
        get: (globalThis2, name) => {
          switch (name) {
            case "addEventListener":
            case "removeEventListener":
            case "dispatchEvent":
              if (!this[EVENT_TARGET]) {
                const et = this[EVENT_TARGET] = new DOMEventTarget();
                et.dispatchEvent = et.dispatchEvent.bind(et);
                et.addEventListener = et.addEventListener.bind(et);
                et.removeEventListener = et.removeEventListener.bind(et);
              }
              return this[EVENT_TARGET][name];
            case "document":
              return this;
            /* c8 ignore start */
            case "navigator":
              return {
                userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
              };
            /* c8 ignore stop */
            case "window":
              return window2.get(this);
            case "customElements":
              if (!this[CUSTOM_ELEMENTS].registry)
                this[CUSTOM_ELEMENTS] = new CustomElementRegistry(this);
              return this[CUSTOM_ELEMENTS];
            case "performance":
              return globalThis2.performance;
            case "DOMParser":
              return this[DOM_PARSER];
            case "Image":
              if (!this[IMAGE])
                this[IMAGE] = ImageClass(this);
              return this[IMAGE];
            case "MutationObserver":
              if (!this[MUTATION_OBSERVER].class)
                this[MUTATION_OBSERVER] = new MutationObserverClass(this);
              return this[MUTATION_OBSERVER].class;
          }
          return this[GLOBALS] && this[GLOBALS][name] || globalExports[name] || globalThis2[name];
        }
      }));
    return window2.get(this);
  }
  get doctype() {
    const docType = this[DOCTYPE];
    if (docType)
      return docType;
    const { firstChild } = this;
    if (firstChild && firstChild.nodeType === DOCUMENT_TYPE_NODE)
      return this[DOCTYPE] = firstChild;
    return null;
  }
  set doctype(value) {
    if (/^([a-z:]+)(\s+system|\s+public(\s+"([^"]+)")?)?(\s+"([^"]+)")?/i.test(value)) {
      const { $1: name, $4: publicId, $6: systemId } = RegExp;
      this[DOCTYPE] = new DocumentType(this, name, publicId, systemId);
      knownSiblings(this, this[DOCTYPE], this[NEXT]);
    }
  }
  get documentElement() {
    return this.firstElementChild;
  }
  get isConnected() {
    return true;
  }
  /**
   * @protected
   */
  _getParent() {
    return this[EVENT_TARGET];
  }
  createAttribute(name) {
    return new Attr(this, name);
  }
  createCDATASection(data) {
    return new CDATASection(this, data);
  }
  createComment(textContent2) {
    return new Comment3(this, textContent2);
  }
  createDocumentFragment() {
    return new DocumentFragment(this);
  }
  createDocumentType(name, publicId, systemId) {
    return new DocumentType(this, name, publicId, systemId);
  }
  createElement(localName) {
    return new Element2(this, localName);
  }
  createRange() {
    const range = new Range();
    range.commonAncestorContainer = this;
    return range;
  }
  createTextNode(textContent2) {
    return new Text3(this, textContent2);
  }
  createTreeWalker(root, whatToShow = -1) {
    return new TreeWalker(root, whatToShow);
  }
  createNodeIterator(root, whatToShow = -1) {
    return this.createTreeWalker(root, whatToShow);
  }
  createEvent(name) {
    const event = create(name === "Event" ? new GlobalEvent("") : new CustomEvent(""));
    event.initEvent = event.initCustomEvent = (type, canBubble = false, cancelable = false, detail) => {
      event.bubbles = !!canBubble;
      defineProperties(event, {
        type: { value: type },
        canBubble: { value: canBubble },
        cancelable: { value: cancelable },
        detail: { value: detail }
      });
    };
    return event;
  }
  cloneNode(deep = false) {
    const {
      constructor,
      [CUSTOM_ELEMENTS]: customElements2,
      [DOCTYPE]: doctype
    } = this;
    const document2 = new constructor();
    document2[CUSTOM_ELEMENTS] = customElements2;
    if (deep) {
      const end = document2[END];
      const { childNodes } = this;
      for (let { length } = childNodes, i = 0; i < length; i++)
        document2.insertBefore(childNodes[i].cloneNode(true), end);
      if (doctype)
        document2[DOCTYPE] = childNodes[0];
    }
    return document2;
  }
  importNode(externalNode) {
    const deep = 1 < arguments.length && !!arguments[1];
    const node = externalNode.cloneNode(deep);
    const { [CUSTOM_ELEMENTS]: customElements2 } = this;
    const { active } = customElements2;
    const upgrade = (element) => {
      const { ownerDocument, nodeType } = element;
      element.ownerDocument = this;
      if (active && ownerDocument !== this && nodeType === ELEMENT_NODE)
        customElements2.upgrade(element);
    };
    upgrade(node);
    if (deep) {
      switch (node.nodeType) {
        case ELEMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE: {
          let { [NEXT]: next, [END]: end } = node;
          while (next !== end) {
            if (next.nodeType === ELEMENT_NODE)
              upgrade(next);
            next = next[NEXT];
          }
          break;
        }
      }
    }
    return node;
  }
  toString() {
    return this.childNodes.join("");
  }
  querySelector(selectors) {
    return query(super.querySelector, this, selectors);
  }
  querySelectorAll(selectors) {
    return query(super.querySelectorAll, this, selectors);
  }
  /* c8 ignore start */
  getElementsByTagNameNS(_, name) {
    return this.getElementsByTagName(name);
  }
  createAttributeNS(_, name) {
    return this.createAttribute(name);
  }
  createElementNS(nsp, localName, options) {
    return nsp === SVG_NAMESPACE ? new SVGElement(this, localName, null) : this.createElement(localName, options);
  }
  /* c8 ignore stop */
};
setPrototypeOf(
  globalExports.Document = function Document3() {
    illegalConstructor();
  },
  Document2
).prototype = Document2.prototype;

// node_modules/linkedom/esm/html/document.js
var createHTMLElement = (ownerDocument, builtin, localName, options) => {
  if (!builtin && htmlClasses.has(localName)) {
    const Class = htmlClasses.get(localName);
    return new Class(ownerDocument, localName);
  }
  const { [CUSTOM_ELEMENTS]: { active, registry } } = ownerDocument;
  if (active) {
    const ce = builtin ? options.is : localName;
    if (registry.has(ce)) {
      const { Class } = registry.get(ce);
      const element = new Class(ownerDocument, localName);
      customElements.set(element, { connected: false });
      return element;
    }
  }
  return new HTMLElement(ownerDocument, localName);
};
var HTMLDocument = class extends Document2 {
  constructor() {
    super("text/html");
  }
  get all() {
    const nodeList = new NodeList();
    let { [NEXT]: next, [END]: end } = this;
    while (next !== end) {
      switch (next.nodeType) {
        case ELEMENT_NODE:
          nodeList.push(next);
          break;
      }
      next = next[NEXT];
    }
    return nodeList;
  }
  /**
   * @type HTMLHeadElement
   */
  get head() {
    const { documentElement } = this;
    let { firstElementChild } = documentElement;
    if (!firstElementChild || firstElementChild.tagName !== "HEAD") {
      firstElementChild = this.createElement("head");
      documentElement.prepend(firstElementChild);
    }
    return firstElementChild;
  }
  /**
   * @type HTMLBodyElement
   */
  get body() {
    const { head } = this;
    let { nextElementSibling: nextElementSibling3 } = head;
    if (!nextElementSibling3 || nextElementSibling3.tagName !== "BODY") {
      nextElementSibling3 = this.createElement("body");
      head.after(nextElementSibling3);
    }
    return nextElementSibling3;
  }
  /**
   * @type HTMLTitleElement
   */
  get title() {
    const { head } = this;
    return head.getElementsByTagName("title").at(0)?.textContent || "";
  }
  set title(textContent2) {
    const { head } = this;
    let title = head.getElementsByTagName("title").at(0);
    if (title)
      title.textContent = textContent2;
    else {
      head.insertBefore(
        this.createElement("title"),
        head.firstChild
      ).textContent = textContent2;
    }
  }
  createElement(localName, options) {
    const builtin = !!(options && options.is);
    const element = createHTMLElement(this, builtin, localName, options);
    if (builtin)
      element.setAttribute("is", options.is);
    return element;
  }
};

// node_modules/linkedom/esm/svg/document.js
var SVGDocument = class extends Document2 {
  constructor() {
    super("image/svg+xml");
  }
  toString() {
    return this[MIME].docType + super.toString();
  }
};

// node_modules/linkedom/esm/xml/document.js
var XMLDocument = class extends Document2 {
  constructor() {
    super("text/xml");
  }
  toString() {
    return this[MIME].docType + super.toString();
  }
};

// node_modules/linkedom/esm/dom/parser.js
var DOMParser2 = class _DOMParser {
  /** @typedef {{ "text/html": HTMLDocument, "image/svg+xml": SVGDocument, "text/xml": XMLDocument }} MimeToDoc */
  /**
   * @template {keyof MimeToDoc} MIME
   * @param {string} markupLanguage
   * @param {MIME} mimeType
   * @returns {MimeToDoc[MIME]}
   */
  parseFromString(markupLanguage, mimeType, globals = null) {
    let isHTML = false, document2;
    if (mimeType === "text/html") {
      isHTML = true;
      document2 = new HTMLDocument();
    } else if (mimeType === "image/svg+xml")
      document2 = new SVGDocument();
    else
      document2 = new XMLDocument();
    document2[DOM_PARSER] = _DOMParser;
    if (globals)
      document2[GLOBALS] = globals;
    if (isHTML && markupLanguage === "...")
      markupLanguage = "<!doctype html><html><head></head><body></body></html>";
    return markupLanguage ? parseFromString(document2, isHTML, markupLanguage) : document2;
  }
};

// node_modules/linkedom/esm/shared/parse-json.js
var { parse: parse5 } = JSON;

// node_modules/linkedom/esm/index.js
var parseHTML = (html, globals = null) => new DOMParser2().parseFromString(
  html,
  "text/html",
  globals
).defaultView;
function Document4() {
  illegalConstructor();
}
setPrototypeOf(Document4, Document2).prototype = Document2.prototype;

// src/render.mjs
var import_bpmn_viewer_production_min = __toESM(require_bpmn_viewer_production_min(), 1);
function buildDOM(html) {
  const { window: window3, document: document2 } = parseHTML(html);
  class SVGMatrix2 {
    constructor() {
      Object.assign(this, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
    }
    multiply(m) {
      return m;
    }
    inverse() {
      return new SVGMatrix2();
    }
    translate(x, y) {
      const m = new SVGMatrix2();
      m.e = x;
      m.f = y;
      return m;
    }
    scale(s) {
      const m = new SVGMatrix2();
      m.a = m.d = s;
      return m;
    }
    scaleNonUniform(sx, sy) {
      const m = new SVGMatrix2();
      m.a = sx;
      m.d = sy;
      return m;
    }
    rotate(r) {
      return new SVGMatrix2();
    }
    rotateFromVector(x, y) {
      return new SVGMatrix2();
    }
    flipX() {
      return new SVGMatrix2();
    }
    flipY() {
      return new SVGMatrix2();
    }
    skewX(a) {
      return new SVGMatrix2();
    }
    skewY(a) {
      return new SVGMatrix2();
    }
  }
  window3.SVGMatrix = SVGMatrix2;
  class SVGTransform {
    constructor() {
      this.type = 1;
      this.matrix = new SVGMatrix2();
      this.angle = 0;
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
  window3.SVGTransform = SVGTransform;
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
  class SVGPoint {
    constructor() {
      this.x = 0;
      this.y = 0;
    }
    matrixTransform(m) {
      return new SVGPoint();
    }
  }
  window3.SVGPoint = SVGPoint;
  const proto = window3.Element && window3.Element.prototype;
  if (proto) {
    if (!proto.getBBox) {
      proto.getBBox = function() {
        return { x: 0, y: 0, width: 100, height: 30 };
      };
    }
    if (!proto.getScreenCTM) {
      proto.getScreenCTM = function() {
        return new SVGMatrix2();
      };
    }
    if (!proto.createSVGMatrix) {
      proto.createSVGMatrix = function() {
        return new SVGMatrix2();
      };
    }
    if (!proto.createSVGTransform) {
      proto.createSVGTransform = function() {
        return new SVGTransform();
      };
    }
    if (!proto.createSVGPoint) {
      proto.createSVGPoint = function() {
        return new SVGPoint();
      };
    }
    if (!proto.createSVGTransformFromMatrix) {
      proto.createSVGTransformFromMatrix = function(m) {
        const t = new SVGTransform();
        t.matrix = m;
        return t;
      };
    }
  }
  const origCreateElementNS = document2.createElementNS?.bind(document2);
  if (origCreateElementNS) {
    document2.createElementNS = function(ns, tag) {
      const el = origCreateElementNS(ns, tag);
      if (ns === "http://www.w3.org/2000/svg") {
        if (!el.transform) {
          const list = new SVGTransformList();
          el.transform = { baseVal: list, animVal: list };
        }
        const lowerTag = tag.toLowerCase();
        if (lowerTag === "text" || lowerTag === "tspan") {
          el.getBBox = function() {
            const len = (this.textContent || "").length;
            return { x: 0, y: 0, width: len * 7, height: 14 };
          };
          el.getComputedTextLength = function() {
            return (this.textContent || "").length * 7;
          };
          el.getSubStringLength = function(startIndex, endIndex) {
            const start = Math.max(0, startIndex);
            const end = Math.min((this.textContent || "").length, endIndex);
            return Math.max(0, end - start) * 7;
          };
        }
      }
      return el;
    };
  }
  if (!window3.CSS) {
    window3.CSS = {
      escape(str) {
        let out = "";
        for (let i = 0; i < str.length; i++) {
          const c = str.charCodeAt(i);
          if (c === 0) {
            out += "\uFFFD";
            continue;
          }
          if (c >= 128 || c === 45 || c === 95 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122) {
            out += str[i];
          } else {
            out += "\\" + str[i];
          }
        }
        return out;
      }
    };
  }
  if (!window3.structuredClone) {
    window3.structuredClone = (o) => JSON.parse(JSON.stringify(o));
  }
  if (!window3.requestAnimationFrame) {
    window3.requestAnimationFrame = (fn) => setTimeout(fn, 0);
    window3.cancelAnimationFrame = clearTimeout;
  }
  return { window: window3, document: document2 };
}
function getExecutedFlows(elementRegistry, activityHistory) {
  const executedIds = new Set(
    activityHistory.filter((a) => !a.canceled && a.completed).map((a) => a.activityId)
  );
  for (const a of activityHistory) {
    if (!a.canceled) executedIds.add(a.activityId);
  }
  const executedFlows = /* @__PURE__ */ new Set();
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
var EXECUTED_COLOR = "#52B415";
var ACTIVE_COLOR = "#E67E00";
var INCIDENT_COLOR = "#CC0000";
function highlightElements(elementRegistry, activityHistory, document2) {
  const executedIds = new Set(
    activityHistory.filter((a) => !a.canceled && a.completed).map((a) => a.activityId)
  );
  const activeIds = new Set(
    activityHistory.filter((a) => !a.canceled && !a.completed).map((a) => a.activityId)
  );
  const incidentIds = new Set(
    activityHistory.filter((a) => a.incident).map((a) => a.activityId)
  );
  const executedFlows = getExecutedFlows(elementRegistry, activityHistory);
  for (const element of elementRegistry.getAll()) {
    const gfx = elementRegistry.getGraphics(element);
    if (!gfx) continue;
    const id = element.id;
    const isFlow = element.type === "bpmn:SequenceFlow";
    if (isFlow && executedFlows.has(id)) {
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
      const visual = gfx.querySelector(".djs-visual");
      const shapes = visual ? visual.querySelectorAll("circle,rect,polygon,path,ellipse") : [];
      for (const shape of shapes) {
        const existing = shape.getAttribute("style") || "";
        if (!existing.includes("stroke-opacity:0") && !existing.includes("stroke:white")) {
          shape.setAttribute(
            "style",
            existing.replace(/stroke:[^;]+/, `stroke:${EXECUTED_COLOR}`).replace(/fill:[^;]+/, "fill:hsl(94, 53%, 93%)")
          );
        }
      }
    } else if (!isFlow && incidentIds.has(id)) {
      const visual = gfx.querySelector(".djs-visual");
      const shapes = visual ? visual.querySelectorAll("circle,rect,polygon,path,ellipse") : [];
      for (const shape of shapes) {
        const existing = shape.getAttribute("style") || "";
        if (!existing.includes("stroke-opacity:0") && !existing.includes("stroke:white")) {
          shape.setAttribute(
            "style",
            existing.replace(/stroke:[^;]+/, `stroke:${INCIDENT_COLOR}`).replace(/fill:[^;]+/, "fill:hsl(0, 100%, 93%)")
          );
        }
      }
    } else if (!isFlow && activeIds.has(id)) {
      const visual = gfx.querySelector(".djs-visual");
      const shapes = visual ? visual.querySelectorAll("circle,rect,polygon,path,ellipse") : [];
      for (const shape of shapes) {
        const existing = shape.getAttribute("style") || "";
        if (!existing.includes("stroke-opacity:0") && !existing.includes("stroke:white")) {
          shape.setAttribute(
            "style",
            existing.replace(/stroke:[^;]+/, `stroke:${ACTIVE_COLOR}`).replace(/fill:[^;]+/, "fill:hsl(30, 100%, 93%)")
          );
        }
      }
    }
  }
}
async function renderBpmn(bpmnXml, activityHistory) {
  const { window: window3, document: document2 } = buildDOM(
    `<!DOCTYPE html><html><head></head><body><div id="canvas"></div></body></html>`
  );
  globalThis.document = document2;
  globalThis.window = window3;
  globalThis.self = window3;
  const container = document2.getElementById("canvas");
  const viewer = new import_bpmn_viewer_production_min.default({ container });
  await viewer.importXML(bpmnXml);
  const elementRegistry = viewer.get("elementRegistry");
  if (activityHistory && activityHistory.length > 0) {
    highlightElements(elementRegistry, activityHistory, document2);
  }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const element of elementRegistry.getAll()) {
    if (element.x !== void 0) {
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
  if (isFinite(minX)) {
    const pad = 20;
    const vbX = minX - pad, vbY = minY - pad;
    const vbW = maxX - minX + 2 * pad, vbH = maxY - minY + 2 * pad;
    svg = svg.replace(/ width="[^"]*"/, ` width="${vbW}"`).replace(/ height="[^"]*"/, ` height="${vbH}"`).replace(/ viewBox="[^"]*"/, ` viewBox="${vbX} ${vbY} ${vbW} ${vbH}"`);
  }
  svg = svg.replace(/<\/?[A-Z][A-Z0-9-]*/g, (m) => m.toLowerCase());
  return svg;
}
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
    process.stderr.write(`bpmn-render: invalid JSON input: ${e.message}
`);
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
    process.stderr.write(`bpmn-render: rendering failed: ${e.message}
${e.stack}
`);
    process.exit(1);
  }
}
main();
/*! Bundled license information:

bpmn-js/dist/bpmn-viewer.production.min.js:
  (*! bpmn-js - bpmn-viewer v17.11.1 | Copyright (c) 2014-present, camunda Services GmbH | bpmn.io/license *)
*/
