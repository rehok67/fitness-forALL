package com.fitness.programtracker.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    
    // JWT secret key - production'da environment variable olmalı
    @Value("${jwt.secret:myDefaultSecretKeyForDevelopmentOnlyThatIsLongEnoughForHS256Algorithm}")
    private String secretKey;
    
    // Token geçerlilik süresi - 24 saat (milliseconds)
    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;
    
    // Secret key oluştur
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    // Token'dan username çıkar
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    // Token'dan expiration date çıkar
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    // Token'dan herhangi bir claim çıkar
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    // Token'dan tüm claims çıkar
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    // Token süresi dolmuş mu kontrol et
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    // Kullanıcı için token oluştur
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }
    
    // Extra claims ile token oluştur
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }
    
    // Token builder metodu
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails, 
            long expiration
    ) {
        Date now = new Date(System.currentTimeMillis());
        Date expirationDate = new Date(System.currentTimeMillis() + expiration);
        
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    // Token geçerli mi kontrol et
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
    
    // Token'dan user ID çıkar (custom claim)
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }
    
    // User ID ile token oluştur
    public String generateTokenWithUserId(UserDetails userDetails, Long userId) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", userId);
        return generateToken(extraClaims, userDetails);
    }
    
    // Token'dan user role çıkar (custom claim)
    public String extractUserRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }
    
    // User role ile token oluştur
    public String generateTokenWithRole(UserDetails userDetails, Long userId, String role) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", userId);
        extraClaims.put("role", role);
        return generateToken(extraClaims, userDetails);
    }
    
    // Base64 encoded secret key oluştur (development için)
    public static String generateBase64SecretKey() {
        return java.util.Base64.getEncoder()
                .encodeToString("myDefaultSecretKeyForDevelopmentOnlyThatIsLongEnoughForHS256Algorithm".getBytes());
    }
} 