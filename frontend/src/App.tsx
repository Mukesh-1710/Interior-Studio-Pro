import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InvoiceDashboard from './pages/InvoiceDashboard';
import InvoiceForm from './pages/InvoiceForm';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                <Router>
                    <Routes>
                        <Route path="/dashboard" element={<InvoiceDashboard />} />
                        <Route path="/projects/:id" element={<InvoiceForm />} />
                        <Route path="/new" element={<InvoiceForm />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Router>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;
