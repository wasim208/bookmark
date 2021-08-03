const mongoose = require("mongoose");
const validator = require("validator");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    reqired: [true, "Email Address Required"],
    trim: true,
    lowercase: [true, "Invalid Email Address"],
    unique: [true, "You have already registered"],
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: "Invalid email address provided",
    },
  },
  username: {
    type: String,
    required: [true, "Username Required"],
    unique: [true, "Username Taken"],
    minLength: 2,
    trim: true,
  },
  password: {
    type: String,
  },
  books: [
    {
      img_link: String,
      title: String,
      reading: Boolean,
      genre: String,
      blog: String,
      rating: {
        type: [Number],
      },
    },
  ],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

module.exports = User;
