const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).json({ message: "missing token" });
  }

  const tokenToTest = req.headers.authorization.replace("Bearer ", "");

  const isTokenExist = await User.findOne({ token: tokenToTest }).select(
    "account"
  );

  if (!isTokenExist) {
    return res.status(400).json({ message: "wrong token" });
  }

  req.user = isTokenExist;
  next();
};

module.exports = isAuthenticated;
