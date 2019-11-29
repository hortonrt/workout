import { RoutineBlock } from './RoutineBlock';

export interface Routine {
  RoutineID: number;
  Name: string;
  Blocks: RoutineBlock[];
  IsFitTest: boolean;
}
