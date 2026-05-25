import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaBullseye, FaPlus, FaTrash } from "react-icons/fa";

function Goals() {
  const [goals, setGoals] = useState([
    { id: 1, name: "Emergency Fund", target: 50000, saved: 20000 },
    { id: 2, name: "New Laptop", target: 30000, saved: 12000 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", target: "", saved: "" });

  const handleAdd = () => {
    if (!form.name || !form.target) return;
    setGoals((prev) => [...prev, { id: Date.now(), name: form.name, target: Number(form.target), saved: Number(form.saved) || 0 }]);
    setForm({ name: "", target: "", saved: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => setGoals((prev) => prev.filter((g) => g.id !== id));

  return (
    <div className="flex bg-[#f5f6fa] dark:bg-gray-900 h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Goals</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track your savings goals</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition">
            <FaPlus /> Add Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-10 text-center text-gray-500 dark:text-gray-400">
            No goals yet. Add one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map((g) => {
              const pct = Math.min(Math.round((g.saved / g.target) * 100), 100);
              return (
                <div key={g.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-xl">
                        <FaBullseye className="text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg dark:text-white">{g.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ₱{g.saved.toLocaleString()} of ₱{g.target.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(g.id)} className="text-red-400 hover:text-red-600 transition">
                      <FaTrash />
                    </button>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-2">
                    <div className="bg-indigo-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-right text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{pct}%</p>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-xl">✕</button>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">New Goal</h2>
            <input className="w-full p-3 border dark:border-gray-600 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" placeholder="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="w-full p-3 border dark:border-gray-600 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" placeholder="Target amount (₱)" type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
            <input className="w-full p-3 border dark:border-gray-600 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" placeholder="Already saved (₱)" type="number" value={form.saved} onChange={(e) => setForm({ ...form, saved: e.target.value })} />
            <button onClick={handleAdd} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition">Add Goal</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Goals;