import psycopg2
from psycopg2 import sql

# Veritabanı bağlantı bilgileri
db_params = {
    'dbname': 'fitness_programs',
    'user': 'postgres',
    'password': 'deniz',
    'host': 'localhost',
    'port': '5432'
}

try:
    # Veritabanına bağlanma
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()
    print("Veritabanına başarıyla bağlanıldı!")

    # 1. Toplam kayıt sayısı
    cursor.execute("SELECT COUNT(*) FROM fitness_programs")
    total_count = cursor.fetchone()[0]
    print(f"\nToplam kayıt sayısı: {total_count}")

    # 2. İlk 5 program
    print("\nİlk 5 program:")
    print("-" * 50)
    cursor.execute("SELECT title, equipment, program_length FROM fitness_programs LIMIT 5")
    for record in cursor.fetchall():
        print(f"Program: {record[0]}")
        print(f"Ekipman: {record[1]}")
        print(f"Program Süresi: {record[2]} hafta")
        print("-" * 50)

    # 3. Ekipman türlerine göre program sayısı
    print("\nEkipman türlerine göre program sayısı:")
    print("-" * 50)
    cursor.execute("""
        SELECT equipment, COUNT(*) as count 
        FROM fitness_programs 
        GROUP BY equipment 
        ORDER BY count DESC
    """)
    for record in cursor.fetchall():
        print(f"{record[0]}: {record[1]} program")

    # 4. Ortalama program süreleri
    print("\nOrtalama program süreleri:")
    print("-" * 50)
    cursor.execute("""
        SELECT 
            equipment,
            ROUND(AVG(program_length)::numeric, 2) as avg_length,
            ROUND(AVG(time_per_workout)::numeric, 2) as avg_workout_time
        FROM fitness_programs 
        GROUP BY equipment 
        ORDER BY avg_length DESC
    """)
    for record in cursor.fetchall():
        print(f"Ekipman: {record[0]}")
        print(f"Ortalama Program Süresi: {record[1]} hafta")
        print(f"Ortalama Antrenman Süresi: {record[2]} dakika")
        print("-" * 50)

    # 5. Tüm sütunların örnek değerlerini kontrol et
    print("\nSütun değerlerinin kontrolü:")
    print("-" * 50)
    cursor.execute("""
        SELECT 
            title, description, level, goal, equipment,
            program_length, time_per_workout, total_exercises,
            created, last_edit
        FROM fitness_programs 
        LIMIT 5
    """)
    columns = ['title', 'description', 'level', 'goal', 'equipment', 
              'program_length', 'time_per_workout', 'total_exercises',
              'created', 'last_edit']
    for record in cursor.fetchall():
        for i, col in enumerate(columns):
            print(f"{col}: {record[i]}")
        print("-" * 50)

except Exception as e:
    print(f"Bir hata oluştu: {e}")

finally:
    if conn:
        cursor.close()
        conn.close()
        print("\nVeritabanı bağlantısı kapatıldı.")
