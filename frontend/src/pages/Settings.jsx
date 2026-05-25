import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Settings() {
  const storedName  = localStorage.getItem("name") || "";
  const storedEmail = localStorage.getItem("email") || "";
  const storedDark  = localStorage.getItem("darkMode") === "true";

  const [name, setName]       = useState(storedName);
  const [email, setEmail]     = useState(storedEmail);
  const [saved, setSaved]     = useState(false);
  const [darkMode, setDarkMode] = useState(storedDark);

  // APPLY DARK MODE TO <html> ON MOUNT AND ON TOGGLE
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSave = () => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex bg-[#f5f6fa] dark:bg-gray-900 h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your profile and preferences</p>
        </div>

        {/* PROFILE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 max-w-lg mb-6">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Profile Information</h2>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Name</label>
          <input
            className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Email</label>
          <input
            className="w-full p-3 border rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
          />

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>

        {/* DARK MODE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 max-w-lg">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Appearance</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch to a darker interface</p>
            </div>

            {/* TOGGLE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                darkMode ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                  darkMode ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;