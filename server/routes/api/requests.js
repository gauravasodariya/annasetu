const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const requestsController = require('../../controller/requestsController');

router.post('/', auth, requestsController.createRequest);

router.get('/', auth, requestsController.listRequests);

router.get('/:id', auth, requestsController.getRequestById);

router.put('/:id/status', auth, requestsController.updateStatus);

router.put('/:id/cancel', auth, requestsController.cancelRequest);

router.delete('/:id', auth, requestsController.deleteRequest);

router.get('/user/ngo', auth, requestsController.listRequestsForCurrentNgo);

module.exports = router;

