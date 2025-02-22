import { ImGui, ImGuiImplWeb, ImGuiImplOpenGL3, ImVec2, ImVec4 } from "@mori2003/jsimgui";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2");

if (!context) throw new Error("Your browser does not support WebGL2.");

const devicePixelRatio = globalThis.devicePixelRatio;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;

await ImGuiImplWeb.Init(canvas);


const imgJsLogo = new Image();
imgJsLogo.src = "javascript.png";
const jsLogo = await ImGuiImplWeb.LoadImage(canvas, imgJsLogo);

const imgWasmLogo = new Image();
imgWasmLogo.crossOrigin = "anonymous";
imgWasmLogo.src =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/WebAssembly_Logo.svg/2048px-WebAssembly_Logo.svg.png";
const wasmLogo = await ImGuiImplWeb.LoadImage(canvas, imgWasmLogo);

const color = [0.0, 0.5, 0.5];
const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const showDemo = [true];
const docking = [false];
//const inputText = ["Hello, World!"];

function frame() {
    ImGuiImplWeb.BeginRender();

    ImGui.SetNextWindowPos(new ImVec2(10, 10), ImGui.Cond.Once);
    ImGui.SetNextWindowSize(new ImVec2(330, 125), ImGui.Cond.Once);



    ImGui.Begin("jsimgui");
    ImGui.Text("JavaScript bindings for Dear ImGui");
    ImGui.Image(jsLogo, new ImVec2(50, 50));
    ImGui.SameLine();
    ImGui.Image(wasmLogo, new ImVec2(50, 50));
    if (ImGui.Button("Click me")) {
        console.log("Button clicked!");
    }


    //ImGui.PlotLines("My Plot", data, data.length);
    //ImGui.InputText("Input Text", inputText);
    ImGui.End();

    if (showDemo[0]) {
        ImGui.ShowDemoWindow(showDemo);
    }

    context.clearColor(color[0], color[1], color[2], 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    ImGuiImplWeb.EndRender();
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
