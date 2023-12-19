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
  selector: 'angular-monorepo-statistics2',
  template: '<chart-line-chart [data]="chartData"></chart-line-chart>',
})
export class Statistics2Component {
  title = 'Statistics2';

  private chartData_ = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'First Dataset',
        data: [15, 30, 35, 10, 60, 30, 5],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--green-500'),
        tension: 0.4,
      },
      {
        label: 'Second Dataset',
        data: [80, 10, 45, 20, 36, 47, 90],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--orange-500'),
        tension: 0.4,
      },
    ],
  };

  get chartData(): unknown {
    return this.chartData_;
  }  
}
