import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import NavBar from './components/shared/NavBar';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupsPage from './pages/GroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen bg-theme-bg-primary text-theme-text-primary transition-colors duration-200">
              <NavBar />
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  className: '!bg-theme-bg-primary !text-theme-text-primary border border-theme-border shadow-soft',
                }}
              />
              
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/chat/:groupId" element={<ChatPage />} />
                
                {/* Rutas protegidas (requieren autenticación) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/groups/create" element={<CreateGroupPage />} />
                </Route>
                
                {/* Ruta de fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;