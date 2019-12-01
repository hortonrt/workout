import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUser = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser')),
    );
  }

  public get currentUserValue(): User {
    return this.currentUser.value;
  }

  ping() {
    return this.http.get<any>(`${environment.api}ping.php`);
  }

  tokenExpired() {
    const now = new Date();
    const currentUser = this.currentUser.value;
    if (!currentUser) {
      return true;
    } else {
      const expires = new Date(Date.UTC(
        Number(currentUser.Expires.substr(0, 4)),
        Number(currentUser.Expires.substr(5, 2)),
        Number(currentUser.Expires.substr(8, 2)),
        Number(currentUser.Expires.substr(11, 2)),
        Number(currentUser.Expires.substr(14, 2)),
        Number(currentUser.Expires.substr(17, 2))));
      if (now <= expires) {
        return false;
      } else {
        return true;
      }
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.api}rest/auth.php`, {
        Username: username,
        Password: password,
      })
      .pipe(
        map(user => {
          if (user && user.Token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser.next(user);
          }
          return user;
        }),
      );
  }

  logout(justclear) {
    localStorage.removeItem('currentUser');
    this.currentUser.next(null);
    if (!justclear) {
      let url = window.location.protocol + '//' + window.location.hostname;
      if (window.location.port.length) {
        url += ':' + window.location.port;
      }
      window.location.assign(url + '/login');
    }
  }
}
