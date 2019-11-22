import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  faStar as faStarFull,
} from '@fortawesome/free-solid-svg-icons';
import {
  faStar,
  faStarHalf,
} from '@fortawesome/free-regular-svg-icons';
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
  faStar = faStar;
  faStarFull = faStarFull;
  faStarHalf = faStarHalf;
  constructor(public bsModalRef: BsModalRef, private datePipe: DatePipe) { }

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

  toggleRating(exercise) {
    if (exercise.Rating === 1) {
      exercise.Rating = 3;
    } else {
      exercise.Rating -= 1;
    }
  }
}
