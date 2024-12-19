const ids = require("short-id");

const URL = require("../models/url.model");
async function generateNewShortURL(req, res) {
  const body = req.body;
  if (!body) {
    return res.status(404).json({ error: "url is required!" });
  }
  const shortID = ids.generate();

  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.render("home", {
    id: shortID,
  });

  // return res.json({ id: shortID });
}

async function redirectFunction(req, res) {
  const shortID = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    {
      shortID,
    },
    {
      $push: {
        visitHistory: {
          timestamps: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
}
async function analyticFunction(req, res) {
  const shortID = req.params.shortID;
  const result = await URL.findOne({ shortID });

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  generateNewShortURL,
  redirectFunction,
  analyticFunction,
};
