const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getExpenses,
  getSummary,
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

router.get("/summary", authMiddleware, getSummary);
router.get("/", authMiddleware, getExpenses);
router.post("/", authMiddleware, addExpense);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
