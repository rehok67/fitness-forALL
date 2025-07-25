import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from '../../services/program.service';
import { CreateProgramRequest } from '../../models/program.model';

@Component({
  selector: 'app-add-program',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-program.component.html',
  styleUrl: './add-program.component.scss'
})
export class AddProgramComponent {
  
  // Form ve state
  programForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  showModal = false;

  // Output events
  @Output() programAdded = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  // Services
  private fb = inject(FormBuilder);
  private programService = inject(ProgramService);

  constructor() {
    console.log('📝 AddProgramComponent oluşturuldu');
    this.programForm = this.createForm();
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
        Validators.min(1),
        Validators.max(52)
      ]],
      timePerWorkout: ['', [
        Validators.required,
        Validators.min(5),
        Validators.max(300)
      ]],
      totalExercises: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(50)
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
    this.showModal = true;
    this.programForm.reset();
    this.submitError = '';
    console.log('📝 Modal açıldı');
  }

  // Modal kapat
  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
    console.log('❌ Modal kapatıldı');
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

    console.log('📡 Program ekleniyor:', programData);

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