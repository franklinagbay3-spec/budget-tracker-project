import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          className="w-full p-3 mb-3 border rounded"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

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
          onClick={handleRegister}
          className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
        >
          Register
        </button>

        {/* LINK TO LOGIN */}
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;