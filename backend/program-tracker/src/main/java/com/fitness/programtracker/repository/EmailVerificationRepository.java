package com.fitness.programtracker.repository;

import com.fitness.programtracker.entity.EmailVerification;
import com.fitness.programtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    
    // Token ile verification bulma
    Optional<EmailVerification> findByToken(String token);
    
    // User ve token type ile aktif verification bulma
    Optional<EmailVerification> findByUserAndTokenTypeAndVerifiedAtIsNull(
            User user, EmailVerification.TokenType tokenType);
    
    // Email ile aktif verification bulma
    Optional<EmailVerification> findByEmailAndTokenTypeAndVerifiedAtIsNull(
            String email, EmailVerification.TokenType tokenType);
    
    // User'ın tüm verification'larını bulma
    List<EmailVerification> findByUserOrderByCreatedAtDesc(User user);
    
    // Süresi dolmuş token'ları bulma (temizlik için)
    List<EmailVerification> findByExpiresAtBefore(LocalDateTime dateTime);
    
    // User'ın email verification sayısını bulma (rate limiting için)
    @Query("SELECT COUNT(ev) FROM EmailVerification ev WHERE ev.user = :user " +
           "AND ev.tokenType = :tokenType AND ev.createdAt > :after")
    int countByUserAndTokenTypeAndCreatedAtAfter(
            @Param("user") User user, 
            @Param("tokenType") EmailVerification.TokenType tokenType,
            @Param("after") LocalDateTime after);
    
    // Email ile email verification sayısını bulma
    @Query("SELECT COUNT(ev) FROM EmailVerification ev WHERE ev.email = :email " +
           "AND ev.tokenType = :tokenType AND ev.createdAt > :after")
    int countByEmailAndTokenTypeAndCreatedAtAfter(
            @Param("email") String email,
            @Param("tokenType") EmailVerification.TokenType tokenType,
            @Param("after") LocalDateTime after);
    
    // Süresi dolmuş token'ları silme
    @Modifying
    @Query("DELETE FROM EmailVerification ev WHERE ev.expiresAt < :dateTime")
    int deleteExpiredTokens(@Param("dateTime") LocalDateTime dateTime);
    
    // User'ın eski verification'larını silme (sadece son 5'ini sakla)
    @Modifying
    @Query("DELETE FROM EmailVerification ev WHERE ev.user = :user AND ev.id NOT IN " +
           "(SELECT e.id FROM EmailVerification e WHERE e.user = :user " +
           "ORDER BY e.createdAt DESC LIMIT 5)")
    int deleteOldVerificationsByUser(@Param("user") User user);
} 