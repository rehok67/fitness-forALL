package com.fitness.programtracker.service;

import com.fitness.programtracker.entity.EmailVerification;
import com.fitness.programtracker.entity.User;
import com.fitness.programtracker.repository.EmailVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final EmailVerificationRepository verificationRepository;
    
    // Application properties'den alacağız
    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;
    
    @Value("${app.name:Fitness Program Hub}")
    private String appName;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    // Security için
    private final SecureRandom secureRandom = new SecureRandom();
    
    /**
     * Email verification token oluştur ve email gönder
     */
    public void sendEmailVerification(User user) {
        try {
            // Rate limiting kontrolü (saatte max 3 email)
            checkRateLimit(user.getEmail(), EmailVerification.TokenType.EMAIL_VERIFICATION, 3, 1);
            
            // Eski aktif verification varsa sil
            verificationRepository.findByUserAndTokenTypeAndVerifiedAtIsNull(
                    user, EmailVerification.TokenType.EMAIL_VERIFICATION)
                    .ifPresent(verificationRepository::delete);
            
            // Yeni token oluştur
            String token = generateSecureToken();
            
            // Verification entity oluştur
            EmailVerification verification = new EmailVerification();
            verification.setUser(user);
            verification.setToken(token);
            verification.setTokenType(EmailVerification.TokenType.EMAIL_VERIFICATION);
            verification.setEmail(user.getEmail());
            verification.setExpiresAt(LocalDateTime.now().plusHours(24)); // 24 saat geçerli
            
            // Veritabanına kaydet
            verificationRepository.save(verification);
            
            // Email gönder
            sendVerificationEmail(user, token);
            
            log.info("Email verification sent to user: {}", user.getEmail());
            
        } catch (Exception e) {
            log.error("Failed to send email verification to user: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }
    
    /**
     * Email verification token doğrula
     */
    public boolean verifyEmail(String token) {
        try {
            EmailVerification verification = verificationRepository.findByToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid verification token"));
            
            // Token geçerli mi kontrol et
            if (!verification.isValid()) {
                if (verification.isExpired()) {
                    throw new RuntimeException("Verification token has expired. Please request a new one.");
                } else if (verification.isVerified()) {
                    throw new RuntimeException("This email is already verified.");
                }
            }
            
            // User'ı verified olarak işaretle
            User user = verification.getUser();
            user.setIsVerified(true);
            
            // Verification'ı verified olarak işaretle
            verification.markAsVerified();
            verificationRepository.save(verification);
            
            log.info("Email verified successfully for user: {}", user.getEmail());
            return true;
            
        } catch (Exception e) {
            log.error("Email verification failed for token: {}", token, e);
            throw new RuntimeException("Email verification failed: " + e.getMessage());
        }
    }
    
    /**
     * Password reset email gönder
     */
    public void sendPasswordResetEmail(String email) {
        // TODO: Implement password reset
        log.info("Password reset email requested for: {}", email);
    }
    
    /**
     * Verification email'ini yeniden gönder
     */
    public void resendVerificationEmail(String email) {
        User user = verificationRepository.findByEmailAndTokenTypeAndVerifiedAtIsNull(
                email, EmailVerification.TokenType.EMAIL_VERIFICATION)
                .map(EmailVerification::getUser)
                .orElseThrow(() -> new RuntimeException("No pending verification found for this email"));
        
        sendEmailVerification(user);
    }
    
    /**
     * Güvenli token oluştur (256-bit)
     */
    private String generateSecureToken() {
        byte[] randomBytes = new byte[32]; // 256 bit
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
    
    /**
     * Rate limiting kontrolü
     */
    private void checkRateLimit(String email, EmailVerification.TokenType tokenType, 
                               int maxAttempts, int hoursWindow) {
        LocalDateTime after = LocalDateTime.now().minusHours(hoursWindow);
        int attempts = verificationRepository.countByEmailAndTokenTypeAndCreatedAtAfter(
                email, tokenType, after);
        
        if (attempts >= maxAttempts) {
            throw new RuntimeException(String.format(
                    "Too many verification attempts. Please wait %d hour(s) before requesting again.", 
                    hoursWindow));
        }
    }
    
    /**
     * HTML verification email gönder
     */
    private void sendVerificationEmail(User user, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, appName);
            helper.setTo(user.getEmail());
            helper.setSubject("🏋️ Email Adresinizi Doğrulayın - " + appName);
            
            String verificationUrl = frontendUrl + "/auth/verify?token=" + token;
            String htmlContent = createVerificationEmailTemplate(user, verificationUrl, token);
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Verification email sent successfully to: {}", user.getEmail());
            
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
    
    /**
     * HTML email template
     */
    private String createVerificationEmailTemplate(User user, String verificationUrl, String token) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Email Verification</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
                    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; }
                    .token-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; font-family: monospace; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏋️ %s</h1>
                        <p>Email Adresinizi Doğrulayın</p>
                    </div>
                    
                    <div class="content">
                        <h2>Merhaba %s! 👋</h2>
                        
                        <p><strong>%s</strong> platformuna hoş geldiniz! Hesabınızı aktifleştirmek için email adresinizi doğrulamanız gerekiyor.</p>
                        
                        <p>Aşağıdaki butona tıklayarak email adresinizi doğrulayın:</p>
                        
                        <div style="text-align: center;">
                            <a href="%s" class="button">✅ Email Adresimi Doğrula</a>
                        </div>
                        
                        <p>Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayın:</p>
                        <div class="token-box">%s</div>
                        
                        <p><strong>⚠️ Önemli:</strong></p>
                        <ul>
                            <li>Bu link 24 saat boyunca geçerlidir</li>
                            <li>Güvenlik için bu emaili kimseyle paylaşmayın</li>
                            <li>Bu hesabı siz oluşturmadıysanız, bu emaili görmezden gelin</li>
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <p>Bu email otomatik olarak gönderilmiştir.</p>
                        <p><strong>%s</strong> | Fitness Program Hub</p>
                        <p>Sorularınız için: <a href="mailto:%s">%s</a></p>
                    </div>
                </div>
            </body>
            </html>
            """, 
            appName,
            user.getUsername(),
            appName,
            verificationUrl,
            verificationUrl,
            appName,
            fromEmail,
            fromEmail
        );
    }
} 