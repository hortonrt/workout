import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CreateRoutineComponent } from '../_pages/routines/create-routine/create-routine.component';
@Injectable({
  providedIn: 'root',
})
export class CreateRoutineGuard
  implements CanDeactivate<CreateRoutineComponent> {
  constructor() { }
  canDeactivate(component: CreateRoutineComponent) {
    if (!component.routineForm.pristine) {
      return confirm(
        'Are you sure you want to leave. All progress will be lost.',
      );
    }
    return true;
  }
}
