document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchObjectiveFunctions');
    const objectiveFunctionsContainer = document.getElementById('objectiveFunctionsContainer');
    const createObjectiveFunctionForm = document.getElementById('createObjectiveFunctionForm');

    // Function to delete an objective function
    async function deleteObjectiveFunction(id, name) {
        try {
            const confirmed = await showConfirmDialog(
                'Delete Objective Function',
                `Are you sure you want to delete "${name}"? This action cannot be undone.`
            );

            if (!confirmed) return;

            const response = await fetch(`http://localhost:3000/api/objective_functions/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                showNotification('Objective function deleted successfully!', 'success');
                await fetchAndDisplayObjectiveFunctions();
            } else {
                throw new Error(result.error || 'Failed to delete objective function');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Error deleting objective function: ${error.message}`, 'error');
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
    function showEditModal(objectiveFunction) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Edit Objective Function</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <form id="editObjectiveFunctionForm">
                    <div class="form-group">
                        <label for="edit_name"><i class="fas fa-tag"></i> Function Name:</label>
                        <input type="text" id="edit_name" name="name" value="${objectiveFunction.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_description"><i class="fas fa-align-left"></i> Description:</label>
                        <textarea id="edit_description" name="description">${objectiveFunction.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit_parameters_needed"><i class="fas fa-cube"></i> Required Parameters:</label>
                        <input type="text" id="edit_parameters_needed" name="parameters_needed" 
                            value="${Array.isArray(objectiveFunction.parameters_needed) ? objectiveFunction.parameters_needed.join(', ') : ''}" required>
                        <small class="help-text">Separate parameters with commas</small>
                    </div>
                    <div class="form-group">
                        <label for="edit_decision_needed"><i class="fas fa-code-branch"></i> Required Decision Variables:</label>
                        <input type="text" id="edit_decision_needed" name="decision_needed" 
                            value="${Array.isArray(objectiveFunction.decision_needed) ? objectiveFunction.decision_needed.join(', ') : ''}" required>
                        <small class="help-text">Separate decision variables with commas</small>
                    </div>
                    <div class="form-group">
                        <label for="edit_format"><i class="fas fa-code"></i> Function Format:</label>
                        <textarea id="edit_format" name="format" required>${objectiveFunction.format || ''}</textarea>
                        <small class="help-text">Enter the mathematical format of the objective function</small>
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

        const form = modal.querySelector('#editObjectiveFunctionForm');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('[data-action="cancel"]');

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const icon = submitButton.querySelector('i');
            submitButton.disabled = true;
            icon.className = 'fas fa-spinner fa-spin';

            try {
                const formData = {
                    name: document.getElementById('edit_name').value.trim(),
                    description: document.getElementById('edit_description').value.trim(),
                    parameters_needed: document.getElementById('edit_parameters_needed').value.split(',').map(item => item.trim()).filter(item => item !== ''),
                    decision_needed: document.getElementById('edit_decision_needed').value.split(',').map(item => item.trim()).filter(item => item !== ''),
                    format: document.getElementById('edit_format').value.trim()
                };

                const response = await fetch(`http://localhost:3000/api/objective_functions/${objectiveFunction.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification('Objective function updated successfully!', 'success');
                    await fetchAndDisplayObjectiveFunctions();
                    closeModal();
                } else {
                    throw new Error(result.error || 'Failed to update objective function');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification(`Error updating objective function: ${error.message}`, 'error');
            } finally {
                submitButton.disabled = false;
                icon.className = 'fas fa-save';
            }
        });
    }

    // Function to fetch and display objective functions
    async function fetchAndDisplayObjectiveFunctions() {
        try {
            fetchButton.disabled = true;
            const icon = fetchButton.querySelector('i');
            icon.classList.add('fa-spin');

            const response = await fetch('http://localhost:3000/api/objective_functions');
            const result = await response.json();

            if (result.success) {
                objectiveFunctionsContainer.innerHTML = '';
                result.data.forEach(func => {
                    const functionElement = document.createElement('div');
                    functionElement.className = 'function-item';
                    functionElement.innerHTML = `
                        <div class="function-header">
                            <h3><i class="fas fa-function"></i> ${func.name}</h3>
                            <div class="function-actions">
                                <button class="btn-edit" title="Edit Function">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" title="Delete Function">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="function-details">
                            <p><i class="fas fa-fingerprint"></i> <strong>ID:</strong> ${func.id}</p>
                            <p><i class="fas fa-align-left"></i> <strong>Description:</strong> ${func.description || 'No description'}</p>
                            <p><i class="fas fa-cube"></i> <strong>Required Parameters:</strong> ${Array.isArray(func.parameters_needed) ? func.parameters_needed.join(', ') : func.parameters_needed}</p>
                            <p><i class="fas fa-code-branch"></i> <strong>Required Decision Variables:</strong> ${Array.isArray(func.decision_needed) ? func.decision_needed.join(', ') : func.decision_needed}</p>
                            <p><i class="fas fa-code"></i> <strong>Format:</strong> ${func.format}</p>
                        </div>
                    `;

                    const editButton = functionElement.querySelector('.btn-edit');
                    editButton.addEventListener('click', () => showEditModal(func));

                    const deleteButton = functionElement.querySelector('.btn-delete');
                    deleteButton.addEventListener('click', () => deleteObjectiveFunction(func.id, func.name));

                    objectiveFunctionsContainer.appendChild(functionElement);
                });
            } else {
                throw new Error(result.error || 'Failed to fetch objective functions');
            }
        } catch (error) {
            console.error('Error:', error);
            objectiveFunctionsContainer.innerHTML = `
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
    createObjectiveFunctionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = createObjectiveFunctionForm.querySelector('button[type="submit"]');
        const icon = submitButton.querySelector('i');
        submitButton.disabled = true;
        icon.className = 'fas fa-spinner fa-spin';

        try {
            const formData = {
                name: document.getElementById('name').value.trim(),
                description: document.getElementById('description').value.trim(),
                parameters_needed: document.getElementById('parameters_needed').value.split(',').map(item => item.trim()).filter(item => item !== ''),
                decision_needed: document.getElementById('decision_needed').value.split(',').map(item => item.trim()).filter(item => item !== ''),
                format: document.getElementById('format').value.trim()
            };

            const response = await fetch('http://localhost:3000/api/objective_functions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                createObjectiveFunctionForm.reset();
                await fetchAndDisplayObjectiveFunctions();
                showNotification('Objective function created successfully!', 'success');
            } else {
                throw new Error(result.error || 'Failed to create objective function');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Error creating objective function: ${error.message}`, 'error');
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

    // Fetch objective functions when clicking the fetch button
    fetchButton.addEventListener('click', fetchAndDisplayObjectiveFunctions);

    // Initial fetch
    fetchAndDisplayObjectiveFunctions();
}); 