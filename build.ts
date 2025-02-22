/**
 * Build script for jsimgui. Invokes the emscripten compiler and the bindings generator script.
 */

import { stdout, exit, argv } from "node:process";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { styleText } from "node:util";
import { main as generatorMain } from "./src/main.js";

function main(): void {
    const startTime = Date.now();

    const help = argv.includes("--help");
    if (help) {
        stdout.write(styleText("white", "Available options:\n"));
        stdout.write(styleText("white", "  --skip-metadata\n"));
        stdout.write(styleText("white", "  --skip-bindings\n"));
        stdout.write(styleText("white", "  --skip-wasm\n"));
        stdout.write(styleText("white", "  --skip-typescript\n"));
        stdout.write(styleText("white", "  --skip-format\n"));
        exit(0);
    }

    const args = {
        skipMetadata: argv.includes("--skip-metadata"),
        skipBindings: argv.includes("--skip-bindings"),
        skipWasm: argv.includes("--skip-wasm"),
        skipTypeScript: argv.includes("--skip-typescript"),
        skipFormat: argv.includes("--skip-format"),
    };

    buildSteps([
        { fn: checkMetadata, name: "📑 Checking metadata", skip: args.skipMetadata },
        { fn: generateBindings, name: "🔗 Generating bindings", skip: args.skipBindings },
        { fn: compileWasm, name: "🛠️ Compiling WASM", skip: args.skipWasm },
        { fn: compileTypeScript, name: "📘 Compiling TypeScript", skip: args.skipTypeScript },
        { fn: formatJavaScript, name: "🧹 Formatting/Linting output", skip: args.skipFormat },
    ]);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    stdout.write(styleText(["bold", "greenBright"], `    📦 Build completed in ${duration}s\n`));
}

function runCommand(cmd: string): string {
    return execSync(cmd, { encoding: "utf-8" });
}

function buildSteps(steps: { fn: () => void; name: string; skip?: boolean }[]): void {
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        stdout.write(styleText(["dim", "bold"], `    [${i + 1}/${steps.length}]`));
        stdout.write(styleText("white", ` ${step.name}...`));

        if (step.skip) {
            stdout.write(styleText("yellow", " SKIP\n"));
            continue;
        }

        step.fn();
        stdout.write(styleText("green", " OK\n"));
    }
}

function checkMetadata(): void {
    const checkSubmodule = (submodule: string): void => {
        if (!existsSync(submodule)) {
            stdout.write(
                styleText(
                    "redBright",
                    ` ERROR: ${submodule} folder not found. Try running 'git submodule update --init'.\n`,
                ),
            );
            exit(1);
        }
    };

    checkSubmodule("third_party/dear_bindings");
    checkSubmodule("third_party/imgui");

    const dataFiles = [
        "dcimgui.json",
        "dcimgui.h",
        "dcimgui.cpp",
        "dcimgui_internal.h",
        "dcimgui_internal.cpp",
        "dcimgui_impl_opengl3.h",
        "dcimgui_impl_opengl3.cpp",
    ];

    let regenerate = false;
    for (const file of dataFiles) {
        if (!existsSync(`third_party/dear_bindings/${file}`)) {
            regenerate = true;
            break;
        }
    }

    if (regenerate) {
        stdout.write(styleText("yellowBright", " INFO: Incomplete dear_bindings metadata."));
        stdout.write(styleText("yellowBright", " Regenerating..."));

        runCommand(
            [
                "python",
                "./third_party/dear_bindings/dear_bindings.py",
                "--nogeneratedefaultargfunctions",
                "-o",
                "./third_party/dear_bindings/dcimgui",
                "./third_party/imgui/imgui.h",
            ].join(" "),
        );

        runCommand(
            [
                "python",
                "./third_party/dear_bindings/dear_bindings.py",
                "-o",
                "./third_party/dear_bindings/dcimgui_internal",
                "--include",
                "./third_party/imgui/imgui.h",
                "./third_party/imgui/imgui_internal.h",
            ].join(" "),
        );

        runCommand(
            [
                "python",
                "./third_party/dear_bindings/dear_bindings.py",
                "-o",
                "./third_party/dear_bindings/dcimgui_impl_opengl3",
                "--backend",
                "./third_party/imgui/backends/imgui_impl_opengl3.h",
            ].join(" "),
        );
    }
}

function generateBindings(): void {
    generatorMain();
}

function compileWasm(): void {
    runCommand(
        [
            "em++",
            "bindgen/jsimgui.cpp",

            "./third_party/imgui/imgui.cpp",
            "./third_party/imgui/imgui_demo.cpp",
            "./third_party/imgui/imgui_draw.cpp",
            "./third_party/imgui/imgui_tables.cpp",
            "./third_party/imgui/imgui_widgets.cpp",
            "./third_party/imgui/backends/imgui_impl_opengl3.cpp",
            "./third_party/imgui/backends/imgui_impl_wgpu.cpp",
            "./third_party/dear_bindings/dcimgui.cpp",
            "./third_party/dear_bindings/dcimgui_internal.cpp",
            "./third_party/dear_bindings/dcimgui_impl_opengl3.cpp",
            "-I./third_party/imgui/",
            "-I./third_party/imgui/backends",
            "-I./third_party/dear_bindings",

            "-o build/jsimgui-em.js",
            "--cache=./.em_cache",
            "-std=c++20",

            "-sENVIRONMENT=web",
            "-sMODULARIZE=1",
            "-sEXPORT_ES6=1",
            "-sEXPORT_NAME=MainExport",

            "-lembind",
            "-sEXPORTED_RUNTIME_METHODS=GL,FS,MEMFS",
            "-sMIN_WEBGL_VERSION=2", // Target only WebGL2
            "-sMAX_WEBGL_VERSION=2",

            "-Oz",
            "-flto",
            "-sMALLOC=emmalloc",
            "-sWASM_BIGINT",
        ].join(" "),
    );
}

function compileTypeScript(): void {
    runCommand("./node_modules/.bin/tsc");
}

function formatJavaScript(): void {
    runCommand("./node_modules/.bin/biome format --write ./build/jsimgui-em.js");
    runCommand("./node_modules/.bin/biome format --write ./build/mod.js");
}

main();
