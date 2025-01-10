document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const createForm = document.getElementById('createDecisionVariableForm');
    const container = document.getElementById('decisionVariablesContainer');
    const fetchButton = document.getElementById('fetchDecisionVariables');

    // Fetch and display decision variables
    async function fetchAndDisplayDecisionVariables() {
        try {
            fetchButton.disabled = true;
            const icon = fetchButton.querySelector('i');
            icon.classList.add('fa-spin');
            

            const response = await fetch('http://localhost:3000/api/decision_variables');
            const result = await response.json();

            if (result.success) {
                container.innerHTML = '';
                result.data.forEach(variable => {
                    const variableElement = document.createElement('div');
                    variableElement.className = 'decision-variable-item';
                    variableElement.innerHTML = `
                        <div class="decision-variable-header">
                            <div class="decision-variable-title">
                                <h3><i class="fas fa-cube"></i> ${variable.name}</h3>
                            </div>
                            <div class="decision-variable-actions">
                                <button class="btn-edit" title="Edit Decision Variable">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" title="Delete Decision Variable">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="decision-variable-details">
                            <p><i class="fas fa-align-left"></i> <strong>Description:</strong> ${variable.description || 'No description'}</p>
                            <p><i class="fas fa-project-diagram"></i> <strong>Relations:</strong> ${Array.isArray(variable.relations) ? variable.relations.join(', ') : variable.relations || 'None'}</p>
                            <p><i class="fas fa-hashtag"></i> <strong>Value:</strong> ${variable.value !== null ? variable.value : 'Not set'}</p>
                        </div>
                    `;

                    // Add edit event listener
                    const editButton = variableElement.querySelector('.btn-edit');
                    editButton.addEventListener('click', () => showEditModal(variable));

                    // Add delete event listener
                    const deleteButton = variableElement.querySelector('.btn-delete');
                    deleteButton.addEventListener('click', () => showDeleteConfirmation(variable));

                    container.appendChild(variableElement);
                });
            }
        } catch (error) {
            showNotification('Error fetching decision variables: ' + error.message, 'error');
        } finally {
            fetchButton.disabled = false;
            fetchButton.querySelector('i').classList.remove('fa-spin');
        }
    }

    // Create new decision variable
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = createForm.querySelector('button[type="submit"]');
        const icon = submitButton.querySelector('i');
        submitButton.disabled = true;
        icon.className = 'fas fa-spinner fa-spin';

        try {
            const formData = {
                name: document.getElementById('variable_name').value.trim(),
                description: document.getElementById('description').value.trim(),
                relations: document.getElementById('relations').value.split(',').map(item => item.trim()).filter(Boolean)
            };

            const response = await fetch('http://localhost:3000/api/decision_variables', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showNotification('Decision variable created successfully!', 'success');
                createForm.reset();
                await fetchAndDisplayDecisionVariables();
            } else {
                throw new Error(result.error || 'Failed to create decision variable');
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            submitButton.disabled = false;
            icon.className = 'fas fa-save';
        }
    });

    // Show edit modal
    function showEditModal(variable) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Edit Decision Variable</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <form id="editDecisionVariableForm">
                    <div class="form-group">
                        <label for="edit_name"><i class="fas fa-tag"></i> Variable Name:</label>
                        <input type="text" id="edit_name" name="name" value="${variable.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_relations"><i class="fas fa-project-diagram"></i> Relations:</label>
                        <input type="text" id="edit_relations" name="relations" value="${Array.isArray(variable.relations) ? variable.relations.join(', ') : variable.relations}" required>
                        <small class="help-text">Enter relation IDs separated by commas</small>
                    </div>
                    <div class="form-group">
                        <label for="edit_value"><i class="fas fa-hashtag"></i> Value:</label>
                        <input type="number" id="edit_value" name="value" value="${variable.value || ''}" step="any">
                    </div>
                    <div class="form-group">
                        <label for="edit_description"><i class="fas fa-align-left"></i> Description:</label>
                        <textarea id="edit_description" name="description">${variable.description || ''}</textarea>
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

        const form = modal.querySelector('#editDecisionVariableForm');
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
                    relations: document.getElementById('edit_relations').value.split(',').map(item => item.trim()).filter(Boolean),
                    value: document.getElementById('edit_value').value ? parseFloat(document.getElementById('edit_value').value) : null,
                    description: document.getElementById('edit_description').value.trim()
                };

                const response = await fetch(`http://localhost:3000/api/decision_variables/${variable.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification('Decision variable updated successfully!', 'success');
                    await fetchAndDisplayDecisionVariables();
                    closeModal();
                } else {
                    throw new Error(result.error || 'Failed to update decision variable');
                }
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                submitButton.disabled = false;
                icon.className = 'fas fa-save';
            }
        });
    }

    // Show delete confirmation
    function showDeleteConfirmation(variable) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content delete-confirmation">
                <div class="modal-header">
                    <h3><i class="fas fa-exclamation-triangle warning-icon"></i> Delete Decision Variable</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete the decision variable "${variable.name}"?</p>
                    <p class="warning-text">This action cannot be undone.</p>
                </div>
                <div class="modal-buttons">
                    <button class="btn btn-cancel" data-action="cancel">Cancel</button>
                    <button class="btn btn-delete-confirm" data-action="confirm">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('[data-action="cancel"]');
        const confirmBtn = modal.querySelector('[data-action="confirm"]');

        // Close modal function
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        // Close on X button click
        closeBtn.addEventListener('click', closeModal);
        
        // Close on cancel button click
        cancelBtn.addEventListener('click', closeModal);

        // Handle delete confirmation
        confirmBtn.addEventListener('click', async () => {
            confirmBtn.disabled = true;
            const icon = confirmBtn.querySelector('i');
            icon.className = 'fas fa-spinner fa-spin';

            try {
                const response = await fetch(`http://localhost:3000/api/decision_variables/${variable.id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification('Decision variable deleted successfully!', 'success');
                    await fetchAndDisplayDecisionVariables();
                    closeModal();
                } else {
                    throw new Error(result.error || 'Failed to delete decision variable');
                }
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                confirmBtn.disabled = false;
                icon.className = 'fas fa-trash';
            }
        });
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add click event for fetch button
    fetchButton.addEventListener('click', fetchAndDisplayDecisionVariables);

    // Initial fetch
    fetchAndDisplayDecisionVariables();
}); 