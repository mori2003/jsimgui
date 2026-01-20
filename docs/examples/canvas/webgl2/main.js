import { ImGui, ImGuiImplWeb } from "@mori2003/jsimgui";
import { showJsimguiDemo } from "../demo.js";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2");

await ImGuiImplWeb.Init({ canvas });

const frame = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ImGuiImplWeb.BeginRender();

    ImGui.Begin("New Window");
    ImGui.Text("Hello, world!");
    ImGui.End();

    showJsimguiDemo(context);

    ImGui.ShowDemoWindow();

    context.clearColor(0.2, 0.4, 0.6, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    ImGuiImplWeb.EndRender();

    requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
