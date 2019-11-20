import { MuscleGroupType } from './MuscleGroupType';

export interface MuscleType {
  MuscleTypeID: number;
  Name: string;
  MuscleGroupTypeID: number;
  MuscleGroupType: MuscleGroupType;
}
