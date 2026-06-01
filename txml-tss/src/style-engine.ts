/**
 * Style engine for applying TSS styles to TXML elements
 */

import { TXMLElement, TSSStylesheet, TSSRule, ComputedStyle, StyleValue } from './types.js';

export class StyleEngine {
  constructor(private stylesheet: TSSStylesheet) {}

  computeStyle(element: TXMLElement, path: string[]): ComputedStyle {
    const computedStyle: ComputedStyle = {};
    
    // Apply styles in order of specificity
    const applicableRules = this.getApplicableRules(element, path);
    applicableRules.sort((a, b) => a.specificity - b.specificity);
    
    for (const rule of applicableRules) {
      for (const [property, value] of Object.entries(rule.properties)) {
        const resolvedValue = this.resolveValue(value);
        computedStyle[property] = this.parseStyleValue(property, resolvedValue);
      }
    }
    
    return computedStyle;
  }

  private getApplicableRules(element: TXMLElement, path: string[]): TSSRule[] {
    const applicableRules: TSSRule[] = [];
    
    for (const rule of this.stylesheet.rules) {
      if (this.selectorMatches(element, path, rule.selector)) {
        applicableRules.push(rule);
      }
    }
    
    return applicableRules;
  }

  private selectorMatches(element: TXMLElement, _path: string[], selector: string): boolean {
    // Simple selector matching
    const parts = selector.split(/\s+/).filter(p => p.trim());
    
    if (parts.length === 1) {
      return this.simpleSelectorMatches(element, parts[0]);
    }
    
    // Handle descendant selectors (space-separated)
    let currentElement = element;
    let selectorIndex = parts.length - 1;
    
    while (currentElement && selectorIndex >= 0) {
      if (this.simpleSelectorMatches(currentElement, parts[selectorIndex])) {
        selectorIndex--;
      }
      currentElement = currentElement.parent!;
    }
    
    return selectorIndex < 0;
  }

  private simpleSelectorMatches(element: TXMLElement, selector: string): boolean {
    if (selector.startsWith('.')) {
      // Class selector
      const className = selector.slice(1);
      return element.attributes.class?.split(/\s+/).includes(className) || false;
    } else if (selector.startsWith('#')) {
      // ID selector
      const id = selector.slice(1);
      return element.attributes.id === id;
    } else {
      // Tag selector
      return element.tag === selector;
    }
  }

  private resolveValue(value: string): string {
    // Resolve TSS variables (direct variable names, not var() syntax)
    let resolved = value;
    let changed = true;
    
    while (changed) {
      changed = false;
      // Look for variable names that are not quoted strings or numbers
      const varMatch = resolved.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/);
      
      if (varMatch) {
        const varName = varMatch[1];
        const varValue = this.stylesheet.variables.get(varName);
        
        if (varValue !== undefined) {
          resolved = resolved.replace(varMatch[0], varValue);
          changed = true;
        }
        // If variable not found, leave the original value (could be a color name or other value)
      }
    }
    
    return resolved;
  }

  private parseStyleValue(property: string, value: string): StyleValue {
    switch (property) {
      case 'color':
      case 'text-color':
      case 'background-color':
      case 'button-color':
      case 'button-color-hover':
      case 'button-color-active':
      case 'widget-background-color':
      case 'widget-background-color-hover':
      case 'widget-background-color-active':
      case 'frame-background-color':
      case 'window-background-color':
        return {
          type: 'color',
          value: this.parseColor(value)
        };
      
      case 'width':
      case 'height':
      case 'padding':
      case 'margin':
      case 'font-size':
      case 'border-radius':
        return {
          type: 'number',
          value: this.parseNumber(value)
        };
      
      case 'opacity':
        return {
          type: 'number',
          value: Math.max(0, Math.min(1, parseFloat(value) || 1))
        };
      
      default:
        return {
          type: 'string',
          value: value
        };
    }
  }

  private parseColor(value: string): number {
    // Parse 0x format colors (0xRRGGBBAA)
    if (value.startsWith('0x')) {
      const hex = value.slice(2);
      if (hex.length === 8) {
        return parseInt(hex, 16);
      } else if (hex.length === 6) {
        return parseInt(hex, 16) | 0xff000000; // Add alpha
      }
    }
    
    // Parse hex colors (#RRGGBB or #RGB)
    if (value.startsWith('#')) {
      const hex = value.slice(1);
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return (r << 16) | (g << 8) | b | 0xff000000;
      } else if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return (r << 16) | (g << 8) | b | 0xff000000;
      }
    }
    
    // Parse rgb() colors
    const rgbMatch = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return (r << 16) | (g << 8) | b | 0xff000000;
    }
    
    // TSS doesn't use named colors - all colors should be variables or hex values
    // If we get here, it means the variable wasn't resolved, so return a default
    console.warn(`TSS: Unresolved color value: ${value}. Expected hex color or variable reference.`);
    return 0xffffffff; // Default to white
  }

  private parseNumber(value: string): number {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }
}

export function createStyleEngine(stylesheet: TSSStylesheet): StyleEngine {
  return new StyleEngine(stylesheet);
}
