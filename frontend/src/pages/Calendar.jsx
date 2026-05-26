import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { MdAdd, MdNotifications, MdChevronLeft, MdChevronRight, MdToday } from "react-icons/md";

function Calendar() {
  const today = new Date();
  const name = localStorage.getItem("name") || "User";
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const year = current.getFullYear();
  const month = current.getMonth();
  const monthName = current.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));
  const goToday   = () => { setCurrent(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDay(today.getDate()); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const upcomingBills = [
    { name: "Cloud Storage", amount: "₱149.99", due: "Due in 2 days", urgent: true },
    { name: "Internet Bill", amount: "₱1,299.00", due: "Oct 15", urgent: false },
    { name: "Gym Membership", amount: "₱599.00", due: "Oct 18", urgent: false },
    { name: "Streaming", amount: "₱189.00", due: "Oct 24", urgent: false },
  ];

  return (
    <div className="flex bg-[#f8f9ff] dark:bg-gray-900 h-screen overflow-hidden font-[Inter]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP NAV */}
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-[#e5eeff] dark:border-gray-700 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Financial Calendar</h1>
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
          <div className="grid grid-cols-3 gap-6">

            {/* CALENDAR */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">

                {/* MONTH NAV */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-[#eff4ff] dark:hover:bg-gray-700 transition">
                      <MdChevronLeft size={20} />
                    </button>
                    <button onClick={goToday} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-[#eff4ff] dark:hover:bg-gray-700 transition flex items-center gap-1">
                      <MdToday size={14} /> Today
                    </button>
                    <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-[#eff4ff] dark:hover:bg-gray-700 transition">
                      <MdChevronRight size={20} />
                    </button>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">{monthName} {year}</h2>
                </div>

                {/* DAY LABELS */}
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                    <span key={d} className="py-2">{d}</span>
                  ))}
                </div>

                {/* DAYS GRID */}
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((d, i) => (
                    <div
                      key={i}
                      onClick={() => d && setSelectedDay(d)}
                      className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition cursor-pointer ${
                        d === null ? "cursor-default" :
                        isToday(d) ? "bg-[#4648d4] text-white font-bold shadow-md" :
                        selectedDay === d ? "bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] font-bold" :
                        "text-gray-700 dark:text-gray-300 hover:bg-[#eff4ff] dark:hover:bg-gray-700"
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* MONTHLY OUTLOOK */}
              <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Monthly Outlook</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Remaining Budget</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold">65%</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                      <div className="bg-[#4648d4] h-1.5 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Liquid Cash</p>
                    <p className="text-xl font-bold text-green-400">₱12,482</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Pending</p>
                    <p className="text-xl font-bold text-red-400">-₱1,642</p>
                  </div>
                </div>
              </div>
            </div>

            {/* UPCOMING BILLS */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#e5eeff] dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-[#e5eeff] dark:border-gray-700">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Upcoming Bills</h3>
                  <span className="text-xs font-bold bg-[#4648d4] text-white px-2 py-0.5 rounded-full">{upcomingBills.length} Due</span>
                </div>

                <div className="divide-y divide-[#e5eeff] dark:divide-gray-700">
                  {upcomingBills.map((bill, i) => (
                    <div key={i} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{bill.name}</p>
                          <p className={`text-xs mt-0.5 ${bill.urgent ? "text-red-500 font-semibold" : "text-gray-400"}`}>{bill.due}</p>
                        </div>
                        <p className={`text-sm font-bold ${bill.urgent ? "text-red-500" : "text-gray-900 dark:text-white"}`}>{bill.amount}</p>
                      </div>
                      {bill.urgent && (
                        <button className="w-full bg-[#4648d4] text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-[#3a3cb8] transition mt-1">
                          Pay Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;