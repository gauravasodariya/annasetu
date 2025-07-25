const Donation = require("../models/Donation");
const User = require("../models/User");

async function getAssignments(req, res) {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const Donation = require("../models/Donation");
    const Request = require("../models/Request");
    // Find all requests that have a donationId
    const requests = await Request.find({ donationId: { $ne: null } })
      .populate("ngo", "name email address")
      .lean();
    // Get the donationIds from requests
    const requestedDonationIds = requests.map((r) => r.donationId.toString());
    // Get donations assigned to this volunteer or unassigned, but only if they have a request
    const donations = await Donation.find({
      _id: { $in: requestedDonationIds },
      $or: [
        { status: "PENDING", assignedVolunteer: null },
        { assignedVolunteer: req.user.id },
      ],
    })
      .populate("donor", "name email contactNumber")
      .sort({ createdAt: -1 })
      .lean();
    // Attach delivery address and NGO info from the request
    const donationsWithRequest = donations.map((donation) => {
      const req = requests.find(
        (r) => r.donationId.toString() === donation._id.toString(),
      );
      let ngoAddress = null;
      if (req && req.ngo && req.ngo.address) {
        ngoAddress = req.ngo.address;
      }
      return {
        ...donation,
        deliveryAddress: donation.pickupAddress,
        ngo: req ? req.ngo : null,
        ngoName: req ? req.ngoName : null,
        ngoEmail: req ? req.email : null,
        ngoAddress,
        requestId: req ? req._id : null,
      };
    });
    res.json(donationsWithRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function acceptAssignment(req, res) {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ msg: "Donation not found" });
    donation.status = "ASSIGNED";
    donation.availability = "notavailable";
    donation.assignedVolunteer = req.user.id;
    await donation.save();

    // Update related request status to ACCEPTED
    const Request = require("../models/Request");
    const request = await Request.findOne({ donationId: donation._id });
    if (request) {
      request.status = "ACCEPTED";
      await request.save();
    }

    res.json({ msg: "Assignment accepted", donation, request });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function completeAssignment(req, res) {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ msg: "Donation not found" });
    if (donation.assignedVolunteer?.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized for this donation" });
    }
    donation.status = "COMPLETED";
    donation.availability = "notavailable";
    await donation.save();

    // Update related request status to COMPLETED
    const Request = require("../models/Request");
    const request = await Request.findOne({ donationId: donation._id });
    if (request) {
      request.status = "COMPLETED";
      await request.save();
    }

    res.json({ msg: "Assignment completed", donation, request });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function getProfile(req, res) {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const volunteer = await User.findById(req.user.id).select("-password");
    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function getAssignmentDetails(req, res) {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const donation = await Donation.findById(req.params.id).populate(
      "donor",
      "name email contactNumber",
    );
    if (!donation) return res.status(404).json({ msg: "Assignment not found" });
    res.json(donation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  getAssignments,
  acceptAssignment,
  completeAssignment,
  getProfile,
  getAssignmentDetails,
};
