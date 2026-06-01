/**
 * Widget renderers for TXML elements to TXML elements to ImGui calls
 */

import { ImVec4 } from '@mori2003/jsimgui';
import { TXMLElement, RenderContext, WidgetRenderer, ComputedStyle, Logger } from './types.js';

export interface ImGuiInstance {
  Begin: (name: string, p_open?: boolean[], flags?: number) => boolean;
  End: () => void;
  Text: (text: string) => void;
  Button: (label: string) => boolean;
  InputText: (label: string, buf: string[], buf_size: number) => boolean;
  SliderFloat: (label: string, v: number[], v_min: number, v_max: number) => boolean;
  Checkbox: (label: string, v: boolean[]) => boolean;
  SameLine: (offset_from_start_x?: number, spacing?: number) => void;
  Spacing: () => void;
  Separator: () => void;
  SetNextWindowSize: (size: [number, number], cond?: number) => void;
  SetNextItemWidth: (item_width: number) => void;
  TextColored: (col: [number, number, number, number], text: string) => void;
  InputTextWithHint: (label: string, hint: string, buf: string[], buf_size: number) => boolean;
  CreateContext: () => void;
  StyleColorsDark: () => void;
  PushStyleColor?: (col: number, r: number, g: number, b: number, a: number) => void;
  PopStyleColor?: (count: number) => void;
  Col?: {
    Button: number;
    Text: number;
    ButtonText: number;
  };
  ImVec4?: new (x: number, y: number, z: number, w: number) => ImVec4;
}

export class WidgetRenderers {
  private renderers = new Map<string, WidgetRenderer>();
  private logger: Logger | null;
  private imgui: ImGuiInstance | null = null;
  private styleEngine: any = null;

  constructor(logger?: Logger) {
    this.logger = logger ?? null;
    this.setupRenderers();
  }

  setImGui(imgui: ImGuiInstance): void {
    // Runtime type validation
    if (typeof imgui !== 'object' || imgui === null) {
      throw new Error(`setImGui: imgui must be an object, got ${typeof imgui}`);
    }
    
    this.imgui = imgui;
  }

  setStyleEngine(styleEngine: any): void {
    this.styleEngine = styleEngine;
  }

  private setupRenderers(): void {
    this.renderers.set('App', this.renderApp.bind(this));
    this.renderers.set('Head', this.renderHead.bind(this));
    this.renderers.set('Body', this.renderBody.bind(this));
    this.renderers.set('Window', this.renderWindow.bind(this));
    this.renderers.set('Text', this.renderText.bind(this));
    this.renderers.set('Button', this.renderButton.bind(this));
    this.renderers.set('InputText', this.renderInputText.bind(this));
    this.renderers.set('SliderFloat', this.renderSliderFloat.bind(this));
    this.renderers.set('Checkbox', this.renderCheckbox.bind(this));
    this.renderers.set('SameLine', this.renderSameLine.bind(this));
    this.renderers.set('Spacing', this.renderSpacing.bind(this));
    this.renderers.set('Separator', this.renderSeparator.bind(this));
  }

  render(element: TXMLElement, context: RenderContext, computedStyle?: ComputedStyle, styleEngine?: any): void {
    // Runtime type validation
    if (typeof element !== 'object' || element === null || Array.isArray(element)) {
      throw new Error(`render: element must be a TXMLElement object, got ${typeof element}`);
    }
    
    if (!element.tag || typeof element.tag !== 'string') {
      throw new Error(`render: element.tag must be a string, got ${typeof element.tag}`);
    }
    
    if (typeof context !== 'object' || context === null) {
      throw new Error(`render: context must be a RenderContext object, got ${typeof context}`);
    }
    
    console.log(`WidgetRenderers.render called for: ${element.tag}`);
    const renderer = this.renderers.get(element.tag);
    if (renderer) {
      try {
        console.log(`Calling renderer for: ${element.tag}`);
        renderer(element, context, computedStyle, styleEngine);
        console.log(`Renderer completed for: ${element.tag}`);
      } catch (error) {
        console.error(`Render error for element: ${element.tag}`, error);
        console.error(`Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
        // Continue rendering other elements even if one fails
      }
    } else {
      console.warn(`No renderer for tag: ${element.tag}`);
    }
  }

  private renderApp(element: TXMLElement, context: RenderContext, _computedStyle?: ComputedStyle, styleEngine?: any): void {
    // App is the root container, render children
    this.renderChildren(element, context, styleEngine);
  }

  private renderHead(_element: TXMLElement, _context: RenderContext, _computedStyle?: ComputedStyle, _styleEngine?: any): void {
    // Head contains metadata, skip rendering for now
  }

  private renderBody(element: TXMLElement, context: RenderContext, _computedStyle?: ComputedStyle, styleEngine?: any): void {
    // Body is the main content area, render children
    this.renderChildren(element, context, styleEngine);
  }

  private renderWindow(element: TXMLElement, context: RenderContext, _computedStyle?: ComputedStyle, styleEngine?: any): void {
    if (!this.imgui) return;
    const title = element.attributes.title || 'Window';
    const style = this.getComputedStyle(element, context, styleEngine);
    
    // Apply window styling if needed
    if (style.width && style.width.type === 'number') {
      this.logger?.logImGui(`ImGui.SetNextWindowSize([${style.width.value}, ${style.height?.value || 200}], ImGui.Cond.Once);`);
      this.imgui.SetNextWindowSize([style.width.value, style.height?.value || 200], 1); // 1 = ImGui.Cond.Once
    }

    // Apply window text color styling
    if (style['text-color'] && style['text-color'].type === 'color') {
      const colorValue = style['text-color'].value;
      
      // Convert RRGGBBAA to RGBA values
      const r = (colorValue >> 24) & 0xff;
      const g = (colorValue >> 16) & 0xff;
      const b = (colorValue >> 8) & 0xff;
      const a = colorValue & 0xff;

      // Michael's RGBA helper function for text color
      const RGBA = (r: number, g: number, b: number, a: number = 255) => {
        return ((r & 255) | ((g & 255) << 8) | ((b & 255) << 16) | ((a & 255) << 24)) >>> 0;
      };
      
      try {
        const textColor = RGBA(r, g, b, a);
        (this.imgui as any).PushStyleColor((this.imgui.Col as any)['Text'], textColor);
        (this as any).windowColorsPushed = 1;
      } catch (error) {
        console.error('Window text color styling failed:', error);
        (this as any).windowColorsPushed = 0;
      }
    }
    
    this.logger?.logImGui(`ImGui.Begin(${JSON.stringify(title)});`);
    const opened = this.imgui.Begin(title);
    if (opened) {
      try {
        this.renderChildren(element, context, styleEngine);
      } catch (error) {
        console.error('Error rendering window children:', error);
      }
    }
    
    // Pop the text color if we pushed it
    if ((this as any).windowColorsPushed > 0) {
      (this.imgui as any).PopStyleColor((this as any).windowColorsPushed);
      (this as any).windowColorsPushed = 0;
    }
    
    // Always call End() to match Begin(), even if there was an error
    this.logger?.logImGui('ImGui.End();');
    this.imgui.End();
  }

  private renderText(element: TXMLElement, context: RenderContext, computedStyle?: ComputedStyle, styleEngine?: any): void {
    if (!this.imgui) return;
    const text = this.getTextContent(element);
    const style = computedStyle || this.getComputedStyle(element, context, styleEngine);
    
    // Debug logging
    console.log('renderText:', { 
      text, 
      style, 
      hasTextColor: !!style['text-color'],
      textColorValue: style['text-color']?.value,
      textColorType: style['text-color']?.type
    });
    
    // Apply text color styling using TextColored (proven to work)
    if (style['text-color'] && style['text-color'].type === 'color') {
      const colorValue = style['text-color'].value;
      console.log('Applying text color:', { colorValue });
      
      // Convert RRGGBBAA to RGBA values
      const r = (colorValue >> 24) & 0xff;
      const g = (colorValue >> 16) & 0xff;
      const b = (colorValue >> 8) & 0xff;
      const a = colorValue & 0xff;
      
      // Convert to 0.0-1.0 range for ImGui.TextColored
      const rNorm = r / 255.0;
      const gNorm = g / 255.0;
      const bNorm = b / 255.0;
      const aNorm = a / 255.0;
      
      console.log('Text color converted:', { r, g, b, a, rNorm, gNorm, bNorm, aNorm });
      
      this.logger?.logImGui(`ImGui.TextColored([${rNorm}, ${gNorm}, ${bNorm}, ${aNorm}], ${JSON.stringify(text)});`);
      this.imgui.TextColored([rNorm, gNorm, bNorm, aNorm], text);
    } else {
      console.log('No text color found, using default');
      this.logger?.logImGui(`ImGui.Text(${JSON.stringify(text)});`);
      this.imgui.Text(text);
    }
  }

  private renderButton(element: TXMLElement, context: RenderContext, computedStyle?: ComputedStyle, styleEngine?: any): void {
    if (!this.imgui) return;
    const text = this.getTextContent(element);
    const style = computedStyle || this.getComputedStyle(element, context, styleEngine);

    // Apply button styling
    if (style.width && style.width.type === 'number') {
      this.logger?.logImGui(`ImGui.SetNextItemWidth(${style.width.value});`);
      this.imgui.SetNextItemWidth(style.width.value);
    }

    // Apply button color styling using Michael's working RGBA approach
    if (style['button-color'] && style['button-color'].type === 'color') {
      const colorValue = style['button-color'].value;
      
      // Convert RRGGBBAA to RGBA values
      const r = (colorValue >> 24) & 0xff;
      const g = (colorValue >> 16) & 0xff;
      const b = (colorValue >> 8) & 0xff;
      const a = colorValue & 0xff;

      // Michael's RGBA helper function (proven to work)
      const RGBA = (r: number, g: number, b: number, a: number = 255) => {
        return ((r & 255) | ((g & 255) << 8) | ((b & 255) << 16) | ((a & 255) << 24)) >>> 0;
      };
      
      try {
        // Main button color
        const mainColor = RGBA(r, g, b, a);
        (this.imgui as any).PushStyleColor(this.imgui.Col!.Button, mainColor);
        
        // Hover state (lighter)
        const hoverR = Math.min(255, r + 40);
        const hoverG = Math.min(255, g + 40);
        const hoverB = Math.min(255, b + 40);
        const hoverColor = RGBA(hoverR, hoverG, hoverB, a);
        (this.imgui as any).PushStyleColor((this.imgui.Col as any)['ButtonHovered'], hoverColor);
        
        // Active state (darker)
        const activeR = Math.max(0, r - 50);
        const activeG = Math.max(0, g - 50);
        const activeB = Math.max(0, b - 50);
        const activeColor = RGBA(activeR, activeG, activeB, a);
        (this.imgui as any).PushStyleColor((this.imgui.Col as any)['ButtonActive'], activeColor);
        
        // Store the number of colors pushed for cleanup
        (this as any).colorsPushed = 3;
      } catch (error) {
        console.error('Button color styling failed:', error);
        (this as any).colorsPushed = 0;
      }
    }

    // Apply button text color styling
    if (style['text-color'] && style['text-color'].type === 'color') {
      const colorValue = style['text-color'].value;
      
      // Convert RRGGBBAA to RGBA values
      const r = (colorValue >> 24) & 0xff;
      const g = (colorValue >> 16) & 0xff;
      const b = (colorValue >> 8) & 0xff;
      const a = colorValue & 0xff;

      // Michael's RGBA helper function for text color
      const RGBA = (r: number, g: number, b: number, a: number = 255) => {
        return ((r & 255) | ((g & 255) << 8) | ((b & 255) << 16) | ((a & 255) << 24)) >>> 0;
      };
      
      try {
        const textColor = RGBA(r, g, b, a);
        // Use ImGui.Col.Text instead of ImGui.Col.ButtonText (ButtonText doesn't work in jsimgui)
        (this.imgui as any).PushStyleColor(this.imgui.Col!.Text, textColor);
        
        // Update the count of colors pushed
        (this as any).colorsPushed = ((this as any).colorsPushed || 0) + 1;
      } catch (error) {
        console.error('Button text color styling failed:', error);
      }
    }

    this.logger?.logImGui(`ImGui.Button(${JSON.stringify(text)});`);
    const clicked = this.imgui.Button(text);

    // Pop the colors if we pushed them
    if ((this as any).colorsPushed > 0) {
      (this.imgui as any).PopStyleColor((this as any).colorsPushed);
      (this as any).colorsPushed = 0;
    }

    if (clicked && element.attributes.onClick) {
      this.handleEvent(element.attributes.onClick, context);
    }
  }

  private renderInputText(element: TXMLElement, context: RenderContext, _computedStyle?: ComputedStyle, styleEngine?: any): void {
    if (!this.imgui) return;
    const id = this.generateId(element, context);
    const state = context.state.get(id) || { id, value: '', lastFrame: context.frameNumber };
    
    const label = element.attributes.label || '';
    const hint = element.attributes.hint || '';
    const style = this.getComputedStyle(element, context, styleEngine);
    
    // Apply input styling
    if (style.width && style.width.type === 'number') {
      this.logger?.logImGui(`ImGui.SetNextItemWidth(${style.width.value});`);
      this.imgui.SetNextItemWidth(style.width.value);
    }

    // Apply widget background color styling
    if (style['widget-background-color'] && style['widget-background-color'].type === 'color') {
      const colorValue = style['widget-background-color'].value;
      
      // Convert RRGGBBAA to RGBA values
      const r = (colorValue >> 24) & 0xff;
      const g = (colorValue >> 16) & 0xff;
      const b = (colorValue >> 8) & 0xff;
      const a = colorValue & 0xff;

      // Michael's RGBA helper function for background color
      const RGBA = (r: number, g: number, b: number, a: number = 255) => {
        return ((r & 255) | ((g & 255) << 8) | ((b & 255) << 16) | ((a & 255) << 24)) >>> 0;
      };
      
      try {
        const bgColor = RGBA(r, g, b, a);
        (this.imgui as any).PushStyleColor((this.imgui.Col as any)['FrameBg'], bgColor);
        (this as any).inputColorsPushed = 1;
      } catch (error) {
        console.error('InputText background color styling failed:', error);
        (this as any).inputColorsPushed = 0;
      }
    }
    
    let value = state.value || '';
    const valueArray = [value];
    this.logger?.logImGui(`ImGui.InputTextWithHint(${JSON.stringify(label)}, ${JSON.stringify(hint)}, /* value */ , 256);`);
    const changed = this.imgui.InputTextWithHint(label, hint, valueArray, 256);
    
    if (changed) {
      state.value = valueArray[0];
      state.lastFrame = context.frameNumber;
      context.state.set(id, state);
    }

    // Pop the background color if we pushed it
    if ((this as any).inputColorsPushed > 0) {
      (this.imgui as any).PopStyleColor((this as any).inputColorsPushed);
      (this as any).inputColorsPushed = 0;
    }
  }

  private renderSliderFloat(element: TXMLElement, context: RenderContext, _computedStyle?: ComputedStyle, styleEngine?: any): void {
    if (!this.imgui) return;
    const id = this.generateId(element, context);
    const state = context.state.get(id) || { id, value: 0.5, lastFrame: context.frameNumber };
    
    const label = element.attributes.label || '';
    const min = parseFloat(element.attributes.min || '0');
    const max = parseFloat(element.attributes.max || '1');
    const style = this.getComputedStyle(element, context, styleEngine);
    
    // Apply slider styling
    if (style.width && style.width.type === 'number') {
      this.logger?.logImGui(`ImGui.SetNextItemWidth(${style.width.value});`);
      this.imgui.SetNextItemWidth(style.width.value);
    }

    // Apply widget background color styling
    if (style['widget-background-color'] && style['widget-background-color'].type === 'color') {
      const colorValue = style['widget-background-color'].value;
      
      // Convert RRGGBBAA to RGBA values
      const r = (colorValue >> 24) & 0xff;
      const g = (colorValue >> 16) & 0xff;
      const b = (colorValue >> 8) & 0xff;
      const a = colorValue & 0xff;

      // Michael's RGBA helper function for background color
      const RGBA = (r: number, g: number, b: number, a: number = 255) => {
        return ((r & 255) | ((g & 255) << 8) | ((b & 255) << 16) | ((a & 255) << 24)) >>> 0;
      };
      
      try {
        const bgColor = RGBA(r, g, b, a);
        (this.imgui as any).PushStyleColor((this.imgui.Col as any)['FrameBg'], bgColor);
        (this as any).sliderColorsPushed = 1;
      } catch (error) {
        console.error('SliderFloat background color styling failed:', error);
        (this as any).sliderColorsPushed = 0;
      }
    }
    
    const valueRef = [typeof state.value === 'number' ? state.value : 0.5];
    this.logger?.logImGui(`ImGui.SliderFloat(${JSON.stringify(label)}, ${valueRef[0]}, ${min}, ${max});`);
    const changed = this.imgui.SliderFloat(label, valueRef, min, max);
    
    if (changed) {
      state.value = valueRef[0];
      state.lastFrame = context.frameNumber;
      context.state.set(id, state);
    }

    // Pop the background color if we pushed it
    if ((this as any).sliderColorsPushed > 0) {
      (this.imgui as any).PopStyleColor((this as any).sliderColorsPushed);
      (this as any).sliderColorsPushed = 0;
    }
  }

  private renderCheckbox(element: TXMLElement, context: RenderContext, computedStyle?: ComputedStyle, styleEngine?: any): void {
    if (!this.imgui) return;
    const id = this.generateId(element, context);
    const state = context.state.get(id) || { id, value: false, lastFrame: context.frameNumber };
    
    const label = element.attributes.label || '';
    const style = computedStyle || this.getComputedStyle(element, context, styleEngine);
    
    // Apply checkbox text color styling
    if (style['text-color'] && style['text-color'].type === 'color') {
      const colorValue = style['text-color'].value;
      
      // Convert RRGGBBAA to RGBA values
      const r = (colorValue >> 24) & 0xff;
      const g = (colorValue >> 16) & 0xff;
      const b = (colorValue >> 8) & 0xff;
      const a = colorValue & 0xff;

      // Michael's RGBA helper function for text color
      const RGBA = (r: number, g: number, b: number, a: number = 255) => {
        return ((r & 255) | ((g & 255) << 8) | ((b & 255) << 16) | ((a & 255) << 24)) >>> 0;
      };
      
      try {
        const textColor = RGBA(r, g, b, a);
        // Use ImGui.Col.Text for checkbox text color (same as button text)
        (this.imgui as any).PushStyleColor(this.imgui.Col!.Text, textColor);
        (this as any).checkboxColorsPushed = 1;
      } catch (error) {
        console.error('Checkbox text color styling failed:', error);
        (this as any).checkboxColorsPushed = 0;
      }
    }
    
    const checkedRef = [Boolean(state.value)];
    this.logger?.logImGui(`ImGui.Checkbox(${JSON.stringify(label)}, ${checkedRef[0]});`);
    const changed = this.imgui.Checkbox(label, checkedRef);
    
    // Pop the text color if we pushed it
    if ((this as any).checkboxColorsPushed > 0) {
      (this.imgui as any).PopStyleColor((this as any).checkboxColorsPushed);
      (this as any).checkboxColorsPushed = 0;
    }
    
    if (changed) {
      state.value = checkedRef[0];
      state.lastFrame = context.frameNumber;
      context.state.set(id, state);
    }
  }

  private renderSameLine(element: TXMLElement, _context: RenderContext): void {
    if (!this.imgui) return;
    const offset = parseFloat(element.attributes.offset || '0');
    const spacing = parseFloat(element.attributes.spacing || '-1');
    this.logger?.logImGui(`ImGui.SameLine(${offset}, ${spacing});`);
    this.imgui.SameLine(offset, spacing);
  }

  private renderSpacing(_element: TXMLElement, _context: RenderContext): void {
    if (!this.imgui) return;
    this.logger?.logImGui('ImGui.Spacing();');
    this.imgui.Spacing();
  }

  private renderSeparator(_element: TXMLElement, _context: RenderContext): void {
    if (!this.imgui) return;
    this.logger?.logImGui('ImGui.Separator();');
    this.imgui.Separator();
  }

  private renderChildren(element: TXMLElement, context: RenderContext, styleEngine?: any): void {
    const oldPath = [...context.currentPath];
    context.currentPath.push(element.tag);
    
    for (const child of element.children) {
      try {
        if (typeof child === 'string') {
          // Text content - render as text
          if (child.trim() && this.imgui) {
            this.imgui.Text(child.trim());
          }
        } else {
          // Element - render recursively with computed styles
          let computedStyle;
          try {
            computedStyle = styleEngine?.computeStyle(child, context.currentPath) || {};
          } catch (e) {
            console.error('Style compute error for child element:', child.tag, e);
            computedStyle = {};
          }
          
          // Add error boundary around individual child rendering
          try {
            this.render(child, context, computedStyle, styleEngine);
          } catch (renderError) {
            const errorMessage = renderError instanceof Error ? renderError.message : String(renderError);
            console.error(`Failed to render child element: ${child.tag}`, renderError);
            // Continue rendering other children even if one fails
            this.logger?.logImGui(`// Error: Failed to render ${child.tag} - ${errorMessage}`);
          }
        }
      } catch (childError) {
        const errorMessage = childError instanceof Error ? childError.message : String(childError);
        console.error(`Critical error rendering child:`, childError);
        // Continue with next child - don't let one failure break everything
        this.logger?.logImGui(`// Critical Error: Child rendering failed - ${errorMessage}`);
      }
    }
    
    context.currentPath = oldPath;
  }


  private getTextContent(element: TXMLElement): string {
    return element.children
      .filter(child => typeof child === 'string')
      .join('')
      .trim();
  }

  private getComputedStyle(element: TXMLElement, context: RenderContext, styleEngine?: any): ComputedStyle {
    const engine = styleEngine || this.styleEngine;
    if (!engine) {
      return {};
    }
    
    try {
      return engine.computeStyle(element, context.currentPath) || {};
    } catch (error) {
      console.error('Error computing style for element:', element.tag, error);
      return {};
    }
  }

  private generateId(element: TXMLElement, context: RenderContext): string {
    // Generate stable ID based on element path
    const path = [...context.currentPath, element.tag];
    return path.join('/');
  }

  private handleEvent(eventName: string, context: RenderContext): void {
    const handler = context.eventHandlers.get(eventName);
    if (handler) {
      handler.callback();
    } else {
      console.warn(`No event handler found for: ${eventName}`);
    }
  }

}

export function createWidgetRenderers(): WidgetRenderers {
  return new WidgetRenderers();
}
