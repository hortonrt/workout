import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { WorkoutService } from 'src/app/_services/workout.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Exercise } from 'src/app/_models/Exercise';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent implements OnInit {
  allExercises: Exercise[] = [] as Exercise[];
  exercises: Exercise[] = [] as Exercise[];
  currentUser: User = {} as User;
  loaded = false;
  exFilt: any = { searchText: '', ExerciseTypeName: '', PrimaryMuscleGroup: '' };
  lists = null;
  constructor(
    private service: WorkoutService,
    private authenticationService: AuthenticationService,
  ) { }

  onChangeET(v) {
    this.exFilt.ExerciseTypeName = v;
    this.updateList();
  }
  onChangeMT(v) {
    this.exFilt.PrimaryMuscleGroup = v;
    this.updateList();
  }
  updateList() {
    const filtered = [...this.allExercises].filter((it: any) => {
      return (it.Name.toLowerCase().includes(this.exFilt.searchText.toLowerCase())
        || it.ExerciseTypeName.toLowerCase().includes(this.exFilt.searchText.toLowerCase())
        || it.PrimaryMuscleGroup.toLowerCase().includes(this.exFilt.searchText.toLowerCase())
        || it.PrimaryMuscleType.toLowerCase().includes(this.exFilt.searchText.toLowerCase())
        || it.Equipment.filter(x => x.Name.toLowerCase().includes(this.exFilt.searchText.toLowerCase())).length
        || it.MuscleTypes.filter(x => x.MuscleGroupName.toLowerCase().includes(this.exFilt.searchText.toLowerCase())).length
        || it.MuscleTypes.filter(x => x.MuscleName.toLowerCase().includes(this.exFilt.searchText.toLowerCase())).length
        || this.exFilt.searchText === '')
        && (!this.exFilt.ExerciseTypeName.length || it.ExerciseTypeName === this.exFilt.ExerciseTypeName)
        && (!this.exFilt.PrimaryMuscleGroup.length || it.PrimaryMuscleGroup === this.exFilt.PrimaryMuscleGroup);
    });
    this.exercises = filtered;
  }

  ngOnInit() {
    this.service.lists.subscribe(l => {
      if (l) {
        this.lists = l;
        this.authenticationService.currentUser.subscribe(x => {
          this.currentUser = x;
          this.service.getAll('Exercises').subscribe((data: any[]) => {
            this.allExercises = [...data];
            this.exercises = data;
            this.loaded = true;
          });
        });
      }
    });
  }
}
