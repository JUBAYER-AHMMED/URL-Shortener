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

  try {
    const user = await USER.findOne({ email, password });
    if (!user) {
      return res.render("login", { error: "Invalid email or password!" });
    }

    const token = setUser(user);

    //check for accept header to determine the client type

    const isBrowserRequest = req.headers["accept"]?.includes("text/html");
    if (isBrowserRequest) {
      res.cookie("uid", token, { httpOnly: true });

      return res.redirect("/");
    } else {
      //mobile app or API client: send json response
      return res.json({ token, message: "Login successful" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);

    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleUserSignUp,
  handlelogin,
};
