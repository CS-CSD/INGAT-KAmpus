import { Link } from "react-router-dom";
import { useRole } from './userContext'; // Import the useRole hook
import "./css/SideBar.css";
import "./css/App.css";

const Sidebar = () => {
  const userRole = useRole(); // Get the user role from context

  return (
    <nav className="Sidebar">
      <img src="/titlecard 2.png" alt="INGAT KAmpus" />
      <ul>
        {userRole === "student" ? (
          // If the user is a student, only show "Item Storage" and "Log Out"
          <>
            <li><Link to="/item-storage">Item Storage</Link></li>
            <li><Link to="/logout">Log Out</Link></li>
          </>
        ) : (
          // If the user is not a student, show all options
          <>
            <li><Link to="/home">Dashboard</Link></li>
            <li><Link to="/item-register">Item Register</Link></li>
            <li><Link to="/item-storage">Item Storage</Link></li>
            <li><Link to="/claimed-items">Claimed Items</Link></li>
            <li><Link to="/report-generation">Report Generation</Link></li>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/logout">Log Out</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
