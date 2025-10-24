import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './splash.html',
  styleUrl: './splash.css'
})
export class SplashComponent implements OnInit {
  appNameLetters: string[] = [];
  sloganWords: string[] = [];
  particles: number[] = [];
  loadingDots: number[] = [];

  constructor(private router: Router) {
    this.appNameLetters = 'NoteTo'.split('');
    this.sloganWords = 'Gestiona tus tareas de manera inteligente'.split(' ');
    this.particles = Array.from({ length: 50 }, (_, i) => i);
    this.loadingDots = Array.from({ length: 3 }, (_, i) => i);
  }

  ngOnInit() {
    // Mostrar la pantalla de splash por 6 segundos y luego redirigir al login
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 6000);
  }
}
