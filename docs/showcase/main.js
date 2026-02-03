// WIP

import { ImGui, ImGuiImplWeb, ImNodes, ImVec2, ImVec4 } from "@mori2003/jsimgui";


const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2");

await ImGuiImplWeb.Init({
    canvas,
    extensions: true,
});


ImNodes.CreateContext();

const imnodesIO = ImNodes.GetIO();
const imnodesStyle = ImNodes.GetStyle();
const imnodesData = {
    altMouseButton: [imnodesIO.AltMouseButton],
    autoPanningSpeed: [imnodesIO.AutoPanningSpeed],

    gridSpacing: [imnodesStyle.GridSpacing],
    nodeCornerRounding: [imnodesStyle.NodeCornerRounding],
    nodePadding: [imnodesStyle.NodePadding],
    nodeBorderThickness: [imnodesStyle.NodeBorderThickness],
    linkThickness: [imnodesStyle.LinkThickness],
    linkLineSegmentsPerLength: [imnodesStyle.LinkLineSegmentsPerLength],
    linkHoverDistance: [imnodesStyle.LinkHoverDistance],
    pinCircleRadius: [imnodesStyle.PinCircleRadius],
    pinQuadSideLength: [imnodesStyle.PinQuadSideLength],
    pinTriangleSideLength: [imnodesStyle.PinTriangleSideLength],
    pinLineThickness: [imnodesStyle.PinLineThickness],
    pinHoverRadius: [imnodesStyle.PinHoverRadius],
    pinOffset: [imnodesStyle.PinOffset],
    miniMapPadding: [imnodesStyle.MiniMapPadding],
    miniMapOffset: [imnodesStyle.MiniMapOffset],
    flags: [imnodesStyle.Flags],
    colors: [imnodesStyle.Colors],
}

const imnodesLinks = [];

function frame() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ImGuiImplWeb.BeginRender();

    ImGui.Begin("New Window");
    ImGui.Text("Hello, world!");
    ImGui.End();

    // ImNodes

    ImGui.SetNextWindowSize(new ImVec2(600, 600), ImGui.Cond.Once);
    ImGui.Begin("ImNodes");
    if (ImGui.CollapsingHeader("ImNodesIO", ImGui.TreeNodeFlags.DefaultOpen)) {
        if (ImGui.InputInt("io.AltMouseButton", imnodesData.altMouseButton)) {
            imnodesIO.AltMouseButton = imnodesData.altMouseButton[0];
        }
        if (ImGui.InputFloat("io.AutoPanningSpeed", imnodesData.autoPanningSpeed)) {
            imnodesIO.AutoPanningSpeed = imnodesData.autoPanningSpeed[0];
        }
    }
    if (ImGui.CollapsingHeader("ImNodesStyle")) {
        // GridSpacing
        if (ImGui.InputFloat("style.GridSpacing", imnodesData.gridSpacing)) {
            imnodesStyle.GridSpacing = imnodesData.gridSpacing[0];
        }

        // NodeCornerRounding
        if (ImGui.InputFloat("style.NodeCornerRounding", imnodesData.nodeCornerRounding)) {
            imnodesStyle.NodeCornerRounding = imnodesData.nodeCornerRounding[0];
        }

        // NodePadding
        const nodePadding = [imnodesStyle.NodePadding.x, imnodesStyle.NodePadding.y];
        if (ImGui.InputFloat2("style.NodePadding", nodePadding)) {
            imnodesStyle.NodePadding = new ImVec2(nodePadding[0], nodePadding[1]);
        }

        // NodeBorderThickness
        if (ImGui.InputFloat("style.NodeBorderThickness", imnodesData.nodeBorderThickness)) {
            imnodesStyle.NodeBorderThickness = imnodesData.nodeBorderThickness[0];
        }

        // LinkThickness
        if (ImGui.InputFloat("style.LinkThickness", imnodesData.linkThickness)) {
            imnodesStyle.LinkThickness = imnodesData.linkThickness[0];
        }

        // LinkLineSegmentsPerLength
        if (ImGui.InputFloat("style.LinkLineSegmentsPerLength", imnodesData.linkLineSegmentsPerLength)) {
            imnodesStyle.LinkLineSegmentsPerLength = imnodesData.linkLineSegmentsPerLength[0];
        }

        // LinkHoverDistance
        if (ImGui.InputFloat("style.LinkHoverDistance", imnodesData.linkHoverDistance)) {
            imnodesStyle.LinkHoverDistance = imnodesData.linkHoverDistance[0];
        }

        // PinCircleRadius
        if (ImGui.InputFloat("style.PinCircleRadius", imnodesData.pinCircleRadius)) {
            imnodesStyle.PinCircleRadius = imnodesData.pinCircleRadius[0];
        }

        // PinQuadSideLength
        if (ImGui.InputFloat("style.PinQuadSideLength", imnodesData.pinQuadSideLength)) {
            imnodesStyle.PinQuadSideLength = imnodesData.pinQuadSideLength[0];
        }

        // PinTriangleSideLength
        if (ImGui.InputFloat("style.PinTriangleSideLength", imnodesData.pinTriangleSideLength)) {
            imnodesStyle.PinTriangleSideLength = imnodesData.pinTriangleSideLength[0];
        }

        // PinLineThickness
        if (ImGui.InputFloat("style.PinLineThickness", imnodesData.pinLineThickness)) {
            imnodesStyle.PinLineThickness = imnodesData.pinLineThickness[0];
        }

        // PinHoverRadius
        if (ImGui.InputFloat("style.PinHoverRadius", imnodesData.pinHoverRadius)) {
            imnodesStyle.PinHoverRadius = imnodesData.pinHoverRadius[0];
        }

        // PinOffset
        if (ImGui.InputFloat("style.PinOffset", imnodesData.pinOffset)) {
            imnodesStyle.PinOffset = imnodesData.pinOffset[0];
        }

        // MiniMapPadding
        const miniMapPadding = [imnodesStyle.MiniMapPadding.x, imnodesStyle.MiniMapPadding.y];
        if (ImGui.InputFloat2("style.MiniMapPadding", miniMapPadding)) {
            imnodesStyle.MiniMapPadding = new ImVec2(miniMapPadding[0], miniMapPadding[1]);
        }

        // MiniMapOffset
        const miniMapOffset = [imnodesStyle.MiniMapOffset.x, imnodesStyle.MiniMapOffset.y];
        if (ImGui.InputFloat2("style.MiniMapOffset", miniMapOffset)) {
            imnodesStyle.MiniMapOffset = new ImVec2(miniMapOffset[0], miniMapOffset[1]);
        }

        // Flags
        if (ImGui.InputInt("style.Flags", imnodesData.flags)) {
            imnodesStyle.Flags = imnodesData.flags[0];
        }


        // Colors
    }



    ImGui.SeparatorText("Editor");
    ImNodes.BeginNodeEditor();

    ImNodes.PushColorStyle(ImNodes.Col.TitleBar, ImGui.ColorConvertFloat4ToU32(new ImVec4(1.0, 0.0, 0.0, 1.0)));
    ImNodes.BeginNode(1);
    ImNodes.BeginNodeTitleBar();
    ImGui.Text("Node 1");
    ImNodes.EndNodeTitleBar();
    ImNodes.BeginOutputAttribute(2);
    ImGui.Text("Output");
    ImNodes.EndOutputAttribute();
    ImGui.Dummy(new ImVec2(80, 45));
    ImNodes.EndNode();
    ImNodes.PopColorStyle();

    ImNodes.BeginNode(2);
    ImNodes.BeginNodeTitleBar();
    ImGui.Text("Node 2");
    ImNodes.EndNodeTitleBar();
    ImNodes.BeginInputAttribute(3);
    ImGui.Text("Input");
    ImNodes.EndInputAttribute();
    ImNodes.EndNode();

    for (const [i, [start_attr, end_attr]] of imnodesLinks.entries()) {
        ImNodes.Link(i, start_attr, end_attr);
    }

    ImNodes.MiniMap(0.2, ImNodes.MiniMapLocation.TopRight);
    ImNodes.EndNodeEditor();

    const start_attr = [2];
    const end_attr = [3];
    if (ImNodes.IsLinkCreated(start_attr, end_attr)) {
        console.log("Link created", start_attr[0], end_attr[0]);
        imnodesLinks.push([start_attr[0], end_attr[0]]);
    }

    ImGui.End();

    ImGui.ShowDemoWindow();

    context.clearColor(0.2, 0.4, 0.6, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    ImGuiImplWeb.EndRender();

    requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
