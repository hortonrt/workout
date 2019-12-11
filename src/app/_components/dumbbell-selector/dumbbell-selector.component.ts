import { Component, OnInit, Input } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-dumbbell-selector',
  templateUrl: './dumbbell-selector.component.html',
  styleUrls: ['./dumbbell-selector.component.scss']
})
export class DumbbellSelectorComponent implements OnInit {
  dumbbells = [];
  maxDumbell: number = null;

  @Input() obj: any;
  constructor(private service: WorkoutService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.dumbbells = this.chunk(Object.assign([],
      this.service.dumbbells.filter(x => x <= this.authService.currentUserValue.HighestDumbbell)), 2);
  }

  chunk(target, size) {
    return target.reduce((memo, value, index) => {
      if (index % (target.length / size) === 0 && index !== 0) { memo.push([]); }
      memo[memo.length - 1].push(value);
      return memo;
    }, [[]]);
  }


  select(weight) {
    this.obj.Weight = weight;
  }


}
