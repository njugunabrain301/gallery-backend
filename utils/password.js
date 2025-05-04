const bcrypt = require("bcrypt");

// Function to hash a password
async function hashPassword(password) {
  const saltRounds = 10; // The number of rounds to generate the salt
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

// Function to compare a password with a hash
async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match; // Returns true if the password matches the hash, otherwise false
  } catch (error) {
    console.error("Error comparing password:", error);
    return false; // Return false in case of an error
  }
}

module.exports = { comparePassword, hashPassword };
