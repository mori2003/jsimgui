/**
 * Core types for TXML/TSS renderer
 */

export interface TXMLElement {
  tag: string;
  attributes: Record<string, string>;
  children: (TXMLElement | string)[];
  parent?: TXMLElement;
}

export interface TSSRule {
  selector: string;
  properties: Record<string, string>;
  specificity: number;
}

export interface TSSVariable {
  name: string;
  value: string;
}

export interface TSSStylesheet {
  variables: Map<string, string>;
  rules: TSSRule[];
}

export interface WidgetState {
  id: string;
  value: any;
  lastFrame: number;
}

export interface EventHandler {
  name: string;
  callback: (...args: any[]) => void;
}

export interface RenderContext {
  state: Map<string, WidgetState>;
  eventHandlers: Map<string, EventHandler>;
  stylesheet: TSSStylesheet;
  frameNumber: number;
  currentPath: string[];
}

export interface WidgetRenderer {
  (element: TXMLElement, context: RenderContext, computedStyle?: ComputedStyle, styleEngine?: any): void;
}

export interface StyleValue {
  type: 'color' | 'number' | 'string' | 'boolean';
  value: any;
}

export interface ComputedStyle {
  [property: string]: StyleValue;
}

// Supported TXML tags
export const SUPPORTED_TAGS = [
  'App', 'Head', 'Body', 'Window', 'Text', 'Button', 'InputText', 
  'SliderFloat', 'Checkbox', 'SameLine', 'Spacing', 'Separator'
] as const;

export type SupportedTag = typeof SUPPORTED_TAGS[number];

// Supported TSS properties (based on TSS specification)
export const SUPPORTED_PROPERTIES = [
  'text-color', 'button-color', 'button-color-hover', 'button-color-active',
  'widget-background-color', 'widget-background-color-hover', 'widget-background-color-active',
  'frame-background-color', 'frame-background-color-hover', 'frame-background-color-active',
  'window-background-color', 'popup-background-color', 'border-color',
  'scrollbar-background-color', 'scrollbar-grab-color', 'scrollbar-grab-hover-color',
  'header-background-color', 'header-hover-color', 'header-active-color',
  'title-background-color', 'title-active-color', 'title-collapsed-color',
  'menu-bar-background-color', 'tab-background-color', 'tab-hover-color', 'tab-active-color',
  'docking-background-color', 'docking-preview-color', 'docking-empty-color',
  'plot-background-color', 'plot-line-color', 'plot-histogram-color',
  'table-background-color', 'table-border-color', 'table-header-background-color',
  'table-row-background-color', 'table-row-alt-background-color',
  'drag-drop-background-color', 'nav-highlight-color', 'nav-windowing-highlight-color',
  'nav-windowing-darkening-color', 'modal-window-darkening-color'
] as const;

export type SupportedProperty = typeof SUPPORTED_PROPERTIES[number];

// Logger interface for capturing generated calls
export interface Logger {
  startFrame(): void;
  endFrame(): void;
  logImGui(callText: string): void;
  logDom?(callText: string): void;
  flush?(): void;
  getBuffer?(): string[];
}


