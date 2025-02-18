import { Mod, ImEnum, ImGui, ImGuiImplWeb, ImVec2, ImVec4 } from "@mori2003/jsimgui";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2");

if (!context) throw new Error("Your browser does not support WebGL2.");

const devicePixelRatio = globalThis.devicePixelRatio;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;

await ImGuiImplWeb.Init(canvas);



// const io = ImGui.GetIO();
// await ImGuiImplWeb.LoadFont("inter-regular.ttf");
// io.Fonts.AddFontDefault();
// io.Fonts.AddFontFromFileTTF("inter-regular.ttf", 16, null);
//console.log(io.Fonts.GetGlyphRangesDefault());


// const imgJsLogo = new Image();
// imgJsLogo.src = "javascript.png";
// const texJsLogo = await ImGuiImplWeb.LoadImage(imgJsLogo);

// const imgWasmLogo = new Image();
// imgWasmLogo.crossOrigin = "anonymous";
// imgWasmLogo.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/WebAssembly_Logo.svg/2048px-WebAssembly_Logo.svg.png";
// const texWasmLogo = await ImGuiImplWeb.LoadImage(imgWasmLogo);

const color = [0.0, 0.5, 0.5];
const showDemo = [true];
const docking = [false];


console.log(ImGui.GetVersion());

function frame() {
    ImGuiImplWeb.BeginRender();

    ImGui.SetNextWindowPos(new ImVec2(10, 10), ImEnum.Cond.Once);
    ImGui.SetNextWindowSize(new ImVec2(330, 125), ImEnum.Cond.Once);
    ImGui.Begin("WebGL", new ImVec2(10, 10), 0);
    ImGui.Button("Hello, World!");

    ImGui.Text("Hello, World!");
    ImGui.TextColored(new ImVec4(1.0, 0.0, 0.0, 1.0), "Hello, World!");
    ImGui.TextDisabled("Hello, World!");
    ImGui.TextWrapped("Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World!");
    ImGui.LabelText("Hello, World!", "Hello, World!");
    ImGui.BulletText("Hello, World!");
    ImGui.SeparatorText("Hello, World!");
    ImGui.End();

    context.clearColor(color[0], color[1], color[2], 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    ImGuiImplWeb.EndRender();

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
