import { Component } from '@angular/core';

// TODO: give the correct tags to the projects
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LineChartComponent } from '@angular-monorepo/shared/ui-chart';

const documentStyle = getComputedStyle(document.documentElement);

@Component({
  standalone: true,
  imports: [
    LineChartComponent
  ],
  selector: 'angular-monorepo-statistics1',
  template: '<chart-line-chart [data]="chartData"></chart-line-chart>',  
})
export class Statistics1Component {
  title = 'Statistics1';

  private chartData_ = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'First Dataset',
        data: [10, 20, 30, 40, 50, 20, 15],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        tension: 0.4,
      },
      {
        label: 'Second Dataset',
        data: [18, 28, 45, 50, 86, 27, 90],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--pink-500'),
        tension: 0.4,
      },
    ],
  };

  get chartData(): unknown {
    return this.chartData_;
  }  
  
}
