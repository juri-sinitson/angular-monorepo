import { ChangeDetectionStrategy, Component, OnInit, input } from '@angular/core';

import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'chart-line-chart',
  standalone: true,
  imports: [ChartModule],
  template: `
    <div class="card">
      <p-chart type="line" [data]="data()" [options]="options"></p-chart>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit{
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data = input<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private options_: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get options(): any {
    return this.options_;
  }

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options_ = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
