import { Component, OnInit } from '@angular/core';
import { Exercise } from 'src/app/_models/Exercise';
import { User } from 'src/app/_models/User';
import { WorkoutService } from 'src/app/_services/workout.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { MuscleGroupType } from 'src/app/_models/MuscleGroupType';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent implements OnInit {
  groups: MuscleGroupType[] = [] as MuscleGroupType[];
  currentUser: User = {} as User;
  loaded = false;
  constructor(
    private service: WorkoutService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.service.getAll('ExerciseGroups').subscribe((data: any[]) => {
        for (const group of data) {
          group.collapsed = true;
        }
        this.groups = data;
        this.loaded = true;
      });
    });
  }
}
