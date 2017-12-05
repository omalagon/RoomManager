import { Component } from '@angular/core';
import {AlertController, Toast,  ToastController,   Loading,    NavController} from 'ionic-angular';
import { HttpRoomProvider } from '../../providers/http-room/http-room';
import { Room } from '../../app/model/room';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Refresher } from 'ionic-angular/components/refresher/refresher';
import { CreateEditPage } from '../create-edit/create-edit';
import {Constants} from "../../app/model/constants";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpRoomProvider]
})
export class HomePage {

  private _roomList: Array<Room>;
  private _noDataFound: boolean;

  constructor(public navCtrl: NavController,
              private _httpRoomProvider: HttpRoomProvider,
              private _loadingController: LoadingController,
              private _toastCtrl: ToastController,
              private _alertCtrl: AlertController) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms(): void {
    let loading: Loading = this._loadingController.create({
      content: 'Cargando salas...'
    });
    loading.present();
    this._httpRoomProvider.getAllRooms().subscribe(
      (response: any) => {
        loading.dismiss();
        this.roomList = [];
        this.noDataFound = response === null;
        if (response !== null) {
          let list: any = response;
          for (const key in list) {
            let room = list[key];
            room.id = key;
            this.roomList.push(room);
          }
        }
      },
      (error) => {
        loading.dismiss();
        console.log(error);
      }
    );
  }

  searchRooms(event: any): void {
    let val = event.target.value;
    if (val && val.trim() != '' ) {
      this.roomList = this.roomList.filter((room) => {
        return (room.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.loadRooms();
    }
  }

  doRefresh(refresher: Refresher): void {
    refresher.complete();
    this.loadRooms();
  }

  toggleFavorite( selectedRoom: Room, fav: boolean): void {
    selectedRoom.isFavorite = fav;
    let toaster: Toast;
    this._httpRoomProvider.editRoom(selectedRoom.id, selectedRoom).subscribe(
      (response) => {
        let message: string = `${selectedRoom.name} ahora es tu favorita`;
        if (!fav) {
          message = `${selectedRoom.name} ya no es tu favorita`;
        }
        toaster = this.buildToaster(message);
      },
      (error) => {
        toaster = this.buildToaster(Constants.ERROR);
      },
      () => {
        toaster.present();
        this.loadRooms();
      }
    );
  }

  delete(selectedRoom: Room): void {
    let toaster: Toast;
    let alert = this._alertCtrl.create({
      title: 'Eliminar Sala',
      message: `¿Está seguro de eliminar la sala: ${selectedRoom.name} `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Aceptar',
          handler: () => {
            this._httpRoomProvider.deleteRoom(selectedRoom.id).subscribe(
              (response) => toaster = this.buildToaster(`La sala ${selectedRoom.name} ha sido eliminada!`),
              (error) => toaster = this.buildToaster(`${Constants.ERROR} eliminando la sala ${selectedRoom.name}`),
              () => {
                toaster.present();
                this.loadRooms();
              }
            );
          }
        }
      ]
    });
    alert.present();
  }

  addOrEditRoom(selectedRoom?: Room) {
    if (selectedRoom) {
        this.navCtrl.push(CreateEditPage, {'room': selectedRoom});
    }else {
        this.navCtrl.push(CreateEditPage);
    }
  }

  private buildToaster(text: string): Toast {
    return this._toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
  }
  //Getters and Setters
	public get roomList(): Array<Room> {
		return this._roomList;
	}

	public set roomList(value: Array<Room>) {
		this._roomList = value;
	}
  public get noDataFound(): boolean {
    return this._noDataFound;
  }

  public set noDataFound(value: boolean) {
    this._noDataFound = value;
  }
}
