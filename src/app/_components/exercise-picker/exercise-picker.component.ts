import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { MuscleGroupType } from 'src/app/_models/MuscleGroupType';
import { Equipment } from 'src/app/_models/Equipment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Exercise } from 'src/app/_models/Exercise';
import { Subscription } from 'rxjs';
import { IconDefinition, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-exercise-picker',
  templateUrl: './exercise-picker.component.html',
  styleUrls: ['./exercise-picker.component.scss']
})
export class ExercisePickerComponent implements OnInit, OnDestroy {
  allExercises: Exercise[] = [] as Exercise[];
  exercises: Exercise[] = [] as Exercise[];
  MuscleGroups: MuscleGroupType[] = [] as MuscleGroupType[];
  Equipment: Equipment[] = [] as Equipment[];
  exercise = null;
  searchText = '';
  pickExercise = null;
  loaded = false;
  exFilt: any = { searchText: '', ExerciseTypeName: '', PrimaryMuscleGroup: '' };
  lists = null;
  listsSub: Subscription = null;
  exSub: Subscription = null;
  faSearch: IconDefinition = faSearch;
  faFilter: IconDefinition = faFilter;
  constructor(
    private service: WorkoutService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.listsSub = this.service.lists.subscribe((lists: any) => {
      this.lists = lists;
      this.exSub = this.service.getAll('Exercises').subscribe((data: any[]) => {
        this.allExercises = [...data];
        this.exercises = data;
        this.loaded = true;
      });
    });
  }

  ngOnDestroy() {
    if (this.listsSub) { this.listsSub.unsubscribe(); }
    if (this.exSub) { this.exSub.unsubscribe(); }
  }

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

  select(exercise) {
    this.pickExercise(exercise);
    this.bsModalRef.hide();
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
