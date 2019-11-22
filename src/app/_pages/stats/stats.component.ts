import { Component, OnInit } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  providers: [DatePipe]
})
export class StatsComponent implements OnInit {

  constructor(private service: WorkoutService, private datePipe: DatePipe) { }
  rmh = null;
  rmc = null;
  eh = null;
  rh = null;
  sets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  loaded = false;

  ngOnInit() {
    this.service.getAll('Stats').subscribe((x: any) => {
      this.setupRMH(x.RepMaxHistory);
      this.setupRMC(x.RepMaxCurrent);
      this.setupEH(x.ExerciseHistory);
      this.loaded = true;
    });
  }

  setupEH(data: any[]) {
    const eh: any = [];

    const uniqueExercises = [...new Set(data.map(x => x.Name))].sort();
    for (const ex of uniqueExercises) {
      const wo = data.filter(x => x.Name === ex);
      const dates = [...new Set(wo.map(x => x.WorkoutDate))];
      const pt = {
        Name: ex,
        Container: Math.random().toString(36).substring(2, 15),
        Categories: dates,
        Series: []
      };
      const series = [];
      const highestSet = Math.max.apply(Math, wo.map((o) => o.SetNumber));
      for (const setx of this.sets) {
        if (setx <= highestSet) {
          series.push({ name: 'Set ' + setx, data: [] });
        }
      }
      for (const cat of dates) {
        for (const set of this.sets) {
          if (series[set - 1]) {
            const a = wo.find(x => x.SetNumber === set && x.WorkoutDate === cat);
            series[set - 1].data.push(
              {
                y: a ? (a.ByRep === 1 ? a.Reps : a.Weight) : 0,
                color: (a ? (a.Rating === 1 ? '#dc3545' : a.Rating === 3 ? '#28a745' : '#fd7e14') : null)
              }
            );
          }
        }
      }
      pt.Series = series;
      eh.push(pt);
    }
    this.eh = eh;
  }

  setupRMC(data: any[]) {
    const rmc: any = [];
    for (const exercise of data) {
      exercise.Container = Math.random().toString(36).substring(2, 15);
      rmc.push(exercise);
    }
    this.rmc = rmc;
  }

  setupRMH(data: any[]) {
    const rmh: any = [];
    const uniqueExercises = [...new Set(data.map(x => x.Name))].sort();
    for (const exercise of uniqueExercises) {
      const exercises: any[] = data.filter(x => x.Name === exercise)
        .sort((a, b) => (new Date(a.Date).getTime() - new Date(b.Date).getTime()));
      rmh.push({
        Container: Math.random().toString(36).substring(2, 15),
        Name: exercise,
        Dates: exercises.map(x => [this.datePipe.transform(new Date(x.Date), 'MMM dd, yy')]),
        Rookie: exercises.map(e => ({ y: e.Beginner })),
        Beginner: exercises.map(x => ({ y: x.Novice - x.Beginner, range: x.Beginner + '-' + x.Novice })),
        Novice: exercises.map(x => ({ y: x.Intermediate - x.Novice, range: x.Novice + '-' + x.Intermediate })),
        Intermediate: exercises.map(x => ({ y: x.Advanced - x.Intermediate, range: x.Intermediate + '-' + x.Advanced })),
        Advanced: exercises.map(x => ({ y: x.Elite - x.Advanced, range: x.Advanced + '-' + x.Elite })),
        Elite: exercises.map(x => ({ y: (exercises[0].ByRep === 1 ? x.Elite + 5 : x.Elite + 50) - x.Elite, range: x.Elite + '+' })),
        ORM: exercises.map(x => ({ y: x.ORM, reps: x.Reps, bodyweight: x.BodyWeight, liftweight: x.LiftWeight })),
        CalcType: exercises[0].ByRep === 1 ? 'Reps' : 'Lift Weight (1RM)'
      });
    }
    this.rmh = rmh;
  }

}
