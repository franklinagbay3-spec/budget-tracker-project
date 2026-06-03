const Bill = require("../models/Bill");

const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user.id, paid: false }).sort({ dueDate: 1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addBill = async (req, res) => {
  try {
    const { name, amount, dueDate, urgent } = req.body;
    const bill = await Bill.create({
      userId: req.user.id,
      name, amount, dueDate, urgent,
    });
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const payBill = async (req, res) => {
  try {
    const bill = await Bill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { paid: true },
      { new: true }
    );
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBills, addBill, payBill, deleteBill };