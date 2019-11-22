import { Component, OnInit, Input } from '@angular/core';
import { RepMaxChartComponent } from 'src/app/_components/rep-max-chart/rep-max-chart.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-exercises-current',
  templateUrl: './exercises-current.component.html',
})
export class ExercisesCurrentComponent implements OnInit {
  @Input() history = null;

  bsModalRef = null;
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  viewRepMax(ormIn) {
    const initialState = {
      ORM: ormIn
    };
    this.bsModalRef = this.modalService.show(RepMaxChartComponent, { initialState });
  }

}
