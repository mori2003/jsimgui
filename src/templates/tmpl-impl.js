
/**
 * Namespace for the Web implementation of jsimgui.
 * @namespace {ImGuiImplWeb}
 */
export const ImGuiImplWeb = {
    /**
     * Initializes the ImGuiImplWeb module.
     * @param {HTMLCanvasElement} canvas The canvas element.
     */
    Init: async (canvas) => {
        await Mod.initMain();

        const context = canvas.getContext("webgl2") || canvas.getContext("webgpu");

        if (!context) {
            throw new Error("Failed to get WebGL2 or WebGPU context.");
        }

        ImGui.CreateContext(null);
        ImGuiImplWeb.SetupIO(canvas);

        if (context instanceof WebGL2RenderingContext) {
            const handle = Mod.main.GL.registerContext(context, context.getContextAttributes());
            Mod.main.GL.makeContextCurrent(handle);

            ImGuiImplOpenGL3.Init();
        }
    },

    /**
     * Sets up the IO for the canvas.
     * @param {HTMLCanvasElement} canvas The canvas element.
     */
    SetupIO: (canvas) => {
        canvas.tabIndex = 1;

        // Prevent right click context menu.
        canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        const io = ImGui.GetIO();
        io.BackendFlags = ImEnum.BackendFlags.HasMouseCursors;

        const updateCanvasSize = () => {
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;

            const dpr = globalThis.devicePixelRatio || 1;

            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;

            io.DisplaySize = new ImVec2(displayWidth, displayHeight);
        };
        updateCanvasSize();

        globalThis.addEventListener("resize", updateCanvasSize);

        const keyMap = {
            "Tab": ImEnum.Key._Tab,
            "ArrowLeft": ImEnum.Key._LeftArrow,
            "ArrowRight": ImEnum.Key._RightArrow,
            "ArrowUp": ImEnum.Key._UpArrow,
            "ArrowDown": ImEnum.Key._DownArrow,
            "PageUp": ImEnum.Key._PageUp,
            "PageDown": ImEnum.Key._PageDown,
            "Home": ImEnum.Key._Home,
            "End": ImEnum.Key._End,
            "Insert": ImEnum.Key._Insert,
            "Delete": ImEnum.Key._Delete,
            "Backspace": ImEnum.Key._Backspace,
            "Space": ImEnum.Key._Space,
            "Enter": ImEnum.Key._Enter,
            "Escape": ImEnum.Key._Escape,

            "Control": ImEnum.Key._LeftCtrl,
            "Shift": ImEnum.Key._LeftShift,
            "Alt": ImEnum.Key._LeftAlt,
            "Super": ImEnum.Key._LeftSuper,

            "0": ImEnum.Key._0,
            "1": ImEnum.Key._1,
            "2": ImEnum.Key._2,
            "3": ImEnum.Key._3,
            "4": ImEnum.Key._4,
            "5": ImEnum.Key._5,
            "6": ImEnum.Key._6,
            "7": ImEnum.Key._7,
            "8": ImEnum.Key._8,
            "9": ImEnum.Key._9,

            "A": ImEnum.Key._A,
            "a": ImEnum.Key._A,
            "B": ImEnum.Key._B,
            "b": ImEnum.Key._B,
            "C": ImEnum.Key._C,
            "c": ImEnum.Key._C,
            "D": ImEnum.Key._D,
            "d": ImEnum.Key._D,
            "E": ImEnum.Key._E,
            "e": ImEnum.Key._E,
            "F": ImEnum.Key._F,
            "f": ImEnum.Key._F,
            "G": ImEnum.Key._G,
            "g": ImEnum.Key._G,
            "H": ImEnum.Key._H,
            "h": ImEnum.Key._H,
            "I": ImEnum.Key._I,
            "i": ImEnum.Key._I,
            "J": ImEnum.Key._J,
            "j": ImEnum.Key._J,
            "K": ImEnum.Key._K,
            "k": ImEnum.Key._K,
            "L": ImEnum.Key._L,
            "l": ImEnum.Key._L,
            "M": ImEnum.Key._M,
            "m": ImEnum.Key._M,
            "N": ImEnum.Key._N,
            "n": ImEnum.Key._N,
            "O": ImEnum.Key._O,
            "o": ImEnum.Key._O,
            "P": ImEnum.Key._P,
            "p": ImEnum.Key._P,
            "Q": ImEnum.Key._Q,
            "q": ImEnum.Key._Q,
            "R": ImEnum.Key._R,
            "r": ImEnum.Key._R,
            "S": ImEnum.Key._S,
            "s": ImEnum.Key._S,
            "T": ImEnum.Key._T,
            "t": ImEnum.Key._T,
            "U": ImEnum.Key._U,
            "u": ImEnum.Key._U,
            "V": ImEnum.Key._V,
            "v": ImEnum.Key._V,
            "W": ImEnum.Key._W,
            "w": ImEnum.Key._W,
            "X": ImEnum.Key._X,
            "x": ImEnum.Key._X,
            "Y": ImEnum.Key._Y,
            "y": ImEnum.Key._Y,
            "Z": ImEnum.Key._Z,
            "z": ImEnum.Key._Z,
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

        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            io.AddMousePosEvent(event.clientX - rect.left, event.clientY - rect.top);

            const cursorStyle = ImGui.GetMouseCursor();
            switch (cursorStyle) {
                case ImEnum.MouseCursor.None:
                    canvas.style.cursor = "none";
                    break;
                case ImEnum.MouseCursor.Arrow:
                    canvas.style.cursor = "default";
                    break;
                case ImEnum.MouseCursor.TextInput:
                    canvas.style.cursor = "text";
                    break;
                case ImEnum.MouseCursor.Hand:
                    canvas.style.cursor = "pointer";
                    break;
                case ImEnum.MouseCursor.ResizeAll:
                    canvas.style.cursor = "all-scroll";
                    break;
                case ImEnum.MouseCursor.ResizeNS:
                    canvas.style.cursor = "ns-resize";
                    break;
                case ImEnum.MouseCursor.ResizeEW:
                    canvas.style.cursor = "ew-resize";
                    break;
                case ImEnum.MouseCursor.ResizeNESW:
                    canvas.style.cursor = "nesw-resize";
                    break;
                case ImEnum.MouseCursor.ResizeNWSE:
                    canvas.style.cursor = "nwse-resize";
                    break;
                case ImEnum.MouseCursor.NotAllowed:
                    canvas.style.cursor = "not-allowed";
                    break;
                default:
                    canvas.style.cursor = "default";
                    break;
            }
        });

        const mouseMap = {
            0: 0,
            1: 2,
            2: 1,
        };

        canvas.addEventListener(
            "mousedown",
            (event) => {
                io.AddMouseButtonEvent(mouseMap[event.button], true);
            },
        );

        canvas.addEventListener(
            "mouseup",
            (event) => {
                io.AddMouseButtonEvent(mouseMap[event.button], false);
            },
        );

        canvas.addEventListener(
            "wheel",
            (event) => {
                io.AddMouseWheelEvent(-event.deltaX * 0.01, -event.deltaY * 0.01);
            },
        );

        canvas.addEventListener("focus", () => {
            io.AddFocusEvent(true);
        });

        canvas.addEventListener("blur", () => {
            io.AddFocusEvent(false);
        });
    },
};
