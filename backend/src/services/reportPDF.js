import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateReportPDF = async (report, vulnerabilities) => {
  const doc = new PDFDocument();
  const fileName = `report_${report._id}.pdf`;
  const filePath = path.join("generated_reports", fileName);

  // Ensure directory exists
  if (!fs.existsSync("generated_reports")) {
    fs.mkdirSync("generated_reports");
  }

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Title
  doc.fontSize(20).text("Vulnerability Report", { align: "center" });
  doc.moveDown();

  // Report Info
  doc.fontSize(14).text(`Report Name: ${report.name}`);
  doc.text(`Created By: ${report.createdBy.username}`);
  doc.text(`Created At: ${report.createdAt}`);
  doc.moveDown();

  // Vulnerabilities
  doc.fontSize(16).text("Vulnerabilities:");
  doc.moveDown();

  vulnerabilities.forEach((vuln, index) => {
    doc.fontSize(12).text(`${index + 1}. ${vuln.name}`);
    doc.text(`Target: ${vuln.target}`);
    doc.text(`Severity: ${vuln.severity}`);
    doc.text(`Status: ${vuln.status}`);
    doc.text(`Description: ${vuln.description}`);
    doc.moveDown();
  });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(filePath));
    writeStream.on("error", reject);
  });
};

export default generateReportPDF;
