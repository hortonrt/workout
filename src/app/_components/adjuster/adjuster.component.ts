import { Component, OnInit, Input } from '@angular/core';
import {
  faPlus
  , faMinus,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-adjuster',
  templateUrl: './adjuster.component.html',
  styleUrls: ['./adjuster.component.scss']
})
export class AdjusterComponent implements OnInit {
  @Input() name: string;
  @Input() obj: any;
  @Input() step = 1;
  @Input() dec = 1;
  @Input() big = false;
  @Input() bigfont = false;
  @Input() fixed = false;
  @Input() inclass = false;
  @Input() lbl = '';
  @Input() pre: string = null;
  @Input() post: string = null;
  @Input() small = false;
  @Input() tggl = false;
  faPlus: IconDefinition = faPlus;
  faMinus: IconDefinition = faMinus;
  faSquare: IconDefinition = faSquare;
  faCheckSquare: IconDefinition = faCheckSquare;
  showVal = true;
  constructor() { }

  ngOnInit() {
    if (this.lbl === '') { this.lbl = this.name; }
    if (this.obj[this.name] === -1) {
      this.showVal = false;
    }
  }

  toggle() {
    if (this.obj[this.name] === -1) {
      this.obj[this.name] = 0;
      this.showVal = true;
    } else {
      this.obj[this.name] = -1;
      this.showVal = false;
    }
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
