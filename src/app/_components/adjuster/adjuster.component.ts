import { Component, OnInit, Input } from '@angular/core';
import {
  faPlus
  , faMinus,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-adjuster',
  templateUrl: './adjuster.component.html',
  styleUrls: ['./adjuster.component.scss']
})
export class AdjusterComponent implements OnInit {
  @Input() name: string;
  @Input() obj: any;
  @Input() step: number;
  @Input() dec = 1;
  @Input() big = false;

  faPlus: IconDefinition = faPlus;
  faMinus: IconDefinition = faMinus;
  constructor() { }

  ngOnInit() {
  }

  down() {
    this.obj[this.name] -= this.step;
    this.obj[this.name] = parseFloat(this.obj[this.name].toFixed(this.dec));
  }

  up() {
    this.obj[this.name] += this.step;
    this.obj[this.name] = parseFloat(this.obj[this.name].toFixed(this.dec));
  }

}
