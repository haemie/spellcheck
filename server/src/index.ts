import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
