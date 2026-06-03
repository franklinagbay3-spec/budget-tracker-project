const Goal = require("../models/Goal");

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addGoal = async (req, res) => {
  try {
    const { name, desc, target, saved, icon, status } = req.body;
    const goal = await Goal.create({
      userId: req.user.id,
      name, desc, target, saved, icon, status,
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getGoals, addGoal, updateGoal, deleteGoal };