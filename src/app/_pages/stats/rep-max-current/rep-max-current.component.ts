import { Component, OnInit, Input } from '@angular/core';
import bulletChart from 'highcharts/modules/bullet';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
bulletChart(Highcharts);

@Component({
  selector: 'app-rep-max-current',
  templateUrl: './rep-max-current.component.html',
  providers: [DatePipe]
})
export class RepMaxCurrentComponent implements OnInit {
  @Input() data: any;
  options: any;

  constructor() { }

  ngOnInit() {
    this.options = {
      chart: {
        inverted: true,
        type: 'bullet',
        height: 100
      },
      title: {
        text: ''
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        bullet: {
          pointPadding: 0.25,
          borderWidth: 0,
          color: 'rgba(0, 105, 137, 1)',
          targetOptions: {
            width: '200%'
          },
          dataLabels: {
            enabled: true
          }
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: ['1RM']
      },
      yAxis: {
        max: this.data.ByRep === 1 ? this.data.Elite + 5 : this.data.Elite + 50,
        gridLineWidth: 0,
        allowDecimals: false,
        plotBands: [{
          from: 0,
          to: this.data.Beginner,
          color: 'transparent'
        }, {
          from: this.data.Beginner,
          to: this.data.Novice,
          color: '#2dc937'
        }, {
          from: this.data.Novice,
          to: this.data.Intermediate,
          color: '#99c140'
        }, {
          from: this.data.Intermediate,
          to: this.data.Advanced,
          color: '#e7b416'
        }, {
          from: this.data.Advanced,
          to: this.data.Elite,
          color: '#db7b2b'
        }, {
          from: this.data.Elite,
          to: this.data.ByRep === 1 ? this.data.Elite + 5 : this.data.Elite + 50,
          color: '#cc3232'
        }],
        title: { text: this.data.ByRep === 1 ? 'Reps' : 'Weight (lbs)' }
      },
      series: [{
        data: [{
          y: this.data.ORM,
          target: this.data.ORM
        }]
      }],
      tooltip: {
        enabled: false
      }
    };
    setTimeout(() => {
      Highcharts.chart(this.data.Container, this.options);
    });
  }
}
