import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import {
  MdNotifications, MdClose, MdCheckCircle,
  MdWarning, MdTrendingDown, MdReceiptLong, MdFlag,
} from "react-icons/md";

// ── Generate notifications from live data ─────────────────────────────────────
function buildNotifications(transactions, goals, bills) {
  const notifs = [];
  const now    = new Date();

  // 1. NEGATIVE BALANCE
  const income   = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);
  const balance  = income - expenses;

  if (balance < 0) {
    notifs.push({
      id:      "balance-negative",
      type:    "danger",
      icon:    <MdTrendingDown size={18} />,
      title:   "Negative Balance",
      message: `Your account balance is -₱${Math.abs(balance).toLocaleString()}. You've exceeded your total income.`,
      time:    "Now",
    });
  }

  // 2. BILLS DUE SOON (within 3 days)
  bills.forEach((bill) => {
    const diff = Math.ceil((new Date(bill.dueDate) - now) / (1000 * 60 * 60 * 24));
    if (diff <= 3 && diff >= 0) {
      notifs.push({
        id:      `bill-${bill._id}`,
        type:    "warning",
        icon:    <MdReceiptLong size={18} />,
        title:   "Bill Due Soon",
        message: `"${bill.name}" of ₱${Number(bill.amount).toLocaleString()} is due ${
          diff === 0 ? "today" : diff === 1 ? "tomorrow" : `in ${diff} days`
        }.`,
        time:    `${diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : `${diff}d`}`,
      });
    }
    if (diff < 0) {
      notifs.push({
        id:      `bill-overdue-${bill._id}`,
        type:    "danger",
        icon:    <MdWarning size={18} />,
        title:   "Overdue Bill",
        message: `"${bill.name}" of ₱${Number(bill.amount).toLocaleString()} is overdue!`,
        time:    "Overdue",
      });
    }
  });

  // 3. GOALS near or at target
  goals.forEach((goal) => {
    const pct = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
    if (pct >= 100) {
      notifs.push({
        id:      `goal-done-${goal._id}`,
        type:    "success",
        icon:    <MdCheckCircle size={18} />,
        title:   "Goal Reached! 🎉",
        message: `You've fully funded your "${goal.name}" goal of ₱${Number(goal.target).toLocaleString()}.`,
        time:    "Goal",
      });
    } else if (pct >= 80) {
      notifs.push({
        id:      `goal-near-${goal._id}`,
        type:    "info",
        icon:    <MdFlag size={18} />,
        title:   "Goal Almost There",
        message: `"${goal.name}" is ${pct}% funded — only ₱${Number(goal.target - goal.saved).toLocaleString()} left!`,
        time:    `${pct}%`,
      });
    }
  });

  // 4. LATEST 3 TRANSACTIONS
  const latest = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  latest.forEach((t) => {
    const when = new Date(t.createdAt);
    const diffMs  = now - when;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr  = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    const timeStr =
      diffMin < 1  ? "Just now" :
      diffMin < 60 ? `${diffMin}m ago` :
      diffHr  < 24 ? `${diffHr}h ago` :
                     `${diffDay}d ago`;

    notifs.push({
      id:      `txn-${t._id}`,
      type:    t.type === "income" ? "success" : "expense",
      icon:    <MdReceiptLong size={18} />,
      title:   t.type === "income" ? "Income Recorded" : "Expense Recorded",
      message: `₱${Number(t.amount).toLocaleString()} — ${t.category} (${t.accountType})`,
      time:    timeStr,
    });
  });

  return notifs;
}

// ── TYPE STYLES ───────────────────────────────────────────────────────────────
const TYPE_STYLES = {
  danger:  {
    bg:   "bg-red-50 dark:bg-red-900/20",
    icon: "bg-red-100 dark:bg-red-900/40 text-red-500",
    dot:  "bg-red-500",
  },
  warning: {
    bg:   "bg-yellow-50 dark:bg-yellow-900/20",
    icon: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-500",
    dot:  "bg-yellow-500",
  },
  success: {
    bg:   "bg-green-50 dark:bg-green-900/20",
    icon: "bg-green-100 dark:bg-green-900/40 text-green-600",
    dot:  "bg-green-500",
  },
  info: {
    bg:   "bg-blue-50 dark:bg-blue-900/20",
    icon: "bg-blue-100 dark:bg-blue-900/40 text-blue-500",
    dot:  "bg-blue-500",
  },
  expense: {
    bg:   "bg-[#fff7f7] dark:bg-red-900/10",
    icon: "bg-red-50 dark:bg-red-900/30 text-red-400",
    dot:  "bg-red-400",
  },
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
function NotificationBell() {
  const [open,       setOpen]       = useState(false);
  const [notifs,     setNotifs]     = useState([]);
  const [readIds,    setReadIds]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("readNotifIds") || "[]"); }
    catch { return []; }
  });
  const [loading,    setLoading]    = useState(true);
  const dropRef = useRef(null);

  // ── FETCH all needed data and derive notifications ─────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [txnRes, goalRes, billRes] = await Promise.all([
          API.get("/transactions"),
          API.get("/goals"),
          API.get("/bills"),
        ]);
        setNotifs(buildNotifications(txnRes.data, goalRes.data, billRes.data));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── CLOSE on outside click ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ── PERSIST read IDs ───────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("readNotifIds", JSON.stringify(readIds));
  }, [readIds]);

  const unreadCount = notifs.filter(n => !readIds.includes(n.id)).length;

  const markAllRead = () => setReadIds(notifs.map(n => n.id));

  const dismissOne = (id) => {
    setReadIds(prev => [...new Set([...prev, id])]);
  };

  return (
    <div className="relative" ref={dropRef}>

      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-[#eff4ff] dark:hover:bg-gray-800 rounded-full relative transition"
      >
        <MdNotifications size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN PANEL */}
      {open && (
        <div className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-[#e5eeff] dark:border-gray-700 z-50 overflow-hidden">

          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5eeff] dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#4648d4] font-semibold hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-[#e5eeff] dark:divide-gray-700">
            {loading ? (
              <div className="py-10 text-center text-gray-400 text-sm">Loading...</div>
            ) : notifs.length === 0 ? (
              <div className="py-10 text-center">
                <MdCheckCircle size={32} className="text-gray-200 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              notifs.map((n) => {
                const style   = TYPE_STYLES[n.type] || TYPE_STYLES.info;
                const isRead  = readIds.includes(n.id);
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-5 py-4 transition ${
                      isRead
                        ? "opacity-50 dark:opacity-40"
                        : style.bg
                    }`}
                  >
                    {/* ICON */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${style.icon}`}>
                      {n.icon}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {!isRead && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />}
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{n.title}</p>
                        <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{n.message}</p>
                    </div>

                    {/* DISMISS */}
                    {!isRead && (
                      <button
                        onClick={() => dismissOne(n.id)}
                        className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 flex-shrink-0 mt-0.5 transition"
                      >
                        <MdClose size={14} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          {notifs.length > 0 && (
            <div className="px-5 py-3 border-t border-[#e5eeff] dark:border-gray-700 text-center">
              <p className="text-xs text-gray-400">
                {notifs.length} notification{notifs.length !== 1 ? "s" : ""} total
                {unreadCount === 0 ? " — all read" : ` · ${unreadCount} unread`}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default NotificationBell;