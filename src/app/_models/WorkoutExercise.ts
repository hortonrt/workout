export interface WorkoutExercise {
  WorkoutExerciseID: number;
  BlockOrder: number;
  BlockTypeName: string;
  SetNumber: number;
  ExerciseName: string;
  ExerciseType: string;
  RepType: string;
  SideType: string;
  WeightType: string;
  Reps: number;
  Weight: number;
  Rating: number;
  PostRest: number;
  PrevWeight: number;
  PrevReps: number;
  PrevRating: number;
  PrevDate: Date;
  ExerciseID: number;
  RoutineBlockSetExerciseID: number;
  RoutineBlockID: number;
  RoutineBlockSetID: number;
  Active: boolean;
  Completed: boolean;
  HasPrevious: boolean;
}