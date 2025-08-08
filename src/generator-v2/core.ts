import type { ImGuiData } from "../generator/interface.ts";

/** Output container for a generator. Generators can emit TypeScript and/or C++ code. */
export interface CodeOutput {
    /** TypeScript code emitted by the generator. Empty string when nothing is generated. */
    readonly ts: string;
    /** C++ code emitted by the generator. Empty string when nothing is generated. */
    readonly cpp: string;
}

/** Execution context passed to all generators. */
export interface GeneratorContext {
    /** The filtered input metadata. */
    readonly data: ImGuiData;
}

/** Unified interface for all v2 generators (enums, structs, functions, typedefs...). */
export interface BindingGenerator {
    /** Unique identifier for the generator (e.g. "enums", "structs"). */
    readonly name: string;
    /**
     * Run the generator and return emitted code. Generators are pure; they should not write files.
     */
    run(context: GeneratorContext): CodeOutput;
}

//export const makeGenerator = ()

// /**
//  * Helper to compose multiple outputs into final TypeScript/C++ strings in a deterministic order.
//  */
// export function mergeOutputs(outputs: CodeOutput[]): CodeOutput {
//     const tsChunks: string[] = [];
//     const cppChunks: string[] = [];

//     for (const out of outputs) {
//         if (out.typescript.trim().length > 0) tsChunks.push(out.typescript);
//         if (out.cplusplus.trim().length > 0) cppChunks.push(out.cplusplus);
//     }

//     return {
//         typescript: tsChunks.join("\n"),
//         cplusplus: cppChunks.join("\n"),
//     };
// }
