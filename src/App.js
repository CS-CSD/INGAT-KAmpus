import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LogIn";
import HomePage from "./Home"; 
import RegisterItem from "./ItemRegister";
import ItemStorage from "./ItemStorage";
import ClaimedItems from "./ClaimedItem";
import ReportGeneration from "./ReportGeneration";
import Account from "./Account";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/item-register" element={<RegisterItem />} />
        <Route path="/item-storage" element={<ItemStorage />} />
        <Route path="/claimed-items" element={<ClaimedItems />} />
        <Route path="/report-generation" element ={<ReportGeneration/>}/>
        <Route path="/account" element ={<Account/>}/>
      </Routes>
    </Router>
  );
};

export default App;
