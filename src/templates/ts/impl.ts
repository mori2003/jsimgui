/* -------------------------------------------------------------------------- */
/* 5. Web Implementation */
/* -------------------------------------------------------------------------- */

export const ImGuiImplOpenGL3 = {
    /** Initializes the OpenGL3 backend. */
    Init(): boolean {
        return Mod.export.cImGui_ImplOpenGL3_Init();
    },

    /** Shuts down the OpenGL3 backend. */
    Shutdown(): void {
        return Mod.export.cImGui_ImplOpenGL3_Shutdown();
    },

    /** Starts a new OpenGL3 frame. */
    NewFrame(): void {
        return Mod.export.cImGui_ImplOpenGL3_NewFrame();
    },

    /** Renders the OpenGL3 frame. */
    RenderDrawData(draw_data: ImDrawData): void {
        return Mod.export.cImGui_ImplOpenGL3_RenderDrawData(draw_data._ptr);
    },
};

export const ImGuiImplWGPU = {
    /** Initializes the WebGPU backend. */
    Init(): boolean {
        return Mod.export.cImGui_ImplWGPU_Init();
    },

    /** Shuts down the WebGPU backend. */
    Shutdown(): void {
        return Mod.export.cImGui_ImplWGPU_Shutdown();
    },

    /** Starts a new WebGPU frame. */
    NewFrame(): void {
        return Mod.export.cImGui_ImplWGPU_NewFrame();
    },

    /** Renders the WebGPU frame. */
    RenderDrawData(draw_data: ImDrawData, pass_encoder: GPURenderPassEncoder): void {
        const handle = Mod.export.JsValStore.add(pass_encoder);
        return Mod.export.cImGui_ImplWGPU_RenderDrawData(draw_data._ptr, handle);
    },
};

const MOUSE_BUTTON_MAP = {
    0: ImGui.MouseButton.Left,
    1: ImGui.MouseButton.Middle,
    2: ImGui.MouseButton.Right,
} as const;

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
} as const;

const KEYBOARD_MODIFIER_MAP = {
    Control: ImGui.Key.ImGuiMod_Ctrl,
    Shift: ImGui.Key.ImGuiMod_Shift,
    Alt: ImGui.Key.ImGuiMod_Alt,
    Super: ImGui.Key.ImGuiMod_Super,
} as const;

const handleKeyboardEvent = (event: KeyboardEvent, keyDown: boolean, io: ImGuiIO) => {
    io.AddKeyEvent(KEYBOARD_MAP[event.key as keyof typeof KEYBOARD_MAP], keyDown);

    const modifier = KEYBOARD_MODIFIER_MAP[event.key as keyof typeof KEYBOARD_MODIFIER_MAP];
    if (modifier) {
        io.AddKeyEvent(modifier, keyDown);
    }

    if (event.key.length === 1 && keyDown) {
        io.AddInputCharactersUTF8(event.key);
    }
};

/**
 * Sets up canvas size and resize handling.
 */
function setupCanvasIO(canvas: HTMLCanvasElement) {
    const io = ImGui.GetIO();

    const setDisplayProperties = () => {
        const displayWidth = Math.floor(canvas.clientWidth);
        const displayHeight = Math.floor(canvas.clientHeight);

        const dpr = globalThis.devicePixelRatio || 1;
        const bufferWidth = Math.max(1, Math.round(displayWidth * dpr));
        const bufferHeight = Math.max(1, Math.round(displayHeight * dpr));

        canvas.width = bufferWidth;
        canvas.height = bufferHeight;

        io.DisplaySize = new ImVec2(displayWidth, displayHeight);
        io.DisplayFramebufferScale = new ImVec2(dpr, dpr);
    };

    setDisplayProperties();
    globalThis.addEventListener("resize", setDisplayProperties);
}

/**
 * Sets up mouse input, movement and cursor handling.
 */
function setupMouseIO(canvas: HTMLCanvasElement) {
    const io = ImGui.GetIO();
    const scrollSpeed = 0.01;

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        io.AddMousePosEvent(e.clientX - rect.left, e.clientY - rect.top);

        canvas.style.cursor = MOUSE_CURSOR_MAP[ImGui.GetMouseCursor()];
    });

    canvas.addEventListener("mousedown", (e) => {
        io.AddMouseButtonEvent(MOUSE_BUTTON_MAP[e.button as keyof typeof MOUSE_BUTTON_MAP], true);
    });

    canvas.addEventListener("mouseup", (e) => {
        io.AddMouseButtonEvent(MOUSE_BUTTON_MAP[e.button as keyof typeof MOUSE_BUTTON_MAP], false);
    });

    canvas.addEventListener("wheel", (e) => {
        io.AddMouseWheelEvent(-e.deltaX * scrollSpeed, -e.deltaY * scrollSpeed);
    });
}

/**
 * Sets up keyboard input handling.
 */
function setupKeyboardIO(canvas: HTMLCanvasElement) {
    const io = ImGui.GetIO();

    // TODO: Fix too fast repeated inputs (Backspace, Delete...).
    canvas.addEventListener("keydown", (e) => handleKeyboardEvent(e, true, io));
    canvas.addEventListener("keyup", (e) => handleKeyboardEvent(e, false, io));
}

/**
 * Sets up touch input handling.
 * Single-finger touches are treated as mouse left clicks.
 * Two-finger touches are treated as mouse scrolls.
 */
function setupTouchIO(canvas: HTMLCanvasElement) {
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
}

/**
 * Setup Browser inputs (mouse, keyboard, and touch).
 */
function setupBrowserIO(canvas: HTMLCanvasElement) {
    const io = ImGui.GetIO();
    io.BackendFlags = ImGui.BackendFlags.HasMouseCursors;

    canvas.tabIndex = 1;
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("focus", () => io.AddFocusEvent(true));
    canvas.addEventListener("blur", () => io.AddFocusEvent(false));

    setupCanvasIO(canvas);
    setupMouseIO(canvas);
    setupKeyboardIO(canvas);
    setupTouchIO(canvas);
}

/**
 * Initialization options for Jsimgui.
 */
interface InitOptions {
    canvas: HTMLCanvasElement;
    device?: GPUDevice;
    backend?: "webgl" | "webgl2" | "webgpu";
    fontLoader?: "truetype" | "freetype";
    useDemos?: boolean;
}

let beginRenderFn: () => void = () => {};
let endRenderFn: (passEncoder?: GPURenderPassEncoder) => void = () => {};

/** Web implementation of Jsimgui. */
export const ImGuiImplWeb = {
    /** Begin a new ImGui frame. Call this at the beginning of your render loop. */
    BeginRender() {
        beginRenderFn();
        ImGui.NewFrame();
    },

    /** End the current ImGui frame. Call this at the end of your render loop. */
    EndRender(passEncoder?: GPURenderPassEncoder) {
        ImGui.Render();
        endRenderFn(passEncoder);
    },

    /**
     * Initialize Dear ImGui with the specified options.
     */
    async Init(options: InitOptions) {
        const { canvas, device, backend, fontLoader = "truetype", useDemos = false } = options;

        const inferredBackend = device
            ? "webgpu"
            : (() => {
                  const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
                  if (ctx instanceof WebGL2RenderingContext) return "webgl2";
                  if (ctx instanceof WebGLRenderingContext) return "webgl";
                  return null;
              })();


        if (!backend && !inferredBackend) {
            throw new Error("Unknown backend.");
        }

        const backendName = backend ?? inferredBackend;
        const fontLoaderShort = fontLoader === "truetype" ? "tt" : "ft";
        const loaderPath = `./${backendName}/jsimgui-${backendName}-${fontLoaderShort}${useDemos ? "-demos" : ""}.js`;

        await Mod.init(loaderPath);
        Mod.export.FS.mount(Mod.export.MEMFS, { root: "." }, ".");

        ImGui.CreateContext();
        setupBrowserIO(canvas);

        if (backendName === "webgpu") {
            Mod.export.preinitializedWebGPUDevice = device;
            ImGuiImplWGPU.Init();

            beginRenderFn = () => {
                ImGuiImplWGPU.NewFrame();
            };
            endRenderFn = (passEncoder?: GPURenderPassEncoder) => {
                ImGuiImplWGPU.RenderDrawData(
                    ImGui.GetDrawData(),
                    passEncoder as GPURenderPassEncoder,
                );
            };
            return;
        }

        if (backendName === "webgl" || backendName === "webgl2") {
            const ctx = canvas.getContext(backendName) as
                | WebGLRenderingContext
                | WebGL2RenderingContext;
            if (!ctx) throw new Error(`Failed to create ${backendName.toUpperCase()} context`);

            const handle = Mod.export.GL.registerContext(ctx, ctx.getContextAttributes()) as number;
            Mod.export.GL.makeContextCurrent(handle);
            ImGuiImplOpenGL3.Init();

            beginRenderFn = () => {
                ImGuiImplOpenGL3.NewFrame();
            };
            endRenderFn = () => {
                ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());
            };
            return;
        }
    },

    /** Load an image to be used on a WebGL canvas. Returns the texture id. */
    LoadImageWebGL(canvas: HTMLCanvasElement, image: HTMLImageElement): Promise<ImTextureID> {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
                if (!gl) {
                    throw new Error("Failed to create WebGL/WebGL2 context.");
                }

                const texture = gl.createTexture();

                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                const id = Mod.export.GL.getNewId(Mod.export.GL.textures);
                Mod.export.GL.textures[id] = texture;

                resolve(id);
            };

            image.onerror = (error) => {
                reject(error);
            };
        });
    },

    /** Load an image to be used on a WebGPU canvas. Returns the texture id. */
    LoadImageWebGPU(device: GPUDevice, image: HTMLImageElement): Promise<ImTextureID> {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                const textureDescriptor: GPUTextureDescriptor = {
                    usage:
                        GPUTextureUsage.COPY_DST |
                        GPUTextureUsage.TEXTURE_BINDING |
                        GPUTextureUsage.RENDER_ATTACHMENT,
                    dimension: "2d",
                    size: {
                        width: image.width,
                        height: image.height,
                        depthOrArrayLayers: 1,
                    },
                    format: "rgba8unorm",
                    mipLevelCount: 1,
                    sampleCount: 1,
                };
                const texture = device.createTexture(textureDescriptor);

                const textureDestination: GPUImageCopyTexture = {
                    texture: texture,
                    mipLevel: 0,
                    origin: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    aspect: "all",
                };
                const copySize: GPUExtent3D = {
                    width: image.width,
                    height: image.height,
                    depthOrArrayLayers: 1,
                };

                device.queue.copyExternalImageToTexture(
                    { source: image },
                    textureDestination,
                    copySize,
                );

                const textureViewDescriptor: GPUTextureViewDescriptor = {
                    format: "rgba8unorm",
                    dimension: "2d",
                    baseMipLevel: 0,
                    mipLevelCount: 1,
                    baseArrayLayer: 0,
                    arrayLayerCount: 1,
                    aspect: "all",
                };
                const textureView = texture.createView(textureViewDescriptor);

                Mod.export.WebGPU.mgrTexture.create(texture);
                const id = Mod.export.WebGPU.mgrTextureView.create(textureView);

                resolve(id);
            };

            image.onerror = (error) => {
                reject(error);
            };
        });
    },

    GetMemoryInfo(): {
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
    } {
        return {
            heap: Mod.export.get_wasm_heap_info(),
            mall: Mod.export.get_wasm_mall_info(),
            stack: Mod.export.get_wasm_stack_info(),
        };
    },
};
