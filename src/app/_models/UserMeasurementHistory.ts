import { User } from './User';

export interface UserMeasurementHistory {
  UserMeasurementHistoryID: number;
  Weight: number;
  Fat: number;
  Water: number;
  Bone: number;
  Visceral: number;
  BMR: number;
  Muscle: number;
  BMI: number;
  DateCreated: Date;
  UserID: number | null;
  User: User;
}
