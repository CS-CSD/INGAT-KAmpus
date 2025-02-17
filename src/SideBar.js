import { Link } from "react-router-dom";
import "./css/SideBar.css"

const Sidebar = () => {
  return (
<ul className="Sidebar">
<img src="/titlecard 2.png" alt="INGAT KAmpus" />
    <a href="/Home">Dashboard</a>
    <a href="/ItemRegister">Item Register</a>
    <a href="/ItemStorage">Item Storage</a>
    <a href="/ClaimedItems">Claimed Items</a>
    <a href="/ReportGeneration">Report Generation</a>
</ul>
  );
};

export default Sidebar;
