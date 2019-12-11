import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exercise-history',
  templateUrl: './exercise-history.component.html'
})
export class ExerciseHistoryComponent implements OnInit, OnDestroy {
  exerciseID: number = null;
  paramSub: Subscription = null;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params => {
      this.exerciseID = Number(params.get('id'));
    });
  }

  ngOnDestroy() {
    if (this.paramSub) { this.paramSub.unsubscribe(); }
  }
}
