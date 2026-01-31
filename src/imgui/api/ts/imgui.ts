import { ReferenceStruct, ValueStruct } from "./core.js";

// biome-ignore lint/suspicious/noExplicitAny: _
export const ImGui: any = {};

export class ImGuiIO extends ReferenceStruct {
    // biome-ignore lint/correctness/noUnusedFunctionParameters: _
    AddMouseButtonEvent(button: number, down: boolean): void {}
    // biome-ignore lint/correctness/noUnusedFunctionParameters: _
    AddMousePosEvent(x: number, y: number): void {}
    // biome-ignore lint/correctness/noUnusedFunctionParameters: _
    AddMouseWheelEvent(x: number, y: number): void {}
    // biome-ignore lint/correctness/noUnusedFunctionParameters: _
    AddKeyEvent(key: number, down: boolean): void {}
    // biome-ignore lint/correctness/noUnusedFunctionParameters: _
    AddInputCharactersUTF8(chars: string): void {}
    // biome-ignore lint/correctness/noUnusedFunctionParameters: _
    SetDisplaySize(size: ImVec2): void {}
    // biome-ignore lint/correctness/noUnusedFunctionParameters: _
    SetMousePosition(pos: ImVec2): void {}
    // biome-ignore lint/correctness/noUnusedFunctionParameters: _
    SetMouseButtonDown(button: number, down: boolean): void {}
}

export class ImTextureRef extends ValueStruct {
    _TexID: number;

    constructor(id: number) {
        super();
        this._TexID = id;
    }
}

export class ImDrawData extends ReferenceStruct {}

export class ImVec2 extends ValueStruct {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
}
