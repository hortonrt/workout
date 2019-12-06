import { Component, OnInit, OnDestroy } from '@angular/core';
import { Routine } from 'src/app/_models/Routine';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NeweditRoutineComponent } from './newedit/newedit-routine/newedit-routine.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html'
})
export class RoutinesComponent implements OnInit, OnDestroy {
  routines: Routine[];
  routineSub: Subscription = null;
  loaded = false;
  bsModalRef: BsModalRef;
  constructor(
    private service: WorkoutService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routineSub = this.service.getAll('UserRoutines').subscribe((data: Routine[]) => {
      this.routines = data;
      this.loaded = true;
    });
  }

  ngOnDestroy() {
    if (this.routineSub) { this.routineSub.unsubscribe(); }
  }

  newRoutine() {
    const initialState = {
      obj: null,
      finish: (routine) => {
        if (routine.RoutineID > 0) {
          this.router.navigate(['/routine/view', -1, routine.RoutineID], { queryParams: { edit: '1' } });
        }
      }
    };
    this.bsModalRef = this.modalService.show(NeweditRoutineComponent, { initialState, ignoreBackdropClick: true });
  }
}
