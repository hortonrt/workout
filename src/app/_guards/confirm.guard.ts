import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { WorkoutComponent } from '../_pages/workout/workout.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmGuard implements CanDeactivate<WorkoutComponent> {
  constructor() { }
  canDeactivate(component: WorkoutComponent) {
    if (component.exercising) {
      return confirm(
        'Are you sure you want to leave. All progress will be lost.',
      );
    }
    return true;
  }
}
