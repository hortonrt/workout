import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { UserWorkoutExerciseHistory } from 'src/app/_models/UserWorkoutExerciseHistory';
import { ExercisePickerComponent } from 'src/app/_components/exercise-picker/exercise-picker.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserWorkoutHistory } from 'src/app/_models/UserWorkoutHistory';
import {
  faChevronCircleRight,
  faHeartbeat,
  faStar as faStarFull,
  faCheck,
  faTimes,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import {
  faClock,
  faStar,
  faStarHalf,
} from '@fortawesome/free-regular-svg-icons';
import { WorkoutService } from 'src/app/_services/workout.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RepMaxChartComponent } from 'src/app/_components/rep-max-chart/rep-max-chart.component';
import { WorkoutExercise } from 'src/app/_models/WorkoutExercise';
import { Workout } from 'src/app/_models/Workout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workout-now',
  templateUrl: './workout-now.component.html',
  styleUrls: ['./workout-now.component.scss'],
  providers: [DatePipe]
})
export class WorkoutNowComponent implements OnInit, OnDestroy {
  exercising = true;
  workout: Workout;
  userWorkout: UserWorkoutHistory;
  clockInterval = null;
  postSub: Subscription = null;
  clock = null;
  bsModalRef = null;
  faChevronCircleRight = faChevronCircleRight;
  faClock = faClock;
  faStar = faStar;
  bands = null;
  faCheck = faCheck;
  faTimes = faTimes;
  faStarFull = faStarFull;
  faStarHalf = faStarHalf;
  faHeartbeat = faHeartbeat;
  faPlus = faPlus;
  activeExercise: UserWorkoutExerciseHistory = null;
  exerciseSub: Subscription = null;
  constructor(
    private modalService: BsModalService,
    private service: WorkoutService,
    private router: Router,
    private datePipe: DatePipe) {
    this.bands = Object.assign([], service.bands
    );
  }

  ngOnInit() {
    this.workout = {} as Workout;
    this.workout.Exercises = [] as WorkoutExercise[];
    this.userWorkout = {} as UserWorkoutHistory;
    this.userWorkout.StartTime = new Date();
    this.userWorkout.UserWorkoutHistoryID = -1;
    this.userWorkout.Exercises = [] as UserWorkoutExerciseHistory[];
    this.userWorkout.ProgramID = -1;
    this.userWorkout.ProgramPhaseID = -1;
    this.userWorkout.ProgramRoutineID = -1;
    this.userWorkout.ProgramDayID = -1;
    this.userWorkout.RoutineID = -1;
    this.clockInterval = setInterval(() => {
      this.clock = Math.floor(
        Math.abs(new Date().getTime() - this.userWorkout.StartTime.getTime()) /
        1000,
      );
    }, 1000);
    this.exercising = true;
  }

  ngOnDestroy() {
    if (this.postSub) { this.postSub.unsubscribe(); }
    if (this.exerciseSub) { this.exerciseSub.unsubscribe(); }
    if (this.clockInterval) { clearInterval(this.clockInterval); }
  }

  addExercise() {
    if (this.workout.Exercises.length) {
      const we: WorkoutExercise = this.workout.Exercises.find(x => x.Active);
      we.Completed = true;

      we.Active = false;
      const eDate: Date = new Date();
      this.activeExercise.ExerciseEnd = eDate;
      this.activeExercise.Duration = Math.floor(
        Math.abs(
          this.activeExercise.ExerciseEnd.getTime() -
          this.activeExercise.ExerciseStart.getTime(),
        ) / 1000,
      );
      we.Reps = this.activeExercise.Reps;
      we.Weight = this.activeExercise.Weight;
      we.Rating = this.activeExercise.Rating;
    }
    const initialState = {
      exercise: null, pickExercise: (exercise) => {
        this.exerciseSub = this.service.get('CustomExercise', exercise.ExerciseID).subscribe((ex: WorkoutExercise) => {
          ex.Active = true;
          ex.Completed = false;
          this.workout.Exercises.push(ex);
          const active = {} as UserWorkoutExerciseHistory;
          active.ExerciseOrder = 1;
          active.Rating = 3;
          active.Reps = ex.Reps;
          active.Weight = ex.Weight;
          active.ExerciseID = ex.ExerciseID;
          active.RoutineBlockSetExerciseID = ex.RoutineBlockSetExerciseID;
          active.ExerciseStart = new Date();
          active.RoutineBlockID = ex.RoutineBlockID;
          active.RoutineBlockSetID = ex.RoutineBlockSetID;
          active.RoutineID = -1;
          this.activeExercise = Object.assign({}, active);
          this.userWorkout.Exercises.push(this.activeExercise);
        });
      }
    };
    this.bsModalRef = this.modalService.show(ExercisePickerComponent, { initialState });
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd H:mm:ss');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.exercising) {
      $event.returnValue = true;
    }
  }

  viewRepMax(ormIn) {
    const initialState = {
      ORM: ormIn
    };
    this.bsModalRef = this.modalService.show(RepMaxChartComponent, { initialState });
  }

  bandColor(weight) {
    return this.bands.find(x => x.v === weight).n;
  }
  toggleRating(direction = 1) {
    if (this.activeExercise.Rating === 1) {
      this.activeExercise.Rating = 3;
    } else {
      this.activeExercise.Rating -= direction;
    }
  }

  finish() {
    const conf = confirm('Are you sure you want to end your workout?');
    if (conf) {
      const we: WorkoutExercise = this.workout.Exercises.find(x => x.Active);
      we.Completed = true;

      we.Active = false;
      const eDate: Date = new Date();
      this.activeExercise.ExerciseEnd = eDate;
      const next: WorkoutExercise = this.workout.Exercises[
        this.workout.Exercises.indexOf(we) + 1
      ];
      this.activeExercise.Duration = Math.floor(
        Math.abs(
          this.activeExercise.ExerciseEnd.getTime() -
          this.activeExercise.ExerciseStart.getTime(),
        ) / 1000,
      );
      we.Reps = this.activeExercise.Reps;
      we.Weight = this.activeExercise.Weight;
      we.Rating = this.activeExercise.Rating;
      this.exercising = false;
      this.userWorkout.EndTime = new Date();
      clearInterval(this.clockInterval);
      this.userWorkout.Duration = Math.floor(Math.abs(this.userWorkout.EndTime.getTime() - this.userWorkout.StartTime.getTime()) / 1000);
      const payload: UserWorkoutHistory = Object.assign({}, this.userWorkout);
      payload.EndTime = new Date();

      payload.EndTime = this.transformDate(payload.EndTime);
      payload.StartTime = this.transformDate(payload.StartTime);
      delete payload.User;
      payload.Exercises.map((ex: UserWorkoutExerciseHistory) => {
        ex.ExerciseEnd = this.transformDate(ex.ExerciseEnd);
        ex.ExerciseStart = this.transformDate(ex.ExerciseStart);
        delete ex.Exercise;
      });
      this.postSub = this.service.post('Workout', payload).subscribe((x: any) => {
        this.router.navigate(['history/workout', x.UserWorkoutHistoryID]);
      });
    }
  }

}
