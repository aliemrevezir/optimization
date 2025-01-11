// Theme management
const themeManager = {
    // Get current theme from localStorage or default to 'light'
    getCurrentTheme: () => {
        return localStorage.getItem('theme') || 'light';
    },

    // Set theme and update icon
    setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fas fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
        }
    },

    // Toggle theme
    toggleTheme: () => {
        const currentTheme = themeManager.getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        themeManager.setTheme(newTheme);
    },

    // Initialize theme
    init: () => {
        // Apply saved theme on load
        const savedTheme = themeManager.getCurrentTheme();
        themeManager.setTheme(savedTheme);

        // Add click handler to existing theme toggle button
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.onclick = themeManager.toggleTheme;
        }
    }
};

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', themeManager.init); 