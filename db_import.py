import pandas as pd
import psycopg2
from psycopg2 import sql
import os
import ast

# CSV dosyasını okuyalım
current_dir = os.path.dirname(os.path.abspath(__file__))
input_file = 'program_summary_102.csv'
input_path = os.path.join(current_dir, input_file)
df = pd.read_csv(input_path)

# String olarak gelen liste verilerini gerçek listelere dönüştür
df['level'] = df['level'].apply(ast.literal_eval)
df['goal'] = df['goal'].apply(ast.literal_eval)

# Veritabanı bağlantı bilgileri
db_params = {
    'dbname': 'fitness_programs',
    'user': 'postgres',
    'password': 'deniz',  # PostgreSQL kurulumunda belirlediğiniz şifreyi girin
    'host': 'localhost',
    'port': '5432'
}

try:
    # Veritabanına bağlanma
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()
    print("Veritabanına başarıyla bağlanıldı!")

    # Varsa tabloyu sil
    cursor.execute("DROP TABLE IF EXISTS fitness_programs")
    
    # Tablo oluşturma
    create_table_query = """
    CREATE TABLE IF NOT EXISTS fitness_programs (
        title VARCHAR(255),
        description TEXT,
        level TEXT[],
        goal TEXT[],
        equipment VARCHAR(50),
        program_length FLOAT,
        time_per_workout FLOAT,
        total_exercises INTEGER,
        created TIMESTAMP,
        last_edit TIMESTAMP
    )
    """
    cursor.execute(create_table_query)
    print("Tablo başarıyla oluşturuldu!")

    # DataFrame'den verileri aktarma
    for index, row in df.iterrows():
        insert_query = """
        INSERT INTO fitness_programs 
        (title, description, level, goal, equipment, program_length, 
        time_per_workout, total_exercises, created, last_edit)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            row['title'],
            row['description'],
            row['level'],
            row['goal'],
            row['equipment'],
            row['program_length'],
            row['time_per_workout'],
            row['total_exercises'],
            row['created'],
            row['last_edit']
        )
        cursor.execute(insert_query, values)
        
        if index % 10 == 0:  # Her 10 kayıtta bir ilerleme göster
            print(f"{index} kayıt aktarıldı...")

    # Değişiklikleri kaydet
    conn.commit()
    print("Veriler başarıyla PostgreSQL veritabanına aktarıldı!")

except Exception as e:
    print(f"Bir hata oluştu: {e}")
    if conn:
        conn.rollback()

finally:
    # Bağlantıyı kapat
    if conn:
        cursor.close()
        conn.close()
        print("Veritabanı bağlantısı kapatıldı.")
