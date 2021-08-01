require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const passport = require("passport");

const mongoose = require("./db/mongoose");

const User = require("./schema/userSchema");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hurray, Authenticated!! ${req.user.username}`);
  } else {
    res.send(`Not authenticated yet!!`);
  }
});

app.post("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(400);
    res.send({ message: "Already authenticated" });
  } else if (
    !(req.body.username && req.body.password) ||
    req.body.username == "" ||
    req.body.password == ""
  ) {
    res.status(400).send({ message: "Email and password should not be empty" });
  } else {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    req.login(user, (err) => {
      if (err) {
        console.log(err);
        res.send({ messsage: "Incorrect Email Id or Password" });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.send({ message: "done" });
        });
      }
    });
  }
});

app.post("/signup", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(400);
    res.send({ message: "Bad Request" });
  } else if (
    !(req.body.username && req.body.email && req.body.password) ||
    req.body.username == "" ||
    req.body.email == "" ||
    req.body.password == ""
  ) {
    res.status(400);
  } else if (req.body.password !== req.body.repassword) {
    res.send({ message: "Passwords do no match" });
  } else {
    User.register(
      {
        username: String(req.body.username),
        email: String(req.body.email),
        books: [],
      },
      req.body.password,
      (err, user) => {
        if (err) {
          res.send({
            message: "something went wrong, lets resolve later",
            err,
          });
        } else {
          passport.authenticate("local")(req, res, () => {
            res.send({ message: "done" });
          });
        }
      }
    );
  }
});

app.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logOut();
  }
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
