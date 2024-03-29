import express from 'express';
import gameRoutes from './routes/gameRoutes';
import path from 'path';
import session from 'express-session';
import cors from 'cors';
import { pool } from './models/sqlConnection';
import pgSessionStore from 'connect-pg-simple';
import dotenv from 'dotenv';
dotenv.config();
const pgSession = pgSessionStore(session);

export default class App {
  private app: express.Application;
  public port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.app.use(
      cors({
        origin: [
          'http://localhost:5173',
          'http://localhost:4173',
          'https://haemie.github.io',
        ],
        credentials: true,
      })
    );
    // looks at cookie from client and matches with sessionid, accessable at req.sessionID
    this.app.use(
      session({
        store: new pgSession({
          pool: pool,
          tableName: 'session',
        }),
        secret: (process.env.SECRET as string).split(','),
        resave: false,
        saveUninitialized: false,
        cookie:
          process.env.NODE_ENV === 'production'
            ? {
                secure: true,
                httpOnly: false,
                sameSite: 'none',
                maxAge: 1000 * 60 * 60,
              }
            : {
                // secure: true,
                httpOnly: false,
                // sameSite: 'none',
                maxAge: 1000 * 60 * 60,
              },
      })
    );

    this.app.set('trust proxy', 1);

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
      console.log(
        `server in ${process.env.NODE_ENV} mode listening at port ${this.port}`
      )
    );
  }
}
