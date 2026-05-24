import { ImGui, ImGuiImplWeb, ImVec2, ImGuiInputTextFlags } from "@mori2003/jsimgui";

const canvas = document.querySelector("#render-canvas");
const context = canvas.getContext("webgl2") || canvas.getContext("webgl");

let iniData = "";

ImGuiImplWeb.SetSaveIniSettingsFn((_iniData) => {
	iniData = _iniData;
	localStorage.setItem("imgui-ini", iniData);
});

ImGuiImplWeb.SetLoadIniSettingsFn(() => {
	iniData = localStorage.getItem("imgui-ini") ?? "";
	return localStorage.getItem("imgui-ini");
});

await ImGuiImplWeb.Init({ canvas });

function frame() {
	canvas.width = canvas.clientWidth * window.devicePixelRatio;
	canvas.height = canvas.clientHeight * window.devicePixelRatio;

	ImGuiImplWeb.BeginRender();

	ImGui.Begin("Ini Settings");
	ImGui.Text("INI Data - Will be saved to localStorage");
	ImGui.InputTextMultiline(
		"##text",
		[iniData],
		iniData.length + 1,
		new ImVec2(-1, -1),
		ImGuiInputTextFlags.ReadOnly,
	);
	ImGui.End();

	ImGui.ShowDemoWindow();

	context.clearColor(0.2, 0.4, 0.6, 1.0);
	context.clear(context.COLOR_BUFFER_BIT);

	ImGuiImplWeb.EndRender();

	requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
