import { Component, OnInit, OnDestroy } from '@angular/core';
import { Routine } from 'src/app/_models/Routine';
import { ActivatedRoute } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faStopwatch, faPlus, faCertificate, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NeweditBlockComponent } from '../newedit/newedit-block/newedit-block.component';
import { NeweditExerciseComponent } from '../newedit/newedit-exercise/newedit-exercise.component';
import { NeweditRoutineComponent } from '../newedit/newedit-routine/newedit-routine.component';
import { NeweditSetComponent } from '../newedit/newedit-set/newedit-set.component';

@Component({
  selector: 'app-view-routine',
  templateUrl: './view-routine.component.html',
  styleUrls: ['./view-routine.component.scss']
})
export class ViewRoutineComponent implements OnInit, OnDestroy {
  routine: Routine = {} as Routine;
  programroutineid: number;
  loaded = false;
  faStopWatch: IconDefinition = faStopwatch;
  faPlus: IconDefinition = faPlus;
  faCertificate: IconDefinition = faCertificate;
  faHeartbeat = faHeartbeat;
  routeSub: Subscription = null;
  routineSub: Subscription = null;
  qsub: Subscription = null;
  maxSets = 0;
  editing = false;
  bsModalRef: BsModalRef;
  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.routine.RoutineID = Number(params.get('routineid'));
      this.programroutineid = Number(params.get('programroutineid') || -1);
      this.routineSub = this.service.get('Routines', this.routine.RoutineID).subscribe((data: Routine) => {
        this.routine = data;
        this.qsub = this.route.queryParams.subscribe(paramsQ => {
          if (paramsQ.edit === '1') { this.editing = true; }
          this.loaded = true;
        });
      });
    });

  }
  ngOnDestroy() {
    if (this.routineSub) { this.routineSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.qsub) { this.qsub.unsubscribe(); }
  }

  neweditBlock(block) {
    const initialState = {
      obj: block,
      finish: () => {
        alert('hi');
      }
    };
    this.bsModalRef = this.modalService.show(NeweditBlockComponent, { initialState });
  }

  neweditExercise(exercise) {
    const initialState = {
      obj: exercise,
      finish: () => {
        alert('hi');
      }
    };
    this.bsModalRef = this.modalService.show(NeweditExerciseComponent, { initialState });
  }

  neweditRoutine($event) {
    const initialState = { obj: $event, finish: (routine) => { Object.assign(this.routine, routine); } };
    this.bsModalRef = this.modalService.show(NeweditRoutineComponent, { initialState });
  }
  neweditSet(set) {
    const initialState = {
      obj: set,
      finish: () => {
        alert('hi');
      }
    };
    this.bsModalRef = this.modalService.show(NeweditSetComponent, { initialState });
  }

  clone(obj) {
    alert('clone');
  }

  delete(obj) {
    alert('delete');
  }
}
