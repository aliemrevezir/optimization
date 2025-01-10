const { exec } = require('child_process');

// Get platform-specific command to open browser
const getCommand = () => {
    switch (process.platform) {
        case 'darwin': // macOS
            return 'open';
        case 'win32': // Windows
            return 'start';
        default: // Linux and others
            return 'xdg-open';
    }
};

// Wait for server to start, then open browser
setTimeout(() => {
    const command = getCommand();
    exec(`${command} http://localhost:3000`);
}, 2000); // Wait 2 seconds for server to start 