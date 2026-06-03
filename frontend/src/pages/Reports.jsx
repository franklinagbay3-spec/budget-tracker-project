import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  MdAdd, MdNotifications, MdDownload,
  MdCalendarMonth, MdPieChart, MdTrendingUp, MdCheckBox,
  MdCheckBoxOutlineBlank,
} from "react-icons/md";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

// ── TEMPLATES ────────────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "monthly",  label: "Monthly Summary",    icon: <MdCalendarMonth size={18} /> },
  { id: "category", label: "Category Deep Dive", icon: <MdPieChart size={18} />      },
  { id: "income",   label: "Income Analysis",    icon: <MdTrendingUp size={18} />    },
];

// ── DATE FILTER ───────────────────────────────────────────────────────────────
function filterByDays(transactions, days) {
  if (!days || days === "all") return transactions;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(days));
  return transactions.filter((t) => new Date(t.date || t.createdAt) >= cutoff);
}

// ── CSV EXPORT ────────────────────────────────────────────────────────────────
function downloadCSV(rows, filename) {
  const headers = ["Type", "Category", "Account", "Amount", "Date"];
  const lines = [
    headers.join(","),
    ...rows.map((t) =>
      [
        t.type,
        t.category,
        t.accountType,
        t.amount,
        new Date(t.date || t.createdAt).toLocaleDateString(),
      ].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────
function Reports() {
  const [transactions,    setTransactions]    = useState([]);
  const [activeTemplate,  setActiveTemplate]  = useState("monthly");
  const [dateRange,       setDateRange]       = useState("30");
  const [includeBalance,  setIncludeBalance]  = useState(true);
  const [includeCashFlow, setIncludeCashFlow] = useState(true);
  const [includeForecast, setIncludeForecast] = useState(false);
  const [applied,         setApplied]         = useState(false);  // tracks if builder was applied
  const [filtered,        setFiltered]        = useState([]);     // what the builder produces

  const name       = localStorage.getItem("name") || "User";
  const printRef   = useRef();

  // ── FETCH ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    API.get("/transactions").then(({ data }) => {
      setTransactions(data);
      setFiltered(data); // default: all
    });
  }, []);

  // ── DERIVED: which transactions to show ───────────────────────────────────
  // Template click always resets builder filter
  const display = applied ? filtered : filterByDays(transactions, dateRange);

  const income      = display.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const expenses    = display.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);
  const balance     = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  const categoryTotals = display.reduce((acc, t) => {
    if (t.type === "expense") acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

  const byAccount = display.reduce((acc, t) => {
    if (!acc[t.accountType]) acc[t.accountType] = { income: 0, expenses: 0 };
    if (t.type === "income") acc[t.accountType].income   += Number(t.amount);
    else                     acc[t.accountType].expenses += Number(t.amount);
    return acc;
  }, {});

  const topExpenses = [...display]
    .filter(t => t.type === "expense")
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 5);

  const topIncome = [...display]
    .filter(t => t.type === "income")
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 5);

  // ── TEMPLATE CLICK ────────────────────────────────────────────────────────
  const handleTemplateClick = (id) => {
    setActiveTemplate(id);
    setApplied(false); // reset builder filter, show template's natural view
  };

  // ── BUILDER APPLY ─────────────────────────────────────────────────────────
  const handleApply = () => {
    let result = filterByDays(transactions, dateRange);

    // "includeBalance" = show all; "includeCashFlow" = keep expenses;
    // "includeForecast" = keep income (reuse toggles for filtering)
    if (!includeBalance && !includeCashFlow && !includeForecast) {
      result = result; // nothing unchecked means show all
    } else {
      const types = [];
      if (includeCashFlow) types.push("expense");
      if (includeForecast) types.push("income");
      if (types.length > 0 && !(includeBalance && includeCashFlow && includeForecast)) {
        result = result.filter(t => types.includes(t.type));
      }
    }

    setFiltered(result);
    setApplied(true);
  };

  // ── PDF EXPORT ────────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    window.print();
  };

  // ── CSV EXPORT ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const label = TEMPLATES.find(t => t.id === activeTemplate)?.label || "report";
    downloadCSV(display, `${label.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}.csv`);
  };

  // ── RENDER HELPERS ────────────────────────────────────────────────────────
  const KPICard = ({ label, value, color }) => (
    <div className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-4 border border-[#e5eeff] dark:border-gray-600">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold font-[Plus_Jakarta_Sans] ${color}`}>{value}</p>
    </div>
  );

  return (
    <>
      {/* ── PRINT STYLES (injected into head) ── */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #report-print-area { display: block !important; }
        }
        #report-print-area { display: none; }
      `}</style>

      {/* ── HIDDEN PRINT AREA ── */}
      <div id="report-print-area" ref={printRef}>
        <h1 style={{ fontWeight: "bold", fontSize: 22, marginBottom: 8 }}>
          {TEMPLATES.find(t => t.id === activeTemplate)?.label} — Budget Tracker
        </h1>
        <p style={{ color: "#888", marginBottom: 16 }}>
          Generated: {new Date().toLocaleDateString()} &nbsp;|&nbsp; {name}
        </p>
        {(includeBalance || activeTemplate === "monthly") && (
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <tbody>
              {[
                ["Net Income",    `₱${income.toLocaleString()}`],
                ["Total Expenses",`₱${expenses.toLocaleString()}`],
                ["Net Balance",   `₱${balance.toLocaleString()}`],
                ["Savings Rate",  `${savingsRate}%`],
              ].map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "6px 0", color: "#555" }}>{k}</td>
                  <td style={{ padding: "6px 0", fontWeight: "bold", textAlign: "right" }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {(includeCashFlow || activeTemplate === "category") && (
          <>
            <h2 style={{ fontWeight: "bold", marginBottom: 8 }}>Expense by Category</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: "4px 0", color: "#888" }}>Category</th>
                  <th style={{ textAlign: "right", padding: "4px 0", color: "#888" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryTotals).map(([cat, total]) => (
                  <tr key={cat} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "5px 0", textTransform: "capitalize" }}>{cat}</td>
                    <td style={{ padding: "5px 0", textAlign: "right", fontWeight: "bold" }}>₱{total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <h2 style={{ fontWeight: "bold", marginBottom: 8 }}>Transaction Detail</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee" }}>
              {["Type","Category","Account","Amount"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "4px 0", color: "#888", fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {display.map((t) => (
              <tr key={t._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "4px 0", textTransform: "capitalize", fontSize: 12 }}>{t.type}</td>
                <td style={{ padding: "4px 0", textTransform: "capitalize", fontSize: 12 }}>{t.category}</td>
                <td style={{ padding: "4px 0", textTransform: "capitalize", fontSize: 12 }}>{t.accountType}</td>
                <td style={{ padding: "4px 0", fontWeight: "bold", fontSize: 12,
                  color: t.type === "income" ? "#16a34a" : "#ef4444" }}>
                  {t.type === "income" ? "+" : "-"}₱{Number(t.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MAIN UI ── */}
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
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
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
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-white dark:hover:bg-gray-800 transition"
                >
                  <MdDownload size={16} /> Export PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-white dark:hover:bg-gray-800 transition"
                >
                  <MdDownload size={16} /> CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">

              {/* ── LEFT PANEL ── */}
              <div className="space-y-4">

                {/* TEMPLATES */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[#e5eeff] dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Report Templates</h3>
                  <div className="space-y-2">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleTemplateClick(t.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm text-left transition font-semibold ${
                          activeTemplate === t.id
                            ? "bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] border border-[#4648d4]/20"
                            : "text-gray-500 dark:text-gray-400 hover:bg-[#f8f9ff] dark:hover:bg-gray-700 border border-transparent"
                        }`}
                      >
                        <span className={activeTemplate === t.id ? "text-[#4648d4]" : "text-gray-400"}>
                          {t.icon}
                        </span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CUSTOM BUILDER */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[#e5eeff] dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Custom Builder</h3>

                  <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => { setDateRange(e.target.value); setApplied(false); }}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 mb-4"
                  >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="365">This Year</option>
                    <option value="all">All Time</option>
                  </select>

                  <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">
                    Include Data
                  </label>
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Balance Sheets",    val: includeBalance,  set: setIncludeBalance  },
                      { label: "Cash Flow (Expenses)", val: includeCashFlow, set: setIncludeCashFlow },
                      { label: "Income Records",    val: includeForecast, set: setIncludeForecast },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { item.set(!item.val); setApplied(false); }}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 w-full hover:text-[#4648d4] transition"
                      >
                        {item.val
                          ? <MdCheckBox size={18} className="text-[#4648d4]" />
                          : <MdCheckBoxOutlineBlank size={18} className="text-gray-300" />}
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleApply}
                    className="w-full bg-gray-900 dark:bg-[#4648d4] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-[#3a3cb8] transition"
                  >
                    Apply Changes
                  </button>

                  {applied && (
                    <p className="text-xs text-[#4648d4] font-semibold text-center mt-2">
                      ✓ Showing {filtered.length} filtered records
                    </p>
                  )}
                </div>
              </div>

              {/* ── RIGHT REPORT CONTENT ── */}
              <div className="col-span-3 space-y-6">

                {/* REPORT HEADER */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">
                        {TEMPLATES.find(t => t.id === activeTemplate)?.label}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {applied
                          ? `Custom filter · Last ${dateRange === "all" ? "all time" : `${dateRange} days`} · ${display.length} records`
                          : `Last ${dateRange === "all" ? "all time" : `${dateRange} days`} · ${display.length} records`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#4648d4] font-semibold uppercase tracking-wider">Generated</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* ── MONTHLY SUMMARY ── */}
                  {activeTemplate === "monthly" && (
                    <div className="grid grid-cols-4 gap-4">
                      <KPICard label="Net Income"     value={`₱${income.toLocaleString()}`}    color="text-green-600" />
                      <KPICard label="Total Expenses" value={`₱${expenses.toLocaleString()}`}  color="text-red-500"   />
                      <KPICard label="Net Balance"    value={`₱${balance.toLocaleString()}`}   color="text-blue-600"  />
                      <KPICard label="Savings Rate"   value={`${savingsRate}%`}                color="text-[#4648d4]" />
                    </div>
                  )}

                  {/* ── CATEGORY DEEP DIVE ── */}
                  {activeTemplate === "category" && (
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(categoryTotals).length === 0 ? (
                        <p className="text-gray-400 text-sm col-span-2 text-center py-4">No expense data for this period.</p>
                      ) : (
                        Object.entries(categoryTotals)
                          .sort((a, b) => b[1] - a[1])
                          .map(([cat, total]) => {
                            const pct = expenses > 0 ? Math.round((total / expenses) * 100) : 0;
                            return (
                              <div key={cat} className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-4 border border-[#e5eeff] dark:border-gray-600">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-semibold capitalize text-gray-900 dark:text-white">{cat}</span>
                                  <span className="text-sm font-bold text-[#4648d4]">{pct}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-1.5 mb-1">
                                  <div className="bg-[#4648d4] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                <p className="text-xs text-gray-400">₱{total.toLocaleString()}</p>
                              </div>
                            );
                          })
                      )}
                    </div>
                  )}

                  {/* ── INCOME ANALYSIS ── */}
                  {activeTemplate === "income" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <KPICard label="Total Income"  value={`₱${income.toLocaleString()}`}   color="text-green-600" />
                        <KPICard label="Transactions"  value={display.filter(t => t.type === "income").length.toString()} color="text-gray-900 dark:text-white" />
                        <KPICard label="Savings Rate"  value={`${savingsRate}%`}               color="text-[#4648d4]" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Income by Account</h4>
                      {Object.entries(byAccount).map(([account, val]) => (
                        <div key={account} className="flex items-center justify-between p-3 bg-[#f8f9ff] dark:bg-gray-700 rounded-xl border border-[#e5eeff] dark:border-gray-600">
                          <span className="text-sm font-semibold capitalize text-gray-900 dark:text-white">{account}</span>
                          <span className="text-sm font-bold text-green-600">+₱{val.income.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── CHART — always shown ── */}
                {chartData.length > 0 && (activeTemplate === "monthly" || activeTemplate === "category") && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Expense Distribution</h3>
                      <span className="text-xs text-gray-400">By Category</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData} barSize={36}>
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip
                          formatter={(v) => [`₱${v.toLocaleString()}`, "Amount"]}
                          contentStyle={{ borderRadius: "12px", border: "1px solid #e5eeff", fontSize: "12px" }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={i === 0 ? "#4648d4" : "#c0c1ff"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* ── TOP TRANSACTIONS TABLE ── */}
                {(activeTemplate === "monthly" || activeTemplate === "category") && topExpenses.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#e5eeff] dark:border-gray-700">
                    <div className="p-6 border-b border-[#e5eeff] dark:border-gray-700">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Top Expenses</h3>
                    </div>
                    <div className="grid grid-cols-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-[#e5eeff] dark:border-gray-700">
                      <span>Category</span><span>Account</span><span>Type</span><span>Amount</span>
                    </div>
                    {topExpenses.map((t) => (
                      <div key={t._id} className="grid grid-cols-4 items-center px-6 py-4 border-b dark:border-gray-700 last:border-none hover:bg-[#f8f9ff] dark:hover:bg-gray-750 transition">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] w-fit capitalize">{t.category}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{t.accountType}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 w-fit">Expense</span>
                        <span className="text-sm font-bold text-red-500">-₱{Number(t.amount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── INCOME TABLE (Income Analysis) ── */}
                {activeTemplate === "income" && topIncome.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#e5eeff] dark:border-gray-700">
                    <div className="p-6 border-b border-[#e5eeff] dark:border-gray-700">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Top Income Entries</h3>
                    </div>
                    <div className="grid grid-cols-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-[#e5eeff] dark:border-gray-700">
                      <span>Category</span><span>Account</span><span>Type</span><span>Amount</span>
                    </div>
                    {topIncome.map((t) => (
                      <div key={t._id} className="grid grid-cols-4 items-center px-6 py-4 border-b dark:border-gray-700 last:border-none hover:bg-[#f8f9ff] dark:hover:bg-gray-750 transition">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 w-fit capitalize">{t.category}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{t.accountType}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 w-fit">Income</span>
                        <span className="text-sm font-bold text-green-600">+₱{Number(t.amount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;