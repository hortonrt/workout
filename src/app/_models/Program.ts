import { ProgramPhase } from './ProgramPhase';

export interface Program {
  ProgramID: number;
  Name: string;
  Phases: ProgramPhase[];
}
