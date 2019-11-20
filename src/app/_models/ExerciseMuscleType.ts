import { Exercise } from './Exercise';
import { MuscleType } from './MuscleType';

export interface ExerciseMuscleType {
  ExerciseMuscleTypeID: number;
  ExerciseID: number;
  Exercise: Exercise;
  MuscleTypeID: number;
  MuscleType: MuscleType;
  MuscleTypeName: string;
  IsPrimary: boolean;
  IsWorked: boolean;
}
