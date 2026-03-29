CREATE TABLE Customers (
    customer_id INT PRIMARY KEY IDENTITY(1,1),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    created_at DATETIME DEFAULT GETDATE()
);
select *from Customers

CREATE TABLE Categories (
    category_id INT PRIMARY KEY IDENTITY(1,1),
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE Menu (
    menu_id INT PRIMARY KEY IDENTITY(1,1),
    category_id INT,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image  VARCHAR(500),
    is_available BIT DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT,
    order_date DATETIME DEFAULT GETDATE(),
    total_amount DECIMAL(10,2),
   
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);


CREATE TABLE OrderItems (
    order_item_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT,
    menu_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id)
);

CREATE TABLE Interiors (
    interior_id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100),
    image_url VARCHAR(500),
    type VARCHAR(50)  -- Luxury, Dining, Event, Party Hall
);

CREATE TABLE TableBooking (
    booking_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    number_of_guests INT,
    special_request TEXT,
    status VARCHAR(50) DEFAULT 'Reserved',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

## Project Setup & Running Instructions

### 1. Running the Backend in Visual Studio
The backend is a C# ASP.NET Core Web API.
1. Open **Visual Studio** (not VS Code).
2. Go to **File > Open > Project/Solution...**
3. Navigate to `D:\AcademicProject\RestaurantManagementSystem\` and select the `RestaurantManagementSystem.sln` file.
4. Ensure the start-up project is set to `RestaurantManagementSystem`.
5. Press `F5` or click the **Run / IIS Express** (or HTTPS profile) configuration play button in the toolbar.
6. The backend API will start running (typically listening on `https://localhost:7080`).

### 2. Running the Frontend in VS Code
The frontend is a React application built with Vite and Tailwind CSS.
1. Open **Visual Studio Code** (VS Code).
2. Open the frontend folder: `D:\AcademicProject\AcademicProjects`.
3. Open a new terminal (`Ctrl + ~` or `Cmd + ~`) in VS Code.
4. Install the necessary dependencies (if you haven't already):
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. The frontend application will launch and tell you the local URL (usually `http://localhost:5173`). Control-click or open this URL in your browser to view the system.

---

## Admin Dashboard Features Details
Once both the backend and frontend are running, log in with an Admin account to access the comprehensive **Admin Dashboard**, which fetches and displays all required details from the database:

- **Key Metrics Overview:** Instantly view Total Users, Total Orders, Total Revenue, and Pending Orders.
- **Recent Orders:** View essential order tracking details including Order ID, Customer Email, categorized Items, Total Amount, Date, and adjustable Status fields.
- **Upcoming Reservations:** Get real-time data on table bookings including Guest Name, Date & Time, Number of Guests (PAX), and any Special Requests.
- **Manage Users:** See newly registered accounts and manage current registered users.
- **Manage Menu Items:** Fully comprehensive tool to View, Add, and Manage restaurant menu items including their prices, categories, and image assets.
- **Detailed Pages:** Dedicated, drill-down tabs for *Menu*, *Orders*, *Users*, and *Reservations* to handle comprehensive business operations.
