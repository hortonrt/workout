import { Component, OnInit, OnDestroy } from '@angular/core';
import { Routine } from 'src/app/_models/Routine';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html'
})
export class RoutinesComponent implements OnInit, OnDestroy {
  routines: Routine[];
  routineSub: Subscription = null;
  loaded = false;
  constructor(
    private service: WorkoutService,
  ) { }

  ngOnInit() {
    this.routineSub = this.service.getAll('UserRoutines').subscribe((data: Routine[]) => {
      this.routines = data;
      this.loaded = true;
    });
  }

  ngOnDestroy() {
    if (this.routineSub) { this.routineSub.unsubscribe(); }
  }
}
