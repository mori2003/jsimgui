/**
 * State management for immediate-mode UI with stable IDs
 */

import { WidgetState, RenderContext, TXMLElement } from './types.js';

export class StateManager {
  private state = new Map<string, WidgetState>();
  private frameNumber = 0;

  createContext(stylesheet: any, eventHandlers: Map<string, any>): RenderContext {
    return {
      state: this.state,
      eventHandlers,
      stylesheet,
      frameNumber: this.frameNumber,
      currentPath: []
    };
  }

  beginFrame(): void {
    this.frameNumber++;
  }

  endFrame(): void {
    // Clean up old state entries that haven't been used in the last few frames
    const cutoffFrame = this.frameNumber - 10;
    for (const [id, widgetState] of this.state.entries()) {
      if (widgetState.lastFrame < cutoffFrame) {
        this.state.delete(id);
      }
    }
  }

  generateStableId(element: TXMLElement, context: RenderContext): string {
    // Use explicit id attribute if provided
    if (element.attributes.id) {
      return element.attributes.id;
    }

    // Generate stable ID based on XML path
    const path = [...context.currentPath, element.tag];
    
    // Add index for elements with same tag at same level
    const parentPath = context.currentPath.join('/');
    const siblings = this.getSiblingsAtPath(parentPath, element.tag);
    const index = siblings.indexOf(element);
    
    if (index > 0) {
      path.push(index.toString());
    }

    return path.join('/');
  }

  getWidgetState(id: string, defaultValue: any): WidgetState {
    if (!this.state.has(id)) {
      this.state.set(id, {
        id,
        value: defaultValue,
        lastFrame: this.frameNumber
      });
    }

    const state = this.state.get(id)!;
    state.lastFrame = this.frameNumber;
    return state;
  }

  setWidgetState(id: string, value: any): void {
    const state = this.getWidgetState(id, value);
    state.value = value;
    state.lastFrame = this.frameNumber;
  }

  private getSiblingsAtPath(_parentPath: string, _tag: string): TXMLElement[] {
    // This is a simplified implementation
    // In a real implementation, you'd traverse the XML tree to find siblings
    return [];
  }
}

export function createStateManager(): StateManager {
  return new StateManager();
}
