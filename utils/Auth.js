const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const generateToken = (payload, expiresIn = "60m") => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn });
};

async function isValid(token) {
  return await jwt.verify(token, process.env.JWT_SECRET, (err, bid) => {
    if (err) return false;
    return bid;
  });
}

module.exports = { authenticate, generateToken, isValid };
