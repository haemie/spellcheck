import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import App from './app';
import { initializeDB } from './models/sqlSetup';
const PORT = Number(process.env.PORT) || 8080;

const server = new App(PORT);
(async () => {
  await initializeDB();
  server.startServer();
})();
