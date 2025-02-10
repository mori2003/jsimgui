/**
 * @file Main build script for the project.
 *
 * This script handles the following tasks:
 * 1. Generating the dcimgui data files
 * 2. Generating C++ and JavaScript bindings
 * 3. Compiling the C++ code to WebAssembly using Emscripten
 *
 * deno run --allow-run build.js [--data] [--bindings] [--wasm] [--release]
 * --data: Generate the dcimgui json data files
 * --bindings: Generate the bindings
 * --wasm: Compile to WebAssembly
 * --release: Compile in release mode (enable optimizations)
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
        await runTask(generateData, "Generating dcimgui data...");
    }

    if (flags.bindings) {
        await runTask(generateBindings, "Generating bindings...");
    }

    if (flags.wasm) {
        await runTask(compileWasm, "Compiling wasm...", flags.release);
    }

    console.log("%cBuild complete.", "color: green;");
}

/** Runs a task and logs the result. */
async function runTask(task, log, ...args) {
    console.log(`%c${log}...`, "color: blue;");
    await task(...args);
    console.log(`%cDone.`, "color: lightgreen;");
}

/** Runs a command and returns the status. */
async function runCmd(cmd, ...args) {
    return await new Deno.Command(cmd, { args }).spawn().status;
}

/** Generates the dcimgui files for the bindings. */
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

/** Generates the JS and CPP bindings files. */
async function generateBindings() {
    await runCmd(
        "deno",
        "run",
        //"--check",
        "-R",
        "-W",
        "./src/generator/main.js",
        "--jsonData",
        "./third_party/dear_bindings/dcimgui.json",
        "--outCpp",
        "./intermediate/jsimgui-gen.cpp",
        "--outJs",
        "./build/mod.js",
    );

    // await runCmd(
    //     "deno",
    //     "fmt",
    //     "./build/mod.js",
    // );
}

/**
 * Compiles the wasm binaries using emcc.
 * @param {boolean} release - Whether to compile in release mode.
 */
async function compileWasm(release) {
    const compFlags = [
        "-fno-rtti",
        "-fno-exceptions",
        "-DEMSCRIPTEN_HAS_UNBOUND_TYPE_NAMES=0",
        "-sMALLOC=emmalloc",
        "-sWASM_BIGINT",
        "-sENVIRONMENT=web",
    ];

    if (release) {
        compFlags.push(
            "-Oz",
            "-flto",
        );
    } else {
        compFlags.push(
            "-O0",
            //"-fsanitize=leak",
            //"-fsanitize=address",
            //"-sALLOW_MEMORY_GROWTH"
        );
    }

    const compile = async (
        inFile,
        outFile,
        moduleName,
        ...compFlags
    ) => {
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
            "-sEXPORTED_RUNTIME_METHODS=GL,FS,MEMFS",
            "-sMIN_WEBGL_VERSION=2", // Target only WebGL2
            "-sMAX_WEBGL_VERSION=2",
            //"-sUSE_WEBGPU=1",

            ...compFlags,
        );
    };

    await compile(
        "./intermediate/jsimgui-gen.cpp",
        "./build/jsimgui.js",
        "MainExport",
        ...compFlags,
    );
}

main();
