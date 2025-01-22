const bcrypt = require("bcrypt");

// Encrypting password
async function encryptPassword(userObj) {
  try {
    const salt = await bcrypt.genSalt(11);
    const encryptedPassword = await bcrypt.hash(userObj.password, salt);
    Object.assign(userObj, { password: encryptedPassword });
    return userObj;
  } catch (error) {
    throw new Error("Password encryption failed.");
  }
}

// Decrypting password
async function decryptPassword(inputData, dbData) {
  try {
    return await bcrypt.compare(inputData, dbData);
  } catch (error) {
    return false;
  }
}

module.exports = { encryptPassword, decryptPassword };
