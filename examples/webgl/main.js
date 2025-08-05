import {
    ImEnum,
    ImGui,
    ImGuiImplOpenGL3,
    ImGuiImplWeb,
    ImGuiIO,
    ImVec2,
    ImVec4,
} from "@mori2003/jsimgui";

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
const v = [1, 2, 3];
const showDemo = [true];

function frame() {
    ImGuiImplOpenGL3.NewFrame();
    ImGui.NewFrame();

    ImGui.Begin("JsImGui");
    ImGui.Text("Hello from JS!");
    ImGui.ColorEdit3("clearColor", color);
    ImGui.Checkbox("Show Demo", showDemo);
    ImGui.End();

    if (showDemo[0]) ImGui.ShowDemoWindow(showDemo);
    //console.log(showDemo);
    //show[0] = false;

    // ImGui.SetNextWindowPos(new ImVec2(10, 10), ImEnum.Cond.Once);
    // ImGui.SetNextWindowSize(new ImVec2(330, 250), ImEnum.Cond.Once);
    // ImGui.Begin("Example Window", ref);

    // ImGui.Text("Normal Text");
    // ImGui.TextColored(new ImVec4(1, 0, 0, 1), "Colored Text");
    // ImGui.LabelText("Label", `${new Date().toLocaleTimeString()}`);
    // ImGui.BulletText("Bullet Text");
    // ImGui.SeparatorText("Separator");

    // if (ImGui.Button("Button")) {
    //     alert("Button pressed!");
    // }

    // ImGui.Checkbox("Show Demo", showDemo);


    // ImGui.End();

    // if (showDemo.value) ImGui.ShowDemoWindow(showDemo);

    context.clearColor(color[0], color[1], color[2], 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    ImGui.Render();
    ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
