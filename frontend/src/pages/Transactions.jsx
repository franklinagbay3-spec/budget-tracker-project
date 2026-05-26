import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import AddTransaction from "../components/AddTransaction";
import { MdSearch, MdAdd, MdNotifications, MdFilterList, MdDownload } from "react-icons/md";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ type: "", amount: "", category: "", accountType: "" });
  const [filterType, setFilterType] = useState("all");
  const [filterAccount, setFilterAccount] = useState("all");
  const limit = 10;

  const name = localStorage.getItem("name") || "User";

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get("/transactions");
      setTransactions(data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const filtered = transactions.filter((t) => {
    const typeMatch = filterType === "all" || t.type === filterType;
    const accountMatch = filterAccount === "all" || t.accountType === filterAccount;
    return typeMatch && accountMatch;
  });

  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filtered.length / limit);

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

  const handleAdd = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
    setShowAddModal(false);
  };

  const totalIncome   = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);

  const inputCls = "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";

  return (
    <div className="flex bg-[#f8f9ff] dark:bg-gray-900 h-screen overflow-hidden font-[Inter]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP NAV */}
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-[#e5eeff] dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Transactions Ledger</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input placeholder="Search by description..." className="pl-9 pr-4 py-2 bg-[#eff4ff] dark:bg-gray-800 border-none rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#4648d4]/20 dark:text-white dark:placeholder-gray-400" />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#4648d4] hover:bg-[#3a3cb8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
            >
              <MdAdd size={18} /> Add Transaction
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-[#eff4ff] dark:hover:bg-gray-800 rounded-full relative">
              <MdNotifications size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#4648d4] flex items-center justify-center text-white text-sm font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">

          {/* HERO BANNER */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6 border border-[#e5eeff] dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Financial Overview</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-[Plus_Jakarta_Sans]">Keep track of every cent.</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-5 border border-[#e5eeff] dark:border-gray-600">
                <p className="text-xs text-gray-400 mb-1">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">₱{(totalIncome + totalExpenses).toLocaleString()}</p>
                <p className="text-xs text-[#4648d4] font-semibold mt-1">{transactions.length} transactions</p>
              </div>
              <div className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-5 border border-[#e5eeff] dark:border-gray-600">
                <p className="text-xs text-gray-400 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-green-600 font-[Plus_Jakarta_Sans]">₱{totalIncome.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.type === "income").length} entries</p>
              </div>
              <div className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-5 border border-[#e5eeff] dark:border-gray-600">
                <p className="text-xs text-gray-400 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-red-500 font-[Plus_Jakarta_Sans]">₱{totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.type === "expense").length} entries</p>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-[#e5eeff] dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <MdFilterList size={20} className="text-[#4648d4]" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">Type</label>
                <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30">
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">Account</label>
                <select value={filterAccount} onChange={(e) => { setFilterAccount(e.target.value); setPage(1); }} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30">
                  <option value="all">All Accounts</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="gcash">GCash</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setFilterType("all"); setFilterAccount("all"); setPage(1); }} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition font-semibold">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#e5eeff] dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-[#e5eeff] dark:border-gray-700">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Detailed Ledger</h3>
                <p className="text-xs text-gray-400 mt-0.5">Showing {filtered.length} transactions</p>
              </div>
              <button className="flex items-center gap-2 text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-semibold">
                <MdDownload size={16} /> Export CSV
              </button>
            </div>

            <div className="grid grid-cols-6 px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-[#e5eeff] dark:border-gray-700">
              <span>Category</span>
              <span>Type</span>
              <span>Account</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {paginated.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No transactions found.</div>
            ) : (
              paginated.map((t) => (
                <div key={t._id} className="grid grid-cols-6 items-center px-6 py-4 border-b dark:border-gray-700 last:border-none hover:bg-[#f8f9ff] dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${t.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {t.category?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{t.category}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${t.type === "income" ? "bg-green-50 dark:bg-green-900/30 text-green-600" : "bg-red-50 dark:bg-red-900/30 text-red-500"}`}>
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{t.accountType}</span>
                  <span className={`text-sm font-bold ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {t.type === "income" ? "+" : "-"}₱{Number(t.amount).toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] dark:text-indigo-400 w-fit">
                    Cleared
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(t)} className="text-xs bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] dark:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-[#e5eeff] transition font-semibold">Edit</button>
                    <button onClick={() => handleDelete(t._id)} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-semibold">Delete</button>
                  </div>
                </div>
              ))
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5eeff] dark:border-gray-700">
                <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 disabled:opacity-40 hover:bg-[#eff4ff] transition text-sm">‹</button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition ${page === p ? "bg-[#4648d4] text-white" : "border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-[#eff4ff] dark:hover:bg-gray-700"}`}>{p}</button>
                  ))}
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 disabled:opacity-40 hover:bg-[#eff4ff] transition text-sm">›</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-[#e5eeff] dark:border-gray-700">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">✕</button>
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">Add Transaction</h2>
            <AddTransaction onAdd={handleAdd} />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-[#e5eeff] dark:border-gray-700">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">✕</button>
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">Edit Transaction</h2>
            <div className="space-y-4">
              <input className={inputCls} value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} placeholder="Amount" />
              <input className={inputCls} value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" />
              <select className={inputCls} value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select className={inputCls} value={editForm.accountType} onChange={(e) => setEditForm({ ...editForm, accountType: e.target.value })}>
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="gcash">GCash</option>
              </select>
              <button onClick={handleUpdate} className="w-full bg-[#4648d4] hover:bg-[#3a3cb8] text-white py-3 rounded-lg font-semibold transition">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;