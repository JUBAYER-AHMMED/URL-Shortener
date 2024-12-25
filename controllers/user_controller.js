const { v4: uuidv4 } = require("uuid");
const { setUser, getUser } = require("../service/auth");
const USER = require("../models/user.model");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;

  await USER.create({
    name,
    email,
    password,
  });

  console.log(USER);

  return res.render("home");
}
async function handlelogin(req, res) {
  const { email, password } = req.body;

  const user = await USER.findOne({ email, password });
  if (!user) {
    return res.render("login", { error: "Invalid email or password!" });
  }
  const sessionId = uuidv4();

  setUser(sessionId, user);

  res.cookie("uid", sessionId);

  return res.redirect("/");
}

module.exports = {
  handleUserSignUp,
  handlelogin,
};
