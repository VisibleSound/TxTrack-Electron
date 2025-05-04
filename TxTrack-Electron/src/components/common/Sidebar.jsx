import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppState } from '../../contexts/AppStateContext';
import DarkLogo from '../../assets/DarkLogo.svg';
import {
    HomeIcon,
    CreditCardIcon,
    PlusCircleIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const { isDarkMode, accentColor } = useAppState();
    const location = useLocation();

    // Navigation items
    const navItems = [
        { name: 'Dashboard', path: '/', icon: HomeIcon },
        { name: 'Transactions', path: '/transactions', icon: CreditCardIcon },
        { name: 'Log Transaction', path: '/log-transaction', icon: PlusCircleIcon },
        { name: 'Settings', path: '/settings', icon: Cog6ToothIcon }
    ];

    // Check if a navigation item is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div
            className={`h-full w-full overflow-y-auto 
            ${isDarkMode ? 'bg-dark-accent border-r border-gray-500' : 'bg-white border-r border-gray-200'}`}
        >
            {/* Logo - Always use DarkLogo regardless of theme */}
            <div className="p-6">
                <Link to="/" className="flex justify-center">
                    <img
                        src={DarkLogo}
                        alt="TxTrack Logo"
                        className="h-16 app-logo"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="mt-6">
                <ul className="space-y-2 px-4">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                style={
                                    isActive(item.path)
                                        ? {
                                            backgroundColor: accentColor,
                                            color: 'white'
                                        }
                                        : {}
                                }
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${!isActive(item.path) && (
                                    isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-300 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                )
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                <span className="text-base">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Version at bottom */}
            <div className="absolute bottom-0 w-full px-6 py-4">
                <p
                    className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}
                >
                    TxTrack v0.1.0
                </p>
            </div>
        </div>
    );
};

export default Sidebar;