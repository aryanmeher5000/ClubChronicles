function sanitizer(obj) {
  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== "null" &&
      value !== "undefined" &&
      !(typeof value === "string" && value.trim() === "")
    ) {
      if (typeof value === "object" && !Array.isArray(value)) {
        // Keep nested objects as-is
        sanitized[key] = sanitizer(value);
      } else if (Array.isArray(value)) {
        // Filter and sanitize array elements
        sanitized[key] = value
          .map((item) => (typeof item === "object" ? sanitizer(item) : item))
          .filter(
            (item) =>
              item !== null &&
              item !== undefined &&
              item !== "" &&
              item !== "null" &&
              item !== "undefined" &&
              !(typeof item === "string" && item.trim() === "")
          );
      } else {
        // Keep valid primitive values
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

function inputSanitizer(req, res, next) {
  if (req?.body && typeof req?.body !== "object") return res.status(400).json({ error: "Provide valid data!" });

  req.body = sanitizer(req.body);
  next();
}

module.exports = inputSanitizer;
module.exports.sanitizer = sanitizer;
