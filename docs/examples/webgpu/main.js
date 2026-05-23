import { ImGui, ImGuiImplWeb, ImVec2, ImGuiCond } from "@mori2003/jsimgui";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgpu");

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();

context.configure({
	device,
	format: navigator.gpu.getPreferredCanvasFormat(),
});

await ImGuiImplWeb.Init({ canvas, device });

const img = new Image();
img.crossOrigin = "anonymous";
img.src = "https://upload.wikimedia.org/wikipedia/commons/2/2f/WebGPU_logo.svg";

let imgRef = ImGuiImplWeb.DummyTexture();
img.onload = () => {
	const texture = device.createTexture({
		size: [img.width, img.height],
		format: "rgba8unorm",
		usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
	});
	device.queue.copyExternalImageToTexture({ source: img }, { texture }, [img.width, img.height]);

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
	ImGui.Image(imgRef, new ImVec2(120, 110));
	ImGui.Text("Using WebGPU backend");
	ImGui.End();

	ImGui.ShowDemoWindow();

	const commandEncoder = device.createCommandEncoder();
	const textureView = context.getCurrentTexture().createView();

	const renderPassDescriptor = {
		colorAttachments: [
			{
				view: textureView,
				clearValue: { r: 0.2, g: 0.4, b: 0.6, a: 1.0 },
				loadOp: "clear",
				storeOp: "store",
			},
		],
	};

	const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

	ImGuiImplWeb.EndRender(passEncoder);

	passEncoder.end();

	device.queue.submit([commandEncoder.finish()]);

	requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
