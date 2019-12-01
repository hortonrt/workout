import { Component, OnInit, OnDestroy } from '@angular/core';
import { Routine } from 'src/app/_models/Routine';
import { ActivatedRoute } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {
  faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-routine',
  templateUrl: './view-routine.component.html',
  styleUrls: ['./view-routine.component.scss']
})
export class ViewRoutineComponent implements OnInit, OnDestroy {
  routine: Routine = {} as Routine;
  programroutineid: number;
  loaded = false;
  faStopWatch: IconDefinition = faStopwatch;
  routeSub: Subscription = null;
  routineSub: Subscription = null;
  maxSets = 0;
  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
  ) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.routine.RoutineID = Number(params.get('routineid'));
      this.programroutineid = Number(params.get('programroutineid') || -1);
      this.routineSub = this.service.get('Routines', this.routine.RoutineID).subscribe((data: Routine) => {
        this.routine = data;
        this.loaded = true;
      });
    });
  }
  ngOnDestroy() {
    if (this.routineSub) { this.routineSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
  }
}
