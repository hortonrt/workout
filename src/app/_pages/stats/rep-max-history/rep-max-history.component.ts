import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-rep-max-history',
  templateUrl: './rep-max-history.component.html',
})
export class RepMaxHistoryComponent implements OnInit {
  @Input() data: any;
  options: any;
  constructor() { }

  ngOnInit() {
    this.options = {
      title: {
        text: '',
      },
      credits: { enabled: false },
      xAxis: {
        categories: this.data.Dates
      },
      yAxis: {
        title: {
          enabled: true,
          text: this.data.CalcType
        }
      },
      legend: { reversed: true },
      series: [
        {
          type: 'column', name: 'Elite', stacking: 'normal', color: '#cc3232', data: this.data.Elite,
          tooltip: {
            pointFormat: '' +
              '<strong>{series.name}: </strong> {point.range}'
          },
        },
        {
          type: 'column', name: 'Advanced', stacking: 'normal', color: '#db7b2b', data: this.data.Advanced,
          tooltip: {
            pointFormat: '' +
              '<strong>{series.name}: </strong> {point.range}'
          }
        },
        {
          type: 'column', name: 'Intermediate', stacking: 'normal', color: '#e7b416', data: this.data.Intermediate,
          tooltip: {
            pointFormat: '' +
              '<strong>{series.name}: </strong> {point.range}'
          }
        },
        {
          type: 'column', name: 'Novice', stacking: 'normal', color: '#99c140', data: this.data.Novice,
          tooltip: {
            pointFormat: '' +
              '<strong>{series.name}: </strong> {point.range}'
          }
        },
        {
          type: 'column', name: 'Beginner', stacking: 'normal', color: '#2dc937', data: this.data.Beginner,
          tooltip: {
            pointFormat: '' +
              '<strong>{series.name}: </strong> {point.range}'
          }
        },
        {
          type: 'column', name: 'Rookie', stacking: 'normal',
          color: 'transparent', showInLegend: false, visible: true, data: this.data.Rookie
        },
        {
          type: 'spline', name: this.data.CalcType, data: this.data.ORM,
          marker: { lineWidth: 2, lineColor: '#ddd', fillColor: 'white' },
          tooltip: {
            pointFormat: '' +
              '<strong>1RM: </strong> {point.y}<br/>' +
              '{point.reps} reps x {point.liftweight} lbs<br />' +
              '<strong>Bodyweight: </strong> {point.bodyweight}'
          },
        }
      ]
    };
    setTimeout(() => {
      Highcharts.chart(this.data.Container, this.options);
    });
  }
}
