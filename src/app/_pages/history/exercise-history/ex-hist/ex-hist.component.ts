import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ex-hist',
  templateUrl: './ex-hist.component.html',
  styleUrls: ['./ex-hist.component.scss']
})
export class ExHistComponent implements OnInit, OnDestroy {
  @Input() exerciseID = null;
  @Input() header = true;
  histSub: Subscription = null;
  loaded = false;
  history = [];
  constructor(private service: WorkoutService) { }

  ngOnInit() {
    this.histSub = this.service.get('ExerciseHistory', this.exerciseID).subscribe((hist: any) => {
      this.history = hist;
      this.loaded = true;
    });
  }

  ngOnDestroy() {
    if (this.histSub) { this.histSub.unsubscribe(); }
  }

}
