// JSX Demo with build-time compilation
import { jsx, jsxs, Fragment, TXMLTSSRenderer, DefaultConsoleLogger } from '../dist/index.js';
import { setTestMode } from '../dist/index.js';

// Enable test mode for build-time demo
setTestMode(true);

// TSS Styles (correct TSS syntax with scope, variables, and proper property names)
const tssStyles = `
scope {
  red: 0xCC0000FF;
  green: 0x00CC00FF;
  blue: 0x0000CCFF;
  white: 0xFFFFFFFF;
  black: 0x000000FF;
  primary: 0x4CAF50FF;
  secondary: 0x2196F3FF;
  accent: 0xFF9800FF;
  
  Window {
    text-color: white;
  }
  
  Button {
    button-color: primary;
    text-color: white;
  }
  
  #greenButton {
    button-color: green;
    text-color: black;
  }
  
  Text {
    text-color: white;
  }
  
  Checkbox {
    text-color: accent;
  }
  
  InputText {
    widget-background-color: 0x3D3D3DFF;
    text-color: white;
  }
  
  SliderFloat {
    widget-background-color: 0x3D3D3DFF;
    text-color: white;
  }
}
`;

// Convert JSX element to TXML string
function jsxToTXML(element) {
  if (!element) return '';
  
  if (typeof element === 'string' || typeof element === 'number') {
    return String(element);
  }
  
  if (Array.isArray(element)) {
    return element.map(jsxToTXML).join('');
  }
  
  // Handle TXMLElement objects (from jsx function)
  if (element.tag) {
    const { tag, attributes, children } = element;
    
    let attributesStr = '';
    if (attributes && Object.keys(attributes).length > 0) {
      const attrPairs = Object.entries(attributes)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `${key}="${value}"`);
      attributesStr = ' ' + attrPairs.join(' ');
    }
    
    const childrenStr = children ? jsxToTXML(children) : '';
    
    if (childrenStr) {
      return `<${tag}${attributesStr}>${childrenStr}</${tag}>`;
    } else {
      return `<${tag}${attributesStr} />`;
    }
  }
  
  // Fallback for unknown element types
  console.warn('Unknown element type:', element);
  return '';
}

// Create the JSX component directly here instead of importing
function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [enabled, setEnabled] = useState(false);

  return jsx('App', null, [
    jsx('Body', null, [
      jsx('Window', { title: "Build-time JSX Demo" }, [
        jsx('Text', null, "Welcome to Build-time JSX ImGui!"),
        jsx('Text', null, `Count: ${count}`),
        jsx('Button', { onClick: () => setCount(count + 1) }, `Clicked ${count} times`),
        jsx('SameLine', null),
        jsx('Button', { id: "greenButton", onClick: () => console.log('Green button clicked from build-time!') }, "Green Button"),
        jsx('SameLine', null),
        jsx('Checkbox', { label: "Enable Feature", checked: enabled, onChange: setEnabled }),
        jsx('InputText', { label: "Name", hint: "Enter your name", value: name, onChange: setName }),
        jsx('SliderFloat', { label: "Volume", min: 0, max: 1, value: volume, onChange: setVolume })
      ])
    ])
  ]);
}

// Simple useState shim
let _state = {};
let _idCounter = 0;

function useState(initialValue) {
  const id = `state_${_idCounter++}`;
  
  if (_state[id] === undefined) {
    _state[id] = typeof initialValue === 'function' ? initialValue() : initialValue;
  }
  
  const setter = (newValue) => {
    _state[id] = typeof newValue === 'function' ? newValue(_state[id]) : newValue;
  };
  
  return [_state[id], setter];
}

// Initialize the demo
async function initJSXDemo() {
  try {
    console.log('Initializing build-time JSX demo...');
    
    // Create renderer
    const logger = new DefaultConsoleLogger();
    const renderer = new TXMLTSSRenderer(logger);
    
    // Register event handlers
    renderer.registerEventHandler('incrementCount', () => {
      console.log('Count incremented via build-time JSX!');
    });
    
    renderer.registerEventHandler('greenClick', () => {
      console.log('Green button clicked! Build-time JSX working!');
    });
    
    // Convert JSX to TXML
    console.log('Creating JSX element...');
    const jsxElement = App();
    console.log('JSX element created:', jsxElement);
    console.log('JSX element type:', typeof jsxElement);
    console.log('JSX element keys:', Object.keys(jsxElement));
    console.log('JSX element.type:', jsxElement.type);
    console.log('JSX element.props:', jsxElement.props);
    console.log('jsx function:', jsx);
    console.log('jsx function type:', typeof jsx);
    
    console.log('Converting JSX to TXML...');
    const txml = jsxToTXML(jsxElement);
    console.log('TXML conversion completed');
    
    console.log('Generated TXML from build-time JSX:', txml);
    console.log('TSS Styles:', tssStyles);
    
    // Render the TXML with TSS
    console.log('Rendering TXML with TSS...');
    renderer.render(txml, tssStyles);
    console.log('TXML rendering completed');
    
    console.log('Build-time JSX demo initialized successfully!');
    
    return { txml, tssStyles };
    
  } catch (error) {
    console.error('Failed to initialize build-time JSX demo:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

// Export for build system
export { initJSXDemo, tssStyles };
