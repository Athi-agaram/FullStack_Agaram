//package com.example.demo.service;
//
//import com.example.demo.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class UserService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    public Map<String, Object> getUserByUsername(String username) {
//        return userRepository.findByUsername(username);
//    }
//
//    public int registerNewUser(String username, String password) {
//        try {
//            return userRepository.saveNewUser(username, password);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return 0;
//        }
//    }
//
//    public List<Map<String, Object>> getAllUsers() {
//        return userRepository.findAllUsers();
//    }
//
//    // ------------------ UPDATE USER WITH TEAM ------------------
//    public int updateUserWithTeamName(int id, String role, String teamName, Boolean authorized, Map<String,Object> currentUser) {
//        String currentRole = (String) currentUser.get("role");
//        Integer currentUserId = (Integer) currentUser.get("id");
//
//        // Permission checks
//        if (currentRole.equals("MANAGER")) {
//            if (!userRepository.isUserInManagerTeam(currentUserId, id)) {
//                throw new RuntimeException("Cannot modify users outside your team");
//            }
//        } else if (currentRole.equals("EMPLOYEE")) {
//            throw new RuntimeException("Employees cannot update users");
//        }
//
//        Integer teamId = null;
//        if (teamName != null && !teamName.trim().isEmpty()) {
//            // Convert teamName -> team_id, create new team if not exists
//            teamId = userRepository.findOrCreateTeamId(teamName);
//        }
//
//        return userRepository.updateUser(id, role, teamId, authorized);
//    }
//
//    // ------------------ DELETE USER ------------------
//    public int deleteUser(int id, Map<String,Object> currentUser) {
//        String currentRole = (String) currentUser.get("role");
//        Integer currentUserId = (Integer) currentUser.get("id");
//
//        // Permission checks
//        if (currentRole.equals("MANAGER")) {
//            if (!userRepository.isUserInManagerTeam(currentUserId, id)) {
//                throw new RuntimeException("Cannot delete users outside your team");
//            }
//        } else if (currentRole.equals("EMPLOYEE")) {
//            throw new RuntimeException("Employees cannot delete users");
//        }
//
//        return userRepository.deleteUser(id);
//    }
//
//    // ------------------ GET USERS BY TEAM ------------------
//    public List<Map<String, Object>> getUsersByTeam(String teamName) {
//        return userRepository.getUsersByTeamName(teamName);
//    }
//
//    // ------------------ GET USERS IN SAME TEAM ------------------
//    public List<Map<String, Object>> getUsersInSameTeam(String username) {
//        return userRepository.findUsersInSameTeam(username);
//    }
// // ------------------ EDIT PROFILE ------------------
//    public int editUserProfile(int id, String newUsername, String teamName, String role) {
//        Integer teamId = null;
//        if (teamName != null && !teamName.trim().isEmpty()) {
//            teamId = userRepository.findOrCreateTeamId(teamName);
//        }
//        return userRepository.updateUserProfile(id, newUsername, teamId, role);
//    }
//
//    // ------------------ CHANGE PASSWORD ------------------
//    public boolean changePassword(int id, String currentPassword, String newPassword) {
//        Map<String, Object> user = userRepository.findById(id);
//        if (user == null) return false;
//
//        String dbPassword = (String) user.get("password");
//        if (!dbPassword.equals(currentPassword)) {
//            return false; // old password incorrect
//        }
//
//        return userRepository.updatePassword(id, newPassword) > 0;
//    }
//
//}
