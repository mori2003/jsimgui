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

function handleCanvasSize(canvas: HTMLCanvasElement, io: ImGuiIO): void {
    const setDisplayProperties = (): void => {
        const displayWidth = Math.floor(canvas.clientWidth);
        const displayHeight = Math.floor(canvas.clientHeight);

        const dpr = globalThis.devicePixelRatio || 1;

        const bufferWidth = Math.max(1, Math.round(displayWidth * dpr));
        const bufferHeight = Math.max(1, Math.round(displayHeight * dpr));

        canvas.width = bufferWidth;
        canvas.height = bufferHeight;

        const gl = canvas.getContext("webgl2");
        if (gl) {
            gl.viewport(0, 0, bufferWidth, bufferHeight);
        }

        io.DisplaySize = new ImVec2(displayWidth, displayHeight);
        io.DisplayFramebufferScale = new ImVec2(dpr, dpr);
    };

    setDisplayProperties();
    globalThis.addEventListener("resize", setDisplayProperties);
}

function handleMouseEvents(canvas: HTMLCanvasElement, io: ImGuiIO): void {
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        io.AddMousePosEvent(event.clientX - rect.left, event.clientY - rect.top);
    });

    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        io.AddMousePosEvent(event.clientX - rect.left, event.clientY - rect.top);

        const cursorStyle = ImGui.GetMouseCursor();
        switch (cursorStyle) {
            case ImGui.MouseCursor.None:
                canvas.style.cursor = "none";
                break;
            case ImGui.MouseCursor.Arrow:
                canvas.style.cursor = "default";
                break;
            case ImGui.MouseCursor.TextInput:
                canvas.style.cursor = "text";
                break;
            case ImGui.MouseCursor.Hand:
                canvas.style.cursor = "pointer";
                break;
            case ImGui.MouseCursor.ResizeAll:
                canvas.style.cursor = "all-scroll";
                break;
            case ImGui.MouseCursor.ResizeNS:
                canvas.style.cursor = "ns-resize";
                break;
            case ImGui.MouseCursor.ResizeEW:
                canvas.style.cursor = "ew-resize";
                break;
            case ImGui.MouseCursor.ResizeNESW:
                canvas.style.cursor = "nesw-resize";
                break;
            case ImGui.MouseCursor.ResizeNWSE:
                canvas.style.cursor = "nwse-resize";
                break;
            case ImGui.MouseCursor.NotAllowed:
                canvas.style.cursor = "not-allowed";
                break;
            default:
                canvas.style.cursor = "default";
                break;
        }
    });

    const mouseMap: Record<number, number> = {
        0: ImGui.MouseButton.Left,
        1: ImGui.MouseButton.Middle,
        2: ImGui.MouseButton.Right,
    };

    canvas.addEventListener("mousedown", (event) => {
        io.AddMouseButtonEvent(mouseMap[event.button], true);
    });

    canvas.addEventListener("mouseup", (event) => {
        io.AddMouseButtonEvent(mouseMap[event.button], false);
    });

    canvas.addEventListener("wheel", (event) => {
        io.AddMouseWheelEvent(-event.deltaX * 0.01, -event.deltaY * 0.01);
    });
}

function handleKeyboardEvents(canvas: HTMLCanvasElement, io: ImGuiIO): void {
    const keyboardMap: Map<string, number[]> = new Map();

    const bindKey = (keys: string | string[], value: number | number[]): void => {
        const keyArray = Array.isArray(keys) ? keys : [keys];
        const valueArray = Array.isArray(value) ? value : [value];

        for (const key of keyArray) {
            const existing = keyboardMap.get(key) || [];
            keyboardMap.set(key, [...existing, ...valueArray]);
        }
    };

    for (let i = 0; i <= 9; i++) {
        bindKey(`${i}`, ImGui.Key[`_${i}` as keyof typeof ImGui.Key]);
        bindKey(`Numpad${i}`, ImGui.Key[`_Keypad${i}` as keyof typeof ImGui.Key]);
    }

    for (let i = 1; i <= 24; i++) {
        bindKey(`F${i}`, ImGui.Key[`_F${i}` as keyof typeof ImGui.Key]);
    }

    for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
        bindKey([letter, letter.toLowerCase()], ImGui.Key[`_${letter}` as keyof typeof ImGui.Key]);
    }

    bindKey("'", ImGui.Key._Apostrophe);
    bindKey(",", ImGui.Key._Comma);
    bindKey("-", ImGui.Key._Minus);
    bindKey(".", ImGui.Key._Period);
    bindKey("/", ImGui.Key._Slash);
    bindKey(";", ImGui.Key._Semicolon);
    bindKey("=", ImGui.Key._Equal);
    bindKey("[", ImGui.Key._LeftBracket);
    bindKey("\\", ImGui.Key._Backslash);
    bindKey("]", ImGui.Key._RightBracket);
    bindKey("`", ImGui.Key._GraveAccent);

    bindKey("CapsLock", ImGui.Key._CapsLock);
    bindKey("ScrollLock", ImGui.Key._ScrollLock);
    bindKey("NumLock", ImGui.Key._NumLock);
    bindKey("PrintScreen", ImGui.Key._PrintScreen);
    bindKey("Pause", ImGui.Key._Pause);

    bindKey("NumpadDecimal", ImGui.Key._KeypadDecimal);
    bindKey("NumpadDivide", ImGui.Key._KeypadDivide);
    bindKey("NumpadMultiply", ImGui.Key._KeypadMultiply);
    bindKey("NumpadSubtract", ImGui.Key._KeypadSubtract);
    bindKey("NumpadAdd", ImGui.Key._KeypadAdd);
    bindKey("NumpadEnter", ImGui.Key._KeypadEnter);
    bindKey("NumpadEqual", ImGui.Key._KeypadEqual);

    bindKey("Tab", [ImGui.Key._Tab]);
    bindKey("ArrowLeft", [ImGui.Key._LeftArrow]);
    bindKey("ArrowRight", [ImGui.Key._RightArrow]);
    bindKey("ArrowUp", [ImGui.Key._UpArrow]);
    bindKey("ArrowDown", [ImGui.Key._DownArrow]);
    bindKey("PageUp", [ImGui.Key._PageUp]);
    bindKey("PageDown", [ImGui.Key._PageDown]);
    bindKey("Home", [ImGui.Key._Home]);
    bindKey("End", [ImGui.Key._End]);
    bindKey("Insert", [ImGui.Key._Insert]);
    bindKey("Delete", [ImGui.Key._Delete]);
    bindKey("Backspace", ImGui.Key._Backspace);
    bindKey(" ", [ImGui.Key._Space]);
    bindKey("Enter", [ImGui.Key._Enter]);
    bindKey("Escape", [ImGui.Key._Escape]);

    bindKey("Control", [ImGui.Key._LeftCtrl, ImGui.Key.ImGuiMod_Ctrl]);
    bindKey("Shift", [ImGui.Key._LeftShift, ImGui.Key.ImGuiMod_Shift]);
    bindKey("Alt", [ImGui.Key._LeftAlt, ImGui.Key.ImGuiMod_Alt]);
    bindKey("Super", [ImGui.Key._LeftSuper, ImGui.Key.ImGuiMod_Super]);

    // TODO: Fix too fast repeated inputs (Backspace, Delete...).
    canvas.addEventListener("keydown", (event) => {
        const keys = keyboardMap.get(event.key);

        if (keys) {
            for (const key of keys) {
                io.AddKeyEvent(key, true);
            }
        }

        if (event.key.length === 1) {
            io.AddInputCharactersUTF8(event.key);
        }
    });

    canvas.addEventListener("keyup", (event) => {
        const keys = keyboardMap.get(event.key);

        if (keys) {
            for (const key of keys) {
                io.AddKeyEvent(key, false);
            }
        }
    });
}

/** Setup IO for the browser. */
function setupIO(canvas: HTMLCanvasElement): void {
    canvas.tabIndex = 1;

    // Prevent right click context menu.
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    const io = ImGui.GetIO();
    io.BackendFlags = ImGui.BackendFlags.HasMouseCursors;

    handleCanvasSize(canvas, io);
    handleMouseEvents(canvas, io);
    handleKeyboardEvents(canvas, io);

    canvas.addEventListener("focus", () => {
        io.AddFocusEvent(true);
    });

    canvas.addEventListener("blur", () => {
        io.AddFocusEvent(false);
    });
}

/** Web implementation of Jsimgui. */
export const ImGuiImplWeb = {
    /** Initialize Dear ImGui on the given canvas. Only WebGL2 is supported. */
    async Init(canvas: HTMLCanvasElement): Promise<void> {
        const canvasContext = canvas.getContext("webgl2");
        if (!(canvasContext && canvasContext instanceof WebGL2RenderingContext)) {
            throw new Error("Failed to get WebGL2 context.");
        }

        await Mod.init();
        Mod.export.FS.mount(Mod.export.MEMFS, { root: "." }, ".");

        ImGui.CreateContext();
        setupIO(canvas);

        const handle = Mod.export.GL.registerContext(
            canvasContext,
            canvasContext.getContextAttributes(),
        );
        Mod.export.GL.makeContextCurrent(handle);

        ImGuiImplOpenGL3.Init();
    },

    /** Begin a new frame. Call this at the beginning of your render loop. */
    BeginRender(): void {
        ImGuiImplOpenGL3.NewFrame();
        ImGui.NewFrame();
    },

    /** End the current frame. Call this at the end of your render loop. */
    EndRender(): void {
        ImGui.Render();
        ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());
    },

    /** Load an image to the WebGL2 context and return the texture id. */
    LoadImage(canvas: HTMLCanvasElement, image: HTMLImageElement): Promise<ImTextureID> {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                const gl = canvas.getContext("webgl2");
                if (!gl) {
                    return;
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
};
