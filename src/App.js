import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./LogIn";
import HomePage from "./Home"; // Create this component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
