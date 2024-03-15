import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import App from './app';
const PORT = Number(process.env.PORT) || 8080;

const server = new App(PORT);
server.startServer();
