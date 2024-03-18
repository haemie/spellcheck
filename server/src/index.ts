import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import App from './app';
import { initializeGamesDB, initializeSessionsDB } from './models/sqlSetup';
const PORT = Number(process.env.PORT) || 8080;

(async () => {
  await initializeGamesDB();
  // await initializeSessionsDB();
  const server = new App(PORT);
  server.startServer();
})();
