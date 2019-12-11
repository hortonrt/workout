import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-active-exercise',
  templateUrl: './active-exercise.component.html',
  styleUrls: ['./active-exercise.component.scss']
})
export class ActiveExerciseComponent implements OnInit {
  @Input() we = null;
  @Input() activeExercise = null;

  constructor() { }

  ngOnInit() {
  }

}
