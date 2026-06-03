import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { MdAdd, MdNotifications, MdFlightTakeoff, MdDirectionsCar, MdHome, MdSavings, MdDelete } from "react-icons/md";

const ICON_MAP = {
  flight:  <MdFlightTakeoff size={20} />,
  car:     <MdDirectionsCar size={20} />,
  home:    <MdHome size={20} />,
  savings: <MdSavings size={20} />,
};

function Goals() {
  const name = localStorage.getItem("name") || "User";
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", desc: "", target: "", saved: "", icon: "savings" });
  const [loading, setLoading] = useState(true);

  // FETCH
  const fetchGoals = async () => {
    try {
      const { data } = await API.get("/goals");
      setGoals(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  // ADD
  const handleAdd = async () => {
    if (!form.name || !form.target) return;
    try {
      const { data } = await API.post("/goals", {
        name: form.name,
        desc: form.desc,
        target: Number(form.target),
        saved: Number(form.saved) || 0,
        icon: form.icon,
        status: "active",
      });
      setGoals((prev) => [data, ...prev]);
      setForm({ name: "", desc: "", target: "", saved: "", icon: "savings" });
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const featured = goals[0];
  const rest = goals.slice(1);

  const inputCls = "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";

  return (
    <div className="flex bg-[#f8f9ff] dark:bg-gray-900 h-screen overflow-hidden font-[Inter]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP NAV */}
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-[#e5eeff] dark:border-gray-700 flex-shrink-0">
          <div />
          <div className="flex items-center gap-3">
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#4648d4] hover:bg-[#3a3cb8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95">
              <MdAdd size={18} /> New Goal
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

          {/* HERO BANNER */}
          <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2 font-[Plus_Jakarta_Sans]">Future-proof your finances.</h1>
              <p className="text-gray-400 text-sm mb-6 max-w-xl">Set ambitious financial targets and track your progress toward every milestone.</p>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#4648d4] hover:bg-[#3a3cb8] text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm">
                <MdAdd size={18} /> Create New Financial Goal
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-[#e5eeff] dark:border-gray-700">
              <MdSavings size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No goals yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">

              {/* LEFT — FEATURED + REST */}
              <div className="col-span-2 space-y-6">

                {/* FEATURED GOAL */}
                {featured && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500">
                          {ICON_MAP[featured.icon] || <MdSavings size={20} />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{featured.name}</h3>
                          <p className="text-sm text-gray-400">{featured.desc}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(featured._id)} className="text-gray-300 hover:text-red-500 transition">
                        <MdDelete size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-4 border border-[#e5eeff] dark:border-gray-600">
                        <p className="text-xs text-gray-400 mb-1">Amount Saved</p>
                        <p className="text-2xl font-bold text-[#4648d4] font-[Plus_Jakarta_Sans]">₱{featured.saved.toLocaleString()}</p>
                      </div>
                      <div className="bg-[#f8f9ff] dark:bg-gray-700 rounded-xl p-4 border border-[#e5eeff] dark:border-gray-600">
                        <p className="text-xs text-gray-400 mb-1">Target Amount</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">₱{featured.target.toLocaleString()}</p>
                      </div>
                    </div>

                    {(() => {
                      const pct = Math.min(Math.round((featured.saved / featured.target) * 100), 100);
                      return (
                        <>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-[#4648d4] font-semibold">{pct}% Complete</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-[#4648d4] h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* REST OF GOALS */}
                {rest.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {rest.map((g) => {
                      const pct = Math.min(Math.round((g.saved / g.target) * 100), 100);
                      return (
                        <div key={g._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-[#e5eeff] dark:border-gray-700">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-[#eff4ff] dark:bg-gray-700 rounded-xl flex items-center justify-center text-[#4648d4]">
                              {ICON_MAP[g.icon] || <MdSavings size={18} />}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${g.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>
                                {g.status.toUpperCase()}
                              </span>
                              <button onClick={() => handleDelete(g._id)} className="text-gray-300 hover:text-red-500 transition">
                                <MdDelete size={16} />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">{g.name}</h4>
                          <p className="text-xs text-[#4648d4] font-semibold mb-3">₱{g.saved.toLocaleString()} / ₱{g.target.toLocaleString()}</p>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                            <div className="bg-[#4648d4] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-xs text-gray-400">{pct}% complete</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT PANEL */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-[#e5eeff] dark:border-gray-700">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Goals Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Total Goals</span>
                      <span className="font-bold text-gray-900 dark:text-white">{goals.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Active</span>
                      <span className="font-bold text-green-600">{goals.filter(g => g.status === "active").length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Total Saved</span>
                      <span className="font-bold text-[#4648d4]">₱{goals.reduce((a, g) => a + g.saved, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Total Target</span>
                      <span className="font-bold text-gray-900 dark:text-white">₱{goals.reduce((a, g) => a + g.target, 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#4648d4] rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-2">Smart Insight</h3>
                  <p className="text-sm text-indigo-200 mb-4 leading-relaxed">
                    {goals.length > 0
                      ? `You're ${Math.round((goals[0].saved / goals[0].target) * 100)}% toward your "${goals[0].name}" goal. Keep it up!`
                      : "Create your first goal to start tracking your progress."}
                  </p>
                  <button className="w-full bg-white text-[#4648d4] py-2 rounded-xl text-sm font-bold hover:bg-indigo-50 transition">
                    Optimize My Savings
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ADD GOAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-[#e5eeff] dark:border-gray-700">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">✕</button>
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-[Plus_Jakarta_Sans]">Create New Goal</h2>
            <div className="space-y-4">
              <input className={inputCls} placeholder="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={inputCls} placeholder="Description (optional)" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
              <input className={inputCls} placeholder="Target amount (₱)" type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
              <input className={inputCls} placeholder="Already saved (₱)" type="number" value={form.saved} onChange={(e) => setForm({ ...form, saved: e.target.value })} />
              <select className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                <option value="savings">Savings</option>
                <option value="flight">Travel</option>
                <option value="car">Vehicle</option>
                <option value="home">Home</option>
              </select>
              <button onClick={handleAdd} className="w-full bg-[#4648d4] hover:bg-[#3a3cb8] text-white py-3 rounded-lg font-semibold transition">
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;