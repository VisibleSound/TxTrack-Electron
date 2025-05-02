import React from 'react';
import { useAppState } from '../../contexts/AppStateContext';

// Reusable button component with consistent styling across the app
const Button = ({
    children,
    onClick,
    fullWidth = false,
    variant = 'primary',
    disabled = false
}) => {
    const { accentColor } = useAppState();

    // Base classes for all buttons
    let className = `font-bold py-3 px-4 rounded transition-all duration-200 focus:outline-none`;

    // Add the hover opacity effect to all buttons
    className += ` hover:opacity-80`;

    // Add full width if specified
    if (fullWidth) {
        className += ` w-full`;
    }

    // Create style object for direct styling
    let style = {};

    // Apply different styles based on variant
    if (variant === 'primary') {
        style = {
            backgroundColor: accentColor,
            color: 'white'
        };
    } else if (variant === 'secondary') {
        style = {
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: accentColor,
            color: accentColor
        };
    } else if (variant === 'danger') {
        className += ` bg-red-600 text-white`;
    } else if (variant === 'text') {
        className += ` text-gray-700`;
    }

    // Add disabled styling
    if (disabled) {
        className += ` opacity-50 cursor-not-allowed`;
    }

    return (
        <button
            className={className}
            style={style}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;