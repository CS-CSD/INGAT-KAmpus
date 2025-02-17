import Sidebar from "./SideBar.js";
import "./css/Home.css";

const HomePage = () => {
    return (
      <div className="HomePage">
        <Sidebar />
        <div className="Content">
          <h2>Dashboard</h2>
          <h2>di ko pala alam ilalagay ko dito</h2>
        </div>
      </div>
    );
};

export default HomePage;
