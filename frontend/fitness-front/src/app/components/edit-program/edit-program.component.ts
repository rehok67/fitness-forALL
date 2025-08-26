import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgramService } from '../../services/program.service';
import { AuthService } from '../../services/auth.service';
import { Program, CreateProgramRequest } from '../../models/program.model';

@Component({
  selector: 'app-edit-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-program.component.html',
  styleUrl: './edit-program.component.scss'
})
export class EditProgramComponent implements OnInit {
  
  // Services
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private programService = inject(ProgramService);
  private authService = inject(AuthService);

  // Properties
  programForm: FormGroup;
  programId: number | null = null;
  program: Program | null = null;
  isLoading = false;
  isSubmitting = false;
  submitError = '';

  constructor() {
    console.log('🚀 EditProgramComponent oluşturuldu');
    this.programForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('🚀 EditProgramComponent ngOnInit başladı');
    
    // Route params'dan program ID'sini al
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.programId = Number(id);
        console.log('📍 Program ID alındı:', this.programId);
        this.loadProgram();
      } else {
        console.error('❌ Program ID bulunamadı');
        this.router.navigate(['/']);
      }
    });
  }

  // Form oluştur
  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      equipment: ['', Validators.required],
      level: ['', Validators.required],
      goal: ['', Validators.required],
  // Backend: only positive required; no strict upper bounds
  programLength: ['', [Validators.required, Validators.min(1)]],
  timePerWorkout: ['', [Validators.required, Validators.min(1)]],
  totalExercises: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // Program verilerini yükle
  private loadProgram(): void {
    if (!this.programId) return;

    this.isLoading = true;
    console.log('📡 Program yükleniyor:', this.programId);

    this.programService.getProgramById(this.programId).subscribe({
      next: (program) => {
        console.log('✅ Program yüklendi:', program);
        this.program = program;
        this.populateForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Program yükleme hatası:', error);
        this.submitError = 'Program bilgileri yüklenirken hata oluştu.';
        this.isLoading = false;
      }
    });
  }

  // Form'u doldur
  private populateForm(): void {
    if (!this.program) return;

    console.log('📝 Form dolduruluyor:', this.program);

    // Backend'den gelen array'leri string'e çevir
    const level = Array.isArray(this.program.levels) && this.program.levels.length > 0 
      ? this.program.levels[0].replace(/[{}]/g, '') 
      : '';
    
    const goal = Array.isArray(this.program.goals) && this.program.goals.length > 0 
      ? this.program.goals[0].replace(/[{}]/g, '') 
      : '';

    this.programForm.patchValue({
      title: this.program.title,
      description: this.program.description,
      equipment: this.program.equipment,
      level: level,
      goal: goal,
      programLength: this.program.programLength,
      timePerWorkout: this.program.timePerWorkout,
      totalExercises: this.program.totalExercises
    });

    console.log('✅ Form dolduruldu:', this.programForm.value);
  }

  // Equipment seçenekleri
  equipmentOptions = [
    { value: 'Full Gym', label: 'Full Gym' },
    { value: 'Garage Gym', label: 'Garage Gym' },
    { value: 'At Home', label: 'At Home' },
    { value: 'Dumbbell Only', label: 'Dumbbell Only' }
  ];

  // Level seçenekleri  
  levelOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Novice', label: 'Novice' }
  ];

  // Goal seçenekleri
  goalOptions = [
    { value: 'Bodybuilding', label: 'Bodybuilding' },
    { value: 'Powerlifting', label: 'Powerlifting' },
    { value: 'Powerbuilding', label: 'Powerbuilding' },
    { value: 'Muscle & Sculpting', label: 'Muscle & Sculpting' },
    { value: 'Athletics', label: 'Athletics' },
    { value: 'Bodyweight Fitness', label: 'Bodyweight Fitness' }
  ];

  // Form submit
  onSubmit(): void {
    if (this.programForm.invalid) {
      this.markFormGroupTouched();
      console.log('❌ Form geçersiz:', this.programForm.errors);
      return;
    }

    if (!this.programId) {
      console.error('❌ Program ID yok');
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const formData = this.programForm.value;
    
    // Backend format'ına çevir
    const fullPayload: CreateProgramRequest = {
      title: formData.title,
      description: formData.description,
      levels: [formData.level],
      goals: [formData.goal],
      equipment: formData.equipment,
      programLength: Number(formData.programLength),
      timePerWorkout: Number(formData.timePerWorkout),
      totalExercises: Number(formData.totalExercises)
    };

  console.log('📡 Program güncelleniyor (full payload):', fullPayload);

  this.programService.updateProgram(this.programId, fullPayload).subscribe({
      next: (updatedProgram) => {
        console.log('✅ Program başarıyla güncellendi:', updatedProgram);
        this.isSubmitting = false;
        
        // Program detay sayfasına git
        this.router.navigate(['/program', this.programId]);
      },
      error: (error) => {
        console.error('❌ Program güncelleme hatası:', error);
        this.submitError = 'Program güncellenirken hata oluştu. Lütfen tekrar deneyin.';
        this.isSubmitting = false;
      }
    });
  }

  // Geri dön
  goBack(): void {
    this.router.navigate(['/program', this.programId]);
  }

  // Helper: compare arrays (simple shallow equality)
  private arraysEqual(a?: string[] | null, b?: string[] | null): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // Form validation helpers
  private markFormGroupTouched(): void {
    Object.keys(this.programForm.controls).forEach(key => {
      const control = this.programForm.get(key);
      control?.markAsTouched();
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.programForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.programForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} zorunludur`;
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} karakter olmalı`;
      if (field.errors['min']) return `Minimum ${field.errors['min'].min} olmalı`;
      if (field.errors['max']) return `Maksimum ${field.errors['max'].max} olmalı`;
    }
    return '';
  }
}
