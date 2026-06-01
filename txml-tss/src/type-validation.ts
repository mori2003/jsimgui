// Runtime type validation utilities

export class TypeValidationError extends Error {
  constructor(message: string, public expectedType: string, public actualValue: any) {
    super(message);
    this.name = 'TypeValidationError';
  }
}

/**
 * Validates that a value is a non-empty string
 */
export function validateString(value: any, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new TypeValidationError(
      `${fieldName} must be a string, got ${typeof value}`,
      'string',
      value
    );
  }
  
  if (value.trim().length === 0) {
    throw new TypeValidationError(
      `${fieldName} must be a non-empty string`,
      'non-empty string',
      value
    );
  }
  
  return value;
}

/**
 * Validates that a value is a number within a range
 */
export function validateNumber(value: any, fieldName: string, min?: number, max?: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new TypeValidationError(
      `${fieldName} must be a number, got ${typeof value}`,
      'number',
      value
    );
  }
  
  if (min !== undefined && value < min) {
    throw new TypeValidationError(
      `${fieldName} must be >= ${min}, got ${value}`,
      `number >= ${min}`,
      value
    );
  }
  
  if (max !== undefined && value > max) {
    throw new TypeValidationError(
      `${fieldName} must be <= ${max}, got ${value}`,
      `number <= ${max}`,
      value
    );
  }
  
  return value;
}

/**
 * Validates that a value is a boolean
 */
export function validateBoolean(value: any, fieldName: string): boolean {
  if (typeof value !== 'boolean') {
    throw new TypeValidationError(
      `${fieldName} must be a boolean, got ${typeof value}`,
      'boolean',
      value
    );
  }
  
  return value;
}

/**
 * Validates that a value is an object (not null or array)
 */
export function validateObject(value: any, fieldName: string): Record<string, any> {
  if (value === null || value === undefined) {
    throw new TypeValidationError(
      `${fieldName} must be an object, got ${value}`,
      'object',
      value
    );
  }
  
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeValidationError(
      `${fieldName} must be an object, got ${typeof value}`,
      'object',
      value
    );
  }
  
  return value;
}

/**
 * Validates that a value is an array
 */
export function validateArray(value: any, fieldName: string): any[] {
  if (!Array.isArray(value)) {
    throw new TypeValidationError(
      `${fieldName} must be an array, got ${typeof value}`,
      'array',
      value
    );
  }
  
  return value;
}

/**
 * Validates that a value is a function
 */
export function validateFunction(value: any, fieldName: string): Function {
  if (typeof value !== 'function') {
    throw new TypeValidationError(
      `${fieldName} must be a function, got ${typeof value}`,
      'function',
      value
    );
  }
  
  return value;
}

/**
 * Validates that a value is one of the allowed values
 */
export function validateEnum<T>(value: any, fieldName: string, allowedValues: readonly T[]): T {
  if (!allowedValues.includes(value)) {
    throw new TypeValidationError(
      `${fieldName} must be one of [${allowedValues.join(', ')}], got ${value}`,
      `enum(${allowedValues.join(' | ')})`,
      value
    );
  }
  
  return value;
}

/**
 * Validates that a value is not null or undefined
 */
export function validateNotNull<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new TypeValidationError(
      `${fieldName} must not be null or undefined`,
      'non-null',
      value
    );
  }
  
  return value;
}

/**
 * Safe type validation that returns a boolean instead of throwing
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}
