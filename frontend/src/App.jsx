import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

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
    <AuthProvider>
      <SocketProvider>
        <Router>
          {/* <div className="min-h-screen bg-gray-50"> */}
          <div className="min-h-screen bg-gray-50 border-t-4 border-blue-500">
            <NavBar />
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
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
  );
}

export default App;
