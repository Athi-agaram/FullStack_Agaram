package com.example.demo.user.service;

import java.util.List;
import java.util.Map;

public interface UserService {
    Map<String, Object> getUserByUsername(String username);
    int registerNewUser(String username, String password);
    List<Map<String, Object>> getAllUsers();

    int updateUserWithTeamName(int id, String role, String teamName, Boolean authorized, Map<String,Object> currentUser);
    int deleteUser(int id, Map<String,Object> currentUser);
    List<Map<String, Object>> getUsersByTeam(String teamName);
    List<Map<String, Object>> getUsersInSameTeam(String username);

    int editUserProfile(int id, String newUsername, String teamName, String role);
    boolean changePassword(int id, String currentPassword, String newPassword);
}
