const express = require("express");
const router = express.Router();
const { getBills, addBill, payBill, deleteBill } = require("../controllers/billController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getBills);
router.post("/", protect, addBill);
router.patch("/:id/pay", protect, payBill);  // fixed
router.delete("/:id", protect, deleteBill);

module.exports = router;