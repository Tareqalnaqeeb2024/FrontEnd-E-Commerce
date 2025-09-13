    // Global variables
        const API_BASE_URL = 'https://localhost:7284/api';
        let authToken = null;
        let currentPage = {
            products: 1,
            orders: 1,
            users: 1
        };
        const itemsPerPage = 10;

        // DOM elements
        const loginPage = document.getElementById('login-page');
        const dashboard = document.getElementById('dashboard');
        const loginForm = document.getElementById('login-form');
        const logoutBtn = document.getElementById('logout-btn');
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        const pageContents = document.querySelectorAll('.page-content');

        // Charts
        let salesChart, categoriesChart;

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            // Check if token exists in localStorage
            const savedToken = localStorage.getItem('adminToken');
            if (savedToken) {
                authToken = savedToken;
                showDashboard();
                loadDashboardData();
            }

            // Set up event listeners
            // Order search
            document.getElementById('order-search-btn').addEventListener('click', searchOrders);
            document.getElementById('order-search-input').addEventListener('input', function() {
                searchOrders();
            });
            setupEventListeners();
        });

        // Set up event listeners
        function setupEventListeners() {
            // Login
            loginForm.addEventListener('submit', handleLogin);
            
            // Logout
            logoutBtn.addEventListener('click', handleLogout);
            
            // Navigation between pages
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    const targetPage = this.getAttribute('data-page');
                    showPage(targetPage);
                });
            });
            
            // Save product
            document.getElementById('save-product-btn').addEventListener('click', addProduct);
            // Product search
            document.getElementById('product-search-btn').addEventListener('click', searchProducts);
            document.getElementById('product-search-input').addEventListener('input', function() {
                searchProducts();
            });
            
            // Save user
            document.getElementById('save-user-btn').addEventListener('click', addUser);
            
            // Save category
            document.getElementById('save-category-btn').addEventListener('click', addCategory);
        }

        // Handle login
        async function handleLogin(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/Auth/Login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    authToken = data.token;
                    localStorage.setItem('adminToken', authToken);
                    showDashboard();
                    loadDashboardData();
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred during login. Please try again.');
            }
        }

        // Handle logout
        function handleLogout() {
            authToken = null;
            localStorage.removeItem('adminToken');
            showLogin();
        }

        // Show dashboard
        function showDashboard() {
            loginPage.style.display = 'none';
            dashboard.style.display = 'block';
            showPage('dashboard-page');
        }

        // Show login page
        function showLogin() {
            dashboard.style.display = 'none';
            loginPage.style.display = 'flex';
        }

        // Show specific page
        function showPage(pageId) {
            pageContents.forEach(page => {
                page.classList.remove('active-content');
            });
            document.getElementById(pageId).classList.add('active-content');
            
            // Load data when page is shown
            switch(pageId) {
                case 'products-page':
                    loadProducts();
                    loadCategoriesForDropdown();
                    break;
                case 'orders-page':
                    loadOrders();
                    break;
                case 'users-page':
                    loadUsers();
                    break;
                case 'categories-page':
                    loadCategories();
                    break;
            }
        }

        // Load dashboard data
        async function loadDashboardData() {
            try {
                // Load dashboard statistics
                const statsResponse = await fetch(`${API_BASE_URL}/UserAccount/DashboardStats`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (statsResponse.ok) {
                    const stats = await statsResponse.json();
                    updateDashboardStats(stats);
                }
                
                // Load data for charts
                loadChartsData();
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }

        // Update dashboard statistics
        function updateDashboardStats(stats) {
            document.getElementById('total-sales').textContent = `${stats.totalRevenue} SAR`;
            document.getElementById('total-orders').textContent = stats.totalOrders;
            document.getElementById('total-users').textContent = stats.totalUsers;
            document.getElementById('total-products').textContent = stats.totalProducts;
        }

        // Load charts data
        async function loadChartsData() {
            try {
                // Default chart data (should be replaced with real API data)
                const salesData = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [{
                        label: 'Monthly Sales',
                        data: [12000, 19000, 15000, 25000, 22000, 30000],
                        backgroundColor: 'rgba(78, 115, 223, 0.1)',
                        borderColor: 'rgba(78, 115, 223, 1)',
                        pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
                        tension: 0.3
                    }]
                };
                
                const categoriesData = {
                    labels: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Other'],
                    datasets: [{
                        data: [30, 25, 15, 10, 20],
                        backgroundColor: [
                            'rgba(78, 115, 223, 0.7)',
                            'rgba(28, 200, 138, 0.7)',
                            'rgba(246, 194, 62, 0.7)',
                            'rgba(231, 74, 59, 0.7)',
                            'rgba(54, 185, 204, 0.7)'
                        ],
                        hoverOffset: 4
                    }]
                };
                
                createCharts(salesData, categoriesData);
            } catch (error) {
                console.error('Error loading charts data:', error);
            }
        }

        // Create charts
        function createCharts(salesData, categoriesData) {
            const salesCtx = document.getElementById('salesChart').getContext('2d');
            salesChart = new Chart(salesCtx, {
                type: 'line',
                data: salesData,
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + ' SAR';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            
            const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
            categoriesChart = new Chart(categoriesCtx, {
                type: 'doughnut',
                data: categoriesData,
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Load products
        async function loadProducts(page = 1) {
            try {
                const response = await fetch(`${API_BASE_URL}/Product/paged?pageNumber=${page}&pageSize=${itemsPerPage}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    displayProducts(data.items);
                    setupPagination('products', data.totalCount, page);
                } else {
                    console.error('Failed to load products');
                }
            } catch (error) {
                console.error('Error loading products:', error);
            }
        }

        // Display products in table
        function displayProducts(products) {
            const productsList = document.getElementById('products-list');
            productsList.innerHTML = '';
            
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${product.imageUrl || 'https://via.placeholder.com/50'}" width="50" height="50" class="rounded"></td>
                    <td>${product.name}</td>
                    <td>${product.price} SAR</td>
                    <td>${product.categoryName || 'Not specified'}</td>
                    <td><span class="badge bg-success badge-status">Available</span></td>
                    <td>
                        <button class="btn btn-sm btn-info action-btn" data-id="${product.productId}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger action-btn" data-id="${product.productId}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
             
                productsList.appendChild(row);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('#products-list .btn-info').forEach(btn => {
                btn.addEventListener('click', () => editProduct(btn.getAttribute('data-id')));
            });
            
            document.querySelectorAll('#products-list .btn-danger').forEach(btn => {
                btn.addEventListener('click', () => deleteProduct(btn.getAttribute('data-id')));
            });
        }

        // Load categories for dropdown
        async function loadCategoriesForDropdown() {
            try {
                const response = await fetch(`${API_BASE_URL}/Category`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (response.ok) {
                    const categories = await response.json();
                    const categorySelect = document.getElementById('productCategory');
                    categorySelect.innerHTML = '<option value="">Select Category</option>';
                    
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.categoryId;
                        option.textContent = category.name;
                        categorySelect.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Error loading categories for dropdown:', error);
            }
        }

        // Add new product
        async function addProduct() {
            const formData = new FormData();
            formData.append('Name', document.getElementById('productName').value);
            formData.append('Price', document.getElementById('productPrice').value);
            const categoryId = document.getElementById('productCategory').value;
            if (!categoryId) {
                alert('Please select a category before adding the product');
                return;
            }
            formData.append('CategoryId', categoryId);
            formData.append('Description', document.getElementById('productDescription').value);
            formData.append('StockQuantity', document.getElementById('StockQuantity').value);

            const imageFile = document.getElementById('productImage').files[0];
            if (imageFile) {
                formData.append('ImageFile', imageFile);
            }

            try {
                const response = await fetch(`${API_BASE_URL}/Product`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: formData
                });

                if (response.ok) {
                    alert('Product added successfully');
                    bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
                    loadProducts();
                } else {
                    const errorText = await response.text();
                    alert('Failed to add product: ' + errorText);
                }
            } catch (error) {
                console.error('Error adding product:', error);
                alert('An error occurred while adding the product');
            }
        }

        // Load orders
        async function loadOrders(page = 1) {
            try {
                const response = await fetch(`${API_BASE_URL}/Order/paged?pageNumber=${page}&pageSize=${itemsPerPage}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                console.log(response)
                if (response.ok) {
                    const data = await response.json();
                    displayOrders(data.items);
                console.log(response)


                    setupPagination('orders', data.totalCount, page);
                    console.log(data)
                } else {
                    console.error('Failed to load orders');
                }
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        }

        // Display orders in table
        function displayOrders(orders) {
            const ordersList = document.getElementById('orders-list');
            ordersList.innerHTML = '';
            
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>#${order.orderId}</td>
                    <td>${order.userName || 'User'}</td>
                    <td>${new Date(order.orderDate).toLocaleDateString('en-US')}</td>
                    <td>${order.totalAmount} SAR</td>
                    <td><span class="badge bg-info badge-status">${order.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-danger action-btn" data-id="${order.orderId}" data-action="delete"><i class="fas fa-trash"></i></button>
                        <button class="btn btn-sm btn-warning action-btn" data-id="${order.orderId}" data-action="cancel"><i class="fas fa-ban"></i></button>
                    </td>
                `;
                ordersList.appendChild(row);
            });
            // Activate delete and cancel buttons
            document.querySelectorAll('#orders-list .btn-danger[data-action="delete"]').forEach(btn => {
                btn.addEventListener('click', () => deleteOrder(btn.getAttribute('data-id')));
            });
            document.querySelectorAll('#orders-list .btn-warning[data-action="cancel"]').forEach(btn => {
                btn.addEventListener('click', () => cancelOrder(btn.getAttribute('data-id')));
            });
        }

        // Load users
        async function loadUsers(page = 1) {
            try {
                const response = await fetch(`${API_BASE_URL}/UserAccount/paged?pageNumber=${page}&pageSize=${itemsPerPage}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    displayUsers(data.items);
                    setupPagination('users', data.totalCount, page);
                } else {
                    console.error('Failed to load users');
                }
            } catch (error) {
                console.error('Error loading users:', error);
            }
        }

        // Display users in table
        function displayUsers(users) {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.userName}</td>
                    <td>${user.email}</td>
                    <td>${user.roles && user.roles.includes('Admin') ? 'Admin' : 'User'}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString('en-US')}</td>
                    <td>
                        <button class="btn btn-sm btn-info action-btn" data-id="${user.userId}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger action-btn" data-id="${user.userId}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                usersList.appendChild(row);
            });
            // Activate edit and delete buttons
            document.querySelectorAll('#users-list .btn-info').forEach(btn => {
                btn.addEventListener('click', () => editUser(btn.getAttribute('data-id')));
            });
            document.querySelectorAll('#users-list .btn-danger').forEach(btn => {
                btn.addEventListener('click', () => deleteUser(btn.getAttribute('data-id')));
            });
        }

        // Add new user
        async function addUser() {
            const userData = {
                userName: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                password: document.getElementById('userPassword').value,
                 confirmPassword : document.getElementById('registerConfirmPassword').value,
                roles: document.getElementById('userRole').value,
                Phone : document.getElementById('phone').value,
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/UserAccount`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                         'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(userData)
                });
                
                console.log(response);
                try{
                if (response.ok) {
                    alert('User added successfully');
                    bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
                    loadUsers();
                }
             } catch(error)
             { 
                    alert('Failed to add user');
                
                 console.error('Error adding user:', error);
            }
            } catch (error) {
                console.error('Error adding user:', error);
                alert('An error occurred while adding the user');
            }
        }

        // Load categories
        async function loadCategories() {
            try {
                const response = await fetch(`${API_BASE_URL}/Category`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (response.ok) {
                    const categories = await response.json();
                    displayCategories(categories);
                } else {
                    console.error('Failed to load categories');
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        }

        // Display categories in table
        function displayCategories(categories) {
            const categoriesList = document.getElementById('categories-list');
            categoriesList.innerHTML = '';
            categories.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.name}</td>
                    <td>${category.productCount || 0}</td>
                    <td>
                        <button class="btn btn-sm btn-info action-btn" data-id="${category.categoryId}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger action-btn" data-id="${category.categoryId}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                categoriesList.appendChild(row);
            });
            // Activate edit and delete buttons
            document.querySelectorAll('#categories-list .btn-info').forEach(btn => {
                btn.addEventListener('click', () => editCategory(btn.getAttribute('data-id')));
            });
            document.querySelectorAll('#categories-list .btn-danger').forEach(btn => {
                btn.addEventListener('click', () => deleteCategory(btn.getAttribute('data-id')));
            });
        }

        // Add new category
        async function addCategory() {
            const categoryData = {
                name: document.getElementById('categoryName').value,
                description: document.getElementById('categoryDescription').value
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/Category`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(categoryData)
                });
                
                if (response.ok) {
                    alert('Category added successfully');
                    bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
                    loadCategories();
                } else {
                    alert('Failed to add category');
                }
            } catch (error) {
                console.error('Error adding category:', error);
                alert('An error occurred while adding the category');
            }
        }

        // Set up pagination for tables
        function setupPagination(type, totalCount, currentPage) {
            const totalPages = Math.ceil(totalCount / itemsPerPage);
            const paginationElement = document.getElementById(`${type}-pagination`);
            const paginationInfoElement = document.getElementById(`${type}-pagination-info`);
            
            // Update pagination info
            const startItem = (currentPage - 1) * itemsPerPage + 1;
            const endItem = Math.min(currentPage * itemsPerPage, totalCount);
            paginationInfoElement.textContent = `Showing ${startItem} to ${endItem} of ${totalCount} items`;
            
            // Create pagination buttons
            paginationElement.innerHTML = '';
            
            // Previous button
            if (currentPage > 1) {
                const prevLi = document.createElement('li');
                prevLi.className = 'page-item';
                prevLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>`;
                paginationElement.appendChild(prevLi);
            }
            
            // Page buttons
            for (let i = 1; i <= totalPages; i++) {
                const pageLi = document.createElement('li');
                pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
                pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
                paginationElement.appendChild(pageLi);
            }
            
            // Next button
            if (currentPage < totalPages) {
                const nextLi = document.createElement('li');
                nextLi.className = 'page-item';
                nextLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>`;
                paginationElement.appendChild(nextLi);
            }
            
            // Add event listeners to pagination buttons
            paginationElement.querySelectorAll('.page-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const page = parseInt(this.getAttribute('data-page'));
                    currentPage[type] = page;
                    
                    switch(type) {
                        case 'products':
                            loadProducts(page);
                            break;
                        case 'orders':
                            loadOrders(page);
                            break;
                        case 'users':
                            loadUsers(page);
                            break;
                    }
                });
            });
        }

        // Other helper functions (edit, delete)
        // Search orders
        async function searchOrders() {
            const key = document.getElementById('order-search-input').value.trim();
            if (!key) {
                loadOrders(); // If search is empty, show all orders
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/Order/SearchBy${encodeURIComponent(key)}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (response.ok) {
                    const orders = await response.json();
                    displayOrders(orders);
                    document.getElementById('orders-pagination').innerHTML = '';
                    document.getElementById('orders-pagination-info').textContent = `Search results: ${orders.length} orders`;
                } else {
                    alert('Failed to search orders');
                }
            } catch (error) {
                alert('An error occurred while searching orders');
            }
        }

        // Delete order
        async function deleteOrder(id) {
            if (confirm('Are you sure you want to delete this order?')) {
                try {
                    const response = await fetch(`${API_BASE_URL}/Order/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    if (response.ok) {
                        alert('Order deleted successfully');
                        loadOrders();
                    } else {
                        const errorText = await response.text();
                        alert('Failed to delete order: ' + errorText);
                    }
                } catch (error) {
                    alert('An error occurred while deleting the order');
                }
            }
        }

        // Cancel order
        async function cancelOrder(id) {
            if (confirm('Are you sure you want to cancel this order?')) {
                try {
                    const response = await fetch(`${API_BASE_URL}/Order/CancelOrder/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    if (response.ok) {
                        alert('Order cancelled successfully');
                        loadOrders();
                    } else {
                        const errorText = await response.text();
                        alert('Failed to cancel order: ' + errorText);
                    }
                } catch (error) {
                    alert('An error occurred while cancelling the order');
                }
            }
        }
        // Edit category
        async function editCategory(id) {
            try {
                const response = await fetch(`${API_BASE_URL}/Category/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (!response.ok) {
                    alert('Could not fetch category data');
                    return;
                }
                const category = await response.json();
                document.getElementById('categoryName').value = category.name;
                document.getElementById('categoryDescription').value = category.description || '';
                const modal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
                modal.show();
                const saveBtn = document.getElementById('save-category-btn');
                saveBtn.textContent = 'Update Category';
                const newSaveBtn = saveBtn.cloneNode(true);
                saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
                newSaveBtn.onclick = async function() {
                    const categoryData = {
                        name: document.getElementById('categoryName').value,
                        description: document.getElementById('categoryDescription').value
                    };
                    try {
                        const updateResponse = await fetch(`${API_BASE_URL}/Category/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authToken}`
                            },
                            body: JSON.stringify(categoryData)
                        });
                        if (updateResponse.ok) {
                            alert('Category updated successfully');
                            newSaveBtn.textContent = 'Save';
                            newSaveBtn.onclick = addCategory;
                            bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
                            loadCategories();
                        } else {
                            alert('Failed to update category');
                        }
                    } catch (error) {
                        alert('An error occurred while updating the category');
                    }
                };
            } catch (error) {
                alert('An error occurred while fetching category data');
            }
        }

        // Delete category
        async function deleteCategory(id) {
            if (confirm('Are you sure you want to delete this category?')) {
                try {
                    const response = await fetch(`${API_BASE_URL}/Category/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    if (response.ok) {
                        alert('Category deleted successfully');
                        loadCategories();
                    } else {
                        const errorText = await response.text();
                        alert('Failed to delete category: ' + errorText);
                    }
                } catch (error) {
                    alert('An error occurred while deleting the category');
                }
            }
        }
        // Edit user
        async function editUser(id) {
            try {
                const response = await fetch(`${API_BASE_URL}/UserAccount/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (!response.ok) {
                    alert('Could not fetch user data');
                    return;
                }
                const user = await response.json();
                document.getElementById('userName').value = user.userName;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userPassword').value = '';
                document.getElementById('userRole').value = user.roles && user.roles.includes('Admin') ? 'Admin' : 'User';
                const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
                modal.show();
                const saveBtn = document.getElementById('save-user-btn');
                saveBtn.textContent = 'Update User';
                const newSaveBtn = saveBtn.cloneNode(true);
                saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
                newSaveBtn.onclick = async function() {
                   const userData = {
                       UserName: document.getElementById('userName').value,
                       userId: id,
                       Email: document.getElementById('userEmail').value,
                       Phone: document.getElementById('userPhone') ? document.getElementById('userPhone').value : '',
                       Password: document.getElementById('userPassword').value,
                       Roles: document.getElementById('userRole').value      
};
                    try {
                        const updateResponse = await fetch(`${API_BASE_URL}/UserAccount/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authToken}`
                            },
                            body: JSON.stringify(userData)
                        });
                        console.log(updateResponse)
                        if (updateResponse.ok) {
                            alert('User updated successfully');
                            newSaveBtn.textContent = 'Save';
                            newSaveBtn.onclick = addUser;
                            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
                            loadUsers();
                        } else {
                            alert('Failed to update user');
                        }
                    } catch (error) {
                        alert('An error occurred while updating the user');
                    }
                };
            } catch (error) {
                alert('An error occurred while fetching user data');
            }
        }

        // Delete user
        async function deleteUser(id) {
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const response = await fetch(`${API_BASE_URL}/UserAccount/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    if (response.ok) {
                        alert('User deleted successfully');
                        loadUsers();
                    } else {
                        alert('Failed to delete user');
                    }
                } catch (error) {
                    alert('An error occurred while deleting the user');
                }
            }
        }
        // Search products
        async function searchProducts() {
            const keyword = document.getElementById('product-search-input').value.trim();
            if (!keyword) {
                loadProducts(); // If search is empty, show all products
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/Product/GetProductsBy${encodeURIComponent(keyword)}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (response.ok) {
                    const products = await response.json();
                    displayProducts(products);
                    document.getElementById('products-pagination').innerHTML = '';
                    document.getElementById('products-pagination-info').textContent = `Search results: ${products.length} products`;
                } else {
                    alert('Failed to search products');
                }
            } catch (error) {
                alert('An error occurred while searching products');
            }
        }
        // Edit product
        async function editProduct(id) {
            try {
                // Fetch product data from API
                const response = await fetch(`${API_BASE_URL}/Product/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (!response.ok) {
                    alert('Could not fetch product data');
                    return;
                }
                const product = await response.json();

                // Fill form with product data
                document.getElementById('productName').value = product.name;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productCategory').value = product.categoryId;
                document.getElementById('productDescription').value = product.description || '';
                document.getElementById('StockQuantity').value = product.StockQuantity || 0;

                
                // Note: Cannot pre-fill product image in file input

                // Show the form
                const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
                modal.show();

                // Change save button to update product instead of adding new
                const saveBtn = document.getElementById('save-product-btn');
                saveBtn.textContent = 'Update Product';
                // Remove all previous event listeners
                const newSaveBtn = saveBtn.cloneNode(true);
                saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
                newSaveBtn.onclick = async function() {
                    const formData = new FormData();
                    formData.append('Name', document.getElementById('productName').value);
                    formData.append('Price', document.getElementById('productPrice').value);
                    formData.append('CategoryId', document.getElementById('productCategory').value);
                    formData.append('Description', document.getElementById('productDescription').value);
                    formData.append('StockQuantity', document.getElementById('StockQuantity').value);

                    const imageFile = document.getElementById('productImage').files[0];
                    if (imageFile) {
                        formData.append('ImageFile', imageFile);
                    }
                    try {
                        const updateResponse = await fetch(`${API_BASE_URL}/Product/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${authToken}`
                            },
                            body: formData
                        });
                        if (updateResponse.ok) {
                            alert('Product updated successfully');
                            // Restore save button to its normal state
                            newSaveBtn.textContent = 'Save';
                            newSaveBtn.onclick = addProduct;
                            loadProducts();
                        } else {
                            const errorText = await updateResponse.text();
                            alert('Failed to update product: ' + errorText);
                        }
                    } catch (error) {
                        alert('An error occurred while updating the product');
                    }
                };
            } catch (error) {
                alert('An error occurred while fetching product data');
            }
        }

        // Delete product
        async function deleteProduct(id) {
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    const response = await fetch(`${API_BASE_URL}/Product/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    if (response.ok) {
                        alert('Product deleted successfully');
                        loadProducts();
                    } else {
                        alert('Failed to delete product');
                    }
                } catch (error) {
                    alert('An error occurred while deleting the product');
                }
            }
        }