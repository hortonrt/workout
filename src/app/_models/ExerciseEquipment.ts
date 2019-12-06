import { Exercise } from './Exercise';
import { Equipment } from './Equipment';

export interface ExerciseEquipment {
  ExerciseEquipmentID: number;
  ExerciseID: number;
  Exercise: Exercise;
  EquipmentID: number;
  Equipment: Equipment;
  IsUsed: boolean;
  IsOptional: boolean;
  EquipmentName: string;
  Name: string;
}
