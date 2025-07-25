const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
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
  expiryDate: {
    type: Date,
    default: function () {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  image: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  status: {
    type: String,
    enum: ["PENDING", "ASSIGNED", "COMPLETED", "REJECTED", "CANCELLED"],
    default: "PENDING",
  },
  // Add availability field
  availability: {
    type: String,
    enum: ["available", "notavailable"],
    default: "available",
  },
  // Fix the reference to match the actual model name
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Changed from 'User' to 'user' to match your donor reference
  },
  // Add assignedVolunteer field
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Remove incorrect pre-save middleware that sets availability to 'available' when status is COMPLETED

// Add index for geospatial queries
DonationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("donation", DonationSchema);
