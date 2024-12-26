const express = require("express");
const urlRouter = require("./routes/url.route");
const { connectToDB } = require("./connection");

const path = require("path");
const app = express();

const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/userRoute");

const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
var cookieParser = require("cookie-parser");
const PORT = 8001;

connectToDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => {
    console.log("MongoDb connection failed!");
    process.exit(1);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//SERVE BOOTSTRAP TO EVERY ONE
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use(cookieParser());
app.use("/url", restrictToLoggedinUserOnly, urlRouter); //inline middleware

app.use(express.static(path.join(__dirname, "views"))); //cmnt

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use("/", staticRouter);
app.use("/user", userRoute);

//server-side-rendering
// app.get("/test", async (req, res) => {
//   const allUrls = await URL.find({});
//   return res.render("home", {
//     urls: allUrls,
//   });
// });

app.listen(PORT, () => console.log(`Server started at PORT = ${PORT}`));
