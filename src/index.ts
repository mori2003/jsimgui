// Main exports for the TXML/TSS renderer

export { TXMLTSSRenderer, createRenderer } from './renderer.js';
export { parseTXML } from './xml-parser.js';
export { parseTSS } from './tss-parser.js';
export { StateManager, createStateManager } from './state-manager.js';
export { StyleEngine, createStyleEngine } from './style-engine.js';
export { WidgetRenderers, createWidgetRenderers } from './widget-renderers.js';
export { jsx, jsxs, Fragment, jsxToTXML, createRoot, useState } from './jsx-runtime.js';
export { DefaultConsoleLogger, NoopLogger } from './logger.js';

export type {
  TXMLElement,
  TSSRule,
  TSSVariable,
  TSSStylesheet,
  WidgetState,
  EventHandler,
  RenderContext,
  WidgetRenderer,
  StyleValue,
  ComputedStyle,
  SupportedTag,
  SupportedProperty
} from './types.js';

export type { Logger } from './types.js';

export { TXMLParseError } from './xml-parser.js';
export { TSSParseError } from './tss-parser.js';
export { setTestMode, isTestMode } from './security.js';
