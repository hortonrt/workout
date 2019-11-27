import { Component, OnInit, Input } from '@angular/core';
import { UserMeasurementHistory } from 'src/app/_models/UserMeasurementHistory';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-breakdown-graph',
  templateUrl: './breakdown-graph.component.html',
  styleUrls: ['./breakdown-graph.component.scss']
})
export class BreakdownGraphComponent implements OnInit {
  @Input() data = null;
  options = null;
  container = null;
  @Input() percent = false;
  constructor() { }

  ngOnInit() {
    const data = Object.assign([], this.data);
    this.container = Math.random().toString(36).substring(2, 15);
    this.data = data.sort((a, b) => (new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime()));
    data.map(x => {
      x.FatL = parseFloat(((x.Fat / 100) * x.Weight).toFixed(1));
      x.WaterL = parseFloat(((x.Water / 100) * x.Weight).toFixed(1));
    });
    this.options = {
      chart: { type: 'column' },
      credits: { enabled: false },
      title: {
        text: ''
      },
      xAxis: {
        categories: data.map(x => x.DateCreated)
      },
      yAxis: {
        title: {
          text: 'Lbs'
        }
      },
      plotOptions: {
        column: {
          stacking: this.percent ? 'percent' : 'normal',
          dataLabels: {
            enabled: true
          }
        },
        spline: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Weight',
        type: 'spline',
        data: data.map(x => ({ y: x.Weight }))
      }, {
        name: 'Fat',
        data: data.map(x => ({ y: x.FatL, pcnt: x.Fat })),
        tooltip: {
          pointFormat: '' +
            '{point.y} lbs / {point.pcnt}%'
        },
      }, {
        name: 'Bone',
        data: data.map(x => ({ y: x.Bone, pcnt: (x.Bone / x.Weight * 100).toFixed(1) })),
        tooltip: {
          pointFormat: '' +
            '{point.y} lbs / {point.pcnt}%'
        },
      }, {
        name: 'Muscle',
        data: data.map(x => ({ y: x.Muscle, pcnt: (x.Muscle / x.Weight * 100).toFixed(1) })),
        tooltip: {
          pointFormat: '' +
            '{point.y} lbs / {point.pcnt}%'
        },
      }],

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    };
    setTimeout(() => {
      Highcharts.chart(this.container, this.options);
    });
  }
}
