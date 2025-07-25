const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const donationController = require("../../controller/donationController");

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
}).single("image");

router.post(
  "/",
  auth,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        return res
          .status(400)
          .json({ msg: "File upload error", error: err.message });
      }
      next();
    });
  },
  donationController.createDonation,
);

router.put("/:id/status", auth, donationController.updateStatusAssignAgent);

router.get("/categories", donationController.getCategories);

router.get("/available", donationController.getAvailableDonations);

router.get("/donor", auth, donationController.getDonorDonations);

router.get("/:id", auth, donationController.getDonationById);

router.get("/", auth, donationController.getAllDonations);  
router.get("/", auth, donationController.getAllDonations);

router.get("/admin/dashboard",auth,donationController.getAdminDashboardDonations);

router.put("/:id", auth, donationController.updateDonation);

router.put("/:id/cancel", auth, donationController.cancelDonation);

module.exports = router;
