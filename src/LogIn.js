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
  const navigate = useNavigate();
  const trimmedId = id.trim();
  const trimmedPassword = password.trim();
  const { setUser, setRole } = useUser();


  const handleLogin = async (e) => {
    e.preventDefault();
  
    console.log("Attempting login with ID:", trimmedId, "and Password:", trimmedPassword); // Debugging log
  
    // Query Supabase
    const { data, error } = await supabase
      .from("accounts_table")
      .select("*")
      .eq("id", trimmedId)
      .eq("password", trimmedPassword)
      .limit(1); // Ensure we only get one row
  
    // Log any error returned by Supabase
    if (error) {
      console.error("Error during query:", error.message);
      alert("Error: " + error.message);  // Display error message to user
      return;
    }
  
    console.log("Data returned from query:", data); // Log the returned data
  
    // Proceed to home page if a match is found
    if (data && data.length > 0) {
      const userData = data[0];
      console.log("Fetched Role:", userData.role);
      setUser(trimmedId);
      setRole(userData.role);
      if (userData.role === "student") {
        navigate('/student-view'); // 👈 Go to item storage if student
      } else {
        navigate('/home'); // 👈 Otherwise go to home
      }
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
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="text"  // Changed from "id" to "text"
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
