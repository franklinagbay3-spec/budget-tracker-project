import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    type: "", amount: "", category: "", accountType: "",
  });
  const limit = 10;

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get("/transactions");
      setTransactions(data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const startIndex = (page - 1) * limit;
  const paginated = transactions.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(transactions.length / limit);

  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  const handleEditClick = (t) => {
    setEditingId(t._id);
    setEditForm({ type: t.type, amount: t.amount, category: t.category, accountType: t.accountType });
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

  return (
    <div className="flex bg-[#f5f6fa] dark:bg-gray-900 h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">All your income and expense records</p>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-gray-500 dark:text-gray-400 mb-1">Total Records</p>
            <h2 className="text-3xl font-bold dark:text-white">{transactions.length}</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-gray-500 dark:text-gray-400 mb-1">Total Income</p>
            <h2 className="text-3xl font-bold text-green-600">
              ₱{transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0).toLocaleString()}
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
            <h2 className="text-3xl font-bold text-red-500">
              ₱{transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0).toLocaleString()}
            </h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 dark:text-white">All Transactions</h2>

          <div className="grid grid-cols-5 text-sm text-gray-400 dark:text-gray-500 font-medium pb-3 border-b dark:border-gray-700 px-2">
            <span>Type</span>
            <span>Category</span>
            <span>Account</span>
            <span>Amount</span>
            <span>Actions</span>
          </div>

          {paginated.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">No transactions yet.</div>
          ) : (
            paginated.map((t) => (
              <div key={t._id} className="grid grid-cols-5 items-center py-4 border-b dark:border-gray-700 last:border-none px-2 text-sm">
                <span className="font-semibold capitalize dark:text-white">{t.type}</span>
                <span className="text-gray-500 dark:text-gray-400">{t.category}</span>
                <span className="text-gray-500 dark:text-gray-400 capitalize">{t.accountType}</span>
                <span className={t.type === "income" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                  ₱{Number(t.amount).toLocaleString()}
                </span>
                <div className="flex gap-2">
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 transition">
                Prev
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 transition">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-xl">✕</button>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit Transaction</h2>
            <input className="w-full p-3 border dark:border-gray-600 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} placeholder="Amount" />
            <input className="w-full p-3 border dark:border-gray-600 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" />
            <select className="w-full p-3 border dark:border-gray-600 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select className="w-full p-3 border dark:border-gray-600 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" value={editForm.accountType} onChange={(e) => setEditForm({ ...editForm, accountType: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="gcash">GCash</option>
            </select>
            <button onClick={handleUpdate} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition">Save Changes</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Transactions;