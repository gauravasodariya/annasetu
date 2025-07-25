const User = require('../models/User');
const Donation = require('../models/Donation');
const Request = require('../models/Request');

async function getDashboardStats(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const totalUsers = await User.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'PENDING' });
    const activeVolunteers = await User.countDocuments({ role: 'volunteer', isActive: true });
    const ngos = await User.countDocuments({ role: 'ngo' });
    res.json({ totalUsers, totalDonations, totalRequests, pendingRequests, activeVolunteers, ngos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function listDonations(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function listRequests(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  getDashboardStats,
  listDonations,
  listRequests,
};

