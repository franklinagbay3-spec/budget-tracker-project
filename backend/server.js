const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

const { protect } = require("./middleware/authMiddleware");
const transactionRoutes = require("./routes/transactionRoutes");

app.use(cors());
app.use(express.json());

// Connect database
connectDB();

app.get("/", (req, res) => {
  res.send("Budget Tracker API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    user: req.user,
  });
});

app.use("/api/transactions", transactionRoutes);