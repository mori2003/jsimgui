/**
 * @file Main build script for the project.
 *
 * This script handles the following tasks:
 * 1. Generating the dcimgui data files
 * 2. Generating C++ and JavaScript bindings
 * 3. Compiling the C++ code to WebAssembly using Emscripten
 *
 * Usage:
 * deno run --allow-run build.js [--data] [--bindings] [--wasm]
 * --bindings: Generate the bindings
 * --wasm: Compile to WebAssembly
 */

import { parseArgs } from "@std/cli";

async function main() {
    const flags = parseArgs(Deno.args, {
        boolean: ["data", "bindings", "wasm", "release"],
        default: { data: false, bindings: false, wasm: false, release: false },
    });

    if (!flags.data && !flags.bindings && !flags.wasm) {
        console.log("%cNo arguments specified, doing nothing.", "color: red;");
        return;
    }

    if (flags.data) {
        console.log("%cGenerating dcimgui data...", "color: blue;");
        await generateData();
        console.log("%cDone.", "color: lightgreen;");
    }

    if (flags.bindings) {
        console.log("%cGenerating bindings...", "color: blue;");
        await generateBindings();
        console.log("%cDone.", "color: lightgreen;");
    }

    if (flags.wasm) {
        console.log("%cCompiling wasm...", "color: blue;");
        await compileWasm(flags.release);
        console.log("%cDone.", "color: lightgreen;");
    }

    console.log("%cBuild complete.", "color: green;");
}

/**
 * Runs a command and returns the status.
 * @param {string} cmd - The command to run.
 * @param {string[]} args - The arguments to pass to the command.
 * @returns {Promise<Deno.CommandStatus>} The status of the command.
 */
async function runCmd(cmd, ...args) {
    return await new Deno.Command(cmd, { args }).spawn().status;
}

/**
 * Generates the dcimgui files for the bindings.
 */
async function generateData() {
    await runCmd(
        "python",
        "./third_party/dear_bindings/dear_bindings.py",
        "-o",
        "./third_party/dear_bindings/dcimgui",
        "./third_party/imgui/imgui.h",
    );

    await runCmd(
        "python",
        "./third_party/dear_bindings/dear_bindings.py",
        "-o",
        "./third_party/dear_bindings/dcimgui_internal",
        "--include",
        "./third_party/imgui/imgui.h",
        "./third_party/imgui/imgui_internal.h",
    );

    await runCmd(
        "python",
        "./third_party/dear_bindings/dear_bindings.py",
        "-o",
        "./third_party/dear_bindings/dcimgui_impl_opengl3",
        "--backend",
        "./third_party/imgui/backends/imgui_impl_opengl3.h",
    );
}

/**
 * Generates the JS and CPP bindings files.
 */
async function generateBindings() {
    await runCmd(
        "deno",
        "run",
        "-R",
        "-W",
        "./src/generator/main.js",
        "--jsonData",
        "./third_party/dear_bindings/dcimgui.json",
        "--outCpp",
        "./intermediate/jsimgui.cpp",
        "--outJs",
        "./build/mod.js",
    );
}

/**
 * Compiles the wasm binaries using emcc.
 * @param {boolean} release - Whether to compile in release mode.
 */
async function compileWasm(release) {
    // TODO: Compile the wasm binaries using emcc
    // when release is true: compile using -Os, flto, closure compiler?
    const outCore = "./build/jsimgui";
    const outDemo = "./build/jsimgui-demo";

    const compIncludes = [
        "-I./third_party/imgui/",
        "-I./third_party/imgui/backends",
        "-I./third_party/dear_bindings",
    ];

    const compFlags = [];

    const compile = async (inFile, outFile, moduleName, ...compFlags) => {
        await runCmd(
            "emcc",
            inFile,

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

            "-o",
            outFile,

            "--cache=./.em_cache",
            "-lembind",
            "-sMODULARIZE=1",
            "-sEXPORT_ES6=1",
            `-sEXPORT_NAME=${moduleName}`,

            // Target only WebGL2
            "-sEXPORTED_RUNTIME_METHODS=GL",
            "-sMIN_WEBGL_VERSION=2",
            "-sMAX_WEBGL_VERSION=2",
            "-sUSE_WEBGPU=1",

            ...compFlags,
        );
    };

    // Compile jsimgui.
    await compile(
        "./intermediate/jsimgui.cpp",
        "./build/jsimgui.js",
        "MainExport",
        "-DIMGUI_DISABLE_OBSOLETE_FUNCTIONS",
        //"-DIMGUI_DISABLE_DEMO_WINDOWS",
        "-Os",
        //"-flto",
    );

    // // Compile jsimgui-demo.
    // await compile(
    //     "./intermediate/jsimgui-demo.cpp",
    //     "./build/jsimgui-demo.js",
    //     "DemoExport",
    //     "-DIMGUI_DISABLE_OBSOLETE_FUNCTIONS",
    // );

    /**
     * Fixes the imports in the js loader by prepending "node:" so that
     * Deno can evaluate the loader for the tests.
     * @param {string} file - The file to fix.
     */
    const fixImports = (file) => {
        const fileContent = Deno.readTextFileSync(file);

        Deno.writeTextFileSync(file, fileContent);
    };

    //fixImports();
}

main();
