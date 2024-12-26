const express = require("express");
const URL = require("../models/url.model");
const { checkAuth } = require("../middlewares/auth");
const router = express.Router();

const { blacklistedTokens } = require("../middlewares/auth");

router.get("/", checkAuth, async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  const allUrls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    allUrls,
  });
});

router.get("/signup", async (req, res) => {
  return res.render("signup");
});
router.get("/login", async (req, res) => {
  return res.render("login");
});

router.get("/logout", async (req, res) => {
  //clear the cookie for browser clients

  //--------//
  const token = req.cookies?.uid || req.headers["authorization"];

  if (token) {
    const formattedToken = token.startsWith("Bearer ")
      ? token.split("Bearer ")[1]
      : token;

    // Add token to the blacklist
    blacklistedTokens.add(formattedToken);
  }
  //-----------//
  res.clearCookie("uid");
  return res.redirect("/login");
});

module.exports = router;
