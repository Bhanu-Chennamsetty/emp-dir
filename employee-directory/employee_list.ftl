<#-- employee_list.ftl -->
<#-- This file cannot be run directly in the browser. -->
<#if employees?has_content>
    <#list employees as employee>
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
    </#list>
<#else>
    <div class="text-center text-gray-500 text-lg mt-8">
        No employees found.
    </div>
</#if>