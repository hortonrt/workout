import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exercise-history',
  templateUrl: './exercise-history.component.html'
})
export class ExerciseHistoryComponent implements OnInit, OnDestroy {
  loaded = false;
  history: any = [];
  bands = null;
  paramSub: Subscription = null;
  exHis: Subscription = null;

  constructor(private service: WorkoutService, private route: ActivatedRoute) {
    this.bands = Object.assign([], service.bands);
  }

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params => {
      this.exHis = this.service.get('ExerciseHistory', params.get('id')).subscribe((hist: any) => {
        this.history = hist;
        this.loaded = true;
      });
    });
  }

  ngOnDestroy() {
    if (this.paramSub) { this.paramSub.unsubscribe(); }
    if (this.exHis) { this.exHis.unsubscribe(); }
  }

  bandColor(weight) {
    return this.bands.find(x => x.v === weight).n;
  }
}
