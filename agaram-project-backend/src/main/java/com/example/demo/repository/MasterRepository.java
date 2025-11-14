//package com.example.demo.repository;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//import java.util.Map;
//
//@Repository
//public class MasterRepository {
//
//    @Autowired
//    private JdbcTemplate jdbcTemplate;
//
//    // ==================== Employees ====================
//    public List<Map<String, Object>> getEmployees(String teamName) {
//        String sql = """
//            SELECT e.id AS id,
//                   e.name AS name,
//                   e.designation AS designation,
//                   e.salary AS salary,
//                   e.team_id AS team_id,
//                   t.team_name AS team_name
//            FROM employees e
//            LEFT JOIN teams t ON e.team_id = t.id
//        """;
//
//        if (teamName != null && !teamName.isEmpty()) {
//            sql += " WHERE t.team_name = ?";
//            return jdbcTemplate.queryForList(sql, teamName);
//        }
//        return jdbcTemplate.queryForList(sql);
//    }
//
//    public String addEmployee(Map<String, Object> body) {
//        String sql = """
//            INSERT INTO employees (name, designation, salary, team_id)
//            VALUES (?, ?, ?, (SELECT id FROM teams WHERE team_name = ?))
//        """;
//        jdbcTemplate.update(sql,
//                body.get("name"),
//                body.get("designation"),
//                body.get("salary"),
//                body.get("team_name"));
//        return "Employee added successfully";
//    }
//
//    public String deleteEmployee(int id) {
//        jdbcTemplate.update("DELETE FROM employees WHERE id = ?", id);
//        return "Employee deleted successfully";
//    }
//
//    // ==================== Products ====================
//    public List<Map<String, Object>> getProducts(String teamName) {
//        String sql = """
//            SELECT p.id AS id,
//                   p.name AS name,
//                   p.quantity AS quantity,
//                   p.price AS price,
//                   p.progress AS progress,
//                   t.team_name AS team_name,
//                   p.employee_id AS employee_id,
//                   p.sale_month AS sale_month
//            FROM products p
//            LEFT JOIN teams t ON p.team_id = t.id
//        """;
//
//        if (teamName != null && !teamName.isEmpty()) {
//            sql += " WHERE t.team_name = ?";
//            return jdbcTemplate.queryForList(sql, teamName);
//        }
//        return jdbcTemplate.queryForList(sql);
//    }
//
//    public List<Map<String, Object>> addProduct(Map<String, Object> body) {
//        String sql = """
//            INSERT INTO products (name, quantity, price, progress, team_id, employee_id, sale_month)
//            VALUES (?, ?, ?, ?, (SELECT id FROM teams WHERE team_name = ?), ?, ?)
//        """;
//        jdbcTemplate.update(
//                sql,
//                body.get("name"),
//                body.get("quantity"),
//                body.get("price"),
//                body.getOrDefault("progress", "In Progress"),
//                body.get("team_name"),
//                body.get("employee_id"),
//                body.getOrDefault("sale_month", null)
//        );
//        return getProducts(null);
//    }
//
//    public List<Map<String, Object>> updateProduct(int id, Map<String, Object> body) {
//        String sql = """
//            UPDATE products
//            SET name = ?,
//                quantity = ?,
//                price = ?,
//                progress = ?,
//                team_id = (SELECT id FROM teams WHERE team_name = ?),
//                employee_id = ?,
//                sale_month = ?
//            WHERE id = ?
//        """;
//        jdbcTemplate.update(
//                sql,
//                body.get("name"),
//                body.get("quantity"),
//                body.get("price"),
//                body.getOrDefault("progress", "In Progress"),
//                body.get("team_name"),
//                body.get("employee_id"),
//                body.getOrDefault("sale_month", null),
//                id
//        );
//        return getProducts(null);
//    }
//
//    public String deleteProduct(int id) {
//        jdbcTemplate.update("DELETE FROM products WHERE id = ?", id);
//        return "Product deleted successfully";
//    }
//
//    // ==================== Revenue ====================
//    public List<Map<String, Object>> getRevenue(String teamName) {
//        String sql = """
//            SELECT t.team_name AS team_name,
//                   SUM(p.price * p.quantity) AS total_revenue
//            FROM products p
//            LEFT JOIN teams t ON p.team_id = t.id
//        """;
//
//        if (teamName != null && !teamName.isEmpty()) {
//            sql += " WHERE t.team_name = ? GROUP BY t.team_name";
//            return jdbcTemplate.queryForList(sql, teamName);
//        }
//
//        sql += " GROUP BY t.team_name";
//        return jdbcTemplate.queryForList(sql);
//    }
//
//    // ==================== Teams ====================
//    public List<Map<String, Object>> getTeams() {
//        String sql = "SELECT id, team_name FROM teams";
//        return jdbcTemplate.queryForList(sql);
//    }
//
//}




package com.example.demo.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public class MasterRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ==================== Employees ====================
    public List<Map<String, Object>> getEmployees(String teamName) {
        String sql = """
            SELECT e.id AS id,
                   e.name AS name,
                   e.designation AS designation,
                   e.salary AS salary,
                   e.team_id AS team_id,
                   t.team_name AS team_name
            FROM employees e
            LEFT JOIN teams t ON e.team_id = t.id
        """;

        if (teamName != null && !teamName.isEmpty()) {
            sql += " WHERE t.team_name = ?";
            return jdbcTemplate.queryForList(sql, teamName);
        }
        return jdbcTemplate.queryForList(sql);
    }

    public String addEmployee(Map<String, Object> body) {
        String sql = """
            INSERT INTO employees (name, designation, salary, team_id)
            VALUES (?, ?, ?, (SELECT id FROM teams WHERE team_name = ?))
        """;
        jdbcTemplate.update(sql,
                body.get("name"),
                body.get("designation"),
                body.get("salary"),
                body.get("team_name"));
        return "Employee added successfully";
    }

    public String deleteEmployee(int id) {
        jdbcTemplate.update("DELETE FROM employees WHERE id = ?", id);
        return "Employee deleted successfully";
    }

    // ==================== Products ====================
    public List<Map<String, Object>> getProducts(String teamName) {
        String sql = """
            SELECT p.id AS id,
                   p.name AS name,
                   p.quantity AS quantity,
                   p.price AS price,
                   p.progress AS progress,
                   t.team_name AS team_name,
                   p.employee_id AS employee_id,
                   p.sale_month AS sale_month
            FROM products p
            LEFT JOIN teams t ON p.team_id = t.id
        """;

        if (teamName != null && !teamName.isEmpty()) {
            sql += " WHERE t.team_name = ?";
            return jdbcTemplate.queryForList(sql, teamName);
        }
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> addProduct(Map<String, Object> body) {
        String sql = """
            INSERT INTO products (name, quantity, price, progress, team_id, employee_id, sale_month)
            VALUES (?, ?, ?, ?, (SELECT id FROM teams WHERE team_name = ?), ?, ?)
        """;
        jdbcTemplate.update(
                sql,
                body.get("name"),
                body.get("quantity"),
                body.get("price"),
                body.getOrDefault("progress", "In Progress"),
                body.get("team_name"),
                body.get("employee_id"),
                body.getOrDefault("sale_month", null)
        );
        return getProducts(null);
    }

    public List<Map<String, Object>> updateProduct(int id, Map<String, Object> body) {
        String sql = """
            UPDATE products
            SET name = ?,
                quantity = ?,
                price = ?,
                progress = ?,
                team_id = (SELECT id FROM teams WHERE team_name = ?),
                employee_id = ?,
                sale_month = ?
            WHERE id = ?
        """;
        jdbcTemplate.update(
                sql,
                body.get("name"),
                body.get("quantity"),
                body.get("price"),
                body.getOrDefault("progress", "In Progress"),
                body.get("team_name"),
                body.get("employee_id"),
                body.getOrDefault("sale_month", null),
                id
        );
        return getProducts(null);
    }

    public String deleteProduct(int id) {
        jdbcTemplate.update("DELETE FROM products WHERE id = ?", id);
        return "Product deleted successfully";
    }

 // ==================== Revenue (Basic) ====================
    public List<Map<String, Object>> getRevenue(String teamName) {
        String sql = """
            SELECT 
                t.team_name AS team_name,
                SUM(p.price * p.quantity) AS total_revenue
            FROM products p
            LEFT JOIN teams t ON p.team_id = t.id
        """;

        if (teamName != null && !teamName.isEmpty()) {
            sql += " WHERE t.team_name = ? GROUP BY t.team_name";
            return jdbcTemplate.queryForList(sql, teamName);
        }

        sql += " GROUP BY t.team_name";
        return jdbcTemplate.queryForList(sql);
    }


    // ==================== Revenue Summary ====================
    public Map<String, Object> getRevenueSummary() {
        String sql = """
            SELECT
                (SELECT SUM(price * quantity) FROM products) AS total_revenue,
                (SELECT AVG(price * quantity) FROM products) AS avg_revenue,
                (SELECT COUNT(*) FROM products) AS total_products,
                (SELECT COUNT(*) FROM teams) AS total_teams
        """;

        return jdbcTemplate.queryForMap(sql);
    }


    // ==================== Team-Wise Revenue ====================
    public List<Map<String, Object>> getTeamRevenue() {
        String sql = """
            SELECT 
                t.team_name,
                SUM(p.price * p.quantity) AS total_revenue
            FROM products p
            LEFT JOIN teams t ON p.team_id = t.id
            GROUP BY t.team_name
            ORDER BY total_revenue DESC
        """;

        return jdbcTemplate.queryForList(sql);
    }


    // ==================== Month-Wise Revenue ====================
    public List<Map<String, Object>> getMonthlyRevenue() {
        String sql = """
            SELECT 
                sale_month,
                SUM(price * quantity) AS total_revenue
            FROM products
            WHERE sale_month IS NOT NULL
            GROUP BY sale_month
            ORDER BY 
                CASE sale_month
                    WHEN 'Jan' THEN 1
                    WHEN 'Feb' THEN 2
                    WHEN 'Mar' THEN 3
                    WHEN 'Apr' THEN 4
                    WHEN 'May' THEN 5
                    WHEN 'Jun' THEN 6
                    WHEN 'Jul' THEN 7
                    WHEN 'Aug' THEN 8
                    WHEN 'Sep' THEN 9
                    WHEN 'Oct' THEN 10
                    WHEN 'Nov' THEN 11
                    WHEN 'Dec' THEN 12
                END
        """;

        return jdbcTemplate.queryForList(sql);
    }


    // ==================== Employee-Wise Revenue ====================
    public List<Map<String, Object>> getEmployeeRevenue() {
        String sql = """
            SELECT 
                e.name AS employee_name,
                SUM(p.price * p.quantity) AS total_revenue
            FROM products p
            LEFT JOIN employees e ON p.employee_id = e.id
            GROUP BY e.name
            ORDER BY total_revenue DESC
        """;

        return jdbcTemplate.queryForList(sql);
    }
 // ==================== Revenue Dashboard (Full) ====================
    public List<Map<String, Object>> getRevenueDashboard() {
        String sql = """
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
            ORDER BY team_name, month_idx
        """;

        return jdbcTemplate.queryForList(sql);
    }


    // ==================== Teams ====================
    public List<Map<String, Object>> getTeams() {
        return jdbcTemplate.queryForList("SELECT id, team_name FROM teams");
    }
}

