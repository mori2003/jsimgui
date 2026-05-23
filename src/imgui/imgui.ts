// @ts-nocheck

export const Mod = {
	// biome-ignore lint/suspicious/noExplicitAny: _
	export: null as any,

	async init(enableFreeType: boolean, extensions: boolean, loaderPath?: string): Promise<void> {
		// biome-ignore lint/suspicious/noExplicitAny: _
		let MainExport: any;

		if (loaderPath) {
			MainExport = await import(loaderPath);
		} else if (enableFreeType) {
			MainExport = extensions
				? // @ts-expect-error
					await import("./loader-freetype-extensions.js")
				: // @ts-expect-error
					await import("./loader-freetype.js");
		} else {
			MainExport = extensions
				? // @ts-expect-error
					await import("./loader-extensions.js")
				: // @ts-expect-error
					await import("./loader.js");
		}

		Mod.export = await MainExport.default();
	},
};

/**
 * Base class for value structs (passed by value, no native pointer).
 */
export class ValueStruct {}

/**
 * Base class for reference structs (carry native pointer/reference).
 * These structs manage native memory and require explicit cleanup.
 */
export class ReferenceStruct {
	/**
	 * The native pointer to the struct.
	 */
	ptr: any = null;

	/**
	 * Construct a new JavaScript class instance and allocate native memory.
	 */
	static New(): any {
		const obj = new this();
		obj.ptr = new Mod.export[this.name]();
		return obj;
	}

	/**
	 * Create a JavaScript class instance from a native pointer.
	 */
	static From(ptr: any): any {
		const obj = new this();
		obj.ptr = ptr;
		return obj;
	}

	/**
	 * Free the struct's native allocated memory.
	 */
	Drop(): void {
		this.ptr?.delete();
	}
}

// MARKER: Generated ImGui bindings will be inserted here.

export class ImGuiImplOpenGL3 {
	static Init(): boolean {
		return Mod.export.cImGui_ImplOpenGL3_Init();
	}

	static Shutdown(): void {
		Mod.export.cImGui_ImplOpenGL3_Shutdown();
	}

	static NewFrame(): void {
		Mod.export.cImGui_ImplOpenGL3_NewFrame();
	}

	static RenderDrawData(draw_data: ImDrawData): void {
		Mod.export.cImGui_ImplOpenGL3_RenderDrawData(draw_data.ptr);
	}
}

export class ImGuiImplWGPU {
	static Init(device: GPUDevice): boolean {
		const handle = Mod.export.WebGPU.importJsDevice(device);
		return Mod.export.cImGui_ImplWGPU_Init(handle);
	}

	static Shutdown(): void {
		Mod.export.cImGui_ImplWGPU_Shutdown();
	}

	static NewFrame(): void {
		Mod.export.cImGui_ImplWGPU_NewFrame();
	}

	static RenderDrawData(draw_data: ImDrawData, pass_encoder: GPURenderPassEncoder): void {
		const handle = Mod.export.WebGPU.importJsRenderPassEncoder(pass_encoder);
		Mod.export.cImGui_ImplWGPU_RenderDrawData(draw_data.ptr, handle);
	}
}

/**
 * Map of browser mouse button values to ImGui mouse button enums.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button}.
 */
const MOUSE_BUTTON_MAP = {
	0: ImGuiMouseButton.Left,
	1: ImGuiMouseButton.Middle,
	2: ImGuiMouseButton.Right,
} as const;

/**
 * Map of ImGui mouse cursor enums to CSS cursor styles.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor}.
 */
const MOUSE_CURSOR_MAP = {
	[ImGuiMouseCursor.None]: "none",
	[ImGuiMouseCursor.Arrow]: "default",
	[ImGuiMouseCursor.TextInput]: "text",
	[ImGuiMouseCursor.Hand]: "pointer",
	[ImGuiMouseCursor.ResizeAll]: "all-scroll",
	[ImGuiMouseCursor.ResizeNS]: "ns-resize",
	[ImGuiMouseCursor.ResizeEW]: "ew-resize",
	[ImGuiMouseCursor.ResizeNESW]: "nesw-resize",
	[ImGuiMouseCursor.ResizeNWSE]: "nwse-resize",
	[ImGuiMouseCursor.NotAllowed]: "not-allowed",
} as const;

/**
 * Map of browser keyboard key values to ImGui key enums.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key}.
 */
const KEYBOARD_MAP = {
	"0": ImGuiKey._0,
	"1": ImGuiKey._1,
	"2": ImGuiKey._2,
	"3": ImGuiKey._3,
	"4": ImGuiKey._4,
	"5": ImGuiKey._5,
	"6": ImGuiKey._6,
	"7": ImGuiKey._7,
	"8": ImGuiKey._8,
	"9": ImGuiKey._9,

	Numpad0: ImGuiKey._Keypad0,
	Numpad1: ImGuiKey._Keypad1,
	Numpad2: ImGuiKey._Keypad2,
	Numpad3: ImGuiKey._Keypad3,
	Numpad4: ImGuiKey._Keypad4,
	Numpad5: ImGuiKey._Keypad5,
	Numpad6: ImGuiKey._Keypad6,
	Numpad7: ImGuiKey._Keypad7,
	Numpad8: ImGuiKey._Keypad8,
	Numpad9: ImGuiKey._Keypad9,
	NumpadDecimal: ImGuiKey._KeypadDecimal,
	NumpadDivide: ImGuiKey._KeypadDivide,
	NumpadMultiply: ImGuiKey._KeypadMultiply,
	NumpadSubtract: ImGuiKey._KeypadSubtract,
	NumpadAdd: ImGuiKey._KeypadAdd,
	NumpadEnter: ImGuiKey._KeypadEnter,
	NumpadEqual: ImGuiKey._KeypadEqual,

	F1: ImGuiKey._F1,
	F2: ImGuiKey._F2,
	F3: ImGuiKey._F3,
	F4: ImGuiKey._F4,
	F5: ImGuiKey._F5,
	F6: ImGuiKey._F6,
	F7: ImGuiKey._F7,
	F8: ImGuiKey._F8,
	F9: ImGuiKey._F9,
	F10: ImGuiKey._F10,
	F11: ImGuiKey._F11,
	F12: ImGuiKey._F12,
	F13: ImGuiKey._F13,
	F14: ImGuiKey._F14,
	F15: ImGuiKey._F15,
	F16: ImGuiKey._F16,
	F17: ImGuiKey._F17,
	F18: ImGuiKey._F18,
	F19: ImGuiKey._F19,
	F20: ImGuiKey._F20,
	F21: ImGuiKey._F21,
	F22: ImGuiKey._F22,
	F23: ImGuiKey._F23,
	F24: ImGuiKey._F24,

	a: ImGuiKey._A,
	b: ImGuiKey._B,
	c: ImGuiKey._C,
	d: ImGuiKey._D,
	e: ImGuiKey._E,
	f: ImGuiKey._F,
	g: ImGuiKey._G,
	h: ImGuiKey._H,
	i: ImGuiKey._I,
	j: ImGuiKey._J,
	k: ImGuiKey._K,
	l: ImGuiKey._L,
	m: ImGuiKey._M,
	n: ImGuiKey._N,
	o: ImGuiKey._O,
	p: ImGuiKey._P,
	q: ImGuiKey._Q,
	r: ImGuiKey._R,
	s: ImGuiKey._S,
	t: ImGuiKey._T,
	u: ImGuiKey._U,
	v: ImGuiKey._V,
	w: ImGuiKey._W,
	x: ImGuiKey._X,
	y: ImGuiKey._Y,
	z: ImGuiKey._Z,
	A: ImGuiKey._A,
	B: ImGuiKey._B,
	C: ImGuiKey._C,
	D: ImGuiKey._D,
	E: ImGuiKey._E,
	F: ImGuiKey._F,
	G: ImGuiKey._G,
	H: ImGuiKey._H,
	I: ImGuiKey._I,
	J: ImGuiKey._J,
	K: ImGuiKey._K,
	L: ImGuiKey._L,
	M: ImGuiKey._M,
	N: ImGuiKey._N,
	O: ImGuiKey._O,
	P: ImGuiKey._P,
	Q: ImGuiKey._Q,
	R: ImGuiKey._R,
	S: ImGuiKey._S,
	T: ImGuiKey._T,
	U: ImGuiKey._U,
	V: ImGuiKey._V,
	W: ImGuiKey._W,
	X: ImGuiKey._X,
	Y: ImGuiKey._Y,
	Z: ImGuiKey._Z,
	"'": ImGuiKey._Apostrophe,
	",": ImGuiKey._Comma,
	"-": ImGuiKey._Minus,
	".": ImGuiKey._Period,
	"/": ImGuiKey._Slash,
	";": ImGuiKey._Semicolon,
	"=": ImGuiKey._Equal,
	"[": ImGuiKey._LeftBracket,
	"\\": ImGuiKey._Backslash,
	"]": ImGuiKey._RightBracket,
	"`": ImGuiKey._GraveAccent,

	CapsLock: ImGuiKey._CapsLock,
	ScrollLock: ImGuiKey._ScrollLock,
	NumLock: ImGuiKey._NumLock,
	PrintScreen: ImGuiKey._PrintScreen,
	Pause: ImGuiKey._Pause,

	Tab: ImGuiKey._Tab,
	ArrowLeft: ImGuiKey._LeftArrow,
	ArrowRight: ImGuiKey._RightArrow,
	ArrowUp: ImGuiKey._UpArrow,
	ArrowDown: ImGuiKey._DownArrow,
	PageUp: ImGuiKey._PageUp,
	PageDown: ImGuiKey._PageDown,
	Home: ImGuiKey._Home,
	End: ImGuiKey._End,
	Insert: ImGuiKey._Insert,
	Delete: ImGuiKey._Delete,
	Backspace: ImGuiKey._Backspace,
	" ": ImGuiKey._Space,
	Enter: ImGuiKey._Enter,
	Escape: ImGuiKey._Escape,

	Control: ImGuiKey._LeftCtrl,
	Shift: ImGuiKey._LeftShift,
	Alt: ImGuiKey._LeftAlt,
	Super: ImGuiKey._LeftSuper,
	Meta: ImGuiKey._LeftSuper,
} as const;

/**
 * Map of browser keyboard modifier key values to ImGui key modifier enums.
 * For reference, see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key}.
 */
const KEYBOARD_MODIFIER_MAP = {
	Control: ImGuiKey.ImGuiMod_Ctrl,
	Shift: ImGuiKey.ImGuiMod_Shift,
	Alt: ImGuiKey.ImGuiMod_Alt,
	Super: ImGuiKey.ImGuiMod_Super,
	Meta: ImGuiKey.ImGuiMod_Super,
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

function setDisplayProperties(canvas: HTMLCanvasElement): void {
	const io = ImGui.GetIO();
	const clientWidth = canvas.clientWidth;
	const clientHeight = canvas.clientHeight;

	io.DisplaySize = new ImVec2(clientWidth, clientHeight);
	io.DisplayFramebufferScale = new ImVec2(
		clientWidth > 0 ? canvas.width / clientWidth : 1,
		clientHeight > 0 ? canvas.height / clientHeight : 1,
	);
}

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
			io.AddMouseButtonEvent(ImGuiMouseButton.Left, isButtonDown);
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
	io.BackendFlags = ImGuiBackendFlags.HasMouseCursors;

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
export class ImGuiImplWeb {
	/**
	 * Returns the exports and runtime methods of the emscripten module.
	 *
	 * @returns The emscripten exports object.
	 */
	static GetEmscriptenExports(): any {
		return Mod.export;
	}

	/**
	 * Returns memory information of the WASM heap, mallinfo and stack.
	 *
	 * @returns Object containing the memory information.
	 */
	static GetMemoryInfo(): MemoryInfo {
		return {
			heap: Mod.export.get_wasm_heap_info(),
			mall: Mod.export.get_wasm_mall_info(),
			stack: Mod.export.get_wasm_stack_info(),
		};
	}

	/**
	 * Set the callback for saving the Dear ImGui ini settings. The ini settings will be passed as
	 * string to the callback.
	 *
	 * @param fn The function to save the ImGui ini settings.
	 */
	static SetSaveIniSettingsFn(fn: (iniData: string) => void) {
		State.saveIniSettingsFn = fn;
	}

	/**
	 * Set the callback for loading the Dear ImGui ini settings. The callback should return a string
	 * of the ini settings. This callback will be called in the {@linkcode ImGuiImplWeb.Init}
	 * function.
	 *
	 * @param fn The function to load the ImGui ini settings.
	 */
	static SetLoadIniSettingsFn(fn: () => string) {
		State.loadIniSettingsFn = fn;
	}

	/**
	 * Register a texture for the current backend to be used in image related functions (`ImGui.Image()`).
	 */
	static RegisterTexture(texture: WebGLTexture | GPUTexture): ImTextureRef {
		if (texture instanceof WebGLTexture) {
			const id = Mod.export.GL.getNewId(Mod.export.GL.textures);
			Mod.export.GL.textures[id] = texture;
			return new ImTextureRef(id);
		}

		if (texture instanceof GPUTexture) {
			const id = Mod.export.WebGPU.importJsTextureView(texture.createView());
			return new ImTextureRef(id);
		}
	}

	/**
	 * Returns a dummy (1x1 pixel, black, fully transparent) texture for the current backend.
	 * This can be useful if you asynchronously load an image, and need to use a placeholder in the meantime.
	 */
	static DummyTexture(): ImTextureRef {
		if (State.backend === "webgl" || State.backend === "webgl2") {
			const gl = State.canvas?.getContext(State.backend as "webgl" | "webgl2") as
				| WebGLRenderingContext
				| WebGL2RenderingContext;
			const texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGBA,
				1,
				1,
				0,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				new Uint8Array([0, 0, 0, 0]),
			);

			return ImGuiImplWeb.RegisterTexture(texture);
		}

		if (State.backend === "webgpu") {
			const device = State.device as GPUDevice;
			const texture = device.createTexture({
				size: [1, 1],
				format: "rgba8unorm",
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			});
			device.queue.writeTexture({ texture }, new Uint8Array([0, 0, 0, 0]), {}, [1, 1]);

			return ImGuiImplWeb.RegisterTexture(texture);
		}
	}

	/**
	 * Load a font file to the filesystem for the current backend. Add it then using
	 * `ImGui.GetIO().Fonts.AddFontFromFileTTF(filename);`
	 * @param filename The filename of the font to load.
	 * @param fontData The font data to load.
	 */
	static LoadFont(filename: string, fontData: Uint8Array): void {
		Mod.export.FS.writeFile(filename, fontData);
	}

	/**
	 * Begins a new ImGui frame. Call this at the beginning of your render loop.
	 */
	static BeginRender() {
		setDisplayProperties(State.canvas as HTMLCanvasElement);

		if (ImGui.GetIO().WantSaveIniSettings) {
			State.saveIniSettingsFn?.(ImGui.SaveIniSettingsToMemory());
			ImGui.GetIO().WantSaveIniSettings = false;
		}

		State.beginRenderFn?.();
		ImGui.NewFrame();
	}

	/**
	 * Ends the current ImGui frame. Call this at the end of your render loop. The `passEncoder`
	 * is only required when using the WebGPU backend.
	 *
	 * @param passEncoder The WebGPU render pass encoder to use.
	 */
	static EndRender(passEncoder?: GPURenderPassEncoder) {
		ImGui.Render();
		State.endRenderFn?.(passEncoder);
	}

	/**
	 * Initialize Dear ImGui with the specified configuration. This is asynchronous because it
	 * waits for the WASM file to be loaded.
	 *
	 * @param options The initialization options: {@linkcode InitOptions}.
	 */
	static async Init(options: InitOptions): Promise<void> {
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

		if (extensions) {
			const imnodes = await import("./imnodes.js");
			const implot = await import("./implot.js");
			implot.ImPlot.CreateContext();
			imnodes.ImNodes.CreateContext();
		}

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
	}
}
