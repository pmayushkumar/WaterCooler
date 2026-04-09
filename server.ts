import { createServer } from 'http';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || '3000', 10);

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Water Cooler running on http://localhost:${port}`);
  });
});
