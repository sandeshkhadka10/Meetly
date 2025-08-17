import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import History from './pages/history';
import { AuthProvider } from './contexts/AuthContenxt';
import VideoMeetComponent from './pages/VideoMeet';

function App() {
  return (
    <>
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path='/auth' element={<Authentication/>}></Route>
         <Route path='/history' element={<History/>}></Route>
        <Route path='/:url' element={<VideoMeetComponent/>}></Route>
      </Routes>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
