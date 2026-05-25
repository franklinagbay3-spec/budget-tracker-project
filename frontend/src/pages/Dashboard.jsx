import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import AddTransaction from "../components/AddTransaction";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import Header from "../components/Header";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    type: "", amount: "", category: "", accountType: "",
  });

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
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      accountType: transaction.accountType,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await API.put(`/transactions/${editingId}`, editForm);
      setTransactions((prev) => prev.map((t) => (t._id === editingId ? data : t)));
      setShowEditModal(false);
      setEditingId(null);
    } catch (err) { console.log(err); }
  };

  const income   = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + Number(t.amount), 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + Number(t.amount), 0);
  const balance  = income - expenses;

  return (
    <div className="flex bg-[#f5f6fa] dark:bg-gray-900 h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto h-full">

        <Header />

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Total Income</p>
            <h2 className="text-3xl font-bold text-green-600">₱{income}</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Total Expenses</p>
            <h2 className="text-3xl font-bold text-red-500">₱{expenses}</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Balance</p>
            <h2 className="text-3xl font-bold text-blue-600">₱{balance}</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Transactions</p>
            <h2 className="text-3xl font-bold dark:text-white">{transactions.length}</h2>
          </div>
        </div>

        {/* ADD TRANSACTION + RECENT TRANSACTIONS SIDE BY SIDE */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ADD TRANSACTION */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold dark:text-white mb-6">Add Transaction</h2>
            <AddTransaction onAdd={handleAdd} />
          </div>

          {/* RECENT TRANSACTIONS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Recent Transactions</h2>
              <button className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-xl transition text-sm">
                Filter
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No transactions yet.
              </div>
            ) : (
              transactions.slice(0, 3).map((t) => (
                <div key={t._id} className="border-b dark:border-gray-700 last:border-none py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold capitalize dark:text-white">{t.type}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.category} • {t.accountType}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={t.type === "income" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                      ₱{t.amount}
                    </p>
                    <button onClick={() => handleEditClick(t)} className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition text-xs">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(t._id)} className="bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300 px-3 py-1 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition text-xs">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      <RightPanel income={income} expenses={expenses} balance={balance} transactions={transactions} />

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-xl">✕</button>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit Transaction</h2>
            <input
              className="w-full p-3 border dark:border-gray-600 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              placeholder="Amount"
            />
            <input
              className="w-full p-3 border dark:border-gray-600 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              placeholder="Category"
            />
            <select
              className="w-full p-3 border dark:border-gray-600 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              className="w-full p-3 border dark:border-gray-600 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              value={editForm.accountType}
              onChange={(e) => setEditForm({ ...editForm, accountType: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="gcash">GCash</option>
            </select>
            <button onClick={handleUpdate} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition">
              Save Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;