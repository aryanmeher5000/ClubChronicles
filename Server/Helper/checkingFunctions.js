const { isValidObjectId } = require("mongoose");

function validId(id) {
  if (!id || typeof id !== "string" || !isValidObjectId(id)) return false;
  return true;
}

module.exports = { validId };
