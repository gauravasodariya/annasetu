const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");

async function createContact(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({ name, email, message, read: false });
    await contact.save();
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function listContacts(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function getContactById(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function markRead(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    contact.read = true;
    await contact.save();
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function deleteContact(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  createContact,
  listContacts,
  getContactById,
  markRead,
  deleteContact,
};
