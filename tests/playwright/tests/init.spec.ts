import { expect, test } from "@playwright/test";

const backends = [
    { name: "WebGL", file: "webgl.html" },
    { name: "WebGL2", file: "webgl2.html" },
    { name: "WebGPU", file: "webgpu.html" },
] as const;

backends.forEach((backend) => {
    test(`Init ${backend.name}`, async ({ page }) => {
        await page.goto(`tests/playwright/tests/${backend.file}`);

        expect(
            await page.waitForEvent("console", {
                predicate: (msg) => msg.text().includes("render complete"),
            }),
        ).toBeTruthy();
    });
});
