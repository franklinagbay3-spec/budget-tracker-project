const express = require("express");
const router = express.Router();
const { getPlans, addPlan, deletePlan } = require("../controllers/planController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getPlans);
router.post("/", protect, addPlan);
router.delete("/:id", protect, deletePlan);

module.exports = router;