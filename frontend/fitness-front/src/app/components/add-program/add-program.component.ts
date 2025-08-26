import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../services/program.service';
import { CreateProgramRequest, Program } from '../../models/program.model';

@Component({
  selector: 'app-add-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-program.component.html',
  styleUrl: './add-program.component.scss'
})
export class AddProgramComponent implements OnInit {
  
  // Form ve state
  programForm!: FormGroup;
  isSubmitting = false;
  submitError = '';
  isEditMode = false;
  programId: number | null = null;
  existingProgram: Program | null = null;

  // Output events
  @Output() programAdded = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  // Services
  private fb = inject(FormBuilder);
  private programService = inject(ProgramService);
  public route = inject(ActivatedRoute);
  public router = inject(Router);

  constructor() {
    this.programForm = this.createForm();
    console.log('📝 AddProgramComponent oluşturuldu');
    console.log('🌐 Mevcut URL:', window.location.href);
    console.log('📍 Constructor - isEditMode:', this.isEditMode);
  }

  ngOnInit(): void {
    console.log('🚀 AddProgramComponent ngOnInit - Route params kontrol ediliyor');
    
    // URL'den ID parametresini kontrol et
    this.route.params.subscribe(params => {
      console.log('📍 Route params:', params);
      const id = Number(params['id']);
      
      if (id && !isNaN(id)) {
        this.isEditMode = true;
        this.programId = id;
        console.log('✏️ Düzenleme modu aktifleştirildi. Program ID:', this.programId);
        this.loadExistingProgram(id);
      } else {
        this.isEditMode = false;
        console.log('➕ Yeni program modu');
      }
    });
    
    console.log('🧑‍💼 Program Added Component - OnInit tamamlandı');
  }

  // Mevcut programı yükle (düzenleme modu için)
  loadExistingProgram(id: number): void {
    console.log('📡 Program bilgileri yükleniyor. ID:', id);
    
    this.programService.getProgramById(id).subscribe({
      next: (program: Program) => {
        console.log('✅ Program bilgileri alındı:', program);
        this.existingProgram = program;
        this.populateForm(program);
        console.log('✅ Program bilgileri form\'a yüklendi:', program.title);
      },
      error: (error) => {
        console.error('❌ Program bilgileri yüklenirken hata:', error);
        this.submitError = 'Program bilgileri yüklenemedi';
        // Ana sayfaya yönlendir
        setTimeout(() => this.router.navigate(['/']), 3000);
      }
    });
  }

  // Formu mevcut program verisiyle doldur
  populateForm(program: Program): void {
    console.log('🔧 Form doldurulacak veriler:', program);
    
    // Backend'den gelen levels ve goals clean et
    let cleanLevel = '';
    let cleanGoal = '';
    
    if (program.levels && program.levels.length > 0) {
      // '{Novice' -> 'Novice' şeklinde temizle
      cleanLevel = program.levels[0].replace(/[{}]/g, '').trim();
      console.log('🧹 Temizlenmiş level:', cleanLevel);
    }
    
    if (program.goals && program.goals.length > 0) {
      // '{Bodybuilding}' -> 'Bodybuilding' şeklinde temizle  
      cleanGoal = program.goals[0].replace(/[{}]/g, '').trim();
      console.log('🧹 Temizlenmiş goal:', cleanGoal);
    }
    
    const formData = {
      title: program.title || '',
      description: program.description || '',
      equipment: program.equipment || '',
      level: cleanLevel,
      goal: cleanGoal,
      programLength: program.programLength || 0,
      sessionsPerWeek: 3, // Default değer (backend'de olmadığı için)
      sessionDuration: program.timePerWorkout || 0,
      totalExercises: program.totalExercises || 0
    };
    
    console.log('📝 Form\'a gönderilecek veriler:', formData);
    this.programForm.patchValue(formData);
    
    // Form değerlerini logla
    console.log('✅ Form güncel değerleri:', this.programForm.value);
  }

  // Reactive Form oluştur
  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      equipment: ['', [Validators.required]],
      level: ['', [Validators.required]], 
      goal: ['', [Validators.required]],
      programLength: ['', [
        Validators.required,
  Validators.min(1)
      ]],
      timePerWorkout: ['', [
        Validators.required,
  Validators.min(1)
      ]],
      totalExercises: ['', [
        Validators.required,
  Validators.min(1)
      ]]
    });
  }

  // Equipment seçenekleri - Backend ile uyumlu
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

  // Modal aç
  openModal(): void {
    // Reset with safe defaults to avoid invalid empty state visuals
    this.programForm.reset({
      title: '',
      description: '',
      equipment: '',
      level: '',
      goal: '',
      programLength: 1,
      timePerWorkout: 1,
      totalExercises: 1
    });
    this.submitError = '';
    console.log('📝 Modal açıldı');
  }

  // Modal kapat
  closeModal(): void {
  this.modalClosed.emit();
  console.log('❌ Modal kapatıldı');
  // Sayfa olarak kullanıldığında ana listeye dön
  this.router.navigate(['/']);
  }

  // Form submit
  onSubmit(): void {
    if (this.programForm.invalid) {
      this.markFormGroupTouched();
      console.log('❌ Form geçersiz:', this.programForm.errors);
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const formData = this.programForm.value;
    
    // Backend format'ına çevir (levels ve goals array olmalı)
    const programData: CreateProgramRequest = {
      title: formData.title,
      description: formData.description,
      levels: [formData.level], // Array'e çevir
      goals: [formData.goal],   // Array'e çevir
      equipment: formData.equipment,
      programLength: Number(formData.programLength),
      timePerWorkout: Number(formData.timePerWorkout),
      totalExercises: Number(formData.totalExercises)
    };

    if (this.isEditMode && this.programId) {
      console.log('📡 Program güncelleniyor:', programData);
      this.updateProgram(programData);
    } else {
      console.log('📡 Program ekleniyor:', programData);
      this.createProgram(programData);
    }
  }

  // Yeni program oluştur
  createProgram(programData: CreateProgramRequest): void {
    this.programService.createProgram(programData).subscribe({
      next: (newProgram) => {
        console.log('✅ Program başarıyla eklendi:', newProgram);
        this.isSubmitting = false;
        this.closeModal();
        this.programAdded.emit(); // Parent component'i bilgilendir
      },
      error: (error) => {
        console.error('❌ Program ekleme hatası:', error);
        this.submitError = 'Program eklenirken hata oluştu. Lütfen tekrar deneyin.';
        this.isSubmitting = false;
      }
    });
  }

  // Mevcut programı güncelle
  updateProgram(programData: CreateProgramRequest): void {
    if (!this.programId) return;

    console.log('✏️ Program güncelleniyor:', this.programId, programData);
    
    this.programService.updateProgram(this.programId, programData).subscribe({
      next: (updatedProgram: Program) => {
        console.log('✅ Program başarıyla güncellendi:', updatedProgram);
        this.isSubmitting = false;
        
        // Program detay sayfasına geri dön
        this.router.navigate(['/program', this.programId]);
      },
      error: (error) => {
        console.error('❌ Program güncelleme hatası:', error);
        this.submitError = 'Program güncellenirken hata oluştu. Lütfen tekrar deneyin.';
        this.isSubmitting = false;
      }
    });
  }

  // Form alanlarını touched olarak işaretle (validation görünsün)
  private markFormGroupTouched(): void {
    Object.keys(this.programForm.controls).forEach(key => {
      const control = this.programForm.get(key);
      control?.markAsTouched();
    });
  }

  // Field error kontrolü
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.programForm.get(fieldName);
    if (!field) return false;
    
    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched);
    }
    return field.invalid && (field.dirty || field.touched);
  }

  // Error mesajı getir
  getErrorMessage(fieldName: string): string {
    const field = this.programForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    if (field.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength']?.requiredLength;
      return `En az ${requiredLength} karakter olmalı`;
    }
    if (field.hasError('maxlength')) {
      const requiredLength = field.errors?.['maxlength']?.requiredLength;
      return `En fazla ${requiredLength} karakter olmalı`;
    }
    if (field.hasError('min')) {
      const min = field.errors?.['min']?.min;
      return `En az ${min} olmalı`;
    }
    if (field.hasError('max')) {
      const max = field.errors?.['max']?.max;
      return `En fazla ${max} olmalı`;
    }
    return '';
  }
} 