# 🚀 GitHub Repository Kurulum Rehberi

Bu rehber, fitness data cleaning projenizi GitHub'da saklamak için gereken tüm adımları içermektedir.

## 📋 Önceki Hazırlıklar

### 1. Git Kurulumu Kontrolü

Terminal/PowerShell'de aşağıdaki komutu çalıştırın:
```bash
git --version
```

Eğer Git kurulu değilse, [Git resmi sitesinden](https://git-scm.com/) indirip kurun.

### 2. GitHub Hesabı

- [GitHub.com](https://github.com)'da hesap oluşturun (ücretsiz)
- Email adresinizi doğrulayın

## 🗂️ Projeyi GitHub'a Yükleme

### Adım 1: GitHub'da Yeni Repository Oluşturma

1. GitHub'da oturum açın
2. Sağ üst köşedeki **"+"** butonuna tıklayın
3. **"New repository"** seçeneğini seçin
4. Repository bilgilerini doldurun:
   - **Repository name**: `fitness-data-cleaning`
   - **Description**: `Fitness programları veri temizleme ve analiz projesi - PostgreSQL entegrasyonu ile`
   - **Public** seçeneğini işaretleyin (proje paylaşıma açık olsun)
   - **Add a README file** seçeneğini **İŞARETLEMEYİN** (zaten var)
   - **Add .gitignore** seçeneğini **İŞARETLEMEYİN** (zaten var)
5. **"Create repository"** butonuna tıklayın

### Adım 2: Local Git Repository Kurulumu

Proje dizininizde Terminal/PowerShell açın ve şu komutları sırayla çalıştırın:

```bash
# 1. Git repository'sini başlatma
git init

# 2. Tüm dosyaları staging area'ya ekleme
git add .

# 3. İlk commit'i oluşturma
git commit -m "🎉 İlk commit: Fitness data cleaning projesi"

# 4. Ana branch'i main olarak ayarlama (GitHub standardı)
git branch -M main

# 5. Remote repository bağlantısını ekleme
# Not: <username> yerine GitHub kullanıcı adınızı yazın
git remote add origin https://github.com/<username>/fitness-data-cleaning.git

# 6. Projeyi GitHub'a push etme
git push -u origin main
```

## 🔐 Güvenlik ve Hassas Veriler

### Hassas Bilgilerin Korunması

Aşağıdaki dosyalarda hassas bilgiler olabilir, bunları GitHub'a yüklemeden önce kontrol edin:

```bash
# Veritabanı şifrelerini kontrol edin
# query_db.py dosyasında:
'password': 'your_password'  # Bunu gerçek şifrenizle değiştirmeyin

# db_import.py dosyasında:
'password': 'your_password'  # Bunu gerçek şifrenizle değiştirmeyin
```

### Environment Variables Kullanımı (Önerilen)

Güvenlik için, hassas bilgileri environment variables olarak saklayın:

1. `.env` dosyası oluşturun (bu dosya .gitignore'da zaten var):
```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitness_programs
DB_USER=your_username
DB_PASSWORD=your_actual_password
```

2. Python dosyalarınızı güncelleyin:
```python
import os
from dotenv import load_dotenv

load_dotenv()

db_params = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
}
```

## 📝 Repository Yönetimi

### Güncellemeleri Push Etme

Proje üzerinde değişiklik yaptığınızda:

```bash
# Değişiklikleri kontrol etme
git status

# Değişen dosyaları staging area'ya ekleme
git add .

# Commit mesajı ile değişiklikleri kaydetme
git commit -m "✨ Yeni özellik: [açıklama]"

# GitHub'a gönderme
git push origin main
```

### Commit Mesaj Konvensiyonları

Commit mesajlarınızda şu formatı kullanın:

```bash
git commit -m "🎨 Kod yapısını iyileştir: pandas temizleme fonksiyonları"
git commit -m "📊 Yeni analiz: equipment dağılım grafiği ekle"
git commit -m "🐛 Hata düzelt: PostgreSQL bağlantı problemi"
git commit -m "📚 Dokümantasyon: README güncellemesi"
```

**Emoji Rehberi:**
- 🎉 İlk commit / Major milestone
- ✨ Yeni özellik
- 🐛 Bug fix
- 📊 Data analysis / visualizations
- 🎨 Code formatting / structure
- 📚 Documentation
- 🔧 Configuration
- 🔐 Security
- 🚀 Performance improvements
- 🧪 Tests

## 🌟 Repository'yi İyileştirme

### 1. Repository Topics Ekleme

GitHub repository sayfanızda:
1. **"About"** bölümündeki ⚙️ butonuna tıklayın
2. **Topics** kısmına şunları ekleyin:
   - `data-science`
   - `python`
   - `pandas`
   - `postgresql`
   - `jupyter-notebook`
   - `data-cleaning`
   - `spring-boot`
   - `angular`
   - `fitness-data`

### 2. Repository Description

**Description** alanına:
```
🏋️ Fitness programları veri temizleme ve analiz projesi | Data cleaning & analysis with Python, PostgreSQL integration, Spring Boot backend & Angular frontend
```

### 3. Releases Oluşturma

Major güncellemeler için release'ler oluşturun:

```bash
# Tag oluşturma
git tag -a v1.0.0 -m "🎉 İlk stable release"

# Tag'i GitHub'a gönderme
git push origin v1.0.0
```

## 📈 GitHub Features Kullanımı

### 1. Issues ve Project Management

- **Issues**: Bug'lar ve yeni özellik istekleri için
- **Projects**: Kanban board ile görev takibi
- **Wiki**: Detaylı dokümantasyon için

### 2. Actions ile CI/CD (İsteğe Bağlı)

`.github/workflows/python-app.yml` dosyası oluşturarak otomatik test:

```yaml
name: Python application

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python 3.9
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Run tests
      run: |
        python -m pytest
```

## 🚨 Sorun Giderme

### Yaygın Hatalar ve Çözümleri

1. **"remote: Repository not found" hatası**
   ```bash
   # Remote URL'yi kontrol edin
   git remote -v
   
   # Yanlışsa düzeltin
   git remote set-url origin https://github.com/<username>/fitness-data-cleaning.git
   ```

2. **"Permission denied" hatası**
   - GitHub username/password doğru olduğundan emin olun
   - 2FA aktifse Personal Access Token kullanın

3. **Büyük dosya hatası**
   ```bash
   # 100MB üzeri dosyalar için Git LFS kullanın
   git lfs track "*.csv"
   git add .gitattributes
   ```

## 📞 Yardım ve Destek

- **GitHub Docs**: [docs.github.com](https://docs.github.com)
- **Git Tutorial**: [git-scm.com/docs/gittutorial](https://git-scm.com/docs/gittutorial)
- **Bu proje için Issues**: Repository'nizdeki Issues sekmesi

---

✅ Bu rehberi takip ettikten sonra projeniz GitHub'da profesyonel bir şekilde saklanacak ve paylaşıma hazır olacak! 