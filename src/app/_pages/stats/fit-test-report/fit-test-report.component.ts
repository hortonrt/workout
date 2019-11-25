import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-fit-test-report',
  templateUrl: './fit-test-report.component.html',
  styleUrls: ['./fit-test-report.component.scss']
})
export class FitTestReportComponent implements OnInit {
  @Input() data: any;
  options: any;
  constructor() { }

  ngOnInit() {
    this.options = {
      chart: {
        type: 'column',
        height: '150px'
      },
      title: {
        text: '',
      },
      credits: { enabled: false },
      xAxis: {
        categories: this.data.Dates
      },
      tooltip: {
        pointFormat: '' +
          '<strong>1RM: </strong> {point.ORM}'
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },
      yAxis: {
        title: {
          enabled: true,
          text: 'Reps'
        },
        dataLabels: {
          enabled: true
        }
      },
      legend: { enabled: false },
      series: [
        {
          name: 'Reps',
          data: this.data.Reps
        }
      ]
    };
    setTimeout(() => {
      Highcharts.chart(this.data.Container, this.options);
    });
  }
}

