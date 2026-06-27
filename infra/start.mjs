import { spawn } from "node:child_process";

const processes = [];
let shuttingDown = false;

function startProcess(name, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: "/app",
    env: process.env,
    stdio: "inherit",
    ...options,
  });

  processes.push({ name, child });

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    const reason = signal ?? code ?? 0;
    console.error(`${name} exited with ${reason}`);
    shutdown(code === null ? 1 : code);
  });
}

function shutdown(code = 0) {
  shuttingDown = true;

  for (const { child } of processes) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => {
    for (const { child } of processes) {
      if (!child.killed) {
        child.kill("SIGKILL");
      }
    }

    process.exit(code);
  }, 5000).unref();
}

process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));

const publicPort = process.env.PORT ?? "3000";
const apiPort = process.env.API_PORT ?? "8080";

startProcess("api", "node", ["apps/api/dist/server.js"], {
  env: {
    ...process.env,
    PORT: apiPort,
  },
});
startProcess("web", "node", ["apps/web/server.js"], {
  env: {
    ...process.env,
    PORT: publicPort,
  },
});
