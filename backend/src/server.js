import app from './app.js';
import env, { assertValidEnv } from './config/env.js';
import { processDueSubscriptions } from './modules/subscriptions/subscriptions.service.js';

assertValidEnv();

app.listen(env.port, () => {
  console.log(`[server] API corriendo en http://localhost:${env.port} (${env.nodeEnv})`);
});

async function runSubscriptionJob() {
  try {
    const result = await processDueSubscriptions();
    console.log(`[subscriptions] ${result.created} pedidos generados, ${result.errors} con errores`);
  } catch (err) {
    console.error('[subscriptions] error en el proceso:', err.message);
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;
runSubscriptionJob();
setInterval(runSubscriptionJob, DAY_MS);
