package com.example.demo.user.dao;

import com.example.demo.global.Global;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Map;

@Repository
public class UserDaoImpl implements UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Global g = new Global();   // For FormatSQLText()

    @Override
    public int saveNewUser(String username, String password) {

        username = g.FormatSQLText(username);
        password = g.FormatSQLText(password);

        String checkSql = 
            "SELECT * FROM users WHERE username = '" + username + "'";

        List<Map<String, Object>> existing = jdbcTemplate.queryForList(checkSql);

        if (!existing.isEmpty()) return 0;

        String sql = 
            "INSERT INTO users (username, password, role, authorized) " +
            "VALUES ('" + username + "', '" + password + "', 'EMPLOYEE', 0)";

        return jdbcTemplate.update(sql);
    }

    @Override
    public int updateUser(int id, String role, Integer teamId, Boolean authorized) {

        StringBuilder sql = new StringBuilder("UPDATE users SET ");
        boolean first = true;

        if (role != null) {
            sql.append("role = '").append(g.FormatSQLText(role)).append("'");
            first = false;
        }
        if (teamId != null) {
            if (!first) sql.append(", ");
            sql.append("team_id = ").append(teamId);
            first = false;
        }
        if (authorized != null) {
            if (!first) sql.append(", ");
            sql.append("authorized = ").append(authorized ? 1 : 0);
        }

        sql.append(" WHERE id = ").append(id);
        return jdbcTemplate.update(sql.toString());
    }

    @Override
    public int deleteUser(int id) {
        try {
            String deleteSales = "DELETE FROM product_sales WHERE employee_id = " + id;
            jdbcTemplate.update(deleteSales);

            String deleteUser = "DELETE FROM users WHERE id = " + id;
            return jdbcTemplate.update(deleteUser);

        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Cannot delete user — user has related records in other tables.");
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while deleting user: " + e.getMessage());
        }
    }

    @Override
    public Integer findOrCreateTeamId(String teamName) {

        if (teamName == null || teamName.trim().isEmpty()) return null;

        teamName = g.FormatSQLText(teamName);

        String checkSql = 
            "SELECT id FROM teams WHERE team_name = '" + teamName + "'";

        List<Map<String, Object>> existing = jdbcTemplate.queryForList(checkSql);

        if (!existing.isEmpty()) {
            return (Integer) existing.get(0).get("id");
        }

        String insertSql =
            "INSERT INTO teams (team_name) VALUES ('" + teamName + "')";
        jdbcTemplate.update(insertSql);

        String getSql =
            "SELECT id FROM teams WHERE team_name = '" + teamName + "'";

        return jdbcTemplate.queryForObject(getSql, Integer.class);
    }

    @Override
    public Map<String, Object> findById(int id) {

        String sql =
            "SELECT u.id, u.username, u.password, u.role, u.team_id, u.authorized, " +
            "COALESCE(t.team_name,'') AS team_name " +
            "FROM users u " +
            "LEFT JOIN teams t ON u.team_id = t.id " +
            "WHERE u.id = " + id;

        List<Map<String,Object>> result = jdbcTemplate.queryForList(sql);
        return result.isEmpty() ? null : result.get(0);
    }

    @Override
    public Map<String, Object> findByUsername(String username) {

        username = g.FormatSQLText(username);

        String sql =
            "SELECT u.id, u.username, u.password, u.role, u.team_id, u.authorized, " +
            "COALESCE(t.team_name,'') AS team_name " +
            "FROM users u " +
            "LEFT JOIN teams t ON u.team_id = t.id " +
            "WHERE u.username = '" + username + "'";

        List<Map<String,Object>> result = jdbcTemplate.queryForList(sql);
        return result.isEmpty() ? null : result.get(0);
    }

    @Override
    public List<Map<String, Object>> findAllUsers() {

        String sql =
            "SELECT u.id, u.username, u.role, u.team_id, u.authorized, " +
            "COALESCE(t.team_name,'') AS team_name " +
            "FROM users u " +
            "LEFT JOIN teams t ON u.team_id = t.id";

        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> getUsersByTeamName(String teamName) {

        teamName = g.FormatSQLText(teamName);

        String sql =
            "SELECT u.id, u.username, u.role, u.team_id, u.authorized, t.team_name " +
            "FROM users u " +
            "JOIN teams t ON u.team_id = t.id " +
            "WHERE t.team_name = '" + teamName + "'";

        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String,Object>> findUsersInSameTeam(String username) {

        username = g.FormatSQLText(username);

        String sql =
            "SELECT u.id, u.username, u.role, u.team_id, u.authorized, " +
            "COALESCE(t.team_name,'') AS team_name " +
            "FROM users u " +
            "JOIN teams t ON u.team_id = t.id " +
            "WHERE u.team_id = (SELECT team_id FROM users WHERE username = '" + username + "')";

        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public boolean isUserInManagerTeam(int managerId, int userId) {

        String sql =
            "SELECT COUNT(*) FROM users u " +
            "JOIN users m ON m.id = " + managerId + " " +
            "WHERE u.team_id = m.team_id AND u.id = " + userId;

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null && count > 0;
    }

    @Override
    public List<Map<String,Object>> getAllTeams() {

        String sql = "SELECT id, team_name FROM teams";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public int updateUserProfile(int id, String username, Integer teamId, String role) {

        StringBuilder sql = new StringBuilder("UPDATE users SET ");
        boolean first = true;

        if (username != null && !username.trim().isEmpty()) {
            sql.append("username = '").append(g.FormatSQLText(username)).append("'");
            first = false;
        }
        if (teamId != null) {
            if (!first) sql.append(", ");
            sql.append("team_id = ").append(teamId);
            first = false;
        }
        if (role != null && !role.trim().isEmpty()) {
            if (!first) sql.append(", ");
            sql.append("role = '").append(g.FormatSQLText(role)).append("'");
        }

        sql.append(" WHERE id = ").append(id);

        return jdbcTemplate.update(sql.toString());
    }

    @Override
    public int updatePassword(int id, String newPassword) {

        newPassword = g.FormatSQLText(newPassword);

        String sql =
            "UPDATE users SET password = '" + newPassword + "' " +
            "WHERE id = " + id;

        return jdbcTemplate.update(sql);
    }
}
