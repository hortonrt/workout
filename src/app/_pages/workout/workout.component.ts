import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  faChevronCircleRight,
  faHeartbeat,
  faStar as faStarFull,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  faClock,
  faStar,
  faStarHalf,
} from '@fortawesome/free-regular-svg-icons';
import { RepmaxPipe } from 'src/app/_pipes/repmax.pipe';
import { WorkoutExercise } from 'src/app/_models/WorkoutExercise';
import { Workout } from 'src/app/_models/Workout';
import { User } from 'src/app/_models/User';
import { UserWorkoutHistory } from 'src/app/_models/UserWorkoutHistory';
import { UserWorkoutExerciseHistory } from 'src/app/_models/UserWorkoutExerciseHistory';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RepMaxChartComponent } from 'src/app/_components/rep-max-chart/rep-max-chart.component';

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
  faStar = faStar;
  faCheck = faCheck;
  faTimes = faTimes;
  faStarFull = faStarFull;
  faStarHalf = faStarHalf;
  faHeartbeat = faHeartbeat;
  blockSummary: WorkoutExercise[] = [] as WorkoutExercise[];
  workout: Workout = {} as Workout;
  currentUser: User = {} as User;
  equipment: string;
  optionalEquipment: string;
  exercising = false;
  resting = false;
  userWorkout: UserWorkoutHistory = {} as UserWorkoutHistory;
  activeExercise: UserWorkoutExerciseHistory = {} as UserWorkoutExerciseHistory;
  loaded = false;
  clock = 0;
  clockInterval: any;
  restInterval: any;
  restTimer: number;
  done = false;
  bands = null;
  bsModalRef = null;

  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: BsModalService
  ) {
    this.bands = Object.assign([], service.bands);
  }

  ngOnDestroy() {
    if (this.clockInterval) { clearInterval(this.clockInterval); }
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.route.paramMap.subscribe(params => {
        this.userWorkout.ProgramRoutineID = Number(
          params.get('programroutineid'),
        );
        this.service
          .getWO(Number(params.get('programroutineid')), Number(params.get('routineid'))).subscribe((workout: Workout) => {
            this.workout = workout;
            this.workout.Exercises[0].Active = true;
            this.loaded = true;
          });
      });
    });
  }

  toggleRating(direction = 1) {
    if (this.activeExercise.Rating === 1) {
      this.activeExercise.Rating = 3;
    } else {
      this.activeExercise.Rating -= direction;
    }
  }

  adjust(type, step, direction) {
    this.activeExercise[type] += direction * step;
    const we = this.workout.Exercises.find(
      (x: WorkoutExercise) =>
        x.RoutineBlockSetExerciseID ===
        this.activeExercise.RoutineBlockSetExerciseID,
    );
    this.workout.Exercises[this.workout.Exercises.indexOf(we)][type] +=
      direction * step;
  }

  rest(we: WorkoutExercise) {
    const restStart = new Date();
    this.blockSummary = [] as WorkoutExercise[];
    const restEnd = new Date();
    restEnd.setSeconds(restEnd.getSeconds() + we.PostRest);
    const next: WorkoutExercise = this.workout.Exercises[
      this.workout.Exercises.indexOf(we) + 1
    ];
    if (next) {
      this.blockSummary = this.workout.Exercises.filter(
        x => x.RoutineBlockID === next.RoutineBlockID,
      );
    }
    this.restTimer = we.PostRest;
    this.resting = true;
    this.restInterval = setInterval(() => {
      this.restTimer =
        we.PostRest -
        Math.floor(Math.abs(new Date().getTime() - restStart.getTime()) / 1000);
      if (new Date() > restEnd) {
        clearInterval(this.restInterval);
        this.next(true);
      }
    }, 1000);
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
      this.activeExercise.RoutineID = this.workout.RoutineID;
      next.Active = true;
    } else {
      this.finish();
    }
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
    this.service.post('Workout', payload).subscribe((x: any) => {
      this.router.navigate(['history/workout', x.UserWorkoutHistoryID]);
    });
    // TODO on error save workout in cache and try again
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd H:mm:ss');
  }

  bandColor(weight) {
    return this.bands.find(x => x.v === weight).n;
  }

  startWorkout() {
    this.userWorkout.StartTime = new Date();
    this.userWorkout.UserWorkoutHistoryID = 0;
    this.userWorkout.Exercises = [] as UserWorkoutExerciseHistory[];
    this.userWorkout.ProgramID = this.workout.ProgramID;
    this.userWorkout.ProgramPhaseID = this.workout.ProgramPhaseID;
    this.userWorkout.ProgramRoutineID = this.workout.ProgramRoutineID;
    this.userWorkout.ProgramDayID = this.workout.ProgramDayID;
    this.userWorkout.RoutineID = this.workout.RoutineID;
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
    this.activeExercise.RoutineID = this.workout.RoutineID;
    this.clockInterval = setInterval(() => {
      this.clock = Math.floor(
        Math.abs(new Date().getTime() - this.userWorkout.StartTime.getTime()) /
        1000,
      );
    }, 1000);
    this.exercising = true;
  }
}
