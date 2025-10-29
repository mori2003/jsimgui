/**
 * Build script for jsimgui. Use any Node.js compatible runtime to run this script.
 *
 * To see available build options, run:
 * [node|bun|deno] build.ts --help
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";
import { argv, exit, stdout } from "node:process";
import { styleText } from "node:util";
import { runGenerator } from "./src/generator/main.ts";

const runCommand = (cmd: string, failCb?: () => void) => {
    const [command, ...args] = cmd.split(" ");
    const result = spawnSync(command, args, {
        encoding: "utf-8",
        shell: true,
    });

    if (result.status !== 0) {
        if (failCb) {
            failCb();
            exit(1);
        }

        stdout.write("\n");
        stdout.write(styleText("red", result.stderr || result.stdout));
        stdout.write("\n");
        exit(1);
    }
};

const BACKENDS = ["webgl", "webgl2", "webgpu"] as const;
const FONT_LOADERS = ["truetype", "freetype"] as const;

const DEFAULT_BACKEND = "webgl2";
const DEFAULT_FONT_LOADER = "truetype";
const DEFAULT_INCLUDE_DEMOS = false;

interface BuildConfig {
    readonly backend: (typeof BACKENDS)[number];
    readonly fontLoader: (typeof FONT_LOADERS)[number];
    readonly includeDemos: boolean;
}

const getOutputPath = (cfg: BuildConfig): string => {
    const buildTags = [
        cfg.backend,
        cfg.fontLoader === "truetype" ? "tt" : "ft",
        cfg.includeDemos ? "demos" : "",
    ].filter(Boolean);

    return `build/jsimgui-${buildTags.join("-")}.js`;
};

/**
 * Step 1: Runs the dear_bindings python script to generate the following:
 * - compile_commands.json for C++ tooling (e.g., clangd).
 * - .json files for metadata which the jsimgui generator uses.
 * - .h and .cpp files with c-bindings for imgui (we also use them).
 */
const buildData = () => {
    const emsdkRoot = process.env.EMSDK || "";
    const srcFile = "./src/templates/cpp/header.cpp";

    const compileCommandsJson = JSON.stringify(
        [
            {
                arguments: [
                    `${emsdkRoot}/upstream/bin/clang++`,
                    "-target",
                    "wasm32-unknown-emscripten",
                    `--sysroot=${emsdkRoot}/upstream/emscripten/cache/sysroot`,
                    "-DEMSCRIPTEN",
                    "-Xclang",
                    "-iwithsysroot/include/fakesdl",
                    "-Xclang",
                    "-iwithsysroot/include/compat",
                    srcFile,

                    "-I./third_party/imgui/",
                    "-I./third_party/imgui/backends",
                    "-I./third_party/dear_bindings",

                    "-DJSIMGUI_BACKEND_WEBGL",
                    "-DJSIMGUI_BACKEND_WEBGPU",
                ],
                directory: process.cwd(),
                file: srcFile,
            },
        ],
        null,
        2,
    );

    writeFileSync("compile_commands.json", compileCommandsJson);

    if (argv.includes("--verbose")) {
        stdout.write("\n");
        stdout.write(styleText("yellow", "compile_commands.json: \n"));
        stdout.write(styleText("white", compileCommandsJson));
        stdout.write("\n");
    }

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

    runCommand(
        [
            "python",
            "./third_party/dear_bindings/dear_bindings.py",
            "-o",
            "./third_party/dear_bindings/dcimgui_impl_wgpu",
            "--backend",
            "./third_party/imgui/backends/imgui_impl_wgpu.h",
        ].join(" "),
    );
};

/**
 * Step 2: Uses the jsimgui generator to generate two things:
 * - .cpp file used by emscripten for the .wasm file.
 * - .ts file with the final bindings which are then transpiled to a .js and .d.ts file.
 */
const buildBindgen = () => {
    runGenerator();
};

/**
 * Step 3: Uses emscripten to compile the .cpp file to a .wasm and a .js loader file.
 */
const buildWasm = (cfg: BuildConfig) => {
    const backendConfigs = {
        webgl: {
            sources: [
                "./third_party/imgui/backends/imgui_impl_opengl3.cpp",
                "./src/fixes/dcimgui_impl_opengl3.cpp",
            ],
            flags: ["-sMIN_WEBGL_VERSION=1", "-sMAX_WEBGL_VERSION=1", "-DJSIMGUI_BACKEND_WEBGL"],
            exports: ["GL"],
        },
        webgl2: {
            sources: [
                "./third_party/imgui/backends/imgui_impl_opengl3.cpp",
                "./src/fixes/dcimgui_impl_opengl3.cpp",
            ],
            flags: ["-sMIN_WEBGL_VERSION=2", "-sMAX_WEBGL_VERSION=2", "-DJSIMGUI_BACKEND_WEBGL"],
            exports: ["GL"],
        },
        webgpu: {
            sources: [
                "./third_party/imgui/backends/imgui_impl_wgpu.cpp",
                "./src/fixes/dcimgui_impl_wgpu.cpp",
            ],
            flags: ["-sUSE_WEBGPU=1", "-DJSIMGUI_BACKEND_WEBGPU"],
            exports: ["WebGPU", "JsValStore"],
        },
    } as const;

    const fontLoaderConfigs = {
        truetype: {
            sources: [],
            flags: [],
        },
        freetype: {
            sources: ["./third_party/imgui/misc/freetype/imgui_freetype.cpp"],
            flags: ["-sUSE_FREETYPE=1", "-DIMGUI_USE_WCHAR32=1", "-DIMGUI_ENABLE_FREETYPE=1"],
        },
    } as const;

    const sourceFiles = [
        "./bindgen/jsimgui.cpp",

        "./third_party/imgui/imgui.cpp",
        "./third_party/imgui/imgui_demo.cpp",
        "./third_party/imgui/imgui_draw.cpp",
        "./third_party/imgui/imgui_tables.cpp",
        "./third_party/imgui/imgui_widgets.cpp",

        "./third_party/dear_bindings/dcimgui.cpp",
        "./third_party/dear_bindings/dcimgui_internal.cpp",
    ] as const;

    const includeDirs = [
        "-I./third_party/imgui/",
        "-I./third_party/imgui/backends",
        "-I./third_party/dear_bindings",
    ] as const;

    const compilerFlags = [
        "--cache=./.em_cache",
        "-std=c++26",

        "-lembind",
        `-sEXPORTED_RUNTIME_METHODS=FS,MEMFS,${backendConfigs[cfg.backend].exports?.join(",")}`,
        "-sENVIRONMENT=web",
        "-sWASM_BIGINT",

        "-sMODULARIZE=1",
        "-sEXPORT_ES6=1",
        "-sEXPORT_NAME=MainExport",

        "-DIMGUI_DISABLE_OBSOLETE_FUNCTIONS=1",
        ...(cfg.includeDemos ? [] : ["-DIMGUI_DISABLE_DEMO_WINDOWS=1"]),
        "-Oz",
        "-flto",
        "-sMALLOC=emmalloc",
        "-sALLOW_MEMORY_GROWTH=1",
        "-sASSERTIONS=1",
    ] as const;

    const buildCmd = (): string[] => {
        const allSources = [
            ...sourceFiles,
            ...backendConfigs[cfg.backend].sources,
            ...fontLoaderConfigs[cfg.fontLoader].sources,
        ];

        const allFlags = [
            ...includeDirs,
            ...compilerFlags,
            ...backendConfigs[cfg.backend].flags,
            ...fontLoaderConfigs[cfg.fontLoader].flags,
        ].filter(Boolean);

        const outputPath = getOutputPath(cfg);

        return ["emcc", ...allSources, ...allFlags, "-o", outputPath];
    };

    const cmd = buildCmd();

    if (argv.includes("--verbose")) {
        stdout.write("\n");
        stdout.write(styleText("yellow", cmd.join(" ")));
        stdout.write("\n");
    }

    mkdirSync("build", { recursive: true });
    runCommand(cmd.join(" "));
};

/**
 * Step 4: Compiles the .ts file to the mod.js and mod.d.ts files.
 */
const buildTs = () => {
    const tscPath = joinPath("node_modules", ".bin", "tsc");
    const cmd = `${tscPath} --project tsconfig.build.json`;

    if (argv.includes("--verbose")) {
        stdout.write("\n");
        stdout.write(styleText("yellow", cmd));
        stdout.write("\n");
    }

    runCommand(cmd);

    return;
};

/**
 * Step 5: Formats the final output files for readability.
 */
const buildFmt = (cfg: BuildConfig) => {
    const outputPath = getOutputPath(cfg);
    const biomePath = joinPath("node_modules", ".bin", "biome");
    const cmd = `${biomePath} format --write ${outputPath}`;
    const cmd2 = `${biomePath} format --write ./build/mod.js`;

    if (argv.includes("--verbose")) {
        stdout.write("\n");
        stdout.write(styleText("yellow", cmd));
        stdout.write(styleText("yellow", cmd2));
        stdout.write("\n");
    }

    runCommand(cmd);
    runCommand(cmd2);
};

const getStepSkips = (): string[] => {
    const args = argv.slice(2);
    const skip = args.find((arg) => arg.startsWith("--skip="))?.split("=")[1];

    return skip?.split(",") || [];
};

const getBuildConfig = (): BuildConfig => {
    const args = argv.slice(2);

    const parseArgument = <T extends string>(
        prefix: string,
        validValues: readonly T[],
        defaultValue: T,
    ): T => {
        const arg = args.find((arg) => arg.startsWith(`--${prefix}=`))?.split("=")[1];

        if (!arg) {
            return defaultValue;
        }

        if (validValues.includes(arg as T)) {
            return arg as T;
        }

        stdout.write(
            styleText(
                ["yellow", "bold"],
                `Warning: Unknown ${prefix} '${arg}'. Using default '${defaultValue}'.\n`,
            ),
        );

        return defaultValue;
    };

    const backend = parseArgument("backend", BACKENDS, DEFAULT_BACKEND);
    const fontLoader = parseArgument("font-loader", FONT_LOADERS, DEFAULT_FONT_LOADER);
    const includeDemos = args.includes("--demos") || DEFAULT_INCLUDE_DEMOS;

    return {
        backend,
        fontLoader,
        includeDemos,
    };
};

/**
 * Checks if the required tools/submodules for building are available. If not, exit with a message.
 * The required tools for building are:
 * - node|bun|deno (which is likely already present when running the script)
 * - emcc (Emscripten compiler)
 * - python with ply package
 *
 * Note that these are currently soft checks, e.g someone could have empty directories in the
 * third_party folder.
 */
const checkPrerequisites = () => {
    const tools = [
        {
            cmd: "emcc --version",
            msg: "emcc not found in PATH. Please install Emscripten and ensure 'emcc' is available.",
        },
        {
            cmd: "python --version",
            msg: "python not found in PATH. Please install Python and ensure 'python' is available.",
        },
        {
            cmd: 'python -c "import ply"',
            msg: "python package 'ply' not found. Please install it with 'pip install ply'.",
        },
    ] as const;

    const submodules = ["imgui", "dear_bindings"];

    for (const tool of tools) {
        runCommand(tool.cmd, () => stdout.write(styleText("red", tool.msg)));
    }

    for (const module of submodules) {
        if (!existsSync(`./third_party/${module}`)) {
            stdout.write(
                styleText(
                    "red",
                    `directory ./third_party/${module} not found. Did you clone the submodules?`,
                ),
            );

            exit(1);
        }
    }

    stdout.write(styleText("green", "All prerequisites met.\n"));
};

/**
 * Prints the duration of the build process.
 */
const printBuildInfo = (startTime: number, cfg: BuildConfig, skips: string[]) => {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    const outputPath = getOutputPath(cfg);

    const printFileSize = (path: string) => {
        if (existsSync(path)) {
            const stats = statSync(path);
            const size = (stats.size / 1024).toFixed(1);
            stdout.write(styleText(["bold", "gray"], "[OUT] "));
            stdout.write(styleText("gray", `${path} (${size} KB)\n`));
        }
    };

    if (!skips.includes("wasm")) {
        const wasmPath = outputPath.replace(".js", ".wasm");

        printFileSize(outputPath);
        printFileSize(wasmPath);
    }

    if (!skips.includes("ts")) {
        printFileSize("build/mod.js");
        printFileSize("build/mod.d.ts");
    }

    stdout.write(styleText(["bold", "greenBright"], `      Build completed in ${duration}s 📦\n`));
};

/**
 * Checks if the user wants to see the available build options. If so, print the info and exit.
 */
const checkHelp = () => {
    if (!argv.includes("--help")) {
        return;
    }

    stdout.write("Build script for jsimgui.\n");
    stdout.write("\n");
    stdout.write(styleText("bold", "Usage: [node|bun|deno]"));
    stdout.write(" build.ts [OPTIONS]\n");
    stdout.write("\n");

    stdout.write(styleText("bold", "Build options:\n"));
    stdout.write(styleText(["bold", "cyan"], "  --help                           "));
    stdout.write("  Show this info message.\n");

    stdout.write(styleText(["bold", "cyan"], "  --verbose                        "));
    stdout.write("  Show verbose output.\n");
    stdout.write("\n");

    stdout.write(styleText(["bold", "cyan"], "  --backend=[webgl|webgl2|webgpu]  "));
    stdout.write("  Choose the rendering backend for ImGui. Default is webgl2.\n");

    stdout.write(styleText(["bold", "cyan"], "  --font-loader=[truetype|freetype]"));
    stdout.write("  Choose the font loader for ImGui. Default is truetype (stb_truetype).\n");

    stdout.write(styleText(["bold", "cyan"], "  --demos                          "));
    stdout.write("  Includes the ImGui demos in the build. Default is false.\n");
    stdout.write("\n");

    stdout.write(styleText(["bold", "cyan"], "  --skip=data,bindgen,wasm,ts,fmt  "));
    stdout.write("  Skip certain build steps. Default is none.\n");

    exit(0);
};

/**
 * Entry point for the build script.
 */
const main = () => {
    checkHelp();

    const startTime = Date.now();
    const buildConfig = getBuildConfig();
    const stepSkips = getStepSkips();

    checkPrerequisites();

    const buildSteps = [
        {
            name: "data",
            msg: "Generating required files (dear_bindings, compile_commands.json)...",
            fn: buildData,
        },
        {
            name: "bindgen",
            msg: "Generating TypeScript, C++ bindings...",
            fn: buildBindgen,
        },
        {
            name: "wasm",
            msg: "Compiling WASM...",
            fn: buildWasm,
        },
        {
            name: "ts",
            msg: "Compiling .ts files...",
            fn: buildTs,
        },
        {
            name: "fmt",
            msg: "Formatting output files...",
            fn: buildFmt,
        },
    ] as const;

    for (const [idx, step] of buildSteps.entries()) {
        if (!stepSkips.includes(step.name)) {
            stdout.write(styleText(["bold", "gray"], `[${idx + 1}/${buildSteps.length}] `));
            stdout.write(styleText("white", `${step.msg}`));

            step.fn(buildConfig);
            stdout.write(styleText("green", "OK\n"));
        }
    }

    printBuildInfo(startTime, buildConfig, stepSkips);
};

main();
