import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {
  showHeader = signal(true);
  
  constructor(public authService: AuthService, private router: Router) {
    // Initialize header visibility on first load
    const initialUrl = this.router.url;
    this.showHeader.set(
      !(initialUrl === '/') &&
      !initialUrl.includes('/splash') && 
      !initialUrl.includes('/auth/login') && 
      !initialUrl.includes('/auth/register')
    );

    // Update header visibility on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;
      // Hide header on landing, splash, login, register
      this.showHeader.set(
        !(url === '/') &&
        !url.includes('/splash') && 
        !url.includes('/auth/login') && 
        !url.includes('/auth/register')
      );
    });
  }
}
