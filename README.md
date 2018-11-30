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

### Configuring App

In order to configure your environment, please change the firebase credentials into `src/app/app.module.ts`

Also, if you´re running your app inside the browser, please add the `GOOGLE_MAPS_KEY` inside the `src/page/current-map/current-map.ts`


Also please configure your firebase aplication with a facebook application, in order to enable the SSO of the project.

https://firebase.google.com/docs/auth/web/facebook-login?hl=es-419


### Running locally

#### Web

If you dont need anything from ionic-native

```
ionic serve
```

or

```
ionic cordova run browser --lc
```

for a better experience


#### Android

```
ionic cordova run android --device
```
