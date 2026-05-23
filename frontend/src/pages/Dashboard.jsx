import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AddTransaction from "../components/AddTransaction";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyBarChart from "../components/MonthlyBarChart";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  // MODAL STATES
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    type: "",
    amount: "",
    category: "",
    accountType: "",
  });

  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get("/transactions");
      setTransactions(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ADD
  const handleAdd = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions((prev) =>
        prev.filter((t) => t._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  // OPEN EDIT MODAL
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

  // UPDATE
  const handleUpdate = async () => {
    try {
      const { data } = await API.put(
        `/transactions/${editingId}`,
        editForm
      );

      setTransactions((prev) =>
        prev.map((t) =>
          t._id === editingId ? data : t
        )
      );

      setShowEditModal(false);
      setEditingId(null);
    } catch (err) {
      console.log(err);
    }
  };

  // CALCULATIONS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expenses;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ================= LEFT MAIN DASHBOARD ================= */}
        <div className="lg:col-span-3 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Budget Tracker
            </h1>

            <div className="flex gap-2">
              <button
                onClick={() => navigate("/transactions")}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg"
              >
                Transactions Page
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>

          {/* CHARTS */}
          <ExpenseChart income={income} expenses={expenses} />
          <MonthlyBarChart transactions={transactions} />

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500">Income</p>
              <h2 className="text-2xl font-bold text-green-600">
                ₱{income}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500">Expenses</p>
              <h2 className="text-2xl font-bold text-red-500">
                ₱{expenses}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500">Balance</p>
              <h2 className="text-2xl font-bold text-blue-600">
                ₱{balance}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500">Transactions</p>
              <h2 className="text-2xl font-bold">
                {transactions.length}
              </h2>
            </div>

          </div>

          {/* ADD */}
          <div className="bg-white p-4 rounded-xl shadow">
            <AddTransaction onAdd={handleAdd} />
          </div>

          {/* LIST */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Transactions
            </h2>

            {transactions.map((t) => (
              <div
                key={t._id}
                className="border-b py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold capitalize">
                    {t.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.category} • {t.accountType}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p
                    className={
                      t.type === "income"
                        ? "text-green-600 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    ₱{t.amount}
                  </p>

                  <button
                    onClick={() => handleEditClick(t)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="lg:col-span-1 space-y-4">

          {/* USER PANEL */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-bold mb-2">
              User Panel
            </h2>

            <p className="text-sm text-gray-500">
              Logged in session
            </p>

            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Status:</span> Active
              </p>
              <p>
                <span className="font-semibold">Role:</span> User
              </p>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-3">Quick Actions</h2>

            <button className="w-full bg-blue-500 text-white p-2 rounded mb-2">
              Profile
            </button>

            <button className="w-full bg-gray-800 text-white p-2 rounded mb-2">
              Settings
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              className="w-full bg-red-500 text-white p-2 rounded"
            >
              Logout
            </button>
          </div>

        </div>

      </div>

      {/* MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">

            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-3 text-gray-500"
            >
              X
            </button>

            <h2 className="text-xl font-bold mb-4">
              Edit Transaction
            </h2>

            <input
              className="w-full p-2 border rounded mb-2"
              value={editForm.amount}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  amount: e.target.value,
                })
              }
              placeholder="Amount"
            />

            <input
              className="w-full p-2 border rounded mb-2"
              value={editForm.category}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  category: e.target.value,
                })
              }
              placeholder="Category"
            />

            <select
              className="w-full p-2 border rounded mb-2"
              value={editForm.type}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  type: e.target.value,
                })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              className="w-full p-2 border rounded mb-4"
              value={editForm.accountType}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  accountType: e.target.value,
                })
              }
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="gcash">GCash</option>
            </select>

            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Save Changes
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;