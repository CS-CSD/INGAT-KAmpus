import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LogIn";
import HomePage from "./Home"; // Create this component
import RegisterItem from "./ItemRegister";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/item-register" element={<RegisterItem />} />
      </Routes>
    </Router>
  );
};

export default App;
