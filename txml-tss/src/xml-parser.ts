// Simple XML parser for TXML

import { TXMLElement } from './types.js';
import { 
  validateTagName, 
  validateAttributeName, 
  validateAttributeValue, 
  validateTextContent,
  createSecurityError 
} from './security.js';

export class TXMLParseError extends Error {
  constructor(message: string, public line?: number, public column?: number) {
    super(message);
    this.name = 'TXMLParseError';
  }
}

export class TXMLParser {
  private pos = 0;
  private line = 1;
  private column = 1;

  constructor(private xml: string) {}

  parse(): TXMLElement {
    // Trim the input and skip initial whitespace
    this.xml = this.xml.trim();
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    
    this.skipWhitespace();
    
    if (this.pos >= this.xml.length || this.xml[this.pos] !== '<') {
      throw new TXMLParseError('Expected XML document to start with <', this.line, this.column);
    }

    const root = this.parseElement();
    
    if (root.tag !== 'App') {
      throw new TXMLParseError('Root element must be <App>', this.line, this.column);
    }

    this.skipWhitespace();
    if (this.pos < this.xml.length) {
      throw new TXMLParseError('Unexpected content after root element', this.line, this.column);
    }

    return root;
  }

  private parseElement(): TXMLElement {
    if (!this.consume('<')) {
      throw new TXMLParseError('Expected <', this.line, this.column);
    }

    const rawTag = this.parseTagName();
    
    // Validate and sanitize tag name
    const tagValidation = validateTagName(rawTag);
    if (!tagValidation.isValid) {
      throw createSecurityError(
        `Security validation failed: ${tagValidation.error}`, 
        'INVALID_TAG', 
        { tag: rawTag, line: this.line, column: this.column }
      );
    }
    
    const tag = tagValidation.sanitized;

    const rawAttributes = this.parseAttributes();
    const attributes: Record<string, string> = {};

    // Validate and sanitize attributes
    for (const [attrName, attrValue] of Object.entries(rawAttributes)) {
      const attrValidation = validateAttributeName(tag, attrName);
      if (!attrValidation.isValid) {
        throw createSecurityError(
          `Security validation failed: ${attrValidation.error}`, 
          'INVALID_ATTRIBUTE', 
          { tag, attribute: attrName, line: this.line, column: this.column }
        );
      }
      
      const valueValidation = validateAttributeValue(attrName, attrValue);
      if (!valueValidation.isValid) {
        throw createSecurityError(
          `Security validation failed: ${valueValidation.error}`, 
          'INVALID_ATTRIBUTE_VALUE', 
          { tag, attribute: attrName, value: attrValue, line: this.line, column: this.column }
        );
      }
      
      attributes[attrValidation.sanitized] = valueValidation.sanitized;
    }

    if (this.consume('/>')) {
      // Self-closing tag
      return { tag, attributes, children: [] };
    }

    if (!this.consume('>')) {
      throw new TXMLParseError('Expected > or />', this.line, this.column);
    }

    const children = this.parseChildren(tag);

    if (!this.consume('</')) {
      throw new TXMLParseError('Expected closing tag', this.line, this.column);
    }

    const closingTag = this.parseTagName();
    if (closingTag !== tag) {
      throw new TXMLParseError(`Mismatched closing tag: expected </${tag}> but found </${closingTag}>`, this.line, this.column);
    }

    if (!this.consume('>')) {
      throw new TXMLParseError('Expected > in closing tag', this.line, this.column);
    }

    return { tag, attributes, children };
  }

  private parseTagName(): string {
    const start = this.pos;
    while (this.pos < this.xml.length && /[a-zA-Z0-9_-]/.test(this.xml[this.pos])) {
      this.pos++;
      this.column++;
    }
    return this.xml.slice(start, this.pos);
  }

  private parseAttributes(): Record<string, string> {
    const attributes: Record<string, string> = {};
    
    this.skipWhitespace();
    
    while (this.pos < this.xml.length && this.xml[this.pos] !== '>' && this.xml[this.pos] !== '/') {
      const name = this.parseAttributeName();
      
      if (!this.consume('=')) {
        throw new TXMLParseError('Expected = after attribute name', this.line, this.column);
      }
      
      const value = this.parseAttributeValue();
      attributes[name] = value;
      
      this.skipWhitespace();
    }
    
    return attributes;
  }

  private parseAttributeName(): string {
    const start = this.pos;
    while (this.pos < this.xml.length && /[a-zA-Z0-9_-]/.test(this.xml[this.pos])) {
      this.pos++;
      this.column++;
    }
    return this.xml.slice(start, this.pos);
  }

  private parseAttributeValue(): string {
    const quote = this.consume('"') ? '"' : (this.consume("'") ? "'" : null);
    
    if (!quote) {
      throw new TXMLParseError('Expected quoted attribute value', this.line, this.column);
    }
    
    const start = this.pos;
    while (this.pos < this.xml.length && this.xml[this.pos] !== quote) {
      if (this.xml[this.pos] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.pos++;
    }
    
    if (!this.consume(quote)) {
      throw new TXMLParseError('Unclosed attribute value', this.line, this.column);
    }
    
    return this.xml.slice(start, this.pos - 1);
  }

  private parseChildren(_parentTag: string): (TXMLElement | string)[] {
    const children: (TXMLElement | string)[] = [];
    
    while (this.pos < this.xml.length) {
      this.skipWhitespace();
      
      if (this.xml.startsWith('</', this.pos)) {
        break;
      }
      
      if (this.xml[this.pos] === '<') {
        if (this.xml.startsWith('<!--', this.pos)) {
          // HTML comment - skip it
          this.skipComment();
          continue;
        }
        children.push(this.parseElement());
      } else {
        const text = this.parseText();
        if (text.trim()) {
          children.push(text);
        }
      }
    }
    
    return children;
  }

  private parseText(): string {
    const start = this.pos;
    while (this.pos < this.xml.length && this.xml[this.pos] !== '<') {
      if (this.xml[this.pos] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.pos++;
    }
    
    const rawText = this.xml.slice(start, this.pos);
    
    // Validate and sanitize text content
    const textValidation = validateTextContent(rawText);
    if (!textValidation.isValid) {
      throw createSecurityError(
        `Security validation failed: ${textValidation.error}`, 
        'INVALID_TEXT_CONTENT', 
        { text: rawText, line: this.line, column: this.column }
      );
    }
    
    return textValidation.sanitized;
  }

  private skipWhitespace(): void {
    while (this.pos < this.xml.length && /\s/.test(this.xml[this.pos])) {
      if (this.xml[this.pos] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.pos++;
    }
  }

  private consume(expected: string): boolean {
    if (this.xml.startsWith(expected, this.pos)) {
      this.pos += expected.length;
      this.column += expected.length;
      return true;
    }
    return false;
  }

  private skipComment(): void {
    // Skip <!--
    this.pos += 4;
    this.column += 4;
    
    // Find -->
    while (this.pos < this.xml.length) {
      if (this.xml.startsWith('-->', this.pos)) {
        this.pos += 3;
        this.column += 3;
        break;
      }
      
      if (this.xml[this.pos] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.pos++;
    }
  }
}

export function parseTXML(xml: string): TXMLElement | null {
  try {
    if (!xml || typeof xml !== 'string') {
      console.error('Invalid TXML input: must be a non-empty string');
      return null;
    }
    
    const parser = new TXMLParser(xml);
    return parser.parse();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('TXML parsing failed:', errorMessage);
    console.error('Input TXML:', xml.substring(0, 200) + (xml.length > 200 ? '...' : ''));
    
    // Return a safe fallback element instead of crashing
    return {
      tag: 'App',
      attributes: {},
      children: [{
        tag: 'Body',
        attributes: {},
        children: [{
          tag: 'Window',
          attributes: { title: 'Error' },
          children: [{
            tag: 'Text',
            attributes: {},
            children: [`TXML Parse Error: ${errorMessage}`]
          }]
        }]
      }]
    };
  }
}
