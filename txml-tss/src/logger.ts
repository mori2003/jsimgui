import type { Logger } from './types.js';

export class DefaultConsoleLogger implements Logger {
  private buffer: string[] = [];

  startFrame(): void {
    this.buffer.push('// --- start frame ---');
  }

  endFrame(): void {
    this.buffer.push('// --- end frame ---');
  }

  logImGui(callText: string): void {
    this.buffer.push(callText);
  }

  logDom(callText: string): void {
    this.buffer.push(callText);
  }

  flush(): void {
    // eslint-disable-next-line no-console
    console.log(this.buffer.join('\n'));
    this.buffer = [];
  }

  getBuffer(): string[] {
    return [...this.buffer];
  }
}

export class NoopLogger implements Logger {
  startFrame(): void {}
  endFrame(): void {}
  logImGui(_callText: string): void {}
  logDom(_callText: string): void {}
  flush(): void {}
  getBuffer(): string[] { return []; }
}


