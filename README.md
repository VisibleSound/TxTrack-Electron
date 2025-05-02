# TxTrack - Personal Finance Tracker

TxTrack is a cross-platform desktop application built with Electron and React that helps users track personal transactions and maintain financial awareness. This portfolio project demonstrates modern web technologies and best practices for building responsive, feature-rich desktop applications.

![TxTrack Screenshot](![TxTrack Dashboard](TxTrack-Electron/docs/images/txtrack-dashboard.png))

## Features

- **Transaction Tracking**: Log, approve, and categorize personal transactions
- **Financial Dashboard**: Visualize spending patterns with interactive charts
- **Adaptive UI**: Seamless dark/light mode switching
- **Offline Capability**: Works without internet connection
- **Cross-Platform**: Available for Windows, macOS, and Linux

## Installation

### Option 1: Download the Installer

1. Go to the [Releases](https://github.com/YOUR_USERNAME/TxTrack-Electron/releases) page
2. Download the installer for your operating system:
   - Windows: `.exe` installer
   - macOS: `.dmg` installer
   - Linux: `.deb` or `.rpm` package
3. Run the installer and follow the on-screen instructions

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/TxTrack-Electron.git

# Navigate to project directory
cd TxTrack-Electron

# Install dependencies
npm install

# Start the development server
npm run dev

# Create a production build
npm run electron:make
```

## Technical Skills Demonstrated

- **React Component Architecture**: Building reusable UI components with hooks and context
- **Electron Development**: Creating cross-platform desktop apps with web technologies
- **Modern JavaScript (ES6+)**: Leveraging the latest JavaScript features
- **State Management**: Using React Context API for global state
- **Responsive Design**: Building a UI that adapts to different screen sizes
- **CSS-in-JS & Tailwind**: Styling components with modern approaches
- **Chart.js Integration**: Visualizing data with interactive charts
- **GitHub CI/CD**: Automated builds and releases
- **Electron Auto-Updates**: Implementing seamless app updates

## Auto-Updates

TxTrack automatically checks for updates when launched and will notify you when a new version is available. Simply click "Restart" when prompted to install the latest version.

## Development

This project uses:
- Electron for cross-platform desktop functionality
- React for UI components and state management
- Vite as the build tool and dev server
- Tailwind CSS for styling
- Chart.js for data visualization
- Material UI components

## License

MIT License - See [LICENSE](LICENSE) file for details.