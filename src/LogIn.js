import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/LoginPage.css";  

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (email === "test@e.com" && password === "pass") {
      localStorage.setItem("user", JSON.stringify({ email }));
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };
  

  return (
    <div className="login-container">
      
      <h1 className="page-title">INGAT KAmpus</h1>

      <div className="login-box">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
              </span>
            </div>
          </div>
          <div className="text-right">
            <a href="#" className="text-blue-400 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded font-bold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
