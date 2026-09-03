import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Categories from './pages/Categories.jsx';
import Budgets from './pages/Budgets.jsx';
import Insights from './pages/Insights.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

const App = () => {
    return (
        <>
            {/* Toaster must be inside App so it renders into document.body via portal,
                completely outside the overflow-hidden Layout container */}
            <Toaster
                position="top-right"
                containerStyle={{ position: 'fixed', zIndex: 99999 }}
                toastOptions={{
                    style: {
                        fontSize: '14px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                    },
                    duration: 3000,
                    success: {
                        style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
                        iconTheme: { primary: '#22c55e', secondary: '#fff' },
                    },
                    error: {
                        style: { background: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3' },
                        iconTheme: { primary: '#f43f5e', secondary: '#fff' },
                    },
                }}
            />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/insights" element={<Insights />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default App;
