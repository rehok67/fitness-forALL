package com.fitness.programtracker.dto;

import com.fitness.programtracker.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthResponseDTO {
    
    // Login Response
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
        private String type = "Bearer";
        private UserInfo user;
        private String message;
        
        public LoginResponse(String token, UserInfo user, String message) {
            this.token = token;
            this.user = user;
            this.message = message;
        }
    }
    
    // Register Response
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterResponse {
        private String message;
        private String email;
        private boolean verificationEmailSent;
    }
    
    // Verification Response
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerificationResponse {
        private String message;
        private boolean success;
        private String email;
    }
    
    // User Info (JWT payload için)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String fullName;
        private User.Role role;
        private boolean verified;
        
        // User entity'den UserInfo oluştur
        public static UserInfo fromUser(User user) {
            return new UserInfo(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.getRole(),
                user.isVerified()
            );
        }
    }
    
    // Generic API Response
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;
        
        public static ApiResponse success(String message) {
            return new ApiResponse(true, message, null);
        }
        
        public static ApiResponse success(String message, Object data) {
            return new ApiResponse(true, message, data);
        }
        
        public static ApiResponse error(String message) {
            return new ApiResponse(false, message, null);
        }
    }
} 