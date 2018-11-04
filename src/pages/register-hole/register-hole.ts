import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera'

import { UserProvider } from './../../providers/user/user';
import { HoleProvider } from './../../providers/hole/hole';

@IonicPage()
@Component({
  selector: 'page-register-hole',
  templateUrl: 'register-hole.html',
})
export class RegisterHolePage {

  currentLocation: any;
  imageToUpload: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public toast: ToastController,
    private userProvider: UserProvider,
    private holeProvider: HoleProvider) {
    this.currentLocation = this.navParams.data.currentLocation;
  }

  ionViewDidLoad() {
    const user = this.userProvider.get()
    if (!user || !user.uniqueIdentificator) {
      console.log(`Moving to userinfo, user "${user ? user.name : 'invalid'}" doesnt have a unique identificator`)
      this.navCtrl.pop();
      this.navCtrl.push('UserInfoPage', {
        isMandatoryUniqueIdentificator: true,
        currentLocation: this.currentLocation
      })
      return
    }
    this.loadCamera()
  }

  loadCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: true,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options)
      .then((imageData) => {
        this.imageToUpload = 'data:image/jpeg;base64,' + imageData
      }, (err) => {
        console.log(`Error taking image: ${JSON.stringify(err)}`);
        this.displayToastMessage(`Se produjo un error inesperado al tomar la foto`)
        this.navCtrl.pop();
      });
  }

  uploadConfirmation() {
    this.holeProvider.registerNewHole(
      this.userProvider.get(),
      this.currentLocation,
      this.imageToUpload
    ).then(() => {
      this.displayToastMessage(`Hueco registrado exitosamente`)
      this.navCtrl.popTo('CurrentMap');
    }).catch(err => {
      console.log(`Error submitting data: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
      this.displayToastMessage(`Se produjo un error inesperado al crear el registro`)
    });
  }

  displayToastMessage(msg: string) {
    this.toast.create({
      message: msg,
      duration: 3000
    }).present()
  }
}
