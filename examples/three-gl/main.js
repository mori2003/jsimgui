// deno-lint-ignore-file
import {
    ImEnum,
    ImGui,
    ImGuiImplOpenGL3,
    ImGuiImplWeb,
    ImVec2,
    ImVec4,
} from "@mori2003/jsimgui";
import * as THREE from "three";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2");

if (!context) throw new Error("Your browser does not support WebGL2.");

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(1, 2, -3);
camera.lookAt(0, 1, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(-3, 10, -10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x313833 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }),
);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

globalThis.addEventListener("resize", onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

await ImGuiImplWeb.Init(canvas);

const cubeColor = [0.0, 0.0, 0.5];
const cubeRotation = [45, 45, 45];
const cubePosition = [0, 1, 0];
const showDemo = [false];

function frame() {
    ImGuiImplOpenGL3.NewFrame();
    ImGui.NewFrame();

    ImGui.SetNextWindowPos(new ImVec2(10, 10), ImEnum.Cond.Once);
    ImGui.SetNextWindowSize(new ImVec2(330, 250), ImEnum.Cond.Once);
    ImGui.Begin("Three.js");

    ImGui.SliderFloat3("Cube Rotation", cubeRotation, -360, 360);
    ImGui.SliderFloat3("Cube Position", cubePosition, -2, 2);
    ImGui.ColorEdit3("Cube Color", cubeColor);
    cube.rotation.x = THREE.MathUtils.degToRad(cubeRotation[0]);
    cube.rotation.y = THREE.MathUtils.degToRad(cubeRotation[1]);
    cube.rotation.z = THREE.MathUtils.degToRad(cubeRotation[2]);
    cube.position.set(cubePosition[0], cubePosition[1], cubePosition[2]);
    cube.material.color.set(cubeColor[0], cubeColor[1], cubeColor[2]);

    ImGui.Separator();
    ImGui.Checkbox("Show Demo", showDemo);

    ImGui.End();

    if (showDemo[0]) ImGui.ShowDemoWindow(showDemo);

    renderer.render(scene, camera);
    renderer.resetState();

    ImGui.Render();
    ImGuiImplOpenGL3.RenderDrawData(ImGui.GetDrawData());
}
renderer.setAnimationLoop(frame);
