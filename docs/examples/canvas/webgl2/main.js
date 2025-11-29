import { ImGui, ImGuiImplWeb } from "@mori2003/jsimgui";
import { showJsimguiDemo } from "../demo.js";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

await ImGuiImplWeb.Init({
    canvas,
    enableDemos: true,
});

const frame = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
