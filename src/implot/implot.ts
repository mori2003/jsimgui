// @ts-nocheck

import { Mod } from "./imgui.js";

export const ImPlot = {
	CreateContext(): void {
		Mod.export.ImPlot_CreateContext();
	},
	DestroyContext(): void {
		Mod.export.ImPlot_DestroyContext();
	},
	ShowDemoWindow(): void {
		Mod.export.ImPlot_ShowDemoWindow();
	},
};
