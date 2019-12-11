import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-active-exercise',
  templateUrl: './active-exercise.component.html',
})
export class ActiveExerciseComponent implements OnInit {
  @Input() we = null;
  @Input() activeExercise = null;
  constructor() { }

  ngOnInit() {
  }

}
