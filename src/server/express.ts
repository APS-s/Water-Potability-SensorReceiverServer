import { Logger } from '@promisepending/logger.js';
import { Firebase } from '../database';
import express from 'express';

export class ExpressServer {
  private app: express.Express;
  private logger: Logger;
  private port: number;

  constructor(port: number, debug = false) {
    this.logger = new Logger({ prefix: 'EXPRESS', debug, allLineColored: true });
    this.app = express();
    this.app.use(express.json());
    this.port = port;
    this.registerRoutes();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      this.logger.info(`Server listening on port ${this.port}`);
    });
  }

  private registerRoutes(): void {
    this.app.get('/', (req, res) => {
      return res.status(403).json({ message: 'Forbidden' });
    });

    this.app.get('/health', (req, res) => {
      return res.status(200).json({ message: 'OK' });
    });

    this.app.post('/sensorData', async (req, res) => {
      this.logger.info('Received sensor data');

      // FIXME: This is a dummy bearer token, it should be replaced by a real one
      const token = req.headers.authorization;
      if (!token || token !== 'Bearer 123456') {
        this.logger.warn('Unauthorized request from ip:', req.ip);
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const body = req.body;

      this.logger.debug('Request body:', body);

      // Check if the request body matches the expected format
      if (!body || !body.sensorId || !body.info) {
        this.logger.warn('Invalid request body');
        return res.status(400).json({ message: 'Bad request' });
      }

      // Check if info is formatted correctly
      if (!body.info.ph || !body.info.solids || !body.info.turbidity || !body.info.conductivity) {
        this.logger.warn('Invalid info object from sensor id:', body.sensorId);
        return res.status(400).json({ message: 'Bad request' });
      }

      const info = body.info;

      const toDatabase = {
        Circuito: body.sensorId,
        Conductivity: info.conductivity,
        Solids: info.solids,
        Turbidity: info.turbidity,
        pH: info.ph,
      };

      // Save data to database
      await Firebase.instance.getDatabase().ref('data_to_process').push(toDatabase);

      return res.status(200).json({ message: 'OK' });
    });
  }
}
