import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../services/program.service';
import { Ripple } from 'primeng/ripple';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';

interface DayOption {
  key: string;   // Mon, Tue, ...
  label: string; // Pazartesi, Salı, ...
}

@Component({
  selector: 'app-weekly-plan',
  standalone: true,
  imports: [CommonModule, Card, Button, Ripple],
  templateUrl: './weekly-plan.component.html',
  styleUrl: './weekly-plan.component.scss',
  animations: [
    trigger('listStagger', [
      transition(':enter', [
        query('.row', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(80, animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class WeeklyPlanComponent implements OnInit {
  programId: number | null = null;
  loading = true;
  error = '';

  entries: { dayOfWeek: string; content: string }[] = [];
  dayToContent: Record<string, string> = {};

  dayOptions: DayOption[] = [
    { key: 'Mon', label: 'Pazartesi' },
    { key: 'Tue', label: 'Salı' },
    { key: 'Wed', label: 'Çarşamba' },
    { key: 'Thu', label: 'Perşembe' },
    { key: 'Fri', label: 'Cuma' },
    { key: 'Sat', label: 'Cumartesi' },
    { key: 'Sun', label: 'Pazar' }
  ];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private programService = inject(ProgramService);

  // Sort helper if needed in template
  daySortFn = (a: any, b: any) => 0;

  accentColor(dayKey: string): string {
    const map: Record<string, string> = {
      Mon: '#42A5F5',
      Tue: '#66BB6A',
      Wed: '#FFCA28',
      Thu: '#AB47BC',
      Fri: '#EF5350',
      Sat: '#26C6DA',
      Sun: '#FFA726'
    };
    return map[dayKey] || '#42A5F5';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id && !isNaN(id)) {
        this.programId = id;
        this.fetchWeeklyPlan(id);
      } else {
        this.error = 'Geçersiz program ID';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    if (this.programId) {
      this.router.navigate(['/program', this.programId]);
    } else {
      this.router.navigate(['/']);
    }
  }

  goToExercises(dayKey: string): void {
    console.log('Egzersizlere git:', { programId: this.programId, day: dayKey });
    // Eğer özel bir rota olacaksa burada yönlendirme yapılabilir.
  }

  private fetchWeeklyPlan(id: number): void {
    this.loading = true;
    this.programService.getWeeklyPlan(id).subscribe({
      next: (res) => {
        this.entries = res.entries || [];
        this.dayToContent = this.entries.reduce<Record<string, string>>((acc, e) => {
          acc[e.dayOfWeek] = e.content || '';
          return acc;
        }, {});
        this.loading = false;
      },
      error: (err) => {
        console.error('Weekly plan yüklenemedi', err);
        this.error = 'Haftalık plan yüklenemedi';
        this.loading = false;
      }
    });
  }
}


