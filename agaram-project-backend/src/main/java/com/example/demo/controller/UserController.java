package com.example.demo.controller;

import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Login
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Map<String, Object> user = userService.getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String dbPassword = (String) user.get("password");
        if (!dbPassword.equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        user.remove("password");
        return user;
    }

    // ✅ Register
    @PostMapping("/register")
    public String registerUser(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        int result = userService.registerNewUser(username, password);
        return result > 0 ? "User registered successfully" : "Failed to register user";
    }

    @GetMapping("/check-username")
    public boolean checkUsernameExists(@RequestParam String username) {
        Map<String, Object> user = userService.getUserByUsername(username);
        return user != null;
    }


    // ------------------ GET ALL USERS ------------------
    @GetMapping("/all")
    public List<Map<String, Object>> getAllUsers() {
        return userService.getAllUsers();
    }

    // ------------------ UPDATE USER ------------------
    @PutMapping("/update/{id}")
    public String updateUser(@PathVariable int id, 
                             @RequestBody Map<String, Object> body, 
                             @RequestParam String currentUser) {
        Map<String,Object> loggedInUser = userService.getUserByUsername(currentUser);

        String role = (String) body.get("role");
        String teamName = (String) body.get("teamName");
        Boolean authorized = body.get("authorized") != null ? (Boolean) body.get("authorized") : null;

        int result = userService.updateUserWithTeamName(id, role, teamName, authorized, loggedInUser);
        return result > 0 ? "User updated successfully" : "Failed to update user";
    }

    // ------------------ DELETE USER ------------------
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable int id, @RequestParam String currentUser) {
        Map<String,Object> loggedInUser = userService.getUserByUsername(currentUser);
        int result = userService.deleteUser(id, loggedInUser);
        return result > 0 ? "User deleted successfully" : "Failed to delete user";
    }

    // ------------------ GET USERS BY TEAM ------------------
    @GetMapping("/team/{teamName}")
    public List<Map<String, Object>> getUsersByTeam(@PathVariable String teamName) {
        return userService.getUsersByTeam(teamName);
    }

    // ------------------ GET TEAM MEMBERS ------------------
    @GetMapping("/team-members")
    public List<Map<String, Object>> getTeamMembers(@RequestParam String username) {
        return userService.getUsersInSameTeam(username);
    }
 // ------------------ EDIT PROFILE ------------------
    @PutMapping("/edit-profile/{id}")
    public String editProfile(@PathVariable int id, @RequestBody Map<String, String> body) {
        String newUsername = body.get("username");
        String teamName = body.get("teamName");
        String role = body.get("role");

        int result = userService.editUserProfile(id, newUsername, teamName, role);
        return result > 0 ? "Profile updated successfully" : "Failed to update profile";
    }

    // ------------------ CHANGE PASSWORD ------------------
    @PutMapping("/change-password/{id}")
    public String changePassword(@PathVariable int id, @RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        boolean success = userService.changePassword(id, currentPassword, newPassword);
        return success ? "Password updated successfully" : "Incorrect current password";
    }

}
