import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-rep-max-chart',
  templateUrl: './rep-max-chart.component.html'
})
export class RepMaxChartComponent implements OnInit {
  reps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  ORM: null;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  cancel() {
    this.bsModalRef.hide();
  }

}
