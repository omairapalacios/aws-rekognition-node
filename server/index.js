require('dotenv').config();
import express from 'express';
import next from 'next';
import { connectToDatabase } from './database';
import router from './router'

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const port = 3000;

nextApp.prepare().then(async () => {
  const app = express();
  router(app);
  app.get('*', (req, res) => {
    return handle(req, res);
  });
/* 
  await connectToDatabase(); */

  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port}`);
  });
});
