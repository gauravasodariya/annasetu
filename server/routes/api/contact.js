const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const contactController = require("../../controller/contactController");


router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("message", "Message is required").not().isEmpty(),
  ],
  contactController.createContact
);

router.get("/", auth, contactController.listContacts);

router.get("/:id", auth, contactController.getContactById);

router.put("/:id", auth, contactController.markRead);

router.delete("/:id", auth, contactController.deleteContact);

module.exports = router;
