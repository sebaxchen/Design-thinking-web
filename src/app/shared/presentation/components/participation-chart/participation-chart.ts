import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-participation-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-wrapper">
        <canvas #chartCanvas class="chart-canvas" width="1200" height="450"></canvas>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
      margin-bottom: 20px;
      max-width: 1000px;
      margin: 0 auto 20px auto;
      border: 1px solid rgba(102, 126, 234, 0.1);
      position: relative;
      overflow: hidden;
    }
    
    .chart-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
      border-radius: 20px 20px 0 0;
    }
    
    .chart-title {
      margin: 0 0 20px 0;
      font-size: 1.4rem;
      font-weight: 700;
      color: #2c3e50;
      text-align: center;
      font-family: 'Inter', sans-serif;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: relative;
    }
    
    .chart-title::after {
      content: '📊';
      margin-left: 8px;
      font-size: 1.2rem;
    }
    
    .chart-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 450px;
      position: relative;
    }
    
    .chart-wrapper::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
      border-radius: 50%;
      z-index: 0;
    }
    
    .chart-canvas {
      max-width: 100%;
      max-height: 100%;
      width: 1200px;
      height: 450px;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }
    
    .chart-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
      transition: all 0.3s ease;
    }
    
    .chart-container:hover .chart-title {
      color: #667eea;
      transition: color 0.3s ease;
    }
  `]
})
export class ParticipationChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() type: ChartType = 'doughnut';
  
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart | null = null;

  ngOnInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart() {
    import('chart.js/auto').then(({ default: Chart }) => {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;

      const config = this.getChartConfig();
      
      this.chart = new Chart(ctx, config as ChartConfiguration);
    });
  }

  private updateChart() {
    if (this.chart) {
      const config = this.getChartConfig();
      this.chart.data = config.data;
      if (config.options) {
        this.chart.options = config.options;
      }
      this.chart.update();
    }
  }

  private getChartConfig(): ChartConfiguration {
    console.log('Chart data received:', this.data);
    
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
    ];

    const labels = this.data.map(item => item.name);
    const values = this.data.map(item => item.value);
    const backgroundColors = colors.slice(0, this.data.length);
    
    console.log('Chart labels:', labels);
    console.log('Chart values:', values);

    if (this.type === 'doughnut') {
      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: backgroundColors,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.3,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                  size: 12,
                  weight: 600,
                  family: "'Inter', sans-serif"
                },
                color: '#2c3e50'
              }
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#2c3e50',
              bodyColor: '#2c3e50',
              borderColor: '#667eea',
              borderWidth: 2,
              cornerRadius: 12,
              displayColors: true,
              titleFont: {
                size: 14,
                weight: 'bold',
                family: "'Inter', sans-serif"
              },
              bodyFont: {
                size: 13,
                weight: 500,
                family: "'Inter', sans-serif"
              },
              padding: 12,
              callbacks: {
                title: function(context: any) {
                  return `📊 ${context[0].label}`;
                },
                label: function(context: any) {
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `Tareas: ${context.parsed} (${percentage}%)`;
                },
                afterLabel: function(context: any) {
                  return '✨ ¡Excelente trabajo!';
                }
              }
            }
          }
        }
      };
    }

    if (this.type === 'bar') {
      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Tareas Completadas',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 3,
            borderRadius: 12,
            borderSkipped: false,
            hoverBackgroundColor: backgroundColors.map(color => color + 'CC'),
            hoverBorderWidth: 4,
            hoverBorderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(102, 126, 234, 0.1)',
                lineWidth: 2
              },
              ticks: {
                color: '#2c3e50',
                font: {
                  size: 12,
                  weight: 600,
                  family: "'Inter', sans-serif"
                },
                padding: 8,
                stepSize: 1,
                callback: function(value: any) {
                  return value + ' 📊';
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#2c3e50',
                font: {
                  size: 12,
                  weight: 600,
                  family: "'Inter', sans-serif"
                },
                padding: 12,
                maxRotation: 0
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#2c3e50',
              bodyColor: '#2c3e50',
              borderColor: '#667eea',
              borderWidth: 2,
              cornerRadius: 12,
              displayColors: true,
              titleFont: {
                size: 14,
                weight: 'bold',
                family: "'Inter', sans-serif"
              },
              bodyFont: {
                size: 13,
                weight: 500,
                family: "'Inter', sans-serif"
              },
              padding: 12,
              callbacks: {
                title: function(context: any) {
                  return `📈 ${context[0].label}`;
                },
                label: function(context: any) {
                  return `Tareas completadas: ${context.parsed.y}`;
                },
                afterLabel: function(context: any) {
                  return '🎯 ¡Sigue así!';
                }
              }
            }
          }
        }
      };
    }

    if (this.type === 'line') {
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Progreso',
            data: values,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 4,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 3,
            pointRadius: 8,
            pointHoverRadius: 12,
            pointHoverBackgroundColor: '#764ba2',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#2c3e50',
              bodyColor: '#2c3e50',
              borderColor: '#667eea',
              borderWidth: 2,
              cornerRadius: 12,
              displayColors: true,
              titleFont: {
                size: 14,
                weight: 'bold',
                family: "'Inter', sans-serif"
              },
              bodyFont: {
                size: 13,
                weight: 500,
                family: "'Inter', sans-serif"
              },
              padding: 12,
              callbacks: {
                title: function(context: any) {
                  return `📈 ${context[0].label}`;
                },
                label: function(context: any) {
                  return `Progreso: ${context.parsed.y}%`;
                },
                afterLabel: function(context: any) {
                  return '🚀 ¡Excelente progreso!';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(102, 126, 234, 0.1)',
                lineWidth: 2
              },
              ticks: {
                color: '#2c3e50',
                font: {
                  size: 12,
                  weight: 600,
                  family: "'Inter', sans-serif"
                },
                padding: 8,
                callback: function(value: any) {
                  return value + '%';
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#2c3e50',
                font: {
                  size: 12,
                  weight: 600,
                  family: "'Inter', sans-serif"
                },
                padding: 12,
                maxRotation: 0
              }
            }
          }
        }
      };
    }

    return {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: []
      }
    };
  }
}