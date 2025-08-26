import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Program } from '../../models/program.model';
import { ProgramService } from '../../services/program.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-program-detail',
  imports: [CommonModule],
  templateUrl: './program-detail.component.html',
  styleUrl: './program-detail.component.scss'
})
export class ProgramDetailComponent implements OnInit {
  
  // Component state
  program: Program | null = null;
  loading = true;
  error = '';
  programId: number | null = null;
  
  // Service injections
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private programService = inject(ProgramService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    console.log('🚀 ProgramDetailComponent başlatildi');
    
    // URL'den ID parametresini al
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id && !isNaN(id)) {
        this.programId = id;
        console.log('📍 Program ID:', this.programId);
        this.loadProgramDetail(id);
      } else {
        this.error = 'Geçersiz program ID';
        this.loading = false;
      }
    });
  }

  // Program detayını yükle
  loadProgramDetail(id: number): void {
    this.loading = true;
    this.error = '';
    
    console.log('📡 Program detayi yukleniyor:', id);
    
    this.programService.getProgramById(id).subscribe({
      next: (program: Program) => {
        this.program = program;
        this.loading = false;
        console.log('✅ Program detayi yuklendi:', program.title);
      },
      error: (error) => {
        this.error = 'Program detayi yuklenirken hata olustu';
        this.loading = false;
        console.error('❌ Detay yukleme hatasi:', error);
      }
    });
  }

  // Geri dönüş
  goBack(): void {
    console.log('⬅️ Geri donuluyor');
    this.router.navigate(['/']);
  }

  // Program düzenleme (sadece admin)
  editProgram(): void {
    if (!this.authService.isAdmin()) {
      console.log('❌ Yetkisiz erişim: Sadece adminler program düzenleyebilir');
      alert('Bu işlemi gerçekleştirmek için admin yetkisine sahip olmanız gerekir.');
      return;
    }
    
    console.log('✏️ Program duzenlenecek:', this.program?.id);
    if (this.programId) {
      this.router.navigate(['/admin/program/edit', this.programId]);
    }
  }

  // Admin kontrolü
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Haftalık plan sayfasına geçiş
  goToWeeklyPlan(): void {
    if (this.programId) {
      this.router.navigate(['/program', this.programId, 'weekly-plan']);
    }
  }
} 