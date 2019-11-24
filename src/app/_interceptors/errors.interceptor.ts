import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private router: Router, private activeRoute: ActivatedRoute) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          let url = window.location.protocol + '//' + window.location.hostname;
          if (window.location.port.length) {
            url += ':' + window.location.port;
          }
          window.location.assign(url + '/login');
          // this.router.navigate(['login']);
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      }),
    );
  }
}
