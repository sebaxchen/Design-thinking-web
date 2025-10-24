import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { FooterContent } from '../footer-content/footer-content';
import { AuthService } from '../../../application/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    Header,
    RouterOutlet,
    FooterContent
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  constructor(public authService: AuthService) {}
}
