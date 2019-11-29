import { Component, OnInit, Input } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';

@Component({
  selector: 'app-dumbbell-selector',
  templateUrl: './dumbbell-selector.component.html',
  styleUrls: ['./dumbbell-selector.component.scss']
})
export class DumbbellSelectorComponent implements OnInit {
  dumbbells = [];

  @Input() obj: any;
  constructor(private service: WorkoutService) { }

  ngOnInit() {
    this.dumbbells = this.chunk(Object.assign([], this.service.dumbbells), 2);
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
