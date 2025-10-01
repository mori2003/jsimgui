// TSS (Trema Style Sheets) parser

import { TSSRule, TSSVariable, TSSStylesheet } from './types.js';
import { 
  validateTSSProperty, 
  validateTSSColorValue, 
  createSecurityError 
} from './security.js';

export class TSSParseError extends Error {
  constructor(message: string, public line?: number, public column?: number) {
    super(message);
    this.name = 'TSSParseError';
  }
}

export class TSSParser {
  private pos = 0;
  private line = 1;
  private column = 1;

  constructor(private tss: string) {}

  parse(): TSSStylesheet {
    const variables = new Map<string, string>();
    const rules: TSSRule[] = [];

    this.skipWhitespace();

    while (this.pos < this.tss.length) {
      if (this.tss.startsWith('scope', this.pos)) {
        // TSS scope block for variables and nested rules
        const scopeRules = this.parseScopeBlock(variables);
        rules.push(...scopeRules);
      } else if (this.tss[this.pos] === '@') {
        // At-rule (like @media, @import, etc.)
        this.parseAtRule();
      } else {
        // TSS rule
        const rule = this.parseRule(variables);
        if (rule) {
          rules.push(rule);
        }
      }
      this.skipWhitespace();
    }

    return { variables, rules };
  }

  private parseScopeBlock(variables: Map<string, string>): TSSRule[] {
    const rules: TSSRule[] = [];
    
    // Skip 'scope'
    this.pos += 5;
    this.column += 5;
    
    this.skipWhitespace();
    
    if (!this.consume('{')) {
      throw new TSSParseError('Expected { after scope', this.line, this.column);
    }
    
    while (this.pos < this.tss.length && this.tss[this.pos] !== '}') {
      this.skipWhitespace();
      
      if (this.tss[this.pos] === '}') break;
      
      // Check if this is a variable declaration (name: value;) or a rule (selector { ... })
      const startPos = this.pos;
      this.parseIdentifier(); // Parse identifier to check what follows
      
      if (this.tss[this.pos] === ':') {
        // This is a variable declaration: name: value;
        this.pos = startPos; // Reset position
        const variable = this.parseTSSVariable();
        variables.set(variable.name, variable.value);
      } else {
        // This is a rule: selector { ... }
        this.pos = startPos; // Reset position
        const rule = this.parseRule(variables);
        if (rule) {
          rules.push(rule);
        }
      }
      
      this.skipWhitespace();
    }
    
    if (!this.consume('}')) {
      throw new TSSParseError('Expected } after scope block', this.line, this.column);
    }
    
    return rules;
  }

  private parseTSSVariable(): TSSVariable {
    const name = this.parseIdentifier();
    
    if (!this.consume(':')) {
      throw new TSSParseError('Expected : after variable name', this.line, this.column);
    }

    this.skipWhitespace();
    const value = this.parseValue();
    
    if (!this.consume(';')) {
      throw new TSSParseError('Expected ; after variable value', this.line, this.column);
    }

    return { name, value };
  }

  private parseRule(variables: Map<string, string>): TSSRule | null {
    const selector = this.parseSelector();
    if (!selector) return null;

    if (!this.consume('{')) {
      throw new TSSParseError('Expected { after selector', this.line, this.column);
    }

    const properties = this.parseProperties(variables);

    if (!this.consume('}')) {
      throw new TSSParseError('Expected } after properties', this.line, this.column);
    }

    const specificity = this.calculateSpecificity(selector);

    return { selector, properties, specificity };
  }

  private parseSelector(): string {
    const start = this.pos;
    
    // Find the opening brace
    while (this.pos < this.tss.length && this.tss[this.pos] !== '{') {
      this.pos++;
      this.column++;
    }
    
    return this.tss.slice(start, this.pos).trim();
  }

  private parseProperties(variables: Map<string, string> = new Map()): Record<string, string> {
    const properties: Record<string, string> = {};
    
    while (this.pos < this.tss.length && this.tss[this.pos] !== '}') {
      this.skipWhitespace();
      
      if (this.tss[this.pos] === '}') break;
      
      const rawName = this.parseIdentifier();
      
      // Validate and sanitize property name
      const propertyValidation = validateTSSProperty(rawName);
      if (!propertyValidation.isValid) {
        throw createSecurityError(
          `Security validation failed: ${propertyValidation.error}`, 
          'INVALID_TSS_PROPERTY', 
          { property: rawName, line: this.line, column: this.column }
        );
      }
      
      const name = propertyValidation.sanitized;
      
      if (!this.consume(':')) {
        throw new TSSParseError('Expected : after property name', this.line, this.column);
      }
      
      this.skipWhitespace();
      let rawValue = this.parseValue();
      
      // Substitute variables in the value
      rawValue = this.substituteVariables(rawValue, variables);
      
      // Validate color values
      if (name === 'text-color' || name === 'button-color' || name === 'widget-background-color') {
        const colorValidation = validateTSSColorValue(rawValue);
        if (!colorValidation.isValid) {
          throw createSecurityError(
            `Security validation failed: ${colorValidation.error}`, 
            'INVALID_TSS_COLOR', 
            { property: name, value: rawValue, line: this.line, column: this.column }
          );
        }
        rawValue = colorValidation.sanitized;
      }
      
      properties[name] = rawValue;
      
      if (!this.consume(';')) {
        throw new TSSParseError('Expected ; after property value', this.line, this.column);
      }
      
      this.skipWhitespace();
    }
    
    return properties;
  }

  private parseValue(): string {
    const start = this.pos;
    
    // Handle quoted strings
    if (this.tss[this.pos] === '"' || this.tss[this.pos] === "'") {
      const quote = this.tss[this.pos];
      this.pos++;
      this.column++;
      
      while (this.pos < this.tss.length && this.tss[this.pos] !== quote) {
        if (this.tss[this.pos] === '\n') {
          this.line++;
          this.column = 1;
        } else {
          this.column++;
        }
        this.pos++;
      }
      
      if (this.pos < this.tss.length) {
        this.pos++;
        this.column++;
      }
      
      return this.tss.slice(start + 1, this.pos - 1);
    }
    
    // Handle unquoted values
    while (this.pos < this.tss.length && 
           this.tss[this.pos] !== ';' && 
           this.tss[this.pos] !== '}' && 
           !/\s/.test(this.tss[this.pos])) {
      this.pos++;
      this.column++;
    }
    
    return this.tss.slice(start, this.pos).trim();
  }

  private parseIdentifier(): string {
    const start = this.pos;
    
    while (this.pos < this.tss.length && 
           /[a-zA-Z0-9_-]/.test(this.tss[this.pos])) {
      this.pos++;
      this.column++;
    }
    
    return this.tss.slice(start, this.pos);
  }

  private parseAtRule(): void {
    // Skip @rules for now (like @media, @import)
    while (this.pos < this.tss.length && this.tss[this.pos] !== ';' && this.tss[this.pos] !== '{') {
      this.pos++;
      this.column++;
    }
    
    if (this.tss[this.pos] === '{') {
      // Skip the entire block
      let depth = 1;
      this.pos++;
      this.column++;
      
      while (this.pos < this.tss.length && depth > 0) {
        if (this.tss[this.pos] === '{') depth++;
        else if (this.tss[this.pos] === '}') depth--;
        
        if (this.tss[this.pos] === '\n') {
          this.line++;
          this.column = 1;
        } else {
          this.column++;
        }
        this.pos++;
      }
    } else {
      // Skip to semicolon
      while (this.pos < this.tss.length && this.tss[this.pos] !== ';') {
        this.pos++;
        this.column++;
      }
      if (this.pos < this.tss.length) {
        this.pos++;
        this.column++;
      }
    }
  }

  private calculateSpecificity(selector: string): number {
    // Simple specificity calculation: tag=1, class=10, id=100
    let specificity = 0;
    
    const parts = selector.split(/\s+/);
    for (const part of parts) {
      if (part.startsWith('#')) specificity += 100;
      else if (part.startsWith('.')) specificity += 10;
      else if (part.match(/^[a-zA-Z]/)) specificity += 1;
    }
    
    return specificity;
  }

  private skipWhitespace(): void {
    while (this.pos < this.tss.length) {
      if (/\s/.test(this.tss[this.pos])) {
        if (this.tss[this.pos] === '\n') {
          this.line++;
          this.column = 1;
        } else {
          this.column++;
        }
        this.pos++;
      } else if (this.tss.startsWith('/*', this.pos)) {
        // Skip CSS comments
        this.pos += 2;
        this.column += 2;
        while (this.pos < this.tss.length && !this.tss.startsWith('*/', this.pos)) {
          if (this.tss[this.pos] === '\n') {
            this.line++;
            this.column = 1;
          } else {
            this.column++;
          }
          this.pos++;
        }
        if (this.tss.startsWith('*/', this.pos)) {
          this.pos += 2;
          this.column += 2;
        }
      } else {
        break;
      }
    }
  }

  private substituteVariables(value: string, variables: Map<string, string>): string {
    // Replace variable references with their values
    let result = value;
    for (const [varName, varValue] of variables) {
      // Replace variable references (e.g., "red" -> "0xCC0000FF")
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      result = result.replace(regex, varValue);
    }
    return result;
  }

  private consume(expected: string): boolean {
    if (this.tss.startsWith(expected, this.pos)) {
      this.pos += expected.length;
      this.column += expected.length;
      return true;
    }
    return false;
  }
}

export function parseTSS(tss: string): TSSStylesheet | null {
  try {
    const parser = new TSSParser(tss);
    return parser.parse();
  } catch (error) {
    console.error('TSS parsing failed:', error);
    return null;
  }
}





