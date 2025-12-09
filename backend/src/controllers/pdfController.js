// src/controllers/pdfController.js
import Report from "../models/Report.js";
import Vulnerability from "../models/Vulnerability.js";
import generateReportPDF from "../services/reportPDF.js";
import fs from "fs";

export default {
  async generate(req, res) {
    try {
      const report = await Report.findById(req.params.id).populate("createdBy");
      if (!report)
        return res.status(404).json({ success: false, message: "Report not found" });

      const vulns = await Vulnerability.find({
        _id: { $in: report.vulnerabilities },
      });

      const pdfPath = await generateReportPDF(report, vulns);

      res.json({
        success: true,
        message: "PDF generated successfully",
        path: pdfPath,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async download(req, res) {
    try {
      const reportId = req.params.id;
      const filepath = `./generated_reports/report_${reportId}.pdf`;

      if (!fs.existsSync(filepath))
        return res.status(404).json({ success: false, message: "PDF not found" });

      res.download(filepath);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
