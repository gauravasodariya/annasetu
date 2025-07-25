const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const ngosController = require('../../controller/ngosController');

router.get('/', auth, ngosController.listNgos);
router.get('/:id', auth, ngosController.getNgoById);
router.delete('/:id', auth, ngosController.deleteNgo);

module.exports = router;

