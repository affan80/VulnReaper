export const calculateSeverity = (cvssScore) => {
  if (cvssScore >= 9.0) return "Critical";
  if (cvssScore >= 7.0) return "High";
  if (cvssScore >= 4.0) return "Medium";
  if (cvssScore >= 0.1) return "Low";
  return "Info";
};
