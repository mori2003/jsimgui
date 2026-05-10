import { ImGui, ImGuiImplWeb, ImVec2 } from "@mori2003/jsimgui";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2") || canvas.getContext("webgl");

await ImGuiImplWeb.Init({ canvas });

const img = new Image();
img.crossOrigin = "anonymous";
img.src = "https://upload.wikimedia.org/wikipedia/commons/2/25/WebGL_Logo.svg";

let imgRef = ImGuiImplWeb.LoadTexture();
img.onload = () => {
	imgRef = ImGuiImplWeb.LoadTexture(img);
};

function frame() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	ImGuiImplWeb.BeginRender();

	ImGui.Begin("New Window");
	ImGui.Text("Hello, world!");
	ImGui.End();

	ImGui.SetNextWindowPos(new ImVec2(225, 50), ImGui.Cond.Once);
	ImGui.SetNextWindowSize(new ImVec2(330, 200), ImGui.Cond.Once);
	ImGui.Begin("jsimgui");
	ImGui.Text("Welcome to jsimgui!");
	ImGui.TextDisabled(`Using ImGui v${ImGui.GetVersion()}-docking`);
	ImGui.Image(imgRef, new ImVec2(120, 50));
	ImGui.Text("Using WebGL/WebGL2 backend");
	ImGui.End();

	ImGui.ShowDemoWindow();

	context.clearColor(0.2, 0.4, 0.6, 1.0);
	context.clear(context.COLOR_BUFFER_BIT);

	ImGuiImplWeb.EndRender();

	requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
