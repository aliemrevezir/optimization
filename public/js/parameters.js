document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchParameters');
    const parametersContainer = document.getElementById('parametersContainer');
    const createParameterForm = document.getElementById('createParameterForm');

    // Function to delete a parameter
    async function deleteParameter(id, parameterName) {
        try {
            const confirmed = await showConfirmDialog(
                'Delete Parameter',
                `Are you sure you want to delete "${parameterName}"? This action cannot be undone.`
            );

            if (!confirmed) return;

            const response = await fetch(`http://localhost:3000/api/parameters/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                showNotification('Parameter deleted successfully!', 'success');
                await fetchAndDisplayParameters();
            } else {
                throw new Error(result.error || 'Failed to delete parameter');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Error deleting parameter: ${error.message}`, 'error');
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
            setTimeout(() => dialog.classList.add('active'), 10);

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

    // Function to show edit modal
    function showEditModal(parameter) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Edit Parameter</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <form id="editParameterForm">
                    <div class="form-group">
                        <label for="edit_name"><i class="fas fa-tag"></i> Parameter Name:</label>
                        <input type="text" id="edit_name" name="name" value="${parameter.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_value"><i class="fas fa-hashtag"></i> Value:</label>
                        <input type="number" id="edit_value" name="value" value="${parameter.value || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_relations"><i class="fas fa-project-diagram"></i> Relations:</label>
                        <input type="text" id="edit_relations" name="relations" value="${parameter.relations ? parameter.relations.join(', ') : ''}" required>
                        <small class="help-text">Enter relation IDs separated by commas</small>
                    </div>
                    <div class="form-group">
                        <label for="edit_description"><i class="fas fa-align-left"></i> Description:</label>
                        <textarea id="edit_description" name="description">${parameter.description || ''}</textarea>
                    </div>
                    <div class="modal-buttons">
                        <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        const form = modal.querySelector('#editParameterForm');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('[data-action="cancel"]');

        // Close modal function
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        // Close on X button click
        closeBtn.addEventListener('click', closeModal);
        
        // Close on cancel button click
        cancelBtn.addEventListener('click', closeModal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const icon = submitButton.querySelector('i');
            submitButton.disabled = true;
            icon.className = 'fas fa-spinner fa-spin';

            try {
                const formData = {
                    name: document.getElementById('edit_name').value.trim(),
                    value: parseFloat(document.getElementById('edit_value').value),
                    relations: document.getElementById('edit_relations').value.split(',').map(item => item.trim()),
                    description: document.getElementById('edit_description').value.trim()
                };

                const response = await fetch(`http://localhost:3000/api/parameters/${parameter.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification('Parameter updated successfully!', 'success');
                    await fetchAndDisplayParameters();
                    closeModal();
                } else {
                    throw new Error(result.error || 'Failed to update parameter');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification(`Error updating parameter: ${error.message}`, 'error');
            } finally {
                submitButton.disabled = false;
                icon.className = 'fas fa-save';
            }
        });
    }

    // Function to fetch and display parameters
    async function fetchAndDisplayParameters() {
        try {
            fetchButton.disabled = true;
            const icon = fetchButton.querySelector('i');
            icon.classList.add('fa-spin');

            const response = await fetch('http://localhost:3000/api/parameters');
            const result = await response.json();

            if (result.success) {
                parametersContainer.innerHTML = '';
                result.data.forEach(parameter => {
                    const parameterElement = document.createElement('div');
                    parameterElement.className = 'parameter-item';
                    parameterElement.innerHTML = `
                        <div class="parameter-header">
                            <h3><i class="fas fa-sliders-h"></i> ${parameter.name}</h3>
                            <div class="parameter-actions">
                                <button class="btn-edit" title="Edit Parameter">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" title="Delete Parameter">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="parameter-details">
                            <p><i class="fas fa-hashtag"></i> <strong>Value:</strong> ${parameter.value || 'None'}</p>
                            <p><i class="fas fa-project-diagram"></i> <strong>Relations:</strong> ${parameter.relations ? parameter.relations.join(', ') : 'None'}</p>
                            <p><i class="fas fa-align-left"></i> <strong>Description:</strong> ${parameter.description || 'No description'}</p>
                        </div>
                    `;

                    // Add edit event listener
                    const editButton = parameterElement.querySelector('.btn-edit');
                    editButton.addEventListener('click', () => showEditModal(parameter));

                    // Add delete event listener
                    const deleteButton = parameterElement.querySelector('.btn-delete');
                    deleteButton.addEventListener('click', () => {
                        deleteParameter(parameter.id, parameter.name);
                    });

                    parametersContainer.appendChild(parameterElement);
                });
            } else {
                throw new Error(result.error || 'Failed to fetch parameters');
            }
        } catch (error) {
            console.error('Error:', error);
            parametersContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i> Error: ${error.message}
                </div>
            `;
        } finally {
            fetchButton.disabled = false;
            fetchButton.querySelector('i').className = 'fas fa-sync-alt';
        }
    }

    // Handle create form submission
    createParameterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = createParameterForm.querySelector('button[type="submit"]');
        const icon = submitButton.querySelector('i');
        submitButton.disabled = true;
        icon.className = 'fas fa-spinner fa-spin';

        try {
            const formData = {
                name: document.getElementById('parameter_name').value.trim(),
                value: parseFloat(document.getElementById('value').value),
                relations: document.getElementById('relations').value.split(',').map(item => item.trim()),
                description: document.getElementById('description').value.trim()
            };

            const response = await fetch('http://localhost:3000/api/parameters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                createParameterForm.reset();
                showNotification('Parameter created successfully!', 'success');
                await fetchAndDisplayParameters();
            } else {
                throw new Error(result.error || 'Failed to create parameter');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Error creating parameter: ${error.message}`, 'error');
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

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Add event listener for fetch button
    fetchButton.addEventListener('click', fetchAndDisplayParameters);

    // Initial fetch
    fetchAndDisplayParameters();
}); 