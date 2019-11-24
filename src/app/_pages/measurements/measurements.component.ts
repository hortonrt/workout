import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserMeasurementHistory } from 'src/app/_models/UserMeasurementHistory';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WorkoutService } from 'src/app/_services/workout.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateMeasurementComponent } from './create-measurement/create-measurement.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.scss']
})
export class MeasurementsComponent implements OnInit {
  currentUser: User = {} as User;
  measurements: UserMeasurementHistory[] = [] as UserMeasurementHistory[];
  sorted: UserMeasurementHistory[] = [] as UserMeasurementHistory[];
  bsModalRef: BsModalRef;
  loaded = false;

  constructor(
    private authenticationService: AuthenticationService,
    private service: WorkoutService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((x: User) => {
      this.currentUser = x;
      this.load();
    });
  }

  load() {
    this.loaded = false;
    this.service.getAll('UserMeasurementHistory').subscribe((data: UserMeasurementHistory[]) => {
      this.sorted = Object.assign([], data.sort((a, b) => (new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime())));
      this.measurements = data;
      this.loaded = true;
    });
  }

  addMeasurement(meas) {
    if (meas === undefined) {
      const lastMeas = this.sorted[0];
      meas = Object.assign({}, lastMeas);
      const dp = new DatePipe(navigator.language);
      const p = 'yyyy-MM-dd';
      const dtr = dp.transform(new Date(), p);
      meas.DateCreated = dtr;
      meas.UserMeasurementHistoryID = -1;
      if (this.measurements.length === 0) {
        meas.Weight = 0.0;
        meas.Fat = 0.0;
        meas.Water = 0.0;
        meas.Bone = 0.0;
        meas.Visceral = 0.0;
        meas.BMR = 0;
        meas.Muscle = 0.0;
        meas.BMI = 0.0;
      }
    } else {
      const dp = new DatePipe(navigator.language);
      const p = 'yyyy-MM-dd';
      const dtr = dp.transform(meas.DateCreated, p);
    }
    delete meas.UserID;
    const initialState = {
      measurement: meas,
      saveMeasurement: (measurement) => {
        const pay = Object.assign({}, measurement);
        delete pay.FatL;
        delete pay.WaterL;
        this.service.post('UserMeasurementHistory', pay).subscribe((data: UserMeasurementHistory[]) => {
          this.load();
        });
      }
    };
    this.bsModalRef = this.modalService.show(CreateMeasurementComponent, { initialState });
  }

  delete(m: UserMeasurementHistory) {
    if (confirm('Are you sure you want to delete this line?')) {
      this.service.delete('UserMeasurementHistory', m.UserMeasurementHistoryID, 'UserMeasesurement').subscribe(x => {
        this.load();
      });
    }
  }
}
