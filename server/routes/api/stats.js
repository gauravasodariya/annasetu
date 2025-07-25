const express = require('express');
const router = express.Router();
const Donation = require('../../models/Donation');
const User = require('../../models/User');

router.get('/', async (req, res) => {
  try {
    const volunteers = await User.countDocuments({ 
      role: { $in: ['volunteer', 'agent'] },
      status: 'active'
    });
    const ngos = await User.countDocuments({ role: 'ngo' });
    const donors = await User.countDocuments({ role: 'donor' });
    
    const totalDonations = await Donation.countDocuments();
    
    const pendingDonations = await Donation.countDocuments({ status: 'PENDING' });
    const assignedDonations = await Donation.countDocuments({ status: 'ASSIGNED' });
    const completedDonations = await Donation.countDocuments({ status: 'COMPLETED' });
    
    const completedDonationsData = await Donation.find({ 
      status: { $in: ['COMPLETED', 'DELIVERED'] } 
    });
    
    let mealsDonated = 0;
    completedDonationsData.forEach(donation => {
      if (donation.quantity) {
        const numericValue = parseInt(donation.quantity);
        if (!isNaN(numericValue)) {
          mealsDonated += numericValue;
        } else {
          const match = donation.quantity.match(/(\d+)/);
          if (match && match[1]) {
            mealsDonated += parseInt(match[1]);
          } else {
            mealsDonated += 1;
          }
        }
      }
    });

    res.json({
      mealsDonated,
      volunteers,
      ngos,
      donors,
      totalDonations,
      pendingDonations,
      assignedDonations,
      completedDonations
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;