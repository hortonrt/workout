import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IconDefinition, faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-newedit-block',
  templateUrl: './newedit-block.component.html',
  styleUrls: ['./newedit-block.component.scss']
})
export class NeweditBlockComponent implements OnInit, OnDestroy {
  @ViewChild('blockForm', { static: false }) form: any;
  obj = null;
  finish = null;
  blockTypes = null;
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
    this.listSub = this.service.getAll('Lists').subscribe((lists: any) => {
      this.blockTypes = lists.BlockTypes;
      if (!this.obj.RoutineBlockID) {
        Object.assign(this.obj, {
          RoutineBlockID: 0,
          AutoRun: false,
          BlockTypeID: null,
          ProgressDiff: 0.0,
          ProgressType: 'None',
          BlockType: null
        });
      }
    });
  }

  save() {
    if (this.form.valid) {
      const payload: any = Object.assign({}, this.obj);
      payload.BlockTypeID = Number(payload.BlockTypeID);
      delete payload.BlockType;
      delete payload.Sets;
      this.service.post('RoutineBlocks', payload).subscribe((block: any) => {
        payload.BlockType = this.blockTypes.find(x => x.BlockTypeID === payload.BlockTypeID);
        if (payload.RoutineBlockID === 0) {
          payload.RoutineBlockID = block.RoutineBlockID;
          payload.Sets = [];
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
