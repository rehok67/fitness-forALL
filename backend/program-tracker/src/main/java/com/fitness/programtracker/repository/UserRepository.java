package com.fitness.programtracker.repository;

import com.fitness.programtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Email ile kullanıcı bul
    Optional<User> findByEmail(String email);
    
    // Username ile kullanıcı bul
    Optional<User> findByUsername(String username);
    
    // Email veya Username ile kullanıcı bul
    @Query("SELECT u FROM User u WHERE u.email = :emailOrUsername OR u.username = :emailOrUsername")
    Optional<User> findByEmailOrUsername(@Param("emailOrUsername") String emailOrUsername);
    
    // Email var mı kontrol et
    boolean existsByEmail(String email);
    
    // Username var mı kontrol et  
    boolean existsByUsername(String username);
    
    // Doğrulanmış kullanıcılar
    @Query("SELECT u FROM User u WHERE u.isVerified = true")
    java.util.List<User> findAllVerifiedUsers();
    
    // Email ile aktif (doğrulanmış) kullanıcı bul
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isVerified = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);
    
    // Username ile aktif (doğrulanmış) kullanıcı bul
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.isVerified = true")
    Optional<User> findActiveUserByUsername(@Param("username") String username);
} 