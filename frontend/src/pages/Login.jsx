import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);   // ADD
      localStorage.setItem("email", data.email); // ADD
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          className="w-full p-3 mb-3 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 border rounded"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <Link to="/register" className="text-blue-500 hover:underline">
            Don't have an account? Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;