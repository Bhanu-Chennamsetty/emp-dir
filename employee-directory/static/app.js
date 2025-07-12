import{employees} from './data.js'; 
let currentEditId = null; //To keep track of the employee being edited
//DOM Elements
const employeeList = document.getElementById('employee-list');
const noEmployeesMessage = document.getElementById('no-employees-message');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const showSelect = document.getElementById('show-select');
const filterButton = document.getElementById('filter-button');
const addEmployeeButton = document.getElementById('add-employee-button');
const employeeModal = document.getElementById('employee-modal');
const modalTitle = document.getElementById('modal-title');
const employeeForm = document.getElementById('employee-form');
const employeeIdInput = document.getElementById('employee-id');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const roleInput = document.getElementById('role');
const cancelEmployeeButton = document.getElementById('cancel-employee-button');
const filterSidebar = document.getElementById('filter-sidebar');
const closeFilterSidebarButton = document.getElementById('close-filter-sidebar');
const filterFirstNameInput = document.getElementById('filter-firstName');
const filterDepartmentSelect = document.getElementById('filter-department');
const filterRoleSelect = document.getElementById('filter-role');
const applyFilterButton = document.getElementById('apply-filter-button');
const resetFilterButton = document.getElementById('reset-filter-button');
const messageBox = document.getElementById('message-box');
const messageBoxText = document.getElementById('message-box-text');
const messageBoxConfirm = document.getElementById('message-box-confirm');
const messageBoxCancel = document.getElementById('message-box-cancel');
const messageBoxOk = document.getElementById('message-box-ok');
// --- Utility Functions ---

/*** Displays a custom message box.
         * @param {string} message - The message to display.
         * @param {string} type - 'alert' or 'confirm'.
         * @returns {Promise<boolean>} - Resolves to true for 'OK'/'Confirm', false for 'Cancel'.
         */
function showMessageBox(message, type = 'alert'){
    return new Promise((resolve) => {
        messageBoxText.textContent = message;
        messageBoxConfirm.classList.add('hidden');
        messageBoxCancel.classList.add('hidden');
        messageBoxOk.classList.add('hidden');
        if (type === 'confirm') {
            messageBoxConfirm.classList.remove('hidden');
            messageBoxCancel.classList.remove('hidden');
            messageBoxConfirm.onclick = () => {
            messageBox.classList.add('hidden');
            resolve(true);
        };
        messageBoxCancel.onclick = () => {
        messageBox.classList.add('hidden');
        resolve(false);
        };
    } 
        else{ //type==='alert'
            messageBoxOk.classList.remove('hidden');
            messageBoxOk.onclick = () => {
            messageBox.classList.add('hidden');
            resolve(true);
        };
    }
            messageBox.classList.remove('hidden');
            });
        }

        /**
         * Validates the employee form fields.
         * @returns {boolean} - True if form is valid, false otherwise.
         */
        function validateForm() {
            let isValid = true;

            // Reset error messages
            document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));

            if(!firstNameInput.value.trim()){
                document.getElementById('firstName-error').classList.remove('hidden');
                isValid = false;
            }
            if(!lastNameInput.value.trim()){
                document.getElementById('lastName-error').classList.remove('hidden');
                isValid = false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())){
                document.getElementById('email-error').classList.remove('hidden');
                isValid = false;
            }
            if(!departmentInput.value){
                document.getElementById('department-error').classList.remove('hidden');
                isValid = false;
            }
            if(!roleInput.value){
                document.getElementById('role-error').classList.remove('hidden');
                isValid = false;
            }
            return isValid;
        }

        /**
         * Clears the employee form and resets error messages.
         */
        function clearForm(){
            employeeForm.reset();
            employeeIdInput.value = '';
            currentEditId = null;
            document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));
        }

        /**
         * Closes the employee modal.
         */
        function closeEmployeeModal(){
            employeeModal.classList.add('hidden');
            clearForm();
        }

        /**
         * Opens the employee modal for adding or editing.
         * @param {object|null} employee - The employee object to edit, or null for adding.
         */
        function openEmployeeModal(employee = null){
            if (employee){
                modalTitle.textContent = 'Edit Employee';
                employeeIdInput.value = employee.id;
                firstNameInput.value = employee.firstName;
                lastNameInput.value = employee.lastName;
                emailInput.value = employee.email;
                departmentInput.value = employee.department;
                roleInput.value = employee.role;
                currentEditId = employee.id;
            } else{
                modalTitle.textContent = 'Add Employee';
                clearForm();
            }
            employeeModal.classList.remove('hidden');
        }

        /**
         * Toggles the filter sidebar's visibility.
         */
        function toggleFilterSidebar(){
            filterSidebar.classList.toggle('open');
        }

        // --- Employee Management Functions ---

        /**
         * Renders the list of employees based on current filters and sort order.
         */
        function renderEmployees() {
            employeeList.innerHTML = ''; // Clear existing list

            let filteredEmployees = [...employees]; // Create a shallow copy to avoid modifying original

            // Apply search filter
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm) {
                filteredEmployees = filteredEmployees.filter(emp =>
                    emp.firstName.toLowerCase().includes(searchTerm) ||
                    emp.lastName.toLowerCase().includes(searchTerm) ||
                    emp.email.toLowerCase().includes(searchTerm)
                );
            }

            //Apply sidebar filters
            const filterFirstName = filterFirstNameInput.value.toLowerCase().trim();
            const filterDepartment = filterDepartmentSelect.value;
            const filterRole = filterRoleSelect.value;

            if(filterFirstName){
                filteredEmployees = filteredEmployees.filter(emp =>
                    emp.firstName.toLowerCase().includes(filterFirstName)
                );
            }
            if(filterDepartment){
                filteredEmployees = filteredEmployees.filter(emp =>
                    emp.department === filterDepartment
                );
            }
            if(filterRole){
                filteredEmployees = filteredEmployees.filter(emp =>
                    emp.role === filterRole
                );
            }

            // Apply sorting
            const sortBy = sortSelect.value;
            if (sortBy) {
                filteredEmployees.sort((a, b) => {
                    const valA = a[sortBy].toLowerCase();
                    const valB = b[sortBy].toLowerCase();
                    if (valA < valB) return -1;
                    if (valA > valB) return 1;
                    return 0;
                });
            }

            // Handle "Show" (pagination simulation - currently just limits display)
            const showCount = parseInt(showSelect.value, 10);
            const displayedEmployees = filteredEmployees.slice(0, showCount);


            if (displayedEmployees.length === 0) {
                noEmployeesMessage.classList.remove('hidden');
            } else {
                noEmployeesMessage.classList.add('hidden');
                displayedEmployees.forEach(employee => {
                    const employeeCard = `
                        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 class="text-xl font-semibold text-gray-900">${employee.firstName} ${employee.lastName}</h3>
                            <p class="text-gray-600">Email: ${employee.email}</p>
                            <p class="text-gray-600">Department: ${employee.department}</p>
                            <p class="text-gray-600">Role: ${employee.role}</p>
                            <div class="mt-4 flex space-x-3">
                                <button data-id="${employee.id}" class="edit-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition duration-200 ease-in-out">
                                    Edit
                                </button>
                                <button data-id="${employee.id}" class="delete-button bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition duration-200 ease-in-out">
                                    Delete
                                </button>
                            </div>
                        </div>
                    `;
                    employeeList.insertAdjacentHTML('beforeend', employeeCard);
                });

                // Attach event listeners to newly created buttons
                document.querySelectorAll('.edit-button').forEach(button => {
                    button.onclick = (event) => {
                        const id = parseInt(event.target.dataset.id);
                        const employeeToEdit = employees.find(emp => emp.id === id);
                        if (employeeToEdit) {
                            openEmployeeModal(employeeToEdit);
                        }
                    };
                });

                document.querySelectorAll('.delete-button').forEach(button => {
                    button.onclick = async (event) => {
                        const id = parseInt(event.target.dataset.id);
                        const confirmed = await showMessageBox('Are you sure you want to delete this employee?', 'confirm');
                        if (confirmed) {
                            deleteEmployee(id);
                        }
                    };
                });
            }
        }

        /**
         *Adds a new employee to the list.
         * @param {object} newEmployee - The new employee object.
         */
        function addEmployee(newEmployee) {
            newEmployee.id = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
            employees.push(newEmployee);
            renderEmployees();
            showMessageBox('Employee added successfully!', 'alert');
            closeEmployeeModal();
        }

        /**
         * Updates an existing employee.
         * @param {object} updatedEmployee - The updated employee object.
         */
        function updateEmployee(updatedEmployee) {
            const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
            if (index !== -1) {
                employees[index] = updatedEmployee;
                renderEmployees();
                showMessageBox('Employee updated successfully!', 'alert');
                closeEmployeeModal();
            } else {
                showMessageBox('Error: Employee not found for update.', 'alert');
            }
        }

        /**
         * Deletes an employee from the list.
         * @param {number} id - The ID of the employee to delete.
         */
        function deleteEmployee(id) {
            const initialLength = employees.length;
            employees = employees.filter(emp => emp.id !== id);
            if (employees.length < initialLength) {
                renderEmployees();
                showMessageBox('Employee deleted successfully!', 'alert');
            } else {
                showMessageBox('Error: Employee not found for deletion.', 'alert');
            }
        }

        //--- Event Listeners ---

        //Search input
        searchInput.addEventListener('input', renderEmployees);

        //Sort select
        sortSelect.addEventListener('change', renderEmployees);

        //Show select (pagination simulation)
        showSelect.addEventListener('change', renderEmployees);

        //Filter button (opens sidebar)
        filterButton.addEventListener('click', toggleFilterSidebar);

        //Close filter sidebar button
        closeFilterSidebarButton.addEventListener('click', toggleFilterSidebar);

        //Apply filter button
        applyFilterButton.addEventListener('click', () => {
            renderEmployees();
            toggleFilterSidebar(); // Close sidebar after applying
        });

        //Reset filter button
        resetFilterButton.addEventListener('click', () => {
            filterFirstNameInput.value = '';
            filterDepartmentSelect.value = '';
            filterRoleSelect.value = '';
            renderEmployees();
            //Do not close sidebar automatically on reset, let user decide
        });

        //Add Employee button (opens modal)
        addEmployeeButton.addEventListener('click', () => openEmployeeModal());

        //Cancel Employee button (closes modal)
        cancelEmployeeButton.addEventListener('click', () => {
            if (currentEditId !== null) { // If editing, confirm before discarding changes
                showMessageBox('Are you sure you want to discard changes?', 'confirm').then(confirmed => {
                    if (confirmed) {
                        closeEmployeeModal();
                    }
                });
            } else { //If adding, just close
                closeEmployeeModal();
            }
        });

        //Employee form submission
        employeeForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            if (!validateForm()) {
                showMessageBox('Please correct the errors in the form.', 'alert');
                return;
            }

            const employeeData = {
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                email: emailInput.value.trim(),
                department: departmentInput.value,
                role: roleInput.value
            };

            if (currentEditId) {
                employeeData.id = parseInt(employeeIdInput.value);
                updateEmployee(employeeData);
            } else {
                addEmployee(employeeData);
            }
        });

        //Initial render on page load
        document.addEventListener('DOMContentLoaded', renderEmployees);

