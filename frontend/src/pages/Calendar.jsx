import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import {
  MdAdd, MdNotifications, MdChevronLeft, MdChevronRight,
  MdToday, MdDelete, MdFlightTakeoff, MdShoppingCart,
  MdLocalHospital, MdMovie, MdMoreHoriz, MdCalendarMonth,
} from "react-icons/md";

const PLAN_CATEGORIES = [
  { value: "travel",        label: "Travel",        icon: <MdFlightTakeoff size={14} />,  color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" },
  { value: "groceries",     label: "Groceries",     icon: <MdShoppingCart size={14} />,   color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400" },
  { value: "shopping",      label: "Shopping",      icon: <MdShoppingCart size={14} />,   color: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400" },
  { value: "health",        label: "Health",        icon: <MdLocalHospital size={14} />,  color: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" },
  { value: "entertainment", label: "Entertainment", icon: <MdMovie size={14} />,          color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" },
  { value: "other",         label: "Other",         icon: <MdMoreHoriz size={14} />,      color: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400" },
];

const getCategoryStyle = (cat) =>
  PLAN_CATEGORIES.find((c) => c.value === cat) || PLAN_CATEGORIES[5];

function Calendar() {
  const today = new Date();
  const name  = localStorage.getItem("name") || "User";

  const [current,       setCurrent]       = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay,   setSelectedDay]   = useState(today.getDate());
  const [bills,         setBills]         = useState([]);
  const [plans,         setPlans]         = useState([]);
  const [loadingBills,  setLoadingBills]  = useState(true);
  const [loadingPlans,  setLoadingPlans]  = useState(true);
  const [activeTab,     setActiveTab]     = useState("bills"); // "bills" | "plans"
  const [showBillModal, setShowBillModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [billForm,      setBillForm]      = useState({ name: "", amount: "", dueDate: "", urgent: false });
  const [planForm,      setPlanForm]      = useState({ title: "", date: "", category: "travel", budget: "", notes: "" });

  const year       = current.getFullYear();
  const month      = current.getMonth();
  const monthName  = current.toLocaleString("default", { month: "long" });
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));
  const goToday   = () => {
    setCurrent(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday   = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isSelected = (d) => d === selectedDay;

  // ── FETCH ──────────────────────────────────────────────
  useEffect(() => {
    API.get("/bills")
      .then(({ data }) => setBills(data))
      .catch(console.log)
      .finally(() => setLoadingBills(false));

    API.get("/plans")
      .then(({ data }) => setPlans(data))
      .catch(console.log)
      .finally(() => setLoadingPlans(false));
  }, []);

  // ── HELPERS: does a date fall on a calendar cell? ──────
  const billsOnDay = (d) =>
    bills.filter((b) => {
      const due = new Date(b.dueDate);
      return due.getDate() === d && due.getMonth() === month && due.getFullYear() === year;
    });

  const plansOnDay = (d) =>
    plans.filter((p) => {
      const pd = new Date(p.date);
      return pd.getDate() === d && pd.getMonth() === month && pd.getFullYear() === year;
    });

  // ── BILLS ──────────────────────────────────────────────
  const handleAddBill = async () => {
    if (!billForm.name || !billForm.amount || !billForm.dueDate) return;
    try {
      const { data } = await API.post("/bills", {
        name: billForm.name,
        amount: Number(billForm.amount),
        dueDate: billForm.dueDate,
        urgent: billForm.urgent,
      });
      setBills((prev) => [...prev, data]);
      setBillForm({ name: "", amount: "", dueDate: "", urgent: false });
      setShowBillModal(false);
    } catch (err) { console.log(err); }
  };

  const handlePayBill = async (id) => {
    try {
      await API.patch(`/bills/${id}/pay`);
      setBills((prev) => prev.filter((b) => b._id !== id));
    } catch (err) { console.log(err); }
  };

  const handleDeleteBill = async (id) => {
    try {
      await API.delete(`/bills/${id}`);
      setBills((prev) => prev.filter((b) => b._id !== id));
    } catch (err) { console.log(err); }
  };

  // ── PLANS ──────────────────────────────────────────────
  const handleAddPlan = async () => {
    if (!planForm.title || !planForm.date) return;
    try {
      const { data } = await API.post("/plans", {
        title:    planForm.title,
        date:     planForm.date,
        category: planForm.category,
        budget:   Number(planForm.budget) || 0,
        notes:    planForm.notes,
      });
      setPlans((prev) => [...prev, data]);
      setPlanForm({ title: "", date: "", category: "travel", budget: "", notes: "" });
      setShowPlanModal(false);
    } catch (err) { console.log(err); }
  };

  const handleDeletePlan = async (id) => {
    try {
      await API.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) { console.log(err); }
  };

  // ── MISC ───────────────────────────────────────────────
  const formatDue = (dueDate) => {
    const due  = new Date(dueDate);
    const diff = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
    if (diff <= 0)  return "Overdue";
    if (diff === 1) return "Due tomorrow";
    if (diff <= 3)  return `Due in ${diff} days`;
    return due.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
  };

  const isUrgent = (dueDate) =>
    Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 3;

  const formatPlanDate = (date) =>
    new Date(date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";

  // Plans / bills for the selected day
  const selectedBills = billsOnDay(selectedDay);
  const selectedPlans = plansOnDay(selectedDay);

  return (
    <div className="flex bg-[#f8f9ff] dark:bg-gray-900 h-screen overflow-hidden font-[Inter]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP NAV */}
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-[#e5eeff] dark:border-gray-700 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Financial Calendar</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPlanModal(true)}
              className="flex items-center gap-2 border border-[#4648d4] text-[#4648d4] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#eff4ff] transition"
            >
              <MdCalendarMonth size={16} /> Add Plan
            </button>
            <button
              onClick={() => setShowBillModal(true)}
              className="flex items-center gap-2 bg-[#4648d4] hover:bg-[#3a3cb8] text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              <MdAdd size={18} /> Add Bill
            </button>
            <button className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-[#eff4ff] dark:hover:bg-gray-800 rounded-full relative">
              <MdNotifications size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#4648d4] flex items-center justify-center text-white text-sm font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* MAIN */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-5 h-full">

            {/* ── LEFT: CALENDAR ── */}
            <div className="col-span-2 flex flex-col gap-5">

              {/* CALENDAR CARD */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[#e5eeff] dark:border-gray-700">

                {/* Month Nav */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    {monthName} {year}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-[#eff4ff] dark:hover:bg-gray-700 transition">
                      <MdChevronLeft size={18} />
                    </button>
                    <button onClick={goToday} className="px-2.5 py-1 text-xs font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-[#eff4ff] dark:hover:bg-gray-700 transition flex items-center gap-1">
                      <MdToday size={13} /> Today
                    </button>
                    <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-[#eff4ff] dark:hover:bg-gray-700 transition">
                      <MdChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 mb-1">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-0.5">
                  {cells.map((d, i) => {
                    const hasBill = billsOnDay(d).length > 0;
                    const hasPlan = plansOnDay(d).length > 0;
                    return (
                      <div
                        key={i}
                        onClick={() => d && setSelectedDay(d)}
                        className={`relative flex flex-col items-center justify-center h-10 rounded-xl text-sm font-medium transition ${
                          !d           ? "cursor-default" :
                          isToday(d)   ? "bg-[#4648d4] text-white font-bold cursor-pointer shadow-sm" :
                          isSelected(d) ? "bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] font-bold cursor-pointer" :
                                         "text-gray-700 dark:text-gray-300 hover:bg-[#eff4ff] dark:hover:bg-gray-700 cursor-pointer"
                        }`}
                      >
                        {d}
                        {/* Dot indicators */}
                        {d && (hasBill || hasPlan) && (
                          <div className="absolute bottom-1 flex gap-0.5">
                            {hasBill && <span className="w-1 h-1 rounded-full bg-red-500" />}
                            {hasPlan && <span className="w-1 h-1 rounded-full bg-blue-500" />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#e5eeff] dark:border-gray-700">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Bill due
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Plan
                  </div>
                </div>
              </div>

              {/* SELECTED DAY DETAIL */}
              {(selectedBills.length > 0 || selectedPlans.length > 0) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[#e5eeff] dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                    {monthName} {selectedDay} — Events
                  </h3>
                  <div className="space-y-2">
                    {selectedBills.map((b) => (
                      <div key={b._id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{b.name}</span>
                          <span className="text-xs text-red-500 font-semibold">Bill</span>
                        </div>
                        <span className="text-sm font-bold text-red-500">₱{Number(b.amount).toLocaleString()}</span>
                      </div>
                    ))}
                    {selectedPlans.map((p) => {
                      const cat = getCategoryStyle(p.category);
                      return (
                        <div key={p._id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{p.title}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
                          </div>
                          {p.budget > 0 && (
                            <span className="text-sm font-bold text-blue-500">₱{Number(p.budget).toLocaleString()}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MONTHLY OUTLOOK */}
              <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Monthly Outlook</p>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Bills Due</p>
                    <p className="text-xl font-bold">{bills.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Plans</p>
                    <p className="text-xl font-bold text-blue-400">{plans.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Bills</p>
                    <p className="text-xl font-bold text-red-400">
                      ₱{bills.reduce((a, b) => a + Number(b.amount), 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Plan Budget</p>
                    <p className="text-xl font-bold text-green-400">
                      ₱{plans.reduce((a, p) => a + Number(p.budget), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex flex-col gap-4 overflow-hidden">

              {/* TAB SWITCHER */}
              <div className="flex rounded-xl border border-[#e5eeff] dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
                <button
                  onClick={() => setActiveTab("bills")}
                  className={`flex-1 py-2.5 text-sm font-semibold transition ${activeTab === "bills" ? "bg-[#4648d4] text-white" : "text-gray-500 dark:text-gray-400 hover:bg-[#eff4ff] dark:hover:bg-gray-700"}`}
                >
                  Bills ({bills.length})
                </button>
                <button
                  onClick={() => setActiveTab("plans")}
                  className={`flex-1 py-2.5 text-sm font-semibold transition ${activeTab === "plans" ? "bg-[#4648d4] text-white" : "text-gray-500 dark:text-gray-400 hover:bg-[#eff4ff] dark:hover:bg-gray-700"}`}
                >
                  Plans ({plans.length})
                </button>
              </div>

              {/* BILLS LIST */}
              {activeTab === "bills" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#e5eeff] dark:border-gray-700 flex flex-col overflow-hidden flex-1">
                  <div className="p-4 border-b border-[#e5eeff] dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Upcoming Bills</h3>
                    <button onClick={() => setShowBillModal(true)} className="w-7 h-7 flex items-center justify-center bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] rounded-lg hover:bg-[#e5eeff] transition">
                      <MdAdd size={16} />
                    </button>
                  </div>

                  <div className="overflow-y-auto flex-1">
                    {loadingBills ? (
                      <p className="text-center text-gray-400 text-sm p-6">Loading...</p>
                    ) : bills.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm p-6">No upcoming bills.</p>
                    ) : (
                      bills.map((bill) => {
                        const urgent = isUrgent(bill.dueDate);
                        return (
                          <div key={bill._id} className="p-4 border-b dark:border-gray-700 last:border-none">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{bill.name}</p>
                                <p className={`text-xs mt-0.5 ${urgent ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                                  {formatDue(bill.dueDate)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-bold ${urgent ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                                  ₱{Number(bill.amount).toLocaleString()}
                                </p>
                                <button onClick={() => handleDeleteBill(bill._id)} className="text-gray-300 hover:text-red-500 transition">
                                  <MdDelete size={15} />
                                </button>
                              </div>
                            </div>
                            {urgent && (
                              <button
                                onClick={() => handlePayBill(bill._id)}
                                className="w-full bg-[#4648d4] text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-[#3a3cb8] transition"
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* PLANS LIST */}
              {activeTab === "plans" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#e5eeff] dark:border-gray-700 flex flex-col overflow-hidden flex-1">
                  <div className="p-4 border-b border-[#e5eeff] dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">My Plans</h3>
                    <button onClick={() => setShowPlanModal(true)} className="w-7 h-7 flex items-center justify-center bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] rounded-lg hover:bg-[#e5eeff] transition">
                      <MdAdd size={16} />
                    </button>
                  </div>

                  <div className="overflow-y-auto flex-1">
                    {loadingPlans ? (
                      <p className="text-center text-gray-400 text-sm p-6">Loading...</p>
                    ) : plans.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm p-6">No plans yet. Add one!</p>
                    ) : (
                      plans.map((plan) => {
                        const cat = getCategoryStyle(plan.category);
                        return (
                          <div key={plan._id} className="p-4 border-b dark:border-gray-700 last:border-none">
                            <div className="flex justify-between items-start mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>
                                  {cat.icon} {cat.label}
                                </span>
                              </div>
                              <button onClick={() => handleDeletePlan(plan._id)} className="text-gray-300 hover:text-red-500 transition">
                                <MdDelete size={15} />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{plan.title}</p>
                            <p className="text-xs text-gray-400 mb-1">{formatPlanDate(plan.date)}</p>
                            {plan.budget > 0 && (
                              <p className="text-xs font-semibold text-[#4648d4]">Budget: ₱{Number(plan.budget).toLocaleString()}</p>
                            )}
                            {plan.notes && (
                              <p className="text-xs text-gray-400 mt-1 italic">"{plan.notes}"</p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ADD BILL MODAL */}
      {showBillModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 w-full max-w-md relative shadow-2xl border border-[#e5eeff] dark:border-gray-700">
            <button onClick={() => setShowBillModal(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">✕</button>
            <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">Add Upcoming Bill</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Bill Name</label>
                <input className={inputCls} placeholder="e.g. Internet Bill" value={billForm.name} onChange={(e) => setBillForm({ ...billForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Amount (₱)</label>
                <input className={inputCls} placeholder="0.00" type="number" value={billForm.amount} onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Due Date</label>
                <input className={inputCls} type="date" value={billForm.dueDate} onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="urgent" checked={billForm.urgent} onChange={(e) => setBillForm({ ...billForm, urgent: e.target.checked })} className="w-4 h-4 accent-[#4648d4]" />
                <label htmlFor="urgent" className="text-sm text-gray-600 dark:text-gray-300 font-medium">Mark as urgent</label>
              </div>
              <button onClick={handleAddBill} className="w-full bg-[#4648d4] hover:bg-[#3a3cb8] text-white py-3 rounded-lg font-semibold transition mt-1">
                Add Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PLAN MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 w-full max-w-md relative shadow-2xl border border-[#e5eeff] dark:border-gray-700">
            <button onClick={() => setShowPlanModal(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">✕</button>
            <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">Add Plan</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Title</label>
                <input className={inputCls} placeholder="e.g. Boracay Trip" value={planForm.title} onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Date</label>
                <input className={inputCls} type="date" value={planForm.date} onChange={(e) => setPlanForm({ ...planForm, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Category</label>
                <select className={inputCls} value={planForm.category} onChange={(e) => setPlanForm({ ...planForm, category: e.target.value })}>
                  {PLAN_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Budget (₱) — optional</label>
                <input className={inputCls} placeholder="0.00" type="number" value={planForm.budget} onChange={(e) => setPlanForm({ ...planForm, budget: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Notes — optional</label>
                <textarea className={inputCls} placeholder="Any extra details..." rows={2} value={planForm.notes} onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })} />
              </div>
              <button onClick={handleAddPlan} className="w-full bg-[#4648d4] hover:bg-[#3a3cb8] text-white py-3 rounded-lg font-semibold transition mt-1">
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;