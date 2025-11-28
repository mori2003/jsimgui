import { ImGui, ImGuiImplWeb, ImVec2 } from "@mori2003/jsimgui";

const canvas = document.getElementById("render-canvas");
const engine = new BABYLON.Engine(canvas, true);

await ImGuiImplWeb.Init({
    canvas,
    enableDemos: true,
});

const data = {
    lightIntensity: [0.7],
    spherePosition: {
        x: [0],
        y: [1],
        z: [0],
    },
    showDemo: [false],
}

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = data.lightIntensity[0];

    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    sphere.position.set(data.spherePosition.x[0], data.spherePosition.y[0], data.spherePosition.z[0]);

    BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    return scene;
};

const scene = createScene();
scene.detachControl();

engine.runRenderLoop(() => {
    scene.lights[0].intensity = data.lightIntensity[0];
    scene.meshes[0].position.set(data.spherePosition.x[0], data.spherePosition.y[0], data.spherePosition.z[0]);

    ImGuiImplWeb.BeginRender();

    ImGui.SetNextWindowSize(new ImVec2(400, 200), ImGui.Cond.Once);
    ImGui.Begin("BabylonJS");
    ImGui.SliderFloat("light.intensity", data.lightIntensity, 0, 1);
    ImGui.SliderFloat("sphere.position.x", data.spherePosition.x, -2, 2);
    ImGui.SliderFloat("sphere.position.y", data.spherePosition.y, -2, 2);
    ImGui.SliderFloat("sphere.position.z", data.spherePosition.z, -2, 2);
    if (ImGui.Button("Reset Sphere")) {
        data.spherePosition.x[0] = 0;
        data.spherePosition.y[0] = 1;
        data.spherePosition.z[0] = 0;
    }
    ImGui.Checkbox("showDemo", data.showDemo);
    ImGui.End();

    if (data.showDemo[0]) ImGui.ShowDemoWindow(data.showDemo);

    engine.wipeCaches(true);
    scene.render();

    ImGuiImplWeb.EndRender();
});

window.addEventListener("resize", () => {
    engine.resize();
});
