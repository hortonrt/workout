import { RoutineBlockSetExercise } from './RoutineBlockSetExercise';

export interface RoutineBlockSet {
  RoutineBlockSetID: number;
  SetNumber: number;
  Exercises: RoutineBlockSetExercise[];
}
