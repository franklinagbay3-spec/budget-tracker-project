import Sidebar from "../components/Sidebar";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyBarChart from "../components/MonthlyBarChart";
import { useEffect, useState } from "react";
import API from "../services/api";

function Analytics() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.get("/transactions").then(({ data }) => setTransactions(data));
  }, []);

  const income = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);

  const categoryTotals = transactions.reduce((acc, t) => {
    if (t.type === "expense") {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    }
    return acc;
  }, {});

  return (
    <div className="flex bg-[#f5f6fa] dark:bg-gray-900 h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Visual breakdown of your finances</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <ExpenseChart income={income} expenses={expenses} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <MonthlyBarChart transactions={transactions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Expenses by Category</h2>
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">No expense data yet.</p>
          ) : (
            Object.entries(categoryTotals).map(([cat, total]) => {
              const pct = Math.round((total / expenses) * 100);
              return (
                <div key={cat} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium dark:text-white">{cat}</span>
                    <span className="text-gray-500 dark:text-gray-400">₱{total.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

export default Analytics;