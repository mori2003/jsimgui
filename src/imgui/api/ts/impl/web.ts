import { Mod } from "../core.js";
import { ImGui, type ImGuiIO, type ImTextureRef, ImVec2 } from "../imgui.js";
import { ImGuiImplOpenGL3, loadTextureWebGL } from "./webgl.js";
import { ImGuiImplWGPU, loadTextureWebGPU } from "./wgpu.js";

/**
 * Map of browser mouse button values to ImGui mouse button enums.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button}.
 */
const MOUSE_BUTTON_MAP = {
    0: ImGui.MouseButton.Left,
    1: ImGui.MouseButton.Middle,
    2: ImGui.MouseButton.Right,
} as const;

/**
 * Map of ImGui mouse cursor enums to CSS cursor styles.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor}.
 */
const MOUSE_CURSOR_MAP = {
    [ImGui.MouseCursor.None]: "none",
    [ImGui.MouseCursor.Arrow]: "default",
    [ImGui.MouseCursor.TextInput]: "text",
    [ImGui.MouseCursor.Hand]: "pointer",
    [ImGui.MouseCursor.ResizeAll]: "all-scroll",
    [ImGui.MouseCursor.ResizeNS]: "ns-resize",
    [ImGui.MouseCursor.ResizeEW]: "ew-resize",
    [ImGui.MouseCursor.ResizeNESW]: "nesw-resize",
    [ImGui.MouseCursor.ResizeNWSE]: "nwse-resize",
    [ImGui.MouseCursor.NotAllowed]: "not-allowed",
} as const;

/**
 * Map of browser keyboard key values to ImGui key enums.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key}.
 */
const KEYBOARD_MAP = {
    "0": ImGui.Key._0,
    "1": ImGui.Key._1,
    "2": ImGui.Key._2,
    "3": ImGui.Key._3,
    "4": ImGui.Key._4,
    "5": ImGui.Key._5,
    "6": ImGui.Key._6,
    "7": ImGui.Key._7,
    "8": ImGui.Key._8,
    "9": ImGui.Key._9,

    Numpad0: ImGui.Key._Keypad0,
    Numpad1: ImGui.Key._Keypad1,
    Numpad2: ImGui.Key._Keypad2,
    Numpad3: ImGui.Key._Keypad3,
    Numpad4: ImGui.Key._Keypad4,
    Numpad5: ImGui.Key._Keypad5,
    Numpad6: ImGui.Key._Keypad6,
    Numpad7: ImGui.Key._Keypad7,
    Numpad8: ImGui.Key._Keypad8,
    Numpad9: ImGui.Key._Keypad9,
    NumpadDecimal: ImGui.Key._KeypadDecimal,
    NumpadDivide: ImGui.Key._KeypadDivide,
    NumpadMultiply: ImGui.Key._KeypadMultiply,
    NumpadSubtract: ImGui.Key._KeypadSubtract,
    NumpadAdd: ImGui.Key._KeypadAdd,
    NumpadEnter: ImGui.Key._KeypadEnter,
    NumpadEqual: ImGui.Key._KeypadEqual,

    F1: ImGui.Key._F1,
    F2: ImGui.Key._F2,
    F3: ImGui.Key._F3,
    F4: ImGui.Key._F4,
    F5: ImGui.Key._F5,
    F6: ImGui.Key._F6,
    F7: ImGui.Key._F7,
    F8: ImGui.Key._F8,
    F9: ImGui.Key._F9,
    F10: ImGui.Key._F10,
    F11: ImGui.Key._F11,
    F12: ImGui.Key._F12,
    F13: ImGui.Key._F13,
    F14: ImGui.Key._F14,
    F15: ImGui.Key._F15,
    F16: ImGui.Key._F16,
    F17: ImGui.Key._F17,
    F18: ImGui.Key._F18,
    F19: ImGui.Key._F19,
    F20: ImGui.Key._F20,
    F21: ImGui.Key._F21,
    F22: ImGui.Key._F22,
    F23: ImGui.Key._F23,
    F24: ImGui.Key._F24,

    a: ImGui.Key._A,
    b: ImGui.Key._B,
    c: ImGui.Key._C,
    d: ImGui.Key._D,
    e: ImGui.Key._E,
    f: ImGui.Key._F,
    g: ImGui.Key._G,
    h: ImGui.Key._H,
    i: ImGui.Key._I,
    j: ImGui.Key._J,
    k: ImGui.Key._K,
    l: ImGui.Key._L,
    m: ImGui.Key._M,
    n: ImGui.Key._N,
    o: ImGui.Key._O,
    p: ImGui.Key._P,
    q: ImGui.Key._Q,
    r: ImGui.Key._R,
    s: ImGui.Key._S,
    t: ImGui.Key._T,
    u: ImGui.Key._U,
    v: ImGui.Key._V,
    w: ImGui.Key._W,
    x: ImGui.Key._X,
    y: ImGui.Key._Y,
    z: ImGui.Key._Z,
    A: ImGui.Key._A,
    B: ImGui.Key._B,
    C: ImGui.Key._C,
    D: ImGui.Key._D,
    E: ImGui.Key._E,
    F: ImGui.Key._F,
    G: ImGui.Key._G,
    H: ImGui.Key._H,
    I: ImGui.Key._I,
    J: ImGui.Key._J,
    K: ImGui.Key._K,
    L: ImGui.Key._L,
    M: ImGui.Key._M,
    N: ImGui.Key._N,
    O: ImGui.Key._O,
    P: ImGui.Key._P,
    Q: ImGui.Key._Q,
    R: ImGui.Key._R,
    S: ImGui.Key._S,
    T: ImGui.Key._T,
    U: ImGui.Key._U,
    V: ImGui.Key._V,
    W: ImGui.Key._W,
    X: ImGui.Key._X,
    Y: ImGui.Key._Y,
    Z: ImGui.Key._Z,
    "'": ImGui.Key._Apostrophe,
    ",": ImGui.Key._Comma,
    "-": ImGui.Key._Minus,
    ".": ImGui.Key._Period,
    "/": ImGui.Key._Slash,
    ";": ImGui.Key._Semicolon,
    "=": ImGui.Key._Equal,
    "[": ImGui.Key._LeftBracket,
    "\\": ImGui.Key._Backslash,
    "]": ImGui.Key._RightBracket,
    "`": ImGui.Key._GraveAccent,

    CapsLock: ImGui.Key._CapsLock,
    ScrollLock: ImGui.Key._ScrollLock,
    NumLock: ImGui.Key._NumLock,
    PrintScreen: ImGui.Key._PrintScreen,
    Pause: ImGui.Key._Pause,

    Tab: ImGui.Key._Tab,
    ArrowLeft: ImGui.Key._LeftArrow,
    ArrowRight: ImGui.Key._RightArrow,
    ArrowUp: ImGui.Key._UpArrow,
    ArrowDown: ImGui.Key._DownArrow,
    PageUp: ImGui.Key._PageUp,
    PageDown: ImGui.Key._PageDown,
    Home: ImGui.Key._Home,
    End: ImGui.Key._End,
    Insert: ImGui.Key._Insert,
    Delete: ImGui.Key._Delete,
    Backspace: ImGui.Key._Backspace,
    " ": ImGui.Key._Space,
    Enter: ImGui.Key._Enter,
    Escape: ImGui.Key._Escape,

    Control: ImGui.Key._LeftCtrl,
    Shift: ImGui.Key._LeftShift,
    Alt: ImGui.Key._LeftAlt,
    Super: ImGui.Key._LeftSuper,
    Meta: ImGui.Key._LeftSuper,
} as const;

/**
 * Map of browser keyboard modifier key values to ImGui key modifier enums.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key}.
 */
const KEYBOARD_MODIFIER_MAP = {
    Control: ImGui.Key.ImGuiMod_Ctrl,
    Shift: ImGui.Key.ImGuiMod_Shift,
    Alt: ImGui.Key.ImGuiMod_Alt,
    Super: ImGui.Key.ImGuiMod_Super,
    Meta: ImGui.Key.ImGuiMod_Super,
} as const;

const metaKeyInfo = {
    isDown: false,
};

/**
 * Forwards keyboard events to Dear ImGui. This is both used for normal keyboard events as well as
 * for the virtual keyboard, see {@linkcode setupKeyboardIO} and {@linkcode setupTouchIO}.
 *
 * @param event The keyboard event to handle.
 * @param keyDown Whether the key is being pressed or released.
 * @param io The {@linkcode ImGuiIO} object to forward the event to.
 */
const handleKeyboardEvent = (event: KeyboardEvent, keyDown: boolean, io: ImGuiIO) => {
    if (!Object.hasOwn(KEYBOARD_MAP, event.key)) {
        return;
    }

    if (event.key === "Meta") {
        metaKeyInfo.isDown = keyDown;
    }

    io.AddKeyEvent(KEYBOARD_MAP[event.key as keyof typeof KEYBOARD_MAP], keyDown);

    // NOTE: We lift the key when the meta key is pressed, because on macOS the browsers
    // 'keyup' events are not fired for other keys when meta key is held down.
    // see: https://stackoverflow.com/q/11818637.
    if (metaKeyInfo.isDown) {
        io.AddKeyEvent(KEYBOARD_MAP[event.key as keyof typeof KEYBOARD_MAP], false);
    }

    const modifier = KEYBOARD_MODIFIER_MAP[event.key as keyof typeof KEYBOARD_MODIFIER_MAP];
    if (modifier) {
        io.AddKeyEvent(modifier, keyDown);
    }

    if (event.key.length === 1 && keyDown) {
        io.AddInputCharactersUTF8(event.key);
    }
};

const setDisplayProperties = (canvas: HTMLCanvasElement) => {
    const io = ImGui.GetIO();
    const width = Math.floor(canvas.clientWidth);
    const height = Math.floor(canvas.clientHeight);
    io.DisplaySize = new ImVec2(width, height);
};

/**
 * Handles mouse button events.
 *
 * @param event The mouse event to handle.
 * @param isDown Whether the button is being pressed or released.
 * @param io The {@linkcode ImGuiIO} object to forward the event to.
 */
const handleMouseButtonEvent = (event: MouseEvent, isDown: boolean, io: ImGuiIO) => {
    if (!Object.hasOwn(MOUSE_BUTTON_MAP, event.button)) {
        return;
    }

    io.AddMouseButtonEvent(MOUSE_BUTTON_MAP[event.button as keyof typeof MOUSE_BUTTON_MAP], isDown);
};

/**
 * Sets up mouse key, wheel input and movement. Also handles cursor style changes.
 *
 * @param canvas The canvas element to set up.
 */
const setupMouseIO = (canvas: HTMLCanvasElement) => {
    const io = ImGui.GetIO();
    const scrollSpeed = 0.01;

    canvas.addEventListener("pointermove", (e) => {
        const rect = canvas.getBoundingClientRect();
        io.AddMousePosEvent(e.clientX - rect.left, e.clientY - rect.top);

        canvas.style.cursor = MOUSE_CURSOR_MAP[ImGui.GetMouseCursor()];
    });

    canvas.addEventListener("pointerdown", (e) => handleMouseButtonEvent(e, true, io));
    canvas.addEventListener("pointerup", (e) => handleMouseButtonEvent(e, false, io));
    canvas.addEventListener("wheel", (e) =>
        io.AddMouseWheelEvent(-e.deltaX * scrollSpeed, -e.deltaY * scrollSpeed),
    );
};

/**
 * Sets up keyboard input handling. Browser keyboard events are handled by
 * {@linkcode handleKeyboardEvent}.
 *
 * @param canvas The canvas element to set up.
 */
const setupKeyboardIO = (canvas: HTMLCanvasElement) => {
    const io = ImGui.GetIO();

    // Swap super and ctrl keys on macOS.
    if (navigator.userAgent.includes("Mac")) {
        io.ConfigMacOSXBehaviors = true;
    }

    // TODO: Fix too fast repeated inputs (Backspace, Delete...).
    canvas.addEventListener("keydown", (e) => handleKeyboardEvent(e, true, io));
    canvas.addEventListener("keyup", (e) => handleKeyboardEvent(e, false, io));
};

/**
 * Sets up touch input handling as well as showing the virtual keyboard. Note the following:
 *
 * - Single-finger touches are treated as mouse left clicks.
 * - Two-finger touches are treated as mouse scrolls.
 *
 * @param canvas The canvas element to set up.
 */
const setupTouchIO = (canvas: HTMLCanvasElement) => {
    const io = ImGui.GetIO();
    const scrollSpeed = 0.02;
    let lastPos = { x: 0, y: 0 };

    const handleTouchEvent = (event: TouchEvent, isButtonDown?: boolean) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();

        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            const currentPos = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2,
            };

            if (lastPos.x > 0 && lastPos.y > 0) {
                const deltaX = (lastPos.x - currentPos.x) * scrollSpeed;
                const deltaY = (lastPos.y - currentPos.y) * scrollSpeed;
                io.AddMouseWheelEvent(-deltaX, -deltaY);
            }

            lastPos = currentPos;
            return;
        }

        lastPos = { x: 0, y: 0 };
        const touch = event.touches[0];

        if (touch) {
            io.AddMousePosEvent(touch.clientX - rect.left, touch.clientY - rect.top);
        }

        if (typeof isButtonDown === "boolean") {
            io.AddMouseButtonEvent(ImGui.MouseButton.Left, isButtonDown);
        }
    };

    // Since the Virtual Keyboard API isn't widely supported yet, we use an invisible
    // <input> element to show the on-screen keyboard and handle the text input.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.opacity = "0";
    input.style.pointerEvents = "none";

    const keyDownHandler = (e: KeyboardEvent) => handleKeyboardEvent(e, true, io);
    const keyUpHandler = (e: KeyboardEvent) => handleKeyboardEvent(e, false, io);
    const blurHandler = () => {
        input.removeEventListener("keydown", keyDownHandler);
        input.removeEventListener("keyup", keyUpHandler);
        input.remove();
    };

    const handleTextInput = () => {
        if (io.WantTextInput) {
            document.body.appendChild(input);
            input.focus();

            input.addEventListener("blur", blurHandler);
            input.addEventListener("keydown", keyDownHandler);
            input.addEventListener("keyup", (e) => {
                keyUpHandler(e);

                // Exits single-line input fields when pressing Enter.
                if (!io.WantTextInput) {
                    blurHandler();
                }
            });
        } else {
            blurHandler();
        }
    };

    canvas.addEventListener("touchstart", (e) => handleTouchEvent(e, true));
    canvas.addEventListener("touchmove", (e) => handleTouchEvent(e));

    canvas.addEventListener("touchend", (e) => {
        lastPos = { x: 0, y: 0 };
        handleTouchEvent(e, false);
        handleTextInput();
    });

    canvas.addEventListener("touchcancel", (e) => {
        lastPos = { x: 0, y: 0 };
        handleTouchEvent(e, false);
    });
};

/**
 * Sets up the clipboard functionality to work between the browser and Dear ImGui.
 */
const setupClipboardIO = () => {
    const getClipboard = (): string => {
        return State.clipboardData;
    };

    const setClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        State.clipboardData = text;
    };

    Mod.export.SetupClipboardFunctions(getClipboard, setClipboard);

    document.addEventListener("paste", (e) => {
        State.clipboardData = e.clipboardData?.getData("text/plain") ?? "";
    });
};

/**
 * Sets up Dear ImGui for the browser. This includes:
 * - Setting up the canvas and resize events.
 * - Setting up mouse input, movement and cursor handling.
 * - Setting up keyboard input handling.
 * - Setting up touch input handling.
 *
 * This function is called by {@linkcode ImGuiImplWeb.Init}.
 *
 * @param canvas The canvas element to set up.
 */
const setupBrowserIO = (canvas: HTMLCanvasElement) => {
    const io = ImGui.GetIO();
    io.BackendFlags = ImGui.BackendFlags.HasMouseCursors;

    canvas.tabIndex = 1;
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("focus", () => io.AddFocusEvent(true));
    canvas.addEventListener("blur", () => io.AddFocusEvent(false));

    setDisplayProperties(canvas);

    setupMouseIO(canvas);
    setupKeyboardIO(canvas);
    setupTouchIO(canvas);
    setupClipboardIO();

    Mod.export.SetupIniSettings();
};

/**
 * Object containing some state information for jsimgui. Users most likely don't need to worry
 * about this.
 */
export const State = {
    canvas: null as HTMLCanvasElement | null,
    device: null as GPUDevice | null,
    backend: null as "webgl" | "webgl2" | "webgpu" | null,

    beginRenderFn: null as (() => void) | null,
    endRenderFn: null as ((passEncoder?: GPURenderPassEncoder) => void) | null,

    clipboardData: "" as string,

    saveIniSettingsFn: null as ((iniData: string) => void) | null,
    loadIniSettingsFn: null as (() => string) | null,
};

/**
 * Options for loading a texture.
 */
export interface TextureOptions {
    /**
     * The texture reference to update. Only required if you want to update an existing texture.
     */
    ref?: ImTextureRef;

    /**
     * The width of the texture. This needs to be specified if the texture is loaded
     * from a `Uint8Array`.
     */
    width?: number;

    /**
     * The height of the texture. This needs to be specified if the texture is loaded
     * from a `Uint8Array`.
     */
    height?: number;

    /**
     * Custom load function to use for loading the texture/image. You can use this if you require
     * additional processing. Note that you will need to write backend-specific code for this.
     *
     * @param data The image data to load.
     * @param options The options for loading the texture.
     * @returns The ImTextureID of the loaded image.
     */
    processFn?: (
        data?: HTMLImageElement | Uint8Array,
        options?: TextureOptions,
    ) => WebGLTexture | [GPUTexture, GPUTextureView];
}

/**
 * Object containing memory information of the WASM heap, mallinfo and stack.
 */
interface MemoryInfo {
    heap: {
        size: number;
        max: number;
        sbrk_ptr: number;
    };
    mall: {
        arena: number;
        ordblks: number;
        smblks: number;
        hblks: number;
        hblkhd: number;
        usmblks: number;
        fsmblks: number;
        uordblks: number;
        fordblks: number;
        keepcost: number;
    };
    stack: {
        base: number;
        end: number;
        current: number;
        free: number;
    };
}

/**
 * Initialization options for jsimgui used in {@linkcode ImGuiImplWeb.Init}.
 */
export interface InitOptions {
    /**
     * The canvas element to render Dear ImGui on.
     */
    canvas: HTMLCanvasElement;

    /**
     * The WebGPU device used for rendering. This is only required when using the WebGPU backend.
     */
    device?: GPUDevice;

    /**
     * Specify the rendering backend to use. If not specified, will be inferred from the canvas or
     * from {@linkcode device}.
     */
    backend?: "webgl" | "webgl2" | "webgpu";

    /**
     * The font loader and rasterizer to use for loading fonts. Can be one of the following:
     *
     * - `truetype` (stb_truetype) is the default option.
     * - `freetype` (FreeType) is an alternative option which supports more features than `truetype`
     * but this also loads an increased WASM file (+500kb).
     *
     * Default is `truetype`.
     */
    fontLoader?: "truetype" | "freetype";

    /**
     * Whether to enable Dear ImGui extensions (imnodes, implot, ...).
     */
    extensions?: boolean;

    /**
     * Custom path to the emscripten loader script. If not provided, will be constructed
     * automatically. If you use jsimgui via a package manager or CDN, you will most likely not
     * need to worry about this.
     */
    loaderPath?: string;
}

/**
 * This infers the backend to use for the given configuration.
 *
 * @param canvas The canvas element to infer the backend from.
 * @param device The WebGPU device to use. This overrides the backend to WebGPU.
 * @param backend The backend to use. This will explicitly use this backend.
 * @returns The backend to use.
 */
const getUsedBackend = (
    canvas: HTMLCanvasElement,
    device?: GPUDevice,
    backend?: "webgl" | "webgl2" | "webgpu",
): "webgl" | "webgl2" | "webgpu" => {
    if (backend) return backend;
    if (device) return "webgpu";

    const ctx =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("webgpu") ||
        canvas.getContext("2d") ||
        canvas.getContext("bitmaprenderer");

    if (ctx instanceof WebGLRenderingContext) return "webgl";
    if (ctx instanceof WebGL2RenderingContext) return "webgl2";
    if (ctx instanceof GPUCanvasContext) return "webgpu";

    if (ctx instanceof CanvasRenderingContext2D) {
        throw new Error("jsimgui: 2D canvas context is not supported.");
    }
    if (ctx instanceof ImageBitmapRenderingContext) {
        throw new Error("jsimgui: ImageBitmapRenderingContext is not supported.");
    }

    return "webgl2";
};

/**
 * This initializes the WebGL/WebGL2 backend.
 *
 * @param canvas The canvas element to initialize the WebGL/WebGL2 backend on.
 */
const initWebGL = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!ctx) {
        throw new Error("jsimgui: Could not create WebGL/WebGL2 context.");
    }

    const handle = Mod.export.GL.registerContext(
        ctx,
        ctx.getContextAttributes() as WebGLContextAttributes,
    ) as number;

    Mod.export.GL.makeContextCurrent(handle);
    ImGuiImplOpenGL3.Init();

    State.beginRenderFn = () => {
        ImGuiImplOpenGL3.NewFrame();
    };

    State.endRenderFn = () => {
        ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());
    };

    State.canvas = canvas;
};

/**
 * This initializes the WebGPU backend.
 *
 * @param canvas The canvas element to initialize the WebGPU backend on.
 * @param device The WebGPU device to use.
 */
const initWebGPU = (canvas: HTMLCanvasElement, device: GPUDevice | undefined) => {
    if (!device) {
        throw new Error("jsimgui: WebGPU device is not provided.");
    }

    ImGuiImplWGPU.Init(device);

    State.beginRenderFn = () => {
        ImGuiImplWGPU.NewFrame();
    };

    State.endRenderFn = (passEncoder?: GPURenderPassEncoder) => {
        ImGuiImplWGPU.RenderDrawData(ImGui.GetDrawData(), passEncoder as GPURenderPassEncoder);
    };

    State.canvas = canvas;
    State.device = device;
};

/**
 * Object providing easy to use functions for initializing jsimgui as well as other things like
 * loading images and fonts (TODO).
 */
export const ImGuiImplWeb = {
    /**
     * Returns the exports and runtime methods of the emscripten module.
     *
     * @returns The emscripten exports object.
     */

    // biome-ignore lint/suspicious/noExplicitAny: _
    GetEmscriptenExports(): any {
        return Mod.export;
    },

    /**
     * Returns memory information of the WASM heap, mallinfo and stack.
     *
     * @returns Object containing the memory information.
     */
    GetMemoryInfo(): MemoryInfo {
        return {
            heap: Mod.export.get_wasm_heap_info(),
            mall: Mod.export.get_wasm_mall_info(),
            stack: Mod.export.get_wasm_stack_info(),
        };
    },

    /**
     * Set the callback for saving the Dear ImGui ini settings. The ini settings will be passed as
     * string to the callback.
     *
     * @param fn The function to save the ImGui ini settings.
     */
    SetSaveIniSettingsFn(fn: (iniData: string) => void) {
        State.saveIniSettingsFn = fn;
    },

    /**
     * Set the callback for loading the Dear ImGui ini settings. The callback should return a string
     * of the ini settings. This callback will be called in the {@linkcode ImGuiImplWeb.Init}
     * function.
     *
     * @param fn The function to load the ImGui ini settings.
     */
    SetLoadIniSettingsFn(fn: () => string) {
        State.loadIniSettingsFn = fn;
    },

    /**
     * Load a texture/image for the current backend.
     *
     * @param data The image or image data to load.
     * @param options The options for loading the texture.
     * @returns The ImTextureRef of the loaded texture.
     */
    LoadTexture(data?: HTMLImageElement | Uint8Array, options: TextureOptions = {}): ImTextureRef {
        return State.backend === "webgpu"
            ? loadTextureWebGPU(State.device as GPUDevice, data, options)
            : loadTextureWebGL(
                  State.canvas?.getContext(State.backend as "webgl" | "webgl2") as
                      | WebGLRenderingContext
                      | WebGL2RenderingContext,
                  data,
                  options,
              );
    },

    /**
     * Load a font file to the filesystem for the current backend. Add it then using
     * `ImGui.GetIO().Fonts.AddFontFromFileTTF(filename);`
     * @param filename The filename of the font to load.
     * @param fontData The font data to load.
     */
    LoadFont(filename: string, fontData: Uint8Array): void {
        Mod.export.FS.writeFile(filename, fontData);
    },

    /**
     * Begins a new ImGui frame. Call this at the beginning of your render loop.
     */
    BeginRender() {
        setDisplayProperties(State.canvas as HTMLCanvasElement);

        if (ImGui.GetIO().WantSaveIniSettings) {
            State.saveIniSettingsFn?.(ImGui.SaveIniSettingsToMemory());
            ImGui.GetIO().WantSaveIniSettings = false;
        }

        State.beginRenderFn?.();
        ImGui.NewFrame();
    },

    /**
     * Ends the current ImGui frame. Call this at the end of your render loop. The `passEncoder`
     * is only required when using the WebGPU backend.
     *
     * @param passEncoder The WebGPU render pass encoder to use.
     */
    EndRender(passEncoder?: GPURenderPassEncoder) {
        ImGui.Render();
        State.endRenderFn?.(passEncoder);
    },

    /**
     * Initialize Dear ImGui with the specified configuration. This is asynchronous because it
     * waits for the WASM file to be loaded.
     *
     * @param options The initialization options: {@linkcode InitOptions}.
     */
    async Init(options: InitOptions): Promise<void> {
        const {
            canvas,
            device,
            backend,
            fontLoader = "truetype",
            loaderPath,
            extensions = false,
        } = options;

        const usedBackend = getUsedBackend(canvas, device, backend);
        State.backend = usedBackend;

        await Mod.init(fontLoader === "freetype", extensions, loaderPath);

        Mod.export.FS.mount(Mod.export.MEMFS, { root: "." }, ".");

        ImGui.CreateContext();
        setupBrowserIO(canvas);

        if (State.loadIniSettingsFn) {
            const iniData = State.loadIniSettingsFn() || "";
            ImGui.LoadIniSettingsFromMemory(iniData, iniData.length);
        }

        if (usedBackend === "webgl" || usedBackend === "webgl2") {
            initWebGL(canvas);
            return;
        }

        if (usedBackend === "webgpu") {
            initWebGPU(canvas, device);
            return;
        }
    },
};
