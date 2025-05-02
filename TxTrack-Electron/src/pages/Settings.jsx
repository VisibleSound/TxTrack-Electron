import React, { useState, useEffect } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import Button from '../components/common/Button';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// Material UI styled switch component
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette?.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette?.mode === 'dark' ? '#5E4DB2' : '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette?.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const Settings = () => {
    const { isDarkMode, toggleDarkMode, resetAll } = useAppState();
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);
    // Add animation state
    const [animateContent, setAnimateContent] = useState(false);

    const handleResetClick = () => {
        setShowResetConfirmation(true);
    };

    const handleConfirmReset = () => {
        resetAll();
        setShowResetConfirmation(false);
    };

    const handleCancelReset = () => {
        setShowResetConfirmation(false);
    };

    // Add animation effect on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateContent(true);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-full">
            <div className={`transition-opacity duration-300 ease-in-out ${animateContent ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Settings
                </h2>

                {/* Settings content */}
                <div className="w-full max-w-md mx-auto">
                    {/* Appearance Section */}
                    <div className="mb-8">
                        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Appearance
                        </h3>

                        <div className={`p-4 rounded-lg ${isDarkMode ? 'dark-container' : 'light-container'}`}>
                            <div className="flex items-center justify-between">
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Dark Mode
                                </span>

                                {/* Replace the old toggle with Material UI toggle */}
                                <FormControlLabel
                                    control={
                                        <MaterialUISwitch
                                            checked={isDarkMode}
                                            onChange={toggleDarkMode}
                                        />
                                    }
                                    label=""
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Management Section */}
                    <div>
                        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Data Management
                        </h3>

                        <div className={`p-4 rounded-lg`}>
                            {!showResetConfirmation ? (
                                <Button
                                    onClick={handleResetClick}
                                    variant="danger"
                                    fullWidth
                                >
                                    Reset All Data
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Are you sure? This will delete all transactions and reset all counters.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button onClick={handleCancelReset}>
                                            No, Cancel
                                        </Button>

                                        <Button onClick={handleConfirmReset} variant="danger">
                                            Yes, Reset
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;