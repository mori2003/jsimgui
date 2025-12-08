const F = [
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
], R = [
  "text-color",
  "button-color",
  "button-color-hover",
  "button-color-active",
  "widget-background-color",
  "widget-background-color-hover",
  "widget-background-color-active",
  "frame-background-color",
  "frame-background-color-hover",
  "frame-background-color-active",
  "window-background-color",
  "popup-background-color",
  "border-color",
  "scrollbar-background-color",
  "scrollbar-grab-color",
  "scrollbar-grab-hover-color",
  "header-background-color",
  "header-hover-color",
  "header-active-color",
  "title-background-color",
  "title-active-color",
  "title-collapsed-color",
  "menu-bar-background-color",
  "tab-background-color",
  "tab-hover-color",
  "tab-active-color",
  "docking-background-color",
  "docking-preview-color",
  "docking-empty-color",
  "plot-background-color",
  "plot-line-color",
  "plot-histogram-color",
  "table-background-color",
  "table-border-color",
  "table-header-background-color",
  "table-row-background-color",
  "table-row-alt-background-color",
  "drag-drop-background-color",
  "nav-highlight-color",
  "nav-windowing-highlight-color",
  "nav-windowing-darkening-color",
  "modal-window-darkening-color"
];
class x extends Error {
  constructor(t, e, s) {
    super(t), this.line = e, this.column = s, this.name = "TXMLParseError";
  }
}
class L {
  constructor(t) {
    this.xml = t, this.pos = 0, this.line = 1, this.column = 1;
  }
  parse() {
    if (this.xml = this.xml.trim(), this.pos = 0, this.line = 1, this.column = 1, this.skipWhitespace(), this.pos >= this.xml.length || this.xml[this.pos] !== "<")
      throw new x("Expected XML document to start with <", this.line, this.column);
    const t = this.parseElement();
    if (t.tag !== "App")
      throw new x("Root element must be <App>", this.line, this.column);
    if (this.skipWhitespace(), this.pos < this.xml.length)
      throw new x("Unexpected content after root element", this.line, this.column);
    return t;
  }
  parseElement() {
    if (!this.consume("<"))
      throw new x("Expected <", this.line, this.column);
    const t = this.parseTagName();
    F.includes(t) || console.warn(`Unknown tag: ${t}`, this.line, this.column);
    const e = this.parseAttributes();
    if (this.consume("/>"))
      return { tag: t, attributes: e, children: [] };
    if (!this.consume(">"))
      throw new x("Expected > or />", this.line, this.column);
    const s = this.parseChildren(t);
    if (!this.consume("</"))
      throw new x("Expected closing tag", this.line, this.column);
    const o = this.parseTagName();
    if (o !== t)
      throw new x(`Mismatched closing tag: expected </${t}> but found </${o}>`, this.line, this.column);
    if (!this.consume(">"))
      throw new x("Expected > in closing tag", this.line, this.column);
    return { tag: t, attributes: e, children: s };
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
        throw new x("Expected = after attribute name", this.line, this.column);
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
      throw new x("Expected quoted attribute value", this.line, this.column);
    const e = this.pos;
    for (; this.pos < this.xml.length && this.xml[this.pos] !== t; )
      this.xml[this.pos] === `
` ? (this.line++, this.column = 1) : this.column++, this.pos++;
    if (!this.consume(t))
      throw new x("Unclosed attribute value", this.line, this.column);
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
    return this.xml.slice(t, this.pos);
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
function j(n) {
  try {
    return !n || typeof n != "string" ? (console.error("Invalid TXML input: must be a non-empty string"), null) : new L(n).parse();
  } catch (t) {
    const e = t instanceof Error ? t.message : String(t);
    return console.error("TXML parsing failed:", e), console.error("Input TXML:", n.substring(0, 200) + (n.length > 200 ? "..." : "")), {
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
class v extends Error {
  constructor(t, e, s) {
    super(t), this.line = e, this.column = s, this.name = "TSSParseError";
  }
}
class B {
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
      throw new v("Expected { after scope", this.line, this.column);
    for (; this.pos < this.tss.length && this.tss[this.pos] !== "}" && (this.skipWhitespace(), this.tss[this.pos] !== "}"); ) {
      const s = this.pos;
      if (this.parseIdentifier(), this.tss[this.pos] === ":") {
        this.pos = s;
        const o = this.parseTSSVariable();
        t.set(o.name, o.value);
      } else {
        this.pos = s;
        const o = this.parseRule(t);
        o && e.push(o);
      }
      this.skipWhitespace();
    }
    if (!this.consume("}"))
      throw new v("Expected } after scope block", this.line, this.column);
    return e;
  }
  parseTSSVariable() {
    const t = this.parseIdentifier();
    if (!this.consume(":"))
      throw new v("Expected : after variable name", this.line, this.column);
    this.skipWhitespace();
    const e = this.parseValue();
    if (!this.consume(";"))
      throw new v("Expected ; after variable value", this.line, this.column);
    return { name: t, value: e };
  }
  parseRule(t) {
    const e = this.parseSelector();
    if (!e) return null;
    if (!this.consume("{"))
      throw new v("Expected { after selector", this.line, this.column);
    const s = this.parseProperties(t);
    if (!this.consume("}"))
      throw new v("Expected } after properties", this.line, this.column);
    const o = this.calculateSpecificity(e);
    return { selector: e, properties: s, specificity: o };
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
      const s = this.parseIdentifier();
      if (!this.consume(":"))
        throw new v("Expected : after property name", this.line, this.column);
      this.skipWhitespace();
      let o = this.parseValue();
      if (o = this.substituteVariables(o, t), R.includes(s) || console.warn(`Unknown property: ${s}`, this.line, this.column), e[s] = o, !this.consume(";"))
        throw new v("Expected ; after property value", this.line, this.column);
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
    for (const o of s)
      o.startsWith("#") ? e += 100 : o.startsWith(".") ? e += 10 : o.match(/^[a-zA-Z]/) && (e += 1);
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
    for (const [o, r] of e) {
      const i = new RegExp(`\\b${o}\\b`, "g");
      s = s.replace(i, r);
    }
    return s;
  }
  consume(t) {
    return this.tss.startsWith(t, this.pos) ? (this.pos += t.length, this.column += t.length, !0) : !1;
  }
}
function X(n) {
  try {
    return new B(n).parse();
  } catch (t) {
    return console.error("TSS parsing failed:", t), null;
  }
}
class P {
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
    const s = [...e.currentPath, t.tag], o = e.currentPath.join("/"), i = this.getSiblingsAtPath(o, t.tag).indexOf(t);
    return i > 0 && s.push(i.toString()), s.join("/");
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
function z() {
  return new P();
}
class W {
  constructor(t) {
    this.stylesheet = t;
  }
  computeStyle(t, e) {
    const s = {}, o = this.getApplicableRules(t, e);
    o.sort((r, i) => r.specificity - i.specificity);
    for (const r of o)
      for (const [i, l] of Object.entries(r.properties)) {
        const h = this.resolveValue(l);
        s[i] = this.parseStyleValue(i, h);
      }
    return s;
  }
  getApplicableRules(t, e) {
    const s = [];
    for (const o of this.stylesheet.rules)
      this.selectorMatches(t, e, o.selector) && s.push(o);
    return s;
  }
  selectorMatches(t, e, s) {
    const o = s.split(/\s+/).filter((l) => l.trim());
    if (o.length === 1)
      return this.simpleSelectorMatches(t, o[0]);
    let r = t, i = o.length - 1;
    for (; r && i >= 0; )
      this.simpleSelectorMatches(r, o[i]) && i--, r = r.parent;
    return i < 0;
  }
  simpleSelectorMatches(t, e) {
    var s;
    if (e.startsWith(".")) {
      const o = e.slice(1);
      return ((s = t.attributes.class) == null ? void 0 : s.split(/\s+/).includes(o)) || !1;
    } else if (e.startsWith("#")) {
      const o = e.slice(1);
      return t.attributes.id === o;
    } else
      return t.tag === e;
  }
  resolveValue(t) {
    let e = t, s = !0;
    for (; s; ) {
      s = !1;
      const o = e.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/);
      if (o) {
        const r = o[1], i = this.stylesheet.variables.get(r);
        i !== void 0 && (e = e.replace(o[0], i), s = !0);
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
        const o = parseInt(s[0] + s[0], 16), r = parseInt(s[1] + s[1], 16), i = parseInt(s[2] + s[2], 16);
        return o << 16 | r << 8 | i | 4278190080;
      } else if (s.length === 6) {
        const o = parseInt(s.slice(0, 2), 16), r = parseInt(s.slice(2, 4), 16), i = parseInt(s.slice(4, 6), 16);
        return o << 16 | r << 8 | i | 4278190080;
      }
    }
    const e = t.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (e) {
      const s = parseInt(e[1]), o = parseInt(e[2]), r = parseInt(e[3]);
      return s << 16 | o << 8 | r | 4278190080;
    }
    return console.warn(`TSS: Unresolved color value: ${t}. Expected hex color or variable reference.`), 4294967295;
  }
  parseNumber(t) {
    const e = parseFloat(t);
    return isNaN(e) ? 0 : e;
  }
}
function U(n) {
  return new W(n);
}
class C {
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
  render(t, e, s, o) {
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
        console.log(`Calling renderer for: ${t.tag}`), r(t, e, s, o), console.log(`Renderer completed for: ${t.tag}`);
      } catch (i) {
        console.error(`Render error for element: ${t.tag}`, i), console.error("Error stack:", i instanceof Error ? i.stack : "No stack trace");
      }
    else
      console.warn(`No renderer for tag: ${t.tag}`);
  }
  renderApp(t, e, s, o) {
    this.renderChildren(t, e, o);
  }
  renderHead(t, e, s, o) {
  }
  renderBody(t, e, s, o) {
    this.renderChildren(t, e, o);
  }
  renderWindow(t, e, s, o) {
    var h, a, c, u, f;
    if (!this.imgui) return;
    const r = t.attributes.title || "Window", i = this.getComputedStyle(t, e);
    if (i.width && i.width.type === "number" && ((a = this.logger) == null || a.logImGui(`ImGui.SetNextWindowSize([${i.width.value}, ${((h = i.height) == null ? void 0 : h.value) || 200}], ImGui.Cond.Once);`), this.imgui.SetNextWindowSize([i.width.value, ((c = i.height) == null ? void 0 : c.value) || 200], 1)), (u = this.logger) == null || u.logImGui(`ImGui.Begin(${JSON.stringify(r)});`), this.imgui.Begin(r))
      try {
        this.renderChildren(t, e, o);
      } catch (g) {
        console.error("Error rendering window children:", g);
      }
    (f = this.logger) == null || f.logImGui("ImGui.End();"), this.imgui.End();
  }
  renderText(t, e, s, o) {
    var l, h, a, c;
    if (!this.imgui) return;
    const r = this.getTextContent(t), i = s || this.getComputedStyle(t, e);
    if (console.log("renderText:", {
      text: r,
      style: i,
      hasTextColor: !!i["text-color"],
      textColorValue: (l = i["text-color"]) == null ? void 0 : l.value,
      textColorType: (h = i["text-color"]) == null ? void 0 : h.type
    }), i["text-color"] && i["text-color"].type === "color") {
      const u = i["text-color"].value;
      console.log("Applying text color:", { colorValue: u });
      const f = u >> 24 & 255, g = u >> 16 & 255, m = u >> 8 & 255, d = u & 255, p = f / 255, b = g / 255, w = m / 255, y = d / 255;
      console.log("Text color converted:", { r: f, g, b: m, a: d, rNorm: p, gNorm: b, bNorm: w, aNorm: y }), (a = this.logger) == null || a.logImGui(`ImGui.TextColored([${p}, ${b}, ${w}, ${y}], ${JSON.stringify(r)});`), this.imgui.TextColored([p, b, w, y], r);
    } else
      console.log("No text color found, using default"), (c = this.logger) == null || c.logImGui(`ImGui.Text(${JSON.stringify(r)});`), this.imgui.Text(r);
  }
  renderButton(t, e, s, o) {
    var h, a;
    if (!this.imgui) return;
    const r = this.getTextContent(t), i = s || this.getComputedStyle(t, e);
    if (i.width && i.width.type === "number" && ((h = this.logger) == null || h.logImGui(`ImGui.SetNextItemWidth(${i.width.value});`), this.imgui.SetNextItemWidth(i.width.value)), i["button-color"] && i["button-color"].type === "color") {
      const c = i["button-color"].value, u = c >> 24 & 255, f = c >> 16 & 255, g = c >> 8 & 255, m = c & 255, d = (p, b, w, y = 255) => (p & 255 | (b & 255) << 8 | (w & 255) << 16 | (y & 255) << 24) >>> 0;
      try {
        const p = d(u, f, g, m);
        this.imgui.PushStyleColor(this.imgui.Col.Button, p);
        const b = Math.min(255, u + 40), w = Math.min(255, f + 40), y = Math.min(255, g + 40), E = d(b, w, y, m);
        this.imgui.PushStyleColor(this.imgui.Col.ButtonHovered, E);
        const S = Math.max(0, u - 50), I = Math.max(0, f - 50), T = Math.max(0, g - 50), k = d(S, I, T, m);
        this.imgui.PushStyleColor(this.imgui.Col.ButtonActive, k), this.colorsPushed = 3;
      } catch (p) {
        console.error("Button color styling failed:", p), this.colorsPushed = 0;
      }
    }
    if (i["text-color"] && i["text-color"].type === "color") {
      const c = i["text-color"].value, u = c >> 24 & 255, f = c >> 16 & 255, g = c >> 8 & 255, m = c & 255, d = (p, b, w, y = 255) => (p & 255 | (b & 255) << 8 | (w & 255) << 16 | (y & 255) << 24) >>> 0;
      try {
        const p = d(u, f, g, m);
        this.imgui.PushStyleColor(this.imgui.Col.ButtonText, p), this.colorsPushed = (this.colorsPushed || 0) + 1;
      } catch (p) {
        console.error("Button text color styling failed:", p);
      }
    }
    (a = this.logger) == null || a.logImGui(`ImGui.Button(${JSON.stringify(r)});`);
    const l = this.imgui.Button(r);
    this.colorsPushed > 0 && (this.imgui.PopStyleColor(this.colorsPushed), this.colorsPushed = 0), l && t.attributes.onClick && this.handleEvent(t.attributes.onClick, e);
  }
  renderInputText(t, e, s, o) {
    var g, m;
    if (!this.imgui) return;
    const r = this.generateId(t, e), i = e.state.get(r) || { id: r, value: "", lastFrame: e.frameNumber }, l = t.attributes.label || "", h = t.attributes.hint || "", a = this.getComputedStyle(t, e);
    if (a.width && a.width.type === "number" && ((g = this.logger) == null || g.logImGui(`ImGui.SetNextItemWidth(${a.width.value});`), this.imgui.SetNextItemWidth(a.width.value)), a["widget-background-color"] && a["widget-background-color"].type === "color") {
      const d = a["widget-background-color"].value, p = d >> 24 & 255, b = d >> 16 & 255, w = d >> 8 & 255, y = d & 255, E = (S, I, T, k = 255) => (S & 255 | (I & 255) << 8 | (T & 255) << 16 | (k & 255) << 24) >>> 0;
      try {
        const S = E(p, b, w, y);
        this.imgui.PushStyleColor(this.imgui.Col.FrameBg, S), this.inputColorsPushed = 1;
      } catch (S) {
        console.error("InputText background color styling failed:", S), this.inputColorsPushed = 0;
      }
    }
    const u = [i.value || ""];
    (m = this.logger) == null || m.logImGui(`ImGui.InputTextWithHint(${JSON.stringify(l)}, ${JSON.stringify(h)}, /* value */ , 256);`), this.imgui.InputTextWithHint(l, h, u, 256) && (i.value = u[0], i.lastFrame = e.frameNumber, e.state.set(r, i)), this.inputColorsPushed > 0 && (this.imgui.PopStyleColor(this.inputColorsPushed), this.inputColorsPushed = 0);
  }
  renderSliderFloat(t, e, s, o) {
    var g, m;
    if (!this.imgui) return;
    const r = this.generateId(t, e), i = e.state.get(r) || { id: r, value: 0.5, lastFrame: e.frameNumber }, l = t.attributes.label || "", h = parseFloat(t.attributes.min || "0"), a = parseFloat(t.attributes.max || "1"), c = this.getComputedStyle(t, e);
    if (c.width && c.width.type === "number" && ((g = this.logger) == null || g.logImGui(`ImGui.SetNextItemWidth(${c.width.value});`), this.imgui.SetNextItemWidth(c.width.value)), c["widget-background-color"] && c["widget-background-color"].type === "color") {
      const d = c["widget-background-color"].value, p = d >> 24 & 255, b = d >> 16 & 255, w = d >> 8 & 255, y = d & 255, E = (S, I, T, k = 255) => (S & 255 | (I & 255) << 8 | (T & 255) << 16 | (k & 255) << 24) >>> 0;
      try {
        const S = E(p, b, w, y);
        this.imgui.PushStyleColor(this.imgui.Col.FrameBg, S), this.sliderColorsPushed = 1;
      } catch (S) {
        console.error("SliderFloat background color styling failed:", S), this.sliderColorsPushed = 0;
      }
    }
    const u = [typeof i.value == "number" ? i.value : 0.5];
    (m = this.logger) == null || m.logImGui(`ImGui.SliderFloat(${JSON.stringify(l)}, ${u[0]}, ${h}, ${a});`), this.imgui.SliderFloat(l, u, h, a) && (i.value = u[0], i.lastFrame = e.frameNumber, e.state.set(r, i)), this.sliderColorsPushed > 0 && (this.imgui.PopStyleColor(this.sliderColorsPushed), this.sliderColorsPushed = 0);
  }
  renderCheckbox(t, e, s, o) {
    var c;
    if (!this.imgui) return;
    const r = this.generateId(t, e), i = e.state.get(r) || { id: r, value: !1, lastFrame: e.frameNumber }, l = t.attributes.label || "", h = [!!i.value];
    (c = this.logger) == null || c.logImGui(`ImGui.Checkbox(${JSON.stringify(l)}, ${h[0]});`), this.imgui.Checkbox(l, h) && (i.value = h[0], i.lastFrame = e.frameNumber, e.state.set(r, i));
  }
  renderSameLine(t, e) {
    var r;
    if (!this.imgui) return;
    const s = parseFloat(t.attributes.offset || "0"), o = parseFloat(t.attributes.spacing || "-1");
    (r = this.logger) == null || r.logImGui(`ImGui.SameLine(${s}, ${o});`), this.imgui.SameLine(s, o);
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
    var r, i;
    const o = [...e.currentPath];
    e.currentPath.push(t.tag);
    for (const l of t.children)
      try {
        if (typeof l == "string")
          l.trim() && this.imgui && this.imgui.Text(l.trim());
        else {
          let h;
          try {
            h = (s == null ? void 0 : s.computeStyle(l, e.currentPath)) || {};
          } catch (a) {
            console.error("Style compute error for child element:", l.tag, a), h = {};
          }
          try {
            this.render(l, e, h, s);
          } catch (a) {
            const c = a instanceof Error ? a.message : String(a);
            console.error(`Failed to render child element: ${l.tag}`, a), (r = this.logger) == null || r.logImGui(`// Error: Failed to render ${l.tag} - ${c}`);
          }
        }
      } catch (h) {
        const a = h instanceof Error ? h.message : String(h);
        console.error("Critical error rendering child:", h), (i = this.logger) == null || i.logImGui(`// Critical Error: Child rendering failed - ${a}`);
      }
    e.currentPath = o;
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
function q() {
  return new C();
}
class H {
  constructor(t) {
    this.eventHandlers = /* @__PURE__ */ new Map(), this.logger = null, this.imgui = null, this.imguiImplWeb = null, this.stateManager = new P(), this.widgetRenderers = new C(t), t && (this.logger = t);
  }
  /**
   * Inject or replace logger at runtime
   */
  setLogger(t) {
    this.logger = t, this.widgetRenderers = new C(t);
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
    var s, o, r, i, l, h;
    try {
      if ((s = this.logger) == null || s.startFrame(), typeof t != "string")
        throw new Error(`render: txml must be a string, got ${typeof t}`);
      if (typeof e != "string")
        throw new Error(`render: tss must be a string, got ${typeof e}`);
      if (!t || !t.trim()) {
        console.warn("Empty TXML provided");
        return;
      }
      if (!this.imgui || !this.imguiImplWeb) {
        const g = "ImGui not initialized. Call setImGui() first.";
        console.error("TXML/TSS render error:", g), (o = this.logger) == null || o.logImGui(`// Error: ${g}`);
        return;
      }
      const a = j(t);
      if (!a) {
        console.error("Failed to parse TXML - using fallback");
        return;
      }
      const c = X(e);
      if (!c) {
        console.error("Failed to parse TSS - using fallback");
        return;
      }
      const u = new W(c);
      this.stateManager.beginFrame();
      const f = this.stateManager.createContext(c, this.eventHandlers);
      if (!f) {
        console.error("Failed to create render context");
        return;
      }
      console.log("Starting to render XML element:", a.tag), console.log("XML element children count:", a.children.length), this.renderElement(a, f, u), console.log("Finished rendering XML element"), this.stateManager.endFrame(), (r = this.logger) == null || r.endFrame(), (l = (i = this.logger) == null ? void 0 : i.flush) == null || l.call(i);
    } catch (a) {
      const c = a instanceof Error ? a.message : String(a);
      console.error("TXML/TSS render error:", c), (h = this.logger) == null || h.logImGui(`// Error: ${c}`);
    }
  }
  /**
   * Render a single element
   */
  renderElement(t, e, s) {
    var o;
    if (!t || !e) {
      console.error("Invalid element or context");
      return;
    }
    console.log(`Rendering element: ${t.tag} with ${t.children.length} children`);
    try {
      const r = s.computeStyle(t, e.currentPath);
      console.log(`Computed style for ${t.tag}:`, r), this.widgetRenderers.render(t, e, r, s), console.log(`Finished rendering element: ${t.tag}`);
    } catch (r) {
      const i = r instanceof Error ? r.message : String(r);
      console.error(`Failed to render element: ${t.tag}`, r), (o = this.logger) == null || o.logImGui(`// Error: Failed to render ${t.tag} - ${i}`);
    }
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
function Z() {
  return new H();
}
function G() {
  const n = globalThis;
  return n.__txmlJsxHandlers || (n.__txmlJsxHandlers = /* @__PURE__ */ Object.create(null)), n.__txmlJsxHandlers;
}
function N() {
  const n = globalThis;
  return typeof n.__txmlJsxHandlerSeq != "number" && (n.__txmlJsxHandlerSeq = 0), n.__txmlJsxHandlerSeq += 1, `jsx_fn_${n.__txmlJsxHandlerSeq}`;
}
function D(n, t, e) {
  if (typeof n != "string")
    throw new Error(`JSX type must be a string, got ${typeof n}`);
  const s = {}, o = [];
  if (t && t.children !== void 0) {
    if (Array.isArray(t.children))
      o.push(
        ...t.children.filter((r) => r != null && r !== !1).map((r) => typeof r == "number" || typeof r == "boolean" ? String(r) : r)
      );
    else if (t.children !== null && t.children !== void 0) {
      const r = t.children;
      o.push(typeof r == "number" || typeof r == "boolean" ? String(r) : r);
    }
  } else e !== void 0 && (Array.isArray(e) ? o.push(
    ...e.filter((r) => r != null && r !== !1).map((r) => typeof r == "number" || typeof r == "boolean" ? String(r) : r)
  ) : e != null && o.push(typeof e == "number" || typeof e == "boolean" ? String(e) : e));
  if (t) {
    for (const [r, i] of Object.entries(t))
      if (r !== "children") {
        if (r === "key")
          continue;
        if (typeof i == "function" && /^on[A-Z]/.test(r)) {
          const l = G(), h = N();
          l[h] = i, s[r] = h;
          continue;
        }
        s[r] = String(i);
      }
  }
  return {
    tag: n,
    attributes: s,
    children: o
  };
}
function K(n, t, ...e) {
  if (typeof n != "string")
    throw new Error(`JSX type must be a string, got ${typeof n}`);
  const s = {}, o = [];
  if (e.forEach((r) => {
    Array.isArray(r) ? r.forEach((i) => {
      i != null && i !== !1 && (typeof i == "number" || typeof i == "boolean" ? o.push(String(i)) : o.push(i));
    }) : r != null && r !== !1 && (typeof r == "number" || typeof r == "boolean" ? o.push(String(r)) : o.push(r));
  }), t)
    for (const [r, i] of Object.entries(t))
      if (r === "children") {
        Array.isArray(i) ? i.forEach((l) => {
          l != null && l !== !1 && (typeof l == "number" || typeof l == "boolean" ? o.push(String(l)) : o.push(l));
        }) : i != null && (typeof i == "number" || typeof i == "boolean" ? o.push(String(i)) : o.push(i));
        continue;
      } else {
        if (r === "key")
          continue;
        if (typeof i == "function" && /^on[A-Z]/.test(r)) {
          const l = G(), h = N();
          l[h] = i, s[r] = h;
          continue;
        }
        s[r] = String(i);
      }
  return {
    tag: n,
    attributes: s,
    children: o
  };
}
const Q = Symbol("Fragment"), M = /* @__PURE__ */ new Set([
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
]), A = /* @__PURE__ */ new Set([
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
function V(n) {
  if (!n || typeof n != "string")
    throw new Error("Invalid tag name: must be a non-empty string");
  const t = n.replace(/[<>'"&]/g, "");
  return M.has(t) ? t : (console.warn(`Unknown tag: ${t}. Allowed tags: ${Array.from(M).join(", ")}`), "UnknownTag");
}
function O(n) {
  if (!n || typeof n != "string")
    throw new Error("Invalid attribute name: must be a non-empty string");
  const t = n.replace(/[<>'"&]/g, "");
  return A.has(t) ? t : (console.warn(`Unknown attribute: ${t}. Allowed attributes: ${Array.from(A).join(", ")}`), "unknown-attr");
}
function _(n) {
  if (n == null)
    return "";
  if (typeof n == "string" || typeof n == "number" || typeof n == "boolean")
    return String(n);
  if (typeof n != "object" || Array.isArray(n))
    throw new Error(`jsxToTXML: element must be a TXMLElement object, got ${typeof n}`);
  if (!n.tag || typeof n.tag != "string")
    throw new Error(`jsxToTXML: element.tag must be a string, got ${typeof n.tag}`);
  if (!n.attributes || typeof n.attributes != "object" || Array.isArray(n.attributes))
    throw new Error(`jsxToTXML: element.attributes must be an object, got ${typeof n.attributes}`);
  if (!n.children || !Array.isArray(n.children))
    throw new Error(`jsxToTXML: element.children must be an array, got ${typeof n.children}`);
  const { tag: t, attributes: e, children: s } = n, o = V(t), r = Object.entries(e || {}).map(([l, h]) => {
    const a = O(l), c = String(h).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `${a}="${c}"`;
  }).join(" "), i = (s || []).map((l) => _(l)).join("");
  return !s || s.length === 0 ? `<${o}${r ? " " + r : ""} />` : `<${o}${r ? " " + r : ""}>${i}</${o}>`;
}
let J = 0;
const $ = /* @__PURE__ */ new Map();
function Y(n) {
  if (n == null)
    throw new Error("useState: initialValue cannot be null or undefined");
  const t = `state_${J++}`;
  $.has(t) || $.set(t, typeof n == "function" ? n() : n);
  const e = (s) => {
    if (s == null)
      throw new Error("useState: setValue cannot accept null or undefined");
    const o = $.get(t), r = typeof s == "function" ? s(o) : s;
    $.set(t, r);
  };
  return [$.get(t), e];
}
function tt(n) {
  return {
    render: (t) => {
      const e = _(t);
      return console.log("Rendered TXML:", e), n && (n.textContent = e), e;
    }
  };
}
class et {
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
class st {
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
  et as DefaultConsoleLogger,
  Q as Fragment,
  st as NoopLogger,
  P as StateManager,
  W as StyleEngine,
  v as TSSParseError,
  x as TXMLParseError,
  H as TXMLTSSRenderer,
  C as WidgetRenderers,
  Z as createRenderer,
  tt as createRoot,
  z as createStateManager,
  U as createStyleEngine,
  q as createWidgetRenderers,
  D as jsx,
  _ as jsxToTXML,
  K as jsxs,
  X as parseTSS,
  j as parseTXML,
  Y as useState
};
