import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserProvider } from './../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage {

  form: FormGroup;
  user: any;
  onSucessGo2RegisterHole: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private formBuilder: FormBuilder,
    private toast: ToastController) {

    this.user = this.userProvider.get() || {};
    this.onSucessGo2RegisterHole = this.navParams.data.isMandatoryUniqueIdentificator || false
    this.createForm();
  }

  ionViewDidLoad() {
    this.user = this.userProvider.get()
    console.log(`User on userInfoPage, ${JSON.stringify(this.user)}`)
    if (this.user && !this.user.uniqueIdentificator && this.navParams.data.isMandatoryUniqueIdentificator) {
      this.createForm()
      this.toast.create({
        message: `Antes de registrar un hueco, debe registrar su cédula`,
        duration: 3000
      }).present()
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      uniqueIdentificator: [this.user.uniqueIdentificator, Validators.required]
    });
  }

  onSubmit() {
    console.log('Submit')
    if (this.form.valid) {
      const formValue = Object.assign({}, this.userProvider.get(), this.form.value)
      console.log(`Persisting User: ${JSON.stringify(formValue)}`)
      this.userProvider.save(formValue)
        .then(() => {
          this.toast.create({ message: 'Usuario actualizado exitosamente', duration: 3000 }).present();
          this.navCtrl.pop();
          if (this.onSucessGo2RegisterHole) {
            this.navCtrl.push('RegisterHolePage', {
              currentLocation: this.navParams.data.currentLocation || {}
            })
          }
        })
        .catch((e) => {
          this.toast.create({ message: 'Se produjo un error inesperado al actualizar los datos', duration: 3000 }).present();
          console.error(e);
        })
    }
  }

}
