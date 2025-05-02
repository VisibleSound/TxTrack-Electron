import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppState } from '../contexts/AppStateContext';

// Create a MUI theme provider to work with the styled components
const MuiThemeProvider = ({ children }) => {
    const { isDarkMode } = useAppState();

    // Create theme based on current app mode
    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};

export default MuiThemeProvider;