import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  bands = [
    { v: 0, n: 'grey' },
    { v: 5, n: 'green' },
    { v: 10, n: 'blue' },
    { v: 15, n: 'orange' },
    { v: 20, n: 'red' },
    { v: 25, n: 'purple' }];

  dumbbells = [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

  public lists: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private rootpath = environment.api + 'rest/';
  constructor(private http: HttpClient) {
    this.getAll('Lists').subscribe(x => {
      this.lists.next(x);
    });
  }

  getAll(path: string) {
    return this.http.get(this.rootpath + path + '.php');
  }


  getWO(p: number, r: number) {
    return this.http.get(this.rootpath + 'Workout.php?p=' + p + '&r=' + r);
  }

  get(path: string, id: any) {
    return this.http.get(this.rootpath + path + '.php?i=' + id);
  }

  getBy(path: string, val: string, field: string) {
    return this.http.get(this.rootpath + path + '.php?v=' + val + '&f=' + field);
  }

  post(path: string, payload: any) {
    return this.http.post(this.rootpath + path + '.php', payload, this.httpOptions);
  }

  delete(path: string, id: number, type: string) {
    return this.http.delete(this.rootpath + path + '.php?i=' + id + '&t=' + type, this.httpOptions);
  }
}
