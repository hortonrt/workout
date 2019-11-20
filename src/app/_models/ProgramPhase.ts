import { ProgramDay } from './ProgramDay';

export interface ProgramPhase {
  ProgramPhaseID: number;
  Name: string;
  PhaseOrder: number;
  Days: ProgramDay[];
}
