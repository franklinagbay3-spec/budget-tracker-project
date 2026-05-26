import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { MdAdd, MdNotifications, MdDownload, MdCalendarMonth, MdPieChart, MdTrendingUp, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState("30");
  const [includeBalance, setIncludeBalance] = useState(true);
  const [includeCashFlow, setIncludeCashFlow] = useState(true);
  const [includeForecast, setIncludeForecast] = useState(false);
  const name = localStorage.getItem("name") || "User";

  useEffect(() => {
    API.get("/transactions").then(({ data }) => setTransactions(data));
  }, []);

  const income   = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);
  const balance  = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  const categoryTotals = transactions.reduce((acc, t) => {
    if (t.type === "expense") acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const topTransactions = [...transactions]
    .filter(t => t.type === "expense")
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 5);

  const templates = [
    { icon: <MdCalendarMonth size={20} />, label: "Monthly Summary" },
    { icon: <MdPieChart size={20} />, label: "Category Deep Dive" },
    { icon: <MdTrendingUp size={20} />, label: "Income Analysis" },
  ];

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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">Financial Reports</h1>
              <p className="text-sm text-gray-400 mt-1">Analyze your financial health with precise, generated documentation.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-white dark:hover:bg-gray-800 transition">
                <MdDownload size={16} /> Export PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-white dark:hover:bg-gray-800 transition">
                <MdDownload size={16} /> CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">

            {/* LEFT — Templates + Builder */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[#e5eeff] dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Report Templates</h3>
                <div className="space-y-2">
                  {templates.map((t, i) => (
                    <button key={i} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm text-left transition ${i === 0 ? "bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] font-semibold border border-[#4648d4]/20" : "text-gray-600 dark:text-gray-300 hover:bg-[#f8f9ff] dark:hover:bg-gray-700"}`}>
                      <span className={i === 0 ? "text-[#4648d4]" : "text-gray-400"}>{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[#e5eeff] dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Custom Builder</h3>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Date Range</label>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 mb-4">
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">This Year</option>
                </select>
                <label className="block text-xs text-gray-400 mb-2 font-semibold">Include Data</label>
                <div className="space-y-2">
                  {[
                    { label: "Balance Sheets", val: includeBalance, set: setIncludeBalance },
                    { label: "Cash Flow Analysis", val: includeCashFlow, set: setIncludeCashFlow },
                    { label: "Savings Forecasts", val: includeForecast, set: setIncludeForecast },
                  ].map((item) => (
                    <button key={item.label} onClick={() => item.set(!item.val)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 w-full">
                      {item.val ? <MdCheckBox size={18} className="text-[#4648d4]" /> : <MdCheckBoxOutlineBlank size={18} className="text-gray-300" />}
                      {item.label}
                    </button>
                  ))}
                </div>
                <button className="w-full mt-4 bg-gray-900 dark:bg-gray-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
                  Apply Changes
                </button>
              </div>
            </div>

            {/* RIGHT — Report Content */}
            <div className="col-span-3 space-y-6">

              {/* REPORT HEADER */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">Monthly Financial Summary</h2>
                    <p className="text-sm text-gray-400 mt-1">Period: All transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#4648d4] font-semibold">REPORT GENERATED</p>
                    <p className="text-xs text-gray-400">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-4 border border-[#e5eeff] dark:border-gray-600">
                    <p className="text-xs text-gray-400 mb-1">Net Income</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">₱{income.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-4 border border-[#e5eeff] dark:border-gray-600">
                    <p className="text-xs text-gray-400 mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">₱{expenses.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-4 border border-[#e5eeff] dark:border-gray-600">
                    <p className="text-xs text-gray-400 mb-1">Savings Rate</p>
                    <p className="text-2xl font-bold text-[#4648d4] font-[Plus_Jakarta_Sans]">{savingsRate}%</p>
                    <p className="text-xs text-green-500 font-semibold mt-0.5">{savingsRate > 20 ? "↑ Healthy" : "↓ Low"}</p>
                  </div>
                </div>
              </div>

              {/* EXPENSE DISTRIBUTION */}
              {chartData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Expense Distribution</h3>
                    <span className="text-xs text-gray-400">By Category</span>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData} barSize={36}>
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip formatter={(v) => [`₱${v.toLocaleString()}`, "Amount"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5eeff", fontSize: "12px" }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? "#4648d4" : "#c0c1ff"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* TOP TRANSACTIONS */}
              {topTransactions.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#e5eeff] dark:border-gray-700">
                  <div className="p-6 border-b border-[#e5eeff] dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Top Transactions</h3>
                  </div>
                  <div className="grid grid-cols-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-[#e5eeff] dark:border-gray-700">
                    <span>Category</span><span>Description</span><span>Account</span><span>Amount</span>
                  </div>
                  {topTransactions.map((t) => (
                    <div key={t._id} className="grid grid-cols-4 items-center px-6 py-4 border-b dark:border-gray-700 last:border-none hover:bg-[#f8f9ff] dark:hover:bg-gray-750 transition">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] w-fit capitalize">{t.category}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{t.category}</span>
                      <span className="text-sm text-gray-400 capitalize">{t.accountType}</span>
                      <span className="text-sm font-bold text-red-500">-₱{Number(t.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;