import { Database } from 'firebase-admin/lib/database/database';
import { FirebaseConnectionError } from '../errors';
import { Logger } from '@promisepending/logger.js';
import { ConfigurationLoader } from '../utils';
import * as firebase from 'firebase-admin';

export class Firebase {
  // eslint-disable-next-line no-use-before-define
  public static instance: Firebase = new Firebase();

  private firebaseApp!: firebase.app.App;
  private logger!: Logger;

  constructor(debug = false) {
    if (Firebase.instance) {
      return Firebase.instance;
    }

    this.logger = new Logger({ prefix: 'FIREBASE', debug, allLineColored: true });
    const firebaseCredentials = ConfigurationLoader.loadFirebaseCredentials(this.logger);

    if (!firebaseCredentials) {
      this.logger.error('No Firebase credentials found!');
      throw new FirebaseConnectionError('No Firebase credentials found!');
    }

    this.firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebaseCredentials),
      databaseURL: 'https://aps-5-semestre-default-rtdb.firebaseio.com',
    });

    Firebase.instance = this;
  }

  public getDatabase(): Database {
    return firebase.database(this.firebaseApp);
  }

  public getApp(): firebase.app.App {
    return this.firebaseApp;
  }
}
