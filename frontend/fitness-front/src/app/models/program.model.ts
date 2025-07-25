// Backend'den gelen Program verisinin TypeScript karşılığı
export interface Program {
  id: number;
  title: string;
  description: string;
  levels: string[];          // ["Beginner", "Intermediate"]
  goals: string[];           // ["Bodybuilding", "Powerlifting"]
  equipment: string;         // "Full Gym", "At Home", etc.
  programLength: number;     // Program süresi (hafta)
  timePerWorkout: number;    // Antrenman süresi (dakika)
  totalExercises: number;    // Toplam egzersiz sayısı
  createdAt?: string;        // Optional: oluşturulma tarihi
  updatedAt?: string;        // Optional: güncellenme tarihi
}

// Search endpoint için parametreler
export interface ProgramSearchParams {
  equipment?: string;        // "Full Gym", "At Home", etc.
  level?: string;           // "Beginner", "Intermediate", etc.
  goal?: string;            // "Bodybuilding", "Powerlifting", etc.
  maxDuration?: number;     // Maksimum antrenman süresi (dakika)
}

// Yeni program ekleme için - Backend ProgramRequestDTO ile uyumlu
export interface CreateProgramRequest {
  title: string;
  description: string;
  levels: string[];         // ["Beginner"]
  goals: string[];          // ["Bodybuilding"]
  equipment: string;        // "Full Gym"
  programLength: number;    // 8
  timePerWorkout: number;   // 60
  totalExercises: number;   // 24
}

// Bu interface'in FAYDALARI:
// 1. IDE otomatik tamamlama verir
// 2. Hatalı field kullanımında hata gösterir
// 3. Kodun ne döndürdüğü net olur
// 4. Refactoring daha güvenli 