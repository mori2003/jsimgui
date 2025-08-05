# jsimgui: JavaScript bindings for Dear ImGui

JavaScript bindings for the [Dear ImGui](https://github.com/ocornut/imgui) library, using the docking branch.

Currently only compatible with WebGL2. Built with: [Dear ImGui](https://github.com/ocornut/imgui), [Dear Bindings](https://github.com/dearimgui/dear_bindings), [Deno](https://deno.com/) and [Emscripten](https://emscripten.org/).

## Todo
The library is currently in a very early stage but core functionality is there. It's also not optimized yet in terms of performance & size (Wasm binary is about ~750kb).

Some planned goals are:
- [ ] Improve documentation and usage with JSDoc comments
- [ ] Clipboard support
- [ ] Image and ImageButton
- [ ] Custom fonts
- [ ] Saving ImGui settings
- [ ] WebGPU backend

## Examples

- **WebGL2**: Basic example using a WebGL2 clear canvas - [View Example](https://mori2003.github.io/jsimgui/examples/webgl/)
- **Three.js**: Integration with Three.js WebGL2 renderer - [View Example](https://mori2003.github.io/jsimgui/examples/threegl/)

## Getting Started

The package is available on the [JSR](https://jsr.io/@mori2003/jsimgui/) package registry. Use it with your favorite package manager (See: https://jsr.io/docs/using-packages).

```bash
# Deno
deno add jsr:@mori2003/jsimgui

# Node.js
npx jsr add @mori2003/jsimgui

# Bun
bunx jsr add @mori2003/jsimgui
```

Integrate it into your project.

```js
import { ImGui, ImGuiImplWeb } from "@mori2003/jsimgui";

const canvas = document.querySelector("#your-canvas");
await ImGuiImplWeb.Init(canvas);

function frame() {
    ImGuiImplWeb.BeginRender();

    ImGui.Begin("New Window");
    ImGui.Text("Hello from JS!");
    ImGui.End();

    // Render your scene...

    ImGuiImplWeb.EndRender();
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

## API Notes

### Arrays

Arrays are modified in-place when passed as arguments. Single-sized arrays are also used for references:

```js
const color = [0.2, 0.8, 0.5];
ImGui.ColorEdit3("BackgroundColor", color); // Modifies the color array.
const isVisible = [true];
ImGui.Checkbox("Show Window", isVisible); // Modifies isVisible[0].
```

### Enums

Enums names have been shortened and are accessed through the `ImEnum` object:

```js
ImGui.SetNextWindowPos(new ImVec2(10, 10), ImEnum.Cond.Once);
```

## Building

**Prerequisites:**

- [Deno](https://deno.com/)
- [Emscripten](https://emscripten.org/)
- [Python](https://www.python.org/) with [Ply](https://pypi.org/project/ply/) (For dear_bindings)

1. Clone the repository

```bash
git clone https://github.com/mori2003/jsimgui.git
cd jsimgui
```

2. Generate the dear_bindings data

```bash
deno task build:gen-data
```

3. Build the project

```bash
deno task build:full
```

## Project Structure

```
build/        # Distribution files
examples/     # Usage examples
intermediate/ # Generated C++ binding files
nix/          # Nix development shell
src/          # API generator source code
third_party/  # Dependencies (imgui, dear_bindings)
```
