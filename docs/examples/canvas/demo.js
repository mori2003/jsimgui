import { ImGui, ImGuiImplWeb, ImVec2 } from "@mori2003/jsimgui";

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
    if (!showJsimguiDemo.imgBackendRef) {
        showJsimguiDemo.imgBackendRef = ImGuiImplWeb.LoadTexture();
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
            showJsimguiDemo.imgBackendRef = ImGuiImplWeb.LoadTexture(imgBackend, {
                ref: showJsimguiDemo.imgBackendRef,
            });
        };
    }

    const imgBackendRef = showJsimguiDemo.imgBackendRef;
    ImGui.Image(imgBackendRef, new ImVec2(120, backend === "WebGPU" ? 100 : 50));
    ImGui.Text(`Using ${backend} backend`);

    ImGui.End();
};
