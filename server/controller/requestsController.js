const Request = require("../models/Request");
const Donation = require("../models/Donation");
const User = require("../models/User");

async function createRequest(req, res) {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ msg: "Only NGOs can create requests" });
    }
    const { donationId, foodType, quantity, notes, foodCategory } = req.body;
    console.log("createRequest input:", {
      userId: req.user.id,
      userRole: req.user.role,
      donationId,
      foodType,
      quantity,
      notes,
      foodCategory,
    });
    const ngoUser = await User.findById(req.user.id);
    if (!ngoUser) {
      console.error("NGO user not found for id:", req.user.id);
      return res
        .status(404)
        .json({ msg: "NGO user not found. Please re-login." });
    }
    const request = new Request({
      ngo: req.user.id,
      ngoName: ngoUser.name,
      email: ngoUser.email,
      foodType,
      foodCategory,
      quantity,
      notes,
      status: "PENDING",
      donationId: donationId || undefined,
    });
    await request.save();
    if (donationId) {
      await Donation.findByIdAndUpdate(donationId, {
        availability: "notavailable",
      });
    }
    res.json(request);
  } catch (err) {
    console.error("Request creation error:", err);
    res
      .status(500)
      .json({ msg: "Server error", error: err.message, details: err.stack });
  }
}

async function listRequests(req, res) {
  try {
    let requests;
    if (req.user.role === "ngo") {
      requests = await Request.find({ ngo: req.user.id }).sort({
        createdAt: -1,
      });
    } else if (req.user.role === "admin" || req.user.role === "donor") {
      requests = await Request.find().sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ msg: "Not authorized" });
    }
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getRequestById(req, res) {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }
    if (
      req.user.role !== "admin" &&
      req.user.role !== "donor" &&
      request.ngo.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    if (!["PENDING", "ACCEPTED", "REJECTED", "CANCELED"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }
    if (req.user.role === "ngo") {
      if (request.ngo.toString() !== req.user.id) {
        return res.status(403).json({ msg: "Not authorized" });
      }
      if (status === "CANCELED" && request.status !== "PENDING") {
        return res
          .status(400)
          .json({ msg: "Only pending requests can be canceled" });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function cancelRequest(req, res) {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }
    if (request.ngo.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Not authorized to cancel this request" });
    }
    if (request.status !== "PENDING") {
      return res
        .status(400)
        .json({ msg: "Only pending requests can be canceled" });
    }
    request.status = "CANCELED";
    await request.save();
    res.json({ msg: "Request canceled successfully", request });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function deleteRequest(req, res) {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }
    if (request.ngo.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this request" });
    }
    if (req.user.role !== "admin" && request.status !== "PENDING") {
      return res
        .status(400)
        .json({ msg: "Only pending requests can be deleted" });
    }
    await Request.findByIdAndRemove(req.params.id);
    res.json({ msg: "Request deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function listRequestsForCurrentNgo(req, res) {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const requests = await Request.find({ ngo: req.user.id });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createRequest,
  listRequests,
  getRequestById,
  updateStatus,
  cancelRequest,
  deleteRequest,
  listRequestsForCurrentNgo,
};
