import { Logger } from '@promisepending/logger.js';
import { ExpressServer } from './server';
import { Firebase } from './database';

async function main(): Promise<void> {
  const isDev = process.env.NODE_ENV !== 'production';

  const logger = new Logger({ prefix: 'MAIN', debug: isDev, allLineColored: true });
  logger.info('Initializing application...');

  logger.info('Starting Firebase connection...');
  const firebase = new Firebase(isDev);
  await firebase.getDatabase().ref('processed_data').once('value').then((snapshot) => {
    logger.info('Firebase connection established');
    logger.debug(snapshot.val());
  });

  logger.info('Starting Express server...');
  const expressPort = process.env.APS_REST_PORT ? parseInt(process.env.APS_REST_PORT, 10) : 3000;
  const expressServer = new ExpressServer(expressPort, isDev);
  expressServer.start();
  logger.info('Express server started');
}

main();
