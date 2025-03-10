import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar.js";
import "./css/Home.css";

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user"); 
        navigate("/Login.js"); 
    };

    return (
        <div className="HomePage">
            <Sidebar />
            <div className="Content">
                <div className="TopBar">
                    <h2>Dashboard</h2>
                    <div className="SearchBar">
                        <input type="text" placeholder="Search" />
                        <span className="UserIcon">👤</span>
                    </div>
                </div>

                {/* Announcements Section */}
                <div className="Announcements">
                    <h3>Announcements</h3>
                    <div className="AnnouncementBox">
                        Announcement from SDFO
                    </div>
                </div>

                {/* Lost Items Section */}
                <div className="LostItems">
                    <h3>Recently Registered Lost Items</h3>
                    <div className="LostItemCard">
                        <img src="/path-to-image.jpg" alt="Lost Item" />
                    </div>

                    {/* New Lost Items Notification */}
                    <div className="NewLostItems">
                        <span className="Count">6</span>
                        <p>New Lost Items</p>
                        <button>View</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;


