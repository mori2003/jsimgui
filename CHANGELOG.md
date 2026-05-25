# Changelog

## Unreleased - YYYY-MM-DD

## v0.14.0 - 2026-05-25

- Updated Dear ImGui submodule to `v1.92.8-docking`.
- Updated dear_bindings submodule to `v0.21`.
- Added generated bindings to version control.
- Added `DisplayFramebufferScale` handling for browser backend IO.
- Added device pixel ratio handling in canvas examples.
- Added `scene-texture` example for showing threejs scene in a window.
- Added `ini-settings` example.
- Added initial `imnodes` extension bindings.
- Added initial `implot` extension bindings.
- Replaced `ImGuiImplWeb.LoadTexture` with `RegisterTexture` and `DummyTexture` helpers.
- Restructured output and generator files.
- Switched browser input handling from mouse events to pointer events.
- Fixed field access out-of-bounds issue (#114).
- Removed biome, added `oxfmt` and `oxlint` as tooling.
- Removed test directory and related workflow.

## v0.13.0 - 2026-01-20

- Breaking: Merge WebGL, WebGL2 and WebGPU and demo configurations:
  - `enableDemos` is removed from `InitOptions` (`ImGuiImplWeb.Init({ ... })`)
  - Demos are now always enabled.
- Breaking: Return `ImTextureRef` instead of `ImTextureID` from `ImGuiImplWeb.LoadTexture(...)`
  - It's not neccesary anymore to wrap the id into ImTextureRef manually when passing it to ImGui.Image(...)
- Update Dear ImGui to v1.92.5-docking
- Update emsdk to 4.0.22 and use emdawnwebgpu port
- Add initial playwright tests
- Bind color utility functions
  - `ImGui.ColorConvertU32ToFloat4(...)`
  - `ImGui.ColorConvertFloat4ToU32(...)`
  - `ImGui.ColorConvertRGBtoHSV(...)`
  - `ImGui.ColorConvertHSVtoRGB(...)`
- Add package releases to github package registry

## v0.12.0 - 2025-12-17

- Added Dockerfile for building

```bash
docker build -t jsimgui .
docker run -v "$PWD:/workspace" jsimgui bash -c "npm install && node build.ts"
```

- Added Dependabot to repository
- Fixed wrong return type of InputText,InputTextMultiline,InputTextWithHint

## v0.11.0 - 2025-12-07

- Added initial bindings for `SetDragDropPayload` and `ImGuiPayload`
- Added manual Github Pages workflow
- Updated Quick Start example in README
- Updated css and canvas resizing in examples code
- Changed canvas IO behavior to update `io.DisplaySize` every frame

## v0.10.0 - 2025-11-30

- Added small PixiJS example
- Added small BabylonJS example
- Added SINGLE_FILE to build flags:
  - WASM is now embedded into the JS file
  - This should make usage with tools like Vite a lot easier
- Bind Colors field in ImGuiStyle
- Removed PR workflow and git-cliff configuration file

## v0.9.0 - 2025-11-16

### 🚀 Features

- _(ci)_ Add caching for emscripten artifacts, setup uv for python (#45)
- _(ci)_ Merge publish and release workflows (#48)
- _(api)_ Add clang-tools configuration files (#54)
- _(generator)_ Improve enum comment generation (#56)
- _(generator)_ Add typedef comment generation (#57)
- _(generator)_ Improve struct and functions comments (#59)
- _(api)_ Add initial font loading (#70)

### 🐛 Bug Fixes

- _(api)_ Fix crashing with unkown key presses (#47)
- _(build)_ Fix building on windows (#68)

### 🎨 Styling

- _(ci)_ Change style in build workflow (#49)
- _(api)_ Format and change style in cpp template (#55)

### ⚙️ Miscellaneous Tasks

- _(README)_ Update README with new quick start example (#50)
- _(generator)_ Refactor enum generation (#58)
- _(generator)_ Add initial generator tests and new config file (#61)
- _(generator)_ Rework typedef generation code and add initial tests (#62)
- _(generator)_ Add comment generation tests (#63)
- _(generator)_ Refactor bindings generator (#64)
- _(generator)_ Manually rebind some structs and functions (#67)
- _(README)_ Specify versions (#69)
- _(build)_ Bump version to 0.9.0 (#71)

## v0.8.0 - 2025-8-16

### 🚀 Features

- _(api)_ Bind `PushID`, `GetID` and `PopID` (#40)

### 🐛 Bug Fixes

- _(api)_ Add `Meta` key to keybinds and fix `Meta` key behaviors (#39)
- _(ci)_ Change action for github release (#42)
- _(ci)_ Add permissions to release workflow (#43)

### ⚙️ Miscellaneous Tasks

- _(build)_ Bump version to 0.8.0 (#44)

## v0.7.1 - 2025-08-11

### 🚀 Features

- _(api)_ Add initial ini settings loading and saving
- _(build)_ Add new specific `tsconfig.build.json` for compiling the `mod.ts`
- _(build)_ Change to static imports
- _(ci)_ Add git-cliff configuration file
- _(ci)_ Add pr title validation workflow
- _(api)_ Expose basic `ImDrawList` functions (#27)
- _(api)_ Use dynamic imports with specified paths (#30)
- _(build)_ Compile with `sALLOW_MEMORY_GROWTH` and `sASSERTIONS` (#31)
- _(ci)_ Add github release workflow using git-cliff changelog (#32)

### 🐛 Bug Fixes

- _(ci)_ Add `package-lock.json`
- _(ci)_ Pin typescript to v5.8.3
- _(ci)_ Upload relocated build artifacts (#35)

### 🚜 Refactor

- _(api)_ Rename `api-types-tmp.d.ts` to `api-types.d.ts`

### ⚙️ Miscellaneous Tasks

- _(build)_ Replace `deno.json` with `jsr.json`
- _(build)_ Delete `package-lock.json`
- _(build)_ Add schemas and format json files
- _(build)_ Adjust fields in `tsconfig.json`
- _(api)_ Add ini types to `api-types.d.ts`
- _(build)_ Bump version to 0.7.0 (#34)
- _(build)_ Bump version to 0.7.1 (#36)

## v0.6.0 - 2025-08-2

- Added WebGL1 support
- Added initial Clipboard support
- Added Github actions workflows for:
  - Building
  - Publishing to JSR and npmjs
  - Github pages
- Added initial [wiki](https://github.com/mori2003/jsimgui/wiki)
- Reworked build script:
  - Fixed displaying errors
  - Fixed building WebGL/WebGL2
  - Added building specific configurations:

  `node build.ts --backend=webgpu --font-loader=freetype --demos`

- Updated Biome to v2.1.2

### Breaking changes

Please see the [wiki](https://github.com/mori2003/jsimgui/wiki) on how to work with these changes

- Moved backend-specific functions into general ones:
  - `ImGuiImplWeb.InitWebGl/WebGPU()` -> `ImGuiImplWeb.Init()`
  - `ImGuiImplWeb.BeginRenderWebGL/WebGPU()` -> `ImGuiImplWeb.BeginRender()`
  - `ImGuiImplWeb.EndRenderWebGL/WebGPU()` -> `ImGuiImplWeb.BeginRender()`
- Added options for initializing jsimgui:

```js
await ImGuiImplWeb.Init({
	canvas: myCanvas,
	device: myGPUDevice, // Required for WebGPU
	backend: "webgl", // (optional) this is most likely already inferred from the canvas
	fontLoader: "truetype", // (optional) you can choose between `truetype` and `freetype`
	enableDemos: true, // (optional) enables the Dear ImGui demo windows.
	loaderPath: "...", // (optional) you can specify a custom path to the emscripten loader script.
});
```

- Made `Mod` module private, use `ImGuiImplWeb.GetEmscriptenExports()` instead
- Changed Image loading API:
  - Removed ` ImGuiImplWeb.LoadImageWebGL/WebGPU()`
  - New function for loading/updating images: `ImGuiImplWeb.LoadTexture(...)`
  - Support loading Images using `Uint8Array`

## v0.5.0 - 2025-07-03

- Updated Dear ImGui to v1.92.0
- Use FreeType renderer for Dear ImGui
- Set C++ standard to C++26

**The new ImGui release introduced some breaking changes regarding Images and Textures**

`ImGui.Image()` now takes a `ImTextureRef` class/struct instead of ImTextureID. However an `ImTextureRef` can easily be created using the `ImTextureID` like:

```js
import { ImGui, ImTextureRef, ImVec2 } from "@mori2003/jsimgui";

ImGui.Image(new ImTextureRef(imgID), new ImVec2(100, 100));
```

## v0.4.0 - 2025-06-7

- Added initial on-screen keyboard support for touch devices (#11 )
- Added touch device support for dragging and scrolling, scrolling is triggered via two-finger gesture (#10 )

## v0.3.0 - 2025-03-10

- Added WebGPU backend
- Added WebGPU example (WIP)
- Split `ImGuiImplWeb` functions into WebGL and WebGPU specific ones: e.g. `InitWebGL`, `InitWebGPU`, `LoadImageWebGL`, `LoadImageWebGPU`

## v0.2.0 - 2025-02-22

- Removed ImEnum. Enums & Flags are now available in the ImGui object.
- Converted generator to TypeScript
- Removed dependencies from generator and make it compatible with Node, Deno, Bun
- Added biome as linter/formatter
- Added Image and ImageButton support
- Added Image loader helper for WebGL2
- Updated imgui to v1.91.8
- Updated Readme
- Fixed canvas zooming behaviour
