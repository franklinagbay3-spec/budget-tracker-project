import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  MdPerson, MdNotifications, MdSecurity, MdAdd,
  MdNotificationsActive, MdAccountBalance, MdDelete,
  MdDownload, MdCheckCircle, MdError,
} from "react-icons/md";

function Settings() {
  const storedName  = localStorage.getItem("name") || "";
  const storedEmail = localStorage.getItem("email") || "";
  const storedDark  = localStorage.getItem("darkMode") === "true";

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName]           = useState(storedName);
  const [email, setEmail]         = useState(storedEmail);
  const [saved, setSaved]         = useState(false);
  const [darkMode, setDarkMode]   = useState(storedDark);

  const [alerts, setAlerts] = useState({
    overspending: true,
    billReminders: true,
    newsletters: false,
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSave = () => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "profile",  label: "Personal Information", icon: <MdPerson size={18} /> },
    { id: "notifs",   label: "Notifications",         icon: <MdNotifications size={18} /> },
    { id: "security", label: "Security & Data",        icon: <MdSecurity size={18} /> },
  ];

  const inputCls = "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";

  return (
    <div className="flex bg-[#f8f9ff] dark:bg-gray-900 h-screen overflow-hidden font-[Inter]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP NAV */}
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-[#e5eeff] dark:border-gray-700 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#4648d4] hover:bg-[#3a3cb8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
              <MdAdd size={18} /> Add Transaction
            </button>
            <div className="w-9 h-9 rounded-full bg-[#4648d4] flex items-center justify-center text-white text-sm font-bold">
              {(storedName || "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-4 gap-6">

            {/* LEFT PANEL */}
            <div className="space-y-4">
              {/* PROFILE CARD */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700 text-center">
                <div className="w-20 h-20 rounded-full bg-[#4648d4] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {(storedName || "U").charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{storedName || "User"}</h3>
                <p className="text-sm text-gray-400 mb-3">{storedEmail || "No email set"}</p>
                <span className="text-xs font-semibold bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4] px-3 py-1 rounded-full">Member</span>
              </div>

              {/* TABS */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-[#e5eeff] dark:border-gray-700 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? "bg-[#eff4ff] dark:bg-gray-700 text-[#4648d4]"
                        : "text-gray-500 dark:text-gray-400 hover:bg-[#f8f9ff] dark:hover:bg-gray-700"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* ACCOUNT SUMMARY */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[#e5eeff] dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account Summary</p>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Storage Used</span>
                  <span className="font-bold text-gray-900 dark:text-white">45%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-[#4648d4] h-2 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="col-span-3 space-y-6">

              {/* PERSONAL INFORMATION */}
              {activeTab === "profile" && (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">Personal Information</h2>
                      <button onClick={handleSave} className="bg-[#4648d4] hover:bg-[#3a3cb8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
                        {saved ? "Saved ✓" : "Save Changes"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 font-semibold mb-1.5">Full Name</label>
                        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 font-semibold mb-1.5">Email Address</label>
                        <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
                      </div>
                    </div>
                  </div>

                  {/* PREFERENCES */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Interface Theme</p>
                        <p className="text-xs text-gray-400 mb-3">Switch between light and dark</p>
                        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                          <button
                            onClick={() => setDarkMode(false)}
                            className={`flex-1 py-2 text-sm font-semibold transition ${!darkMode ? "bg-[#4648d4] text-white" : "text-gray-500 dark:text-gray-400 hover:bg-[#f8f9ff] dark:hover:bg-gray-700"}`}
                          >
                            ☀ Light
                          </button>
                          <button
                            onClick={() => setDarkMode(true)}
                            className={`flex-1 py-2 text-sm font-semibold transition ${darkMode ? "bg-[#4648d4] text-white" : "text-gray-500 dark:text-gray-400 hover:bg-[#f8f9ff] dark:hover:bg-gray-700"}`}
                          >
                            ☾ Dark
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ALERTS */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-6">Alerts & Notifications</h2>
                      <div className="space-y-4">
                        {[
                          { key: "overspending", label: "Overspending Alerts", desc: "When spending exceeds 80% budget" },
                          { key: "billReminders", label: "Bill Reminders", desc: "Notify 2 days before due date" },
                          { key: "newsletters", label: "Email Newsletters", desc: "Weekly financial tips and updates" },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</p>
                              <p className="text-xs text-gray-400">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => setAlerts(a => ({ ...a, [item.key]: !a[item.key] }))}
                              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${alerts[item.key] ? "bg-[#4648d4]" : "bg-gray-200 dark:bg-gray-600"}`}
                            >
                              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${alerts[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "notifs" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-[Plus_Jakarta_Sans]">Notification Settings</h2>
                  <div className="space-y-5">
                    {[
                      { icon: <MdNotificationsActive size={20} className="text-[#4648d4]" />, key: "overspending", label: "Overspending Alerts", desc: "Get notified when you exceed your budget limits" },
                      { icon: <MdAccountBalance size={20} className="text-green-500" />, key: "billReminders", label: "Bill Reminders", desc: "Reminders before bills are due" },
                      { icon: <MdNotifications size={20} className="text-gray-400" />, key: "newsletters", label: "Email Newsletters", desc: "Weekly financial tips and product updates" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-[#f8f9ff] dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setAlerts(a => ({ ...a, [item.key]: !a[item.key] }))}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${alerts[item.key] ? "bg-[#4648d4]" : "bg-gray-200 dark:bg-gray-600"}`}
                        >
                          <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${alerts[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECURITY & DATA TAB */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-[Plus_Jakarta_Sans]">Data Management</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[#f8f9ff] dark:bg-gray-700 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Export Account Data</p>
                          <p className="text-xs text-gray-400">Download all your transactions and reports in CSV or PDF format.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-white dark:hover:bg-gray-800 transition">
                          <MdDownload size={16} /> Backup Data
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/40">
                        <div>
                          <p className="text-sm font-semibold text-red-600">Delete Account</p>
                          <p className="text-xs text-red-400">Permanently remove your account and all associated data. This action cannot be undone.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                          <MdDelete size={16} /> Delete Permanently
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;