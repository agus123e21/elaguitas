import app from './app.js';
import env, { assertValidEnv } from './config/env.js';

assertValidEnv();

app.listen(env.port, () => {
  console.log(`[server] API corriendo en http://localhost:${env.port} (${env.nodeEnv})`);
});
