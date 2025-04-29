import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LogIn";
import HomePage from "./Home"; 
import RegisterItem from "./ItemRegister";
import ItemStorage from "./ItemStorage";
import ClaimedItems from "./ClaimedItem";
import ReportGeneration from "./ReportGeneration";
import Account from "./Account";
import Logout from "./Logout"; 
import { UserProvider } from './userContext';
import StudentView from "./StudentView";
import CreateAccount from "./CreateAccount";

const App = () => {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/item-register" element={<RegisterItem />} />
        <Route path="/item-storage" element={<ItemStorage />} />
        <Route path="/claimed-items" element={<ClaimedItems />} />
        <Route path="/report-generation" element={<ReportGeneration />} />
        <Route path="/account" element={<Account />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/student-view" element={<StudentView/>}/>
        <Route path="/create-account" element={<CreateAccount></CreateAccount>}/>
      </Routes>
    </Router>
    </UserProvider>
  );
};

export default App;
