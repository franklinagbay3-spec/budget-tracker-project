import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics    from "./pages/Analytics";
import Goals        from "./pages/Goals";
import Calendar     from "./pages/Calendar";
import Reports      from "./pages/Reports";
import Settings     from "./pages/Settings";

// PERSIST DARK MODE ON REFRESH
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/analytics"    element={<Analytics />} />
      <Route path="/goals"        element={<Goals />} />
      <Route path="/calendar"     element={<Calendar />} />
      <Route path="/reports"      element={<Reports />} />
      <Route path="/settings"     element={<Settings />} />
    </Routes>
  );
}

export default App;