import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AddTransaction from "../components/AddTransaction";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  // EDIT STATES
  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    type: "",
    amount: "",
    category: "",
    accountType: "",
  });

  const navigate = useNavigate();

  // Fetch transactions from backend
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

  // Add new transaction
  const handleAdd = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  // DELETE transaction
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

  // START EDITING
  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);

    setEditForm({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      accountType: transaction.accountType,
    });
  };

  // UPDATE TRANSACTION
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

      setEditingId(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Calculations
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expenses;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Dashboard</h1>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Logout
      </button>

      {/* SUMMARY SECTION */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid gray",
        }}
      >
        <h2>Summary</h2>

        <p>Income: {income}</p>
        <p>Expenses: {expenses}</p>
        <p>
          <strong>Balance: {balance}</strong>
        </p>
      </div>

      {/* ADD TRANSACTION */}
      <div style={{ marginTop: "20px" }}>
        <AddTransaction onAdd={handleAdd} />
      </div>

      {/* TRANSACTIONS LIST */}
      <div style={{ marginTop: "20px" }}>
        <h2>Transactions</h2>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map((t) => (
            <div
              key={t._id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p>Type: {t.type}</p>
              <p>Amount: {t.amount}</p>
              <p>Category: {t.category}</p>
              <p>Account: {t.accountType}</p>

              {/* EDIT BUTTON */}
              <button onClick={() => handleEditClick(t)}>
                Edit
              </button>

              {/* DELETE BUTTON */}
              <button onClick={() => handleDelete(t._id)}>
                Delete
              </button>

              {/* EDIT FORM */}
              {editingId === t._id && (
                <div style={{ marginTop: "10px" }}>
                  <input
                    placeholder="Amount"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        amount: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="Category"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        category: e.target.value,
                      })
                    }
                  />

                  <select
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

                  <button onClick={handleUpdate}>
                    Save
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;