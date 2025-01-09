document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchSets');
    const setsContainer = document.getElementById('setsContainer');
    const createSetForm = document.getElementById('createSetForm');

    // Function to delete a set
    async function deleteSet(id, setName) {
        try {
            const confirmed = await showConfirmDialog(
                'Delete Set',
                `Are you sure you want to delete "${setName}"? This action cannot be undone.`
            );

            if (!confirmed) return;

            const response = await fetch(`http://localhost:3000/api/sets/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                showNotification('Set deleted successfully!', 'success');
                await fetchAndDisplaySets();
            } else {
                throw new Error(result.error || 'Failed to delete set');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Error deleting set: ${error.message}`, 'error');
        }
    }

    // Function to show confirmation dialog
    function showConfirmDialog(title, message) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            dialog.innerHTML = `
                <div class="confirm-dialog-content">
                    <h3><i class="fas fa-exclamation-triangle"></i> ${title}</h3>
                    <p>${message}</p>
                    <div class="confirm-dialog-buttons">
                        <button data-action="cancel">Cancel</button>
                        <button data-action="confirm">Delete</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            // Add fade-in effect
            setTimeout(() => dialog.classList.add('active'), 10);

            // Handle button clicks
            dialog.addEventListener('click', (e) => {
                if (e.target.matches('[data-action="confirm"]')) {
                    resolve(true);
                    dialog.classList.remove('active');
                    setTimeout(() => dialog.remove(), 300);
                } else if (e.target.matches('[data-action="cancel"]') || e.target === dialog) {
                    resolve(false);
                    dialog.classList.remove('active');
                    setTimeout(() => dialog.remove(), 300);
                }
            });
        });
    }

    // Function to fetch and display sets
    async function fetchAndDisplaySets() {
        try {
            fetchButton.disabled = true;
            const icon = fetchButton.querySelector('i');
            icon.classList.add('fa-spin');
            fetchButton.querySelector('i').className = 'fas fa-spinner fa-spin';

            const response = await fetch('http://localhost:3000/api/sets');
            const result = await response.json();

            if (result.success) {
                setsContainer.innerHTML = '';
                result.data.forEach(set => {
                    const setElement = document.createElement('div');
                    setElement.className = 'set-item';
                    setElement.innerHTML = `
                        <div class="set-header">
                            <h3><i class="fas fa-layer-group"></i> ${set.set_name}</h3>
                            <button class="btn-delete" title="Delete Set">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="set-details">
                            <p><i class="fas fa-fingerprint"></i> <strong>ID:</strong> ${set.id}</p>
                            <p><i class="fas fa-align-left"></i> <strong>Description:</strong> ${set.description || 'No description'}</p>
                            <p><i class="fas fa-ruler"></i> <strong>Length:</strong> ${set.length}</p>
                            <p><i class="fas fa-list"></i> <strong>Items:</strong> ${Array.isArray(set.items) ? set.items.join(', ') : set.items}</p>
                        </div>
                    `;

                    // Add delete event listener
                    const deleteButton = setElement.querySelector('.btn-delete');
                    deleteButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        deleteSet(set.id, set.set_name);
                    });

                    setsContainer.appendChild(setElement);
                });
            } else {
                throw new Error(result.error || 'Failed to fetch sets');
            }
        } catch (error) {
            console.error('Error:', error);
            setsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i> Error: ${error.message}
                </div>
            `;
        } finally {
            fetchButton.disabled = false;
            fetchButton.querySelector('i').className = 'fas fa-sync-alt';
        }
    }

    // Handle form submission
    createSetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = createSetForm.querySelector('button[type="submit"]');
        const icon = submitButton.querySelector('i');
        submitButton.disabled = true;
        icon.className = 'fas fa-spinner fa-spin';

        try {
            const formData = {
                set_name: document.getElementById('set_name').value,
                description: document.getElementById('description').value,
                items: document.getElementById('items').value.split(',').map(item => item.trim())
            };

            const response = await fetch('http://localhost:3000/api/sets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                createSetForm.reset();
                await fetchAndDisplaySets();
                showNotification('Set created successfully!', 'success');
            } else {
                throw new Error(result.error || 'Failed to create set');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Error creating set: ${error.message}`, 'error');
        } finally {
            submitButton.disabled = false;
            icon.className = 'fas fa-save';
        }
    });

    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Fetch sets when clicking the fetch button
    fetchButton.addEventListener('click', fetchAndDisplaySets);

    // Initial fetch
    fetchAndDisplaySets();
}); 