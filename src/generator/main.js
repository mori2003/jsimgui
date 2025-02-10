/**
 * @file Generator tool for jsimgui.
 *
 * This tool generates the C++ bindings and the JavaScript API using the dear_bindings
 * data files.
 */

import { parseArgs } from "@std/cli";
import { generateBindings } from "./binding.js";

/**
 * Main entry point for the generator tool.
 */
function main() {
    const flags = parseArgs(Deno.args, {
        string: ["jsonData", "outCpp", "outJs"],
        default: {
            jsonData: "third_party/dear_bindings/dcimgui.json",
            outCpp: "intermediate/jsimgui-gen.cpp",
            outJs: "./build/mod.js",
        },
    });

    const fileData = Deno.readTextFileSync(flags.jsonData);
    generateBindings(fileData, flags.outCpp, flags.outJs);
}

main();
