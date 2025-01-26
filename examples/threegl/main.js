// deno-lint-ignore-file
import { ImEnum, ImGui, ImGuiImplWeb, ImVec2 } from "@mori2003/jsimgui";
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

const style = ImGui.GetStyle();
style.WindowRounding = 7;

export const showDemo = [false];
export const docking = [false];

const stopRotation = [false];
const cubeColor = [0.0, 0.0, 0.5];
const cubeRotation = [45, 45, 45];
const cubePosition = [0, 1, 0];

function frame() {
    ImGuiImplWeb.BeginRender();

    ImGui.SetNextWindowPos(new ImVec2(10, 10), ImEnum.Cond.Once);
    ImGui.SetNextWindowSize(new ImVec2(330, 125), ImEnum.Cond.Once);
    ImGui.Begin("Three.js");

    ImGui.Text("Welcome to jsimgui!");
    ImGui.SameLine();
    if (ImGui.TextLink("(Source Code)")) {
        globalThis.open("https://github.com/mori2003/jsimgui/", "_self");
    }
    ImGui.Spacing();
    ImGui.Text("Also see the other examples:");
    ImGui.Bullet();
    if (ImGui.TextLink("WebGL2")) {
        globalThis.open("https://mori2003.github.io/jsimgui/examples/webgl/", "_self");
    }
    ImGui.SameLine();
    ImGui.Text("(Clear Canvas)");
    ImGui.Spacing();
    ImGui.Checkbox("Show ImGui Demo", showDemo);
    ImGui.SameLine();
    if (ImGui.Checkbox("Enable Docking", docking)) {
        if (docking[0]) {
            const io = ImGui.GetIO();
            io.ConfigFlags |= ImEnum.ConfigFlags.DockingEnable;
        } else {
            const io = ImGui.GetIO();
            io.ConfigFlags &= ~ImEnum.ConfigFlags.DockingEnable;
        }
    }
    ImGui.End();

    ImGui.SetNextWindowPos(new ImVec2(10, 150), ImEnum.Cond.Once);
    ImGui.SetNextWindowSize(new ImVec2(400, 500), ImEnum.Cond.Once);
    ImGui.Begin("Playground");

    if (!stopRotation[0]) {
        cubeRotation[0] += 0.3;
        cubeRotation[1] += 0.3;
        cubeRotation[2] += 0.3;

        if (cubeRotation[0] > 360) cubeRotation[0] = 0;
        if (cubeRotation[1] > 360) cubeRotation[1] = 0;
        if (cubeRotation[2] > 360) cubeRotation[2] = 0;
    }

    ImGui.Checkbox("Stop Rotation", stopRotation);
    ImGui.SliderFloat3("cube.rotation", cubeRotation, 0, 360);
    ImGui.SliderFloat3("cube.position", cubePosition, -2, 2);
    ImGui.ColorPicker3("cube.material.color", cubeColor);

    cube.rotation.x = THREE.MathUtils.degToRad(cubeRotation[0]);
    cube.rotation.y = THREE.MathUtils.degToRad(cubeRotation[1]);
    cube.rotation.z = THREE.MathUtils.degToRad(cubeRotation[2]);
    cube.position.set(cubePosition[0], cubePosition[1], cubePosition[2]);
    cube.material.color.set(cubeColor[0], cubeColor[1], cubeColor[2]);
    ImGui.End();

    if (showDemo[0]) ImGui.ShowDemoWindow(showDemo);

    renderer.render(scene, camera);
    renderer.resetState();

    ImGuiImplWeb.EndRender();
}
renderer.setAnimationLoop(frame);
