import { exec } from "child_process";
import { promisify } from "util";
import masscanParser from "./parser/masscanParser.js";

const execAsync = promisify(exec);

const scan = async (target) => {
  try {
    const { stdout } = await execAsync(`masscan ${target} --ports 1-65535 --rate 1000`);
    const vulnerabilities = masscanParser.parse(stdout);
    return vulnerabilities;
  } catch (error) {
    throw new Error(`Masscan scan failed: ${error.message}`);
  }
};

export default { scan };
