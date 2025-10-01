/**
 * Comprehensive error handling for TXML/TSS renderer
 */

import { SecurityError } from './security.js';

export interface ErrorContext {
  component?: string;
  operation?: string;
  input?: any;
  line?: number;
  column?: number;
  stack?: string;
}

export class RendererError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: ErrorContext,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'RendererError';
  }
}

export class ValidationError extends RendererError {
  constructor(message: string, context?: ErrorContext, originalError?: Error) {
    super(message, 'VALIDATION_ERROR', context, originalError);
    this.name = 'ValidationError';
  }
}

export class SecurityValidationError extends RendererError {
  constructor(message: string, context?: ErrorContext, originalError?: Error) {
    super(message, 'SECURITY_VALIDATION_ERROR', context, originalError);
    this.name = 'SecurityValidationError';
  }
}

export class ParsingError extends RendererError {
  constructor(message: string, context?: ErrorContext, originalError?: Error) {
    super(message, 'PARSING_ERROR', context, originalError);
    this.name = 'ParsingError';
  }
}

export class RenderingError extends RendererError {
  constructor(message: string, context?: ErrorContext, originalError?: Error) {
    super(message, 'RENDERING_ERROR', context, originalError);
    this.name = 'RenderingError';
  }
}

/**
 * Error handler that provides graceful failure and meaningful error messages
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: RendererError[] = [];
  private maxErrorLogSize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and log errors with context
   */
  handleError(
    error: Error, 
    context?: ErrorContext, 
    fallback?: () => void
  ): void {
    const rendererError = this.wrapError(error, context);
    this.logError(rendererError);
    
    if (fallback) {
      try {
        fallback();
      } catch (fallbackError) {
        console.error('Fallback function also failed:', fallbackError);
      }
    }
  }

  /**
   * Wrap any error in a RendererError with context
   */
  wrapError(error: Error, context?: ErrorContext): RendererError {
    if (error instanceof SecurityError) {
      return new SecurityValidationError(
        `Security validation failed: ${error.message}`,
        { ...context, ...error.context },
        error
      );
    }

    if (error instanceof RendererError) {
      return error;
    }

    return new RendererError(
      error.message,
      'UNKNOWN_ERROR',
      context,
      error
    );
  }

  /**
   * Log error to internal log
   */
  private logError(error: RendererError): void {
    this.errorLog.push(error);
    
    // Keep only the most recent errors
    if (this.errorLog.length > this.maxErrorLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxErrorLogSize);
    }

    // Log to console with appropriate level
    if (error instanceof SecurityValidationError) {
      console.error(`🚨 Security Error [${error.code}]:`, error.message, error.context);
    } else if (error instanceof ValidationError) {
      console.warn(`⚠️ Validation Error [${error.code}]:`, error.message, error.context);
    } else {
      console.error(`❌ Renderer Error [${error.code}]:`, error.message, error.context);
    }
  }

  /**
   * Get recent errors
   */
  getRecentErrors(count: number = 10): RendererError[] {
    return this.errorLog.slice(-count);
  }

  /**
   * Clear error log
   */
  clearErrors(): void {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): { total: number; byType: Record<string, number> } {
    const byType: Record<string, number> = {};
    
    for (const error of this.errorLog) {
      byType[error.constructor.name] = (byType[error.constructor.name] || 0) + 1;
    }

    return {
      total: this.errorLog.length,
      byType
    };
  }

  /**
   * Safe execution wrapper that catches and handles errors
   */
  safeExecute<T>(
    operation: () => T,
    context?: ErrorContext,
    fallback?: () => T
  ): T | undefined {
    try {
      return operation();
    } catch (error) {
      this.handleError(error as Error, context);
      
      if (fallback) {
        try {
          return fallback();
        } catch (fallbackError) {
          console.error('Fallback operation failed:', fallbackError);
        }
      }
      
      return undefined;
    }
  }

  /**
   * Safe async execution wrapper
   */
  async safeExecuteAsync<T>(
    operation: () => Promise<T>,
    context?: ErrorContext,
    fallback?: () => Promise<T>
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error as Error, context);
      
      if (fallback) {
        try {
          return await fallback();
        } catch (fallbackError) {
          console.error('Fallback operation failed:', fallbackError);
        }
      }
      
      return undefined;
    }
  }
}

/**
 * Global error handler instance
 */
export const errorHandler = ErrorHandler.getInstance();

/**
 * Utility function for safe parsing with error handling
 */
export function safeParse<T>(
  parser: () => T,
  context?: ErrorContext,
  fallback?: () => T
): T | undefined {
  return errorHandler.safeExecute(parser, context, fallback);
}

/**
 * Utility function for safe rendering with error handling
 */
export function safeRender<T>(
  renderer: () => T,
  context?: ErrorContext,
  fallback?: () => T
): T | undefined {
  return errorHandler.safeExecute(renderer, context, fallback);
}
