import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  faChevronCircleRight,
  faCheck,
  faTimes,
  faHeartbeat
} from '@fortawesome/free-solid-svg-icons';
import {
  faClock
} from '@fortawesome/free-regular-svg-icons';
import { RepmaxPipe } from 'src/app/_pipes/repmax.pipe';
import { WorkoutExercise } from 'src/app/_models/WorkoutExercise';
import { Workout } from 'src/app/_models/Workout';
import { UserWorkoutHistory } from 'src/app/_models/UserWorkoutHistory';
import { UserWorkoutExerciseHistory } from 'src/app/_models/UserWorkoutExerciseHistory';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';
import { DatePipe } from '@angular/common';
import webAudioTouchUnlock from 'web-audio-touch-unlock';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
  providers: [DatePipe]
})
export class WorkoutComponent implements OnInit, OnDestroy {
  repMax: RepmaxPipe;
  faChevronCircleRight = faChevronCircleRight;
  faClock = faClock;
  faTimes = faTimes;
  faCheck = faCheck;
  blockSummary: WorkoutExercise[] = [] as WorkoutExercise[];
  workout: Workout = {} as Workout;
  equipment: string;
  optionalEquipment: string;
  exercising = false;
  resting = false;
  userWorkout: UserWorkoutHistory = {} as UserWorkoutHistory;
  activeExercise: UserWorkoutExerciseHistory = {} as UserWorkoutExerciseHistory;
  loaded = false;
  clock = 0;
  clockInterval: any;
  audioCtx: AudioContext = null;
  restInterval: any;
  restTimer: number;
  done = false;
  rid = -1;
  countInt = null;
  postSub: Subscription = null;
  routeSub: Subscription = null;
  woSub: Subscription = null;
  faHeartbeat = faHeartbeat;
  timerrunning = false;
  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
    private router: Router,
    private datePipe: DatePipe
  ) {
  }

  ngOnDestroy() {
    if (this.clockInterval) { clearInterval(this.clockInterval); }
    if (this.restInterval) { clearInterval(this.restInterval); }
    if (this.countInt) { clearInterval(this.countInt); }
    if (this.postSub) { this.postSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.woSub) { this.woSub.unsubscribe(); }
  }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.rid = Number(params.get('routineid'));
      this.userWorkout.ProgramRoutineID = Number(
        params.get('programroutineid'),
      );
      this.woSub = this.service
        .getWO(Number(params.get('programroutineid')), Number(params.get('routineid'))).subscribe((workout: Workout) => {
          this.workout = workout;
          this.workout.Exercises[0].Active = true;
          this.loaded = true;
          // tslint:disable-next-line:no-string-literal
          this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
          webAudioTouchUnlock(this.audioCtx);
        });
    });
  }

  rest(we: WorkoutExercise) {
    this.restTimer = we.PostRest;
    this.blockSummary = [] as WorkoutExercise[];
    const next: WorkoutExercise = this.workout.Exercises[
      this.workout.Exercises.indexOf(we) + 1
    ];
    if (next) {
      this.blockSummary = this.workout.Exercises.filter(
        x => x.RoutineBlockID === next.RoutineBlockID,
      );
    }
    this.resting = true;
  }

  next(rested = false) {
    const we: WorkoutExercise = this.workout.Exercises.find(x => x.Active);
    we.Completed = true;
    if (we.PostRest > 0 && !rested) {
      this.rest(we);
      return;
    }

    we.Active = false;
    this.resting = false;
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
    this.userWorkout.Exercises.push(Object.assign({}, this.activeExercise));
    if (next) {
      this.activeExercise = {} as UserWorkoutExerciseHistory;
      this.activeExercise.ExerciseOrder = this.userWorkout.Exercises.length + 1;
      this.activeExercise.Rating = 3;
      this.activeExercise.Reps = next.Reps;
      this.activeExercise.Weight = next.Weight;
      this.activeExercise.RoutineBlockSetExerciseID =
        next.RoutineBlockSetExerciseID;
      this.activeExercise.ExerciseID = next.ExerciseID;
      this.activeExercise.ExerciseStart = eDate;
      this.activeExercise.RoutineBlockID = next.RoutineBlockID;
      this.activeExercise.RoutineBlockSetID = next.RoutineBlockSetID;
      this.activeExercise.RoutineID = this.rid;
      next.Active = true;
    } else {
      this.finish();
    }
  }

  toggleTimer($event) {
    this.timerrunning = $event;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.exercising) {
      $event.returnValue = true;
    }
  }

  finish() {
    this.exercising = false;
    this.resting = false;
    this.userWorkout.EndTime = new Date();
    clearInterval(this.clockInterval);
    this.userWorkout.Duration = Math.floor(Math.abs(this.userWorkout.EndTime.getTime() - this.userWorkout.StartTime.getTime()) / 1000);
    this.loaded = false;
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
    // TODO on error save workout in cache and try again
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd H:mm:ss');
  }

  startWorkout() {
    this.userWorkout.StartTime = new Date();
    this.userWorkout.UserWorkoutHistoryID = 0;
    this.userWorkout.Exercises = [] as UserWorkoutExerciseHistory[];
    this.userWorkout.ProgramID = this.workout.ProgramID;
    this.userWorkout.ProgramPhaseID = this.workout.ProgramPhaseID;
    this.userWorkout.ProgramRoutineID = this.workout.ProgramRoutineID;
    this.userWorkout.ProgramDayID = this.workout.ProgramDayID;
    this.userWorkout.RoutineID = this.rid;
    this.activeExercise = {} as UserWorkoutExerciseHistory;
    this.activeExercise.ExerciseOrder = 1;
    this.activeExercise.Rating = 3;
    this.activeExercise.Reps = this.workout.Exercises[0].Reps;
    this.activeExercise.Weight = this.workout.Exercises[0].Weight;
    this.activeExercise.ExerciseID = this.workout.Exercises[0].ExerciseID;
    this.activeExercise.RoutineBlockSetExerciseID = this.workout.Exercises[0].RoutineBlockSetExerciseID;
    this.activeExercise.ExerciseStart = this.userWorkout.StartTime;
    this.activeExercise.RoutineBlockID = this.workout.Exercises[0].RoutineBlockID;
    this.activeExercise.RoutineBlockSetID = this.workout.Exercises[0].RoutineBlockSetID;
    this.activeExercise.RoutineID = this.rid;
    this.clockInterval = setInterval(() => {
      this.clock = Math.floor(
        Math.abs(new Date().getTime() - this.userWorkout.StartTime.getTime()) /
        1000,
      );
    }, 1000);
    this.exercising = true;
  }
}
