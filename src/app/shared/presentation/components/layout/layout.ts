import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Header } from '../header/header';
import { AuthService } from '../../../application/auth.service';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    Header,
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  showHeader = signal(true);
  
  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;
      // Hide header on splash, login, register
      this.showHeader.set(
        !url.includes('/splash') && 
        !url.includes('/auth/login') && 
        !url.includes('/auth/register')
      );
    });
  }
}
