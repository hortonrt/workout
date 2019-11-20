import { Exercise } from './Exercise';
import { WeightType } from './WeightType';
import { RepType } from './RepType';
import { SideType } from './SideType';

export interface RoutineBlockSetExercise {
  RoutineBlockSetExerciseID: number;
  ExerciseID: number;
  Exercise: Exercise;
  Reps: number;
  WeightTypeID: number;
  WeightType: WeightType;
  RepTypeID: number;
  RepType: RepType;
  ExerciseOrder: number;
  SideTypeID: number;
  SideType: SideType;
  PostRest: number;
}
