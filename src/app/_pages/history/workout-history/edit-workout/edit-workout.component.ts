import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.component.html',
  styleUrls: ['./edit-workout.component.scss'],
  providers: [DatePipe]
})
export class EditWorkoutComponent implements OnInit {
  workout = null;
  updateHistory = null;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  save() {
    for (const exercise of this.workout.Exercises) {
      delete exercise.ExerciseTypeID;
      delete exercise.ExerciseReps;
    }
    this.updateHistory(this.workout);
    this.bsModalRef.hide();
  }

  cancel() {
    this.bsModalRef.hide();
  }

  updateDuration() {
    this.workout.Duration = Math.floor(Math.abs(
      new Date(this.workout.StartTime).getTime()
      - new Date(this.workout.EndTime).getTime()) / 1000);
  }
}
