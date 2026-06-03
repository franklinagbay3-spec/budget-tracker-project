const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      default: "",
    },
    target: {
      type: Number,
      required: true,
    },
    saved: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: "savings",
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);