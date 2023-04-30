const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-z]{1,25}$/,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.methods.generatePassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// please encrypt message before storing in db

const userModel = mongoose.model("userData", userSchema);
const messageModel = mongoose.model("messageData", messageSchema);

module.exports = {
  userModel,
  messageModel,
};
