import { Component, OnInit, Input } from '@angular/core';
import { UserMeasurementHistory } from 'src/app/_models/UserMeasurementHistory';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.scss']
})
export class OutputGraphComponent implements OnInit {
  @Input() umh: UserMeasurementHistory[];
  options: any;
  constructor() { }

  ngOnInit() {
    this.options = {
      chart: { zoomType: 'xy', height: 700 },
      title: false,
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date',
        },
        dateTimeLabelFormats: {
          second: '%b %d %Y',
          minute: '%b %d %Y',
          hour: '%b %d %Y',
          day: '%b %d %Y',
          week: '%b %d %Y',
          month: '%b %d %Y',
          year: '%b %d %Y',
        },
      },
      plotOptions: {
        spline: {
          events: {
            legendItemClick(event) {
              if (!this.visible) {
                for (const series of this.chart.series) {
                  series.show();
                }
              }
              const seriesIndex = this.index;
              for (const series of this.chart.series) {
                if (series.index !== seriesIndex) {
                  series.visible ? series.hide() : series.show();
                }
              }
              return false;
            },
          },
          marker: {
            enabled: true,
          },
        },
      },
      yAxis: [
        {
          labels: {
            format: '{value} lbs',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          title: {
            text: false,
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
        },
        {
          labels: {
            format: '{value} %',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          title: {
            text: '%',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          opposite: true,
        },
        {
          labels: {
            format: '{value} lbs',
            style: {
              color: Highcharts.getOptions().colors[2],
            },
          },
          title: {
            text: false,
            style: {
              color: Highcharts.getOptions().colors[2],
            },
          },
        },
        {
          labels: {
            format: '{value}',
            style: {
              color: Highcharts.getOptions().colors[3],
            },
          },
          title: {
            text: 'BMI',
            style: {
              color: Highcharts.getOptions().colors[3],
            },
          },
          opposite: true,
        },
        {
          labels: {
            format: '{value}',
            style: {
              color: Highcharts.getOptions().colors[4],
            },
          },
          title: {
            text: 'BMR',
            style: {
              color: Highcharts.getOptions().colors[4],
            },
          },
          opposite: true,
        },
        {
          labels: {
            format: '{value} lbs',
            style: {
              color: Highcharts.getOptions().colors[5],
            },
          },
          title: {
            text: 'lbs',
            style: {
              color: Highcharts.getOptions().colors[5],
            },
          },
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              yAxis: [
                { visible: false },
                { visible: false },
                { visible: false },
                { visible: false },
                { visible: false },
                { visible: false },
              ],
              subtitle: {
                text: null,
              },
              credits: {
                enabled: false,
              },
            },
          },
        ],
      },
      series: [
        {
          name: 'Weight',
          type: 'spline',
          yAxis: 0,
          color: Highcharts.getOptions().colors[0],
          data: this.buildData('Weight'),
          tooltip: {
            valueSuffix: ' lbs',
          },
        },
        {
          name: 'Muscle',
          type: 'spline',
          yAxis: 5,
          color: Highcharts.getOptions().colors[5],
          data: this.buildData('Muscle'),
          tooltip: {
            valueSuffix: ' lbs',
          },
        },
        {
          name: 'Fat',
          type: 'spline',
          yAxis: 1,
          color: Highcharts.getOptions().colors[1],
          data: this.buildData('Fat'),
          tooltip: {
            valueSuffix: ' %',
          },
        },
        {
          name: 'Water',
          type: 'spline',
          yAxis: 1,
          color: Highcharts.getOptions().colors[1],
          data: this.buildData('Water'),
          tooltip: {
            valueSuffix: ' %',
          },
        },
        // {
        //   name: 'Bone',
        //   type: 'spline',
        //   yAxis: 2,
        //   color: Highcharts.getOptions().colors[2],
        //   data: this.buildData('Bone'),
        //   tooltip: {
        //     valueSuffix: ' lbs',
        //   },
        // },
        {
          name: 'BMI',
          type: 'spline',
          yAxis: 3,
          color: Highcharts.getOptions().colors[3],
          data: this.buildData('BMI'),
          tooltip: {
            valueSuffix: '',
          },
        },
        {
          name: 'BMR',
          type: 'spline',
          yAxis: 4,
          color: Highcharts.getOptions().colors[4],
          data: this.buildData('BMR'),
          tooltip: {
            valueSuffix: '',
          },
        },
      ],
    };
    Highcharts.chart('container', this.options);
  }
  clickLegend(event) { }
  buildData(prop) {
    const data = [];
    this.umh.map((x: UserMeasurementHistory) => {
      data.push([
        Date.UTC(
          new Date(x.DateCreated).getFullYear(),
          new Date(x.DateCreated).getMonth(),
          new Date(x.DateCreated).getDate(),
        ),
        x[prop],
      ]);
    });
    return data;
  }
}
