// TXML parser tests

import { describe, it, expect, vi } from 'vitest';
import { parseTXML } from '../xml-parser.js';

describe('TXML Parser', () => {
  it('should parse simple App structure', () => {
    const xml = `
      <App>
        <Head></Head>
        <Body></Body>
      </App>
    `;
    
    const result = parseTXML(xml);
    
    expect(result).not.toBeNull();
    expect(result!.tag).toBe('App');
    expect(result!.children).toHaveLength(2);
    expect(result!.children[0]).toMatchObject({ tag: 'Head' });
    expect(result!.children[1]).toMatchObject({ tag: 'Body' });
  });

  it('should parse attributes', () => {
    const xml = `
      <App>
        <Window title="Test Window" id="main-window">
          <Text>Hello World</Text>
        </Window>
      </App>
    `;
    
    const result = parseTXML(xml);
    expect(result).not.toBeNull();
    const window = result!.children[0] as any;
    
    expect(window.attributes.title).toBe('Test Window');
    expect(window.attributes.id).toBe('main-window');
  });

  it('should parse text content', () => {
    const xml = `
      <App>
        <Text>Hello, World!</Text>
      </App>
    `;
    
    const result = parseTXML(xml);
    expect(result).not.toBeNull();
    const text = result!.children[0] as any;
    
    expect(text.children[0]).toBe('Hello, World!');
  });

  it('should handle self-closing tags', () => {
    const xml = `
      <App>
        <Spacing />
        <Separator />
      </App>
    `;
    
    const result = parseTXML(xml);
    
    expect(result).not.toBeNull();
    expect(result!.children).toHaveLength(2);
    expect(result!.children[0]).toMatchObject({ tag: 'Spacing', children: [] });
    expect(result!.children[1]).toMatchObject({ tag: 'Separator', children: [] });
  });

  it('should warn on unknown tags', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const xml = `
      <App>
        <UnknownTag>Content</UnknownTag>
      </App>
    `;
    
    parseTXML(xml);
    
    expect(consoleSpy).toHaveBeenCalledWith('Unknown tag: UnknownTag');
    
    consoleSpy.mockRestore();
  });

  it('should handle non-App root gracefully', () => {
    const xml = `
      <Window>
        <Text>Content</Text>
      </Window>
    `;
    
    const result = parseTXML(xml);
    expect(result).not.toBeNull();
    expect(result?.tag).toBe('App'); // Should return fallback App element
  });

  it('should handle malformed XML gracefully', () => {
    const xml = `
      <App>
        <Window>
          <Text>Unclosed tag
        </Window>
      </App>
    `;
    
    const result = parseTXML(xml);
    expect(result).not.toBeNull();
    expect(result?.tag).toBe('App'); // Should return fallback App element
  });

  it('should handle complex nested structure', () => {
    const xml = `
      <App>
        <Head></Head>
        <Body>
          <Window title="Main Window">
            <Text>Welcome</Text>
            <Button onClick="handleClick">Click Me</Button>
            <SameLine />
            <Checkbox label="Enable" />
          </Window>
        </Body>
      </App>
    `;
    
    const result = parseTXML(xml);
    expect(result).not.toBeNull();
    const body = result!.children[1] as any;
    const window = body.children[0] as any;
    
    expect(window.tag).toBe('Window');
    expect(window.attributes.title).toBe('Main Window');
    expect(window.children).toHaveLength(4);
    
    const button = window.children[1] as any;
    expect(button.tag).toBe('Button');
    expect(button.attributes.onClick).toBe('handleClick');
    expect(button.children[0]).toBe('Click Me');
  });
});
