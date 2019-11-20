import { Exercise } from './Exercise';

export interface UserWorkoutExerciseHistory {
  UserWorkoutExerciseHistoryID: number;
  RoutineBlockSetExerciseID: number;
  RoutineBlockSetID: number;
  RoutineBlockID: number;
  RoutineID: number;
  ExerciseID: number;
  Exercise: Exercise;
  Reps: number;
  Weight: number;
  Rating: number;
  ExerciseOrder: number;
  UserID: number;
  ExerciseStart: any;
  ExerciseEnd: any;
  Duration: number;
}
