import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Location} from '../../app/model/location';

@Injectable()
export class HttpLocationProvider {

  private baseURL: string = 'https://roommanager-68fdf.firebaseio.com/location';

  constructor(public http: HttpClient) {
  }

  getLocations (): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.baseURL}.json`);
  }
}
