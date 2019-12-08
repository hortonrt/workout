import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/User';
import { WorkoutService } from 'src/app/_services/workout.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Routine } from 'src/app/_models/Routine';
import { Subscription } from 'rxjs';
import { IconDefinition, faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('changeForm', { static: false }) changeForm: any;
  @ViewChild('proForm', { static: false }) proForm: any;
  users: User[] = [];
  user: User = null;
  curUser: User = null;
  loaded = false;
  admin = false;
  changeMessage = '';
  saveMessage = '';
  saveError = false;
  dumbbells = null;
  changeError = false;
  faSquare: IconDefinition = faSquare;
  faCheckSquare: IconDefinition = faCheckSquare;
  routines: Routine[] = [];
  newuser: User = {
    UserID: -1,
    FirstName: '',
    LastName: '',
    Username: '',
    Password: null,
    Height: 65,
    Birthdate: null,
    Token: '',
    Expires: null,
    IsAdmin: false,
    HighestDumbbell: 45,
    Display: 'Create New'
  };
  change = {
    UserID: -1,
    OldPassword: '',
    NewPassword: '',
    VerifyPassword: ''
  };
  getSub: Subscription = null;
  postSub: Subscription = null;
  changeSub: Subscription = null;
  constructor(private service: WorkoutService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.loaded = false;
    this.dumbbells = this.service.dumbbells;
    this.curUser = this.authService.currentUser.value;
    this.getSub = this.service.getAll('Users').subscribe((users: User[]) => {
      this.admin = users.length > 1 || (users.length === 1 && Boolean(users[0].IsAdmin) === true);
      this.users = Object.assign([], users);
      this.users.push(this.newuser);
      this.user = users.find(x => x.UserID === this.authService.currentUserValue.UserID);
      this.loaded = true;
    });
  }

  ngOnDestroy() {
    if (this.getSub) { this.getSub.unsubscribe(); }
    if (this.postSub) { this.postSub.unsubscribe(); }
    if (this.changeSub) { this.changeSub.unsubscribe(); }
  }

  save() {
    if (!this.proForm.invalid) {
      this.saveMessage = '';
      this.saveError = false;
      const payload = Object.assign({}, this.user);
      delete payload.Expires;
      delete payload.Token;
      this.postSub = this.service.post('Users', payload).subscribe((x: any) => {
        this.saveMessage = x.message;
      }, (e: any) => {
        console.log(e);
        this.saveError = true;
        this.saveMessage = e;
      });
    }
  }

  changePW() {
    if (!this.changeForm.invalid && this.change.NewPassword === this.change.VerifyPassword) {
      this.changeMessage = '';
      this.changeError = false;
      this.change.UserID = this.user.UserID;
      this.changeSub = this.service.post('Password', this.change).subscribe((x: any) => {
        this.changeMessage = x.message;
      }, (err: any) => {
        this.changeError = true;
        this.changeMessage = err;
      });
    }
  }
}
