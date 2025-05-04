import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider, useAppState } from './contexts/AppStateContext';
import MuiThemeProvider from './components/MuiThemeProvider';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import LogTransaction from './pages/LogTransaction';
import Settings from './pages/Settings';
import { isStorageAvailable } from './utils/storage';
import './App.css';
import './CustomTheme.css';

// AppContent component for handling the internal app logic
const AppContent = () => {
    const { isDarkMode } = useAppState();
    const [storageAvailable, setStorageAvailable] = useState(true);

    // Set theme class on body
    useEffect(() => {
        document.body.className = isDarkMode
            ? 'bg-background-dark text-white theme-dark'
            : 'bg-white text-black theme-light';
    }, [isDarkMode]);

    useEffect(() => {
        // Check if localStorage is available
        setStorageAvailable(isStorageAvailable());
    }, []);

    // Show error if localStorage is not available
    if (!storageAvailable) {
        return (
            <div className="h-screen flex flex-col items-center justify-center p-4 bg-red-100 text-red-700">
                <h1 className="text-2xl font-bold mb-4">Storage Error</h1>
                <p className="text-center mb-6">
                    This application requires local storage to function properly. Please enable cookies and local storage in your browser settings.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={isDarkMode ? 'theme-dark' : 'theme-light'}>
            <Router>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/log-transaction" element={<LogTransaction />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AppLayout>
            </Router>
        </div>
    );
};

function App() {
    return (
        <AppStateProvider>
            <MuiThemeProvider>
                <AppContent />
            </MuiThemeProvider>
        </AppStateProvider>
    );
}

export default App;