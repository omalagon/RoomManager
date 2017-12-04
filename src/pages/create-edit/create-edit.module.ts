import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateEditPage } from './create-edit';

@NgModule({
  declarations: [
    CreateEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateEditPage),
  ],
})
export class CreateEditPageModule {}
