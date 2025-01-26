# jsimgui: JavaScript bindings for Dear ImGui

JavaScript bindings for the [Dear ImGui](https://github.com/ocornut/imgui) library, using the docking branch.

Currently only compatible with WebGL2. Built with: [Dear ImGui](https://github.com/ocornut/imgui), [Dear Bindings](https://github.com/dearimgui/dear_bindings), [Deno](https://deno.com/) and [Emscripten](https://emscripten.org/).

## Examples

- **WebGL2**: Basic example using WebGL2 clear canvas - [View Example](https://mori2003.github.io/jsimgui/examples/webgl/)
- **Three.js**: Integration with Three.js WebGL2 renderer - [View Example](https://mori2003.github.io/jsimgui/examples/threegl/)

## Getting Started

The package is available on the [JSR ](https://jsr.io/@mori2003/jsimgui/) package registry. Use it with your favorite package manager (See: https://jsr.io/docs/using-packages).

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

## Notes

Some changes have been made to the API to make it more usable in JavaScript.

### Arrays

Arrays are modified in-place when passed as arguments:

```js
const color = [0.2, 0.8, 0.5];
ImGui.ColorEdit3("BackgroundColor", color); // Modifies the color array.
```

### Pointers

Use `ImRef` to wrap primitive values that need to be modified by reference:

```js
const isVisible = new ImRef(true); // Or use numbers: new ImRef(42);
ImGui.Checkbox("Show Window", isVisible);
console.log(isVisible.value); // Access the modified value.
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
deno task gen-data
```

3. Build the project

```bash
deno task build-full

# To run the tests:
deno task test
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
