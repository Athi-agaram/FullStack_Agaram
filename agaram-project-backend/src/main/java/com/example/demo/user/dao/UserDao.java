package com.example.demo.user.dao;

import java.util.List;
import java.util.Map;

public interface UserDao {
    int saveNewUser(String username, String password);
    int updateUser(int id, String role, Integer teamId, Boolean authorized);
    int deleteUser(int id);
    Integer findOrCreateTeamId(String teamName);
    Map<String, Object> findById(int id);
    Map<String, Object> findByUsername(String username);
    List<Map<String, Object>> findAllUsers();
    List<Map<String, Object>> getUsersByTeamName(String teamName);
    List<Map<String, Object>> findUsersInSameTeam(String username);
    boolean isUserInManagerTeam(int managerId, int userId);
    List<Map<String,Object>> getAllTeams();
    int updateUserProfile(int id, String username, Integer teamId, String role);
    int updatePassword(int id, String newPassword);
}
