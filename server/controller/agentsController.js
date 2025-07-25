const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function listAgents(req, res) {
  try {
    const agents = await User.find({ role: 'volunteer' }).select('-password');
    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function getAgentById(req, res) {
  try {
    const agent = await User.findById(req.params.id).select('-password');
    if (!agent || agent.role !== 'volunteer') {
      return res.status(404).json({ msg: 'Agent not found' });
    }
    res.json(agent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Agent not found' });
    }
    res.status(500).send('Server Error');
  }
}

async function createAgent(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const { name, email, password, phone, address, assignedArea, isActive, status } = req.body;
    let agent = await User.findOne({ email });
    if (agent) {
      return res.status(400).json({ msg: 'Volunteer already exists' });
    }
    agent = new User({
      name,
      email,
      password,
      role: 'volunteer',
      phone,
      address,
      assignedArea,
      isActive: isActive !== undefined ? isActive : true,
      status: status || 'active',
    });
    const salt = await bcrypt.genSalt(10);
    agent.password = await bcrypt.hash(password, salt);
    await agent.save();
    res.json(agent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function updateAgent(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const { name, email, phone, address, assignedArea, isActive, status } = req.body;
    const agentFields = {};
    if (name) agentFields.name = name;
    if (email) agentFields.email = email;
    if (phone) agentFields.phone = phone;
    if (address) agentFields.address = address;
    if (assignedArea) agentFields.assignedArea = assignedArea;
    if (typeof isActive !== 'undefined') agentFields.isActive = isActive;
    if (typeof status !== 'undefined') agentFields.status = status;

    let agent = await User.findById(req.params.id);
    if (!agent || agent.role !== 'volunteer') {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    agent = await User.findByIdAndUpdate(req.params.id, { $set: agentFields }, { new: true }).select('-password');
    res.json({ msg: 'volunteer updated successfully', agent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

async function deleteAgent(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const agent = await User.findById(req.params.id);
    if (!agent || agent.role !== 'volunteer') {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Volunteer removed' });
  } catch (err) {
    console.error('Error deleting volunteer:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    res.status(500).send('Server Error');
  }
}

module.exports = {
  listAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
};
