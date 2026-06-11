import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, lazy, Suspense } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'));
const ChannelPage = lazy(() => import('./pages/ChannelPage'));
const PlaylistsPage = lazy(() => import('./pages/PlaylistsPage'));

const queryClient = new QueryClient();

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="app">
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="main-content">
              <Sidebar isOpen={isSidebarOpen} />
              <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Suspense fallback={<div className="loading-state" style={{ color: '#fff', padding: '24px', textAlign: 'center' }}>Loading page...</div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/video/:videoId" element={<ErrorBoundary><VideoPlayer /></ErrorBoundary>} />
                    <Route path="/channel/:channelId" element={<ChannelPage />} />
                    <Route path="/playlists" element={<PlaylistsPage />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
            <ToastContainer position="bottom-right" theme="dark" />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
