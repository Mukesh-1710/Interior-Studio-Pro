import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InvoiceDashboard from './pages/InvoiceDashboard';
import InvoiceForm from './pages/InvoiceForm';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={<InvoiceDashboard />} />
                <Route path="/projects/:id" element={<InvoiceForm />} />
                <Route path="/new" element={<InvoiceForm />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
