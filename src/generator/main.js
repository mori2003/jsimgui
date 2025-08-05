/**
 * @file Generator tool for jsimgui.
 *
 * This tool generates the C++ bindings and the JavaScript API using the dear_bindings
 * data files.
 */

import { parseArgs } from "@std/cli";
import { generateBindings } from "./binding.js";

function main() {
    const flags = parseArgs(Deno.args, {
        string: ["jsonData", "outCpp", "outJs"],
    });

    const fileContent = Deno.readTextFileSync(flags.jsonData);

    if (!fileContent) {
        throw new Error(`Failed to read file: ${flags.jsonData}`);
    }

    generateBindings(fileContent, flags.outCpp, flags.outJs);
}

main();
