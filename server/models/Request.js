const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "donation",
    required: false,
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  ngoName: {
    type: String,
  },
  email: {
    type: String,
  },
  foodType: {
    type: String,
    required: true,
  },
  foodCategory: {
    type: String,
  },
  quantity: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELED", "COMPLETED"],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("request", RequestSchema);
