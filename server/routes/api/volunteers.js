const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const volunteersController = require("../../controller/volunteersController");

router.get("/assignments", auth, volunteersController.getAssignments);
router.get("/assignments/:id", auth, volunteersController.getAssignmentDetails);
router.put("/accept/:id", auth, volunteersController.acceptAssignment);
router.put("/complete/:id", auth, volunteersController.completeAssignment);
router.get("/profile/:id", auth, volunteersController.getProfile);

module.exports = router;