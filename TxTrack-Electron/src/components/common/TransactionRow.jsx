import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAppState } from '../../contexts/AppStateContext';

const TransactionRow = ({ transaction, onClick }) => {
    const { isDarkMode, calculateRemainingTime } = useAppState();
    const [remainingTime, setRemainingTime] = useState('');

    // Format the transaction amount as currency
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(transaction.amount);

    // Format the creation date
    const formattedDate = format(new Date(transaction.createdAt), 'MMM d, yyyy h:mm a');

    // Update the remaining time every second for pre-approved transactions
    useEffect(() => {
        if (!transaction.isPreApproved) return;

        const updateTimer = () => {
            const timeInfo = calculateRemainingTime(transaction.createdAt);
            setRemainingTime(timeInfo.formatted);
        };

        // Update once immediately
        updateTimer();

        // Set up interval for updates
        const interval = setInterval(updateTimer, 1000);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, [transaction, calculateRemainingTime]);

    return (
        <div
            onClick={onClick}
            className={`p-3 md:p-4 rounded-lg mb-2 md:mb-3 cursor-pointer transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
        >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                        <span className={`text-base md:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formattedAmount}
                        </span>

                        {transaction.isPreApproved && (
                            <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                }`}>
                                Pre-Approved
                            </span>
                        )}
                    </div>

                    {transaction.label && (
                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {transaction.label}
                        </p>
                    )}

                    <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Created: {formattedDate}
                    </p>
                </div>

                {transaction.isPreApproved && (
                    <div className={`mt-2 sm:mt-0 text-sm font-mono font-medium ${transaction.isExpired
                            ? 'text-red-500'
                            : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        {remainingTime}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionRow;