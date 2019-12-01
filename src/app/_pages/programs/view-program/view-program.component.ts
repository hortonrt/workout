import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserWorkoutHistory } from 'src/app/_models/UserWorkoutHistory';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Program } from 'src/app/_models/Program';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-view-program',
  templateUrl: './view-program.component.html',
})
export class ViewProgramComponent implements OnInit, OnDestroy {
  program: Program = {} as Program;
  routeSub: Subscription = null;
  progSub: Subscription = null;
  workoutHistory: UserWorkoutHistory[] = [] as UserWorkoutHistory[];
  loaded = false;
  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
  ) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.program.ProgramID = Number(params.get('id'));
      this.progSub = this.service.get('Programs', this.program.ProgramID).subscribe((data: Program) => {
        this.program = data;
        this.loaded = true;
      });
    });
  }

  ngOnDestroy() {
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.progSub) { this.progSub.unsubscribe(); }
  }
}
