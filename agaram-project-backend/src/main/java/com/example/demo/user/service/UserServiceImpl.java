package com.example.demo.user.service;

import com.example.demo.user.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userRepository;

    @Override
    public Map<String, Object> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public int registerNewUser(String username, String password) {
        try {
            return userRepository.saveNewUser(username, password);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAllUsers();
    }

    @Override
    public int updateUserWithTeamName(int id, String role, String teamName, Boolean authorized, Map<String, Object> currentUser) {
        String currentRole = (String) currentUser.get("role");
        Integer currentUserId = (Integer) currentUser.get("id");

        if (currentRole != null && currentRole.equals("MANAGER")) {
            if (!userRepository.isUserInManagerTeam(currentUserId, id)) {
                throw new RuntimeException("Cannot modify users outside your team");
            }
        } else if ("EMPLOYEE".equals(currentRole)) {
            throw new RuntimeException("Employees cannot update users");
        }

        Integer teamId = null;
        if (teamName != null && !teamName.trim().isEmpty()) {
            teamId = userRepository.findOrCreateTeamId(teamName);
        }

        return userRepository.updateUser(id, role, teamId, authorized);
    }

    @Override
    public int deleteUser(int id, Map<String, Object> currentUser) {
        String currentRole = (String) currentUser.get("role");
        Integer currentUserId = (Integer) currentUser.get("id");

        if (currentRole != null && currentRole.equals("MANAGER")) {
            if (!userRepository.isUserInManagerTeam(currentUserId, id)) {
                throw new RuntimeException("Cannot delete users outside your team");
            }
        } else if ("EMPLOYEE".equals(currentRole)) {
            throw new RuntimeException("Employees cannot delete users");
        }

        return userRepository.deleteUser(id);
    }

    @Override
    public List<Map<String, Object>> getUsersByTeam(String teamName) {
        return userRepository.getUsersByTeamName(teamName);
    }

    @Override
    public List<Map<String, Object>> getUsersInSameTeam(String username) {
        return userRepository.findUsersInSameTeam(username);
    }

    @Override
    public int editUserProfile(int id, String newUsername, String teamName, String role) {
        Integer teamId = null;
        if (teamName != null && !teamName.trim().isEmpty()) {
            teamId = userRepository.findOrCreateTeamId(teamName);
        }
        return userRepository.updateUserProfile(id, newUsername, teamId, role);
    }

    @Override
    public boolean changePassword(int id, String currentPassword, String newPassword) {
        Map<String, Object> user = userRepository.findById(id);
        if (user == null) return false;

        String dbPassword = (String) user.get("password");
        if (!dbPassword.equals(currentPassword)) {
            return false;
        }

        return userRepository.updatePassword(id, newPassword) > 0;
    }
}
