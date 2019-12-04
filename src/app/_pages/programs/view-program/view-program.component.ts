import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserWorkoutHistory } from 'src/app/_models/UserWorkoutHistory';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Program } from 'src/app/_models/Program';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NeweditDayComponent } from '../newedit/newedit-day/newedit-day.component';
import { NeweditPhaseComponent } from '../newedit/newedit-phase/newedit-phase.component';
import { NeweditProgramComponent } from '../newedit/newedit-program/newedit-program.component';
import { NeweditProgramroutineComponent } from '../newedit/newedit-programroutine/newedit-programroutine.component';


@Component({
  selector: 'app-view-program',
  templateUrl: './view-program.component.html',
})
export class ViewProgramComponent implements OnInit, OnDestroy {
  program: Program = {} as Program;
  routeSub: Subscription = null;
  progSub: Subscription = null;
  editing = false;
  workoutHistory: UserWorkoutHistory[] = [] as UserWorkoutHistory[];
  loaded = false;
  bsModalRef: BsModalRef;
  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.program.ProgramID = Number(params.get('id'));
      this.progSub = this.service.get('Programs', this.program.ProgramID).subscribe((data: Program) => {
        this.program = data;
        this.loaded = true;
      });
    });
  }

  ngOnDestroy() {
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.progSub) { this.progSub.unsubscribe(); }
  }
  neweditDay(day) {
    const initialState = {
      obj: day,
      finish: () => {
        alert('hi');
      }
    };
    this.bsModalRef = this.modalService.show(NeweditDayComponent, { initialState });
  }

  neweditPhase(phase) {
    const initialState = {
      obj: phase,
      finish: () => {
        alert('hi');
      }
    };
    this.bsModalRef = this.modalService.show(NeweditPhaseComponent, { initialState });
  }

  neweditProgram(program) {
    const initialState = {
      obj: program,
      finish: () => {
        alert('hi');
      }
    };
    this.bsModalRef = this.modalService.show(NeweditProgramComponent, { initialState });
  }
  neweditProgramRoutine(progranrouting) {
    const initialState = {
      obj: progranrouting,
      finish: () => {
        alert('hi');
      }
    };
    this.bsModalRef = this.modalService.show(NeweditProgramroutineComponent, { initialState });
  }

  clone(obj) {
    alert('clone');
  }

  delete(obj) {
    alert('delete');
  }
}
