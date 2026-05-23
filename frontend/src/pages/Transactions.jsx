import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

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

  // PAGINATION LOGIC
  const startIndex = (page - 1) * limit;
  const paginated = transactions.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(transactions.length / limit);

  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Transactions</h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white p-4 rounded-xl shadow">
          {paginated.map((t) => (
            <div
              key={t._id}
              className="border-b py-3 flex justify-between"
            >
              <div>
                <p className="font-semibold">{t.type}</p>
                <p className="text-sm text-gray-500">
                  {t.category}
                </p>
              </div>

              <div className="flex gap-4">
                <p
                  className={
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ₱{t.amount}
                </p>

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

        {/* PAGINATION CONTROLS */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default Transactions;