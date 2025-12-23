import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
    },

    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                headless: true,
                channel: "chromium",
                // Needed flags for WebGPU on Linux
                launchOptions: { args: ["--enable-unsafe-webgpu", "--enable-features=Vulkan"] },
            },
        },
    ],

    webServer: {
        command: "deno run --allow-net --allow-read jsr:@std/http/file-server -p 3000 ../../",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        stdout: "pipe",
    },
});
