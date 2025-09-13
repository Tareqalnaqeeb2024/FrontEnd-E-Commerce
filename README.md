
## 📸 Screenshots<img width="1651" height="938" alt="Amin3png" src="https://github.com/user-attachments/assets/67a9ca79-d13f-4625-b075-2ecf89fa97e6" />
<img width="1717" height="957" alt="Admin8" src="https://github.com/user-attachments/assets/fdff4dda-56e7-4936-97a9-0cad3c7f321a" />
<img width="1828" height="966" alt="Admin7" src="https://github.com/user-attachments/assets/4459e0d5-d394-4228-b924-7f078b6435f0" />
<img width="1547" height="876" alt="Admin6" src="https://github.com/user-attachments/assets/b65caf14-330d-4f50-b274-b5e0f45001de" />
<img width="1590" height="940" alt="Admin5" src="https://github.com/user-attachments/assets/3257d1ce-ea28-4c10-ba0b-2ebfcb40c586" />
<img width="1542" height="903" alt="Admin4" src="https://github.com/user-attachments/assets/195e49d1-7658-4fb7-9a7d-8484b13b9c6f" />
<img width="1703" height="986" alt="Admin2" src="https://github.com/user-attachments/assets/6dee972e-ae67-4ab7-8ac3-d34c7d0e3853" />

<img width="1561" height="781" alt="Admin1" src="https://github.com/user-attachments/assets/75585428-9d2c-4d94-993a-f56bdeb4fafe" />
# 🛒 E-commerce Admin Dashboard

A comprehensive and responsive **admin dashboard** for managing an e-commerce store, built with modern web technologies.

---

## 🌟 Features

- **Modern User Interface:** Sleek and intuitive design  
- **Secure Authentication:** JWT token-based login system  
- **Complete Management:**  
  - 📦 Products (view, add, edit, delete)  
  - 🛒 Orders (view, search, cancel, delete)  
  - 👥 Users (view, add, edit, delete)  
  - 📂 Categories (view, add, edit, delete)  
- **Dashboard Analytics:** Interactive charts for sales and distribution data  
- **Fully Responsive:** Works on all screen sizes and devices  

---

## 🛠 Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)  
- **Framework:** Bootstrap 5.3.0  
- **Charts:** Chart.js  
- **Icons:** Font Awesome 6.4.0  
- **Styling:** CSS Custom Properties  
- **Data Transfer:** RESTful API  

---

## 📦 API Endpoints Used

| Function          | Method | Endpoint                                |
|-------------------|--------|-----------------------------------------|
| **User Login**    | POST   | `/api/Auth/Login`                       |
| **Dashboard Stats** | GET   | `/api/UserAccount/DashboardStats`       |
| **Products List** | GET    | `/api/Product/paged`                    |
| **Add Product**   | POST   | `/api/Product`                          |
| **Edit Product**  | PUT    | `/api/Product/{id}`                     |
| **Delete Product**| DELETE | `/api/Product/{id}`                     |
| **Orders List**   | GET    | `/api/Order/paged`                      |
| **Cancel Order**  | PUT    | `/api/Order/CancelOrder/{id}`           |
| **Delete Order**  | DELETE | `/api/Order/{id}`                       |
| **Users List**    | GET    | `/api/UserAccount/paged`                |
| **Add User**      | POST   | `/api/UserAccount`                      |
| **Edit User**     | PUT    | `/api/UserAccount/{id}`                 |
| **Delete User**   | DELETE | `/api/UserAccount/{id}`                 |
| **Categories List** | GET  | `/api/Category`                         |
| **Add Category**  | POST   | `/api/Category`                         |
| **Edit Category** | PUT    | `/api/Category/{id}`                    |
| **Delete Category**| DELETE| `/api/Category/{id}`                    |

---


