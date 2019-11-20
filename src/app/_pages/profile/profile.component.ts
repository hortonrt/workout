import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { WorkoutService } from 'src/app/_services/workout.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  users: User[] = [];
  user: User = null;
  loaded = false;
  admin = false;
  changeMessage = '';
  saveMessage = '';
  saveError = false;
  changeError = false;
  newuser: User = {
    UserID: -1,
    FirstName: 'Create',
    LastName: 'New',
    Username: '',
    Password: 'Password1!',
    Height: 0,
    Birthdate: null,
    Token: '',
    Expires: null,
    IsAdmin: false
  };
  change = {
    UserID: -1,
    OldPassword: '',
    NewPassword: '',
    VerifyPassword: ''
  };
  constructor(private service: WorkoutService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.loaded = false;
    this.service.getAll('Users').subscribe((users: User[]) => {
      this.admin = users.length > 1 || (users.length === 1 && Boolean(users[0].IsAdmin) === true);
      this.users = Object.assign([], users);
      this.users.push(this.newuser);
      this.user = users.find(x => x.UserID === this.authService.currentUserValue.UserID);
      this.loaded = true;
    });
  }

  save() {
    this.saveMessage = '';
    this.saveError = false;
    const payload = Object.assign({}, this.user);
    delete payload.Expires;
    delete payload.Token;
    this.service.post('Users', payload).subscribe((x: any) => {
      console.log(x);
      this.saveMessage = x.message;
    }, (err: any) => {
      console.log(err);
      this.saveError = true;
      this.saveMessage = err;
    });
  }

  changePW() {
    this.changeMessage = '';
    this.changeError = false;
    if (this.change.NewPassword !== this.change.VerifyPassword) {
      this.changeError = true;
      this.changeMessage = 'Passwords do not match.';
    } else {
      this.change.UserID = this.user.UserID;
      this.service.post('Password', this.change).subscribe((x: any) => {
        console.log(x);
        this.changeMessage = x.message;
      }, (err: any) => {
        console.log(err);
        this.changeError = true;
        this.changeMessage = err;
      });
    }
  }

}
