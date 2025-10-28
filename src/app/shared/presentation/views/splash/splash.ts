import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './splash.html',
  styleUrl: './splash.css'
})
export class SplashComponent implements OnInit {
  loadingDots: number[] = [];

  constructor(private router: Router) {
    this.loadingDots = Array.from({ length: 3 }, (_, i) => i);
  }

  ngOnInit() {
    // Mostrar la pantalla de splash por 4 segundos y luego redirigir al login
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 4000);
  }
}
