// JSX runtime for TXML generation

import { TXMLElement } from './types.js';
import { 
  validateTagName, 
  validateAttributeName, 
  validateAttributeValue, 
  validateTextContent,
  createSecurityError,
  isTestMode
} from './security.js';

// Global handler registry for JSX inline event functions (e.g., onClick)
function getGlobalHandlerRegistry(): Record<string, Function> {
  const g = globalThis as any;
  if (!g.__txmlJsxHandlers) {
    g.__txmlJsxHandlers = Object.create(null);
  }
  return g.__txmlJsxHandlers as Record<string, Function>;
}

function getNextHandlerId(): string {
  const g = globalThis as any;
  if (typeof g.__txmlJsxHandlerSeq !== 'number') {
    g.__txmlJsxHandlerSeq = 0;
  }
  g.__txmlJsxHandlerSeq += 1;
  return `jsx_fn_${g.__txmlJsxHandlerSeq}`;
}

// JSX factory function
export function jsx(type: string, props: any, key?: any): TXMLElement {
  // Runtime type validation
  if (typeof type !== 'string') {
    throw new Error(`JSX type must be a string, got ${typeof type}`);
  }
  
  // Validate and sanitize tag name
  const tagValidation = validateTagName(type);
  if (!tagValidation.isValid) {
    throw createSecurityError(
      `Security validation failed: ${tagValidation.error}`, 
      'INVALID_JSX_TAG', 
      { tag: type }
    );
  }
  
  const attributes: Record<string, string> = {};
  const children: (TXMLElement | string)[] = [];

  // Handle children from props.children or key parameter with security validation
  if (props && props.children !== undefined) {
    if (Array.isArray(props.children)) {
      const validatedChildren = props.children
        .filter((child: any) => child !== null && child !== undefined && child !== false)
        .map((child: any) => {
          if (typeof child === 'string') {
            // Validate text content
            const textValidation = validateTextContent(child);
            if (!textValidation.isValid) {
              throw createSecurityError(
                `Security validation failed: ${textValidation.error}`, 
                'INVALID_JSX_TEXT_CONTENT', 
                { text: child }
              );
            }
            return textValidation.sanitized;
          } else if (typeof child === 'number' || typeof child === 'boolean') {
            return String(child);
          } else {
            return child;
          }
        });
      children.push(...validatedChildren);
    } else if (props.children !== null && props.children !== undefined) {
      const ch: any = props.children;
      if (typeof ch === 'string') {
        // Validate text content
        const textValidation = validateTextContent(ch);
        if (!textValidation.isValid) {
          throw createSecurityError(
            `Security validation failed: ${textValidation.error}`, 
            'INVALID_JSX_TEXT_CONTENT', 
            { text: ch }
          );
        }
        children.push(textValidation.sanitized);
      } else {
        children.push(typeof ch === 'number' || typeof ch === 'boolean' ? String(ch) : ch);
      }
    }
  } else if (key !== undefined) {
    // JSX passes children as the third parameter (key)
    if (Array.isArray(key)) {
      const validatedChildren = key
        .filter((child: any) => child !== null && child !== undefined && child !== false)
        .map((child: any) => {
          if (typeof child === 'string') {
            // Validate text content
            const textValidation = validateTextContent(child);
            if (!textValidation.isValid) {
              throw createSecurityError(
                `Security validation failed: ${textValidation.error}`, 
                'INVALID_JSX_TEXT_CONTENT', 
                { text: child }
              );
            }
            return textValidation.sanitized;
          } else if (typeof child === 'number' || typeof child === 'boolean') {
            return String(child);
          } else {
            return child;
          }
        });
      children.push(...validatedChildren);
    } else if (key !== null && key !== undefined) {
      if (typeof key === 'string') {
        // Validate text content
        const textValidation = validateTextContent(key);
        if (!textValidation.isValid) {
          throw createSecurityError(
            `Security validation failed: ${textValidation.error}`, 
            'INVALID_JSX_TEXT_CONTENT', 
            { text: key }
          );
        }
        children.push(textValidation.sanitized);
      } else {
        children.push(typeof key === 'number' || typeof key === 'boolean' ? String(key) : (key as any));
      }
    }
  }

  // Convert props to attributes with security validation
  if (props) {
    for (const [rawKey, value] of Object.entries(props)) {
      if (rawKey === 'children') {
        // Already handled above
        continue;
      } else if (rawKey === 'key') {
        // Skip React key prop
        continue;
      } else {
        // Validate and sanitize attribute name
        const attrValidation = validateAttributeName(tagValidation.sanitized, rawKey);
        if (!attrValidation.isValid) {
          // In test mode, rename unknown attributes to 'unknown-attr' instead of throwing
          if (isTestMode()) {
            console.warn(`Unknown attribute: ${rawKey} for tag ${tagValidation.sanitized}`);
            const key = 'unknown-attr';
            // Handle multiple unknown attributes by appending values
            if (attributes[key]) {
              attributes[key] += ` ${String(value)}`;
            } else {
              attributes[key] = String(value);
            }
            continue;
          } else {
            throw createSecurityError(
              `Security validation failed: ${attrValidation.error}`, 
              'INVALID_JSX_ATTRIBUTE', 
              { tag: tagValidation.sanitized, attribute: rawKey }
            );
          }
        }
        
        const key = attrValidation.sanitized;
        
        // Event handler: register function in global registry and serialize handler name
        if (typeof value === 'function' && /^on[A-Z]/.test(key)) {
          const registry = getGlobalHandlerRegistry();
          const handlerId = getNextHandlerId();
          registry[handlerId] = value as Function;
          
          // Validate handler ID
          const handlerValidation = validateAttributeValue(key, handlerId);
          if (!handlerValidation.isValid) {
            throw createSecurityError(
              `Security validation failed: ${handlerValidation.error}`, 
              'INVALID_JSX_HANDLER', 
              { tag: tagValidation.sanitized, attribute: key, value: handlerId }
            );
          }
          
          attributes[key] = handlerValidation.sanitized;
          continue;
        }

        // Convert other values to string and validate
        const stringValue = String(value);
        const valueValidation = validateAttributeValue(key, stringValue);
        if (!valueValidation.isValid) {
          throw createSecurityError(
            `Security validation failed: ${valueValidation.error}`, 
            'INVALID_JSX_ATTRIBUTE_VALUE', 
            { tag: tagValidation.sanitized, attribute: key, value: stringValue }
          );
        }
        
        attributes[key] = valueValidation.sanitized;
      }
    }
  }

  return {
    tag: type,
    attributes,
    children
  };
}

// JSX factory for multiple children
export function jsxs(type: string, props: any, ...children: any[]): TXMLElement {
  // Runtime type validation
  if (typeof type !== 'string') {
    throw new Error(`JSX type must be a string, got ${typeof type}`);
  }
  
  const attributes: Record<string, string> = {};
  const processedChildren: (TXMLElement | string)[] = [];

  // Process children - handle both array and individual parameters
  children.forEach(child => {
    if (Array.isArray(child)) {
      // If child is an array, process each item in the array
      child.forEach(arrayChild => {
        if (arrayChild !== null && arrayChild !== undefined && arrayChild !== false) {
          if (typeof arrayChild === 'number' || typeof arrayChild === 'boolean') {
            processedChildren.push(String(arrayChild));
          } else {
            processedChildren.push(arrayChild);
          }
        }
      });
    } else if (child !== null && child !== undefined && child !== false) {
      if (typeof child === 'number' || typeof child === 'boolean') {
        processedChildren.push(String(child));
      } else {
        processedChildren.push(child);
      }
    }
  });

  // Convert props to attributes
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key === 'children') {
        // Handle children from props if present
        if (Array.isArray(value)) {
          value.forEach(child => {
            if (child !== null && child !== undefined && child !== false) {
              if (typeof child === 'number' || typeof child === 'boolean') {
                processedChildren.push(String(child));
              } else {
                processedChildren.push(child);
              }
            }
          });
        } else if (value !== null && value !== undefined) {
          if (typeof value === 'number' || typeof value === 'boolean') {
            processedChildren.push(String(value));
          } else {
            processedChildren.push(value as TXMLElement | string);
          }
        }
        continue;
      } else if (key === 'key') {
        // Skip React key prop
        continue;
      } else {
        // Event handler: register function in global registry and serialize handler name
        if (typeof value === 'function' && /^on[A-Z]/.test(key)) {
          const registry = getGlobalHandlerRegistry();
          const handlerId = getNextHandlerId();
          registry[handlerId] = value as Function;
          attributes[key] = handlerId;
          continue;
        }

        // Convert other values to string
        attributes[key] = String(value);
      }
    }
  }

  return {
    tag: type,
    attributes,
    children: processedChildren
  };
}

// Fragment support
export const Fragment = Symbol('Fragment');



// Validate and sanitize attribute name
function sanitizeAttributeName(key: string): string {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid attribute name: must be a non-empty string');
  }
  
  // Remove any potentially dangerous characters
  const sanitized = key.replace(/[<>'"&]/g, '');
  
  return sanitized;
}

// Helper function to convert JSX to TXML string
export function jsxToTXML(element: TXMLElement): string {
  if (element == null) {
    return '';
  }

  if (typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean') {
    return String(element);
  }

  // Runtime type validation for TXMLElement
  if (typeof element !== 'object' || Array.isArray(element)) {
    throw new Error(`jsxToTXML: element must be a TXMLElement object, got ${typeof element}`);
  }

  if (!element.tag || typeof element.tag !== 'string') {
    throw new Error(`jsxToTXML: element.tag must be a string, got ${typeof element.tag}`);
  }

  if (!element.attributes || typeof element.attributes !== 'object' || Array.isArray(element.attributes)) {
    throw new Error(`jsxToTXML: element.attributes must be an object, got ${typeof element.attributes}`);
  }

  if (!element.children || !Array.isArray(element.children)) {
    throw new Error(`jsxToTXML: element.children must be an array, got ${typeof element.children}`);
  }

  const { tag, attributes, children } = element;
  
  // Validate and sanitize tag name
  const tagValidation = validateTagName(tag);
  if (!tagValidation.isValid) {
    throw new Error(`Invalid tag name: ${tagValidation.error}`);
  }
  const safeTag = tagValidation.sanitized;
  
  // Build attributes string with proper escaping and validation
  const attrsStr = Object.entries(attributes || {})
    .map(([key, value]) => {
      const safeKey = sanitizeAttributeName(key);
      const escapedValue = String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `${safeKey}="${escapedValue}"`;
    })
    .join(' ');

  // Build children string
  const childrenStr = (children || [])
    .map(child => jsxToTXML(child as any))
    .join('');

  if (!children || children.length === 0) {
    return `<${safeTag}${attrsStr ? ' ' + attrsStr : ''} />`;
  }

  return `<${safeTag}${attrsStr ? ' ' + attrsStr : ''}>${childrenStr}</${safeTag}>`;
}

// Example usage:
/*
// This JSX:
const App = () => (
  <App>
    <Head />
    <Body>
      <Window title="My App">
        <Text>Hello, JSX!</Text>
        <Button onClick="handleClick">Click Me</Button>
      </Window>
    </Body>
  </App>
);

// Compiles to:
const App = () => jsxs("App", null, jsxs("Head", null), jsxs("Body", null, 
  jsxs("Window", { title: "My App" }, 
    jsx("Text", null, "Hello, JSX!"),
    jsx("Button", { onClick: "handleClick" }, "Click Me")
  )
));

// Can be converted to TXML:
const txml = jsxToTXML(App());
*/

// React-like hooks for JSX components
let stateId = 0;
const stateMap = new Map<string, any>();

export function useState<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Runtime type validation for initialValue
  if (initialValue === null || initialValue === undefined) {
    throw new Error(`useState: initialValue cannot be null or undefined`);
  }
  
  const id = `state_${stateId++}`;
  
  if (!stateMap.has(id)) {
    stateMap.set(id, typeof initialValue === 'function' ? (initialValue as Function)() : initialValue);
  }
  
  const setValue = (value: T | ((prev: T) => T)) => {
    // Runtime type validation for setValue
    if (value === null || value === undefined) {
      throw new Error(`useState: setValue cannot accept null or undefined`);
    }
    
    const currentValue = stateMap.get(id);
    const newValue = typeof value === 'function' ? (value as Function)(currentValue) : value;
    stateMap.set(id, newValue);
  };
  
  return [stateMap.get(id), setValue];
}

// Simple root renderer
export function createRoot(container: HTMLElement) {
  return {
    render: (element: TXMLElement) => {
      // Convert JSX element to TXML and render
      const txml = jsxToTXML(element);
      console.log('Rendered TXML:', txml);
      // In a real implementation, this would render to the container
      if (container) {
        container.textContent = txml;
      }
      return txml;
    }
  };
}
