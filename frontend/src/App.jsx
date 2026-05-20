
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { LoginSuccess } from './pages/LoginSuccess';
import { LoginInvalid } from './pages/LoginInvalid';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { DocumentManagement } from './pages/DocumentManagement';
import { QrCode } from './pages/QrCode';
import { DocumentSharing } from './pages/DocumentSharing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/login-invalid" element={<LoginInvalid />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/document-management" element={<DocumentManagement />} />
          <Route path="/qr-code" element={<QrCode />} />
          <Route path="/document-sharing" element={<DocumentSharing />} />
        </Route>
      </Routes>
    </BrowserRouter>);

}
export default App