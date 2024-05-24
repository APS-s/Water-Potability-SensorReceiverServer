import { Logger } from '@promisepending/logger.js';
import { ServiceAccount } from 'firebase-admin';
import { FileLoader } from './';
import path from 'path';

export class ConfigurationLoader {
  /**
   * Set the Firebase credentials in the environment variables
   * @returns {ServiceAccount | null} The Firebase credentials
   */
  public static loadFirebaseCredentials(logger: Logger): ServiceAccount | null {
    const json = FileLoader.jsonLoader(path.resolve(__dirname, '..', '..', 'config', 'firebase-access.json')) as ServiceAccount | null;

    if (!json) {
      logger.error('No Firebase credentials found!');
      return null;
    }

    return json;
  }
}
