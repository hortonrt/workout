import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { WorkoutNowComponent } from '../_pages/workout-now/workout-now.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmCustomGuard implements CanDeactivate<WorkoutNowComponent> {
  constructor() { }
  canDeactivate(component: WorkoutNowComponent) {
    if (component.exercising) {
      return confirm(
        'Are you sure you want to leave. All progress will be lost.',
      );
    }
    return true;
  }
}
