// App.jsx
// Root component of the application.
// Handles:
//  - Client-side routing via React Router
//  - Global layout: Header (top bar) + Sidebar (left nav) + main content area
//  - Sidebar open/close toggle state
//  - ToastContainer for app-wide notifications

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// ─── Page imports ───────────────────────────────────────────────────────────
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoPlayer from './pages/VideoPlayer';
import ChannelPage from './pages/ChannelPage';
import CreateChannel from './pages/CreateChannel';

// ─── Shared component imports ────────────────────────────────────────────────
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  // Controls whether the sidebar is expanded or collapsed
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggles the sidebar open/closed when the hamburger menu is clicked
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Top navigation bar — receives the toggle handler */}
        <Header toggleSidebar={toggleSidebar} />

        <div className="main-layout flex">
          {/* Left sidebar — collapses/expands based on isSidebarOpen */}
          <Sidebar isOpen={isSidebarOpen} />

          {/* Main content area — renders the active page */}
          <main className="main-content flex-1">
            <Routes>
              <Route path="/" element={<Home />} />               {/* Home / browse videos */}
              <Route path="/login" element={<Login />} />          {/* Login page */}
              <Route path="/register" element={<Register />} />    {/* Registration page */}
              <Route path="/video/:id" element={<VideoPlayer />} />{/* Individual video player */}
              <Route path="/channel/:id" element={<ChannelPage />} />{/* Channel profile page */}
              <Route path="/create-channel" element={<CreateChannel />} />{/* Create new channel */}
            </Routes>
          </main>
        </div>
      </div>

      {/* Global toast notifications, positioned at bottom-right with dark theme */}
      <ToastContainer theme="dark" position="bottom-right" />
    </Router>
  );
}

export default App;
