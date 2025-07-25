const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function registerUser(req, res) {
  try {
    const { name, email, password, role, phone, address, assignedArea } =
      req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      role: role || "donor",
      phone,
      address,
      assignedArea,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getAgents(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const agents = await User.find({
      role: { $in: ["agent", "volunteer"] },
    }).select("-password");
    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function updateProfile(req, res) {
  try {
    const { name, email, phone, address } = req.body;
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (phone) userFields.phone = phone;
    if (address) userFields.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function updateUser(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const { name, email, phone, address, assignedArea, role, status } =
      req.body;
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (phone) userFields.phone = phone;
    if (address) userFields.address = address;
    if (assignedArea) userFields.assignedArea = assignedArea;
    if (role) userFields.role = role;
    if (typeof status !== "undefined") userFields.status = status;

    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function deleteUser(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User removed successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).send("Server Error");
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
}

async function createNgoUser(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const { name, email, password, phone, address } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({ name, email, password, role: "ngo", phone, address });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  registerUser,
  getAgents,
  updateProfile,
  updateUser,
  deleteUser,
  getUserById,
  createNgoUser,
};
