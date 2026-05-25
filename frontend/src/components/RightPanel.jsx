function RightPanel({ income, expenses, balance, transactions }) {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  return (
    <div className="w-80 bg-orange-50 dark:bg-gray-800 min-h-screen p-6">

      <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow mb-6 text-center">
        <img src="https://i.pravatar.cc/150" alt="profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h2 className="text-2xl font-bold dark:text-white">{name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{email}</p>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-2xl p-5 shadow">
        <h3 className="font-bold text-lg mb-4 dark:text-white">Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="dark:text-gray-300">Income</span>
            <span className="text-green-600 font-bold">₱{income}</span>
          </div>
          <div className="flex justify-between">
            <span className="dark:text-gray-300">Expenses</span>
            <span className="text-red-500 font-bold">₱{expenses}</span>
          </div>
          <div className="flex justify-between">
            <span className="dark:text-gray-300">Balance</span>
            <span className="text-blue-600 font-bold">₱{balance}</span>
          </div>
          <div className="flex justify-between">
            <span className="dark:text-gray-300">Transactions</span>
            <span className="font-bold dark:text-white">{transactions.length}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default RightPanel;