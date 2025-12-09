import Vulnerability from "../models/Vulnerability.js";
import ScanHistory from "../models/ScamHistory.js";
import Report from "../models/Report.js";

const getAnalytics = async () => {
  const totalVulnerabilities = await Vulnerability.countDocuments();
  const totalReports = await Report.countDocuments();
  const totalScans = await ScanHistory.countDocuments();

  const vulnerabilitiesBySeverity = await Vulnerability.aggregate([
    { $group: { _id: "$severity", count: { $sum: 1 } } },
  ]);

  const recentActivity = await ScanHistory.find()
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    totalVulnerabilities,
    totalReports,
    totalScans,
    vulnerabilitiesBySeverity,
    recentActivity,
  };
};

export default { getAnalytics };
