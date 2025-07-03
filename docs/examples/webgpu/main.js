import {  ImGui, ImGuiImplWeb, ImVec2, ImTextureRef } from "@mori2003/jsimgui";

const canvas = document.querySelector("#render-canvas");

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();
const context = canvas.getContext("webgpu");

if (!context || !adapter) throw new Error("Does your browser support WebGPU?");

const devicePixelRatio = globalThis.devicePixelRatio;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

context.configure({
    device,
    format: presentationFormat,
});

await ImGuiImplWeb.InitWebGPU(canvas, device);

const imgWGPULogo = new Image();
imgWGPULogo.src = "webgpu.svg";
const wgpuLogo = await ImGuiImplWeb.LoadImageWebGPU(device, imgWGPULogo);

function frame() {
    ImGuiImplWeb.BeginRenderWebGPU();

    ImGui.Begin("WebGPU");
    ImGui.Text("Lorem ipsum dolor sit amet");
    ImGui.Image(new ImTextureRef(wgpuLogo), new ImVec2(120, 100));
    ImGui.End();

    ImGui.ShowDemoWindow();

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor = {
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.2, g: 0.4, b: 0.6, a: 1.0 },
            loadOp: 'clear',
            storeOp: 'store',
        }]

    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    ImGuiImplWeb.EndRenderWebGPU(passEncoder);

    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
