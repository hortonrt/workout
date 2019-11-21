import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { MuscleGroupType } from 'src/app/_models/MuscleGroupType';
import { WorkoutService } from 'src/app/_services/workout.service';

@Component({
  selector: 'app-workout-muscles',
  templateUrl: './workout-muscles.component.html',
})
export class WorkoutMusclesComponent implements OnInit {
  @Input() data: any;
  container = Math.random().toString(36).substring(2, 15);
  colors = Highcharts.getOptions().colors;
  groups: MuscleGroupType[] = [];
  options: any;
  constructor(private service: WorkoutService) { }

  ngOnInit() {
    this.service.getAll('Lists').subscribe((lists: any) => {
      this.groups = lists.MuscleGroupTypes;
      const groupCounts = this.data.split(',').reduce((p, c) => {
        const name = c.split('-')[0];
        if (!p.hasOwnProperty(name)) {
          p[name] = 0;
        }
        p[name]++;
        return p;
      }, {});
      const groups = Object.keys(groupCounts).map(k => {
        return { name: k, y: groupCounts[k] / this.data.split(',').length * 100, drilldown: [] };
      });
      for (const group of groups) {
        const typeCounts = this.data.split(',').reduce((p, c) => {
          const name = c.split('-')[1];
          if (c.includes(group.name)) {
            if (!p.hasOwnProperty(name)) {
              p[name] = 0;
            }
            p[name]++;
          }
          return p;
        }, {});
        const types = Object.keys(typeCounts).map(k => {
          return { name: k, y: typeCounts[k] / this.data.split(',').length * 100, group: group.name };
        });
        group.drilldown = types;
      }
      const groupData = [];
      const typeData = [];
      let brightness;
      for (const group of groups) {
        // add browser data
        groupData.push({
          name: group.name,
          y: group.y,
          color: this.colors[this.groups.find(x => x.Name === group.name).MuscleGroupTypeID]
        });
        let j = 0;
        for (const drill of group.drilldown) {
          brightness = 0.2 - (j / group.drilldown.length) / 5;
          typeData.push({
            name: drill.name,
            y: drill.y,
            color: new Highcharts.Color(
              this.colors[this.groups.find(x => x.Name === group.name).MuscleGroupTypeID]
            ).brighten(brightness).get()
          });
          j++;
        }
      }
      this.options = {
        chart: {
          type: 'pie',
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        plotOptions: {
          pie: {
            shadow: false,
          }
        },
        tooltip: {
          valueSuffix: '%'
        },
        series: [{
          name: 'Muscle Groups',
          colorByPoint: true,
          data: groupData,
          size: '60%',
          innerSize: '30%',
          dataLabels: {
            formatter() {
              return this.y > 5 ? this.point.name : null;
            },
            color: '#ffffff',
            distance: -60
          }
        }
          , {
          name: 'Types',
          data: typeData,
          size: '80%',
          innerSize: '60%',
          dataLabels: {
            formatter() {
              // display only if larger than 1
              return this.y > 1 ? '<b>' + this.point.name + '</b><br/>' +
                this.y.toFixed(1) + '%' : null;
            },
            distance: -20
          },
          id: 'versions'
        }
        ]
      };

      setTimeout(() => {
        Highcharts.chart(this.container, this.options);
      });

    });
  }
}
