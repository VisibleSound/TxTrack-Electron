import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAppState } from '../contexts/AppStateContext';
import Button from '../components/common/Button';
import CounterDisplay from '../components/common/CounterDisplay';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { isDarkMode, debtPaid, saved, invested, spent } = useAppState();
    const navigate = useNavigate();
    const [chartData, setChartData] = useState(null);

    // Animation state for main content
    const [animateContent, setAnimateContent] = useState(false);

    // Prepare chart data whenever relevant state changes
    useEffect(() => {
        const data = {
            labels: ['Debt Paid', 'Saved', 'Invested', 'Spent'],
            datasets: [
                {
                    label: 'Amount ($)',
                    data: [debtPaid, saved, invested, spent],
                    backgroundColor: isDarkMode
                        ? ['rgba(94, 77, 178, 0.7)', 'rgba(94, 77, 178, 0.7)', 'rgba(94, 77, 178, 0.7)', 'rgba(94, 77, 178, 0.7)']
                        : ['rgba(29, 122, 252, 0.7)', 'rgba(29, 122, 252, 0.7)', 'rgba(29, 122, 252, 0.7)', 'rgba(29, 122, 252, 0.7)'],
                    borderColor: isDarkMode
                        ? ['rgba(94, 77, 178, 1)', 'rgba(94, 77, 178, 1)', 'rgba(94, 77, 178, 1)', 'rgba(94, 77, 178, 1)']
                        : ['rgba(29, 122, 252, 1)', 'rgba(29, 122, 252, 1)', 'rgba(29, 122, 252, 1)', 'rgba(29, 122, 252, 1)'],
                    borderWidth: 1,
                },
            ],
        };

        setChartData(data);
    }, [debtPaid, saved, invested, spent, isDarkMode]);

    // Animate content on mount - changed from 100ms to 50ms for faster animation
    useEffect(() => {
        // Smaller delay before animation starts
        const timer = setTimeout(() => {
            setAnimateContent(true);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Financial Overview',
                color: isDarkMode ? 'white' : 'black',
                font: {
                    size: function (context) {
                        const width = context.chart.width;
                        return width < 400 ? 16 : 18;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                    font: {
                        size: function (context) {
                            const width = context.chart.width;
                            return width < 400 ? 10 : 12;
                        }
                    }
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }
            },
            x: {
                ticks: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                    font: {
                        size: function (context) {
                            const width = context.chart.width;
                            return width < 400 ? 10 : 12;
                        }
                    }
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }
            }
        },
    };

    const handleLogTransaction = () => {
        navigate('/log-transaction');
    };

    return (
        <div className="h-full">
            <div
                className={`transition-opacity duration-300 ease-in-out ${animateContent ? 'opacity-100' : 'opacity-0'}`}
            >
                {/* Logo/App Name - Centered */}
                <div className="text-center mb-6">
                    <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Dashboard
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side - Quick Action Button and Counters */}
                    <div className="w-full md:w-1/3">
                        {/* Quick Action Button */}
                        <div className="mb-6">
                            <Button onClick={handleLogTransaction} variant="primary" fullWidth>
                                Log New Transaction
                            </Button>
                        </div>

                        {/* Financial Counters - Now in a column on left side */}
                        <h3 className={`text-base md:text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Financial Summary
                        </h3>
                        <div className="flex flex-col space-y-3 mb-6">
                            <CounterDisplay title="Debt Paid" amount={debtPaid} />
                            <CounterDisplay title="Saved" amount={saved} />
                            <CounterDisplay title="Invested" amount={invested} />
                            <CounterDisplay title="Spent" amount={spent} />
                        </div>
                    </div>

                    {/* Right side - Chart */}
                    <div className="w-full md:w-2/3">
                        {/* Chart with fixed height using dark-container class */}
                        {chartData && (
                            <div className={`p-2 md:p-4 rounded-lg h-60 md:h-80 ${isDarkMode ? 'dark-container' : 'light-container'}`}>
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;