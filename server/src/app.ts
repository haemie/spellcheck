import express from 'express';
import gameRoutes from './routes/gameRoutes';

export default class App {
  private app: express.Application;
  public port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.app.use(express.json());
    this.app.use('/game', gameRoutes);
    this.app.get('/', () => console.log('pong'));
    this.app.use((req, res) => {
      res.status(404).send('invalid endpoint');
    });
  }

  public startServer() {
    this.app.listen(this.port, () =>
      console.log(`server listening at port ${this.port}`)
    );
  }
}
