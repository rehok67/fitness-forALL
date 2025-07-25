package com.fitness.programtracker.service;

import com.fitness.programtracker.entity.User;
import com.fitness.programtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        // Email veya username ile kullanıcı bul
        User user = userRepository.findByEmailOrUsername(emailOrUsername)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email or username: " + emailOrUsername));
        
        // Kullanıcı doğrulanmış mı kontrol et
        if (!user.isVerified()) {
            throw new UsernameNotFoundException(
                    "User account is not verified. Please check your email for verification link.");
        }
        
        return new UserPrincipal(user);
    }
    
    // Spring Security UserDetails implementasyonu
    public static class UserPrincipal implements UserDetails {
        private final User user;
        
        public UserPrincipal(User user) {
            this.user = user;
        }
        
        // User entity'sine erişim için getter
        public User getUser() {
            return user;
        }
        
        public Long getId() {
            return user.getId();
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            // User role'üne göre authority ver
            return Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
            );
        }
        
        @Override
        public String getPassword() {
            return user.getPassword();
        }
        
        @Override
        public String getUsername() {
            // Email'i username olarak kullan
            return user.getEmail();
        }
        
        // Username (display name için)
        public String getDisplayUsername() {
            return user.getUsername();
        }
        
        @Override
        public boolean isAccountNonExpired() {
            return true; // Account expiration kullanmıyoruz
        }
        
        @Override
        public boolean isAccountNonLocked() {
            return true; // Account locking kullanmıyoruz (şimdilik)
        }
        
        @Override
        public boolean isCredentialsNonExpired() {
            return true; // Password expiration kullanmıyoruz
        }
        
        @Override
        public boolean isEnabled() {
            // Account enabled = verified
            return user.isVerified();
        }
        
        // Helper methods
        public String getFullName() {
            return user.getFullName();
        }
        
        public String getEmail() {
            return user.getEmail();
        }
        
        public User.Role getRole() {
            return user.getRole();
        }
        
        public boolean hasRole(User.Role role) {
            return user.getRole() == role;
        }
        
        public boolean isAdmin() {
            return user.getRole() == User.Role.ADMIN;
        }
        
        public boolean isModerator() {
            return user.getRole() == User.Role.MODERATOR;
        }
    }
} 