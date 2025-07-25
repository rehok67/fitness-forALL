package com.fitness.programtracker.config;

import com.fitness.programtracker.service.JwtService;
import com.fitness.programtracker.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // Authorization header'ını al
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        // JWT token yoksa veya Bearer ile başlamıyorsa, filter chain'e devam et
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // "Bearer " kısmını çıkar, sadece token'ı al
        jwt = authHeader.substring(7);
        
        try {
            // Token'dan email'i çıkar
            userEmail = jwtService.extractUsername(jwt);
            
            // Email var ve henüz authenticate olmamışsa
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // User details'i yükle
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                
                // Token geçerli mi kontrol et
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    
                    // Authentication token oluştur
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // credentials (password) null - JWT kullanıyoruz
                            userDetails.getAuthorities()
                    );
                    
                    // Request details ekle
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    
                    // Security context'e ekle
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    // Debug log
                    logger.debug("Authentication successful for user: " + userEmail);
                }
            }
        } catch (Exception e) {
            // JWT parsing hatası - loglayalım ama authentication fail etmesin
            logger.debug("JWT token parsing failed: " + e.getMessage());
            // SecurityContext boş kalacak, yani authenticated olmamış olacak
        }
        
        // Filter chain'e devam et
        filterChain.doFilter(request, response);
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Bu endpoint'ler için JWT filter'ı çalıştırma (public endpoint'ler)
        String path = request.getRequestURI();
        
        return path.startsWith("/api/auth/") ||                         // Authentication endpoints
               path.startsWith("/api/programs") && 
               ("GET".equals(request.getMethod()) ||                    // GET requests to programs (read-only)
                path.contains("/search")) ||                           // Search endpoint
               path.startsWith("/swagger-ui") ||                       // Swagger UI
               path.equals("/swagger-ui.html") ||                      // Swagger UI main page
               path.startsWith("/v3/api-docs") ||                      // OpenAPI docs
               path.startsWith("/swagger-resources") ||                // Swagger resources
               path.startsWith("/webjars/") ||                         // Swagger webjars
               path.equals("/favicon.ico") ||                          // Favicon
               path.equals("/error") ||                                // Error page
               path.startsWith("/actuator/health");                    // Health check
    }
} 