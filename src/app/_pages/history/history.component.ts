import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit, OnDestroy {
  loaded = false;
  history: any = [];
  histSub: Subscription = null;
  constructor(private service: WorkoutService) { }

  ngOnInit() {
    this.histSub = this.service.getAll('UserWorkoutHistory').subscribe((hist: any[]) => {
      this.history = hist;
      this.loaded = true;
    });
  }

  ngOnDestroy() {
    if (this.histSub) { this.histSub.unsubscribe(); }
  }
}
