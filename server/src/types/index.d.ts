import { SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    word: string;
  }
}