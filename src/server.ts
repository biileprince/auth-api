import 'dotenv/config';
import app from './app.js';
import { initDb } from './config/db.js';

const PORT = process.env.PORT || 3000;

async function start() {
  await initDb();
  console.log('Database initialised.');

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
