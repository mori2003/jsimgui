
/**
 * Namespace that provides access to the OpenGL3 backend functions.
 * @namespace {ImGuiImplOpenGL3}
 */
export const ImGuiImplOpenGL3 = {
    /** [Manual] Initializes the OpenGL3 backend. @returns {boolean} */
    Init: () => { return Mod.main.cImGui_ImplOpenGL3_Init(); },

    /** [Manual] Shuts down the OpenGL3 backend. @returns {void} */
    Shutdown: () => { return Mod.main.cImGui_ImplOpenGL3_Shutdown(); },

    /** [Manual] Starts a new OpenGL3 frame. @returns {void} */
    NewFrame: () => { return Mod.main.cImGui_ImplOpenGL3_NewFrame(); },

    /** [Manual] Renders the OpenGL3 frame. @param {ImDrawData} draw_data @returns {void} */
    RenderDrawData: (draw_data) => { return Mod.main.cImGui_ImplOpenGL3_RenderDrawData(draw_data.unwrap()); },
};
