import { User } from './User';
import { UserWorkoutExerciseHistory } from './UserWorkoutExerciseHistory';
import { Program } from './Program';
import { ProgramRoutine } from './ProgramRoutine';

export interface UserWorkoutHistory {
  UserWorkoutHistoryID: number;
  UserID: number;
  User: User;
  Program: Program;
  ProgramRoutineID: number;
  ProgramRoutine: ProgramRoutine;
  ProgramPhaseID: number;
  ProgramDayID: number;
  ProgramID: number;
  StartTime: any;
  EndTime: any;
  Duration: number;
  Exercises: UserWorkoutExerciseHistory[];
  RoutineID: number;
}
