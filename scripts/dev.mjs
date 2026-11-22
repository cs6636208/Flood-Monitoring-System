import { spawn } from "node:child_process";
import { createServer } from "vite";

const apiProcess = spawn(process.execPath, ["server/index.mjs"], {
  stdio: "inherit",
  windowsHide: true,
});

const viteServer = await createServer({
  server: { host: "127.0.0.1" },
});

let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  apiProcess.kill("SIGTERM");
  await viteServer.close();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
apiProcess.once("exit", (code) => {
  if (!shuttingDown && code !== 0) {
    console.error(`Mock API exited with code ${code ?? "unknown"}.`);
    void shutdown();
  }
});

await viteServer.listen();
console.log("\nFlood Monitor demo is ready:");
console.log("  Web:     http://127.0.0.1:5173");
console.log("  Mock API: http://127.0.0.1:8787/api/health\n");
viteServer.printUrls();
