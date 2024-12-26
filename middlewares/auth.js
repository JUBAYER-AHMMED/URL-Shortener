const { getUser } = require("../service/auth");

const blacklistedTokens = new Set();

async function restrictToLoggedinUserOnly(req, res, next) {
  // const userUid = req.cookies.uid; //rmv cmnt

  console.log(req.headers);
  const userUid = req.cookies?.uid || req.headers["authorization"]; //cmnt it
  if (!userUid) {
    console.error("Authorization header or cookie is missing");
    return res.redirect("/login");
  }
  // const token = userUid.split("Bearer ")[1]; //cmnt it
  // // const user = getUser(userUid);  rmv cmnt
  // const user = getUser(token);
  // if (!user) {
  //   return res.redirect("/login");
  // }
  // req.user = user;
  // next();

  const token = userUid.startsWith("Bearer ")
    ? userUid.split("Bearer ")[1]
    : userUid;

  if (blacklistedTokens.has(token)) {
    console.error("Token is blacklisted.");
    return res.redirect("/login");
  }
  const user = getUser(token);
  if (!user) {
    console.error("Invalid or expired token.");
    return res.redirect("/login");
  }
  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  // // const userUid = req.cookies.uid;  //rmv cmnt

  // console.log(req.headers);
  // const userUid = req.headers["authorization"]; //cmnt it

  // const token = userUid.split("Bearer ")[1]; //cmnt it
  // // const user = getUser(userUid);  //rmv cmnt

  // const user = getUser(token);
  // req.user = user;
  // next();

  const userUid = req.cookies?.uid || req.headers["authorization"];
  if (!userUid) {
    console.warn("Authorization header is missing.");
    req.user = null;
    return next();
  }

  const token = userUid.startsWith("Bearer ")
    ? userUid.split("Bearer ")[1]
    : userUid;

  if (blacklistedTokens.has(token)) {
    console.warn("Token is blacklisted");

    req.user = null;
    return next();
  }
  const user = getUser(token);
  req.user = user || null;
  next();
}
module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth,
  blacklistedTokens,
};
