import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MonthlyBarChart({ transactions }) {
  const monthlyData = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyData[month].income += Number(t.amount);
    } else {
      monthlyData[month].expense += Number(t.amount);
    }
  });

  const data = Object.values(monthlyData);

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="text-xl font-bold mb-4">
        Monthly Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" fill="#22c55e" />
          <Bar dataKey="expense" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyBarChart;