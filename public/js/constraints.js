document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchConstraints');
    const constraintsContainer = document.getElementById('constraintsContainer');
    const createConstraintForm = document.getElementById('createConstraintForm');

    // Function to delete a constraint
    async function deleteConstraint(id, constraintName) {
        try {
            const confirmed = await showConfirmDialog(
                'Delete Constraint',
                `Are you sure you want to delete "${constraintName}"? This action cannot be undone.`
            );

            if (!confirmed) return;

            const response = await fetch(`http://localhost:3000/api/constraints/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                showNotification('Constraint deleted successfully!', 'success');
                await fetchAndDisplayConstraints();
            } else {
                throw new Error(result.error || 'Failed to delete constraint');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Error deleting constraint: ${error.message}`, 'error');
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
    function showEditModal(constraint) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Edit Constraint</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <form id="editConstraintForm">
                    <div class="form-group">
                        <label for="edit_name"><i class="fas fa-tag"></i> Constraint Name:</label>
                        <input type="text" id="edit_name" name="name" value="${constraint.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_sign"><i class="fas fa-code"></i> Sign:</label>
                        <select id="edit_sign" name="sign" required>
                            <option value="le" ${constraint.sign === 'le' ? 'selected' : ''}>Less than or equal to (≤)</option>
                            <option value="eq" ${constraint.sign === 'eq' ? 'selected' : ''}>Equal to (=)</option>
                            <option value="ge" ${constraint.sign === 'ge' ? 'selected' : ''}>Greater than or equal to (≥)</option>
                            <option value="lt" ${constraint.sign === 'lt' ? 'selected' : ''}>Less than (<)</option>
                            <option value="gt" ${constraint.sign === 'gt' ? 'selected' : ''}>Greater than (>)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_rhs"><i class="fas fa-equals"></i> RHS Value:</label>
                        <input type="number" id="edit_rhs" name="rhs" value="${constraint.rhs}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_parameters_needed"><i class="fas fa-cube"></i> Parameters Needed:</label>
                        <input type="text" id="edit_parameters_needed" name="parameters_needed" value="${Array.isArray(constraint.parameters_needed) ? constraint.parameters_needed.join(', ') : constraint.parameters_needed}" required>
                        <small class="help-text">Enter parameter IDs separated by commas</small>
                    </div>
                    <div class="form-group">
                        <label for="edit_decision_needed"><i class="fas fa-cube"></i> Decision Variables Needed:</label>
                        <input type="text" id="edit_decision_needed" name="decision_needed" value="${Array.isArray(constraint.decision_needed) ? constraint.decision_needed.join(', ') : constraint.decision_needed}" required>
                        <small class="help-text">Enter decision variable IDs separated by commas</small>
                    </div>
                    <div class="form-group">
                        <label for="edit_format"><i class="fas fa-code"></i> Format:</label>
                        <input type="text" id="edit_format" name="format" value="${constraint.format}" required>
                        <small class="help-text">Example: sum(j in J) X[i,j] <= Capacity[i]</small>
                    </div>
                    <div class="form-group">
                        <label for="edit_description"><i class="fas fa-align-left"></i> Description:</label>
                        <textarea id="edit_description" name="description">${constraint.description || ''}</textarea>
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

        const form = modal.querySelector('#editConstraintForm');
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
                    sign: document.getElementById('edit_sign').value,
                    rhs: parseFloat(document.getElementById('edit_rhs').value),
                    parameters_needed: document.getElementById('edit_parameters_needed').value.split(',').map(item => item.trim()).filter(Boolean),
                    decision_needed: document.getElementById('edit_decision_needed').value.split(',').map(item => item.trim()).filter(Boolean),
                    format: document.getElementById('edit_format').value.trim(),
                    description: document.getElementById('edit_description').value.trim()
                };

                const response = await fetch(`http://localhost:3000/api/constraints/${constraint.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification('Constraint updated successfully!', 'success');
                    await fetchAndDisplayConstraints();
                    closeModal();
                } else {
                    throw new Error(result.error || 'Failed to update constraint');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification(`Error updating constraint: ${error.message}`, 'error');
            } finally {
                submitButton.disabled = false;
                icon.className = 'fas fa-save';
            }
        });
    }

    // Function to get operator display text
    function getOperatorDisplay(sign) {
        const operators = {
            'le': '≤',
            'eq': '=',
            'ge': '≥',
            'lt': '<',
            'gt': '>'
        };
        return operators[sign] || sign;
    }

    // Function to get operator badge class
    function getOperatorBadgeClass(sign) {
        const classes = {
            'le': 'lte',
            'eq': 'eq',
            'ge': 'gte',
            'lt': 'lte',
            'gt': 'gte'
        };
        return classes[sign] || '';
    }

    // Function to fetch and display constraints
    async function fetchAndDisplayConstraints() {
        try {
            fetchButton.disabled = true;
            const icon = fetchButton.querySelector('i');
            icon.classList.add('fa-spin');

            const response = await fetch('http://localhost:3000/api/constraints');
            const result = await response.json();

            if (result.success) {
                constraintsContainer.innerHTML = '';
                result.data.forEach(constraint => {
                    // Convert format to array if it's a string
                    const formatArray = Array.isArray(constraint.format) ? constraint.format : [constraint.format];
                    // Convert parameters_needed to array if it's a string
                    const parametersArray = Array.isArray(constraint.parameters_needed) ? constraint.parameters_needed : [constraint.parameters_needed];
                    // Convert decision_needed to array if it's a string
                    const decisionArray = Array.isArray(constraint.decision_needed) ? constraint.decision_needed : [constraint.decision_needed];

                    const constraintElement = document.createElement('div');
                    constraintElement.className = 'constraint-item';
                    constraintElement.innerHTML = `
                        <div class="constraint-header">
                            <div class="constraint-title">
                                <h3><i class="fas fa-balance-scale"></i> ${constraint.name}</h3>
                                <span class="operator-badge ${getOperatorBadgeClass(constraint.sign)}">${getOperatorDisplay(constraint.sign)}</span>
                            </div>
                            <div class="constraint-actions">
                                <button class="btn-edit" title="Edit Constraint">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" title="Delete Constraint">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="constraint-details">
                            <p><i class="fas fa-equals"></i> <strong>RHS Value:</strong> ${constraint.rhs}</p>
                            <p><i class="fas fa-cube"></i> <strong>Parameters:</strong> ${parametersArray.join(', ') || 'None'}</p>
                            <p><i class="fas fa-cube"></i> <strong>Decision Variables:</strong> ${decisionArray.join(', ') || 'None'}</p>
                            <p><i class="fas fa-code"></i> <strong>Format:</strong> ${formatArray.join(', ') || 'None'}</p>
                            <p><i class="fas fa-align-left"></i> <strong>Description:</strong> ${constraint.description || 'No description'}</p>
                        </div>
                    `;

                    // Add edit event listener
                    const editButton = constraintElement.querySelector('.btn-edit');
                    editButton.addEventListener('click', () => showEditModal(constraint));

                    // Add delete event listener
                    const deleteButton = constraintElement.querySelector('.btn-delete');
                    deleteButton.addEventListener('click', () => {
                        deleteConstraint(constraint.id, constraint.name);
                    });

                    constraintsContainer.appendChild(constraintElement);
                });
            } else {
                throw new Error(result.error || 'Failed to fetch constraints');
            }
        } catch (error) {
            console.error('Error:', error);
            constraintsContainer.innerHTML = `
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
    createConstraintForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = createConstraintForm.querySelector('button[type="submit"]');
        const icon = submitButton.querySelector('i');
        submitButton.disabled = true;
        icon.className = 'fas fa-spinner fa-spin';

        try {
            const formData = {
                name: document.getElementById('constraint_name').value.trim(),
                sign: document.getElementById('operator').value,
                rhs: parseFloat(document.getElementById('rhs_value').value),
                parameters_needed: document.getElementById('parameters_needed').value.split(',').map(item => item.trim()),
                decision_needed: document.getElementById('decision_needed').value.split(',').map(item => item.trim()),
                format: document.getElementById('format').value.split(',').map(item => item.trim()),
                description: document.getElementById('description').value.trim()
            };

            const response = await fetch('http://localhost:3000/api/constraints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                createConstraintForm.reset();
                showNotification('Constraint created successfully!', 'success');
                await fetchAndDisplayConstraints();
            } else {
                throw new Error(result.error || 'Failed to create constraint');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Error creating constraint: ${error.message}`, 'error');
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
    fetchButton.addEventListener('click', fetchAndDisplayConstraints);

    // Initial fetch
    fetchAndDisplayConstraints();
}); 