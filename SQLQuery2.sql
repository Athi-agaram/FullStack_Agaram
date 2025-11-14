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
