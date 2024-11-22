import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Page/Home.js';
import useAuth from './Hooks/useAuth.js';
import Login from './Page/Login.js';
import TestLoginSuccess from './Page/TestLoginSuccess';

function App() {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/testLoginSuccess" element={<TestLoginSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;