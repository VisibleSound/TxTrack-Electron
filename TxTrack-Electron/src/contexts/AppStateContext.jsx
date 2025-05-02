import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AppStateContext = createContext();

// Transaction categories
export const TransactionCategory = {
    DEBT_PAID: 'debtPaid',
    SAVED: 'saved',
    INVESTED: 'invested',
    SPENT: 'spent'
};

// Context provider
export function AppStateProvider({ children }) {
    // State for transactions and other app data
    const [transactions, setTransactions] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [debtPaid, setDebtPaid] = useState(0);
    const [saved, setSaved] = useState(0);
    const [invested, setInvested] = useState(0);
    const [spent, setSpent] = useState(0);

    // Load data from localStorage on initial mount
    useEffect(() => {
        try {
            // Load dark mode preference
            const storedDarkMode = localStorage.getItem('isDarkMode');
            if (storedDarkMode !== null) {
                setIsDarkMode(JSON.parse(storedDarkMode));
            } else {
                // Check if user prefers dark mode
                const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setIsDarkMode(prefersDarkMode);
            }

            // Load saved transactions
            const savedTransactions = localStorage.getItem('transactions');
            if (savedTransactions) {
                setTransactions(JSON.parse(savedTransactions));
            }

            // Load counters
            const storedDebtPaid = localStorage.getItem('debtPaid');
            const storedSaved = localStorage.getItem('saved');
            const storedInvested = localStorage.getItem('invested');
            const storedSpent = localStorage.getItem('spent');

            if (storedDebtPaid) setDebtPaid(parseFloat(storedDebtPaid));
            if (storedSaved) setSaved(parseFloat(storedSaved));
            if (storedInvested) setInvested(parseFloat(storedInvested));
            if (storedSpent) setSpent(parseFloat(storedSpent));
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
            localStorage.setItem('transactions', JSON.stringify(transactions));
            localStorage.setItem('debtPaid', debtPaid.toString());
            localStorage.setItem('saved', saved.toString());
            localStorage.setItem('invested', invested.toString());
            localStorage.setItem('spent', spent.toString());
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }, [transactions, isDarkMode, debtPaid, saved, invested, spent]);

    // Update transaction timers every second
    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTransactions(prevTransactions => {
                const now = new Date();
                const updatedTransactions = prevTransactions.map(transaction => {
                    const expiryTime = new Date(transaction.createdAt);
                    expiryTime.setHours(expiryTime.getHours() + 24);
                    const isExpired = now >= expiryTime;

                    return {
                        ...transaction,
                        isExpired
                    };
                });

                // Only update state if something changed to avoid unnecessary re-renders
                if (JSON.stringify(updatedTransactions) !== JSON.stringify(prevTransactions)) {
                    return updatedTransactions;
                }
                return prevTransactions;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    // Add a new transaction
    const addTransaction = (amount, label, isPreApproved) => {
        const newTransaction = {
            id: crypto.randomUUID(), // Generate a unique ID
            amount,
            label,
            isPreApproved,
            createdAt: new Date().toISOString(),
            isExpired: false
        };

        setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    };

    // Process a transaction (move to a category)
    const processTransaction = (transactionId, category) => {
        // Find the transaction
        const transaction = transactions.find(t => t.id === transactionId);
        if (!transaction) return;

        // Update the relevant counter
        switch (category) {
            case TransactionCategory.DEBT_PAID:
                setDebtPaid(prev => prev + transaction.amount);
                break;
            case TransactionCategory.SAVED:
                setSaved(prev => prev + transaction.amount);
                break;
            case TransactionCategory.INVESTED:
                setInvested(prev => prev + transaction.amount);
                break;
            case TransactionCategory.SPENT:
                setSpent(prev => prev + transaction.amount);
                break;
            default:
                break;
        }

        // Remove the transaction from the list
        setTransactions(prevTransactions =>
            prevTransactions.filter(t => t.id !== transactionId)
        );
    };

    // Reset all data
    const resetAll = () => {
        setTransactions([]);
        setDebtPaid(0);
        setSaved(0);
        setInvested(0);
        setSpent(0);
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    // Calculate remaining time for a transaction
    const calculateRemainingTime = (createdAt) => {
        const expiryTime = new Date(createdAt);
        expiryTime.setHours(expiryTime.getHours() + 24);

        const now = new Date();
        const remainingMs = Math.max(0, expiryTime - now);

        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

        return {
            total: remainingMs,
            hours,
            minutes,
            seconds,
            formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        };
    };

    // Context value with single accent color
    const value = {
        transactions,
        isDarkMode,
        debtPaid,
        saved,
        invested,
        spent,
        addTransaction,
        processTransaction,
        resetAll,
        toggleDarkMode,
        calculateRemainingTime,
        // Always use dark accent color regardless of theme
        accentColor: '#5E4DB2'
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
}

// Custom hook to use the context
export function useAppState() {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
}