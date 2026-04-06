import { createServer } from 'http';
import next from 'next';
import cron from 'node-cron';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || '3000', 10);

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Schedule digest cron
  const schedule = process.env.DIGEST_SCHEDULE || '0 20 * * 0,2,4';
  const timezone = process.env.DIGEST_TIMEZONE || 'America/New_York';

  cron.schedule(
    schedule,
    async () => {
      console.log(`[cron] Triggering weekly digest at ${new Date().toISOString()}`);
      try {
        const res = await fetch(`http://localhost:${port}/api/digest/cron`, {
          headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
        });
        const data = await res.json();
        console.log('[cron] Digest result:', data);
      } catch (err) {
        console.error('[cron] Failed to trigger digest:', err);
      }
    },
    { timezone }
  );

  server.listen(port, () => {
    console.log(`> Water Cooler running on http://localhost:${port}`);
    console.log(`> Digest scheduled: ${schedule} (${timezone})`);
  });
});
