import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  Environment,
  MyLocation
} from '@ionic-native/google-maps';

import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { GalleryModal } from 'ionic-gallery-modal';

import { HoleProvider } from './../../providers/hole/hole';

@IonicPage()
@Component({
  selector: 'page-current-map',
  templateUrl: 'current-map.html',
})
export class CurrentMapPage {

  map: GoogleMap;
  currentLocation: any;

  modalImages: any[] = [];
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private holeProvider: HoleProvider
  ) { }

  ionViewDidLoad() {
    this.initMap();

    let defaultLocation = {
      lat: 4.6369515,
      lng: -74.0559557
    };

    this.currentLocation = defaultLocation;
  }

  ionViewWillEnter() {
    this.loadPage()
  }

  loadPage(): any {
    this.map.clear()
    this.map.getMyLocation()
      .then((location: MyLocation) => {
        console.log(`Getting current location: ${JSON.stringify(location.latLng)}`)

        this.currentLocation = {
          lat: location.latLng.lat,
          lng: location.latLng.lng
        };
        this.map.animateCamera({ target: location.latLng })
          .then(() => {
            let marker: Marker = this.map.addMarkerSync({
              icon: 'blue',
              title: 'Usted esta aquí',
              position: location.latLng,
              animation: GoogleMapsAnimation.BOUNCE
            });
            marker.showInfoWindow();

            this.loadHolesNearBy()
          });
      });
  }

  initMap() {
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'YOUR_GOOGLE_MAP_KEY',
      'API_KEY_FOR_BROWSER_DEBUG': 'YOUR_GOOGLE_MAP_KEY'
    });

    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 4.6369515,
          lng: -74.0559557
        },
        zoom: 16
      }
    });
  }

  registerHole() {
    this.navCtrl.push('RegisterHolePage', {
      currentLocation: this.currentLocation,
      isMandatoryUniqueIdentificator: true
    });
  }

  loadHolesNearBy() {
    console.log(`query near ${JSON.stringify(this.currentLocation)}`)
    const geoQuery = this.holeProvider.queryHoles(this.currentLocation, 10.5)
    const self = this;
    geoQuery.on('key_entered', function(key, document, distance) {
      console.log(key + ' entered query at ' + document.coordinates.latitude + ',' + document.coordinates.longitude + ' (' + distance + ' km from center)');
      self.addMarker({
        lat: document.coordinates.latitude,
        lng: document.coordinates.longitude
      }, {
        image: document.image,
        user: document.user
      });
    });
  }

  addMarker(position, customData) {
    let self = this
    this.map.addMarker({
      icon: 'red',
      position: position,
      animation: 'DROP',
      ...customData
    }).then((marker: Marker) => {
      marker.showInfoWindow();
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(e => {
        // self.map.panTo(e[0])
        const marker = e[1]

        const user = marker.get('user')
        self.modalImages[0] = {
          url: marker.get('image'),
          title: `${user.name}, ${user.uniqueIdentificator}`
        }
        
        self.openGallery()
      });
    });
  }

  openGallery() {
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: this.modalImages,
      initialSlide: 0,
      closeIcon: 'back'
    });
    modal.present();
  }
}
