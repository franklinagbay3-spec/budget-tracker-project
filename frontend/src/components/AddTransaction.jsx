import { useState } from "react";
import API from "../services/api";
import {
  FaMoneyBillWave,
  FaTag,
  FaWallet,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

function AddTransaction({ onAdd }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [accountType, setAccountType] = useState("cash");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/transactions", {
        type, amount, category, accountType,
      });
      onAdd(data);
      setAmount("");
      setCategory("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* TYPE TOGGLE */}
      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Transaction Type
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
              type === "expense"
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaArrowDown /> Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
              type === "income"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <FaArrowUp /> Income
          </button>
        </div>
      </div>

      {/* AMOUNT */}
      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Amount
        </label>
        <div className="relative">
          <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* CATEGORY */}
      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Category
        </label>
        <div className="relative">
          <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            placeholder="e.g. Food, Bills, Salary..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* ACCOUNT TYPE */}
      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Account
        </label>
        <div className="relative">
          <FaWallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" />
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="gcash">GCash</option>
          </select>
        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition shadow-md ${
          type === "income"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        <FaPlus />
        Add {type === "income" ? "Income" : "Expense"}
      </button>

    </form>
  );
}

export default AddTransaction;