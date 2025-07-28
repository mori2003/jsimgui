// This file is just for providing types in the api.ts file.

declare type ImTextureID = bigint;
declare type ImGuiBackendFlags = number;
declare type ImGuiKey = number;
declare type ImGuiMouseButton = number;
declare type ImGuiMouseCursor = number;

declare class ImDrawData {}

declare class ImVec2 {
	constructor(x: number, y: number);
	x: number;
	y: number;
}

declare class ImVec4 {
	constructor(x: number, y: number, z: number, w: number);
	x: number;
	y: number;
	z: number;
	w: number;
}

declare class ImGuiIO {
	DisplaySize: ImVec2;
	DisplayFramebufferScale: ImVec2;
	WantTextInput: boolean;
	WantCaptureMouse: boolean;
	WantCaptureKeyboard: boolean;
	BackendFlags: ImGuiBackendFlags;

	AddKeyEvent(key: ImGuiKey, down: boolean): void;
	AddInputCharactersUTF8(characters: string): void;
	AddMousePosEvent(x: number, y: number): void;
	AddMouseButtonEvent(button: ImGuiMouseButton, down: boolean): void;
	AddMouseWheelEvent(x: number, y: number): void;
	AddMouseViewportEvent(viewport_id: number): void;
	AddFocusEvent(focused: boolean): void;
}

declare const ImGui: {
	Key: any;
	MouseButton: any;
	MouseCursor: any;
	BackendFlags: any;

	GetIO(): ImGuiIO;
	GetMouseCursor(): ImGuiMouseCursor;
	NewFrame(): void;
	Render(): void;
	CreateContext(): void;
	GetDrawData(): ImDrawData;
};

declare interface CppStruct {
	foo: number;
}

declare interface EmscriptenExports {
	foo: number;
}
