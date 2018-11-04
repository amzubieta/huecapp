import { Injectable } from '@angular/core'

import { AngularFirestore } from '@angular/fire/firestore'
// import gfs from 'geofirestore'
import { GeoFirestore } from 'geofirestore'
import * as firebase from 'firebase/app'

@Injectable()
export class HoleProvider {

  collectionRef: any;
  geoFirestore: any;

  constructor(private firestore: AngularFirestore) {
    this.collectionRef = this.firestore.collection('hole')
    this.geoFirestore = new GeoFirestore(this.collectionRef.ref)
  }

  registerNewHole(user: any, location: any, image: any) {
    return new Promise((resolve, reject) => {
      this.geoFirestore.add({
        coordinates: new firebase.firestore.GeoPoint(location.lat, location.lng),
        image: image,
        user: user
      }).then((docRef) => {
        resolve(docRef);
      }, (e) => {
        reject(e)
      });
    })
  }

  queryHoles(location, radius) {
    const geoQuery = this.geoFirestore.query({
      center: new firebase.firestore.GeoPoint(location.lat, location.lng),
      radius: radius
    })

    geoQuery.on('ready', () => {
      console.log('GeoFirestoreQuery has loaded and fired all other events for initial data');
    });

    return geoQuery
  }
}
