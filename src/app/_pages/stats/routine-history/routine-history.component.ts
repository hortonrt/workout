import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-routine-history',
  templateUrl: './routine-history.component.html',
  styleUrls: ['./routine-history.component.scss']
})
export class RoutineHistoryComponent implements OnInit {
  @Input() data = null;
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
      series: this.data.Series,
      tooltip: {
        formatter() {
          return 'ORM: ' + this.point.y + '<br/>' + this.point.info;
        }
      },
    };
    setTimeout(() => {
      Highcharts.chart(this.data.Container, this.options);
    });
  }

}

