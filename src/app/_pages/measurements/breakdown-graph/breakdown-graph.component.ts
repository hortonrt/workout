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
  constructor() { }

  ngOnInit() {
    const data = Object.assign([], this.data);
    this.data = data.sort((a, b) => (new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime()));
    data.map(x => {
      x.FatL = parseFloat(((x.Fat / 100) * x.Weight).toFixed(1));
      x.WaterL = parseFloat(((x.Water / 100) * x.Weight).toFixed(1));
    });
    this.options = {
      chart: {
        type: 'spline'
      },
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
        series: {
          label: {
            connectorAllowed: false
          }
        }
      },
      series: [{
        name: 'Weight',
        data: data.map(x => x.Weight)
      }, {
        name: 'Fat',
        data: data.map(x => x.FatL)
      }, {
        name: 'Water',
        data: data.map(x => x.WaterL)
      }, {
        name: 'Bone',
        data: data.map(x => x.Bone)
      }, {
        name: 'Muscle',
        data: data.map(x => x.Muscle)
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
    Highcharts.chart('containerb', this.options);
  }
}
