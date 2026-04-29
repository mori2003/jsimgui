import { argv, exit, stdout } from "node:process";
import { execSync } from "node:child_process";
import { statSync, mkdirSync, rmSync } from "node:fs";
import { generateImGuiBindings } from "./src/imgui/main.ts";

const args = argv.slice(2);
const cfg = {
  help: args.includes("--help"),
  extensions: args.includes("--extensions"),
  freetype: args.includes("--freetype"),
  generateData: args.includes("--generate-data"),
};

const HELP = "Usage: node|bun|deno build.ts [--extensions] [--freetype]\n";

if (cfg.help) {
  stdout.write(HELP);
  exit(0);
}

if (cfg.generateData) {
  stdout.write("Generating required metadata...\n");
  const script = "python third_party/dear_bindings/dear_bindings.py";
  stdout.write(
    execSync(
      `${script} --nogeneratedefaultargfunctions -o src/imgui/data/dcimgui third_party/imgui/imgui.h`,
    ),
  );
  stdout.write(
    execSync(
      `${script} -o src/imgui/data/dcimgui_internal --include third_party/imgui/imgui.h third_party/imgui/imgui_internal.h`,
    ),
  );
  stdout.write(
    execSync(
      `${script} -o src/imgui/data/dcimgui_impl_opengl3 --backend third_party/imgui/backends/imgui_impl_opengl3.h`,
    ),
  );
  stdout.write(
    execSync(
      `${script} -o src/imgui/data/dcimgui_impl_wgpu --backend third_party/imgui/backends/imgui_impl_wgpu.h`,
    ),
  );
  rmSync("src/imgui/data/dcimgui_imconfig.json", { force: true });
  rmSync("src/imgui/data/dcimgui_internal.json", { force: true });
  rmSync("src/imgui/data/dcimgui_internal_imconfig.json", { force: true });
  rmSync("src/imgui/data/dcimgui_internal_imgui.json", { force: true });
  rmSync("src/imgui/data/dcimgui_impl_opengl3.json", { force: true });
  rmSync("src/imgui/data/dcimgui_impl_opengl3_imconfig.json", { force: true });
  rmSync("src/imgui/data/dcimgui_impl_wgpu.json", { force: true });
  rmSync("src/imgui/data/dcimgui_impl_wgpu_imconfig.json", { force: true });
  stdout.write("Done.\n");
  exit(0);
}

const emccConfig = {
  sources: [
    "src/imgui/gen/imgui.cpp",
    "src/imgui/data/dcimgui.cpp",
    "src/imgui/data/dcimgui_internal.cpp",
    "src/imgui/data/dcimgui_impl_opengl3_fix.cpp",
    "src/imgui/data/dcimgui_impl_wgpu_fix.cpp",
    "third_party/imgui/imgui.cpp",
    "third_party/imgui/imgui_demo.cpp",
    "third_party/imgui/imgui_draw.cpp",
    "third_party/imgui/imgui_tables.cpp",
    "third_party/imgui/imgui_widgets.cpp",
    "third_party/imgui/backends/imgui_impl_opengl3.cpp",
    "third_party/imgui/backends/imgui_impl_wgpu.cpp",
  ],
  includes: ["src/imgui/data", "third_party/imgui/", "third_party/imgui/backends"],
  flags: [
    "--cache=./.em_cache",
    "-std=c++26",
    "-lembind",
    `-sEXPORTED_RUNTIME_METHODS=FS,MEMFS,GL,WebGPU`,
    "-sENVIRONMENT=web",
    "-sWASM_BIGINT",
    "-sMIN_WEBGL_VERSION=1",
    "-sMAX_WEBGL_VERSION=2",
    "--use-port=emdawnwebgpu",
    "-sMODULARIZE=1",
    "-sSINGLE_FILE",
    "-sEXPORT_ES6=1",
    "-DIMGUI_DISABLE_OBSOLETE_FUNCTIONS=1",
    "-Oz",
    "-flto",
    "-sMALLOC=emmalloc",
    "-sALLOW_MEMORY_GROWTH=1",
    "-sASSERTIONS=1",
  ],
};

if (cfg.freetype) {
  emccConfig.sources.push("third_party/imgui/misc/freetype/imgui_freetype.cpp");
  emccConfig.flags.push("-sUSE_FREETYPE=1");
  emccConfig.flags.push("-DIMGUI_USE_WCHAR32=1");
  emccConfig.flags.push("-DIMGUI_ENABLE_FREETYPE=1");
}

if (cfg.extensions) {
  emccConfig.sources.push("third_party/imnodes/imnodes.cpp");
  emccConfig.includes.push("third_party/imnodes/");
}

const outPath = `build/loader${cfg.extensions ? "-extensions" : ""}${cfg.freetype ? "-freetype" : ""}.js`;
const cmd = [
  "emcc",
  ...emccConfig.sources,
  ...emccConfig.includes.map((i) => `-I${i}`),
  ...emccConfig.flags,
  "-o",
  outPath,
].join(" ");

stdout.write("Generating Bindings...\n");
generateImGuiBindings();

stdout.write("Compiling WASM...\n");
mkdirSync("build/", { recursive: true });
stdout.write(execSync(cmd).toString());

stdout.write("Compiling TS...\n");
stdout.write(execSync("node_modules/.bin/tsc --project src/tsconfig.build.json").toString());

stdout.write("Formatting Files...\n");
stdout.write(execSync("node_modules/.bin/oxfmt").toString());

stdout.write("Done.\n");

stdout.write("Output:\n");
const outputFiles = ["build/imgui.d.ts", "build/imgui.js", `${outPath}`];
for (const file of outputFiles) {
  const stats = statSync(file);
  const size = (stats.size / 1024).toFixed(1);
  stdout.write(`${file} ${size} KB\n`);
}
