import { Mod } from "../core.js";
import { type ImDrawData, ImTextureRef } from "../imgui.js";
import type { TextureOptions } from "./web.js";

export const ImGuiImplOpenGL3 = {
    Init(): boolean {
        return Mod.export.cImGui_ImplOpenGL3_Init();
    },

    Shutdown(): void {
        Mod.export.cImGui_ImplOpenGL3_Shutdown();
    },

    NewFrame(): void {
        Mod.export.cImGui_ImplOpenGL3_NewFrame();
    },

    RenderDrawData(draw_data: ImDrawData): void {
        Mod.export.cImGui_ImplOpenGL3_RenderDrawData(draw_data.ptr);
    },
};

export function loadTextureWebGL(
    glContext: WebGLRenderingContext | WebGL2RenderingContext,
    data?: HTMLImageElement | Uint8Array,
    options: TextureOptions = {},
): ImTextureRef {
    const gl = glContext;

    const processTexture = () => {
        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        if (!data) {
            const data = new Uint8Array([0, 0, 0, 0]);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        }

        if (data instanceof HTMLImageElement) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
        }

        if (data instanceof Uint8Array) {
            const width = options.width ?? 1;
            const height = options.height ?? 1;
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                width,
                height,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                data,
            );
        }

        return texture;
    };

    const texture = options.processFn
        ? (options.processFn(data, options) as WebGLTexture)
        : processTexture();

    const id = Mod.export.GL.getNewId(Mod.export.GL.textures);
    Mod.export.GL.textures[id] = texture;

    if (options.ref) {
        options.ref._TexID = id;
        return options.ref;
    }

    return new ImTextureRef(id);
}
