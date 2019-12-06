import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-measurement',
  templateUrl: './create-measurement.component.html',
  styleUrls: ['./create-measurement.component.scss']
})
export class CreateMeasurementComponent {
  measurement = null;
  saveMeasurement = null;
  loaded = false;

  constructor(public bsModalRef: BsModalRef) { }

  save() {
    this.saveMeasurement(this.measurement);
    this.bsModalRef.hide();
  }

  cancel() {
    this.bsModalRef.hide();
  }

}
