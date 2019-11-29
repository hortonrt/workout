import { Component, OnInit } from '@angular/core';
import { Routine } from 'src/app/_models/Routine';
import { User } from 'src/app/_models/User';
import { WorkoutService } from 'src/app/_services/workout.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html'
})
export class RoutinesComponent implements OnInit {
  routines: Routine[];
  currentUser: User = {} as User;
  loaded = false;
  constructor(
    private service: WorkoutService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.service.getAll('UserRoutines').subscribe((data: Routine[]) => {
        this.routines = data;
        this.loaded = true;
      });
    });
  }
}
