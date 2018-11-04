import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import 'rxjs/add/operator/map'

export interface User {
  __key?: string;
  uid: string;
  name: string;
  email: string;
  uniqueIdentificator: string;
}

@Injectable()
export class UserProvider {

  private PATH = 'users/';

  private user: any;

  constructor(private db: AngularFireDatabase) { }

  get() {
    return this.user || {}
  }

  getByUid(uid: any) {
    return new Promise((resolve, reject) => {
      this.db.list(this.PATH, ref => ref.orderByChild('uid').equalTo(uid))
        .snapshotChanges()
        .subscribe(queriedItems => {
          if (typeof queriedItems !== 'undefined' && queriedItems.length > 0) {
            this.user = { __key: queriedItems[0].key, ...queriedItems[0].payload.val() }
            resolve(this.user);
          }

          console.debug(`User ${uid} non stored in 'users' db`);
          resolve()
        })
    });
  }

  save(user: any) {
    return new Promise((resolve, reject) => {
      let document = {
        uid: user.uid,
        name: user.displayName || user.name || null,
        email: user.email,
        uniqueIdentificator: user.uniqueIdentificator || null
      }

      if (user.__key) {
        this.db.list(this.PATH)
          .update(user.__key, document)
          .then(obj => {
            this.user = { __key: user.__key, ...document }
            resolve()
          })
          .catch(e => reject(e))
      } else {
        this.db.list(this.PATH)
          .push(document)
          .then(obj => {
            this.user = { __key: obj.key, ...document }
            resolve(this.user)
          })
      }
    })
  }
}
