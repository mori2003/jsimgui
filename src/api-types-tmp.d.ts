// -------------------------------------------------------------------------------------------------
// NOTE: This file just provides temporary types for the api.ts file in order to suppress some
// linter warnings and errors.
// -------------------------------------------------------------------------------------------------

declare type ImTextureID = bigint | number;
declare type ImGuiBackendFlags = number;
declare type ImGuiKey = number;
declare type ImGuiMouseButton = number;
declare type ImGuiMouseCursor = number;

declare class StructBinding {
    _ptr: number;
}

declare class ImDrawData {
    _ptr: number;
}

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
