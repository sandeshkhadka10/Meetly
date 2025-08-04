import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import LandingPage from './pages/landing';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
