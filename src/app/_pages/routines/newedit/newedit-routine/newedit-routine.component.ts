import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IconDefinition, faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { WorkoutService } from 'src/app/_services/workout.service';

@Component({
  selector: 'app-newedit-routine',
  templateUrl: './newedit-routine.component.html',
  styleUrls: ['./newedit-routine.component.scss']
})
export class NeweditRoutineComponent implements OnInit {
  @ViewChild('routineForm', { static: false }) form: any;
  obj = null;
  finish = null;
  faSquare: IconDefinition = faSquare;
  faCheckSquare: IconDefinition = faCheckSquare;
  original = null;
  constructor(public bsModalRef: BsModalRef, private service: WorkoutService) { }

  ngOnInit() {
    if (!this.obj) {
      this.obj = {
        RoutineID: 0,
        Name: '',
        IsFitTest: false
      };
    }
    this.original = Object.assign({}, this.obj);
  }

  save() {
    if (this.form.valid) {
      const payload: any = Object.assign({}, this.obj);
      delete payload.Blocks;
      delete payload.NeededEquipment;
      delete payload.OptionalEquipment;
      delete payload.PrimaryMuscleGroups;
      delete payload.SecondaryMuscleGroups;
      delete payload.UserID;
      this.service.post('Routines', payload).subscribe((routine: any) => {
        this.finish(routine);
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
