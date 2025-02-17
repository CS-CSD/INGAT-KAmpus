import { Link } from "react-router-dom";
import "./css/SideBar.css";
import "./css/App.css";

const Sidebar = () => {
  return (
    <nav className="Sidebar">
      <img src="/titlecard 2.png" alt="INGAT KAmpus" />
      <ul>
        <li><Link to="/home">Dashboard</Link></li>
        <li><Link to="/item-register">Item Register</Link></li>
        <li><Link to="/item-storage">Item Storage</Link></li>
        <li><Link to="/claimed-items">Claimed Items</Link></li>
        <li><Link to="/report-generation">Report Generation</Link></li>
        <li><Link to="/account">Account</Link></li>
        <li><Link to="/logout">Log Out</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
