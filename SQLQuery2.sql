CREATE DATABASE OrgManagementDB;
GO

USE OrgManagementDB;
GO


CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('ADMIN', 'MANAGER', 'EMPLOYEE')) NOT NULL,
    team_id INT NULL
);
GO


INSERT INTO users (username, password, role)
VALUES ('administrator', 'admin', 'ADMIN');
GO

select * from users;

CREATE TABLE teams (
    id INT IDENTITY(1,1) PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    manager_id INT NULL,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);
GO

CREATE TABLE employees (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    salary DECIMAL(10,2),
    team_id INT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
GO

CREATE TABLE product_sales (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    team_id INT NULL,
    employee_id INT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);
GO

CREATE TABLE revenue (
    id INT IDENTITY(1,1) PRIMARY KEY,
    team_id INT NOT NULL,
    total_revenue DECIMAL(15,2) NOT NULL,
    month VARCHAR(20) NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
GO
sp_help users;

INSERT INTO teams (team_name) VALUES ('Team Alpha');

INSERT INTO users (username, password, role, team_id)
VALUES ('manager1', 'manager123', 'MANAGER', 1);

INSERT INTO employees (name, designation, salary, team_id)
VALUES ('John Doe', 'Sales Executive', 45000, 1),
       ('Jane Smith', 'Sales Associate', 40000, 1);

INSERT INTO product_sales (product_name, quantity, price_per_unit, team_id, employee_id)
VALUES ('Product A', 10, 500, 1, 1),
       ('Product B', 5, 800, 1, 2);


ALTER TABLE users ADD authorized BIT DEFAULT 0;

ALTER TABLE users
ADD team_name VARCHAR(50);


INSERT INTO revenue (team_id, total_revenue, month)
VALUES (1, 9000.00, 'November 2025');
GO


select * from employees;


select * from products; 
SET IDENTITY_INSERT products ON;


INSERT INTO products VALUES (28, 'Desktop', 20, 50000.00, 'Sold', 27, 2, 'Nov');
INSERT INTO products VALUES (29, 'Printer', 10, 12000.00, 'In Progress', 26, 3, 'Dec');
INSERT INTO products VALUES (30, 'Scanner', 8, 8000.00, 'Completed', 28, 4, 'Dec');
INSERT INTO products VALUES (31, 'Router', 25, 6000.00, 'Sold', 29, 1, 'Jan');
INSERT INTO products VALUES (32, 'Keyboard', 50, 1200.00, 'In Progress', 26, 2, 'Jan');
INSERT INTO products VALUES (33, 'Mouse', 60, 800.00, 'Completed', 27, 3, 'Feb');
INSERT INTO products VALUES (34, 'Monitor', 30, 15000.00, 'Sold', 28, 4, 'Feb');
INSERT INTO products VALUES (35, 'External HDD', 40, 5000.00, 'Sold', 29, 1, 'Mar');
INSERT INTO products VALUES (36, 'Webcam', 25, 3500.00, 'In Progress', 26, 2, 'Mar');
INSERT INTO products (id, name, quantity, price, progress, team_id, employee_id, sale_month) VALUES
(37, 'Headphones', 45, 2500.00, 'Completed', 27, 2, 'Apr'),
(38, 'SSD 1TB', 20, 7500.00, 'Sold', 28, 3, 'Apr'),
(39, 'Graphics Card', 10, 22000.00, 'In Progress', 29, 1, 'Apr'),

(40, 'Laptop Stand', 55, 900.00, 'Sold', 26, 4, 'May'),
(41, 'Bluetooth Speaker', 35, 3000.00, 'Completed', 27, 2, 'May'),
(42, 'Pen Drive 64GB', 120, 600.00, 'In Progress', 28, 3, 'May'),

(43, 'UPS', 18, 4500.00, 'Sold', 29, 1, 'Jun'),
(44, 'Ethernet Cable', 200, 150.00, 'Completed', 26, 2, 'Jun'),
(45, 'Projector', 6, 32000.00, 'In Progress', 28, 4, 'Jun'),

(46, 'Smartwatch', 25, 7000.00, 'Sold', 27, 3, 'Jul'),
(47, 'Tablet', 12, 18000.00, 'Completed', 29, 1, 'Jul'),
(48, 'WiFi Adapter', 70, 850.00, 'In Progress', 26, 4, 'Jul'),

(49, 'Power Bank', 40, 1500.00, 'Sold', 27, 2, 'Aug'),
(50, 'VR Headset', 8, 25000.00, 'In Progress', 28, 3, 'Aug'),
(51, 'Docking Station', 15, 8500.00, 'Completed', 29, 1, 'Aug'),

(52, 'Gaming Keyboard', 35, 3500.00, 'Completed', 27, 2, 'Sep'),
(53, 'Portable SSD 512GB', 22, 6800.00, 'Sold', 28, 3, 'Sep'),
(54, 'Laser Printer', 9, 15000.00, 'In Progress', 29, 1, 'Sep'),
(55, 'CCTV Camera', 18, 5200.00, 'Completed', 26, 4, 'Sep'),

(56, 'Smart TV 43"', 7, 32000.00, 'Sold', 27, 3, 'Oct'),
(57, 'Gaming Mouse', 55, 1200.00, 'Completed', 28, 4, 'Oct'),
(58, 'Network Switch 16P', 14, 6000.00, 'In Progress', 29, 1, 'Oct'),
(59, 'HDMI Cable', 90, 250.00, 'Sold', 26, 2, 'Oct'),

(60, 'Wireless Charger', 40, 1800.00, 'Completed', 27, 3, 'Nov'),
(61, 'Laptop Bag', 60, 900.00, 'In Progress', 28, 4, 'Nov'),
(62, 'CPU Cabinet', 20, 3500.00, 'Sold', 29, 1, 'Nov'),
(63, 'Barcode Scanner', 15, 4200.00, 'Completed', 26, 2, 'Nov'),

(64, 'AirPods Clone', 50, 2200.00, 'Sold', 27, 2, 'Dec'),
(65, 'Office Chair', 25, 7000.00, 'Completed', 28, 3, 'Dec'),
(66, 'Wireless Router AC', 30, 2800.00, 'In Progress', 29, 1, 'Dec'),
(67, 'LED Desk Lamp', 45, 1200.00, 'Sold', 26, 4, 'Dec'),

(68, 'Smart Plug', 35, 950.00, 'Completed', 26, 3, 'Jan'),
(69, 'Laptop 14"', 10, 45000.00, 'Sold', 27, 1, 'Jan'),
(70, 'Mechanical Keyboard', 20, 5500.00, 'In Progress', 28, 4, 'Jan'),

(71, 'Bluetooth Earbuds', 60, 1800.00, 'Completed', 29, 2, 'Feb'),
(72, 'Power Strip 6-Port', 45, 650.00, 'Sold', 26, 3, 'Feb'),
(73, 'Webcam 1080p', 40, 2400.00, 'In Progress', 27, 1, 'Feb'),
(74, 'RAM 8GB DDR4', 30, 2800.00, 'Completed', 28, 4, 'Feb'),

(75, 'Graphics Tablet', 12, 15000.00, 'Sold', 29, 2, 'Mar'),
(76, 'External DVD Drive', 18, 2500.00, 'Completed', 27, 3, 'Mar'),
(77, 'Bluetooth Keyboard', 35, 2200.00, 'In Progress', 26, 4, 'Mar'),
(78, 'Hard Drive 2TB', 20, 5200.00, 'Completed', 28, 1, 'Mar'),

(79, 'Soundbar', 25, 4500.00, 'Sold', 29, 4, 'Apr'),
(80, 'Projector Screen', 10, 9000.00, 'Completed', 26, 2, 'Apr'),
(81, 'Wireless Headset', 28, 3200.00, 'In Progress', 27, 3, 'Apr');


SET IDENTITY_INSERT products ON;

INSERT INTO products (id, name, quantity, price, progress, team_id, employee_id, sale_month) VALUES
(82, 'HDMI Cable', 50, 450.00, 'Sold', 26, 1, 'Jan'),
(83, 'Laptop Cooling Pad', 30, 1100.00, 'In Progress', 27, 2, 'Jan'),
(84, 'Wireless Earbuds', 25, 3500.00, 'Completed', 28, 3, 'Feb'),
(85, 'Digital Pen Tablet', 15, 9000.00, 'Sold', 29, 4, 'Feb'),
(86, 'Portable SSD 512GB', 20, 4200.00, 'In Progress', 26, 1, 'Mar'),
(87, 'Laptop Stand', 40, 1300.00, 'Completed', 27, 2, 'Mar'),
(88, 'USB-C Docking Station', 18, 5500.00, 'Sold', 28, 3, 'Apr'),
(89, 'Wireless Presenter', 22, 1800.00, 'In Progress', 29, 4, 'Apr'),
(90, 'Anti-Glare Screen Filter', 30, 2500.00, 'Completed', 26, 1, 'May'),
(91, 'Network Switch 16-Port', 10, 15000.00, 'Sold', 27, 2, 'May'),
(92, 'Smart Desk Organizer', 35, 1600.00, 'In Progress', 28, 3, 'Jun'),
(93, 'Noise Meter', 12, 7000.00, 'Completed', 29, 4, 'Jun'),
(94, 'Laser Distance Meter', 15, 8500.00, 'Sold', 26, 1, 'Jul'),
(95, 'Barcode Scanner', 20, 6500.00, 'In Progress', 27, 2, 'Jul'),
(96, 'Thermal Printer', 18, 12000.00, 'Completed', 28, 3, 'Aug'),
(97, 'Smart Light Strip', 40, 1300.00, 'Sold', 29, 4, 'Aug'),
(98, 'Fingerprint Scanner', 10, 14500.00, 'In Progress', 26, 1, 'Sep'),
(99, 'UPS 600VA', 25, 3500.00, 'Completed', 27, 2, 'Sep'),
(100, 'HD Webcam Pro', 20, 8200.00, 'Sold', 28, 3, 'Oct'),
(101, 'Pen Drive 128GB', 50, 900.00, 'In Progress', 29, 4, 'Oct');

SET IDENTITY_INSERT products OFF;

DELETE FROM products;
IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'products' AND COLUMN_NAME = 'customer'
)
BEGIN
    ALTER TABLE products ADD customer VARCHAR(255) NULL;
END
WITH monthly_data AS (
    SELECT
        t.team_name,
        p.sale_month,
        SUM(p.price * p.quantity) AS total_revenue,
        COUNT(*) AS num_sales,
        AVG(p.price * p.quantity) AS avg_revenue
    FROM products p
    LEFT JOIN teams t ON p.team_id = t.id
    WHERE p.sale_month IS NOT NULL
    GROUP BY t.team_name, p.sale_month
),
ordered_data AS (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY team_name ORDER BY
            CASE sale_month
                WHEN 'Jan' THEN 1 WHEN 'Feb' THEN 2 WHEN 'Mar' THEN 3 WHEN 'Apr' THEN 4
                WHEN 'May' THEN 5 WHEN 'Jun' THEN 6 WHEN 'Jul' THEN 7 WHEN 'Aug' THEN 8
                WHEN 'Sep' THEN 9 WHEN 'Oct' THEN 10 WHEN 'Nov' THEN 11 WHEN 'Dec' THEN 12
            END
        ) AS month_idx
    FROM monthly_data
),
growth_data AS (
    SELECT od.*,
        LAG(total_revenue) OVER (PARTITION BY team_name ORDER BY month_idx) AS prev_total,
        SUM(total_revenue) OVER (PARTITION BY team_name ORDER BY month_idx ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS ytd_revenue
    FROM ordered_data od
)
SELECT
    ROW_NUMBER() OVER (ORDER BY team_name, month_idx) AS id,
    team_name AS team,
    sale_month AS month,
    total_revenue,
    num_sales,
    avg_revenue,
    CASE WHEN prev_total IS NULL THEN 0
         ELSE ROUND((total_revenue - prev_total)/prev_total*100, 2)
    END AS growth,
    ytd_revenue
FROM growth_data
ORDER BY team_name, month_idx;
ALTER TABLE products
ADD customer VARCHAR(255) NULL;

SET IDENTITY_INSERT products ON;

-- Clear old products
DELETE FROM products;

-- Insert new products with customer
INSERT INTO products (id, name, quantity, price, progress, team_id, employee_id, sale_month, customer) VALUES
(1, 'Laptop Pro 15', 10, 12000.00, 'Sold', 26, 1, 'Jan', 'Alice Johnson'),
(2, 'Laptop Pro 15', 8, 12000.00, 'Sold', 26, 1, 'Feb', 'Alice Johnson'),
(3, 'HD Monitor 27', 20, 7000.00, 'Sold', 26, 2, 'Mar', 'Bob Smith'),
(4, 'HD Monitor 27', 18, 7000.00, 'Sold', 26, 2, 'Apr', 'Bob Smith'),
(5, 'Wireless Mouse', 50, 1500.00, 'Completed', 26, 3, 'May', 'Charlie Lee'),
(6, 'Wireless Mouse', 40, 1500.00, 'Completed', 26, 3, 'Jun', 'Charlie Lee'),
(7, 'Mechanical Keyboard', 25, 3500.00, 'In Progress', 26, 4, 'Jul', 'Alice Johnson'),
(8, 'Mechanical Keyboard', 30, 3500.00, 'Sold', 26, 4, 'Aug', 'Alice Johnson'),
(9, 'USB-C Hub', 40, 2500.00, 'Sold', 26, 1, 'Sep', 'Bob Smith'),
(10, 'USB-C Hub', 35, 2500.00, 'Completed', 26, 1, 'Oct', 'Bob Smith'),

(11, 'Gaming Laptop', 12, 22000.00, 'Sold', 27, 2, 'Jan', 'Ethan Hunt'),
(12, 'Gaming Laptop', 10, 22000.00, 'Sold', 27, 2, 'Feb', 'Ethan Hunt'),
(13, 'Graphics Tablet', 15, 9000.00, 'Completed', 27, 3, 'Mar', 'Fiona Clarke'),
(14, 'Graphics Tablet', 12, 9000.00, 'Completed', 27, 3, 'Apr', 'Fiona Clarke'),
(15, 'Ergonomic Chair', 20, 6000.00, 'Sold', 27, 4, 'May', 'George Miller'),
(16, 'Ergonomic Chair', 18, 6000.00, 'In Progress', 27, 4, 'Jun', 'George Miller'),
(17, 'Desk Lamp', 30, 1200.00, 'Completed', 27, 1, 'Jul', 'Ethan Hunt'),
(18, 'Desk Lamp', 25, 1200.00, 'Sold', 27, 1, 'Aug', 'Ethan Hunt'),
(19, 'External HDD 1TB', 15, 4500.00, 'Sold', 27, 2, 'Sep', 'Fiona Clarke'),
(20, 'External HDD 1TB', 12, 4500.00, 'Completed', 27, 2, 'Oct', 'Fiona Clarke'),

(21, 'Smartphone X', 20, 30000.00, 'Sold', 28, 3, 'Jan', 'Harry Kane'),
(22, 'Smartphone X', 18, 30000.00, 'Sold', 28, 3, 'Feb', 'Harry Kane'),
(23, 'Tablet Pro', 15, 25000.00, 'Completed', 28, 4, 'Mar', 'Irene Adler'),
(24, 'Tablet Pro', 12, 25000.00, 'Completed', 28, 4, 'Apr', 'Irene Adler'),
(25, 'Smartwatch Z', 30, 12000.00, 'Sold', 28, 1, 'May', 'Jack Sparrow'),
(26, 'Smartwatch Z', 28, 12000.00, 'Sold', 28, 1, 'Jun', 'Jack Sparrow'),
(27, 'Bluetooth Speaker', 25, 3500.00, 'Completed', 28, 2, 'Jul', 'Harry Kane'),
(28, 'Bluetooth Speaker', 20, 3500.00, 'Sold', 28, 2, 'Aug', 'Harry Kane'),
(29, 'Camera Lens 50mm', 10, 8000.00, 'Sold', 28, 3, 'Sep', 'Irene Adler'),
(30, 'Camera Lens 50mm', 8, 8000.00, 'Completed', 28, 3, 'Oct', 'Irene Adler'),

(31, 'Office Desk', 15, 15000.00, 'Sold', 29, 4, 'Jan', 'Kevin Durant'),
(32, 'Office Desk', 12, 15000.00, 'Sold', 29, 4, 'Feb', 'Kevin Durant'),
(33, 'Conference Chair', 20, 8000.00, 'Completed', 29, 1, 'Mar', 'Laura Croft'),
(34, 'Conference Chair', 18, 8000.00, 'Completed', 29, 1, 'Apr', 'Laura Croft'),
(35, 'Projector', 10, 22000.00, 'Sold', 29, 2, 'May', 'Michael Jordan'),
(36, 'Projector', 8, 22000.00, 'Sold', 29, 2, 'Jun', 'Michael Jordan'),
(37, 'Whiteboard', 25, 2500.00, 'Completed', 29, 3, 'Jul', 'Kevin Durant'),
(38, 'Whiteboard', 20, 2500.00, 'Sold', 29, 3, 'Aug', 'Kevin Durant'),
(39, 'Printer', 12, 7000.00, 'Sold', 29, 4, 'Sep', 'Laura Croft'),
(40, 'Printer', 10, 7000.00, 'Completed', 29, 4, 'Oct', 'Laura Croft'),

(41, 'HDMI Cable', 50, 450.00, 'Sold', 26, 1, 'Nov', 'Alice Johnson'),
(42, 'Laptop Cooling Pad', 30, 1100.00, 'In Progress', 27, 2, 'Nov', 'Ethan Hunt'),
(43, 'Wireless Earbuds', 25, 3500.00, 'Completed', 28, 3, 'Nov', 'Harry Kane'),
(44, 'Digital Pen Tablet', 15, 9000.00, 'Sold', 29, 4, 'Nov', 'Michael Jordan'),
(45, 'Portable SSD 512GB', 20, 4200.00, 'In Progress', 26, 1, 'Dec', 'Bob Smith'),
(46, 'Laptop Stand', 40, 1300.00, 'Completed', 27, 2, 'Dec', 'Fiona Clarke'),
(47, 'USB-C Docking Station', 18, 5500.00, 'Sold', 28, 3, 'Dec', 'Jack Sparrow'),
(48, 'Wireless Presenter', 22, 1800.00, 'In Progress', 29, 4, 'Dec', 'Kevin Durant'),
(49, 'Anti-Glare Screen Filter', 30, 2500.00, 'Completed', 26, 1, 'Dec', 'Charlie Lee'),
(50, 'Network Switch 16-Port', 10, 15000.00, 'Sold', 27, 2, 'Dec', 'Ethan Hunt');



select * from teams;


-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(MAX)
);

-- =========================
-- PRODUCTS
-- =========================
ALTER TABLE cart DROP CONSTRAINT FK_cart_storeproduct;

DROP TABLE storeproducts;
CREATE TABLE storeproducts (
    id INT PRIMARY KEY,                  -- JSON already has IDs (201,202,...)
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(255),
    subcategory VARCHAR(255),
    image VARCHAR(500),
    rating_stars DECIMAL(3,1),
    rating_count INT,
    description VARCHAR(MAX),
    keywords VARCHAR(MAX)
);




-- =========================
-- CART
-- =========================
CREATE TABLE cart (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_cart_storeproduct
        FOREIGN KEY (product_id) REFERENCES storeproducts(id)
);

SELECT id, name FROM storeproducts;

-- =========================
-- ORDERS
-- =========================
CREATE TABLE orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);


-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE order_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id),

    CONSTRAINT FK_order_items_storeproduct
        FOREIGN KEY (product_id) REFERENCES storeproducts(id)
);

SELECT 
    fk.name AS foreign_key_name,
    t.name AS table_name
FROM sys.foreign_keys fk
JOIN sys.tables t ON fk.parent_object_id = t.object_id
WHERE t.name = 'cart';

ALTER TABLE order_items DROP CONSTRAINT FK_order_items_storeproduct;


SELECT  
    fk.name AS foreign_key_name,
    tp.name AS parent_table,
    tr.name AS referenced_table
FROM sys.foreign_keys fk
JOIN sys.tables tp ON fk.parent_object_id = tp.object_id
JOIN sys.tables tr ON fk.referenced_object_id = tr.object_id
WHERE tr.name = 'storeproducts';



-- Generated SQL to recreate ecommerce tables and populate storeproducts from products.json
SET XACT_ABORT ON;
BEGIN TRANSACTION;

-- Drop foreign key constraints that reference storeproducts
DECLARE @refcursor CURSOR;
DECLARE @fkname SYSNAME, @parent SYSNAME;
SET @refcursor = CURSOR FOR
SELECT fk.name, tp.name
FROM sys.foreign_keys fk
JOIN sys.tables tr ON fk.referenced_object_id = tr.object_id
JOIN sys.tables tp ON fk.parent_object_id = tp.object_id
WHERE tr.name = 'storeproducts';

OPEN @refcursor;
FETCH NEXT FROM @refcursor INTO @fkname, @parent;
WHILE @@FETCH_STATUS = 0
BEGIN
    EXEC('ALTER TABLE [' + @parent + '] DROP CONSTRAINT [' + @fkname + ']');
    FETCH NEXT FROM @refcursor INTO @fkname, @parent;
END
CLOSE @refcursor;
DEALLOCATE @refcursor;

DECLARE @sql NVARCHAR(MAX) = '';

SELECT @sql = @sql + 'ALTER TABLE [' + OBJECT_NAME(parent_object_id) + '] DROP CONSTRAINT [' + name + '];'
FROM sys.foreign_keys 
WHERE referenced_object_id = OBJECT_ID('storeproducts');

PRINT @sql;  -- for debugging
EXEC sp_executesql @sql;


-- Drop tables if they exist (order: dependents -> dependencies)
IF OBJECT_ID('dbo.order_items','U') IS NOT NULL DROP TABLE dbo.order_items;
IF OBJECT_ID('dbo.orders','U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.cart','U') IS NOT NULL DROP TABLE dbo.cart;
IF OBJECT_ID('dbo.storeproducts','U') IS NOT NULL DROP TABLE dbo.storeproducts;
IF OBJECT_ID('dbo.categories','U') IS NOT NULL DROP TABLE dbo.categories;

-- Create categories table
CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(MAX) NULL
);
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'categories';
SELECT id, name FROM categories;

-- Create storeproducts table (using JSON ids as primary key)
CREATE TABLE storeproducts (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NULL,
    subcategory VARCHAR(255) NULL,
    image VARCHAR(1000) NULL,
    rating_stars DECIMAL(3,1) NULL,
    rating_count INT NULL,
    description VARCHAR(MAX) NULL,
    keywords VARCHAR(MAX) NULL,
    category_id INT NULL,
    CONSTRAINT FK_storeproducts_category FOREIGN KEY (category_id) REFERENCES categories(id)
);
ALTER TABLE storeproducts
ADD stock INT NOT NULL DEFAULT 100;
UPDATE storeproducts
SET stock = 50; -- or whatever starting quantity

-- Cart table
CREATE TABLE cart (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_cart_storeproduct FOREIGN KEY (product_id) REFERENCES storeproducts(id)
);
ALTER TABLE cart ADD is_saved BIT DEFAULT 0;

-- Add the is_saved column to existing cart table
ALTER TABLE cart
ADD is_saved BIT DEFAULT 0;

-- Optional: make sure all existing rows default to 0 (cart)
UPDATE cart
SET is_saved = 0
WHERE is_saved IS NULL;

-- Check the column details
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'cart';

-- Make sure all existing rows have a valid value (0 for regular cart)
UPDATE cart
SET is_saved = 0
WHERE is_saved IS NULL;



SELECT * FROM orders WHERE user_id = 1;
select* from users;
select COLUMNS FROM users;

-- Orders and order_items
CREATE TABLE orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE order_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT FK_order_items_storeproduct FOREIGN KEY (product_id) REFERENCES storeproducts(id)
);

ALTER TABLE orders
ADD status VARCHAR(50) NOT NULL DEFAULT 'PLACED';

-- Create wishlist table
CREATE TABLE wishlist (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_wishlist_product FOREIGN KEY (product_id) REFERENCES storeproducts(id)
);

-- Optional: insert sample data
-- INSERT INTO wishlist (user_id, product_id, qty) VALUES (1, 101, 1);

-- Check table structure
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'wishlist';

-- View wishlist for a user
SELECT w.id, w.user_id, w.product_id, w.qty, w.created_at, 
       sp.name AS product_name, sp.price AS product_price
FROM wishlist w
JOIN storeproducts sp ON w.product_id = sp.id
WHERE w.user_id = 6
ORDER BY w.created_at DESC;

SELECT * FROM wishlist WHERE user_id = 6;
select * from users;

-- Insert categories
INSERT INTO categories (name) VALUES ('Electronics and gadgets');
INSERT INTO categories (name) VALUES ('Beauty & Personal Care');
INSERT INTO categories (name) VALUES ('Fashion & Apparel');
INSERT INTO categories (name) VALUES ('Home & Kitchen');
INSERT INTO categories (name) VALUES ('Health & Fitness');
INSERT INTO categories (name)
VALUES ('Shoes');

INSERT INTO categories (id, name) VALUES (1, 'Electronics');
INSERT INTO categories (id, name) VALUES (2, 'Beauty & Personal Care');
INSERT INTO categories (id, name) VALUES (3, 'Fashion');
INSERT INTO categories (id, name) VALUES (4, 'Home & Kitchen');
INSERT INTO categories (id, name) VALUES (5, 'Health & Fitness');
INSERT INTO categories (id, name) VALUES (6, 'Shoes');
SELECT id, name FROM categories;

-- Insert products (from JSON)
-- Delete all existing products
-- Delete all cart entries that reference products
DELETE FROM cart
WHERE product_id IN (SELECT id FROM storeproducts);


DELETE FROM storeproducts;

-- Insert all products (201–270)
INSERT INTO storeproducts
  (id, name, price, category, subcategory, image, rating_stars, rating_count, description, keywords, category_id)
VALUES
(201, 'Hydrating Facial Moisturizer', 20.00, 'Beauty & Personal Care', 'Skincare',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/moisturizer.jpg',
 4.7, 120,
 'This Hydrating Facial Moisturizer is expertly formulated to deeply nourish and hydrate your skin, providing lasting moisture and a smooth, radiant complexion. Ideal for daily use.',
 'moisturizer,hydration,skincare,beauty',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(202, 'Anti-Dandruff Shampoo', 15.00, 'Beauty & Personal Care', 'Hair Care',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/shampoo.jpg',
 4.5, 85,
 'Our Anti-Dandruff Shampoo effectively combats flakes and itchiness, promoting a healthy scalp. Infused with soothing ingredients, it cleanses your hair without stripping natural oils.',
 'shampoo,hair care,anti-dandruff,cleanse',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(203, 'Matte Liquid Foundation', 22.00, 'Beauty & Personal Care', 'Makeup',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/foundation.jpg',
 4.6, 98,
 'This Matte Liquid Foundation offers a flawless finish with long-lasting wear. Lightweight and breathable, it blends seamlessly into the skin, providing even coverage and a natural look.',
 'foundation,makeup,beauty,matte',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(204, 'Eau de Parfum - Floral Scent', 35.00, 'Beauty & Personal Care', 'Fragrances',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/perfume.jpg',
 4.8, 160,
 'Experience the essence of blooming florals with our Eau de Parfum. This captivating scent envelops you in elegance, making it perfect for any occasion, leaving a lasting impression.',
 'perfume,fragrance,scent,floral',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(205, 'Men''s Shaving Kit', 18.00, 'Beauty & Personal Care', 'Grooming',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/shaving-kit.jpg',
 4.4, 70,
 'This Men''s Shaving Kit includes everything needed for a close, comfortable shave. Featuring a premium razor and soothing gel, it ensures a smooth experience with every use.',
 'shaving kit,grooming,men,razor',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(206, 'Nourishing Body Wash', 13.00, 'Beauty & Personal Care', 'Bath & Body',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/body-wash.jpg',
 4.7, 140,
 'Our Nourishing Body Wash gently cleanses while replenishing moisture, leaving your skin feeling soft and revitalized. Infused with natural ingredients for a refreshing bathing experience.',
 'body wash,bath,care,nourishing',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(207, 'Glossy Nail Polish', 8.00, 'Beauty & Personal Care', 'Nail Care',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/nail-polish.jpg',
 4.5, 65,
 'Achieve stunning nails with our Glossy Nail Polish. This vibrant formula provides high shine and long-lasting wear, perfect for expressing your personal style with every application.',
 'nail polish,nail care,beauty,glossy',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(208, 'Moisturizing Conditioner', 17.00, 'Beauty & Personal Care', 'Hair Care',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/conditioner.jpg',
 4.6, 110,
 'Our Moisturizing Conditioner deeply hydrates and detangles hair, leaving it soft, shiny, and manageable. Perfect for all hair types, it helps restore natural moisture balance.',
 'conditioner,hair care,moisturizing,smooth',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(209, 'Triple Blade Razor', 10.00, 'Beauty & Personal Care', 'Men''s Grooming Products',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/razor.jpg',
 4.3, 55,
 'The Triple Blade Razor delivers an exceptionally close shave with minimal irritation. Its ergonomic design provides comfort and control, making it a must-have for every grooming routine.',
 'razor,grooming,men,shaving',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(210, 'Vitamin C Supplement', 30.00, 'Beauty & Personal Care', 'Health & Wellness Products',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/vitamin-supplement.jpg',
 4.7, 200,
 'Boost your health with our Vitamin C Supplement. Designed to support immune function and overall wellness, these easy-to-take tablets provide essential nutrients for your daily needs.',
 'vitamin c,supplement,wellness,health',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(211, 'Wireless Bluetooth Headphones', 79.99, 'Electronics & Gadgets', 'Audio',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/wireless-headphones.jpg',
 4.7, 230,
 'Experience superior sound quality with these wireless Bluetooth headphones, designed for comfort and portability for everyday use.',
 'headphones,bluetooth,audio,electronics',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadgets')),
(212, 'Smartphone - 128GB', 450.00, 'Electronics & Gadgets', 'Mobile Phones',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/smartphone.jpg',
 4.6, 320,
 'Stay connected with this high-performance smartphone featuring 128GB storage, perfect for apps, photos, and multimedia.',
 'smartphone,mobile,gadgets',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadgets')),
(213, '55‑Inch 4K Ultra HD TV', 900.00, 'Electronics & Gadgets', 'Televisions',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/4k-tv.jpg',
 4.8, 190,
 'Enjoy breathtaking visuals with this 55‑inch 4K Ultra HD TV, delivering stunning detail and vibrant colors for your favorite shows.',
 'television,4K,electronics,gadgets',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadgets')),
(214, 'Gaming Laptop - 16GB RAM, 512GB SSD', 1200.00, 'Electronics & Gadgets', 'Computers',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/laptop.jpg',
 4.9, 210,
 'Unleash your gaming potential with this powerful gaming laptop featuring 16GB RAM and 512GB SSD for speed and performance.',
 'laptop,gaming,computers,electronics',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadgets')),
(215, 'Smartwatch - Fitness Tracker', 150.00, 'Electronics & Gadets', 'Wearables',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/smartwatch.jpg',
 4.5, 130,
 'Monitor your health and stay connected with this feature‑rich smartwatch, perfect for tracking fitness and receiving notifications.',
 'smartwatch,fitness,wearables,electronics',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadgets')),
(216, '10.1‑Inch Android Tablet', 200.00, 'Electronics & Gadgets', 'Tablets',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/tablet.jpg',
 4.3, 95,
 'Enjoy your favorite apps and media on this sleek 10.1‑inch Android tablet, offering portability and a vibrant display for on‑the‑go.',
 'tablet,android,gadgets,electronics',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadgets')),
(217, 'Portable Bluetooth Speaker', 50.00, 'Electronics & Gadgets', 'Audio',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/bluetooth-speaker.jpg',
 4.7, 180,
 'Take your music anywhere with this portable Bluetooth speaker, delivering powerful sound in a compact design, perfect for outdoor use.',
 'bluetooth,speaker,audio,gadgets',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadets')),
(218, 'DSLR Camera - 24MP', 850.00, 'Electronics & Gadgets', 'Cameras',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/dslr-camera.jpg',
 4.8, 115,
 'Capture stunning photos and videos with this 24MP DSLR camera, offering professional-quality imaging and advanced features for creatives.',
 'camera,dslr,gadgets,electronics',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadets')),
(219, 'USB Drive - 64GB', 12.00, 'Electronics & Gadgets', 'Storage',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/usb-drive.jpg',
 4.2, 75,
 'Store and transfer your files easily with this 64GB USB drive, offering ample space and portability for your data needs.',
 'usb,storage,gadgets,electronics',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadets')),
(220, '4K Action Camera', 180.00, 'Electronics & Gadgets', 'Cameras',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/action-camera.jpg',
 4.6, 90,
 'Record your adventures in stunning detail with this 4K action camera, built to withstand tough conditions and capture high-quality footage.',
 'action camera,4K,gadgets,electronics',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadets')),
(221, 'Men''s Denim Jacket', 35.00, 'Fashion & Apparel', 'Men''s Clothing',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/denim-jacket.jpg',
 4.5, 150,
 'This stylish Men''s Denim Jacket is perfect for any casual occasion. Crafted from high-quality denim, it features a classic fit, button closure, and timeless design that complements various outfits.',
 'denim jacket,men,clothing,outerwear',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(222, 'Women''s Floral Maxi Dress', 42.00, 'Fashion & Apparel', 'Women''s Clothing',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/maxi-dress.jpg',
 4.8, 95,
 'Embrace elegance with this Women''s Floral Maxi Dress, designed with a flattering silhouette and vibrant floral patterns. Perfect for sunny days and special occasions, it''s a must-have addition to your wardrobe.',
 'floral dress,women,clothing,dress',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(223, 'Unisex Casual Sneakers', 55.00, 'Fashion & Apparel', 'Footwear',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/sneakers.jpg',
 4.7, 210,
 'These Unisex Casual Sneakers blend comfort and style effortlessly. With a lightweight design and cushioned sole, they''re perfect for everyday wear, making them a versatile choice for any outfit.',
 'sneakers,footwear,shoes,casual',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(224, 'Leather Tote Bag', 60.00, 'Fashion & Apparel', 'Accessories',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/leather-bag.jpg',
 4.6, 130,
 'Elevate your style with this chic Leather Tote Bag, featuring a spacious interior and elegant design. Crafted from premium leather, it''s perfect for carrying your essentials while looking effortlessly stylish.',
 'leather bag,tote,accessories,fashion',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(225, 'Polarized Sunglasses', 25.00, 'Fashion & Apparel', 'Accessories',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/sunglasses.jpg',
 4.4, 90,
 'Protect your eyes in style with these Polarized Sunglasses. Designed to reduce glare and enhance visual clarity, they offer both comfort and sophistication for all your outdoor adventures.',
 'sunglasses,polarized,accessories,fashion',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(226, 'Men''s Formal Shirt', 31.00, 'Fashion & Apparel', 'Men''s Clothing',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/formal-shirt.jpg',
 4.3, 85,
 'This Men''s Formal Shirt combines elegance with comfort. Tailored to perfection, it features a classic collar and a crisp finish, making it the ideal choice for business meetings or formal occasions.',
 'formal shirt,men,clothing,shirt',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(227, 'Women''s High Heels', 45.00, 'Fashion & Apparel', 'Footwear',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/heels.jpg',
 4.6, 105,
 'Step into sophistication with these Women''s High Heels, featuring a sleek design and comfortable fit. Perfect for parties, weddings, or a night out, they will elevate any outfit with a touch of glamour.',
 'heels,womens footwear,fashion,shoes',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(228, 'Graphic Print T‑Shirt', 18.00, 'Fashion & Apparel', 'Men''s Clothing',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/t-shirt.jpg',
 4.5, 200,
 'Express yourself with this Graphic Print T‑Shirt, featuring vibrant colors and unique designs. Made from soft cotton, it offers a relaxed fit, making it perfect for casual outings or lounging at home.',
 't-shirt,graphic print,men,clothing',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(229, 'Women''s Designer Handbag', 75.00, 'Fashion & Apparel', 'Accessories',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/handbag.jpg',
 4.9, 150,
 'Make a statement with this Women''s Designer Handbag, crafted from luxurious materials and featuring exquisite detailing. It''s spacious enough for daily essentials while adding elegance to your ensemble.',
 'handbag,designer,fashion,accessories',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(230, 'Comfortable Flip‑Flops', 12.00, 'Fashion & Apparel', 'Footwear',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/slippers.jpg',
 4.2, 70,
 'Enjoy ultimate comfort with these Comfortable Flip‑Flops. Designed for casual wear, they feature soft straps and cushioned soles, making them perfect for the beach, pool, or everyday relaxation.',
 'flip-flops,slippers,footwear,casual',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(231, 'Modern Leather Sofa', 1200.00, 'Home & Kitchen', 'Furniture',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/sofa.jpg',
 4.8, 220,
 'A stylish modern leather sofa that enhances the elegance of your living room while providing utmost comfort for relaxation and entertaining guests.',
 'sofa,furniture,living room,home decor',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(232, 'Stainless Steel Refrigerator', 950.00, 'Home & Kitchen', 'Kitchen Appliances',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/refrigerator.jpg',
 4.6, 150,
 'This sleek stainless steel refrigerator features ample storage space, energy efficiency, and modern technology, making it perfect for keeping your food fresh.',
 'refrigerator,appliance,kitchen,stainless steel',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(233, 'Cordless Vacuum Cleaner', 180.00, 'Home & Kitchen', 'Home Appliances',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/vacuum-cleaner.jpg',
 4.4, 180,
 'Enjoy effortless cleaning with this cordless vacuum cleaner, designed for convenience and efficiency, easily reaching corners and tight spaces without any cords.',
 'vacuum cleaner,cordless,cleaning,home',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(234, 'Non‑Stick Cookware Set', 250.00, 'Home & Kitchen', 'Cookware & Bakeware',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/cookware.jpg',
 4.7, 95,
 'This non-stick cookware set is perfect for easy cooking and cleaning, ensuring your meals come out delicious without sticking, making meal prep a breeze.',
 'cookware,non-stick,kitchen,bakeware',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(235, 'Porcelain Dinnerware Set', 160.00, 'Home & Kitchen', 'Dinnerware & Serveware',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/dinnerware.jpg',
 4.9, 70,
 'Elevate your dining experience with this exquisite porcelain dinnerware set, perfect for both everyday meals and special occasions, combining elegance and functionality.',
 'dinnerware,porcelain,kitchen,tableware',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(236, 'Memory Foam Mattress', 750.00, 'Home & Kitchen', 'Bedding',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/mattress.jpg',
 4.8, 140,
 'Experience superior comfort with our memory foam mattress, designed to contour to your body and provide excellent support for a restful night’s sleep.',
 'mattress,memory foam,bedding,sleep',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(237, 'Contemporary Table Lamp', 50.00, 'Home & Kitchen', 'Lighting',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/table-lamp.jpg',
 4.5, 85,
 'Brighten your space with this contemporary table lamp, combining modern design and functionality, perfect for reading or creating a cozy atmosphere in any room.',
 'lamp,lighting,home decor,table lamp',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(238, 'Hand‑Woven Area Rug', 200.00, 'Home & Kitchen', 'Home Decor',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/rug.jpg',
 4.6, 110,
 'This hand‑woven area rug adds warmth and style to your home decor, featuring intricate designs that enhance any living space while providing comfort underfoot.',
 'rug,home decor,woven,area rug',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(239, 'Plastic Storage Boxes – Set of 4', 80.00, 'Home & Kitchen', 'Storage & Organization',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/storage-boxes.jpg',
 4.3, 55,
 'Keep your home organized with this set of 4 plastic storage boxes, perfect for decluttering any space and storing items securely while maintaining easy accessibility.',
 'storage,organization,plastic boxes,home',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(240, 'Eco‑Friendly Cleaning Supplies Kit', 100.00, 'Home & Kitchen', 'Cleaning Supplies',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/cleaning-supplies.jpg',
 4.8, 120,
 'This eco‑friendly cleaning supplies kit features sustainable products that effectively clean your home while being safe for the environment and your family.',
 'cleaning supplies,eco-friendly,home,kit',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(241, 'Foldable Electric Treadmill', 3500.00, 'Health & Fitness', 'Fitness Equipment',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/treadmill.jpg',
 4.7, 320,
 'This Foldable Electric Treadmill offers a convenient way to maintain fitness at home. With various speed settings and a compact design, it''s perfect for beginners and seasoned athletes.',
 'treadmill,fitness,exercise,home gym',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(242, 'Adjustable Dumbbell Set – 20kg', 600.00, 'Health & Fitness', 'Fitness Equipment',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/dumbbells.jpg',
 4.5, 260,
 'The Adjustable Dumbbell Set allows for a customizable weight training experience. With a total weight of 20 kg, it''s perfect for strength training and versatile enough for various workouts.',
 'dumbbells,weights,fitness,strength training',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(243, 'Whey Protein Powder – 2kg', 350.00, 'Health & Fitness', 'Sports Nutrition',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/protein-powder.jpg',
 4.6, 180,
 'This Whey Protein Powder provides an excellent source of protein for muscle recovery and growth. The 2kg package is ideal for athletes and fitness enthusiasts aiming for optimal nutrition.',
 'protein,nutrition,supplement,sports',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(244, 'Digital Blood Pressure Monitor', 220.00, 'Health & Fitness', 'Health Monitors',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/blood-pressure-monitor.jpg',
 4.8, 210,
 'Stay on top of your health with this Digital Blood Pressure Monitor. Easy to use and highly accurate, it helps you track your blood pressure at home with clear digital readings.',
 'blood pressure,monitor,health,medical',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(245, 'Compact First Aid Kit', 120.00, 'Health & Fitness', 'First Aid',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/first-aid-kit.jpg',
 4.9, 150,
 'This Compact First Aid Kit is essential for home, travel, or emergency situations. Packed with necessary supplies, it ensures you''re prepared for minor injuries and emergencies.',
 'first aid,kit,medical,emergency',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(246, 'Alcohol‑Based Hand Sanitizer – 500ml', 8.00, 'Health & Fitness', 'Personal Health',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/hand-sanitizer.jpg',
 4.5, 90,
 'Keep your hands clean and germ-free with this Alcohol‑Based Hand Sanitizer. The 500ml bottle is perfect for personal use at home or on the go, providing effective sanitization.',
 'hand sanitizer,personal health,hygiene,sanitizer',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(247, 'Workout Gloves – Pair', 30.00, 'Health & Fitness', 'Sports Gear & Accessories',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/gloves.jpg',
 4.4, 100,
 'Enhance your workout experience with these comfortable Workout Gloves. Designed to provide grip and protection, they are perfect for lifting weights or performing rigorous exercises.',
 'gloves,workout,sports,fitness',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(248, 'Infrared Digital Thermometer', 150.00, 'Health & Fitness', 'Health Monitors',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/thermometer.jpg',
 4.7, 120,
 'This Infrared Digital Thermometer allows for quick and accurate temperature readings. Perfect for home health monitoring, it provides fast results without physical contact.',
 'thermometer,digital,health,infrared',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(249, 'Non‑Slip Yoga Mat', 50.00, 'Health & Fitness', 'Yoga & Meditation Supplies',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/yoga-mat.jpg',
 4.6, 200,
 'The Non‑Slip Yoga Mat is designed for stability and comfort during yoga sessions. Its durable material ensures a safe practice, making it ideal for all skill levels and styles.',
 'yoga mat,fitness,yoga,exercise',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(250, 'Adjustable Knee Pads', 40.00, 'Health & Fitness', 'Sports Gear & Accessories',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/knee-pads.jpg',
 4.3, 70,
 'These Adjustable Knee Pads provide comfort and support during workouts. Perfect for protecting your knees during intense activities, they are essential for athletes and fitness lovers.',
 'knee pads,sports,gear,fitness',
 (SELECT id FROM categories WHERE name = 'Health & Fitness')),
(251, 'Sports Socks (5 pack)', 12.00, 'Fashion & Apparel', 'Accessories',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/socks.jpg',
 4.2, 60,
 'Comfortable and breathable sports socks available in a pack of 5, perfect for workouts or daily wear.',
 'socks,sports,footwear',
 (SELECT id FROM categories WHERE name = 'Fashion & Apparel')),
(252, 'E‑book Reader', 550.00, 'Electronics & Gadets', 'Wearables',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/ebook-reader.jpg',
 4.6, 120,
 'Lightweight e‑book reader with high‑resolution display, long battery life, and adjustable brightness for comfortable reading.',
 'ebook,reader,digital,books',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadgets')),
(253, 'USB Flash Drive 128GB', 15.00, 'Electronics & Gadets', 'Storage',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/usb-drive.jpg',
 4.4, 90,
 'Portable and fast 128GB USB flash drive for convenient storage and transfer of files, photos, and videos.',
 'usb,storage,flash drive',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadgets')),
(254, 'Ceramic Mug Set', 25.00, 'Home & Kitchen', 'Dinnerware',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/mug.jpg',
 4.5, 110,
 'Beautiful ceramic mug set ideal for coffee or tea. Durable, microwave‑safe, and perfect for daily use.',
 'mug,ceramic,kitchen',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(255, 'Rice Cooker 1.8L', 320.00, 'Home & Kitchen', 'Kitchen Appliances',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/rice-cooker.jpg',
 4.3, 95,
 '1.8L rice cooker with automatic shutoff feature, designed for perfect and effortless cooking every time.',
 'rice cooker,kitchen,appliance',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(256, 'Floor Cleaning Mop', 18.00, 'Home & Kitchen', 'Cleaning Supplies',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/mop.jpg',
 4.1, 70,
 'Durable floor cleaning mop with high‑absorption microfiber head, ideal for daily home cleaning.',
 'mop,cleaning,floor',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(257, 'Smartwatch', 450.00, 'Electronics & Gadets', 'Wearables',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/smartwatch.jpg',
 4.5, 180,
 'Feature‑rich smartwatch with heart‑rate monitoring, step tracking, and smart notifications.',
 'smartwatch,wearable,fitness',
 (SELECT id FROM categories WHERE name = 'Electronics & Gadgets')),
(258, 'Electric Toothbrush', 35.00, 'Beauty & Personal Care', 'Oral Care',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/toothbrush.jpg',
 4.4, 150,
 'Rechargeable electric toothbrush providing deep cleaning, multiple brushing modes, and long battery life.',
 'toothbrush,electric,oral care',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(259, 'Air Fryer (3L)', 600.00, 'Home & Kitchen', 'Kitchen Appliances',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/air-fryer.jpg',
 4.7, 240,
 'Healthy 3L air fryer designed for oil‑free cooking. Perfect for fries, chicken, snacks, and more.',
 'air fryer,appliance,kitchen',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(260, 'Stainless Steel Bottle', 12.00, 'Home & Kitchen', 'Drinkware',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/water-bottle.jpg',
 4.6, 130,
 'Durable stainless steel bottle designed to keep beverages hot or cold for hours. Perfect for travel or daily use.',
 'water bottle,steel,drinkware',
 (SELECT id FROM categories WHERE name = 'Home & Kitchen')),
(261, 'Nike Air Max 90', 1299.99, 'Shoes', 'Footwear',
 'https://tse2.mm.bing.net/th/id/OIP.i1uZZ8MDNKEyI_-98OmsSgHaFP?rs=1&pid=ImgDetMain&o=7&rm=3',
 4.8, 320,
 'Classic Nike Air Max 90 with responsive cushioning and stylish profile.',
 'nike,air max,sneakers',
 (SELECT id FROM categories WHERE name = 'Shoes')),
(262, 'Adidas Ultraboost 22', 1499.99, 'Shoes', 'Footwear',
 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/28620cc17458499e90faadb700ec8c75_9366/Ultraboost_22_Shoes_Black_GX3060_01_standard.jpg',
 4.7, 290,
 'Designed for comfort and performance with Boost cushioning.',
 'adidas,ultraboost,running',
 (SELECT id FROM categories WHERE name = 'Shoes')),
(263, 'Puma RS-X Reinvention', 899.99, 'Shoes', 'Footwear',
 'https://tse2.mm.bing.net/th/id/OIP.KATeaFeZU-ZbOIyUcPPP2wHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
 4.5, 180,
 'Chunky retro design with premium cushioning and street style.',
 'puma,rs-x,sneakers',
 (SELECT id FROM categories WHERE name = 'Shoes')),
(264, 'Skechers GoWalk 6', 599.99, 'Shoes', 'Footwear',
 'https://www.skechers.in/on/demandware.static/-/Sites-skechers_india/default/dwb14bb1e2/images/large/216275-1.jpg',
 4.4, 140,
 'Lightweight slip-on walking shoes with high rebound cushioning.',
 'skechers,walking,comfort',
 (SELECT id FROM categories WHERE name = 'Shoes')),
(265, 'New Balance 574 Classic', 699.99, 'Shoes', 'Footwear',
 'https://tse4.mm.bing.net/th/id/OIP.VemowAJYzCNQGMBT40ygawHaFP?rs=1&pid=ImgDetMain&o=7&rm=3',
 4.6, 210,
 'Timeless comfort, durable cushioning, and iconic NB retro style.',
 'new balance,574,sneakers',
 (SELECT id FROM categories WHERE name = 'Shoes')),
(266, 'Reebok Classic Leather', 649.99, 'Shoes', 'Footwear',
 'https://reebok.bynder.com/transform/d34b4388-b01e-485a-b600-8d28e2d7f385/100008494_FLT_eCom-tif?width:1200,height:630,format=png',
 4.3, 160,
 'Premium leather sneakers with a vintage athletic look.',
 'reebok,classic,leather',
 (SELECT id FROM categories WHERE name = 'Shoes')),
(267, 'Air Jordan 1 Low', 1599.99, 'Shoes', 'Footwear',
 'https://sneakernews.com/wp-content/uploads/2019/03/air-jordan-1-low-nike-sb-9.jpg?w=1140',
 4.9, 540,
 'Iconic Jordan design upgraded with low-cut versatility.',
 'jordan,air jordan 1,basketball',
 (SELECT id FROM categories WHERE name = 'Shoes')),
(268, 'Woodland Leather Trekking Boots', 499.99, 'Shoes', 'Footwear',
 'https://www.aishcart.in/4218-thickbox_default/woodland-wayfarer-grey-hiking-boots.jpg',
 4.4, 130,
 'Rugged boots designed for outdoor durability and comfort.',
 'woodland,boots,trekking',
 (SELECT id FROM categories WHERE name = 'Shoes')),
(269, 'Red Tape Sports Running Shoe', 269.99, 'Shoes', 'Footwear',
 'https://m.media-amazon.com/images/I/71f03HwmuWL._UL1500_.jpg',
 4.1, 90,
 'Breathable and lightweight shoes ideal for daily fitness.',
 'red tape,running,sports',
 (SELECT id FROM categories WHERE name = 'Shoes')),
(270, 'Bata Comfit Sneakers', 199.99, 'Shoes', 'Footwear',
 'https://shopon.pk/images/detailed/178/883-4103-_1.jpg',
 4.0, 70,
 'Soft cushioning with premium comfort for everyday wear.',
 'bata,comfit,casual',
 (SELECT id FROM categories WHERE name = 'Shoes'));


 (201, 'Hydrating Facial Moisturizer', 20.00, 'Beauty & Personal Care', 'Skincare',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/moisturizer.jpg',
 4.7, 120,
 'This Hydrating Facial Moisturizer is expertly formulated to deeply nourish and hydrate your skin, providing lasting moisture and a smooth, radiant complexion. Ideal for daily use.',
 'moisturizer,hydration,skincare,beauty',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(202, 'Anti-Dandruff Shampoo', 15.00, 'Beauty & Personal Care', 'Hair Care',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/shampoo.jpg',
 4.5, 85,
 'Our Anti-Dandruff Shampoo effectively combats flakes and itchiness, promoting a healthy scalp. Infused with soothing ingredients, it cleanses your hair without stripping natural oils.',
 'shampoo,hair care,anti-dandruff,cleanse',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),
(203, 'Matte Liquid Foundation', 22.00, 'Beauty & Personal Care', 'Makeup',
 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/foundation.jpg',
 4.6, 98,
 'This Matte Liquid Foundation offers a flawless finish with long-lasting wear. Lightweight and breathable, it blends seamlessly into the skin, providing even coverage and a natural look.',
 'foundation,makeup,beauty,matte',
 (SELECT id FROM categories WHERE name = 'Beauty & Personal Care')),

UPDATE storeproducts SET image = 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/moisturizer.jpg' WHERE id = 201;
UPDATE storeproducts SET image = 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/shampoo.jpg' WHERE id = 202;
UPDATE storeproducts SET image = 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/foundation.jpg' WHERE id = 203;

UPDATE storeproducts SET image = 'http://localhost:8098/product-images/201.jpg' WHERE id = 201;
UPDATE storeproducts SET image = 'http://localhost:8098/product-images/202.jpg' WHERE id = 202;
UPDATE storeproducts SET image = 'http://localhost:8098/product-images/203.jpg' WHERE id = 203;


EXEC sp_rename 'storeproducts.new_id', 'id', 'COLUMN';



 UPDATE storeproducts
SET image = 'https://www.milton.in/cdn/shop/files/51ylXAfgrpL._SL1500.jpg?v=1740550419&width=1946'
WHERE id = 260;

-- 1️⃣ Add a temporary IDENTITY column
ALTER TABLE storeproducts
ADD new_id INT IDENTITY(1,1);

-- 2️⃣ Drop the old primary key constraint on 'id'
ALTER TABLE storeproducts
DROP CONSTRAINT PK_storeproducts; -- Replace with your actual PK name if different

-- 3️⃣ Drop the old 'id' column
ALTER TABLE storeproducts
DROP COLUMN id;

-- 4️⃣ Rename the new_id column to 'id'
EXEC sp_rename 'storeproducts.new_id', 'id', 'COLUMN';

-- 5️⃣ Add primary key constraint on the new 'id'
ALTER TABLE storeproducts
ADD CONSTRAINT PK_storeproducts PRIMARY KEY (id);

CREATE TABLE storeproducts_new (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NULL,
    subcategory VARCHAR(255) NULL,
    image VARCHAR(1000) NULL,
    rating_stars DECIMAL(3,1) NULL,
    rating_count INT NULL,
    description VARCHAR(MAX) NULL,
    keywords VARCHAR(MAX) NULL,
    category_id INT NULL,
    stock INT NOT NULL DEFAULT 50,
    CONSTRAINT FK_storeproducts_new_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

SET IDENTITY_INSERT storeproducts_new ON;

INSERT INTO storeproducts_new (id, name, price, category, subcategory, image, rating_stars, rating_count, description, keywords, category_id, stock)
SELECT id, name, price, category, subcategory, image, rating_stars, rating_count, description, keywords, category_id, stock
FROM storeproducts;

SET IDENTITY_INSERT storeproducts_new OFF;

select * from storeproducts

ALTER TABLE wishlist DROP CONSTRAINT FK_wishlist_product;
ALTER TABLE order_items DROP CONSTRAINT FK_order_items_storeproduct;
ALTER TABLE cart DROP CONSTRAINT FK_cart_storeproduct;

-- Optional: rename old table for backup
EXEC sp_rename 'storeproducts', 'storeproducts_old';

-- Rename new table
EXEC sp_rename 'storeproducts_new', 'storeproducts';


COMMIT TRANSACTION;
SELECT id, name FROM storeproducts ORDER BY id desc;


SELECT id, name, price, category, category_id FROM storeproducts ORDER BY id;
SELECT * FROM categories;



CREATE TABLE images (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255),
    type NVARCHAR(100),
    data VARBINARY(MAX)
);
SELECT * FROM images;
EXEC sp_help 'images';


-- Notifications table

SELECT name 
FROM sys.default_constraints 
WHERE parent_object_id = OBJECT_ID('orders')
AND parent_column_id = COLUMNPROPERTY(parent_object_id, 'status', 'ColumnId');

ALTER TABLE orders DROP CONSTRAINT DF__orders__status__30C33EC3;

-- Update orders table to support new statuses
ALTER TABLE orders 
ADD CONSTRAINT DF_orders_status_default 
DEFAULT 'PLACED' FOR status;


-- Add notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    sender_username VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
EXEC sp_rename 'notifications.sender_role', 'sender_username', 'COLUMN';
-- Add user_permissions table to manage who can do what
CREATE TABLE user_permissions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    permission_type VARCHAR(50) NOT NULL,
    allowed_step VARCHAR(50),
    can_update_any BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE()
);
ALTER TABLE notifications ADD status VARCHAR(64);

select * from notifications
-- Insert sample permissions
INSERT INTO user_permissions (username, permission_type, allowed_step, can_update_any) VALUES
-- Admins
('administrator', 'ADMIN', NULL, 1),

-- Warehouse users
('warehouse', 'WAREHOUSE', 'PLACED', 0),

-- Distributor users
('distributor', 'DISTRIBUTOR', 'PROCESSING', 0),

-- Agent users
('agent', 'AGENT', 'SHIPPED', 0),

-- Courier users
('courier', 'COURIER', 'OUT_FOR_DELIVERY', 0);

select * from users



-- Check permissions
SELECT * FROM user_permissions;

-- Should show:
-- administrator | ADMIN      | NULL         | 1
-- warehouse     | WAREHOUSE  | PLACED       | 0
-- distributor   | DISTRIBUTOR| PROCESSING   | 0
-- agent         | AGENT      | SHIPPED      | 0
-- courier       | COURIER    | OUT_FOR_DELIVERY | 0

-- Check orders exist
SELECT COUNT(*) FROM orders;
-- Should be > 0

-- Check order details
SELECT o.id, o.user_id, u.username, o.status, o.total_amount
FROM orders o
JOIN users u ON o.user_id = u.id;

SELECT * FROM user_permissions WHERE username = 'warehouse';




-- ========================================
-- STEP 1: CHECK CURRENT STATE
-- ========================================

-- Check if user_permissions table exists and has data
SELECT * FROM user_permissions;

-- Check if users exist
SELECT id, username, role FROM users 
WHERE username IN ('administrator', 'warehouse', 'distributor', 'agent', 'courier');

-- Check orders
SELECT 
    o.id AS order_id, 
    o.user_id, 
    u.username AS customer_username,
    o.status, 
    o.total_amount, 
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- Check notifications
SELECT 
    n.id,
    n.order_id,
    n.sender_username,
    n.message,
    n.status,
    n.created_at
FROM notifications n
ORDER BY n.created_at DESC;

-- ========================================
-- STEP 2: ENSURE PERMISSIONS ARE SET
-- ========================================

-- Delete existing permissions (if any conflicts)
DELETE FROM user_permissions 
WHERE username IN ('administrator', 'warehouse', 'distributor', 'agent', 'courier');

-- Insert fresh permissions
INSERT INTO user_permissions (username, permission_type, allowed_step, can_update_any) VALUES
('administrator', 'ADMIN', NULL, 1),
('warehouse', 'WAREHOUSE', 'PLACED', 0),
('distributor', 'DISTRIBUTOR', 'PROCESSING', 0),
('agent', 'AGENT', 'SHIPPED', 0),
('courier', 'COURIER', 'OUT_FOR_DELIVERY', 0);

-- Verify permissions inserted correctly
SELECT 
    username,
    permission_type,
    allowed_step,
    can_update_any,
    CASE 
        WHEN can_update_any = 1 THEN 'Can update ANY step'
        ELSE 'Can update only: ' + ISNULL(allowed_step, 'NONE')
    END AS permission_description
FROM user_permissions
ORDER BY 
    CASE permission_type
        WHEN 'ADMIN' THEN 1
        WHEN 'WAREHOUSE' THEN 2
        WHEN 'DISTRIBUTOR' THEN 3
        WHEN 'AGENT' THEN 4
        WHEN 'COURIER' THEN 5
        ELSE 6
    END;

-- ========================================
-- STEP 3: ENSURE USERS EXIST
-- ========================================

-- Check if these users exist in users table
SELECT username FROM users 
WHERE username IN ('administrator', 'warehouse', 'distributor', 'agent', 'courier');

-- If users DON'T exist, create them:
-- (Only run if users are missing)

-- Create admin user
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'administrator')
BEGIN
    INSERT INTO users (username, password, role, team_id, authorized, team_name) 
    VALUES ('administrator', 'admin123', 'ADMIN', NULL, 1, NULL);
END

-- Create warehouse user
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'warehouse')
BEGIN
    INSERT INTO users (username, password, role, team_id, authorized, team_name) 
    VALUES ('warehouse', 'warehouse123', 'EMPLOYEE', NULL, 1, 'Warehouse Team');
END

-- Create distributor user
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'distributor')
BEGIN
    INSERT INTO users (username, password, role, team_id, authorized, team_name) 
    VALUES ('distributor', 'distributor123', 'EMPLOYEE', NULL, 1, 'Distribution Team');
END

-- Create agent user
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'agent')
BEGIN
    INSERT INTO users (username, password, role, team_id, authorized, team_name) 
    VALUES ('agent', 'agent123', 'EMPLOYEE', NULL, 1, 'Agent Team');
END
delete from notifications

-- Create courier user
IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'courier')
BEGIN
    INSERT INTO users (username, password, role, team_id, authorized, team_name) 
    VALUES ('courier', 'courier123', 'EMPLOYEE', NULL, 1, 'Courier Team');
END

-- ========================================
-- STEP 4: CREATE TEST ORDER (if needed)
-- ========================================

-- Check if you have any orders
SELECT COUNT(*) AS order_count FROM orders;

-- If no orders exist, create a test order
-- First, get a customer user_id
DECLARE @customerId INT;
SELECT TOP 1 @customerId = id FROM users 
WHERE username NOT IN ('administrator', 'warehouse', 'distributor', 'agent', 'courier');

-- If customer exists, create test order
IF @customerId IS NOT NULL
BEGIN
    DECLARE @orderId INT;
    
    INSERT INTO orders (user_id, total_amount, status, created_at) 
    VALUES (@customerId, 2500.00, 'PLACED', GETDATE());
    
    SET @orderId = SCOPE_IDENTITY();
    
    -- Add order items (assuming you have products)
    INSERT INTO order_items (order_id, product_id, qty, price)
    SELECT TOP 2 @orderId, id, 2, price
    FROM storeproducts;
    
    -- Create initial notification
    INSERT INTO notifications (order_id, sender_username, message, status, created_at)
    VALUES (@orderId, 
            (SELECT username FROM users WHERE id = @customerId), 
            'New order placed with test items', 
            'PLACED', 
            GETDATE());
    
    SELECT 'Test order created with ID: ' + CAST(@orderId AS VARCHAR);
END
ELSE
BEGIN
    SELECT 'No customer found to create test order';
END

-- ========================================
-- STEP 5: VERIFY EVERYTHING
-- ========================================

-- Final verification query
SELECT 
    'User Permissions' AS [Check],
    COUNT(*) AS [Count],
    STRING_AGG(username, ', ') AS [Users]
FROM user_permissions
UNION ALL
SELECT 
    'Orders',
    COUNT(*),
    CAST(COUNT(*) AS VARCHAR)
FROM orders
UNION ALL
SELECT 
    'Notifications',
    COUNT(*),
    CAST(COUNT(*) AS VARCHAR)
FROM notifications;

-- Show which users can see what
SELECT 
    up.username,
    up.permission_type,
    CASE 
        WHEN up.can_update_any = 1 THEN 'ALL ORDERS'
        ELSE 'ALL ORDERS (read only except at step: ' + ISNULL(up.allowed_step, 'NONE') + ')'
    END AS [What They See],
    CASE 
        WHEN up.can_update_any = 1 THEN 'ANY STEP'
        ELSE up.allowed_step
    END AS [Can Update]
FROM user_permissions up
ORDER BY 
    CASE up.permission_type
        WHEN 'ADMIN' THEN 1
        WHEN 'WAREHOUSE' THEN 2
        WHEN 'DISTRIBUTOR' THEN 3
        WHEN 'AGENT' THEN 4
        WHEN 'COURIER' THEN 5
    END;
	select * from orders
	delete from orders