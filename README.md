# jsimgui: JavaScript bindings for Dear ImGui

[![npm](https://img.shields.io/badge/npm-red?logo=npm)](https://www.npmjs.com/package/@mori2003/jsimgui)
[![jsr](https://img.shields.io/badge/jsr-teal?logo=jsr)](https://jsr.io/@mori2003/jsimgui)
![](https://img.shields.io/badge/Dear_ImGui-v1.92.4--docking-blue)
![](https://github.com/mori2003/jsimgui/actions/workflows/build.yml/badge.svg)

![showcase](./docs/showcase.png)

JavaScript/TypeScript bindings for the [Dear ImGui](https://github.com/ocornut/imgui) library.

## Features

- WebGL, WebGL2 and WebGPU supported
- Using docking branch of Dear ImGui
- Simple API which tries to feel familiar to the original
- Original comments preserved from Dear ImGui
- Good IDE support thanks to TypeScript

## Examples

**Clear canvas**

- **WebGL** - [View Example](https://mori2003.github.io/jsimgui/docs/examples/canvas/webgl/)

- **WebGL2** - [View Example](https://mori2003.github.io/jsimgui/docs/examples/canvas/webgl2/)

- **WebGPU** - [View Example](https://mori2003.github.io/jsimgui/docs/examples/canvas/webgpu/)

**Three.js**

- **Three.js WebGL2** - [View Example](https://mori2003.github.io/jsimgui/docs/examples/threejs/)

**PixiJS**

- **PixiJS** - [View Example](https://mori2003.github.io/jsimgui/docs/examples/pixijs/)

**Babylon.js**

- **Babylon.js** - [View Example](https://mori2003.github.io/jsimgui/docs/examples/babylonjs/)

## Todo
The library should be somewhat usable, but expect bugs and missing features! (Custom font support, INI settings, etc.) Please open an issue if you find something.

## Quick Start

Dear ImGui is rendered to a `<canvas>` element. Here is a short single-file example (also on [CodePen](https://codepen.io/mori2003/pen/xbwVaQg)).
For more information, see the [wiki](https://github.com/mori2003/jsimgui/wiki).


```html
<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                margin: 0;
            }

            canvas {
                display: block;
                width: 100vw;
                height: 100vh;
            }
        </style>
        <script type="module">
            import { ImGui, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui";

            const canvas = document.querySelector("#render-canvas");

            await ImGuiImplWeb.Init({
                canvas: canvas,
                enableDemos: true,
            });

            function render() {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;

                ImGuiImplWeb.BeginRender();

                ImGui.Begin("New Window");
                ImGui.Text("Hello, World!");
                ImGui.End();
                ImGui.ShowDemoWindow();

                ImGuiImplWeb.EndRender();
                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        </script>
    </head>
    <body>
        <canvas id="render-canvas"></canvas>
    </body>
</html>
```



## Building

### 1. Clone the repository with submodules

```bash
git clone https://github.com/mori2003/jsimgui.git --recurse-submodules
cd jsimgui
```

### 2. Build

#### Using Docker Image
```bash
docker build -t jsimgui -f .github/Dockerfile .
docker run -v "$PWD:/workspace" jsimgui bash -c "npm install && node build.ts"
```
#### Manually

**Prerequisites**

- A Node.js compatible runtime (Node.js >= v22.18.0, Deno, Bun)
- [Emscripten](https://emscripten.org/) >= v4.0.18
- [Python](https://www.python.org/) with [Ply](https://pypi.org/project/ply/) (For dear_bindings)

```bash
npm install
```

This will build the default library configuration: WebGL2, truetype font loader, no demos.

```bash
node build.ts
```

You can specify what configuration to build like so:

```bash
node build.ts --backend=webgpu --font-loader=freetype --demos

node build.ts --help # To see all options
```

## Project Structure

```
docs/         # Usage examples
src/          # Bindings generator source code
third_party/  # Dependencies (imgui, dear_bindings)
```
