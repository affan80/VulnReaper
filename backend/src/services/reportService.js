import Vulnerability from "../models/Vulnerability.js";
import Report from "../models/Report.js";

const generateReport = async (userId, vulnerabilities) => {
  const report = new Report({
    name: `Report ${new Date().toISOString()}`,
    createdBy: userId,
    vulnerabilities: vulnerabilities.map((v) => v._id),
  });

  await report.save();
  return report;
};

export default { generateReport };
