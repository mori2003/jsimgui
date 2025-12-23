import { ImGui, ImGuiImplWeb, ImTextureRef, ImVec2 } from "@mori2003/jsimgui";

export const showJsimguiDemo = (context) => {
    ImGui.SetNextWindowPos(new ImVec2(225, 50), ImGui.Cond.Once);
    ImGui.SetNextWindowSize(new ImVec2(330, 200), ImGui.Cond.Once);
    ImGui.Begin("jsimgui");

    ImGui.Text("Welcome to jsimgui!");
    ImGui.TextDisabled(`Using ImGui v${ImGui.GetVersion()}-docking`);

    ImGui.Spacing();

    const backend =
        context instanceof WebGLRenderingContext
            ? "WebGL"
            : context instanceof WebGL2RenderingContext
              ? "WebGL2"
              : "WebGPU";

    // Run once
    if (!showJsimguiDemo.imgBackendId) {
        showJsimguiDemo.imgBackendId = ImGuiImplWeb.LoadTexture();
        const imgBackend = new Image();
        imgBackend.crossOrigin = "anonymous";

        if (backend === "WebGL" || backend === "WebGL2") {
            imgBackend.src =
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/WebGL_Logo.svg/1200px-WebGL_Logo.svg.png";
        }

        if (backend === "WebGPU") {
            imgBackend.src = "https://upload.wikimedia.org/wikipedia/commons/2/2f/WebGPU_logo.svg";
        }

        imgBackend.onload = () => {
            showJsimguiDemo.imgBackendId = ImGuiImplWeb.LoadTexture(imgBackend, {
                id: showJsimguiDemo.imgBackendId,
            });
        };
    }

    const imgBackendId = showJsimguiDemo.imgBackendId;
    ImGui.Image(new ImTextureRef(imgBackendId), new ImVec2(120, backend === "WebGPU" ? 100 : 50));
    ImGui.Text(`Using ${backend} backend`);

    ImGui.End();
};
