import { MuscleGroupType } from './MuscleGroupType';
import { Equipment } from './Equipment';
import { WorkoutExercise } from './WorkoutExercise';

export interface Workout {
  PrimaryMuscleGroups: MuscleGroupType[];
  SecondaryMuscleGroups: MuscleGroupType[];
  NeededEquipment: Equipment[];
  OptionalEquipment: Equipment[];
  Exercises: WorkoutExercise[];
  Blocks: number;
  Sets: number;
  AvgDuration: number;
  ProgramID: number;
  ProgramDayID: number;
  ProgramPhaseID: number;
  ProgramRoutineID: number;
  RoutineName: string;
  RoutineID: number;
}
