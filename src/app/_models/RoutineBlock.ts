import { BlockType } from './BlockType';
import { RoutineBlockSet } from './RoutineBlockSet';

export interface RoutineBlock {
  RoutineBlockID: number;
  BlockTypeID: number;
  BlockType: BlockType;
  BlockOrder: number;
  Sets: RoutineBlockSet[];
  ProgressDiff: number;
  ProgressType: string;
}
