# 📧 Gmail SMTP Setup Talimatları

## 🎯 Amaç
Fitness Program Hub uygulamanız için gerçek email verification sistemi kuruyoruz.

## 📝 Adım Adım Kurulum

### 1. Gmail Hesabı Oluştur
- Yeni Gmail hesabı oluştur: `fitnessappverification@gmail.com` (örnek)
- Bu hesap sadece uygulama için kullanılacak

### 2. Google Hesap Güvenlik Ayarları
1. **Google Hesabınıza gidin:** https://myaccount.google.com/
2. **Güvenlik** sekmesine tıklayın
3. **2 Adımlı Doğrulama** aktifleştirin
   - SMS ile doğrulama yapın
   - Backup kodlarını kaydedin

### 3. App Password Oluşturma
1. **2 Adımlı Doğrulama** aktifleştirildikten sonra
2. **App passwords** bölümüne gidin
3. **Select app**: "Other (Custom name)"
4. **Name**: "Fitness Program Hub" yazın
5. **Generate** butonuna tıklayın
6. **16 haneli şifreyi kaydedin** (örnek: `abcd efgh ijkl mnop`)

### 4. Application Properties Güncellemesi

Backend'te `application.properties` dosyasını güncelle:

```properties
# Gmail SMTP Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=fitnessappverification@gmail.com
spring.mail.password=abcd efgh ijkl mnop
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# Application Configuration
app.name=Fitness Program Hub
app.frontend.url=http://localhost:4200
```

### 5. Test Email Gönderimi

1. **Backend'i başlat**
2. **Swagger UI'da test et:** http://localhost:8080/swagger-ui.html
3. **POST /api/auth/register** endpoint'ini kullan:

```json
{
  "username": "testuser",
  "email": "your-real-email@gmail.com",
  "password": "123456",
  "firstName": "Test",
  "lastName": "User"
}
```

4. **Email kutunuzu kontrol edin** (spam dahil)
5. **Email'deki linke tıklayın**
6. **Verification sayfası açılmalı**

## 🔐 Güvenlik Özellikleri

### ✅ Implemented Features:
- **Rate Limiting**: Saatte max 3 verification email
- **Token Security**: 256-bit secure random tokens
- **Token Expiry**: 24 saat geçerlilik süresi
- **One-time Use**: Token kullanıldıktan sonra invalid
- **IP Tracking**: Verification hangi IP'den yapıldı
- **HTML Templates**: Professional email design

### 📊 Database Changes:
- **New Table**: `email_verifications`
- **User Table**: Verification fields removed
- **Clean Architecture**: Separate concerns

## 🚀 Email Template Örneği

Kullanıcı şöyle bir email alacak:

```
Subject: 🏋️ Email Adresinizi Doğrulayın - Fitness Program Hub

[Güzel HTML template ile]
- Merhaba {username}!
- Fitness Program Hub'a hoş geldiniz
- Email doğrulama butonu
- 24 saat geçerlilik uyarısı
- Güvenlik bilgileri
```

## 🔧 Troubleshooting

### Email Gelmiyorsa:
1. **Spam klasörünü kontrol et**
2. **Gmail'in "Less secure app"** ayarını kontrol et
3. **App password'un doğru** olduğundan emin ol
4. **Firewall** port 587'yi engelliyor olabilir
5. **Console loglarını** kontrol et

### Backend Logları:
```bash
# Başarılı email:
INFO - Email verification sent to user: test@example.com

# Hatalı email:
ERROR - Failed to send verification email to: test@example.com
```

## 📱 Frontend Verification Flow

1. **User register olur**
2. **Backend email gönderir**
3. **User email'deki linke tıklar**
4. **Frontend /auth/verify?token=XXX** sayfası açılır
5. **Component otomatik backend'e request gönderir**
6. **Success/Error durumu gösterilir**
7. **3 saniye sonra login sayfasına yönlendirilir**

## 🎉 Sonuç

Artık **gerçek email verification sisteminiz** hazır!
- Production-ready
- Security best practices
- Professional email templates
- User-friendly frontend
- Rate limiting protection

### 📝 Next Steps:
1. Gmail hesabı kur
2. App password oluştur
3. application.properties güncelle
4. Test et
5. 🚀 Production'a deploy et

**Tebrikler! Gerçek email sisteminiz artık çalışıyor!** 🎊 