const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

connectDB();

app.use(express.json({ extended: false }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/ngos", require("./routes/api/ngos"));
app.use("/api/donations", require("./routes/api/donations"));
app.use("/api/requests", require("./routes/api/requests"));
app.use("/api/agents", require("./routes/api/agents"));
app.use("/api/uploads", require("./routes/api/uploads"));
app.use("/api/volunteers", require("./routes/api/volunteers"));
app.use("/api/contact", require("./routes/api/contact"));
app.use("/api/stats", require("./routes/api/stats"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
