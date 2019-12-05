import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IconDefinition, faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { WorkoutService } from 'src/app/_services/workout.service';


@Component({
  selector: 'app-newedit-program',
  templateUrl: './newedit-program.component.html',
  styleUrls: ['./newedit-program.component.scss']
})
export class NeweditProgramComponent implements OnInit {
  @ViewChild('programForm', { static: false }) form: any;
  obj = null;
  finish = null;
  original = null;
  constructor(public bsModalRef: BsModalRef, private service: WorkoutService) { }

  ngOnInit() {
    console.log(Object.assign({}, this.obj));
    if (!this.obj) {
      this.obj = {
        ProgramID: 0,
        Name: ''
      };
    }
    this.original = Object.assign({}, this.obj);
  }

  save() {
    if (this.form.valid) {
      const payload: any = Object.assign({}, this.obj);
      this.service.post('Programs', payload).subscribe((program: any) => {
        this.finish(program);
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
