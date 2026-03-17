import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Add app-level styles

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoPlayer from './pages/VideoPlayer';
import ChannelPage from './pages/ChannelPage';
import CreateChannel from './pages/CreateChannel';
// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <Header toggleSidebar={toggleSidebar} />
        <div className="main-layout flex">
          <Sidebar isOpen={isSidebarOpen} />
          <main className="main-content flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/video/:id" element={<VideoPlayer />} />
              <Route path="/channel/:id" element={<ChannelPage />} />
              <Route path="/create-channel" element={<CreateChannel />} />
            </Routes>
          </main>
        </div>
      </div>
      <ToastContainer theme="dark" position="bottom-right" />
    </Router>
  );
}

export default App;
