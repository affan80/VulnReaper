import { exec } from "child_process";
import { promisify } from "util";
import nmapParser from "./parser/nmapParser.js";

const execAsync = promisify(exec);

const scan = async (target) => {
  try {
    const { stdout } = await execAsync(`nmap -sV -p- ${target}`);
    const vulnerabilities = nmapParser.parse(stdout);
    return vulnerabilities;
  } catch (error) {
    throw new Error(`Nmap scan failed: ${error.message}`);
  }
};

export default { scan };
