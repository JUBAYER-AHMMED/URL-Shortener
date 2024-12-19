const express = require("express");
const {
  generateNewShortURL,
  redirectFunction,
  analyticFunction,
} = require("../controllers/url_controller");
const router = express.Router();

router.post("/", generateNewShortURL);
router.get("/:shortID", redirectFunction);
router.get("/analytics/:shortID", analyticFunction);

module.exports = router;
