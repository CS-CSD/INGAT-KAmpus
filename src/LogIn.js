import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/LoginPage.css";  
import { Eye, EyeOff } from "lucide-react";  
import { supabase } from './supabase';
import { useUser } from './userContext';

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setRole } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Query Supabase
      const { data, error: queryError } = await supabase
        .from("accounts_table")
        .select("*")
        .eq("id", id.trim())
        .eq("password", password.trim())
        .single();

      if (queryError) throw queryError;
      if (!data) {
        throw new Error("Invalid credentials");
      }

      // Set user context
      setUser(data.id);
      setRole(data.role);

      // Redirect based on role
      const redirectPath = data.role === "student" ? '/student-view' : '/home';
      navigate(redirectPath);
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Link to="/" className="logo-container">
        <img src="/INGATKAmpusFinal.png" alt="INGAT KAmpus Logo" className="logo" />
      </Link>

      <div className="login-box">
        <h2>Welcome</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
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
            <button type="button">Forgot Password?</button>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;