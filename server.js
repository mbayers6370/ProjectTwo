require("dotenv").config();
const express = require("express");
const db = require("./models");
const passport = require("passport");
const passportSetup = require("./passport/passport-setup");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const restRoutes = require("./routes/restaurant");
const likesRoutes = require("./routes/likes");

// initialize express app
const app = express();
const PORT = process.env.PORT || 8888;

// express will look for ejs templates
app.set("view engine", "ejs");
app.use(express.static("public"));

// middleware for using req.body from post forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// sets information for cookie for a day
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    // save cookie keys in process.env
    keys: [process.env.COOKIE],
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
app.use("/restaurant", restRoutes);
app.use("/likes", likesRoutes);

// opening page
app.get("/", (req, res) => {
  res.render("login");
});

// initialize sequelize and start server
db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
  });
});
