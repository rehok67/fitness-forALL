package com.fitness.programtracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthRequestDTO {
    
    // Register Request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        private String username;
        
        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email")
        private String email;
        
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
        
        @Size(max = 50, message = "First name cannot exceed 50 characters")
        private String firstName;
        
        @Size(max = 50, message = "Last name cannot exceed 50 characters")
        private String lastName;
    }
    
    // Login Request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        
        @NotBlank(message = "Email or username is required")
        private String emailOrUsername;
        
        @NotBlank(message = "Password is required")
        private String password;
    }
    
    // Email Verification Request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyEmailRequest {
        
        @NotBlank(message = "Verification token is required")
        private String token;
    }
    
    // Resend Verification Request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResendVerificationRequest {
        
        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email")
        private String email;
    }
} 