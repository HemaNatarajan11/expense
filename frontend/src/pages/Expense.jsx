import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Expense = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("other");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(
        "https://expense-dnfg.onrender.com/api/expenses",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!description || !amount) {
      setError("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "https://expense-dnfg.onrender.com/api/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description,
            amount: Number(amount),
            type,
            category,
          }),
        },
      );
      if (res.ok) {
        setDescription("");
        setAmount("");
        setCategory("other");
        fetchExpenses();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://expense-dnfg.onrender.com/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryEmoji = {
    food: "🍔",
    travel: "🚗",
    shopping: "🛍️",
    health: "💊",
    entertainment: "🎬",
    salary: "💰",
    other: "💸",
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex-shrink-0">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">₹</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800">ExpenseTracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {user?.name || "User"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-300 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">
                Total Balance
              </p>
              <h2 className="text-3xl font-bold mb-1">
                ₹{balance.toLocaleString()}
              </h2>
              <p className="text-xs opacity-60">All time balance</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Total Income
                </p>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">↑</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                ₹{totalIncome.toLocaleString()}
              </h3>
              <p className="text-xs text-green-500 font-medium mt-1">
                Income received
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Total Expenses
                </p>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-500 text-sm font-bold">↓</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                ₹{totalExpense.toLocaleString()}
              </h3>
              <p className="text-xs text-red-400 font-medium mt-1">
                Total spent
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-5">
                  New Transaction
                </h3>

                <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setType("income")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition
                      ${
                        type === "income"
                          ? "bg-white text-green-600 shadow-sm"
                          : "text-slate-400"
                      }`}
                  >
                    ↑ Income
                  </button>
                  <button
                    onClick={() => setType("expense")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition
                      ${
                        type === "expense"
                          ? "bg-white text-red-500 shadow-sm"
                          : "text-slate-400"
                      }`}
                  >
                    ↓ Expense
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="eg. Grocery shopping"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    >
                      <option value="food">🍔 Food</option>
                      <option value="travel">🚗 Travel</option>
                      <option value="shopping">🛍️ Shopping</option>
                      <option value="health">💊 Health</option>
                      <option value="entertainment">🎬 Entertainment</option>
                      <option value="salary">💰 Salary</option>
                      <option value="other">💸 Other</option>
                    </select>
                  </div>
                </div>

                {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className={`w-full mt-4 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50
                    ${
                      type === "income"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {loading
                    ? "Adding..."
                    : `+ Add ${type === "income" ? "Income" : "Expense"}`}
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-700">
                    Recent Transactions
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {expenses.length} total
                  </span>
                </div>

                <div className="grid grid-cols-4 px-6 py-2 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider col-span-2">
                    Description
                  </p>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Category
                  </p>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Amount
                  </p>
                </div>

                {expenses.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-2xl mb-2">💸</p>
                    <p className="text-sm text-slate-400">
                      No transactions yet
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Add your first transaction
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {expenses.map((exp) => (
                      <div
                        key={exp._id}
                        className="grid grid-cols-4 px-6 py-4 hover:bg-slate-50 transition items-center group"
                      >
                        <div className="col-span-2 flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0
                            ${exp.type === "income" ? "bg-green-50" : "bg-red-50"}`}
                          >
                            {categoryEmoji[exp.category] || "💸"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {exp.description}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(exp.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg capitalize">
                            {exp.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <p
                            className={`text-sm font-bold
                            ${exp.type === "income" ? "text-green-500" : "text-red-400"}`}
                          >
                            {exp.type === "income" ? "+" : "-"}₹
                            {exp.amount.toLocaleString()}
                          </p>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
