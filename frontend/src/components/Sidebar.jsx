import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard, MdOutlinePayments, MdAnalytics,
  MdCalendarToday, MdDescription, MdSettings,
  MdTrackChanges, MdHelp, MdLogout, MdAccountBalanceWallet,
} from "react-icons/md";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard",    icon: <MdDashboard size={20} />,        path: "/dashboard" },
    { label: "Transactions", icon: <MdOutlinePayments size={20} />,  path: "/transactions" },
    { label: "Analytics",    icon: <MdAnalytics size={20} />,        path: "/analytics" },
    { label: "Goals",        icon: <MdTrackChanges size={20} />,     path: "/goals" },
    { label: "Calendar",     icon: <MdCalendarToday size={20} />,    path: "/calendar" },
    { label: "Reports",      icon: <MdDescription size={20} />,      path: "/reports" },
    { label: "Settings",     icon: <MdSettings size={20} />,         path: "/settings" },
  ];

  return (
    <div className="w-[280px] min-h-screen bg-white dark:bg-gray-900 border-r border-[#e5eeff] dark:border-gray-700 flex flex-col py-6 px-4 flex-shrink-0">

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-[#4648d4] rounded-lg flex items-center justify-center">
          <MdAccountBalanceWallet size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Wealth Pilot</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">Personal Finance</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#6063ee] text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:bg-[#eff4ff] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* BOTTOM */}
      <div className="mt-auto space-y-4">
        {/* UPGRADE CARD */}
        <div className="p-4 bg-[#eff4ff] dark:bg-gray-800 rounded-xl border border-[#e5eeff] dark:border-gray-700">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Keep Tracking!</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mb-3">
            You're doing great managing your finances.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-[#e5eeff] dark:border-gray-700 pt-3 space-y-1">
          <button className="w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-[#eff4ff] dark:hover:bg-gray-800 transition-all">
            <MdHelp size={20} />
            Help Center
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold"
          >
            <MdLogout size={20} />
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;