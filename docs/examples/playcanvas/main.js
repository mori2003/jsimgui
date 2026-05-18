import { ImGui, ImGuiImplWeb, ImVec2, ImGuiCond } from "@mori2003/jsimgui";
import { Application, Color, Entity, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO } from "playcanvas";

const canvas = document.querySelector("#render-canvas");

const app = new Application(canvas);

app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
app.setCanvasResolution(RESOLUTION_AUTO);
app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;

window.addEventListener("resize", () => app.resizeCanvas());

await ImGuiImplWeb.Init({ canvas });

const box = new Entity("cube");
box.addComponent("render", {
	type: "box",
});
app.root.addChild(box);

const camera = new Entity("camera");
camera.addComponent("camera", {
	clearColor: new Color(0.1, 0.2, 0.3),
});
app.root.addChild(camera);
camera.setPosition(0, 0, 3);

const light = new Entity("light");
light.addComponent("light");
app.root.addChild(light);
light.setEulerAngles(45, 0, 0);

const data = {
	rotationSpeed: {
		x: [10],
		y: [20],
		z: [30],
	},
	clearColor: [0.1, 0.2, 0.3],
	showDemo: [false],
};

app.on("update", (dt) => {
	box.rotate(
		data.rotationSpeed.x[0] * dt,
		data.rotationSpeed.y[0] * dt,
		data.rotationSpeed.z[0] * dt,
	);
	camera.camera.clearColor = new Color(data.clearColor[0], data.clearColor[1], data.clearColor[2]);
});

app.on("prerender", () => {
	app.graphicsDevice.initializeContextCaches();
});

app.on("postrender", () => {
	const gl = app.graphicsDevice.gl;
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, canvas.width, canvas.height);

	ImGuiImplWeb.BeginRender();

	ImGui.SetNextWindowSize(new ImVec2(400, 200), ImGuiCond.Once);
	ImGui.Begin("PlayCanvas");
	ImGui.SliderFloat("box.rotation.x", data.rotationSpeed.x, 0, 100);
	ImGui.SliderFloat("box.rotation.y", data.rotationSpeed.y, 0, 100);
	ImGui.SliderFloat("box.rotation.z", data.rotationSpeed.z, 0, 100);
	ImGui.ColorEdit3("camera.clearColor", data.clearColor);
	ImGui.Checkbox("showDemo", data.showDemo);
	ImGui.End();

	if (data.showDemo[0]) ImGui.ShowDemoWindow(data.showDemo);

	ImGuiImplWeb.EndRender();
});

app.start();
