// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: '<YOUR_API_KEY>',
    authDomain: '<PROJECT_NAME>.firebaseapp.com',
    projectId: '<PROJECT_NAME>',
    storageBucket: '<PROJECT_NAME>.appspot.com',
    messagingSenderId: '<MESSAGING_SENDER_ID>',
    appId: '<APP_ID>',
    measurementId: '<MEASUREMENT_ID>',
    databaseURL: '<FIREBASE_LIVE_DATABASE_URL>',
  },
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
