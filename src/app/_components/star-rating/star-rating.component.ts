import { Component, OnInit, Input } from '@angular/core';
import {
  faStar as faStarFull
} from '@fortawesome/free-solid-svg-icons';
import {
  faStar,
  faStarHalf,
} from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html'
})
export class StarRatingComponent implements OnInit {
  @Input() exercise = null;
  @Input() size = '';
  @Input() togglable = false;
  @Input() prev = false;
  faStarFull = faStarFull;
  faStarHalf = faStarHalf;
  faStar = faStar;
  rating = 2;
  constructor() { }

  ngOnInit() {
    if (this.prev) {
      this.rating = this.exercise.PrevRating;
    } else { this.rating = this.exercise.Rating; }
  }

  toggle(direction = 1) {
    if (this.togglable) {
      if (this.exercise.Rating === 1) {
        this.exercise.Rating = 3;
        this.rating = 3;
      } else {
        this.exercise.Rating -= direction;
        this.rating = this.exercise.Rating;
      }
    }
  }
}
