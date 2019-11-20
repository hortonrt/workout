import { Component, OnInit } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {
  loaded = false;
  history: any = [];
  constructor(private service: WorkoutService) { }

  ngOnInit() {
    this.service.getAll('UserWorkoutHistory')
      .subscribe((hist: any[]) => {
        this.history = hist;
        this.loaded = true;
      });
  }
}
