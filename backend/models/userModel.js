const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  const exists = await this.findOne({ email });
  // waise yahan User.findOne() use karte lekin `User`ko to ham baadme export karre hain isliye this keyword ko use karenge
  // this keyword agar use kiya hai to arrow function use nahi kar skte tradition function hi use karna hai
  // password ko hash karne k liye `bcrypt` package ko install kiya gaya hai

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10); //salt adds extra layer of security by adding random string to the password before hashing it, so that same passwords end up with different hashes.
  // higher the value inside genSalt() method, longer it takes to crack the password but it takes longer to signup the user. Default value is set 10.
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Email does not exist");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Password is incorrect");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
