import { ImGui, ImGuiImplWeb, ImVec2 } from "@mori2003/jsimgui";

const app = new PIXI.Application();

await app.init({ background: "#1099bb", resizeTo: window });

document.querySelector("main").appendChild(app.canvas);

await ImGuiImplWeb.Init({ canvas: app.canvas });

const texture = await PIXI.Assets.load("bunny.png");
const bunny = new PIXI.Sprite(texture);

bunny.anchor.set(0.5);

app.stage.addChild(bunny);

const data = {
    rotationSpeed: [0.1],
    scale: [1],
    position: {
        x: [app.screen.width / 2],
        y: [app.screen.height / 2],
    },
    showDemo: [false],
};

// Remove the default render loop
app.ticker.remove(app.render, app);

app.ticker.add((time) => {
    bunny.rotation += data.rotationSpeed[0] * time.deltaTime;
    bunny.position.set(data.position.x[0], data.position.y[0]);
    bunny.scale.set(data.scale[0]);

    ImGuiImplWeb.BeginRender();

    ImGui.SetNextWindowSize(new ImVec2(400, 200), ImGui.Cond.Once);
    ImGui.Begin("PixiJS");
    ImGui.SliderFloat("rotationSpeed", data.rotationSpeed, 0, 1);
    ImGui.SliderFloat("bunny.scale", data.scale, 0, 5);
    ImGui.SliderFloat("bunny.position.x", data.position.x, 0, app.screen.width);
    ImGui.SliderFloat("bunny.position.y", data.position.y, 0, app.screen.height);
    ImGui.Checkbox("showDemo", data.showDemo);
    ImGui.End();

    if (data.showDemo[0]) ImGui.ShowDemoWindow(data.showDemo);

    app.render();
    app.renderer.resetState();

    ImGuiImplWeb.EndRender();
});
