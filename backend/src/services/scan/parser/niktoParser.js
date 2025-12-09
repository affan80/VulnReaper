// src/services/scan/parser/niktoParser.js
export default function niktoParser(output) {
  const lines = output.split("\n");
  const findings = [];

  lines.forEach((line) => {
    if (line.includes("OSVDB") || line.includes("VULN")) {
      findings.push({
        description: line.trim(),
        severity: "High",
      });
    }
  });

  return findings;
};
