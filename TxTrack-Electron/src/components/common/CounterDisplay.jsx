import React from 'react';
import { useAppState } from '../../contexts/AppStateContext';

const CounterDisplay = ({ title, amount }) => {
    const { isDarkMode } = useAppState();

    // Format the amount as currency
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);

    return (
        <div
            className={`flex justify-between items-center p-4 rounded-lg ${isDarkMode ? 'dark-container' : 'light-container'}`}
        >
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {title}
            </h3>
            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {formattedAmount}
            </p>
        </div>
    );
};

export default CounterDisplay;