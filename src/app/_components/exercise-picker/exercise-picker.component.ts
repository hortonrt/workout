import { Component, OnInit } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { MuscleGroupType } from 'src/app/_models/MuscleGroupType';
import { Equipment } from 'src/app/_models/Equipment';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-exercise-picker',
  templateUrl: './exercise-picker.component.html',
  styleUrls: ['./exercise-picker.component.scss']
})
export class ExercisePickerComponent implements OnInit {
  groups: MuscleGroupType[] = [] as MuscleGroupType[];
  MuscleGroups: MuscleGroupType[] = [] as MuscleGroupType[];
  Equipment: Equipment[] = [] as Equipment[];
  exercise = null;
  searchText = '';
  pickExercise = null;
  loaded = false;
  constructor(
    private service: WorkoutService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.service.getAll('Lists').subscribe((lists: any) => {
      this.Equipment = lists.Equipment;
      this.MuscleGroups = lists.MuscleGroupTypes;
      this.service.getAll('ExerciseGroups').subscribe((data: any[]) => {
        for (const group of data) {
          group.collapsed = true;
        }
        this.groups = data;
        this.loaded = true;
      });
    });
  }

  select(exercise) {
    this.pickExercise(exercise);
    this.bsModalRef.hide();
  }
}
