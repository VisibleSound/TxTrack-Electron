import React, { useEffect } from 'react';
import { useAppState } from '../../contexts/AppStateContext';
import Sidebar from '../common/Sidebar';

const AppLayout = ({ children }) => {
    const { isDarkMode } = useAppState();

    // Apply dark mode to document body
    useEffect(() => {
        document.body.className = isDarkMode ? 'bg-background-dark text-white' : 'bg-white text-black';
    }, [isDarkMode]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - fixed position with higher z-index */}
            <div className="fixed left-0 top-0 h-full w-64 z-50">
                <Sidebar />
            </div>

            {/* Main content area - with margin-left to avoid sidebar overlap */}
            <div className="flex-1 ml-64 overflow-auto">
                {/* Container with fixed spacing */}
                <div className="px-8 py-10 pt-16">
                    {/* Content container with fixed width */}
                    <div className="min-w-[800px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppLayout;