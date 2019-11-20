import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dumbbell-selector',
  templateUrl: './dumbbell-selector.component.html',
  styleUrls: ['./dumbbell-selector.component.scss']
})
export class DumbbellSelectorComponent implements OnInit {
  dumbbells = [5, 10, 12, 15, 20, 25, 30, 35, 40, 45];

  @Input() obj: any;
  constructor() { }

  ngOnInit() {
  }

  select(weight) {
    this.obj.Weight = weight;
  }


}
