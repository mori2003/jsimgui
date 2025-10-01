# Security & Error Handling

This document outlines the comprehensive security measures and error handling implemented in the TXML/TSS renderer.

## Security Features

### 1. Input Validation & Sanitization

#### Tag Name Validation
- **Whitelist Approach**: Only predefined tags are allowed
- **Sanitization**: Dangerous characters are removed/escaped
- **Validation**: Tag names are validated against allowed list
- **Test Mode**: Lenient validation during testing with warnings

```typescript
// Allowed tags with comprehensive coverage
const ALLOWED_TAGS = new Set([
  'App', 'Head', 'Body', 'Window', 'Text', 'Button', 
  'InputText', 'SliderFloat', 'Checkbox', 'SameLine', 
  'Spacing', 'Separator'
]);

// Test mode for development
export function setTestMode(enabled: boolean): void {
  testMode = enabled;
}
```

#### Attribute Validation
- **Per-Tag Validation**: Each tag has specific allowed attributes
- **Value Validation**: Attribute values are validated based on type
- **Sanitization**: All attribute values are sanitized
- **Expanded Coverage**: Comprehensive attribute support for all tags

```typescript
// Comprehensive attribute mapping
const ALLOWED_ATTRIBUTES = new Map([
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
```

#### Text Content Security
- **XSS Prevention**: Dangerous protocols are blocked
- **Character Escaping**: HTML entities are properly escaped
- **Content Validation**: Text content is validated for safety

```typescript
// Blocked dangerous content
if (content.includes('javascript:') || 
    content.includes('data:') || 
    content.includes('vbscript:')) {
  throw new SecurityError('Dangerous content detected');
}
```

### 2. TSS Security

#### Property Validation
- **Whitelist**: Only allowed TSS properties are accepted
- **Color Validation**: Color values must be in valid hex format
- **Value Sanitization**: All property values are sanitized
- **Expanded Support**: Comprehensive TSS property coverage

```typescript
// Comprehensive TSS property support
const ALLOWED_TSS_PROPERTIES = new Set([
  'text-color', 'button-color', 'widget-background-color', 
  'width', 'height', 'color', 'background-color', 
  'font-family', 'content'
]);
```

#### Color Value Security
- **Format Validation**: Colors must be in `0xRRGGBBAA` or `#RRGGBB` format
- **Range Validation**: Color values are validated for proper ranges
- **Sanitization**: Color values are sanitized before use
- **Multiple Formats**: Support for both hex formats

### 3. Event Handler Security

#### Handler Validation
- **Function Registration**: Event handlers are registered in a secure registry
- **ID Generation**: Secure handler IDs are generated
- **Validation**: Handler IDs are validated before use

```typescript
// Secure handler registration
const registry = getGlobalHandlerRegistry();
const handlerId = getNextHandlerId();
registry[handlerId] = value as Function;
```

### 4. Recent Security Enhancements

#### Test Mode Integration
- **Development Support**: Lenient validation during testing
- **Warning System**: Unknown elements generate warnings instead of errors
- **Fallback Behavior**: Invalid inputs use safe fallbacks in test mode
- **Vitest Integration**: Automatic test mode activation

```typescript
// Test mode configuration
import { setTestMode } from './security.js';

// Enable test mode for development
setTestMode(true);

// Vitest setup
beforeAll(() => {
  setTestMode(true);
});
```

#### Enhanced Error Handling
- **Graceful Failures**: All parsing and rendering operations wrapped in safe execution
- **Error Context**: Rich error context with component and operation information
- **Fallback Mechanisms**: Safe fallbacks for failed operations
- **Error Recovery**: System continues despite individual failures

```typescript
// Safe execution with fallbacks
const result = safeRender(
  () => riskyOperation(),
  { component: 'Renderer', operation: 'renderElement', input: element },
  () => fallbackOperation() // Safe fallback
);
```

#### Security Module Integration
- **Centralized Security**: All security functions in dedicated module
- **Comprehensive Validation**: Tag, attribute, and property validation
- **XSS Prevention**: Enhanced XSS protection with script detection
- **Input Sanitization**: Comprehensive input sanitization pipeline

### 5. Error Handling

#### Comprehensive Error Types
- **SecurityError**: Security validation failures
- **ValidationError**: Input validation failures
- **ParsingError**: XML/TSS parsing errors
- **RenderingError**: Rendering failures

#### Graceful Failure
- **Fallback Mechanisms**: Safe fallbacks for failed operations
- **Error Logging**: Comprehensive error logging with context
- **Recovery**: System continues operation despite individual failures

```typescript
// Safe execution with fallbacks
const result = safeRender(
  () => riskyOperation(),
  { component: 'Renderer', operation: 'render' },
  () => fallbackOperation() // Safe fallback
);
```

#### Error Context
- **Component Tracking**: Errors include component information
- **Operation Context**: Operation being performed when error occurred
- **Input Validation**: Input that caused the error
- **Stack Traces**: Full stack traces for debugging

### 5. Security Best Practices

#### Input Sanitization
```typescript
// HTML entity escaping
function sanitizeString(input: string): string {
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
    });
}
```

#### Validation Pipeline
1. **Input Type Checking**: Ensure correct data types
2. **Format Validation**: Validate input format
3. **Content Sanitization**: Sanitize dangerous content
4. **Whitelist Validation**: Check against allowed values
5. **Final Sanitization**: Final cleanup before use

#### Error Recovery
- **Individual Element Failure**: One broken element doesn't crash the UI
- **Graceful Degradation**: System continues with reduced functionality
- **User Feedback**: Meaningful error messages for developers
- **Logging**: Comprehensive error logging for debugging

### 6. Security Configuration

#### Strict Mode
- **Whitelist Enforcement**: Only whitelisted elements are allowed
- **Validation Required**: All inputs must pass validation
- **Error on Invalid**: Invalid inputs cause errors, not warnings

#### Development Mode
- **Warning Mode**: Invalid inputs generate warnings
- **Fallback Behavior**: Invalid inputs use safe fallbacks
- **Debug Information**: Additional debugging information

### 7. Security Monitoring

#### Error Tracking
- **Error Statistics**: Track error types and frequencies
- **Performance Impact**: Monitor security validation performance
- **Security Events**: Log security-related events

#### Audit Trail
- **Input Logging**: Log all inputs for security auditing
- **Validation Results**: Track validation success/failure rates
- **Error Patterns**: Identify common security issues

## Usage Examples

### Secure TXML Parsing
```typescript
import { TXMLTSSRenderer, setTestMode } from './renderer.js';

// Enable test mode for development
setTestMode(true);

const renderer = new TXMLTSSRenderer();

// This will be validated and sanitized
const txml = `
<App>
  <Button onClick="handleClick">Click Me</Button>
</App>
`;

// Security validation happens automatically
renderer.render(txml, tss);
```

### Error Handling
```typescript
import { errorHandler } from './error-handler.js';

// Get recent errors
const errors = errorHandler.getRecentErrors(10);

// Get error statistics
const stats = errorHandler.getErrorStats();

// Clear error log
errorHandler.clearErrors();
```

### Security Validation
```typescript
import { 
  validateTagName, 
  validateAttributeName, 
  validateTSSProperty,
  setTestMode,
  isTestMode 
} from './security.js';

// Enable test mode for development
setTestMode(true);

// Validate tag name
const tagResult = validateTagName('Button');
if (!tagResult.isValid) {
  console.error(tagResult.error);
}

// Validate attribute
const attrResult = validateAttributeName('Button', 'onClick');
if (!attrResult.isValid) {
  console.error(attrResult.error);
}

// Validate TSS property
const propResult = validateTSSProperty('text-color');
if (!propResult.isValid) {
  console.error(propResult.error);
}

// Check test mode status
if (isTestMode()) {
  console.log('Running in test mode - lenient validation');
}
```

## Security Considerations

### XSS Prevention
- All user input is sanitized before use
- Dangerous protocols are blocked
- HTML entities are properly escaped
- Event handlers are validated

### Injection Prevention
- Attribute values are validated
- Text content is sanitized
- Event handlers are securely registered
- No direct code execution from user input

### Data Validation
- All inputs are type-checked
- Format validation for all data types
- Range validation for numeric values
- Pattern validation for strings

### Error Security
- Error messages don't leak sensitive information
- Stack traces are sanitized
- Error logging is secure
- No information disclosure through errors

## Conclusion

The TXML/TSS renderer implements comprehensive security measures to prevent XSS attacks, injection vulnerabilities, and other security issues. The system provides graceful error handling with meaningful messages while maintaining security through strict validation and sanitization.

All user inputs are validated, sanitized, and checked against whitelists before being processed. The error handling system ensures that individual failures don't compromise the entire application, while providing developers with the information needed to debug and fix issues.
