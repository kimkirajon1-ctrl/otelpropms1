const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/rooms", require("./routes/rooms.routes"));

app.get("/", (req, res) => {
  res.send("PMS API RUNNING");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port", PORT));
