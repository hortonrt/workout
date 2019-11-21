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
  ngOnInit() {
    this.service.getAll('Stats').subscribe((x: any) => {
      this.setupRMH(x.RepMaxHistory);
    });
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
