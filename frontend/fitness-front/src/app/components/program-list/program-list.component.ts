import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Program, ProgramSearchParams } from '../../models/program.model';
import { ProgramService } from '../../services/program.service';
import { AuthService } from '../../services/auth.service';
import { UserInfo, AUTH_STORAGE_KEYS } from '../../models/auth.model';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { AddProgramComponent } from '../add-program/add-program.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-program-list',
  imports: [CommonModule, SearchFilterComponent, AddProgramComponent, RouterLink],
  templateUrl: './program-list.component.html',
  styleUrl: './program-list.component.scss'
})
export class ProgramListComponent implements OnInit {
  
  // ViewChild - Child component'e erişim
  @ViewChild(AddProgramComponent) addProgramComponent!: AddProgramComponent;

  // Component state (durum)
  programs: Program[] = [];
  allPrograms: Program[] = []; // Orijinal tüm programlar (filtreleme için)
  loading = false;
  error = '';
  isFiltering = false;

  // Auth state - Observable'lar
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<UserInfo | null>;

  // Service injections
  private programService = inject(ProgramService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    console.log('📝 ProgramListComponent oluşturuldu');
    
    // Auth state'ini dinle
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.user$;
    
    // Debug için auth state'ini logla
    this.authService.authState$.subscribe(state => {
      console.log('🔐 Auth State:', {
        isAuthenticated: state.isAuthenticated,
        user: state.user ? `${state.user.username} (${state.user.email})` : null,
        hasToken: !!state.token
      });
    });
  }

  ngOnInit(): void {
    console.log('🚀 ProgramListComponent başlatildi');
    this.loadPrograms();
  }

  // Programları yükle (filtresiz - tüm programlar)
  loadPrograms(): void {
    this.loading = true;
    this.error = '';
    
    console.log('📡 Programlar yukleniyor...');
    
    this.programService.getAllPrograms().subscribe({
      next: (programs: Program[]) => {
        this.allPrograms = programs; // Orijinal listeyi sakla
        this.programs = programs;     // Gösterilen liste
        this.loading = false;
        console.log('✅ Programlar yuklendi:', programs.length);
      },
      error: (error) => {
        this.error = 'Programlar yuklenirken hata olustu';
        this.loading = false;
        console.error('❌ Yukleme hatasi:', error);
      }
    });
  }

  // Filter değiştiğinde çağrılır
  onFilterChange(filters: ProgramSearchParams): void {
    console.log('🔧 Filter uygulanıyor:', filters);
    
    // Eğer filter boşsa, tüm programları göster
    if (this.isFilterEmpty(filters)) {
      this.programs = [...this.allPrograms];
      this.isFiltering = false;
      console.log('📋 Tüm programlar gösteriliyor:', this.programs.length);
      return;
    }

    // Backend'den filtrelenmiş veri çek
    this.isFiltering = true;
    this.loading = true;
    
    this.programService.searchPrograms(filters).subscribe({
      next: (filteredPrograms: Program[]) => {
        this.programs = filteredPrograms;
        this.loading = false;
        console.log('🎯 Filtrelenmiş programlar:', filteredPrograms.length);
      },
      error: (error) => {
        this.error = 'Filtreleme sirasinda hata olustu';
        this.loading = false;
        console.error('❌ Filtreleme hatasi:', error);
      }
    });
  }

  // Clear filters
  onClearFilters(): void {
    console.log('🧹 Filtreler temizleniyor');
    this.programs = [...this.allPrograms];
    this.isFiltering = false;
  }

  // Filters boş mu kontrol et
  private isFilterEmpty(filters: ProgramSearchParams): boolean {
    return !filters.equipment && !filters.level && !filters.goal && !filters.maxDuration;
  }

  // Performance için trackBy
  trackByProgramId(index: number, program: Program): number {
    return program.id;
  }

  // Add program modal aç
  openAddProgramModal(): void {
    console.log('➕ Add program modal aciliyor');
    this.addProgramComponent.showModal = true;
  }

  // Program eklendikten sonra çağrılır
  onProgramAdded(): void {
    console.log('✅ Yeni program eklendi, liste guncelleniyor');
    this.loadPrograms(); // Listeyi yenile
  }

  // Program seçildiğinde - Router ile detay sayfasına git
  onProgramClick(program: Program): void {
    console.log('🎯 Program secildi, detay sayfasina gidiliyor:', program.title);
    this.router.navigate(['/program', program.id]);
  }

  // ============================================================================
  // AUTH METHODS
  // ============================================================================

  // Logout
  logout(): void {
    console.log('🚪 Kullanıcı çıkış yapıyor');
    this.authService.logout();
  }

  // Debug: Auth state'ini temizle
  clearAuthState(): void {
    console.log('🧹 Auth state temizleniyor (debug)');
    // ✅ DOĞRU KEY'LERİ KULLAN:
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_ME);
    window.location.reload();
  }
} 