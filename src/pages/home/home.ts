import { UserProvider } from './../../providers/user/user';

import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    private fire: AngularFireAuth,
    private userProvider: UserProvider,
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) { }

  loginWithFacebook() {
    this.fire.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((res) => {
        this.userProvider.getByUid(res.user.uid)
          .then(loggedUser => {
            this.userProvider.save(loggedUser || res.user)
              .then(usr => this.navCtrl.setRoot('CurrentMapPage'))
              .catch(this.displayErrorMessage)
          })
      })
  }

  displayErrorMessage(err) {
    console.log(`Error init fb session: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: `Se produjo un error inesperado al iniciar sesión`,
      buttons: ['OK']
    });
    alert.present();
  }
}
