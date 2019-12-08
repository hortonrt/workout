import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserWorkoutHistory } from 'src/app/_models/UserWorkoutHistory';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Program } from 'src/app/_models/Program';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NeweditDayComponent } from '../newedit/newedit-day/newedit-day.component';
import { NeweditPhaseComponent } from '../newedit/newedit-phase/newedit-phase.component';
import { NeweditProgramComponent } from '../newedit/newedit-program/newedit-program.component';
import { NeweditProgramroutineComponent } from '../newedit/newedit-programroutine/newedit-programroutine.component';
import { isArray } from 'util';
import * as cloneDeep from 'lodash/cloneDeep';


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
  cloneSub: Subscription = null;
  qsub: Subscription = null;
  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.program.ProgramID = Number(params.get('id'));
      this.progSub = this.service.get('Programs', this.program.ProgramID).subscribe((data: Program) => {
        this.program = data;
        this.loaded = true;
        this.qsub = this.route.queryParams.subscribe(paramsQ => {
          if (paramsQ.edit === '1') { this.editing = true; }
          this.loaded = true;
        });
      });
    });
  }

  replaceIDs(object, toBeReplaced) {
    Object.keys(object).some((k: any) => {
      if ((typeof object[k] === 'object' && !isArray(object[k]) && isNaN(k)) || k === 'RoutineCount') {
        delete object[k];
      }
      if (toBeReplaced.indexOf(k) !== -1) {
        object[k] = 0;
      }
      if (object[k] && typeof object[k] === 'object') {
        this.replaceIDs(object[k], toBeReplaced);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.progSub) { this.progSub.unsubscribe(); }
    if (this.qsub) { this.qsub.unsubscribe(); }
    if (this.cloneSub) { this.cloneSub.unsubscribe(); }
  }

  neweditDay(day, phase) {
    if (!day) {
      day = { ProgramDayID: 0, ProgramPhaseID: phase.ProgramPhaseID, DayNumber: phase.Days.length + 1 };
    }
    const initialState = {
      obj: day,
      finish: (newDay) => {
        if (newDay) {
          phase.Days.push(newDay);
        } else {
          phase = this.program.Phases.find(b => b.ProgramPhaseID === day.ProgramPhaseID);
        }
        phase.Days.sort((a, b) => a.DayNumber - b.DayNumber);
      }
    };
    this.bsModalRef = this.modalService.show(NeweditDayComponent, { initialState, ignoreBackdropClick: true });
  }

  neweditPhase(phase) {
    if (!phase) {
      phase = { ProgramPhaseID: 0, ProgramID: this.program.ProgramID, PhaseOrder: this.program.Phases.length + 1 };
    }
    const initialState = {
      obj: phase,
      finish: (newPhase: any) => {
        if (newPhase) {
          this.program.Phases.push(newPhase);
        }
        this.program.Phases.sort((a, b) => a.PhaseOrder - b.PhaseOrder);
      }
    };
    this.bsModalRef = this.modalService.show(NeweditPhaseComponent, { initialState, ignoreBackdropClick: true });
  }

  neweditProgram($event) {
    const initialState = {
      obj: $event,
      finish: (program) => {
        Object.assign(this.program, program);
      }
    };
    this.bsModalRef = this.modalService.show(NeweditProgramComponent, { initialState, ignoreBackdropClick: true });
  }

  editProgramRoutine($event) {
    const initialState = {
      obj: $event,
      finish: () => {
        this.deepSearch(this.program, 'ProgramDayID', $event.ProgramDayID).Routines.sort((a, b) => a.RoutineOrder - b.RoutineOrder);
      }
    };
    this.bsModalRef = this.modalService.show(NeweditProgramroutineComponent, { initialState, ignoreBackdropClick: true });
  }


  newProgramRoutine($event) {
    let routine = null;
    if (!$event.obj) {
      routine = { ProgramRoutineID: 0, ProgramDayID: $event.addObj.ProgramDayID, RoutineOrder: $event.addObj.Routines.length + 1 };
    } else {
      routine = $event.obj;
    }
    const initialState = {
      obj: routine,
      finish: (newRoutine) => {
        if (newRoutine) {
          $event.addObj.Routines.push(newRoutine);
          $event.addObj.Routines.sort((a, b) => a.RoutineOrder - b.RoutineOrder);
        }
      }
    };
    this.bsModalRef = this.modalService.show(NeweditProgramroutineComponent, { initialState, ignoreBackdropClick: true });
  }

  clone(obj) {
    const conf = confirm('Are you sure you want to clone this?');
    if (conf) {
      const payload = cloneDeep(obj.obj);
      if (obj.type === 'Programs') {
        this.replaceIDs(payload, ['ProgramID', 'ProgramPhaseID', 'ProgramDayID', 'ProgramRoutineID']);
        delete payload.UserID;
        payload.Name += ' (Clone)';
      } else if (obj.type === 'ProgramPhases') {
        this.replaceIDs(payload, ['ProgramPhaseID', 'ProgramDayID', 'ProgramRoutineID']);
        payload.PhaseOrder = this.program.Phases.length + 1;
        payload.Name += ' (Clone)';
      } else if (obj.type === 'ProgramDays') {
        this.replaceIDs(payload, ['ProgramDayID', 'ProgramRoutineID']);
        const phase = this.program.Phases.find(b => b.ProgramPhaseID === obj.obj.ProgramPhaseID);
        payload.DayNumber = phase.Days.length + 1;
      } else if (obj.type === 'ProgramRoutines') {
        this.replaceIDs(payload, ['ProgramRoutineID']);
        const set = this.deepSearch(this.program, 'ProgramDayID', obj.obj.ProgramDayID);
        payload.RoutineOrder = set.Routines.length + 1;
      }
      this.cloneSub = this.service.post(obj.type, payload).subscribe((x: any) => {
        if (obj.type === 'Programs') {
          this.router.navigate(['/program/view', x.ProgramID]);
        } else {
          this.progSub = this.service.get('Programs', this.program.ProgramID).subscribe((data: Program) => {
            if (obj.type === 'ProgramPhases') {
              this.program.Phases = Object.assign([], data.Phases);
            } else if (obj.type === 'ProgramDays') {
              const phase = this.deepSearch(this.program, 'ProgramPhaseID', obj.obj.ProgramPhaseID);
              phase.Days = Object.assign([], this.deepSearch(data, 'ProgramPhaseID', obj.obj.ProgramPhaseID).Days);
            } else if (obj.type === 'ProgramRoutines') {
              const day = this.deepSearch(this.program, 'ProgramDayID', obj.obj.ProgramDayID);
              day.Routines = Object.assign([], this.deepSearch(data, 'ProgramDayID', obj.obj.ProgramDayID).Routines);
            }
          });
        }
      });
    }
  }

  delete(obj) {
    const conf = confirm('Are you sure you want to delete this item?');
    let id = -99;
    if (obj.type === 'Programs') {
      id = obj.obj.ProgramID;
    } else if (obj.type === 'ProgramPhases') {
      id = obj.obj.ProgramPhaseID;
    } else if (obj.type === 'ProgramDays') {
      id = obj.obj.ProgramDayID;
    } else if (obj.type === 'ProgramRoutines') {
      id = obj.obj.ProgramRoutineID;
    }
    if (conf) {
      this.service.delete('Programs', id, obj.type).subscribe(() => {
        if (obj.type === 'Programs') {
          this.router.navigate(['/programs']);
        } else if (obj.type === 'ProgramPhases') {
          this.program.Phases.splice(this.program.Phases.indexOf(this.program.Phases.find(b => b.ProgramPhaseID === id)), 1);
          this.program.Phases.sort((a, b) => a.PhaseOrder - b.PhaseOrder);
        } else if (obj.type === 'ProgramDays') {
          const phase = this.program.Phases.find(b => b.ProgramPhaseID === obj.obj.ProgramPhaseID);
          phase.Days.splice(phase.Days.indexOf(phase.Days.find(b => b.ProgramDayID === id)), 1);
          phase.Days.sort((a, b) => a.DayNumber - b.DayNumber);
        } else if (obj.type === 'ProgramRoutines') {
          const day = this.deepSearch(this.program, 'ProgramDayID', obj.obj.ProgramDayID);
          day.Routines.splice(day.Routines.indexOf(day.Routines.find(b => b.ProgramRoutineID === id)), 1);
          day.Routines.sort((a, b) => a.RoutineOrder - b.RoutineOrder);
        }
      });
    }
  }

  deepSearch(object, key, val) {
    if (object.hasOwnProperty(key) && object[key] === val) {
      return object;
    }

    for (const keyO of Object.keys(object)) {
      if (typeof object[keyO] === 'object') {
        const o = this.deepSearch(object[keyO], key, val);
        if (o != null) {
          return o;
        }
      }
    }
    return null;
  }
}
