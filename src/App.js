import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "./Web/Home";
import Navbar from "./Web/Navbar";

function App() {
  return (
    // <div style={{padding:'0 300px'}}>
    <div className="w-full h-full flex flex-col justify-start items-center">
      <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
        </Routes>
    </div>
  );
}

export default App;