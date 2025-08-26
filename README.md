# 🏋️ Fitness Program Veri Temizleme ve Analiz Projesi

Bu proje, fitness programları veri setinin temizlenmesi, analizi ve PostgreSQL veritabanına entegrasyonu için geliştirilmiş kapsamlı bir data science projesidir.

## 📋 Proje Özeti

Bu proje aşağıdaki temel bileşenlerden oluşmaktadır:
- **Veri Temizleme**: Ham fitness program verilerinin işlenmesi ve eksik değerlerin doldurulması
- **Veri Analizi**: Jupyter Notebook kullanarak detaylı veri analizi ve görselleştirme
- **Veritabanı Entegrasyonu**: Temizlenmiş verilerin PostgreSQL'e aktarılması
- **Full-Stack Uygulama**: Spring Boot backend ve Angular frontend
- **Yapay Zeka ile Uygun Veri Üretimi Süreci**: LLM deployu ve yenilikler
## 🗂️ Proje Yapısı

```
datacleaning/
├── 📊 Veri Dosyaları
│   ├── data-1753258909988.csv           # Ham veri seti
│   ├── program_summary.csv              # İşlenmiş özet veri
│   ├── program_summary_processed.csv    # Temizlenmiş veri
│   └── program_summary_102.csv          # Final temizlenmiş veri
│
├── 🐍 Python Scriptleri
│   ├── data_analysis.ipynb              # Ana veri analizi notebook'u
│   ├── main.py                          # Ana Python scripti
│   ├── pandas_temizleme.py              # Pandas ile veri temizleme
│   ├── db_import.py                     # Veritabanı import scripti
│   └── query_db.py                      # Veritabanı sorgu scripti
│
├── 🖥️ Backend (Spring Boot)
│   └── backend/program-tracker/
│       ├── src/main/java/com/fitness/programtracker/
│       │   ├── config/                  # Güvenlik ve JWT yapılandırması
│       │   ├── controller/              # REST API controllerleri
│       │   ├── dto/                     # Data Transfer Objects
│       │   ├── entity/                  # JPA entities
│       │   ├── repository/              # Veri erişim katmanı
│       │   ├── service/                 # İş mantığı katmanı
│       │   └── specification/           # Veri filtreleme
│       └── src/main/resources/
│           └── application.properties   # Uygulama yapılandırması
│
├── 🌐 Frontend (Angular)
│   └── frontend/fitness-front/
│       ├── src/app/
│       │   ├── components/              # Angular bileşenleri
│       │   ├── services/                # Servis katmanı
│       │   ├── models/                  # TypeScript modelleri
│       │   ├── guards/                  # Route guard'ları
│       │   └── interceptors/            # HTTP interceptors
│       └── src/styles.scss              # Global stiller (SCSS)
│
├── 📚 Dokümantasyon
│   ├── README.md                        # Bu dosya
│   ├── GMAIL_SETUP_INSTRUCTIONS.md     # Email yapılandırma rehberi
│   └── SECURITY-README.md               # Güvenlik dokümantasyonu
│
└── ⚙️ Yapılandırma Dosyaları
    ├── .gitignore                       # Git ignore kuralları
    └── requirements.txt                 # Python bağımlılıkları
└── ⚙️ Yapay Zeka ile Veri Üretimi
    ├── llm entegrasyonu ve veri üretimi.ipynb         # Veri ürettiğimiz colab dosyası
```

## 🚀 Kurulum ve Başlangıç

### Ön Gereksinimler

- **Python 3.8+** (Veri analizi için)
- **PostgreSQL 12+** (Veritabanı için)
- **Java 17+** (Spring Boot backend için)
- **Node.js 16+** (Angular frontend için)
- **Git** (Versiyon kontrolü için)

### 1. Repository'yi Klonlama

```bash
git clone <repository-url>
cd datacleaning
```

### 2. Python Ortamının Kurulması

```bash
# Virtual environment oluşturma
python -m venv venv

# Virtual environment'ı aktifleştirme (Windows)
venv\Scripts\activate

# Virtual environment'ı aktifleştirme (macOS/Linux)
source venv/bin/activate

# Bağımlılıkları yükleme
pip install -r requirements.txt
```

### 3. PostgreSQL Veritabanı Kurulumu

```sql
-- PostgreSQL'de veritabanı oluşturma
CREATE DATABASE fitness_programs;
```

Veritabanı bağlantı bilgilerini `query_db.py` ve `db_import.py` dosyalarında güncelleyin:

```python
db_params = {
    'dbname': 'fitness_programs',
    'user': 'your_username',
    'password': 'your_password',
    'host': 'localhost',
    'port': '5432'
}
```

### 4. Backend Kurulumu (Spring Boot)

```bash
cd backend/program-tracker

# Maven ile bağımlılıkları yükleme ve çalıştırma
./mvnw spring-boot:run

# Veya Windows için
mvnw.cmd spring-boot:run
```

### 5. Frontend Kurulumu (Angular)

```bash
cd frontend/fitness-front

# Bağımlılıkları yükleme
npm install

# Development server'ı başlatma
ng serve
```

## 📈 Veri Analizi Süreci

### 1. Veri Temizleme

```bash
# Jupyter Notebook'u başlatma
jupyter notebook data_analysis.ipynb
```

Ana veri temizleme adımları:
- ✅ Eksik değerlerin tespit edilmesi
- ✅ Description alanı eksik değerlerinin '(random generated)' ile doldurulması
- ✅ Equipment eksik değerlerinin en sık kullanılan değerle doldurulması
- ✅ Program length eksik değerlerinin medyan ile doldurulması
- ✅ Tarih alanlarının rastgele değerlerle doldurulması

### 2. Veri Analizi Özellikleri

- **Veri Seti Boyutu**: 2,598 satır, 10 sütun
- **Temizlenmiş Veri**: Tüm eksik değerler dolduruldu
- **Görselleştirme**: Matplotlib ve Seaborn ile detaylı analizler
- **İstatistiksel Özetler**: Sayısal sütunlar için kapsamlı istatistikler

### 3. Veritabanı İmport

```bash
# Temizlenmiş veriyi PostgreSQL'e aktarma
python db_import.py

# Veritabanını sorgulama
python query_db.py
```

## 🔧 Kullanım

### Veri Analizi Notebook'u

1. `data_analysis.ipynb` dosyasını Jupyter'da açın
2. Tüm hücreleri sırayla çalıştırın
3. Oluşturulan grafikleri ve analizleri inceleyin

### Python Scriptleri

```bash
# Ana veri işleme scripti
python main.py

# Pandas ile veri temizleme
python pandas_temizleme.py

# Veritabanı sorguları
python query_db.py
```

## 🧠 Yapay Zekâ ile Veri Üretimi Süreci

Bu proje kapsamında, hazır veri setinden yeni içerikler üretmek amacıyla bir LLM (Large Language Model) entegrasyonu gerçekleştirildi. Sürecin tüm akışı `llm entegrasyonu ve veri üretimi.ipynb` notebook'u içinde bulunmaktadır.

### 1) Ortam Hazırlığı
- **Python** ortamında gerekli kütüphaneler kuruldu (ör. `transformers`, `pandas`, vb.).
- Veri setine yerel dosyadan veya Google Drive üzerinden CSV formatında erişildi.

Örnek kurulum (öneri):

```bash
pip install transformers accelerate sentencepiece
# PyTorch kurulumu için: https://pytorch.org/get-started/locally/
```

### 2) Veri Yükleme
- `program_summary_processed.csv` bir DataFrame olarak okundu.
- Her satırdan `title`, `goal`, `level`, `equipment` gibi alanlar seçilerek modele girdi olacak biçimde hazırlandı.

### 3) Modelin Yüklenmesi
- Hugging Face Model Hub üzerinden `tencent/Hunyuan-7B-Instruct` modeli seçildi.
- `AutoTokenizer` ve `AutoModelForCausalLM` ile model yüklendi.
- GPU desteği için `device_map="auto"` kullanıldı.

### 4) Prompt Hazırlığı
- Sisteme kısa ve net bir talimat verildi: “Yedi günlük antrenman planını yalnızca gün başlıklarıyla üret.”
- Kullanıcı mesajı, satırdaki verilerden (`title`, `goal`, `level`, `equipment`) dinamik olarak oluşturuldu.

### 5) Çıktı Üretimi
- `model.generate()` ile yanıt üretildi.
- Çıktılar düzenli hâle getirilerek `<answer>` bloklarından ayrıştırıldı.
- Yanıtlar “Day 1 … Day 7” şeklinde bölünerek yapılandırıldı.

### 6) Sonuçların Kaydedilmesi
- Tüm sonuçlar `all_schedules` listesine eklendi.
- Pandas ile yeni bir DataFrame oluşturuldu.
- Çıktılar `parcali_programs.csv` dosyasına kaydedildi.

### Neden Bu Yaklaşım?
- **Maliyet/Kısıt aşımı**: API kısıtlamaları ve maliyetleri aşmak için model doğrudan indirildi.
- **Veri gizliliği**: Dış servislere veri göndermeden, local/Colab ortamında süreç yürütüldü.
- **Esneklik**: Aynı yapı bir sunucuya deploy edilerek 7/24 çalışan bir servis hâline getirilebilir.

### Neden LLM Entegrasyonu Ekledik?
- **Veri Üretimini Genişletmek**: Statik verinin ötesine geçip yeni türev çıktılar üretildi; uygulama dinamik içerik üretebilir hâle geldi.
- **Model Kullanımını Deneyimlemek**: Hugging Face modelleri local/Colab ortamında, API kullanmadan entegre edildi.
- **Gerçek Hayat Senaryolarına Yaklaşmak**: Müşteri destek robotları, bakım-asistan sistemleri gibi alanlara uyarlanabilir bir prototip oluşturuldu.
- **Veri Gizliliğini Vurgulamak**: Dış servis sağlayıcılarına veri göndermeden AI kullanımının mümkün olduğu gösterildi.

### İlgili Dosyalar
- Notebook: `llm entegrasyonu ve veri üretimi.ipynb`
- Girdi veri seti: `program_summary_processed.csv`
- Üretilen çıktı: `parcali_programs.csv`

### Web Uygulaması

1. Backend sunucusunu başlatın (port: 8080)
2. Frontend sunucusunu başlatın (port: 4200)
3. Tarayıcıda `http://localhost:4200` adresine gidin

## 📊 Veri Seti Bilgileri

### Ana Sütunlar

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| `title` | String | Program başlığı |
| `description` | Text | Program açıklaması |
| `level` | Array[String] | Zorluk seviyeleri |
| `goal` | Array[String] | Program hedefleri |
| `equipment` | String | Gerekli ekipman |
| `program_length` | Float | Program süresi (hafta) |
| `time_per_workout` | Float | Antrenman süresi (dakika) |
| `total_exercises` | Integer | Toplam egzersiz sayısı |
| `created` | Timestamp | Oluşturulma tarihi |
| `last_edit` | Timestamp | Son düzenleme tarihi |

### İstatistiksel Özetler

- **Ortalama Program Süresi**: 8.81 hafta
- **Ortalama Antrenman Süresi**: 69.04 dakika
- **Ortalama Egzersiz Sayısı**: 232.88
- **En Popüler Ekipman**: Full Gym

## 🛡️ Güvenlik

Proje güvenlik özellikleri için [`SECURITY-README.md`](SECURITY-README.md) dosyasını inceleyin.

## 📧 Email Yapılandırması

Gmail entegrasyonu için [`GMAIL_SETUP_INSTRUCTIONS.md`](GMAIL_SETUP_INSTRUCTIONS.md) dosyasındaki adımları takip edin.



## 🙏 Teşekkürler

Bu proje aşağıdaki açık kaynak teknolojileri kullanmaktadır:
- **Python**: Veri analizi ve işleme
- **Pandas**: Veri manipülasyonu
- **PostgreSQL**: Veritabanı yönetimi
- **Spring Boot**: Backend framework
- **Angular**: Frontend framework
- **Jupyter**: Etkileşimli veri analizi

---

