/**
 * Utility functions for managing local storage
 */

/**
 * Save data to localStorage with error handling
 * @param {string} key - The storage key
 * @param {any} value - The value to store (will be JSON stringified)
 * @returns {boolean} Success flag
 */
export const saveToStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        return true;
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
        return false;
    }
};

/**
 * Load data from localStorage with error handling
 * @param {string} key - The storage key
 * @param {any} defaultValue - The default value to return if key doesn't exist or error occurs
 * @returns {any} The parsed value or defaultValue
 */
export const loadFromStorage = (key, defaultValue = null) => {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return defaultValue;
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error(`Error loading from localStorage (${key}):`, error);
        return defaultValue;
    }
};

/**
 * Remove data from localStorage with error handling
 * @param {string} key - The storage key to remove
 * @returns {boolean} Success flag
 */
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
        return false;
    }
};

/**
 * Clear all app data from localStorage
 * @returns {boolean} Success flag
 */
export const clearAllAppData = () => {
    try {
        // List of all keys used by the app
        const appKeys = [
            'transactions',
            'isDarkMode',
            'debtPaid',
            'saved',
            'invested',
            'spent'
        ];

        // Remove each key
        appKeys.forEach(key => localStorage.removeItem(key));
        return true;
    } catch (error) {
        console.error('Error clearing app data:', error);
        return false;
    }
};

/**
 * Check if local storage is available
 * @returns {boolean} True if localStorage is available
 */
export const isStorageAvailable = () => {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};