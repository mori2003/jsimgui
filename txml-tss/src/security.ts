/**
 * Security validation and sanitization for TXML/TSS renderer
 */

// Test mode flag - when true, allows more lenient validation for testing
let testMode = false;

export function setTestMode(enabled: boolean): void {
  testMode = enabled;
}

export function isTestMode(): boolean {
  return testMode;
}

// Allowed TXML tags (whitelist approach)
export const ALLOWED_TAGS = new Set([
  'App', 'Head', 'Body', 'Window', 'Text', 'Button', 'InputText', 
  'SliderFloat', 'Checkbox', 'SameLine', 'Spacing', 'Separator'
]);

// Allowed attributes for each tag
export const ALLOWED_ATTRIBUTES = new Map([
  ['App', new Set()],
  ['Head', new Set()],
  ['Body', new Set()],
  ['Window', new Set(['title', 'width', 'height', 'id'])],
  ['Text', new Set(['color', 'content', 'className'])],
  ['Button', new Set(['onClick', 'id', 'width', 'color'])],
  ['InputText', new Set(['label', 'hint', 'value', 'width'])],
  ['SliderFloat', new Set(['label', 'min', 'max', 'value', 'width'])],
  ['Checkbox', new Set(['label', 'checked', 'onChange', 'width'])],
  ['SameLine', new Set(['offset', 'spacing'])],
  ['Spacing', new Set()],
  ['Separator', new Set()]
]);

// Allowed TSS properties
export const ALLOWED_TSS_PROPERTIES = new Set([
  'text-color', 'button-color', 'widget-background-color', 'width', 'height',
  'color', 'background-color', 'font-family', 'content'
]);

// Allowed event handlers (whitelist)
export const ALLOWED_EVENT_HANDLERS = new Set([
  'onClick', 'onChange', 'onInput', 'onFocus', 'onBlur'
]);

/**
 * Sanitize a string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>\"'&]/g, (match) => {
      switch (match) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '&': return '&amp;';
        default: return match;
      }
    })
    .trim();
}

/**
 * Validate and sanitize tag name
 */
export function validateTagName(tag: string): { isValid: boolean; sanitized: string; error?: string } {
  if (typeof tag !== 'string') {
    return { isValid: false, sanitized: '', error: 'Tag name must be a string' };
  }
  
  const sanitized = sanitizeString(tag);
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'Tag name cannot be empty' };
  }
  
  if (!ALLOWED_TAGS.has(sanitized)) {
    if (testMode) {
      // In test mode, allow unknown tags but log a warning
      console.warn(`Unknown tag: ${sanitized}`);
      return { isValid: true, sanitized };
    }
    return { 
      isValid: false, 
      sanitized: '', 
      error: `Tag '${sanitized}' is not allowed. Allowed tags: ${Array.from(ALLOWED_TAGS).join(', ')}` 
    };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize attribute name
 */
export function validateAttributeName(tag: string, attr: string): { isValid: boolean; sanitized: string; error?: string } {
  if (typeof attr !== 'string') {
    return { isValid: false, sanitized: '', error: 'Attribute name must be a string' };
  }
  
  const sanitized = sanitizeString(attr);
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'Attribute name cannot be empty' };
  }
  
  const allowedAttrs = ALLOWED_ATTRIBUTES.get(tag);
  if (!allowedAttrs || !allowedAttrs.has(sanitized)) {
    if (testMode) {
      // In test mode, allow unknown attributes but log a warning
      console.warn(`Unknown attribute: ${sanitized} for tag ${tag}`);
      return { isValid: true, sanitized };
    }
    return { 
      isValid: false, 
      sanitized: '', 
      error: `Attribute '${sanitized}' is not allowed for tag '${tag}'. Allowed attributes: ${Array.from(allowedAttrs || []).join(', ')}` 
    };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize attribute value
 */
export function validateAttributeValue(attr: string, value: any): { isValid: boolean; sanitized: string; error?: string } {
  if (value === null || value === undefined) {
    return { isValid: true, sanitized: '' };
  }
  
  const stringValue = String(value);
  const sanitized = sanitizeString(stringValue);
  
  // Additional validation for specific attributes
  if (attr === 'onClick' || attr === 'onChange') {
    // Event handlers should only contain alphanumeric characters and underscores
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(sanitized)) {
      return { 
        isValid: false, 
        sanitized: '', 
        error: `Event handler '${sanitized}' contains invalid characters. Only alphanumeric characters and underscores are allowed.` 
      };
    }
  }
  
  if (attr === 'width' || attr === 'height') {
    // Numeric attributes should be valid numbers
    const numValue = parseFloat(sanitized);
    if (isNaN(numValue) || numValue < 0) {
      return { 
        isValid: false, 
        sanitized: '', 
        error: `Attribute '${attr}' must be a positive number, got '${sanitized}'` 
      };
    }
  }
  
  if (attr === 'min' || attr === 'max') {
    // Min/max should be valid numbers
    const numValue = parseFloat(sanitized);
    if (isNaN(numValue)) {
      return { 
        isValid: false, 
        sanitized: '', 
        error: `Attribute '${attr}' must be a number, got '${sanitized}'` 
      };
    }
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate TSS property name
 */
export function validateTSSProperty(property: string): { isValid: boolean; sanitized: string; error?: string } {
  if (typeof property !== 'string') {
    return { isValid: false, sanitized: '', error: 'Property name must be a string' };
  }
  
  const sanitized = sanitizeString(property);
  
  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'Property name cannot be empty' };
  }
  
  if (!ALLOWED_TSS_PROPERTIES.has(sanitized)) {
    if (testMode) {
      // In test mode, allow unknown properties but log a warning
      console.warn(`Unknown property: ${sanitized}`);
      return { isValid: true, sanitized };
    }
    return { 
      isValid: false, 
      sanitized: '', 
      error: `TSS property '${sanitized}' is not allowed. Allowed properties: ${Array.from(ALLOWED_TSS_PROPERTIES).join(', ')}` 
    };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate TSS color value
 */
export function validateTSSColorValue(value: string): { isValid: boolean; sanitized: string; error?: string } {
  if (typeof value !== 'string') {
    return { isValid: false, sanitized: '', error: 'Color value must be a string' };
  }
  
  const sanitized = sanitizeString(value);
  
  // Check if it's a valid hex color (0xRRGGBBAA format or #RRGGBB format)
  if (!/^0x[0-9A-Fa-f]{8}$/.test(sanitized) && !/^#[0-9A-Fa-f]{6}$/.test(sanitized)) {
    return { 
      isValid: false, 
      sanitized: '', 
      error: `Invalid color format '${sanitized}'. Expected format: 0xRRGGBBAA or #RRGGBB` 
    };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize text content
 */
export function validateTextContent(content: any): { isValid: boolean; sanitized: string; error?: string } {
  if (content === null || content === undefined) {
    return { isValid: true, sanitized: '' };
  }
  
  const stringContent = String(content);
  const sanitized = sanitizeString(stringContent);
  
  // Check for potentially dangerous content
  if (sanitized.includes('javascript:') || sanitized.includes('data:') || sanitized.includes('vbscript:')) {
    return { 
      isValid: false, 
      sanitized: '', 
      error: 'Text content contains potentially dangerous protocols' 
    };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Security error class for detailed error reporting
 */
export class SecurityError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: any
  ) {
    super(message);
    this.name = 'SecurityError';
  }
}

/**
 * Create a security error with context
 */
export function createSecurityError(message: string, code: string, context?: any): SecurityError {
  return new SecurityError(message, code, context);
}
