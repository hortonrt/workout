import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkoutService } from 'src/app/_services/workout.service';

@Component({
  selector: 'app-newedit-day',
  templateUrl: './newedit-day.component.html',
  styleUrls: ['./newedit-day.component.scss']
})
export class NeweditDayComponent implements OnInit {
  @ViewChild('dayForm', { static: false }) form: any;
  obj = null;
  finish = null;
  original = null;
  constructor(public bsModalRef: BsModalRef, private service: WorkoutService) { }

  ngOnInit() {
    this.original = Object.assign({}, this.obj);
    if (!this.obj.ProgramDayID) {
      Object.assign(this.obj, {
        ProgramDayID: 0,
      });
    }
  }

  save() {
    if (this.form.valid) {
      const payload: any = Object.assign({}, this.obj);
      delete payload.Routines;
      this.service.post('ProgramDays', payload).subscribe((day: any) => {
        if (payload.ProgramDayID === 0) {
          payload.ProgramDayID = day.ProgramDayID;
          payload.Routines = [];
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
    Object.assign(this.obj, this.original);
    this.bsModalRef.hide();
  }
}
