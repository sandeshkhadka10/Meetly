import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import History from './pages/history';
import { AuthProvider } from './contexts/AuthContenxt';
import VideoMeetComponent from './pages/VideoMeet';
import HomeComponent from './pages/home';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={2500} />
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path='/auth' element={<Authentication/>}></Route>
        <Route path='/home' element={<HomeComponent/>}></Route>
        <Route path='/history' element={<History/>}></Route>
        <Route path='/:url' element={<VideoMeetComponent/>}></Route>
      </Routes>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
