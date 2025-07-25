const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const agentsController = require('../../controller/agentsController');

router.get('/', auth, agentsController.listAgents);
router.get('/:id', auth, agentsController.getAgentById);
router.post('/', auth, agentsController.createAgent);
router.put('/:id', auth, agentsController.updateAgent);
router.delete('/:id', auth, agentsController.deleteAgent);

module.exports = router;

