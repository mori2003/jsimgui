let E = !1;
function it(i) {
  E = i;
}
function nt() {
  return E;
}
const L = /* @__PURE__ */ new Set([
  "App",
  "Head",
  "Body",
  "Window",
  "Text",
  "Button",
  "InputText",
  "SliderFloat",
  "Checkbox",
  "SameLine",
  "Spacing",
  "Separator"
]), B = /* @__PURE__ */ new Map([
  ["App", /* @__PURE__ */ new Set()],
  ["Head", /* @__PURE__ */ new Set()],
  ["Body", /* @__PURE__ */ new Set()],
  ["Window", /* @__PURE__ */ new Set(["title", "width", "height", "id"])],
  ["Text", /* @__PURE__ */ new Set(["color", "content", "className"])],
  ["Button", /* @__PURE__ */ new Set(["onClick", "id", "width", "color"])],
  ["InputText", /* @__PURE__ */ new Set(["label", "hint", "value", "width"])],
  ["SliderFloat", /* @__PURE__ */ new Set(["label", "min", "max", "value", "width"])],
  ["Checkbox", /* @__PURE__ */ new Set(["label", "checked", "onChange", "width"])],
  ["SameLine", /* @__PURE__ */ new Set(["offset", "spacing"])],
  ["Spacing", /* @__PURE__ */ new Set()],
  ["Separator", /* @__PURE__ */ new Set()]
]), N = /* @__PURE__ */ new Set([
  "text-color",
  "button-color",
  "widget-background-color",
  "width",
  "height",
  "color",
  "background-color",
  "font-family",
  "content"
]);
function S(i) {
  return typeof i != "string" ? "" : i.replace(/[<>\"'&]/g, (t) => {
    switch (t) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#x27;";
      case "&":
        return "&amp;";
      default:
        return t;
    }
  }).trim();
}
function O(i) {
  if (typeof i != "string")
    return { isValid: !1, sanitized: "", error: "Tag name must be a string" };
  const t = S(i);
  return t.length === 0 ? { isValid: !1, sanitized: "", error: "Tag name cannot be empty" } : L.has(t) ? { isValid: !0, sanitized: t } : E ? (console.warn(`Unknown tag: ${t}`), { isValid: !0, sanitized: t }) : {
    isValid: !1,
    sanitized: "",
    error: `Tag '${t}' is not allowed. Allowed tags: ${Array.from(L).join(", ")}`
  };
}
function X(i, t) {
  if (typeof t != "string")
    return { isValid: !1, sanitized: "", error: "Attribute name must be a string" };
  const e = S(t);
  if (e.length === 0)
    return { isValid: !1, sanitized: "", error: "Attribute name cannot be empty" };
  const s = B.get(i);
  return !s || !s.has(e) ? E ? (console.warn(`Unknown attribute: ${e} for tag ${i}`), { isValid: !0, sanitized: e }) : {
    isValid: !1,
    sanitized: "",
    error: `Attribute '${e}' is not allowed for tag '${i}'. Allowed attributes: ${Array.from(s || []).join(", ")}`
  } : { isValid: !0, sanitized: e };
}
function H(i, t) {
  if (t == null)
    return { isValid: !0, sanitized: "" };
  const e = String(t), s = S(e);
  if ((i === "onClick" || i === "onChange") && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s))
    return {
      isValid: !1,
      sanitized: "",
      error: `Event handler '${s}' contains invalid characters. Only alphanumeric characters and underscores are allowed.`
    };
  if (i === "width" || i === "height") {
    const n = parseFloat(s);
    if (isNaN(n) || n < 0)
      return {
        isValid: !1,
        sanitized: "",
        error: `Attribute '${i}' must be a positive number, got '${s}'`
      };
  }
  if (i === "min" || i === "max") {
    const n = parseFloat(s);
    if (isNaN(n))
      return {
        isValid: !1,
        sanitized: "",
        error: `Attribute '${i}' must be a number, got '${s}'`
      };
  }
  return { isValid: !0, sanitized: s };
}
function D(i) {
  if (typeof i != "string")
    return { isValid: !1, sanitized: "", error: "Property name must be a string" };
  const t = S(i);
  return t.length === 0 ? { isValid: !1, sanitized: "", error: "Property name cannot be empty" } : N.has(t) ? { isValid: !0, sanitized: t } : E ? (console.warn(`Unknown property: ${t}`), { isValid: !0, sanitized: t }) : {
    isValid: !1,
    sanitized: "",
    error: `TSS property '${t}' is not allowed. Allowed properties: ${Array.from(N).join(", ")}`
  };
}
function J(i) {
  if (typeof i != "string")
    return { isValid: !1, sanitized: "", error: "Color value must be a string" };
  const t = S(i);
  return !/^0x[0-9A-Fa-f]{8}$/.test(t) && !/^#[0-9A-Fa-f]{6}$/.test(t) ? {
    isValid: !1,
    sanitized: "",
    error: `Invalid color format '${t}'. Expected format: 0xRRGGBBAA or #RRGGBB`
  } : { isValid: !0, sanitized: t };
}
function U(i) {
  if (i == null)
    return { isValid: !0, sanitized: "" };
  const t = String(i), e = S(t);
  return e.includes("javascript:") || e.includes("data:") || e.includes("vbscript:") ? {
    isValid: !1,
    sanitized: "",
    error: "Text content contains potentially dangerous protocols"
  } : { isValid: !0, sanitized: e };
}
class M extends Error {
  constructor(t, e, s) {
    super(t), this.code = e, this.context = s, this.name = "SecurityError";
  }
}
function b(i, t, e) {
  return new M(i, t, e);
}
class d extends Error {
  constructor(t, e, s) {
    super(t), this.line = e, this.column = s, this.name = "TXMLParseError";
  }
}
class Z {
  constructor(t) {
    this.xml = t, this.pos = 0, this.line = 1, this.column = 1;
  }
  parse() {
    if (this.xml = this.xml.trim(), this.pos = 0, this.line = 1, this.column = 1, this.skipWhitespace(), this.pos >= this.xml.length || this.xml[this.pos] !== "<")
      throw new d("Expected XML document to start with <", this.line, this.column);
    const t = this.parseElement();
    if (t.tag !== "App")
      throw new d("Root element must be <App>", this.line, this.column);
    if (this.skipWhitespace(), this.pos < this.xml.length)
      throw new d("Unexpected content after root element", this.line, this.column);
    return t;
  }
  parseElement() {
    if (!this.consume("<"))
      throw new d("Expected <", this.line, this.column);
    const t = this.parseTagName(), e = O(t);
    if (!e.isValid)
      throw b(
        `Security validation failed: ${e.error}`,
        "INVALID_TAG",
        { tag: t, line: this.line, column: this.column }
      );
    const s = e.sanitized, n = this.parseAttributes(), r = {};
    for (const [l, h] of Object.entries(n)) {
      const c = X(s, l);
      if (!c.isValid)
        throw b(
          `Security validation failed: ${c.error}`,
          "INVALID_ATTRIBUTE",
          { tag: s, attribute: l, line: this.line, column: this.column }
        );
      const u = H(l, h);
      if (!u.isValid)
        throw b(
          `Security validation failed: ${u.error}`,
          "INVALID_ATTRIBUTE_VALUE",
          { tag: s, attribute: l, value: h, line: this.line, column: this.column }
        );
      r[c.sanitized] = u.sanitized;
    }
    if (this.consume("/>"))
      return { tag: s, attributes: r, children: [] };
    if (!this.consume(">"))
      throw new d("Expected > or />", this.line, this.column);
    const o = this.parseChildren(s);
    if (!this.consume("</"))
      throw new d("Expected closing tag", this.line, this.column);
    const a = this.parseTagName();
    if (a !== s)
      throw new d(`Mismatched closing tag: expected </${s}> but found </${a}>`, this.line, this.column);
    if (!this.consume(">"))
      throw new d("Expected > in closing tag", this.line, this.column);
    return { tag: s, attributes: r, children: o };
  }
  parseTagName() {
    const t = this.pos;
    for (; this.pos < this.xml.length && /[a-zA-Z0-9_-]/.test(this.xml[this.pos]); )
      this.pos++, this.column++;
    return this.xml.slice(t, this.pos);
  }
  parseAttributes() {
    const t = {};
    for (this.skipWhitespace(); this.pos < this.xml.length && this.xml[this.pos] !== ">" && this.xml[this.pos] !== "/"; ) {
      const e = this.parseAttributeName();
      if (!this.consume("="))
        throw new d("Expected = after attribute name", this.line, this.column);
      const s = this.parseAttributeValue();
      t[e] = s, this.skipWhitespace();
    }
    return t;
  }
  parseAttributeName() {
    const t = this.pos;
    for (; this.pos < this.xml.length && /[a-zA-Z0-9_-]/.test(this.xml[this.pos]); )
      this.pos++, this.column++;
    return this.xml.slice(t, this.pos);
  }
  parseAttributeValue() {
    const t = this.consume('"') ? '"' : this.consume("'") ? "'" : null;
    if (!t)
      throw new d("Expected quoted attribute value", this.line, this.column);
    const e = this.pos;
    for (; this.pos < this.xml.length && this.xml[this.pos] !== t; )
      this.xml[this.pos] === `
` ? (this.line++, this.column = 1) : this.column++, this.pos++;
    if (!this.consume(t))
      throw new d("Unclosed attribute value", this.line, this.column);
    return this.xml.slice(e, this.pos - 1);
  }
  parseChildren(t) {
    const e = [];
    for (; this.pos < this.xml.length && (this.skipWhitespace(), !this.xml.startsWith("</", this.pos)); )
      if (this.xml[this.pos] === "<") {
        if (this.xml.startsWith("<!--", this.pos)) {
          this.skipComment();
          continue;
        }
        e.push(this.parseElement());
      } else {
        const s = this.parseText();
        s.trim() && e.push(s);
      }
    return e;
  }
  parseText() {
    const t = this.pos;
    for (; this.pos < this.xml.length && this.xml[this.pos] !== "<"; )
      this.xml[this.pos] === `
` ? (this.line++, this.column = 1) : this.column++, this.pos++;
    const e = this.xml.slice(t, this.pos), s = U(e);
    if (!s.isValid)
      throw b(
        `Security validation failed: ${s.error}`,
        "INVALID_TEXT_CONTENT",
        { text: e, line: this.line, column: this.column }
      );
    return s.sanitized;
  }
  skipWhitespace() {
    for (; this.pos < this.xml.length && /\s/.test(this.xml[this.pos]); )
      this.xml[this.pos] === `
` ? (this.line++, this.column = 1) : this.column++, this.pos++;
  }
  consume(t) {
    return this.xml.startsWith(t, this.pos) ? (this.pos += t.length, this.column += t.length, !0) : !1;
  }
  skipComment() {
    for (this.pos += 4, this.column += 4; this.pos < this.xml.length; ) {
      if (this.xml.startsWith("-->", this.pos)) {
        this.pos += 3, this.column += 3;
        break;
      }
      this.xml[this.pos] === `
` ? (this.line++, this.column = 1) : this.column++, this.pos++;
    }
  }
}
function q(i) {
  try {
    return !i || typeof i != "string" ? (console.error("Invalid TXML input: must be a non-empty string"), null) : new Z(i).parse();
  } catch (t) {
    const e = t instanceof Error ? t.message : String(t);
    return console.error("TXML parsing failed:", e), console.error("Input TXML:", i.substring(0, 200) + (i.length > 200 ? "..." : "")), {
      tag: "App",
      attributes: {},
      children: [{
        tag: "Body",
        attributes: {},
        children: [{
          tag: "Window",
          attributes: { title: "Error" },
          children: [{
            tag: "Text",
            attributes: {},
            children: [`TXML Parse Error: ${e}`]
          }]
        }]
      }]
    };
  }
}
class m extends Error {
  constructor(t, e, s) {
    super(t), this.line = e, this.column = s, this.name = "TSSParseError";
  }
}
class K {
  constructor(t) {
    this.tss = t, this.pos = 0, this.line = 1, this.column = 1;
  }
  parse() {
    const t = /* @__PURE__ */ new Map(), e = [];
    for (this.skipWhitespace(); this.pos < this.tss.length; ) {
      if (this.tss.startsWith("scope", this.pos)) {
        const s = this.parseScopeBlock(t);
        e.push(...s);
      } else if (this.tss[this.pos] === "@")
        this.parseAtRule();
      else {
        const s = this.parseRule(t);
        s && e.push(s);
      }
      this.skipWhitespace();
    }
    return { variables: t, rules: e };
  }
  parseScopeBlock(t) {
    const e = [];
    if (this.pos += 5, this.column += 5, this.skipWhitespace(), !this.consume("{"))
      throw new m("Expected { after scope", this.line, this.column);
    for (; this.pos < this.tss.length && this.tss[this.pos] !== "}" && (this.skipWhitespace(), this.tss[this.pos] !== "}"); ) {
      const s = this.pos;
      if (this.parseIdentifier(), this.tss[this.pos] === ":") {
        this.pos = s;
        const n = this.parseTSSVariable();
        t.set(n.name, n.value);
      } else {
        this.pos = s;
        const n = this.parseRule(t);
        n && e.push(n);
      }
      this.skipWhitespace();
    }
    if (!this.consume("}"))
      throw new m("Expected } after scope block", this.line, this.column);
    return e;
  }
  parseTSSVariable() {
    const t = this.parseIdentifier();
    if (!this.consume(":"))
      throw new m("Expected : after variable name", this.line, this.column);
    this.skipWhitespace();
    const e = this.parseValue();
    if (!this.consume(";"))
      throw new m("Expected ; after variable value", this.line, this.column);
    return { name: t, value: e };
  }
  parseRule(t) {
    const e = this.parseSelector();
    if (!e) return null;
    if (!this.consume("{"))
      throw new m("Expected { after selector", this.line, this.column);
    const s = this.parseProperties(t);
    if (!this.consume("}"))
      throw new m("Expected } after properties", this.line, this.column);
    const n = this.calculateSpecificity(e);
    return { selector: e, properties: s, specificity: n };
  }
  parseSelector() {
    const t = this.pos;
    for (; this.pos < this.tss.length && this.tss[this.pos] !== "{"; )
      this.pos++, this.column++;
    return this.tss.slice(t, this.pos).trim();
  }
  parseProperties(t = /* @__PURE__ */ new Map()) {
    const e = {};
    for (; this.pos < this.tss.length && this.tss[this.pos] !== "}" && (this.skipWhitespace(), this.tss[this.pos] !== "}"); ) {
      const s = this.parseIdentifier(), n = D(s);
      if (!n.isValid)
        throw b(
          `Security validation failed: ${n.error}`,
          "INVALID_TSS_PROPERTY",
          { property: s, line: this.line, column: this.column }
        );
      const r = n.sanitized;
      if (!this.consume(":"))
        throw new m("Expected : after property name", this.line, this.column);
      this.skipWhitespace();
      let o = this.parseValue();
      if (o = this.substituteVariables(o, t), r === "text-color" || r === "button-color" || r === "widget-background-color") {
        const a = J(o);
        if (!a.isValid)
          throw b(
            `Security validation failed: ${a.error}`,
            "INVALID_TSS_COLOR",
            { property: r, value: o, line: this.line, column: this.column }
          );
        o = a.sanitized;
      }
      if (e[r] = o, !this.consume(";"))
        throw new m("Expected ; after property value", this.line, this.column);
      this.skipWhitespace();
    }
    return e;
  }
  parseValue() {
    const t = this.pos;
    if (this.tss[this.pos] === '"' || this.tss[this.pos] === "'") {
      const e = this.tss[this.pos];
      for (this.pos++, this.column++; this.pos < this.tss.length && this.tss[this.pos] !== e; )
        this.tss[this.pos] === `
` ? (this.line++, this.column = 1) : this.column++, this.pos++;
      return this.pos < this.tss.length && (this.pos++, this.column++), this.tss.slice(t + 1, this.pos - 1);
    }
    for (; this.pos < this.tss.length && this.tss[this.pos] !== ";" && this.tss[this.pos] !== "}" && !/\s/.test(this.tss[this.pos]); )
      this.pos++, this.column++;
    return this.tss.slice(t, this.pos).trim();
  }
  parseIdentifier() {
    const t = this.pos;
    for (; this.pos < this.tss.length && /[a-zA-Z0-9_-]/.test(this.tss[this.pos]); )
      this.pos++, this.column++;
    return this.tss.slice(t, this.pos);
  }
  parseAtRule() {
    for (; this.pos < this.tss.length && this.tss[this.pos] !== ";" && this.tss[this.pos] !== "{"; )
      this.pos++, this.column++;
    if (this.tss[this.pos] === "{") {
      let t = 1;
      for (this.pos++, this.column++; this.pos < this.tss.length && t > 0; )
        this.tss[this.pos] === "{" ? t++ : this.tss[this.pos] === "}" && t--, this.tss[this.pos] === `
` ? (this.line++, this.column = 1) : this.column++, this.pos++;
    } else {
      for (; this.pos < this.tss.length && this.tss[this.pos] !== ";"; )
        this.pos++, this.column++;
      this.pos < this.tss.length && (this.pos++, this.column++);
    }
  }
  calculateSpecificity(t) {
    let e = 0;
    const s = t.split(/\s+/);
    for (const n of s)
      n.startsWith("#") ? e += 100 : n.startsWith(".") ? e += 10 : n.match(/^[a-zA-Z]/) && (e += 1);
    return e;
  }
  skipWhitespace() {
    for (; this.pos < this.tss.length; )
      if (/\s/.test(this.tss[this.pos]))
        this.tss[this.pos] === `
` ? (this.line++, this.column = 1) : this.column++, this.pos++;
      else if (this.tss.startsWith("/*", this.pos)) {
        for (this.pos += 2, this.column += 2; this.pos < this.tss.length && !this.tss.startsWith("*/", this.pos); )
          this.tss[this.pos] === `
` ? (this.line++, this.column = 1) : this.column++, this.pos++;
        this.tss.startsWith("*/", this.pos) && (this.pos += 2, this.column += 2);
      } else
        break;
  }
  substituteVariables(t, e) {
    let s = t;
    for (const [n, r] of e) {
      const o = new RegExp(`\\b${n}\\b`, "g");
      s = s.replace(o, r);
    }
    return s;
  }
  consume(t) {
    return this.tss.startsWith(t, this.pos) ? (this.pos += t.length, this.column += t.length, !0) : !1;
  }
}
function Y(i) {
  try {
    return new K(i).parse();
  } catch (t) {
    return console.error("TSS parsing failed:", t), null;
  }
}
class C {
  constructor() {
    this.state = /* @__PURE__ */ new Map(), this.frameNumber = 0;
  }
  createContext(t, e) {
    return {
      state: this.state,
      eventHandlers: e,
      stylesheet: t,
      frameNumber: this.frameNumber,
      currentPath: []
    };
  }
  beginFrame() {
    this.frameNumber++;
  }
  endFrame() {
    const t = this.frameNumber - 10;
    for (const [e, s] of this.state.entries())
      s.lastFrame < t && this.state.delete(e);
  }
  generateStableId(t, e) {
    if (t.attributes.id)
      return t.attributes.id;
    const s = [...e.currentPath, t.tag], n = e.currentPath.join("/"), o = this.getSiblingsAtPath(n, t.tag).indexOf(t);
    return o > 0 && s.push(o.toString()), s.join("/");
  }
  getWidgetState(t, e) {
    this.state.has(t) || this.state.set(t, {
      id: t,
      value: e,
      lastFrame: this.frameNumber
    });
    const s = this.state.get(t);
    return s.lastFrame = this.frameNumber, s;
  }
  setWidgetState(t, e) {
    const s = this.getWidgetState(t, e);
    s.value = e, s.lastFrame = this.frameNumber;
  }
  getSiblingsAtPath(t, e) {
    return [];
  }
}
function ot() {
  return new C();
}
class G {
  constructor(t) {
    this.stylesheet = t;
  }
  computeStyle(t, e) {
    const s = {}, n = this.getApplicableRules(t, e);
    n.sort((r, o) => r.specificity - o.specificity);
    for (const r of n)
      for (const [o, a] of Object.entries(r.properties)) {
        const l = this.resolveValue(a);
        s[o] = this.parseStyleValue(o, l);
      }
    return s;
  }
  getApplicableRules(t, e) {
    const s = [];
    for (const n of this.stylesheet.rules)
      this.selectorMatches(t, e, n.selector) && s.push(n);
    return s;
  }
  selectorMatches(t, e, s) {
    const n = s.split(/\s+/).filter((a) => a.trim());
    if (n.length === 1)
      return this.simpleSelectorMatches(t, n[0]);
    let r = t, o = n.length - 1;
    for (; r && o >= 0; )
      this.simpleSelectorMatches(r, n[o]) && o--, r = r.parent;
    return o < 0;
  }
  simpleSelectorMatches(t, e) {
    var s;
    if (e.startsWith(".")) {
      const n = e.slice(1);
      return ((s = t.attributes.class) == null ? void 0 : s.split(/\s+/).includes(n)) || !1;
    } else if (e.startsWith("#")) {
      const n = e.slice(1);
      return t.attributes.id === n;
    } else
      return t.tag === e;
  }
  resolveValue(t) {
    let e = t, s = !0;
    for (; s; ) {
      s = !1;
      const n = e.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/);
      if (n) {
        const r = n[1], o = this.stylesheet.variables.get(r);
        o !== void 0 && (e = e.replace(n[0], o), s = !0);
      }
    }
    return e;
  }
  parseStyleValue(t, e) {
    switch (t) {
      case "color":
      case "text-color":
      case "background-color":
      case "button-color":
      case "button-color-hover":
      case "button-color-active":
      case "widget-background-color":
      case "widget-background-color-hover":
      case "widget-background-color-active":
      case "frame-background-color":
      case "window-background-color":
        return {
          type: "color",
          value: this.parseColor(e)
        };
      case "width":
      case "height":
      case "padding":
      case "margin":
      case "font-size":
      case "border-radius":
        return {
          type: "number",
          value: this.parseNumber(e)
        };
      case "opacity":
        return {
          type: "number",
          value: Math.max(0, Math.min(1, parseFloat(e) || 1))
        };
      default:
        return {
          type: "string",
          value: e
        };
    }
  }
  parseColor(t) {
    if (t.startsWith("0x")) {
      const s = t.slice(2);
      if (s.length === 8)
        return parseInt(s, 16);
      if (s.length === 6)
        return parseInt(s, 16) | 4278190080;
    }
    if (t.startsWith("#")) {
      const s = t.slice(1);
      if (s.length === 3) {
        const n = parseInt(s[0] + s[0], 16), r = parseInt(s[1] + s[1], 16), o = parseInt(s[2] + s[2], 16);
        return n << 16 | r << 8 | o | 4278190080;
      } else if (s.length === 6) {
        const n = parseInt(s.slice(0, 2), 16), r = parseInt(s.slice(2, 4), 16), o = parseInt(s.slice(4, 6), 16);
        return n << 16 | r << 8 | o | 4278190080;
      }
    }
    const e = t.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (e) {
      const s = parseInt(e[1]), n = parseInt(e[2]), r = parseInt(e[3]);
      return s << 16 | n << 8 | r | 4278190080;
    }
    return console.warn(`TSS: Unresolved color value: ${t}. Expected hex color or variable reference.`), 4294967295;
  }
  parseNumber(t) {
    const e = parseFloat(t);
    return isNaN(e) ? 0 : e;
  }
}
function at(i) {
  return new G(i);
}
class I {
  constructor(t) {
    this.renderers = /* @__PURE__ */ new Map(), this.imgui = null, this.styleEngine = null, this.logger = t ?? null, this.setupRenderers();
  }
  setImGui(t) {
    if (typeof t != "object" || t === null)
      throw new Error(`setImGui: imgui must be an object, got ${typeof t}`);
    this.imgui = t;
  }
  setStyleEngine(t) {
    this.styleEngine = t;
  }
  setupRenderers() {
    this.renderers.set("App", this.renderApp.bind(this)), this.renderers.set("Head", this.renderHead.bind(this)), this.renderers.set("Body", this.renderBody.bind(this)), this.renderers.set("Window", this.renderWindow.bind(this)), this.renderers.set("Text", this.renderText.bind(this)), this.renderers.set("Button", this.renderButton.bind(this)), this.renderers.set("InputText", this.renderInputText.bind(this)), this.renderers.set("SliderFloat", this.renderSliderFloat.bind(this)), this.renderers.set("Checkbox", this.renderCheckbox.bind(this)), this.renderers.set("SameLine", this.renderSameLine.bind(this)), this.renderers.set("Spacing", this.renderSpacing.bind(this)), this.renderers.set("Separator", this.renderSeparator.bind(this));
  }
  render(t, e, s, n) {
    if (typeof t != "object" || t === null || Array.isArray(t))
      throw new Error(`render: element must be a TXMLElement object, got ${typeof t}`);
    if (!t.tag || typeof t.tag != "string")
      throw new Error(`render: element.tag must be a string, got ${typeof t.tag}`);
    if (typeof e != "object" || e === null)
      throw new Error(`render: context must be a RenderContext object, got ${typeof e}`);
    console.log(`WidgetRenderers.render called for: ${t.tag}`);
    const r = this.renderers.get(t.tag);
    if (r)
      try {
        console.log(`Calling renderer for: ${t.tag}`), r(t, e, s, n), console.log(`Renderer completed for: ${t.tag}`);
      } catch (o) {
        console.error(`Render error for element: ${t.tag}`, o), console.error("Error stack:", o instanceof Error ? o.stack : "No stack trace");
      }
    else
      console.warn(`No renderer for tag: ${t.tag}`);
  }
  renderApp(t, e, s, n) {
    this.renderChildren(t, e, n);
  }
  renderHead(t, e, s, n) {
  }
  renderBody(t, e, s, n) {
    this.renderChildren(t, e, n);
  }
  renderWindow(t, e, s, n) {
    var l, h, c, u, f;
    if (!this.imgui) return;
    const r = t.attributes.title || "Window", o = this.getComputedStyle(t, e);
    if (o.width && o.width.type === "number" && ((h = this.logger) == null || h.logImGui(`ImGui.SetNextWindowSize([${o.width.value}, ${((l = o.height) == null ? void 0 : l.value) || 200}], ImGui.Cond.Once);`), this.imgui.SetNextWindowSize([o.width.value, ((c = o.height) == null ? void 0 : c.value) || 200], 1)), (u = this.logger) == null || u.logImGui(`ImGui.Begin(${JSON.stringify(r)});`), this.imgui.Begin(r))
      try {
        this.renderChildren(t, e, n);
      } catch (p) {
        console.error("Error rendering window children:", p);
      }
    (f = this.logger) == null || f.logImGui("ImGui.End();"), this.imgui.End();
  }
  renderText(t, e, s, n) {
    var o;
    if (!this.imgui) return;
    const r = this.getTextContent(t);
    (o = this.logger) == null || o.logImGui(`ImGui.Text(${JSON.stringify(r)});`), this.imgui.Text(r);
  }
  renderButton(t, e, s, n) {
    var h, c, u, f, p;
    if (!this.imgui) return;
    const r = this.getTextContent(t), o = s || this.getComputedStyle(t, e);
    o.width && o.width.type === "number" && ((h = this.logger) == null || h.logImGui(`ImGui.SetNextItemWidth(${o.width.value});`), this.imgui.SetNextItemWidth(o.width.value));
    let a = !1;
    if (o["button-color"] && o["button-color"].type === "color") {
      const g = o["button-color"].value, v = (g >> 16 & 255) / 255, $ = (g >> 8 & 255) / 255, A = (g & 255) / 255, V = (g >> 24 & 255) / 255;
      this.imgui.PushStyleColor && ((c = this.imgui.Col) == null ? void 0 : c.Button) !== void 0 && ((u = this.logger) == null || u.logImGui(`ImGui.PushStyleColor(ImGui.Col.Button, ${v}, ${$}, ${A}, ${V});`), this.imgui.PushStyleColor(this.imgui.Col.Button, v, $, A, V), a = !0);
    }
    (f = this.logger) == null || f.logImGui(`ImGui.Button(${JSON.stringify(r)});`);
    const l = this.imgui.Button(r);
    a && this.imgui.PopStyleColor && ((p = this.logger) == null || p.logImGui("ImGui.PopStyleColor(1);"), this.imgui.PopStyleColor(1)), l && t.attributes.onClick && this.handleEvent(t.attributes.onClick, e);
  }
  renderInputText(t, e, s, n) {
    var p, g;
    if (!this.imgui) return;
    const r = this.generateId(t, e), o = e.state.get(r) || { id: r, value: "", lastFrame: e.frameNumber }, a = t.attributes.label || "", l = t.attributes.hint || "", h = this.getComputedStyle(t, e);
    h.width && h.width.type === "number" && ((p = this.logger) == null || p.logImGui(`ImGui.SetNextItemWidth(${h.width.value});`), this.imgui.SetNextItemWidth(h.width.value));
    const u = [o.value || ""];
    (g = this.logger) == null || g.logImGui(`ImGui.InputTextWithHint(${JSON.stringify(a)}, ${JSON.stringify(l)}, /* value */ , 256);`), this.imgui.InputTextWithHint(a, l, u, 256) && (o.value = u[0], o.lastFrame = e.frameNumber, e.state.set(r, o));
  }
  renderSliderFloat(t, e, s, n) {
    var p, g;
    if (!this.imgui) return;
    const r = this.generateId(t, e), o = e.state.get(r) || { id: r, value: 0.5, lastFrame: e.frameNumber }, a = t.attributes.label || "", l = parseFloat(t.attributes.min || "0"), h = parseFloat(t.attributes.max || "1"), c = this.getComputedStyle(t, e);
    c.width && c.width.type === "number" && ((p = this.logger) == null || p.logImGui(`ImGui.SetNextItemWidth(${c.width.value});`), this.imgui.SetNextItemWidth(c.width.value));
    const u = [typeof o.value == "number" ? o.value : 0.5];
    (g = this.logger) == null || g.logImGui(`ImGui.SliderFloat(${JSON.stringify(a)}, ${u[0]}, ${l}, ${h});`), this.imgui.SliderFloat(a, u, l, h) && (o.value = u[0], o.lastFrame = e.frameNumber, e.state.set(r, o));
  }
  renderCheckbox(t, e, s, n) {
    var c;
    if (!this.imgui) return;
    const r = this.generateId(t, e), o = e.state.get(r) || { id: r, value: !1, lastFrame: e.frameNumber }, a = t.attributes.label || "", l = [!!o.value];
    (c = this.logger) == null || c.logImGui(`ImGui.Checkbox(${JSON.stringify(a)}, ${l[0]});`), this.imgui.Checkbox(a, l) && (o.value = l[0], o.lastFrame = e.frameNumber, e.state.set(r, o));
  }
  renderSameLine(t, e) {
    var r;
    if (!this.imgui) return;
    const s = parseFloat(t.attributes.offset || "0"), n = parseFloat(t.attributes.spacing || "-1");
    (r = this.logger) == null || r.logImGui(`ImGui.SameLine(${s}, ${n});`), this.imgui.SameLine(s, n);
  }
  renderSpacing(t, e) {
    var s;
    this.imgui && ((s = this.logger) == null || s.logImGui("ImGui.Spacing();"), this.imgui.Spacing());
  }
  renderSeparator(t, e) {
    var s;
    this.imgui && ((s = this.logger) == null || s.logImGui("ImGui.Separator();"), this.imgui.Separator());
  }
  renderChildren(t, e, s) {
    var r, o;
    const n = [...e.currentPath];
    e.currentPath.push(t.tag);
    for (const a of t.children)
      try {
        if (typeof a == "string")
          a.trim() && this.imgui && this.imgui.Text(a.trim());
        else {
          let l;
          try {
            l = (s == null ? void 0 : s.computeStyle(a, e.currentPath)) || {};
          } catch (h) {
            console.error("Style compute error for child element:", a.tag, h), l = {};
          }
          try {
            this.render(a, e, l, s);
          } catch (h) {
            const c = h instanceof Error ? h.message : String(h);
            console.error(`Failed to render child element: ${a.tag}`, h), (r = this.logger) == null || r.logImGui(`// Error: Failed to render ${a.tag} - ${c}`);
          }
        }
      } catch (l) {
        const h = l instanceof Error ? l.message : String(l);
        console.error("Critical error rendering child:", l), (o = this.logger) == null || o.logImGui(`// Critical Error: Child rendering failed - ${h}`);
      }
    e.currentPath = n;
  }
  getTextContent(t) {
    return t.children.filter((e) => typeof e == "string").join("").trim();
  }
  getComputedStyle(t, e) {
    if (!this.styleEngine)
      return {};
    try {
      return this.styleEngine.computeStyle(t, e.currentPath) || {};
    } catch (s) {
      return console.error("Error computing style for element:", t.tag, s), {};
    }
  }
  generateId(t, e) {
    return [...e.currentPath, t.tag].join("/");
  }
  handleEvent(t, e) {
    const s = e.eventHandlers.get(t);
    s ? s.callback() : console.warn(`No event handler found for: ${t}`);
  }
}
function lt() {
  return new I();
}
class T extends Error {
  constructor(t, e, s, n) {
    super(t), this.code = e, this.context = s, this.originalError = n, this.name = "RendererError";
  }
}
class Q extends T {
  constructor(t, e, s) {
    super(t, "VALIDATION_ERROR", e, s), this.name = "ValidationError";
  }
}
class _ extends T {
  constructor(t, e, s) {
    super(t, "SECURITY_VALIDATION_ERROR", e, s), this.name = "SecurityValidationError";
  }
}
class w {
  constructor() {
    this.errorLog = [], this.maxErrorLogSize = 100;
  }
  static getInstance() {
    return w.instance || (w.instance = new w()), w.instance;
  }
  /**
   * Handle and log errors with context
   */
  handleError(t, e, s) {
    const n = this.wrapError(t, e);
    if (this.logError(n), s)
      try {
        s();
      } catch (r) {
        console.error("Fallback function also failed:", r);
      }
  }
  /**
   * Wrap any error in a RendererError with context
   */
  wrapError(t, e) {
    return t instanceof M ? new _(
      `Security validation failed: ${t.message}`,
      { ...e, ...t.context },
      t
    ) : t instanceof T ? t : new T(
      t.message,
      "UNKNOWN_ERROR",
      e,
      t
    );
  }
  /**
   * Log error to internal log
   */
  logError(t) {
    this.errorLog.push(t), this.errorLog.length > this.maxErrorLogSize && (this.errorLog = this.errorLog.slice(-this.maxErrorLogSize)), t instanceof _ ? console.error(`🚨 Security Error [${t.code}]:`, t.message, t.context) : t instanceof Q ? console.warn(`⚠️ Validation Error [${t.code}]:`, t.message, t.context) : console.error(`❌ Renderer Error [${t.code}]:`, t.message, t.context);
  }
  /**
   * Get recent errors
   */
  getRecentErrors(t = 10) {
    return this.errorLog.slice(-t);
  }
  /**
   * Clear error log
   */
  clearErrors() {
    this.errorLog = [];
  }
  /**
   * Get error statistics
   */
  getErrorStats() {
    const t = {};
    for (const e of this.errorLog)
      t[e.constructor.name] = (t[e.constructor.name] || 0) + 1;
    return {
      total: this.errorLog.length,
      byType: t
    };
  }
  /**
   * Safe execution wrapper that catches and handles errors
   */
  safeExecute(t, e, s) {
    try {
      return t();
    } catch (n) {
      if (this.handleError(n, e), s)
        try {
          return s();
        } catch (r) {
          console.error("Fallback operation failed:", r);
        }
      return;
    }
  }
  /**
   * Safe async execution wrapper
   */
  async safeExecuteAsync(t, e, s) {
    try {
      return await t();
    } catch (n) {
      if (this.handleError(n, e), s)
        try {
          return await s();
        } catch (r) {
          console.error("Fallback operation failed:", r);
        }
      return;
    }
  }
}
const F = w.getInstance();
function k(i, t, e) {
  return F.safeExecute(i, t, e);
}
function y(i, t, e) {
  return F.safeExecute(i, t, e);
}
class tt {
  constructor(t) {
    this.eventHandlers = /* @__PURE__ */ new Map(), this.logger = null, this.imgui = null, this.imguiImplWeb = null, this.stateManager = new C(), this.widgetRenderers = new I(t), t && (this.logger = t);
  }
  /**
   * Inject or replace logger at runtime
   */
  setLogger(t) {
    this.logger = t, this.widgetRenderers = new I(t);
  }
  /**
   * Register an event handler
   */
  registerEventHandler(t, e) {
    this.eventHandlers.set(t, { name: t, callback: e });
  }
  /**
   * Test method to trigger event handlers (for testing purposes)
   */
  testEventHandler(t) {
    const e = this.eventHandlers.get(t);
    e ? e.callback() : console.warn(`No event handler found for: ${t}`);
  }
  /**
   * Set ImGui instances for dependency injection
   */
  setImGui(t, e) {
    if (typeof t != "object" || t === null)
      throw new Error(`setImGui: imgui must be an object, got ${typeof t}`);
    if (typeof e != "object" || e === null)
      throw new Error(`setImGui: imguiImplWeb must be an object, got ${typeof e}`);
    this.imgui = t, this.imguiImplWeb = e, this.widgetRenderers.setImGui(t);
  }
  /**
   * Parse and render TXML with TSS styling
   */
  render(t, e = "") {
    const s = {
      component: "TXMLTSSRenderer",
      operation: "render"
    };
    return y(() => {
      var l, h, c, u, f;
      if ((l = this.logger) == null || l.startFrame(), typeof t != "string")
        throw new Error(`render: txml must be a string, got ${typeof t}`);
      if (typeof e != "string")
        throw new Error(`render: tss must be a string, got ${typeof e}`);
      if (!t || !t.trim()) {
        console.warn("Empty TXML provided");
        return;
      }
      if (!this.imgui || !this.imguiImplWeb) {
        const p = "ImGui not initialized. Call setImGui() first.";
        console.error("TXML/TSS render error:", p), (h = this.logger) == null || h.logImGui(`// Error: ${p}`);
        return;
      }
      const n = k(
        () => q(t),
        { ...s, operation: "parseTXML", input: t },
        () => (console.error("Failed to parse TXML - using fallback"), null)
      );
      if (!n)
        return;
      const r = k(
        () => Y(e),
        { ...s, operation: "parseTSS", input: e },
        () => (console.error("Failed to parse TSS - using fallback"), null)
      );
      if (!r)
        return;
      const o = new G(r);
      this.stateManager.beginFrame();
      const a = this.stateManager.createContext(r, this.eventHandlers);
      if (!a) {
        console.error("Failed to create render context");
        return;
      }
      console.log("Starting to render XML element:", n.tag), console.log("XML element children count:", n.children.length), y(
        () => this.renderElement(n, a, o),
        { ...s, operation: "renderElement", input: n }
      ), console.log("Finished rendering XML element"), this.stateManager.endFrame(), (c = this.logger) == null || c.endFrame(), (f = (u = this.logger) == null ? void 0 : u.flush) == null || f.call(u);
    }, s);
  }
  /**
   * Render a single element
   */
  renderElement(t, e, s) {
    const n = {
      component: "TXMLTSSRenderer",
      operation: "renderElement",
      input: t
    };
    return y(() => {
      if (!t || !e)
        throw new Error("Invalid element or context");
      console.log(`Rendering element: ${t.tag} with ${t.children.length} children`);
      const r = y(
        () => s.computeStyle(t, e.currentPath),
        { ...n, operation: "computeStyle" },
        () => ({})
        // Fallback to empty styles
      );
      console.log(`Computed style for ${t.tag}:`, r), y(
        () => this.widgetRenderers.render(t, e, r, s),
        { ...n, operation: "widgetRender" }
      ), console.log(`Finished rendering element: ${t.tag}`);
    }, n);
  }
  /**
   * Get current state for debugging
   */
  getState() {
    return this.stateManager.state;
  }
  /**
   * Clear all state
   */
  clearState() {
    this.stateManager.state.clear();
  }
}
function ht() {
  return new tt();
}
function z() {
  const i = globalThis;
  return i.__txmlJsxHandlers || (i.__txmlJsxHandlers = /* @__PURE__ */ Object.create(null)), i.__txmlJsxHandlers;
}
function j() {
  const i = globalThis;
  return typeof i.__txmlJsxHandlerSeq != "number" && (i.__txmlJsxHandlerSeq = 0), i.__txmlJsxHandlerSeq += 1, `jsx_fn_${i.__txmlJsxHandlerSeq}`;
}
function ct(i, t, e) {
  if (typeof i != "string")
    throw new Error(`JSX type must be a string, got ${typeof i}`);
  const s = {}, n = [];
  if (t && t.children !== void 0) {
    if (Array.isArray(t.children))
      n.push(
        ...t.children.filter((r) => r != null && r !== !1).map((r) => typeof r == "number" || typeof r == "boolean" ? String(r) : r)
      );
    else if (t.children !== null && t.children !== void 0) {
      const r = t.children;
      n.push(typeof r == "number" || typeof r == "boolean" ? String(r) : r);
    }
  } else e !== void 0 && (Array.isArray(e) ? n.push(
    ...e.filter((r) => r != null && r !== !1).map((r) => typeof r == "number" || typeof r == "boolean" ? String(r) : r)
  ) : e != null && n.push(typeof e == "number" || typeof e == "boolean" ? String(e) : e));
  if (t) {
    for (const [r, o] of Object.entries(t))
      if (r !== "children") {
        if (r === "key")
          continue;
        if (typeof o == "function" && /^on[A-Z]/.test(r)) {
          const a = z(), l = j();
          a[l] = o, s[r] = l;
          continue;
        }
        s[r] = String(o);
      }
  }
  return {
    tag: i,
    attributes: s,
    children: n
  };
}
function ut(i, t, ...e) {
  if (typeof i != "string")
    throw new Error(`JSX type must be a string, got ${typeof i}`);
  const s = {}, n = [];
  if (e.forEach((r) => {
    Array.isArray(r) ? r.forEach((o) => {
      o != null && o !== !1 && (typeof o == "number" || typeof o == "boolean" ? n.push(String(o)) : n.push(o));
    }) : r != null && r !== !1 && (typeof r == "number" || typeof r == "boolean" ? n.push(String(r)) : n.push(r));
  }), t)
    for (const [r, o] of Object.entries(t))
      if (r === "children") {
        Array.isArray(o) ? o.forEach((a) => {
          a != null && a !== !1 && (typeof a == "number" || typeof a == "boolean" ? n.push(String(a)) : n.push(a));
        }) : o != null && (typeof o == "number" || typeof o == "boolean" ? n.push(String(o)) : n.push(o));
        continue;
      } else {
        if (r === "key")
          continue;
        if (typeof o == "function" && /^on[A-Z]/.test(r)) {
          const a = z(), l = j();
          a[l] = o, s[r] = l;
          continue;
        }
        s[r] = String(o);
      }
  return {
    tag: i,
    attributes: s,
    children: n
  };
}
const pt = Symbol("Fragment"), R = /* @__PURE__ */ new Set([
  "App",
  "Head",
  "Body",
  "Window",
  "Text",
  "Button",
  "InputText",
  "SliderFloat",
  "Checkbox",
  "SameLine",
  "Separator",
  "Spacing"
]), W = /* @__PURE__ */ new Set([
  "title",
  "label",
  "hint",
  "value",
  "min",
  "max",
  "checked",
  "onClick",
  "onChange",
  "id",
  "width",
  "height",
  "color",
  "background-color",
  "text-color"
]);
function et(i) {
  if (!i || typeof i != "string")
    throw new Error("Invalid tag name: must be a non-empty string");
  const t = i.replace(/[<>'"&]/g, "");
  return R.has(t) ? t : (console.warn(`Unknown tag: ${t}. Allowed tags: ${Array.from(R).join(", ")}`), "UnknownTag");
}
function st(i) {
  if (!i || typeof i != "string")
    throw new Error("Invalid attribute name: must be a non-empty string");
  const t = i.replace(/[<>'"&]/g, "");
  return W.has(t) ? t : (console.warn(`Unknown attribute: ${t}. Allowed attributes: ${Array.from(W).join(", ")}`), "unknown-attr");
}
function P(i) {
  if (i == null)
    return "";
  if (typeof i == "string" || typeof i == "number" || typeof i == "boolean")
    return String(i);
  if (typeof i != "object" || Array.isArray(i))
    throw new Error(`jsxToTXML: element must be a TXMLElement object, got ${typeof i}`);
  if (!i.tag || typeof i.tag != "string")
    throw new Error(`jsxToTXML: element.tag must be a string, got ${typeof i.tag}`);
  if (!i.attributes || typeof i.attributes != "object" || Array.isArray(i.attributes))
    throw new Error(`jsxToTXML: element.attributes must be an object, got ${typeof i.attributes}`);
  if (!i.children || !Array.isArray(i.children))
    throw new Error(`jsxToTXML: element.children must be an array, got ${typeof i.children}`);
  const { tag: t, attributes: e, children: s } = i, n = et(t), r = Object.entries(e || {}).map(([a, l]) => {
    const h = st(a), c = String(l).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `${h}="${c}"`;
  }).join(" "), o = (s || []).map((a) => P(a)).join("");
  return !s || s.length === 0 ? `<${n}${r ? " " + r : ""} />` : `<${n}${r ? " " + r : ""}>${o}</${n}>`;
}
let rt = 0;
const x = /* @__PURE__ */ new Map();
function dt(i) {
  if (i == null)
    throw new Error("useState: initialValue cannot be null or undefined");
  const t = `state_${rt++}`;
  x.has(t) || x.set(t, typeof i == "function" ? i() : i);
  const e = (s) => {
    if (s == null)
      throw new Error("useState: setValue cannot accept null or undefined");
    const n = x.get(t), r = typeof s == "function" ? s(n) : s;
    x.set(t, r);
  };
  return [x.get(t), e];
}
function ft(i) {
  return {
    render: (t) => {
      const e = P(t);
      return console.log("Rendered TXML:", e), i && (i.textContent = e), e;
    }
  };
}
class gt {
  constructor() {
    this.buffer = [];
  }
  startFrame() {
    this.buffer.push("// --- start frame ---");
  }
  endFrame() {
    this.buffer.push("// --- end frame ---");
  }
  logImGui(t) {
    this.buffer.push(t);
  }
  logDom(t) {
    this.buffer.push(t);
  }
  flush() {
    console.log(this.buffer.join(`
`)), this.buffer = [];
  }
  getBuffer() {
    return [...this.buffer];
  }
}
class mt {
  startFrame() {
  }
  endFrame() {
  }
  logImGui(t) {
  }
  logDom(t) {
  }
  flush() {
  }
  getBuffer() {
    return [];
  }
}
export {
  gt as DefaultConsoleLogger,
  pt as Fragment,
  mt as NoopLogger,
  C as StateManager,
  G as StyleEngine,
  m as TSSParseError,
  d as TXMLParseError,
  tt as TXMLTSSRenderer,
  I as WidgetRenderers,
  ht as createRenderer,
  ft as createRoot,
  ot as createStateManager,
  at as createStyleEngine,
  lt as createWidgetRenderers,
  nt as isTestMode,
  ct as jsx,
  P as jsxToTXML,
  ut as jsxs,
  Y as parseTSS,
  q as parseTXML,
  it as setTestMode,
  dt as useState
};
