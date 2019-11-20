import { ExerciseType } from './ExerciseType';
import { ExerciseMuscleType } from './ExerciseMuscleType';
import { ExerciseEquipment } from './ExerciseEquipment';

export interface Exercise {
  ExerciseID: number;
  Name: string;
  ExerciseTypeID: number;
  ExerciseType: ExerciseType;
  MuscleTypes: ExerciseMuscleType[];
  Equipment: ExerciseEquipment[];
}
