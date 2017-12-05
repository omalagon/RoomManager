import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Toast, ToastController} from 'ionic-angular';
import {Room} from "../../app/model/room";
import {HttpRoomProvider} from "../../providers/http-room/http-room";
import {Location} from '../../app/model/location';
import { HttpLocationProvider } from '../../providers/http-location/http-location';
import {ImagePicker} from "@ionic-native/image-picker";
import {Constants} from "../../app/model/constants";

@IonicPage()
@Component({
  selector: 'page-create-edit',
  templateUrl: 'create-edit.html',
  providers: [HttpRoomProvider]
})
export class CreateEditPage {
  private _room: Room;
  private _title: string;
  private _toast: Toast;
  private _locations: Array<Location>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _httpRoomProvider: HttpRoomProvider,
              private _httpLocationProvider: HttpLocationProvider,
              private _toastCtrl: ToastController,
              private _imagePicker: ImagePicker) {
      this.init();
  }

  init() {
    this.room = this.navParams.get('room');
    this.title = 'Editar Sala';
    if (this.isNullOrUndefined(this.room)) {
      this.title = 'Crear Sala';
      this.room = new Room();
    }
    this.locations = new Array<Location>();
    this.loadLocations();
  }

  loadLocations(): void {
    this._httpLocationProvider.getLocations().subscribe(
      (response) => {
        let list: any = response;
        for (const key in list){
            this.locations.push(list[key]);
        }
      },
      (error) => {}
    );
  }

  createOrEdit(room: Room): void {
    let id = room.id;
    let message: string = `La sala ${room.name} ha sido editada`;
    let toast: Toast;
    room.id = null; //It is useless within the object
    // Creates
    if (this.isNullOrUndefined(id)) {
      id = room.name.toLocaleLowerCase().replace(/\s+/g, '');
      message = `La sala ${room.name} ha sido creada`;
      this._httpRoomProvider.createRoom(id, room).subscribe(
        (response) => this.handleResponse(message),
        (error) => this.handleError(error),
        () => this.complete()
      );
    } else { // Edits
      message = `La sala ${room.name} ha sido editada`;
      this._httpRoomProvider.editRoom(id, room).subscribe(
        (response) => this.handleResponse(message),
        (error) => this.handleError(error),
        () => this.complete()
      );
    }
  }

  selectImage () {
    this._imagePicker.getPictures({maximumImagesCount: 1}).then(
      (results) => {
        for (let index = 0; index < results.length; index++) {
          this.room.imageURL = results[index];
        }
      },
      (error) => console.log(Constants.ERROR)
    );
  }

  private handleResponse (message: string): void {
    this.toast = this.buildToaster(message);
    this.goBack();
  }

  private handleError (error: any): void {
    this.toast = this.buildToaster(Constants.ERROR);
  }

  private complete (): void {
    this.toast.present();
  }

  goBack(): void {
    this.navCtrl.popToRoot();
  }

  private isNullOrUndefined(value: any): boolean {
    return value === undefined || value === null;
  }

  private buildToaster(text: string): Toast {
    return this._toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
  }

  // Getters and Setters
  public get room(): Room {
    return this._room;
  }

  public set room(value: Room) {
    this._room = value;
  }

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get toast(): Toast {
    return this._toast;
  }

  public set toast(value: Toast) {
    this._toast = value;
  }

	public get locations(): Array<Location> {
		return this._locations;
	}

	public set locations(value: Array<Location>) {
		this._locations = value;
	}

}
