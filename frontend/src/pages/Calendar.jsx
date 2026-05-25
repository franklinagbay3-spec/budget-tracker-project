import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();
  const monthName = current.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="flex bg-[#f5f6fa] dark:bg-gray-900 h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your financial activity by date</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 max-w-2xl">

          <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-xl transition">‹</button>
            <h2 className="text-xl font-bold dark:text-white">{monthName} {year}</h2>
            <button onClick={nextMonth} className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-xl transition">›</button>
          </div>

          <div className="grid grid-cols-7 text-center text-sm text-gray-400 dark:text-gray-500 font-medium mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {cells.map((d, i) => (
              <div
                key={i}
                className={`py-2 rounded-xl text-sm font-medium ${
                  d === null ? "" : isToday(d)
                    ? "bg-indigo-600 text-white"
                    : "dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Calendar;