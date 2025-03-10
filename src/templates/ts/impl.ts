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
    /** Initialize Dear ImGui with WebGL2 Backend on the given canvas. */
    async InitWebGL(canvas: HTMLCanvasElement): Promise<void> {
        await Mod.init();
        Mod.export.FS.mount(Mod.export.MEMFS, { root: "." }, ".");

        const canvasContext = canvas.getContext("webgl2");

        if (!canvasContext) {
            throw new Error("Failed to create WebGL2 context.");
        }

        ImGui.CreateContext();
        setupIO(canvas);

        const handle = Mod.export.GL.registerContext(
            canvasContext,
            canvasContext.getContextAttributes(),
        ) as number;
        Mod.export.GL.makeContextCurrent(handle);

        ImGuiImplOpenGL3.Init();
    },

    /** Initialize Dear ImGui with WebGPU Backend on the given canvas. */
    async InitWebGPU(canvas: HTMLCanvasElement, device: GPUDevice) {
        await Mod.init();
        Mod.export.FS.mount(Mod.export.MEMFS, { root: "." }, ".");

        ImGui.CreateContext();
        setupIO(canvas);

        Mod.export.preinitializedWebGPUDevice = device;

        ImGuiImplWGPU.Init();
    },

    /** Begin a new ImGui WebGL frame. Call this at the beginning of your render loop. */
    BeginRenderWebGL(): void {
        ImGuiImplOpenGL3.NewFrame();
        ImGui.NewFrame();
    },

    /** Begin a new ImGui WebGPU frame. Call this at the beginning of your render loop. */
    BeginRenderWebGPU(): void {
        ImGuiImplWGPU.NewFrame();
        ImGui.NewFrame();
    },

    /** End the current ImGui WebGL frame. Call this at the end of your render loop. */
    EndRenderWebGL(): void {
        ImGui.Render();
        ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());
    },

    /** End the current ImGui WebGPU frame. Call this before passEncoder.end(). */
    EndRenderWebGPU(passEncoder: GPURenderPassEncoder): void {
        ImGui.Render();
        ImGuiImplWGPU.RenderDrawData(ImGui.GetDrawData(), passEncoder);
    },

    /** Load an image to be used on a WebGL canvas. Returns the texture id. */
    LoadImageWebGL(canvas: HTMLCanvasElement, image: HTMLImageElement): Promise<ImTextureID> {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                const gl = canvas.getContext("webgl2");
                if (!gl) {
                    throw new Error("Failed to create WebGL2 context.");
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
                    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
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

                device.queue.copyExternalImageToTexture({ source: image }, textureDestination, copySize);

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
};
