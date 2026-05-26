import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyBarChart from "../components/MonthlyBarChart";
import { MdAdd, MdNotifications, MdDownload, MdTrendingUp } from "react-icons/md";

function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const name = localStorage.getItem("name") || "User";

  useEffect(() => {
    API.get("/transactions").then(({ data }) => setTransactions(data));
  }, []);

  const income   = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);

  const categoryTotals = transactions.reduce((acc, t) => {
    if (t.type === "expense") acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  const colors = ["bg-[#4648d4]", "bg-indigo-400", "bg-indigo-300", "bg-indigo-200", "bg-gray-300"];

  return (
    <div className="flex bg-[#f8f9ff] dark:bg-gray-900 h-screen overflow-hidden font-[Inter]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP NAV */}
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-[#e5eeff] dark:border-gray-700 flex-shrink-0">
          <div />
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#4648d4] hover:bg-[#3a3cb8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
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

          {/* PAGE HEADER */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">Analytics & Insights</h1>
              <p className="text-sm text-gray-400 mt-1">Real-time breakdown of your financial health and growth.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-white dark:hover:bg-gray-800 transition font-semibold">
                Last 30 Days
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-white dark:hover:bg-gray-800 transition font-semibold">
                <MdDownload size={16} /> Export
              </button>
            </div>
          </div>

          {/* TOP ROW — Charts */}
          <div className="grid grid-cols-3 gap-6 mb-6">

            {/* BAR CHART — takes 2 cols */}
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Monthly Overview</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Income vs Expenses</p>
                </div>
                <div className="flex items-center gap-2 text-[#4648d4]">
                  <MdTrendingUp size={18} />
                  <span className="text-sm font-bold">₱{income.toLocaleString()}</span>
                </div>
              </div>
              <MonthlyBarChart transactions={transactions} />
            </div>

            {/* SPENDING COMPARISON */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Spending Comparison</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Income</span>
                    <span className="font-bold text-gray-900 dark:text-white">₱{income.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-[#4648d4] h-2 rounded-full" style={{ width: income + expenses > 0 ? `${(income / (income + expenses)) * 100}%` : "0%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Expenses</span>
                    <span className="font-bold text-gray-900 dark:text-white">₱{expenses.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gray-300 dark:bg-gray-500 h-2 rounded-full" style={{ width: income + expenses > 0 ? `${(expenses / (income + expenses)) * 100}%` : "0%" }} />
                  </div>
                </div>
                {expenses > income && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 flex items-start gap-2">
                    <MdTrendingUp className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-xs text-red-500 font-semibold">Expenses exceed income this period.</p>
                  </div>
                )}
                {income > expenses && income > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex items-start gap-2">
                    <MdTrendingUp className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-xs text-green-600 font-semibold">You're saving ₱{(income - expenses).toLocaleString()} this period!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-3 gap-6">

            {/* DONUT CHART */}
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Income vs Expenses</h3>
              <ExpenseChart income={income} expenses={expenses} />
            </div>

            {/* CATEGORY BREAKDOWN */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Top Categories</h3>
              {sortedCategories.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No expense data yet.</p>
              ) : (
                <div className="space-y-4">
                  {sortedCategories.slice(0, 5).map(([cat, total], i) => {
                    const pct = Math.round((total / expenses) * 100);
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-semibold capitalize text-gray-700 dark:text-gray-300">{cat}</span>
                          <span className="text-gray-400">₱{total.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div className={`${colors[i] || "bg-gray-300"} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;