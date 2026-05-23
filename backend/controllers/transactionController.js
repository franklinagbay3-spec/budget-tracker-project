const Transaction = require("../models/Transaction");

// @desc Add transaction
// POST /api/transactions
const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, accountType, description, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      category,
      accountType,
      description,
      date,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all transactions for user
// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete transaction
// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.deleteOne();

    res.json({ message: "Transaction removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction,
};