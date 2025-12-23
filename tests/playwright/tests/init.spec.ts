import path from "node:path";
import { expect, test } from "@playwright/test";

test("Init WebGL", async ({ page }) => {
    await page.goto(`tests/playwright/tests/webgl.html`);

    expect(
        await page.waitForEvent("console", {
            predicate: (msg) => msg.text().includes("render complete"),
            timeout: 5000,
        }),
    ).toBeTruthy();
});

test("Init WebGL2", async ({ page }) => {
    await page.goto(`tests/playwright/tests/webgl2.html`);

    expect(
        await page.waitForEvent("console", {
            predicate: (msg) => msg.text().includes("render complete"),
            timeout: 5000,
        }),
    ).toBeTruthy();
});

test("Init WebGPU", async ({ page }) => {
    await page.goto(`tests/playwright/tests/webgpu.html`);

    expect(
        await page.waitForEvent("console", {
            predicate: (msg) => msg.text().includes("render complete"),
            timeout: 5000,
        }),
    ).toBeTruthy();
});
