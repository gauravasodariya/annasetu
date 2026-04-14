const fs = require('fs');
const Donation = require('../models/Donation');
const User = require('../models/User');

async function getCategories(req, res) {
  try {
    const categories = await Donation.distinct('foodCategory');
    const validCategories = categories.filter((c) => c && c.trim() !== '');

    if (validCategories.length === 0) {
      return res.json(['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Protein', 'Snacks', 'Beverages', 'Other']);
    }

    res.json(validCategories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function getAvailableDonations(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const donations = await Donation.find({
      status: 'COMPLETED',
      availability: 'available',
      expiryDate: { $gte: today },
    }).sort({ expiryDate: 1 });

    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function getDonorDonations(req, res) {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('assignedAgent', 'name phone email')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error('Error fetching donor donations:', err.message);
    res.status(500).send('Server Error');
  }
}

async function getAdminDashboardDonations(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const donations = await Donation.find({ assignedAgent: req.user.id })
      .sort({ date: -1 })
      .populate('donor', 'name');

    const pendingDonations = await Donation.find({ status: 'PENDING' })
      .sort({ date: -1 })
      .populate('donor', 'name');

    const allDonations = [...donations, ...pendingDonations];
    res.json(allDonations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function getAgentsForAssignment(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized as admin' });
    }

    const agents = await User.find({ role: 'volunteer' })
      .select('name email phone')
      .sort({ name: 1 });

    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function getAllDonations(req, res) {
  try {
    const donations = await Donation.find()
      .sort({ date: -1 })
      .populate('donor', 'name');

    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function createDonation(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role !== 'donor') {
      return res.status(403).json({ msg: 'Only donors can create donations' });
    }

    const donationData = {
      donor: req.user.id,
      foodType: req.body.foodType,
      quantity: req.body.quantity,
      pickupAddress: req.body.pickupAddress,
      status: 'PENDING',
    };

    if (req.body.foodCategory) donationData.foodCategory = req.body.foodCategory;
    if (req.body.expiryDate) donationData.expiryDate = new Date(req.body.expiryDate);
    if (req.body.description) donationData.description = req.body.description;
    if (req.body.contactNumber) donationData.contactNumber = req.body.contactNumber;

    if (req.file) {
      donationData.image = `/uploads/${req.file.filename}`;
    }

    if (req.body.latitude && req.body.longitude) {
      donationData.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
      };
    }

    const donation = new Donation(donationData);
    const savedDonation = await donation.save();

    res.json(savedDonation);
  } catch (err) {
    console.error('Donation creation error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}

async function getDonationById(req, res) {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone')
      .populate('assignedAgent', 'name email phone');

    if (!donation) {
      return res.status(404).json({ msg: 'Donation not found' });
    }

    res.json(donation);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Donation not found' });
    }

    res.status(500).send('Server Error');
  }
}

async function updateAvailability(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ msg: 'Donation not found' });
    }

    donation.availability = req.body.availability;
    await donation.save();

    res.json(donation);
  } catch (err) {
    console.error('Error updating availability:', err.message);
    res.status(500).send('Server Error');
  }
}

async function getAvailableDonationsForNgo(req, res) {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const donations = await Donation.find({
      availability: 'available',
      status: 'COMPLETED',
    })
      .sort({ expiryDate: 1 })
      .populate('donor', 'name');

    res.json(donations);
  } catch (err) {
    console.error('Error fetching available donations:', err.message);
    res.status(500).send('Server Error');
  }
}

async function updateStatusAssignAgent(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized as admin' });
    }

    const { status, assignedAgent } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ msg: 'Donation not found' });
    }

    donation.status = status;

    if (assignedAgent) {
      const agent = await User.findById(assignedAgent);

      if (!agent) {
        return res.status(404).json({ msg: 'Agent not found' });
      }

      donation.assignedAgent = assignedAgent;
    }

    await donation.save();

    const updatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email phone')
      .populate('assignedAgent', 'name email phone');

    res.json({
      donation: updatedDonation,
      msg: `Donation ${status.toLowerCase()} successfully`,
    });
  } catch (err) {
    console.error('Error updating donation status:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
}

async function updateDonation(req, res) {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ msg: 'Donation not found' });
    }

    if (donation.donor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this donation' });
    }

    const updateData = {};

    if (req.body.foodType) updateData.foodType = req.body.foodType;
    if (req.body.foodCategory) updateData.foodCategory = req.body.foodCategory;
    if (req.body.quantity) updateData.quantity = req.body.quantity;
    if (req.body.pickupAddress) updateData.pickupAddress = req.body.pickupAddress;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.contactNumber) updateData.contactNumber = req.body.contactNumber;

    if (req.body.expiryDate) {
      updateData.expiryDate = new Date(req.body.expiryDate);
    }

    if (req.file) {
      if (donation.image) {
        try {
          fs.unlinkSync(donation.image);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }

      updateData.image = req.file.path.replace(/\\/g, '/');
    } else if (req.body.keepExistingImage === 'true') {
      // keep existing image
    } else {
      if (donation.image) {
        try {
          fs.unlinkSync(donation.image);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }

        updateData.image = null;
      }
    }

    donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.json(donation);
  } catch (err) {
    console.error('Error updating donation:', err.message);
    res.status(500).send('Server Error');
  }
}

async function cancelDonation(req, res) {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ msg: 'Donation not found' });
    }

    if (donation.donor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to cancel this donation' });
    }

    if (donation.status !== 'PENDING' && donation.status !== 'ASSIGNED') {
      return res.status(400).json({ msg: 'This donation cannot be cancelled' });
    }

    donation.status = 'CANCELLED';
    await donation.save();

    res.json(donation);
  } catch (err) {
    console.error('Error cancelling donation:', err.message);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  getCategories,
  getAvailableDonations,
  getDonorDonations,
  getAdminDashboardDonations,
  getAgentsForAssignment,
  getAllDonations,
  createDonation,
  getDonationById,
  updateAvailability,
  getAvailableDonationsForNgo,
  updateStatusAssignAgent,
  updateDonation,
  cancelDonation,
};