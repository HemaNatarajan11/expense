import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/expense");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md ">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-800 mb-6 text-center">
          Login to your account
        </p>
        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium text-gray-700 text-left">
              Email
            </label>
            <input
              type="email"
              name="mail"
              placeholder="eg.hema@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-md text-left font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition rounded-lg"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-md text-gray-700 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
