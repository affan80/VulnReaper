// src/services/scan/niktoScanner.js
import { spawn } from "child_process";
import niktoParser from "./parser/niktoParser.js";
import * as envModule from "../../config/env.js";

const env = envModule.default ?? envModule;
const { SCAN_TIMEOUT = 300000 } = env;

export default function runNikto(target) {
  return new Promise((resolve, reject) => {
    const args = ["-h", target, "-o", "-"]; // Output to stdout

    const nikto = spawn("nikto", args, { timeout: SCAN_TIMEOUT });

    let output = "";
    nikto.stdout.on("data", (d) => (output += d.toString()));
    nikto.stderr.on("data", () => {});

    nikto.on("close", (code) => {
      if (code !== 0) return reject("Nikto scan failed");
      const findings = niktoParser(output);
      resolve(findings);
    });
  });
};
