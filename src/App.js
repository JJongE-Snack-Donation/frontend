import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Page/Home.js';
import './Assets/Font/Font.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* 위처럼 경로, 불러올 페이지 적어주시면 됩니다 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

