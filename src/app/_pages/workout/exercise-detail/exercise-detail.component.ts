import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { RepMaxChartComponent } from 'src/app/_components/rep-max-chart/rep-max-chart.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.scss']
})
export class ExerciseDetailComponent implements OnInit {
  @Input() we = null;
  @Input() activeExercise = null;
  bands = null;
  bsModalRef = null;
  modalRef = null;
  constructor(
    private service: WorkoutService,
    private modalService: BsModalService
  ) {
    this.bands = Object.assign([], this.service.bands);
  }

  ngOnInit() {
  }

  bandColor(weight) {
    return this.bands.find(x => x.v === weight).n;
  }

  viewRepMax(ormIn) {
    const initialState = {
      ORM: ormIn
    };
    this.bsModalRef = this.modalService.show(RepMaxChartComponent, { initialState, ignoreBackdropClick: true });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
