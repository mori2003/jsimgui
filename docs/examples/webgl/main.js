import { ImGui, ImGuiImplWeb, ImVec2, ImGuiCond } from "@mori2003/jsimgui";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2") || canvas.getContext("webgl");

await ImGuiImplWeb.Init({ canvas });

const img = new Image();
img.crossOrigin = "anonymous";
img.src = "https://upload.wikimedia.org/wikipedia/commons/2/25/WebGL_Logo.svg";

let imgRef = ImGuiImplWeb.DummyTexture();
img.onload = () => {
	const gl = context;
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

	imgRef = ImGuiImplWeb.RegisterTexture(texture);
};

function frame() {
	canvas.width = canvas.clientWidth * window.devicePixelRatio;
	canvas.height = canvas.clientHeight * window.devicePixelRatio;

	ImGuiImplWeb.BeginRender();

	ImGui.Begin("New Window");
	ImGui.Text("Hello, world!");
	ImGui.End();

	ImGui.SetNextWindowPos(new ImVec2(225, 50), ImGuiCond.Once);
	ImGui.SetNextWindowSize(new ImVec2(330, 200), ImGuiCond.Once);
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
