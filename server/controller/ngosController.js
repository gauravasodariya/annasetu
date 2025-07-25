const User = require('../models/User');

async function listNgos(req, res) {
  try {
    const ngos = await User.find({ role: 'ngo' }).select('-password');
    res.json(ngos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function getNgoById(req, res) {
  try {
    const ngo = await User.findById(req.params.id).select('-password');
    if (!ngo || ngo.role !== 'ngo') {
      return res.status(404).json({ msg: 'NGO not found' });
    }
    res.json(ngo);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'NGO not found' });
    }
    res.status(500).send('Server Error');
  }
}

async function deleteNgo(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const ngo = await User.findById(req.params.id);
    if (!ngo || ngo.role !== 'ngo') {
      return res.status(404).json({ msg: 'NGO not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'NGO removed' });
  } catch (err) {
    console.error('Error deleting NGO:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'NGO not found' });
    }
    res.status(500).send('Server Error');
  }
}

module.exports = {
  listNgos,
  getNgoById,
  deleteNgo,
};

