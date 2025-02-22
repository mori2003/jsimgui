/* -------------------------------------------------------------------------- */
/* 5. Web Implementation */
/* -------------------------------------------------------------------------- */

export const ImGuiImplOpenGL3 = {
    /** [Manual] Initializes the OpenGL3 backend. */
    Init(): boolean {
        return Mod.export.cImGui_ImplOpenGL3_Init();
    },

    /** [Manual] Shuts down the OpenGL3 backend. */
    Shutdown(): void {
        return Mod.export.cImGui_ImplOpenGL3_Shutdown();
    },

    /** [Manual] Starts a new OpenGL3 frame. */
    NewFrame(): void {
        return Mod.export.cImGui_ImplOpenGL3_NewFrame();
    },

    /** [Manual] Renders the OpenGL3 frame. */
    RenderDrawData(draw_data: ImDrawData): void {
        return Mod.export.cImGui_ImplOpenGL3_RenderDrawData(draw_data._ptr);
    },
};

function handleCanvasSize(canvas: HTMLCanvasElement, io: ImGuiIO): void {
    const updateCanvasSize = (): void => {
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        const dpr = globalThis.devicePixelRatio || 1;

        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        io.DisplaySize = new ImVec2(displayWidth, displayHeight);
    };
    updateCanvasSize();

    globalThis.addEventListener("resize", updateCanvasSize);
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
        0: 0,
        1: 2,
        2: 1,
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
    const keyMap: Record<string, number> = {
        "Tab": ImGui.Key._Tab,
        "ArrowLeft": ImGui.Key._LeftArrow,
        "ArrowRight": ImGui.Key._RightArrow,
        "ArrowUp": ImGui.Key._UpArrow,
        "ArrowDown": ImGui.Key._DownArrow,
        "PageUp": ImGui.Key._PageUp,
        "PageDown": ImGui.Key._PageDown,
        "Home": ImGui.Key._Home,
        "End": ImGui.Key._End,
        "Insert": ImGui.Key._Insert,
        "Delete": ImGui.Key._Delete,
        "Backspace": ImGui.Key._Backspace,
        "Space": ImGui.Key._Space,
        "Enter": ImGui.Key._Enter,
        "Escape": ImGui.Key._Escape,

        "Control": ImGui.Key._LeftCtrl,
        "Shift": ImGui.Key._LeftShift,
        "Alt": ImGui.Key._LeftAlt,
        "Super": ImGui.Key._LeftSuper,

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

        "A": ImGui.Key._A,
        "a": ImGui.Key._A,
        "B": ImGui.Key._B,
        "b": ImGui.Key._B,
        "C": ImGui.Key._C,
        "c": ImGui.Key._C,
        "D": ImGui.Key._D,
        "d": ImGui.Key._D,
        "E": ImGui.Key._E,
        "e": ImGui.Key._E,
        "F": ImGui.Key._F,
        "f": ImGui.Key._F,
        "G": ImGui.Key._G,
        "g": ImGui.Key._G,
        "H": ImGui.Key._H,
        "h": ImGui.Key._H,
        "I": ImGui.Key._I,
        "i": ImGui.Key._I,
        "J": ImGui.Key._J,
        "j": ImGui.Key._J,
        "K": ImGui.Key._K,
        "k": ImGui.Key._K,
        "L": ImGui.Key._L,
        "l": ImGui.Key._L,
        "M": ImGui.Key._M,
        "m": ImGui.Key._M,
        "N": ImGui.Key._N,
        "n": ImGui.Key._N,
        "O": ImGui.Key._O,
        "o": ImGui.Key._O,
        "P": ImGui.Key._P,
        "p": ImGui.Key._P,
        "Q": ImGui.Key._Q,
        "q": ImGui.Key._Q,
        "R": ImGui.Key._R,
        "r": ImGui.Key._R,
        "S": ImGui.Key._S,
        "s": ImGui.Key._S,
        "T": ImGui.Key._T,
        "t": ImGui.Key._T,
        "U": ImGui.Key._U,
        "u": ImGui.Key._U,
        "V": ImGui.Key._V,
        "v": ImGui.Key._V,
        "W": ImGui.Key._W,
        "w": ImGui.Key._W,
        "X": ImGui.Key._X,
        "x": ImGui.Key._X,
        "Y": ImGui.Key._Y,
        "y": ImGui.Key._Y,
        "Z": ImGui.Key._Z,
        "z": ImGui.Key._Z,
    };

    canvas.addEventListener("keydown", (event) => {
        io.AddKeyEvent(keyMap[event.key], true);

        if (event.key.length === 1) {
            io.AddInputCharactersUTF8(event.key);
        }
    });

    canvas.addEventListener("keyup", (event) => {
        io.AddKeyEvent(keyMap[event.key], false);
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
};
