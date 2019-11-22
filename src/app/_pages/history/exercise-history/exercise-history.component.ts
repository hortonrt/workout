import { Component, OnInit } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { ActivatedRoute } from '@angular/router';
import { faStar as faStarFull } from '@fortawesome/free-solid-svg-icons';
import { faStar, faStarHalf } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-exercise-history',
  templateUrl: './exercise-history.component.html'
})
export class ExerciseHistoryComponent implements OnInit {
  loaded = false;
  history: any = [];
  faStar = faStar;
  faStarFull = faStarFull;
  faStarHalf = faStarHalf;
  bands = null;
  constructor(private service: WorkoutService, private route: ActivatedRoute) {
    this.bands = Object.assign([], service.bands);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.get('ExerciseHistory', params.get('id')).subscribe((hist: any) => {
        this.history = hist;
        this.loaded = true;
      });
    });
  }

  bandColor(weight) {
    return this.bands.find(x => x.v === weight).n;
  }
}
