import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../contexts/AppStateContext';
import Button from '../components/common/Button';

const LogTransaction = () => {
    const { isDarkMode, addTransaction } = useAppState();
    const navigate = useNavigate();

    // Form state
    const [amount, setAmount] = useState('');
    const [label, setLabel] = useState('');
    const [currentStep, setCurrentStep] = useState('amount'); // 'amount', 'label', or 'budget'

    // Add animation state
    const [animateContent, setAnimateContent] = useState(false);

    // Input validation
    const isValidAmount = () => {
        const numAmount = parseFloat(amount);
        return !isNaN(numAmount) && numAmount > 0;
    };

    // Handle amount submission
    const handleAmountSubmit = (e) => {
        e.preventDefault();
        if (isValidAmount()) {
            setCurrentStep('label');
        }
    };

    // Handle label submission
    const handleLabelSubmit = (e) => {
        e.preventDefault();
        setCurrentStep('budget');
    };

    // Handle transaction finalization
    const handleBudgetQuestion = (isPreApproved) => {
        if (isValidAmount()) {
            addTransaction(parseFloat(amount), label, isPreApproved);
            navigate('/transactions');
        }
    };

    // Go back to previous step
    const goBack = () => {
        if (currentStep === 'label') {
            setCurrentStep('amount');
        } else if (currentStep === 'budget') {
            setCurrentStep('label');
        }
    };

    // Add animation effect on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateContent(true);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    // Render appropriate form based on current step
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'amount':
                return (
                    <form onSubmit={handleAmountSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="amount"
                                className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            >
                                Enter Transaction Amount
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className={`text-gray-500 sm:text-sm`}>$</span>
                                </div>
                                <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    className={`block w-full pl-7 pr-12 py-3 rounded-md focus:ring-2 ${isDarkMode
                                        ? 'dark-hover text-white border-gray-700 focus:ring-accent-dark focus:border-accent-dark'
                                        : 'bg-white text-gray-900 border-gray-300 focus:ring-accent-light focus:border-accent-light'
                                        }`}
                                    placeholder="0.00"
                                    aria-describedby="amount-currency"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    step="0.01"
                                    min="0.01"
                                    required
                                    autoFocus
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className={`text-gray-500 sm:text-sm`} id="amount-currency">
                                        USD
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            disabled={!isValidAmount()}
                        >
                            Continue
                        </Button>
                    </form>
                );

            case 'label':
                return (
                    <form onSubmit={handleLabelSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="label"
                                className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            >
                                Let's name it for you:
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="label"
                                    id="label"
                                    className={`block w-full py-3 px-4 rounded-md focus:ring-2 ${isDarkMode
                                        ? 'dark-containe text-white border-gray-700 focus:ring-accent-dark focus:border-accent-dark'
                                        : 'bg-white text-gray-900 border-gray-300 focus:ring-accent-light focus:border-accent-light'
                                        }`}
                                    placeholder="Label (optional)"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <Button type="submit" fullWidth>
                            Continue
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={goBack}
                                className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Go Back
                            </button>
                        </div>
                    </form>
                );

            case 'budget':
                return (
                    <div className="space-y-6">
                        <h3 className={`text-lg font-medium text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Does this Tx fit within the current budget?
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={() => handleBudgetQuestion(true)}
                            >
                                Yes
                            </Button>

                            <Button
                                onClick={() => handleBudgetQuestion(false)}
                            >
                                No
                            </Button>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={goBack}
                                className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="h-full flex items-center justify-center">
            <div className={`w-full max-w-md transition-opacity duration-300 ease-in-out ${animateContent ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`p-6 rounded-lg ${isDarkMode ? 'dark-container' : 'bg-white shadow-md'}`}>
                    <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Log Transaction
                    </h2>

                    {renderCurrentStep()}
                </div>
            </div>
        </div>
    );
};

export default LogTransaction;