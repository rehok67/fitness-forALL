package com.fitness.programtracker.config;

import com.fitness.programtracker.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF'i disable et - JWT kullanıyoruz
                .csrf(AbstractHttpConfigurer::disable)
                
                // CORS configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - authentication gerektirmez
                        .requestMatchers("/api/auth/**").permitAll()                      // Register, login, verify
                        .requestMatchers(HttpMethod.GET, "/api/programs/**").permitAll()   // Program okuma herkese açık
                        
                        // Swagger UI - Tüm path'ler
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/swagger-resources/**").permitAll()
                        .requestMatchers("/webjars/**").permitAll()
                        
                        // Static resources
                        .requestMatchers("/favicon.ico").permitAll()
                        .requestMatchers("/error").permitAll()
                        
                        // Health check endpoint (ileride kullanabilirsin)
                        .requestMatchers("/actuator/health").permitAll()
                        
                        // Protected endpoints - authentication gerektirir
                        .requestMatchers(HttpMethod.POST, "/api/programs").authenticated()     // Program oluşturma
                        .requestMatchers(HttpMethod.PUT, "/api/programs/**").authenticated()   // Program güncelleme
                        .requestMatchers(HttpMethod.DELETE, "/api/programs/**").authenticated() // Program silme
                        
                        // Diğer tüm endpoint'ler authenticated olmalı
                        .anyRequest().authenticated()
                )
                
                // Session management - Stateless (JWT kullanıyoruz)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // Authentication provider
                .authenticationProvider(authenticationProvider())
                
                // JWT filter'ı ekle
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt ile password encoding
        return new BCryptPasswordEncoder(12); // Strength 12 - güvenli ama hızlı
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Frontend URL'leri - development ve production
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:4200",    // Angular dev server
                "http://localhost:3000",    // React dev server (ileride)
                "https://yourdomain.com"    // Production domain
        ));
        
        // İzin verilen HTTP methodları
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // İzin verilen header'lar
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        
        // Credentials (cookies, authorization headers) gönderebilir
        configuration.setAllowCredentials(true);
        
        // Response header'larını expose et
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        // Preflight cache süresi
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
} 