-- ==========================================================
-- COMPREHENSIVE DATABASE SCHEMA (T-SQL)
-- Project: Restaurant Management System
-- Use this script to set up your database on monsterasp.net
-- ==========================================================

-- 1. TABLES
-- ==========================================================

-- Registration Table (User Accounts)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Registration')
BEGIN
    CREATE TABLE Registration (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        FirstName NVARCHAR(100) NOT NULL,
        LastName NVARCHAR(100) NOT NULL,
        EmailId NVARCHAR(100) NOT NULL UNIQUE,
        Password NVARCHAR(100) NOT NULL,
        Role INT DEFAULT 0 -- 0 for User, 1 for Admin
    );
END
GO

-- UserProfile Table (Bio and Images)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserProfile')
BEGIN
    CREATE TABLE UserProfile (
        ProfileId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL UNIQUE,
        UserName NVARCHAR(100) NULL,
        Email NVARCHAR(100) NULL,
        ProfileImage VARBINARY(MAX) NULL,
        UpdatedDate DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (UserId) REFERENCES Registration(UserId) ON DELETE CASCADE
    );
END
GO

-- TableResevation (Note: Typo 'Resevation' kept from code)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TableResevation')
BEGIN
    CREATE TABLE TableResevation (
        ReservationId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        UserName NVARCHAR(100) NOT NULL,
        UserEmail NVARCHAR(100) NOT NULL,
        ReservationDateTime DATETIME NOT NULL,
        NoOfPeople INT NOT NULL,
        SpecialAttentions NVARCHAR(MAX) NULL
    );
END
GO

-- MenuNew (Menu Items)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MenuNew')
BEGIN
    CREATE TABLE MenuNew (
        menu_id INT IDENTITY(1,1) PRIMARY KEY,
        category_id INT NULL,
        item_name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        price DECIMAL(18,2) NOT NULL,
        image VARBINARY(MAX) NULL,
        is_available BIT DEFAULT 1
    );
END
GO

-- UserOrders (Orders)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserOrders')
BEGIN
    CREATE TABLE UserOrders (
        Id NVARCHAR(50) PRIMARY KEY,
        UserEmail NVARCHAR(100) NOT NULL,
        Items NVARCHAR(MAX) NOT NULL, -- JSON formatted list of items
        TotalAmount DECIMAL(18,2) NOT NULL,
        OrderDate NVARCHAR(50) NOT NULL,
        Status NVARCHAR(50) DEFAULT 'Pending'
    );
END
GO

-- OrderDetails (Granular Order Data)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderDetails')
BEGIN
    CREATE TABLE OrderDetails (
        OrderDetailId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        MenuId INT NOT NULL,
        OrderItemId INT NULL,
        OrderDate DATETIME DEFAULT GETDATE(),
        Quantity INT NOT NULL,
        Price DECIMAL(18,2) NOT NULL,
        Total DECIMAL(18,2) NOT NULL
    );
END
GO

-- Payment Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Payment')
BEGIN
    CREATE TABLE Payment (
        PaymentId INT IDENTITY(1,1) PRIMARY KEY,
        payment_date DATETIME DEFAULT GETDATE(),
        amount DECIMAL(18,2) NOT NULL,
        method NVARCHAR(50) NULL
    );
END
GO


-- 2. STORED PROCEDURES
-- ==========================================================

-- Registration
CREATE OR ALTER PROCEDURE sp_InsertRegistration
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @EmailId NVARCHAR(100),
    @Password NVARCHAR(100)
AS
BEGIN
    INSERT INTO Registration (FirstName, LastName, EmailId, Password, Role)
    VALUES (@FirstName, @LastName, @EmailId, @Password, 0);
END
GO

CREATE OR ALTER PROCEDURE sp_GetRegistrations AS
BEGIN
    SELECT * FROM Registration;
END
GO

CREATE OR ALTER PROCEDURE sp_GetRegistrationById @Id INT AS
BEGIN
    SELECT * FROM Registration WHERE UserId = @Id;
END
GO

CREATE OR ALTER PROCEDURE sp_UpdateRegistration
    @UserId INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @EmailId NVARCHAR(100),
    @Password NVARCHAR(100)
AS
BEGIN
    UPDATE Registration 
    SET FirstName = @FirstName, LastName = @LastName, EmailId = @EmailId, Password = @Password
    WHERE UserId = @UserId;
END
GO

CREATE OR ALTER PROCEDURE sp_DeleteRegistration @UserId INT AS
BEGIN
    DELETE FROM Registration WHERE UserId = @UserId;
END
GO

CREATE OR ALTER PROCEDURE sp_ValidateLogin
    @EmailId NVARCHAR(100),
    @Password NVARCHAR(100)
AS
BEGIN
    SELECT * FROM Registration WHERE EmailId = @EmailId AND Password = @Password;
END
GO

-- Reservation
CREATE OR ALTER PROCEDURE sp_InsertReservation
    @UserName NVARCHAR(100),
    @UserEmail NVARCHAR(100),
    @ReservationDateTime DATETIME,
    @NoOfPeople INT,
    @SpecialAttentions NVARCHAR(MAX) = NULL,
    @UserId INT = NULL
AS
BEGIN
    INSERT INTO TableResevation (UserName, UserEmail, ReservationDateTime, NoOfPeople, SpecialAttentions, UserId)
    VALUES (@UserName, @UserEmail, @ReservationDateTime, @NoOfPeople, @SpecialAttentions, @UserId);
END
GO

-- Profile
CREATE OR ALTER PROCEDURE sp_InsertUserProfile
    @UserId INT,
    @UserName NVARCHAR(100),
    @Email NVARCHAR(100),
    @ProfileImage VARBINARY(MAX) = NULL
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM UserProfile WHERE UserId = @UserId)
    BEGIN
        INSERT INTO UserProfile (UserId, UserName, Email, ProfileImage, UpdatedDate)
        VALUES (@UserId, @UserName, @Email, @ProfileImage, GETDATE());
    END
END
GO

CREATE OR ALTER PROCEDURE sp_UpdateUserProfile
    @UserId INT,
    @UserName NVARCHAR(100),
    @Email NVARCHAR(100),
    @ProfileImage VARBINARY(MAX) = NULL
AS
BEGIN
    UPDATE UserProfile
    SET UserName = @UserName, Email = @Email, ProfileImage = @ProfileImage, UpdatedDate = GETDATE()
    WHERE UserId = @UserId;
END
GO

CREATE OR ALTER PROCEDURE sp_GetUserProfile @UserId INT AS
BEGIN
    SELECT * FROM UserProfile WHERE UserId = @UserId;
END
GO

-- Order Details
CREATE OR ALTER PROCEDURE sp_InsertOrder
    @UserId INT,
    @MenuId INT,
    @OrderItemId INT,
    @OrderDate DATETIME,
    @Quantity INT,
    @Price DECIMAL(18,2),
    @Total DECIMAL(18,2)
AS
BEGIN
    INSERT INTO OrderDetails (UserId, MenuId, OrderItemId, OrderDate, Quantity, Price, Total)
    VALUES (@UserId, @MenuId, @OrderItemId, @OrderDate, @Quantity, @Price, @Total);
END
GO

-- Payment
CREATE OR ALTER PROCEDURE sp_InsertPayment
    @payment_date DATETIME,
    @amount DECIMAL(18,2),
    @method NVARCHAR(50)
AS
BEGIN
    INSERT INTO Payment (payment_date, amount, method)
    VALUES (@payment_date, @amount, @method);
END
GO


-- 3. SAMPLE DATA (OPTIONAL)
-- ==========================================================

-- Create a Default Admin if not exists (Email: admin@restaurant.com, Password: AdminPassword123)
IF NOT EXISTS (SELECT 1 FROM Registration WHERE EmailId = 'admin@restaurant.com')
BEGIN
    INSERT INTO Registration (FirstName, LastName, EmailId, Password, Role)
    VALUES ('System', 'Admin', 'admin@restaurant.com', 'AdminPassword123', 1);
END
GO

-- Add Sample Menu Items if Menu is empty
IF NOT EXISTS (SELECT 1 FROM MenuNew)
BEGIN
    INSERT INTO MenuNew (category_id, item_name, Description, price, is_available)
    VALUES 
    (1, 'Margherita Pizza', 'Classic tomato and mozzarella pizza', 12.99, 1),
    (1, 'Pasta Carbonara', 'Creamy pasta with bacon and egg', 14.50, 1),
    (2, 'Chocolate Lava Cake', 'Hot chocolate cake with molten center', 6.99, 1),
    (3, 'Fresh Lime Soda', 'Refreshing lime drink', 3.50, 1);
END
GO
