/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'accent': '#5E4DB2',  // Use a single accent color for both themes
                'background-dark': '#1D2125',
                'darker-container': '#121518',  // New darker color for containers
            }
        },
    },
    safelist: [
        'bg-accent',
        'text-accent',
        'border-accent',
        'hover:bg-accent',
        'hover:text-accent',
        'hover:border-accent',
        'bg-darker-container'
    ],
    plugins: [
        require('@tailwindcss/forms'),
    ],
};