const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminController = require('../../controller/adminController');

router.get('/stats', auth, adminController.getDashboardStats);
router.get('/donations', auth, adminController.listDonations);
router.get('/requests', auth, adminController.listRequests);

module.exports = router;

