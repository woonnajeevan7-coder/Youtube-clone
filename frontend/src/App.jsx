import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoPlayer from './pages/VideoPlayer';
import ChannelPage from './pages/ChannelPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="main-content">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/video/:videoId" element={<VideoPlayer />} />
                <Route path="/channel/:channelId" element={<ChannelPage />} />
              </Routes>
            </div>
          </div>
          <ToastContainer position="bottom-right" theme="dark" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
