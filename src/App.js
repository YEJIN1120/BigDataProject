import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "./Web/Home";
import Navbar from "./Web/Navbar";
import HospitalPage from './Web/Page/HospitalPage';
import DiseasePage from './Web/Page/DiseasePage';
import CommunityPage from './Web/Page/CommunityPage';
// import DisplayData from './DisplayData';

function App() {
  return (
    // <div style={{padding:'0 300px'}}>
    <div className="w-full h-full flex flex-col justify-start items-center">
      <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path="/hospital" element={<HospitalPage />} />
          <Route path="/disease" element={<DiseasePage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      {/* <DisplayData /> */}
    </div>
  );
}

export default App;