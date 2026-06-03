const Plan = require("../models/Plan");

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addPlan = async (req, res) => {
  try {
    const { title, date, category, budget, notes } = req.body;
    const plan = await Plan.create({
      userId: req.user.id,
      title, date, category, budget, notes,
    });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPlans, addPlan, deletePlan };