package com.fitness.programtracker.service;

import com.fitness.programtracker.dto.AuthRequestDTO.*;
import com.fitness.programtracker.dto.AuthResponseDTO.*;
import com.fitness.programtracker.entity.User;
import com.fitness.programtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public RegisterResponse register(RegisterRequest request) {
        // Email zaten kayıtlı mı kontrol et
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Username zaten kayıtlı mı kontrol et
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        
        // User entity oluştur
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setIsVerified(false); // Email doğrulanmamış
        user.setRole(User.Role.USER);
        
        // Önce user'ı kaydet
        User savedUser = userRepository.save(user);
        
        try {
            // Real email verification gönder
            emailService.sendEmailVerification(savedUser);
            
            return new RegisterResponse(
                    "Registration successful! Please check your email for verification.",
                    savedUser.getEmail(),
                    true
            );
        } catch (Exception e) {
            // Email gönderiminde hata olursa user'ı sil
            userRepository.delete(savedUser);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public LoginResponse login(LoginRequest request) {
        // Authentication yapma
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmailOrUsername(),
                        request.getPassword()
                )
        );
        
        // User'ı bul
        User user = userRepository.findByEmailOrUsername(request.getEmailOrUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Doğrulanmış mı kontrol et
        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email before logging in");
        }
        
        // JWT token oluştur
        UserDetailsServiceImpl.UserPrincipal userPrincipal = new UserDetailsServiceImpl.UserPrincipal(user);
        String token = jwtService.generateTokenWithRole(userPrincipal, user.getId(), user.getRole().name());
        
        // Response oluştur
        UserInfo userInfo = UserInfo.fromUser(user);
        return new LoginResponse(token, userInfo, "Login successful");
    }

    public VerificationResponse verifyEmail(String token) {
        try {
            // EmailService ile verification yap
            boolean verified = emailService.verifyEmail(token);
            
            if (verified) {
                return new VerificationResponse(
                        "Email verified successfully! You can now login.",
                        true,
                        "Email verified"
                );
            } else {
                throw new RuntimeException("Email verification failed");
            }
        } catch (Exception e) {
            throw new RuntimeException("Email verification failed: " + e.getMessage());
        }
    }

    public void resendVerificationEmail(String email) {
        try {
            // EmailService ile yeniden gönder
            emailService.resendVerificationEmail(email);
        } catch (Exception e) {
            throw new RuntimeException("Failed to resend verification email: " + e.getMessage());
        }
    }
} 