import { useState } from "react";
import API from "../services/api";

function AddTransaction({ onAdd }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [accountType, setAccountType] = useState("cash");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/transactions", {
        type,
        amount,
        category,
        accountType,
      });

      onAdd(data); // update dashboard instantly

      setAmount("");
      setCategory("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>

      <select onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Category (food, bills...)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <select onChange={(e) => setAccountType(e.target.value)}>
        <option value="cash">Cash</option>
        <option value="bank">Bank</option>
        <option value="gcash">GCash</option>
      </select>

      <button type="submit">Add</button>
    </form>
  );
}

export default AddTransaction;