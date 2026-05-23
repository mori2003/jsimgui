import { ImGui, ImGuiImplWeb, ImVec2, ImGuiCond } from "@mori2003/jsimgui";
import * as THREE from "three";

const canvas = document.querySelector("#render-canvas");
canvas.style.backgroundColor = "black";

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1ea8e4);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const color = 0xffffff;
const intensity = 5;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
globalThis.addEventListener("resize", onWindowResize);

await ImGuiImplWeb.Init({ canvas });

const sceneRenderTarget = new THREE.WebGLRenderTarget(512, 512);
renderer.setRenderTarget(sceneRenderTarget);
renderer.render(scene, camera);
const textureProperties = renderer.properties.get(sceneRenderTarget.texture);
const sceneTextureRef = ImGuiImplWeb.RegisterTexture(textureProperties.__webglTexture);

function frame() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.02;

	renderer.setRenderTarget(sceneRenderTarget);
	renderer.render(scene, camera);
	renderer.setRenderTarget(null);

	ImGuiImplWeb.BeginRender();

	ImGui.SetNextWindowSize(new ImVec2(512, 256), ImGuiCond.Once);
	ImGui.Begin("Scene");
	const size = ImGui.GetContentRegionAvail();
	ImGui.Image(sceneTextureRef, size);
	ImGui.End();

	ImGui.ShowDemoWindow();
	renderer.resetState();

	ImGuiImplWeb.EndRender();
}
renderer.setAnimationLoop(frame);
