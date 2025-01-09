document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchSets');
    const setsContainer = document.getElementById('setsContainer');
    const createSetForm = document.getElementById('createSetForm');

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
                        <h3><i class="fas fa-layer-group"></i> ${set.set_name}</h3>
                        <div class="set-details">
                            <p><i class="fas fa-fingerprint"></i> <strong>ID:</strong> ${set.id}</p>
                            <p><i class="fas fa-align-left"></i> <strong>Description:</strong> ${set.description || 'No description'}</p>
                            <p><i class="fas fa-ruler"></i> <strong>Length:</strong> ${set.length}</p>
                            <p><i class="fas fa-list"></i> <strong>Items:</strong> ${Array.isArray(set.items) ? set.items.join(', ') : set.items}</p>
                        </div>
                    `;
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