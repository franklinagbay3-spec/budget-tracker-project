function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back 👋</p>
      </div>
      <div className="bg-white dark:bg-gray-800 dark:text-gray-300 px-5 py-3 rounded-xl shadow">
        May 19 - May 25, 2024
      </div>
    </div>
  );
}

export default Header;