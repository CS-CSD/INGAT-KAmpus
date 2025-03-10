import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/LoginPage.css";  
import { Eye, EyeOff } from "lucide-react";  

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
      <Link to="/" className="logo-container">
      <img src="/INGATKAmpusFinal.png" alt="INGAT KAmpus Logo" className="logo" />
      </Link>

      <div className="login-box">
        <h2>Welcome</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
          <div className="text-right">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
