import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IconDefinition, faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-newedit-set',
  templateUrl: './newedit-set.component.html',
  styleUrls: ['./newedit-set.component.scss']
})
export class NeweditSetComponent implements OnInit, OnDestroy {
  @ViewChild('setForm', { static: false }) form: any;
  obj = null;
  finish = null;
  faSquare: IconDefinition = faSquare;
  faCheckSquare: IconDefinition = faCheckSquare;
  original = null;
  listSub: Subscription = null;
  constructor(public bsModalRef: BsModalRef, private service: WorkoutService) { }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.unsubscribe(); }
  }

  ngOnInit() {
    this.original = Object.assign({}, this.obj);
    if (!this.obj.RoutineBlockSetID) {
      Object.assign(this.obj, {
        RoutineBlockSetID: 0,
      });
    }
  }

  save() {
    if (this.form.valid) {
      const payload: any = Object.assign({}, this.obj);
      delete payload.Exercises;
      this.service.post('RoutineBlockSet', payload).subscribe((set: any) => {
        if (payload.RoutineBlockSetID === 0) {
          payload.RoutineBlockSetID = set.RoutineBlockSetID;
          payload.Exercises = [];
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
