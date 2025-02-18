/** Web implementation of Jsimgui. */
export const ImGuiImplWeb = {
    /** Initialize Dear ImGui on the given canvas. Only WebGL2 is supported. */
    async Init(canvas: HTMLCanvasElement): Promise<void> {
        const canvasContext = canvas.getContext("webgl2");
        if (!(canvasContext && canvasContext instanceof WebGL2RenderingContext)) {
            throw new Error("Failed to get WebGL2 context.");
        }

        await Mod.Init();

        //ImGui.CreateContext(null);
        //ImGuiImplWeb.SetupIO(canvas);
    },
};
