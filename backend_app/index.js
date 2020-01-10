const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users");
const auth = require("./routes/auth");
const store = require("./routes/stores");
const password = require("./routes/password_reset");
var get_ip = require("ipware")().get_ip;
const expressip = require("express-ip");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressip().getIpInfoMiddleware);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/store", store);
app.use("", password);
mongoose
  .connect("mongodb://localhost/mapbox-app", {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.log("Couldn't connected to MongoDB", error));

app.get("/api/test", (req, res, next) => {
  const ipInfo = req.ipInfo;
  var message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country}`;
  res.send(message);
});
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`App is listining on port ${port}`));
