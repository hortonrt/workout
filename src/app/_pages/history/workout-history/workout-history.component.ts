import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserWorkoutHistory } from 'src/app/_models/UserWorkoutHistory';
import { WorkoutService } from 'src/app/_services/workout.service';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditWorkoutComponent } from './edit-workout/edit-workout.component';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.component.html',
  providers: [DatePipe]
})
export class WorkoutHistoryComponent implements OnInit, OnDestroy {
  bsModalRef: BsModalRef;
  workoutID = -1;
  loaded = false;
  history: UserWorkoutHistory = {} as UserWorkoutHistory;
  routeSub: Subscription = null;
  histSub: Subscription = null;
  postSub: Subscription = null;
  bands = null;
  constructor(
    private service: WorkoutService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private datePipe: DatePipe) {
    this.bands = Object.assign([], service.bands);
  }

  ngOnInit() {
    this.histSub = this.route.paramMap.subscribe(params => {
      this.workoutID = Number(params.get('id'));
      this.load();
    });
  }

  ngOnDestroy() {

    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.histSub) { this.histSub.unsubscribe(); }
    if (this.postSub) { this.postSub.unsubscribe(); }
  }

  load() {
    this.loaded = false;
    this.histSub = this.service.get('WorkoutHistory', + this.workoutID).subscribe((hist: UserWorkoutHistory) => {
      this.history = hist;
      this.loaded = true;
    });
  }

  bandColor(weight) {
    return this.bands.find(x => x.v === weight).n;
  }


  edit() {
    const workoutObj: any = { ...this.history };
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
        this.postSub = this.service.post('Workout', out).subscribe((data: any) => {
          this.load();
        });
      }
    };
    this.bsModalRef = this.modalService.show(EditWorkoutComponent, { initialState, ignoreBackdropClick: true });
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
