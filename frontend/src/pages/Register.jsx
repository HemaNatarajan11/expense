import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md ">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Register
        </h2>
        <p className="text-sm text-gray-800 mb-6 text-center">
          Fill all the details
        </p>
        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium text-gray-700 text-left">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="eg.Hema"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium text-gray-700 text-left">
              Email
            </label>
            <input
              type="email"
              name="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eg.hema@gmail.com"
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
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition mt-2"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-md text-gray-700 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
