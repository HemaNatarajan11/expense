const Expense = require("../models/Expense");

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });

    const totalIncome = expenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    const balance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, balance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const addExpense = async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      description,
      amount,
      type,
      category: category || "other",
      date: date || Date.now(),
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { description, amount, type, category, date },
      { new: true },
    );

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getExpenses,
  getSummary,
  addExpense,
  updateExpense,
  deleteExpense,
};
