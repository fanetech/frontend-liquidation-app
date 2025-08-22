import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Composants
import Navigation from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import CustomersPage from './components/customers/CustomersPage';
import LiquidationsPage from './components/liquidations/LiquidationsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="py-4 full-width-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <ProtectedRoute>
                  <CustomersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/liquidations" 
              element={
                <ProtectedRoute>
                  <LiquidationsPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
