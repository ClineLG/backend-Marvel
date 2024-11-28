const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: { type: String, unique: true },
  account: {
    username: String,
    avatar: String,
  },
  token: String,
  hash: String,
  salt: String,
  favories: Array,
});
module.exports = User;
