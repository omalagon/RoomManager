import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Room } from '../../app/model/room';

@Injectable()
export class HttpRoomProvider {

  private baseURL: string = 'https://roommanager-68fdf.firebaseio.com/rooms';

  constructor(public http: HttpClient) {}

  getAllRooms (): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseURL}.json`);
  }

  findByName (roomName: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseURL}/${roomName}.json`);
  }

  createRoom (id: string, room: any): Observable<Room> {
    // Post couldn't be used because Firebase generated an Id that the app doesn't need
    return this.http.put<Room>(`${this.baseURL}/${id}.json`, room);
  }

  editRoom (id: string, room: Room): Observable<Room> {
    return this.http.patch<Room>(`${this.baseURL}/${id}.json`, room);
  }

  deleteRoom (index: string): Observable<Room> {
    return this.http.delete<Room>(`${this.baseURL}/${index}.json`);
  }
}
