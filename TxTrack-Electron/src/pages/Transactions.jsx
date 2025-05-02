import React, { useState, useEffect } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import TransactionRow from '../components/common/TransactionRow';
import CounterDisplay from '../components/common/CounterDisplay';
import ApprovalModal from '../modals/ApprovalModal';
import TransactionCategoryModal from '../modals/TransactionCategoryModal';

const Transactions = () => {
    const { transactions, isDarkMode, debtPaid, saved, invested, spent } = useAppState();
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    // Add animation state
    const [animateContent, setAnimateContent] = useState(false);

    // Filter transactions by pre-approved status
    const preApprovedTransactions = transactions.filter(t => t.isPreApproved);
    const needsApprovalTransactions = transactions.filter(t => !t.isPreApproved);

    // Handle transaction click
    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
    };

    // Close the modal and reset selected transaction
    const handleCloseModal = () => {
        setSelectedTransaction(null);
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
                <h2 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Transactions
                </h2>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side - Counters (Stacks on mobile, side-by-side on larger screens) */}
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className={`text-base md:text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Financial Summary
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                            <CounterDisplay title="Debt Paid" amount={debtPaid} />
                            <CounterDisplay title="Saved" amount={saved} />
                            <CounterDisplay title="Invested" amount={invested} />
                            <CounterDisplay title="Spent" amount={spent} />
                        </div>
                    </div>

                    {/* Right side - Transactions Lists */}
                    <div className="w-full md:w-2/3">
                        <div className="space-y-6 md:space-y-8">
                            {/* Pre-Approved Transactions */}
                            <div>
                                <h3 className={`text-lg md:text-xl font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Pre-Approved Transactions
                                </h3>

                                {preApprovedTransactions.length === 0 ? (
                                    <div className={`p-3 md:p-4 rounded-lg ${isDarkMode ? 'dark-container' : 'light-container'}`}>
                                        <p className={`text-center py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No pre-approved transactions
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 md:space-y-3">
                                        {preApprovedTransactions.map(transaction => (
                                            <TransactionRow
                                                key={transaction.id}
                                                transaction={transaction}
                                                onClick={() => {
                                                    if (transaction.isExpired) {
                                                        handleTransactionClick(transaction);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                            {/* Needs Approval Transactions */}
                            <div>
                                <h3 className={`text-lg md:text-xl font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Needs Approval
                                </h3>

                                {needsApprovalTransactions.length === 0 ? (
                                    <div className={`p-3 md:p-4 rounded-lg ${isDarkMode ? 'dark-container' : 'light-container'}`}>
                                        <p className={`text-center py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No transactions pending approval
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 md:space-y-3">
                                        {needsApprovalTransactions.map(transaction => (
                                            <TransactionRow
                                                key={transaction.id}
                                                transaction={transaction}
                                                onClick={() => handleTransactionClick(transaction)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Modals */}
            {selectedTransaction && (
                selectedTransaction.isPreApproved ? (
                    <TransactionCategoryModal
                        transaction={selectedTransaction}
                        onClose={handleCloseModal}
                    />
                ) : (
                    <ApprovalModal
                        transaction={selectedTransaction}
                        onClose={handleCloseModal}
                    />
                )
            )}
        </div>
    );
};

export default Transactions;