import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ExpenseChart({ income, expenses }) {
  const data = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Income vs Expenses</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;