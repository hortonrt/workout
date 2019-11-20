import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CreateExerciseComponent } from '../_pages/exercises/create-exercise/create-exercise.component';

@Injectable({
  providedIn: 'root',
})
export class CreateExerciseGuard
  implements CanDeactivate<CreateExerciseComponent> {
  constructor() { }
  canDeactivate(component: CreateExerciseComponent) {
    if (!component.exerciseForm.pristine) {
      return confirm(
        'Are you sure you want to leave. All progress will be lost.',
      );
    }
    return true;
  }
}
