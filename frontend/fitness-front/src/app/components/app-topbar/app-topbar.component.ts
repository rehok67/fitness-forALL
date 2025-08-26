import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { Tooltip } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, Button, Badge, Tooltip],
  templateUrl: './app-topbar.component.html',
  styleUrls: ['./app-topbar.component.scss']
})
export class AppTopbarComponent implements OnInit {
  private router = inject(Router);
  
  // Tema için sinyaller
  public isDarkMode = signal(false);
  public currentTheme = signal('emerald');
  public showThemePanel = signal(false);
  public showMobileMenu = signal(false);
  
  // Menü itemları
  public topbarMenuItems = signal<MenuItem[]>([]);
  
  ngOnInit() {
    this.initializeMenus();
    this.loadThemePreferences();
  }

  private initializeMenus() {
    // Menu itemları boş - artık gerek yok
    this.topbarMenuItems.set([]);
  }

  // Menu item execute helper
  executeMenuCommand(item: MenuItem) {
    if (item.command) {
      item.command({} as any); // PrimeNG MenuItemCommandEvent mock
    }
  }

  private loadThemePreferences() {
    // LocalStorage'dan tema tercihlerini yükle
    const savedTheme = localStorage.getItem('app-theme');
    const savedDarkMode = localStorage.getItem('app-dark-mode') === 'true';
    
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
      this.applyTheme(savedTheme);
    }
    
    if (savedDarkMode) {
      this.isDarkMode.set(true);
      this.applyDarkMode(true);
    }
  }

  // Tema değiştirme
  toggleDarkMode() {
    const newDarkMode = !this.isDarkMode();
    this.isDarkMode.set(newDarkMode);
    this.applyDarkMode(newDarkMode);
    localStorage.setItem('app-dark-mode', newDarkMode.toString());
  }

  private applyDarkMode(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Renk teması değiştirme
  changeTheme(color: string) {
    this.currentTheme.set(color);
    this.applyTheme(color);
    localStorage.setItem('app-theme', color);
    this.showThemePanel.set(false);
  }

  private applyTheme(color: string) {
    // CSS custom properties ile tema değişimi
    document.documentElement.style.setProperty('--primary-color', `var(--${color}-500)`);
    document.documentElement.style.setProperty('--primary-color-rgb', this.hexToRgb(this.getColorValue(color)));
  }

  private getColorValue(color: string): string {
    const colorMap: {[key: string]: string} = {
      'emerald': '#10b981',
      'green': '#22c55e',
      'lime': '#84cc16',
      'orange': '#f97316',
      'amber': '#f59e0b',
      'yellow': '#eab308',
      'teal': '#14b8a6',
      'cyan': '#06b6d4',
      'sky': '#0ea5e9',
      'blue': '#3b82f6',
      'indigo': '#6366f1',
      'violet': '#8b5cf6',
      'purple': '#a855f7',
      'fuchsia': '#d946ef',
      'pink': '#ec4899',
      'rose': '#f43f5e'
    };
    return colorMap[color] || colorMap['emerald'];
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    return '16, 185, 129'; // emerald default
  }

  // Panel toggle işlemleri
  toggleThemePanel() {
    this.showThemePanel.update(current => !current);
  }

  toggleMobileMenu() {
    this.showMobileMenu.update(current => !current);
  }

  // Navigation yardımcı metodu
  private navigateTo(path: string) {
    this.router.navigate([path]);
  }

  // Ana sayfaya git
  goHome() {
    this.router.navigate(['/']);
  }

  // Menu toggle işlemi (mobil için)
  toggleMenu() {
    // Menü toggle mantığı burada olacak
    console.log('Menu toggled');
  }

  // Auth navigation methods
  goLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
