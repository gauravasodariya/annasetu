const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const usersController = require('../../controller/usersController');

router.get('/agents', auth, usersController.getAgents);

router.put('/profile', auth, usersController.updateProfile);

router.post('/ngo', auth, usersController.createNgoUser);

router.put('/:id', auth, usersController.updateUser);

router.delete('/:id', auth, usersController.deleteUser);

router.get('/:id', auth, usersController.getUserById);

router.post('/register', usersController.registerUser);

module.exports = router;

