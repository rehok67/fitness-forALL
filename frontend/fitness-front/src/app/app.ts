import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgramService } from './services/program.service';
import { Program } from './models/program.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('fitness-front');
  
  // Service'i enjekte et
  private programService = inject(ProgramService);
  
  ngOnInit() {
    console.log('🚀 Component başlatildi');
    this.testBackendConnection();
  }
  
  // Backend baglantisini test et - Artık typed!
  testBackendConnection() {
    console.log('📞 Service uzerinden backend ile baglanti kuruluyor...');
    
    this.programService.getAllPrograms().subscribe({
      next: (programs: Program[]) => {  // Artık typed!
        console.log('✅ Service ile basarili!');
        console.log('📊 Program sayisi:', programs.length);
        console.log('📝 Ilk program title:', programs[0]?.title);
        console.log('📝 Ilk program equipment:', programs[0]?.equipment);
        console.log('📝 Ilk program duration:', programs[0]?.timePerWorkout, 'dakika');
      },
      error: (error) => {
        console.log('❌ Service ile hata:', error);
      }
    });
  }
}
