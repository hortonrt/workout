import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkoutService } from 'src/app/_services/workout.service';

@Component({
  selector: 'app-newedit-programroutine',
  templateUrl: './newedit-programroutine.component.html',
  styleUrls: ['./newedit-programroutine.component.scss']
})
export class NeweditProgramroutineComponent implements OnInit, OnDestroy {
  @ViewChild('routineForm', { static: false }) form: any;
  obj = null;
  finish = null;
  original = null;
  listSub: Subscription = null;
  routines = null;
  constructor(public bsModalRef: BsModalRef, private service: WorkoutService) { }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.unsubscribe(); }
  }
  ngOnInit() {
    // this.obj = Object.assign({}, this.obj);
    this.listSub = this.service.getAll('UserRoutines').subscribe(routines => {
      this.routines = routines;
      if (!this.obj.ProgramRoutineID) {
        Object.assign(this.obj, {
          Routine: null,
          RoutineID: null
        });
      } else {
        this.obj.Routine = this.routines.find(x => x.RoutineID === this.obj.RoutineID);
      }
      this.original = Object.assign({}, this.obj);
    });

  }

  save() {
    if (this.form.valid) {
      this.obj.RoutineID = Number(this.obj.Routine.RoutineID);
      const payload: any = Object.assign({}, this.obj);
      const r = Object.assign({}, payload.Routine);
      const c = payload.RoutineCount;
      delete payload.Routine;
      delete payload.RoutineCount;
      this.service.post('ProgramRoutines', payload).subscribe((pr: any) => {
        if (payload.ProgramRoutineID === 0) {
          payload.ProgramRoutineID = pr.ProgramRoutineID;
          payload.Routine = r;
          payload.RoutineCount = c;
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
