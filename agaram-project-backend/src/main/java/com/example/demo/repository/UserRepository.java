//package com.example.demo.repository;
//
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Repository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.dao.DataIntegrityViolationException;
//
//import java.util.List;
//import java.util.Map;
//
//@Repository
//public class UserRepository {
//
//    @Autowired
//    private JdbcTemplate jdbcTemplate;
//
//    // ========================
//    // ✅ Save new user
//    // ========================
//    public int saveNewUser(String username, String password) {
//        username = username.replace("'", "''");
//        password = password.replace("'", "''");
//
//        List<Map<String, Object>> existing = jdbcTemplate.queryForList(
//            "SELECT * FROM users WHERE username = ?", username
//        );
//        if (!existing.isEmpty()) return 0;
//
//        String sql = "INSERT INTO users (username, password, role, authorized) VALUES (?, ?, 'EMPLOYEE', 0)";
//        return jdbcTemplate.update(sql, username, password);
//    }
//
//    // ========================
//    // ✅ Update user
//    // ========================
//    public int updateUser(int id, String role, Integer teamId, Boolean authorized) {
//        StringBuilder sql = new StringBuilder("UPDATE users SET ");
//        boolean first = true;
//
//        if (role != null) {
//            sql.append("role = '").append(role).append("'");
//            first = false;
//        }
//        if (teamId != null) {
//            if (!first) sql.append(", ");
//            sql.append("team_id = ").append(teamId);
//            first = false;
//        }
//        if (authorized != null) {
//            if (!first) sql.append(", ");
//            sql.append("authorized = ").append(authorized ? 1 : 0);
//        }
//
//        sql.append(" WHERE id = ").append(id);
//        return jdbcTemplate.update(sql.toString());
//    }
//
//    // ========================
//    // ✅ Delete user safely (handles foreign key issue)
//    // ========================
//    public int deleteUser(int id) {
//        try {
//            // First delete related records in product_sales
//            String deleteSales = "DELETE FROM product_sales WHERE employee_id = ?";
//            jdbcTemplate.update(deleteSales, id);
//
//            // Then delete the user
//            String deleteUser = "DELETE FROM users WHERE id = ?";
//            return jdbcTemplate.update(deleteUser, id);
//        } catch (DataIntegrityViolationException e) {
//            // If still blocked by another FK constraint, throw clear message
//            throw new RuntimeException("Cannot delete user — user has related records in other tables.");
//        } catch (Exception e) {
//            throw new RuntimeException("Unexpected error while deleting user: " + e.getMessage());
//        }
//    }
//
//    // ========================
//    // ✅ Find or create team by name
//    // ========================
//    public Integer findOrCreateTeamId(String teamName) {
//        if (teamName == null || teamName.trim().isEmpty()) return null;
//        teamName = teamName.replace("'", "''");
//
//        List<Map<String, Object>> existing = jdbcTemplate.queryForList(
//            "SELECT id FROM teams WHERE team_name = ?", teamName
//        );
//        if (!existing.isEmpty()) return (Integer) existing.get(0).get("id");
//
//        jdbcTemplate.update("INSERT INTO teams (team_name) VALUES (?)", teamName);
//
//        return jdbcTemplate.queryForObject(
//            "SELECT id FROM teams WHERE team_name = ?", Integer.class, teamName
//        );
//    }
//
//    // ========================
//    // ✅ Find user by ID
//    // ========================
//    public Map<String, Object> findById(int id) {
//        String sql = """
//            SELECT u.id, u.username, u.password, u.role, u.team_id, u.authorized,
//                   COALESCE(t.team_name,'') AS team_name
//            FROM users u
//            LEFT JOIN teams t ON u.team_id = t.id
//            WHERE u.id = ?
//        """;
//        List<Map<String,Object>> result = jdbcTemplate.queryForList(sql, id);
//        return result.isEmpty() ? null : result.get(0);
//    }
//
//
//    // ========================
//    // ✅ Find user by username
//    // ========================
//    public Map<String, Object> findByUsername(String username) {
//        String sql = """
//            SELECT u.id, u.username, u.password, u.role, u.team_id, u.authorized,
//                   COALESCE(t.team_name,'') AS team_name
//            FROM users u
//            LEFT JOIN teams t ON u.team_id = t.id
//            WHERE u.username = ?
//        """;
//        List<Map<String,Object>> users = jdbcTemplate.queryForList(sql, username);
//        return users.isEmpty() ? null : users.get(0);
//    }
//
//    // ========================
//    // ✅ Get all users
//    // ========================
//    public List<Map<String, Object>> findAllUsers() {
//        String sql = """
//            SELECT u.id, u.username, u.role, u.team_id, u.authorized,
//                   COALESCE(t.team_name,'') AS team_name
//            FROM users u
//            LEFT JOIN teams t ON u.team_id = t.id
//        """;
//        return jdbcTemplate.queryForList(sql);
//    }
//
//    // ========================
//    // ✅ Get users by team name
//    // ========================
//    public List<Map<String, Object>> getUsersByTeamName(String teamName) {
//        String sql = """
//            SELECT u.id, u.username, u.role, u.team_id, u.authorized,
//                   t.team_name
//            FROM users u
//            JOIN teams t ON u.team_id = t.id
//            WHERE t.team_name = ?
//        """;
//        return jdbcTemplate.queryForList(sql, teamName);
//    }
//
//    // ========================
//    // ✅ Get users in same team
//    // ========================
//    public List<Map<String,Object>> findUsersInSameTeam(String username) {
//        String sql = """
//            SELECT u.id, u.username, u.role, u.team_id, u.authorized,
//                   COALESCE(t.team_name,'') AS team_name
//            FROM users u
//            JOIN teams t ON u.team_id = t.id
//            WHERE u.team_id = (SELECT team_id FROM users WHERE username = ?)
//        """;
//        return jdbcTemplate.queryForList(sql, username);
//    }
//
//    // ========================
//    // ✅ Check if user is in manager's team
//    // ========================
//    public boolean isUserInManagerTeam(int managerId, int userId) {
//        String sql = """
//            SELECT COUNT(*) 
//            FROM users u
//            JOIN users m ON m.id = ?
//            WHERE u.team_id = m.team_id AND u.id = ?
//        """;
//        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, managerId, userId);
//        return count != null && count > 0;
//    }
//
//    // ========================
//    // ✅ Get all teams
//    // ========================
//    public List<Map<String,Object>> getAllTeams() {
//        String sql = "SELECT id, team_name FROM teams";
//        return jdbcTemplate.queryForList(sql);
//    }
// // ------------------ UPDATE PROFILE ------------------
//    public int updateUserProfile(int id, String username, Integer teamId, String role) {
//        StringBuilder sql = new StringBuilder("UPDATE users SET ");
//        boolean first = true;
//
//        if (username != null && !username.trim().isEmpty()) {
//            sql.append("username = '").append(username.replace("'", "''")).append("'");
//            first = false;
//        }
//        if (teamId != null) {
//            if (!first) sql.append(", ");
//            sql.append("team_id = ").append(teamId);
//            first = false;
//        }
//        if (role != null && !role.trim().isEmpty()) {
//            if (!first) sql.append(", ");
//            sql.append("role = '").append(role.replace("'", "''")).append("'");
//        }
//
//        sql.append(" WHERE id = ").append(id);
//        return jdbcTemplate.update(sql.toString());
//    }
//
//    // ------------------ UPDATE PASSWORD ------------------
//    public int updatePassword(int id, String newPassword) {
//        String sql = "UPDATE users SET password = ? WHERE id = ?";
//        return jdbcTemplate.update(sql, newPassword, id);
//    }
//
//}
