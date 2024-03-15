import express from 'express';
import gameRoutes from './routes/gameRoutes';
import path from 'path';
import session from 'express-session';
import cors from 'cors';

export default class App {
  private app: express.Application;
  public port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.app.use(cors());
    this.app.use(
      session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true },
      })
    );

    this.app.use(express.json());
    this.app.use(express.static('../public'));
    this.app.use('/game', gameRoutes);

    this.app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

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
