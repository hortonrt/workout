import { Component, OnInit } from '@angular/core';
import { UserWorkoutHistory } from 'src/app/_models/UserWorkoutHistory';
import { WorkoutService } from 'src/app/_services/workout.service';
import { ActivatedRoute } from '@angular/router';
import { faStar as faStarFull } from '@fortawesome/free-solid-svg-icons';
import { faStar, faStarHalf } from '@fortawesome/free-regular-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditWorkoutComponent } from './edit-workout/edit-workout.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.component.html',
  providers: [DatePipe]
})
export class WorkoutHistoryComponent implements OnInit {
  bsModalRef: BsModalRef;
  workoutID = -1;
  loaded = false;
  history: UserWorkoutHistory = {} as UserWorkoutHistory;
  faStar = faStar;
  faStarFull = faStarFull;
  faStarHalf = faStarHalf;
  bands = null;
  constructor(
    private service: WorkoutService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private datePipe: DatePipe) {
    this.bands = Object.assign([], service.bands);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.workoutID = Number(params.get('id'));
      this.load();
    });
  }

  load() {
    this.loaded = false;
    this.service
      .get('WorkoutHistory', + this.workoutID)
      .subscribe((hist: UserWorkoutHistory) => {
        this.history = hist;
        this.loaded = true;
      });
  }

  bandColor(weight) {
    return this.bands.find(x => x.v === weight).n;
  }


  edit() {
    const workoutObj: any = Object.assign({}, this.history);
    const start = this.stringToUTC(workoutObj.StartTimeDate);
    const end = this.stringToUTC(workoutObj.EndTimeDate);
    workoutObj.StartTime = start.toISOString().split('.')[0].substr(0, 16);
    workoutObj.EndTime = end.toISOString().split('.')[0].substr(0, 16);
    const initialState = {
      workout: workoutObj,
      updateHistory: (out) => {
        const startX = this.stringToUTC(out.StartTime, true);
        const endX = this.stringToUTC(out.EndTime, true);
        out.StartTime = startX.toISOString().split('.')[0].substr(0, 16);
        out.EndTime = endX.toISOString().split('.')[0].substr(0, 16);
        out.StartTime = this.datePipe.transform(startX, 'yyyy-MM-dd H:mm');
        out.EndTime = this.datePipe.transform(endX, 'yyyy-MM-dd H:mm');
        delete out.StartTimeDate;
        delete out.EndTimeDate;
        delete out.Name;
        out.Exercises.map(x => { delete x.Name; });
        this.service.post('Workout', out).subscribe((data: any) => {
          this.load();
        });
      }
    };
    this.bsModalRef = this.modalService.show(EditWorkoutComponent, { initialState });
  }

  stringToUTC(date, offset = false) {
    const da = new Date(Date.UTC(
      Number(date.substr(0, 4)),
      Number(date.substr(5, 2)) - 1,
      Number(date.substr(8, 2)),
      Number(date.substr(11, 2)),
      Number(date.substr(14, 2)),
      Number(date.substr(17, 2))));
    if (offset) {
      const off = new Date().getTimezoneOffset() * 60 / 3600;
      da.setHours(da.getHours() + off);
    }
    return da;
  }
}
