import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { TransactionCategory } from '../contexts/AppStateContext';
import Button from '../components/common/Button';

const TransactionCategoryModal = ({ transaction, onClose }) => {
    const { isDarkMode, processTransaction } = useAppState();

    // Format the amount as currency
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(transaction.amount);

    // Handle category selection
    const handleCategorySelect = (category) => {
        processTransaction(transaction.id, category);
        onClose();
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-black bg-opacity-75' : 'bg-gray-800 bg-opacity-75'
            }`}>
            <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'
                }`}>
                {/* Header */}
                <div className="mb-4 flex justify-between items-center">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Transaction: {formattedAmount}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-1 rounded-full hover:bg-gray-200 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Question */}
                <div className="my-6 text-center">
                    <h3 className={`text-lg font-medium mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        What happened to this transaction?
                    </h3>

                    <div className="flex flex-col space-y-3">
                        <Button onClick={() => handleCategorySelect(TransactionCategory.DEBT_PAID)}>
                            Debt Paid
                        </Button>

                        <Button onClick={() => handleCategorySelect(TransactionCategory.SAVED)}>
                            Saved
                        </Button>

                        <Button onClick={() => handleCategorySelect(TransactionCategory.INVESTED)}>
                            Invested
                        </Button>

                        <Button onClick={() => handleCategorySelect(TransactionCategory.SPENT)}>
                            Spent
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionCategoryModal;