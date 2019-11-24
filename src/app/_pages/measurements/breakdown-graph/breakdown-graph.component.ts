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
    this.data.map(x => {
      x.Fat = parseFloat(((x.Fat / 100) * x.Weight).toFixed(1));
      x.Water = parseFloat(((x.Water / 100) * x.Weight).toFixed(1));
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
        categories: this.data.map(x => x.DateCreated)
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
        data: this.data.map(x => x.Weight)
      }, {
        name: 'Fat',
        data: this.data.map(x => x.Fat)
      }, {
        name: 'Water',
        data: this.data.map(x => x.Water)
      }, {
        name: 'Bone',
        data: this.data.map(x => x.Bone)
      }, {
        name: 'Muscle',
        data: this.data.map(x => x.Muscle)
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

  buildData(prop) {
    const data = [];
    this.data.map((x: UserMeasurementHistory) => x[prop]);
    return data;
  }

}
