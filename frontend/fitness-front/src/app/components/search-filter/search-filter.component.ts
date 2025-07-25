import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramSearchParams } from '../../models/program.model';

@Component({
  selector: 'app-search-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss'
})
export class SearchFilterComponent {
  
  // Search parameters
  searchParams: ProgramSearchParams = {};
  
  // Equipment options - Backend'den gelen verilerle uyumlu
  equipmentOptions = [
    { value: '', label: 'Tüm Ekipmanlar' },
    { value: 'Full Gym', label: 'Full Gym' },
    { value: 'Garage Gym', label: 'Garage Gym' },
    { value: 'At Home', label: 'At Home' },
    { value: 'Dumbbell Only', label: 'Dumbbell Only' }
  ];
  
  // Level options - Backend'den gelen verilerle uyumlu  
  levelOptions = [
    { value: '', label: 'Tüm Seviyeler' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Novice', label: 'Novice' }
  ];
  
  // Goal options - Backend'den gelen verilerle uyumlu
  goalOptions = [
    { value: '', label: 'Tüm Hedefler' },
    { value: 'Bodybuilding', label: 'Bodybuilding' },
    { value: 'Powerlifting', label: 'Powerlifting' },
    { value: 'Powerbuilding', label: 'Powerbuilding' },
    { value: 'Muscle & Sculpting', label: 'Muscle & Sculpting' },
    { value: 'Athletics', label: 'Athletics' },
    { value: 'Bodyweight Fitness', label: 'Bodyweight Fitness' }
  ];
  
  // Parent component'e filter değişikliklerini bildir
  @Output() filterChange = new EventEmitter<ProgramSearchParams>();
  @Output() clearFilters = new EventEmitter<void>();

  constructor() {
    console.log('🔍 SearchFilterComponent oluşturuldu');
  }

  // Filter değiştiğinde
  onFilterChange(): void {
    console.log('🎛️ Filter değişti:', this.searchParams);
    this.filterChange.emit({ ...this.searchParams });
  }

  // Filtreleri temizle
  onClearFilters(): void {
    console.log('🧹 Filtreler temizleniyor');
    this.searchParams = {};
    this.clearFilters.emit();
  }

  // Hızlı filter ayarla
  setQuickFilter(key: keyof ProgramSearchParams, value: string): void {
    console.log('🚀 Hizli filter:', key, '=', value);
    
    // Eğer aynı değer zaten seçiliyse, temizle
    if (this.searchParams[key] === value) {
      this.searchParams[key] = undefined;
    } else {
      this.searchParams[key] = value as any;
    }
    
    this.onFilterChange();
  }

  // Aktif filter sayısını hesapla
  getActiveFilterCount(): number {
    let count = 0;
    if (this.searchParams.equipment) count++;
    if (this.searchParams.level) count++;
    if (this.searchParams.goal) count++;
    if (this.searchParams.maxDuration) count++;
    return count;
  }
} 