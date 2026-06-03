import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AddTransaction from "../components/AddTransaction";
import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";

import {
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalance,
  MdAdd,
  MdSearch,
} from "react-icons/md";

function Dashboard() {
  const [transactions,  setTransactions]  = useState([]);
  const [showAddModal,  setShowAddModal]  = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [editForm,      setEditForm]      = useState({
    type: "", amount: "", category: "", accountType: "",
  });

  const name     = localStorage.getItem("name") || "User";
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get("/transactions");
      setTransactions(data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleAdd = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
    setShowAddModal(false);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) { console.log(err); }
  };

  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      type:        transaction.type,
      amount:      transaction.amount,
      category:    transaction.category,
      accountType: transaction.accountType,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await API.put(`/transactions/${editingId}`, editForm);
      setTransactions((prev) =>
        prev.map((t) => (t._id === editingId ? data : t))
      );
      setShowEditModal(false);
      setEditingId(null);
    } catch (err) { console.log(err); }
  };

  const income   = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + Number(t.amount), 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + Number(t.amount), 0);
  const balance  = income - expenses;

  const inputCls = "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";

  return (
    <div className="flex bg-[#f8f9ff] dark:bg-gray-900 h-screen overflow-hidden font-[Inter]">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP NAVBAR */}
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-[#e5eeff] dark:border-gray-700 flex-shrink-0">

          {/* SEARCH */}
          <div className="relative">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              placeholder="Search transactions..."
              className="pl-9 pr-4 py-2 bg-[#eff4ff] dark:bg-gray-800 border-none rounded-full text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#4648d4]/20 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#4648d4] hover:bg-[#3a3cb8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
            >
              <MdAdd size={18} />
              Add Transaction
            </button>

            {/* NOTIFICATION BELL */}
            <NotificationBell />

            {/* USER AVATAR */}
            <div className="w-9 h-9 rounded-full bg-[#4648d4] flex items-center justify-center text-white text-sm font-bold">
              {name.charAt(0).toUpperCase()}
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">

          {/* WELCOME BANNER */}
          <div className="grid grid-cols-3 gap-6 mb-6">

            <div className="col-span-2 bg-gray-900 dark:bg-gray-800 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 dark:from-gray-700 dark:to-gray-900" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2 font-[Plus_Jakarta_Sans]">
                  Welcome back, {name} 👋
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Here's your financial overview for this period.
                </p>
                <div className="flex gap-3">
                  <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Total Balance</p>
                    <p className="text-lg font-bold">₱{balance.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Transactions</p>
                    <p className="text-lg font-bold">{transactions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BALANCE CARD */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#eff4ff] dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <MdAccountBalance size={20} className="text-[#4648d4]" />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  balance >= 0
                    ? "text-green-500 bg-green-50 dark:bg-green-900/30"
                    : "text-red-500 bg-red-50 dark:bg-red-900/30"
                }`}>
                  {balance >= 0 ? "Positive" : "Negative"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Net Balance</p>
                <p className={`text-3xl font-bold font-[Plus_Jakarta_Sans] ${
                  balance >= 0 ? "text-gray-900 dark:text-white" : "text-red-500"
                }`}>
                  ₱{balance.toLocaleString()}
                </p>
              </div>
            </div>

          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-2 gap-6 mb-6">

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <MdTrendingUp size={20} className="text-green-600" />
                </div>
                <span className="text-xs text-green-600 font-semibold">Monthly Income</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">
                ₱{income.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Total earned</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <MdTrendingDown size={20} className="text-red-500" />
                </div>
                <span className="text-xs text-red-500 font-semibold">Monthly Expenses</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">
                ₱{expenses.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Total spent</p>
            </div>

          </div>

          {/* RECENT TRANSACTIONS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#e5eeff] dark:border-gray-700">

            <div className="flex items-center justify-between p-6 border-b border-[#e5eeff] dark:border-gray-700">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Recent Transactions
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Last {Math.min(5, transactions.length)} entries
                </p>
              </div>
              <button
                onClick={() => navigate("/transactions")}
                className="text-[#4648d4] text-sm font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-[#e5eeff] dark:border-gray-700">
              <span>Category</span>
              <span>Type</span>
              <span>Account</span>
              <span>Amount</span>
              <span>Actions</span>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No transactions yet.
              </div>
            ) : (
              transactions.slice(0, 5).map((t) => (
                <div
                  key={t._id}
                  className="grid grid-cols-5 items-center px-6 py-4 border-b dark:border-gray-700 last:border-none hover:bg-[#f8f9ff] dark:hover:bg-gray-750 transition-colors"
                >

                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      t.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                    }`}>
                      {t.category?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {t.category}
                    </span>
                  </div>

                  <span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      t.type === "income"
                        ? "bg-green-50 dark:bg-green-900/30 text-green-600"
                        : "bg-red-50 dark:bg-red-900/30 text-red-500"
                    }`}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </span>

                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {t.accountType}
                  </span>

                  <span className={`text-sm font-bold ${
                    t.type === "income" ? "text-green-600" : "text-red-500"
                  }`}>
                    {t.type === "income" ? "+" : "-"}₱{Number(t.amount).toLocaleString()}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(t)}
                      className="text-xs bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] dark:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-[#e5eeff] dark:hover:bg-gray-600 transition font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-xs bg-red-50 dark:bg-red-900/20 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition font-semibold"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))
            )}

          </div>

        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-[#e5eeff] dark:border-gray-700">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">
              Add Transaction
            </h2>
            <AddTransaction onAdd={handleAdd} />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-[#e5eeff] dark:border-gray-700">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">
              Edit Transaction
            </h2>
            <div className="space-y-4">
              <input
                className={inputCls}
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                placeholder="Amount"
              />
              <input
                className={inputCls}
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                placeholder="Category"
              />
              <select
                className={inputCls}
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                className={inputCls}
                value={editForm.accountType}
                onChange={(e) => setEditForm({ ...editForm, accountType: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="gcash">GCash</option>
              </select>
              <button
                onClick={handleUpdate}
                className="w-full bg-[#4648d4] hover:bg-[#3a3cb8] text-white py-3 rounded-lg font-semibold transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;