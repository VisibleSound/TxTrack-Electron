import React, { useEffect } from 'react';
import DarkLogo from '../../assets/DarkLogo.svg';
import './SplashScreen.css';

const SplashScreen = ({ onFinishLoading }) => {
    useEffect(() => {
        // This simulates your app loading
        // Replace with actual loading logic if needed
        const timer = setTimeout(() => {
            onFinishLoading();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinishLoading]);

    return (
        <div className="splash-screen">
            <div className="splash-content">
                <img
                    src={DarkLogo}
                    alt="TxTrack Logo"
                    className="splash-logo"
                />
                <div className="loader">
                    <div className="loader-circle"></div>
                    <div className="loader-circle"></div>
                    <div className="loader-circle"></div>
                </div>
                <div className="app-name">TxTrack</div>
            </div>
        </div>
    );
};

export default SplashScreen;