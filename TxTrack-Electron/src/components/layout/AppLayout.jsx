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
        <div className="flex h-screen overflow-auto">
            {/* Sidebar - always shown with fixed width */}
            <div className="z-40 w-64 flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main content area - fixed layout, no responsive changes */}
            <div className="flex-1 overflow-auto mr-24">
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