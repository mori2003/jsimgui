
/** [Manual] A 2D vector used to store positions, sizes etc. */
export class ImVec2 extends StructBinding {
    /** @param {number} x @param {number} y */
    constructor(x, y) {
        super("ImVec2");
        this.x = x;
        this.y = y;
    }

    /** @type {number} */
    get x() { return this.unwrap().get_x(); }
    set x(value) { this.unwrap().set_x(value); }
    /** @type {number} */
    get y() { return this.unwrap().get_y(); }
    set y(value) { this.unwrap().set_y(value); }
}

/** [Manual] A 4D vector used to store clipping rectangles, colors etc. */
export class ImVec4 extends StructBinding {
    /** @param {number} x @param {number} y @param {number} z @param {number} w */
    constructor(x, y, z, w) {
        super("ImVec4");
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /** @type {number} */
    get x() { return this.unwrap().get_x(); }
    set x(value) { this.unwrap().set_x(value); }
    /** @type {number} */
    get y() { return this.unwrap().get_y(); }
    set y(value) { this.unwrap().set_y(value); }
    /** @type {number} */
    get z() { return this.unwrap().get_z(); }
    set z(value) { this.unwrap().set_z(value); }
    /** @type {number} */
    get w() { return this.unwrap().get_w(); }
    set w(value) { this.unwrap().set_w(value); }
}

/** [Manual] Main configuration and I/O between your application and ImGui. */
export class ImGuiIO extends StructBinding {
    constructor() { super("ImGuiIO"); }

    /** @type {ImGuiConfigFlags} */
    get ConfigFlags() { return this.unwrap().get_ConfigFlags(); }
    set ConfigFlags(value) { this.unwrap().set_ConfigFlags(value); }
    /** @type {ImGuiBackendFlags} */
    get BackendFlags() { return this.unwrap().get_BackendFlags(); }
    set BackendFlags(value) { this.unwrap().set_BackendFlags(value); }
    /** @type {ImVec2} */
    get DisplaySize() { return ImVec2.wrap(this.unwrap().get_DisplaySize()); }
    set DisplaySize(value) { this.unwrap().set_DisplaySize(value.unwrap()); }
    /** @type {number} */
    get DeltaTime() { return this.unwrap().get_DeltaTime(); }
    set DeltaTime(value) { this.unwrap().set_DeltaTime(value); }
    /** @type {number} */
    get IniSavingRate() { return this.unwrap().get_IniSavingRate(); }
    set IniSavingRate(value) { this.unwrap().set_IniSavingRate(value); }
    /** @type {string} */
    //get IniFilename() { return this.unwrap().get_IniFilename(); }
    //set IniFilename(value) { this.unwrap().set_IniFilename(value); }
    /** @type {string} */
    //get LogFilename() { return this.unwrap().get_LogFilename(); }
    //set LogFilename(value) { this.unwrap().set_LogFilename(value); }
    /** @type {ImFontAtlas} */
    get Fonts() { return ImFontAtlas.wrap(this.unwrap().get_Fonts()); }
    set Fonts(value) { this.unwrap().set_Fonts(value.unwrap()); }
    /** @type {number} */
    get FontGlobalScale() { return this.unwrap().get_FontGlobalScale(); }
    set FontGlobalScale(value) { this.unwrap().set_FontGlobalScale(value); }
    /** @type {boolean} */
    get FontAllowUserScaling() { return this.unwrap().get_FontAllowUserScaling(); }
    set FontAllowUserScaling(value) { this.unwrap().set_FontAllowUserScaling(value); }
    /** @type {ImFont} */
    get FontDefault() { return ImFont.wrap(this.unwrap().get_FontDefault()); }
    set FontDefault(value) { this.unwrap().set_FontDefault(value.unwrap()); }
    /** @type {ImVec2} */
    get DisplayFramebufferScale() { return this.unwrap().get_DisplayFramebufferScale(); }
    set DisplayFramebufferScale(value) { this.unwrap().set_DisplayFramebufferScale(value); }
    /** @type {boolean} */
    get ConfigNavSwapGamepadButtons() { return this.unwrap().get_ConfigNavSwapGamepadButtons(); }
    set ConfigNavSwapGamepadButtons(value) { this.unwrap().set_ConfigNavSwapGamepadButtons(value); }

    /** @param {ImGuiKey} key @param {boolean} down */
    AddKeyEvent(key, down) { return this.unwrap().ImGuiIO_AddKeyEvent(key, down); }
    /** @param {ImGuiKey} key @param {boolean} down @param {number} v */
    AddKeyAnalogEvent(key, down, v) { return this.unwrap().ImGuiIO_AddKeyAnalogEvent(key, down, v); }
    /** @param {number} x @param {number} y */
    AddMousePosEvent(x, y) { return this.unwrap().ImGuiIO_AddMousePosEvent(x, y); }
    /** @param {number} button @param {boolean} down */
    AddMouseButtonEvent(button, down) { return this.unwrap().ImGuiIO_AddMouseButtonEvent(button, down); }
    /** @param {number} wheel_x @param {number} wheel_y */
    AddMouseWheelEvent(wheel_x, wheel_y) { return this.unwrap().ImGuiIO_AddMouseWheelEvent(wheel_x, wheel_y); }
    /** @param {ImGuiMouseSource} source */
    AddMouseSourceEvent(source) { return this.unwrap().ImGuiIO_AddMouseSourceEvent(source); }
    /** @param {ImGuiID} id */
    AddMouseViewportEvent(id) { return this.unwrap().ImGuiIO_AddMouseViewportEvent(id); }
    /** @param {boolean} focused */
    AddFocusEvent(focused) { return this.unwrap().ImGuiIO_AddFocusEvent(focused); }
    /** @param {number} c */
    AddInputCharacter(c) { return this.unwrap().ImGuiIO_AddInputCharacter(c); }
    /** @param {number} c */
    AddInputCharacterUTF16(c) { return this.unwrap().ImGuiIO_AddInputCharacterUTF16(c); }
    /** @param {string} str */
    AddInputCharactersUTF8(str) { return this.unwrap().ImGuiIO_AddInputCharactersUTF8(str); }
    /** @param {ImGuiKey} key @param {number} native_keycode @param {number} native_scancode */
    SetKeyEventNativeData(key, native_keycode, native_scancode) { return this.unwrap().ImGuiIO_SetKeyEventNativeData(key, native_keycode, native_scancode); }
    /** @param {boolean} accepting_events */
    SetAppAcceptingEvents(accepting_events) { return this.unwrap().ImGuiIO_SetAppAcceptingEvents(accepting_events); }
    ClearEventsQueue() { return this.unwrap().ImGuiIO_ClearEventsQueue(); }
    ClearInputKeys() { return this.unwrap().ImGuiIO_ClearInputKeys(); }
    ClearInputMouse() { return this.unwrap().ImGuiIO_ClearInputMouse(); }
}

/** [Manual] Runtime data for styling/colors. */
export class ImGuiStyle extends StructBinding {
    constructor() { super("ImGuiStyle"); }

    /** @type {number} */
    get Alpha() { return this.unwrap().get_Alpha(); }
    set Alpha(value) { this.unwrap().set_Alpha(value); }
    /** @type {number} */
    get DisabledAlpha() { return this.unwrap().get_DisabledAlpha(); }
    set DisabledAlpha(value) { this.unwrap().set_DisabledAlpha(value); }
    /** @type {ImVec2} */
    get WindowPadding() { return ImVec2.wrap(this.unwrap().get_WindowPadding()); }
    set WindowPadding(value) { this.unwrap().set_WindowPadding(value); }
    /** @type {number} */
    get WindowRounding() { return this.unwrap().get_WindowRounding(); }
    set WindowRounding(value) { this.unwrap().set_WindowRounding(value); }
    /** @type {number} */
    get WindowBorderSize() { return this.unwrap().get_WindowBorderSize(); }
    set WindowBorderSize(value) { this.unwrap().set_WindowBorderSize(value); }
}
