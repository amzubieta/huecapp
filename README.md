# Huecapp

App to register street holes in a collaborative way


## Setup environment

```sh
ionic cordova platform remove android
ionic cordova platform add android
ionic cordova platform update android

ionic cordova platform remove browser
ionic cordova platform add browser
ionic cordova platform update browser

ionic cordova plugin remove cordova-plugin-camera
ionic cordova plugin add cordova-plugin-camera
ionic cordova plugin remove cordova-plugin-file-transfer
ionic cordova plugin add cordova-plugin-file-transfer


ionic cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="{GOOGLE_MAPS_KEY}" --variable API_KEY_FOR_IOS="{GOOGLE_MAPS_KEY}"
```

## Run environment

### Web

If you dont need anything from ionic-native

```
ionic serve
```

or

```
ionic cordova run browser --lc
```

for a better experience


### Android

```
ionic cordova run android --device
```
