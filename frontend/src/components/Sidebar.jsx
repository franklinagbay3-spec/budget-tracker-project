import {
  FaWallet, FaChartPie, FaCog, FaBullseye,
  FaCalendar, FaFileAlt, FaSignOutAlt,
} from "react-icons/fa";
import { MdDashboard, MdOutlinePayments } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

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
    { label: "Dashboard",    icon: <MdDashboard />,      path: "/dashboard" },
    { label: "Transactions", icon: <MdOutlinePayments />, path: "/transactions" },
    { label: "Analytics",    icon: <FaChartPie />,        path: "/analytics" },
    { label: "Goals",        icon: <FaBullseye />,        path: "/goals" },
    { label: "Calendar",     icon: <FaCalendar />,        path: "/calendar" },
    { label: "Reports",      icon: <FaFileAlt />,         path: "/reports" },
    { label: "Settings",     icon: <FaCog />,             path: "/settings" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-indigo-800 to-purple-700 text-white p-6 flex flex-col justify-between">

      {/* TOP */}
      <div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Budget Tracker</h1>
          <p className="text-sm text-purple-200">Manage your finances</p>
        </div>

        <div className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                location.pathname === item.path
                  ? "bg-white/20"
                  : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 bg-red-500/80 hover:bg-red-500 p-3 rounded-xl transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
        <div className="bg-white/10 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <FaWallet className="text-2xl" />
            <div>
              <p className="font-semibold">Keep Tracking!</p>
              <p className="text-xs text-purple-200">You're doing great managing your finances.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;