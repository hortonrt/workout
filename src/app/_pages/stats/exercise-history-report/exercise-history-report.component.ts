import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-exercise-history-report',
  templateUrl: './exercise-history-report.component.html'
})
export class ExerciseHistoryReportComponent implements OnInit {
  @Input() data: any;
  options: any;
  constructor() { }

  ngOnInit() {
    this.options = {
      chart: { type: 'column', height: '150px' },
      title: { text: '' },
      xAxis: { categories: this.data.Categories },
      yAxis: { title: { enabled: false } },
      legend: { enabled: false },
      credits: { enabled: false },
      series: this.data.Series
    };
    setTimeout(() => {
      Highcharts.chart(this.data.Container, this.options);
    });
  }

}

