const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

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
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

async function googleLogin(req, res) {
  const { token } = req.body;
  try {
    let OAuth2Client;
    try {
      ({ OAuth2Client } = require("google-auth-library"));
    } catch (e) {
      if (e && e.code === "MODULE_NOT_FOUND") {
        return res
          .status(501)
          .json({ msg: "Google authentication is not enabled on the server" });
      }
      throw e;
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        role: "donor",
      });
      await user.save();
    }

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
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

const crypto = require("crypto");
const nodemailer = require("nodemailer");

function passwordResetTemplate({ appName, resetUrl, expireMinutes = 10 }) {
  return `<h1>Password Reset Request</h1>
      <p>You requested a password reset for your AnnaSetu account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4dd0e1; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>`;
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const html = passwordResetTemplate({
        appName: process.env.APP_NAME || "AnnaSetu",
        resetUrl,
        expireMinutes: 10,
      });

      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: user.email,
        subject: "Password Reset Request",
        html,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      console.error("Email sending error:", err.message);
      console.error("Full error:", err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res
        .status(500)
        .json({ msg: "Email could not be sent", error: err.message });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Return currently logged in user (from token)
async function getLoggedInUser(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  getLoggedInUser,
  login,
  googleLogin,
  // Verify the reset token is valid and not expired
  async verifyResetToken(req, res) {
    try {
      const rawToken = req.params.token;
      const hashedToken = require("crypto")
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ msg: "Invalid or expired token" });
      }

      return res.json({ success: true });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  },

  // Reset password using token
  async resetPassword(req, res) {
    try {
      const rawToken = req.params.token;
      const { password } = req.body;

      if (!password || password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });
      }

      const hashedToken = require("crypto")
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ msg: "Invalid or expired token" });
      }

      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.json({ success: true, msg: "Password reset successful" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  },
  forgotPassword,
};
