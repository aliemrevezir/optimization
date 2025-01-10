

class ErrorLogger {
    constructor() {
        this.messages = [];
        this.currentIndex = 0;
        this.isNavigationEnabled = false;
        this.filter = 'ALL'; // 'ALL', 'ERROR', 'SUCCESS', 'INFO'
        
        // Color schemes for different message types
        this.colors = {
            ERROR: '\x1b[31m', // Red
            SUCCESS: '\x1b[32m', // Green
            INFO: '\x1b[36m', // Cyan
            WARNING: '\x1b[33m', // Yellow
            reset: '\x1b[0m'
        };
    }

    // Add new message
    logError(message, type = 'ERROR', location = '') {
        const timestamp = new Date().toISOString();
        this.messages.push({
            timestamp,
            type,
            message,
            location,
            id: this.messages.length + 1
        });
        this.displayMessage(this.messages[this.messages.length - 1]);
    }

    // Get filtered messages
    getFilteredMessages() {
        if (this.filter === 'ALL') return this.messages;
        return this.messages.filter(msg => msg.type === this.filter);
    }

    // Display a single message with formatting
    displayMessage(message) {
        // Don't clear console when navigation is disabled
        if (this.isNavigationEnabled) {
            console.clear();
        }
        
        // Header
        console.log('\x1b[36m%s\x1b[0m', '='.repeat(80));
        console.log('\x1b[36m%s\x1b[0m', '                              MESSAGE LOGGER SCREEN');
        console.log('\x1b[36m%s\x1b[0m', '='.repeat(80));
        console.log();

        // Message count and filter status
        const filteredMessages = this.getFilteredMessages();
        console.log('\x1b[33m%s\x1b[0m', `Total Messages: ${this.messages.length}`);
        console.log('\x1b[33m%s\x1b[0m', `Current Filter: ${this.filter}`);
        console.log('\x1b[33m%s\x1b[0m', `Filtered Messages: ${filteredMessages.length}`);
        console.log();

        // Message details with type-specific coloring
        const color = this.colors[message.type] || this.colors.reset;
        console.log(`${color}${message.type} DETAILS${this.colors.reset}`);
        console.log('\x1b[37m%s\x1b[0m', '-'.repeat(80));
        console.log('\x1b[37m%s\x1b[0m', `Timestamp: ${message.timestamp}`);
        console.log(`${color}Type:      ${message.type}${this.colors.reset}`);
        console.log('\x1b[37m%s\x1b[0m', `Location:  ${message.location}`);
        console.log(`${color}Message:   ${message.message}${this.colors.reset}`);
        console.log('\x1b[37m%s\x1b[0m', '-'.repeat(80));
        console.log();

        // Only show navigation instructions if navigation is enabled
        if (this.isNavigationEnabled) {
            console.log('\x1b[32m%s\x1b[0m', 'Navigation:');
            console.log('\x1b[32m%s\x1b[0m', '- Press N: Next message');
            console.log('\x1b[32m%s\x1b[0m', '- Press P: Previous message');
            console.log('\x1b[32m%s\x1b[0m', '- Press F: Change filter (ALL → ERROR → SUCCESS → INFO)');
            console.log('\x1b[32m%s\x1b[0m', '- Press Q: Quit');
        }
    }

    // Navigate through messages
    showNext() {
        const filteredMessages = this.getFilteredMessages();
        const currentFilteredIndex = filteredMessages.findIndex(m => m.id === this.messages[this.currentIndex].id);
        if (currentFilteredIndex < filteredMessages.length - 1) {
            const nextMessage = filteredMessages[currentFilteredIndex + 1];
            this.currentIndex = this.messages.findIndex(m => m.id === nextMessage.id);
            this.displayMessage(this.messages[this.currentIndex]);
        }
    }

    showPrevious() {
        const filteredMessages = this.getFilteredMessages();
        const currentFilteredIndex = filteredMessages.findIndex(m => m.id === this.messages[this.currentIndex].id);
        if (currentFilteredIndex > 0) {
            const prevMessage = filteredMessages[currentFilteredIndex - 1];
            this.currentIndex = this.messages.findIndex(m => m.id === prevMessage.id);
            this.displayMessage(this.messages[this.currentIndex]);
        }
    }

    // Change the current filter
    cycleFilter() {
        const filters = ['ALL', 'ERROR', 'SUCCESS', 'INFO'];
        const currentIndex = filters.indexOf(this.filter);
        this.filter = filters[(currentIndex + 1) % filters.length];
        const filteredMessages = this.getFilteredMessages();
        if (filteredMessages.length > 0) {
            this.currentIndex = this.messages.findIndex(m => m.id === filteredMessages[0].id);
            this.displayMessage(this.messages[this.currentIndex]);
        }
    }

    // Handle keyboard input
    startNavigation() {
        try {
            // Check if we're in a TTY environment
            if (process.stdin.isTTY) {
                const readline = require('readline');
                readline.emitKeypressEvents(process.stdin);
                process.stdin.setRawMode(true);
                this.isNavigationEnabled = true;

                process.stdin.on('keypress', (str, key) => {
                    if (key.name === 'q') {
                        process.exit();
                    } 
                    else if (key.name === 'n') {
                        this.showNext();
                    } else if (key.name === 'p') {
                        this.showPrevious();
                    } else if (key.name === 'f') {
                        this.cycleFilter();
                    }
                });
            } else {
                // If not in TTY, just log normally
                this.isNavigationEnabled = false;
                console.log('\x1b[33m%s\x1b[0m', 'Navigation disabled: Not running in an interactive terminal');
            }
        } catch (error) {
            // If there's any error setting up navigation, fall back to normal logging
            this.isNavigationEnabled = false;
            console.log('\x1b[33m%s\x1b[0m', 'Navigation disabled: Error setting up interactive mode');
        }
    }
}

// Export the logger
module.exports = new ErrorLogger(); 