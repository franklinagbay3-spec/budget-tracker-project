import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

function Reports() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.get("/transactions").then(({ data }) => setTransactions(data));
  }, []);

  const income = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  const byAccount = transactions.reduce((acc, t) => {
    const key = t.accountType;
    if (!acc[key]) acc[key] = { income: 0, expenses: 0 };
    if (t.type === "income") acc[key].income += Number(t.amount);
    else acc[key].expenses += Number(t.amount);
    return acc;
  }, {});

  return (
    <div className="flex bg-[#f5f6fa] dark:bg-gray-900 h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Summary of your financial health</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-gray-500 dark:text-gray-400 mb-1">Total Income</p>
            <h2 className="text-2xl font-bold text-green-600">₱{income.toLocaleString()}</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
            <h2 className="text-2xl font-bold text-red-500">₱{expenses.toLocaleString()}</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-gray-500 dark:text-gray-400 mb-1">Net Balance</p>
            <h2 className="text-2xl font-bold text-blue-600">₱{balance.toLocaleString()}</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-gray-500 dark:text-gray-400 mb-1">Savings Rate</p>
            <h2 className="text-2xl font-bold text-indigo-600">{savingsRate}%</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Breakdown by Account</h2>
          {Object.keys(byAccount).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">No data yet.</p>
          ) : (
            Object.entries(byAccount).map(([account, val]) => (
              <div key={account} className="flex justify-between items-center py-4 border-b dark:border-gray-700 last:border-none">
                <span className="font-semibold capitalize text-lg dark:text-white">{account}</span>
                <div className="flex gap-6 text-sm">
                  <span className="flex items-center gap-1 text-green-600 font-bold">
                    <FaArrowUp /> ₱{val.income.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-red-500 font-bold">
                    <FaArrowDown /> ₱{val.expenses.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Reports;