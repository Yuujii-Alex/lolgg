import express from 'express';
import next from 'next';

const port = process.env.PORT || 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Example of a custom route
  server.get('/custom', (req, res) => {
    res.json({ message: 'Hello from custom server with TypeScript!' });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
  
  
});
