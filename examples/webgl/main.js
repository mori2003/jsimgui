import { ImEnum, ImGui, ImGuiImplWeb, ImVec2, ImVec4 } from "@mori2003/jsimgui";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2");

if (!context) throw new Error("Your browser does not support WebGL2.");

const devicePixelRatio = globalThis.devicePixelRatio;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;

await ImGuiImplWeb.Init(canvas);

const style = ImGui.GetStyle();
style.WindowRounding = 7;

const color = [0.0, 0.5, 0.5];
const showDemo = [true];
const docking = [false];

let code = [`ImGui.SetNextWindowPos(new ImVec2(450, 200), ImEnum.Cond.Once);
ImGui.SetNextWindowSize(new ImVec2(330, 125), ImEnum.Cond.Once);
ImGui.Begin("New Window");
ImGui.Text("Hello, World!");
ImGui.End();`];
let evalCode = "";

function frame() {
    ImGuiImplWeb.BeginRender();

    ImGui.SetNextWindowPos(new ImVec2(10, 10), ImEnum.Cond.Once);
    ImGui.SetNextWindowSize(new ImVec2(330, 125), ImEnum.Cond.Once);
    ImGui.Begin("Three.js");

    ImGui.Text("Welcome to jsimgui!");
    ImGui.SameLine();
    if (ImGui.TextLink("(Source Code)")) {
        globalThis.open("https://github.com/mori2003/jsimgui/", "_self");
    }
    ImGui.Spacing();
    ImGui.Text("Also see the other examples:");
    ImGui.Bullet();
    if (ImGui.TextLink("Three.js")) {
        globalThis.open("https://mori2003.github.io/jsimgui/examples/threegl/", "_self");
    }
    ImGui.SameLine();
    ImGui.Text("(WebGL2 Renderer)");
    ImGui.Spacing();
    ImGui.Checkbox("Show ImGui Demo", showDemo);
    ImGui.SameLine();
    if (ImGui.Checkbox("Enable Docking", docking)) {
        if (docking[0]) {
            const io = ImGui.GetIO();
            io.ConfigFlags |= ImEnum.ConfigFlags.DockingEnable;
        } else {
            const io = ImGui.GetIO();
            io.ConfigFlags &= ~ImEnum.ConfigFlags.DockingEnable;
        }
    }
    ImGui.End();

    ImGui.SetNextWindowPos(new ImVec2(10, 150), ImEnum.Cond.Once);
    ImGui.SetNextWindowSize(new ImVec2(400, 300), ImEnum.Cond.Once);
    ImGui.Begin("Playground");
    ImGui.ColorEdit3("clearColor", color);
    ImGui.Text("JavaScript Playground");
    ImGui.SameLine();
    ImGui.TextColored(new ImVec4(1, 1, 0, 1), "(Called every frame!)");
    ImGui.InputTextMultiline("##code", code, 256, new ImVec2(-1, 0), 0);
    if (ImGui.Button("Run Code")) {
        evalCode = code[0];
    }
    ImGui.End();

    eval(evalCode);

    if (showDemo[0]) ImGui.ShowDemoWindow(showDemo);

    context.clearColor(color[0], color[1], color[2], 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    ImGuiImplWeb.EndRender();

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
