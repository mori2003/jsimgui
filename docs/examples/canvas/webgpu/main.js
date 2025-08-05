import { ImGui, ImGuiImplWeb } from "@mori2003/jsimgui";
import { showJsimguiDemo } from "../demo.js";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgpu");

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();

context.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
});

await ImGuiImplWeb.Init({
    canvas,
    device,
    enableDemos: true,
});

const frame = () => {
    ImGuiImplWeb.BeginRender();

    ImGui.Begin("New Window");
    ImGui.Text("Hello, world!");
    ImGui.End();

    showJsimguiDemo(context);

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
};
requestAnimationFrame(frame);
