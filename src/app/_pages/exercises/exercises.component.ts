import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Exercise } from 'src/app/_models/Exercise';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent implements OnInit, OnDestroy {
  allExercises: Exercise[] = [] as Exercise[];
  exercises: Exercise[] = [] as Exercise[];
  loaded = false;
  exFilt: any = { searchText: '', ExerciseTypeName: '', PrimaryMuscleGroup: '' };
  lists = null;
  listsSub: Subscription = null;
  exSub: Subscription = null;
  constructor(
    private service: WorkoutService,
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
    this.listsSub = this.service.lists.subscribe(l => {
      if (l) {
        this.lists = l;
        this.exSub = this.service.getAll('Exercises').subscribe((data: any[]) => {
          this.allExercises = [...data];
          this.exercises = data;
          this.loaded = true;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.listsSub) { this.listsSub.unsubscribe(); }
    if (this.exSub) { this.exSub.unsubscribe(); }
  }
}
