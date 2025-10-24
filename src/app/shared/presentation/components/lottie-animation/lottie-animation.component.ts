import { Component, Input, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-lottie-animation',
  template: `
    <div 
      [style.width]="width" 
      [style.height]="height" 
      [style.max-width]="'100%'" 
      [style.max-height]="'100%'"
      [style.display]="'flex'"
      [style.justify-content]="'center'"
      [style.align-items]="'center'">
      <div class="lottie-container"></div>
    </div>
  `,
  standalone: true,
  imports: []
})
export class LottieAnimationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() animationPath: string = '';
  @Input() width: string = '200px';
  @Input() height: string = '200px';
  @Input() loop: boolean = true;
  @Input() autoplay: boolean = true;

  private animationItem: any = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Component initialization
  }

  async ngAfterViewInit() {
    try {
      console.log('Loading Lottie animation:', this.animationPath);
      const lottie = await import('lottie-web');
      const container = this.elementRef.nativeElement.querySelector('.lottie-container');
      
      if (container && this.animationPath) {
        console.log('Container found, loading animation...');
        this.animationItem = lottie.default.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: this.loop,
          autoplay: this.autoplay,
          path: this.animationPath
        });
        console.log('Animation loaded successfully');
      } else {
        console.log('Container or animationPath not found');
        this.showFallback();
      }
    } catch (error) {
      console.error('Error loading Lottie animation:', error);
      this.showFallback();
    }
  }

  private showFallback() {
    const container = this.elementRef.nativeElement.querySelector('.lottie-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; color: #667eea; font-size: 4rem; padding: 20px;">
          📦
        </div>
      `;
    }
  }

  ngOnDestroy() {
    if (this.animationItem) {
      this.animationItem.destroy();
    }
  }
}
