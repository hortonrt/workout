import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkoutService } from 'src/app/_services/workout.service';

@Component({
  selector: 'app-newedit-phase',
  templateUrl: './newedit-phase.component.html',
  styleUrls: ['./newedit-phase.component.scss']
})
export class NeweditPhaseComponent implements OnInit {
  @ViewChild('phaseForm', { static: false }) form: any;
  obj = null;
  finish = null;
  original = null;
  constructor(public bsModalRef: BsModalRef, private service: WorkoutService) { }


  ngOnInit() {
    this.original = Object.assign({}, this.obj);
    if (!this.obj.ProgramPhaseID) {
      Object.assign(this.obj, {
        ProgramPhaseID: 0,
        Name: ''
      });
    }
  }

  save() {
    if (this.form.valid) {
      const payload: any = Object.assign({}, this.obj);
      delete payload.Days;
      this.service.post('ProgramPhases', payload).subscribe((phase: any) => {
        console.log(phase);
        if (payload.ProgramPhaseID === 0) {
          payload.ProgramPhaseID = phase.ProgramPhaseID;
          payload.Days = [];
          this.finish(payload);
        } else {
          Object.assign(this.obj, payload);
          this.finish(null);
        }
        this.bsModalRef.hide();
      }, (e => {
        console.log(e);
      }));
    }
  }

  close() {
    if (this.form.pristine) {
      Object.assign(this.obj, this.original);
      this.bsModalRef.hide();
    } else {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        Object.assign(this.obj, this.original);
        this.bsModalRef.hide();
      }
    }
  }
}
