const express = require("express");
const router = require("./routes/url.route");
const { connectToDB } = require("./connection");
const URL = require("./models/url.model");
const path = require("path");
const app = express();

const staticRouter = require("./routes/staticRouter");

const PORT = 8001;

connectToDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log("MongoDb connection failed!"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", router);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use("/", staticRouter);

//server-side-rendering
// app.get("/test", async (req, res) => {
//   const allUrls = await URL.find({});
//   return res.render("home", {
//     urls: allUrls,
//   });
// });

app.listen(PORT, () => console.log(`Server started at PORT = ${PORT}`));
