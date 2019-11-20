import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/User';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserWorkoutHistory } from 'src/app/_models/UserWorkoutHistory';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Program } from 'src/app/_models/Program';


@Component({
  selector: 'app-view-program',
  templateUrl: './view-program.component.html',
})
export class ViewProgramComponent implements OnInit {
  program: Program = {} as Program;
  currentUser: User = {} as User;
  workoutHistory: UserWorkoutHistory[] = [] as UserWorkoutHistory[];
  loaded = false;
  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x),
    );

    this.route.paramMap.subscribe(params => {
      this.program.ProgramID = Number(params.get('id'));
      this.service
        .get('Programs', this.program.ProgramID)
        .subscribe((data: Program) => {
          this.program = data;
          this.loaded = true;
        });
    });
  }
}
