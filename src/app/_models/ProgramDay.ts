import { ProgramRoutine } from './ProgramRoutine';

export interface ProgramDay {
  ProgramDayID: number;
  DayNumber: number;
  Routines: ProgramRoutine[];
}
