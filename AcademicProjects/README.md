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




