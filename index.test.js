import tap from 'tap';
import Fastify from 'fastify';
import fb from 'firebase-admin';
import fastifyFirebase from './index.js';

const certRaw = process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG) : null;
const cert = certRaw && (certRaw.projectId || certRaw.project_id) ? certRaw : null;

if (!cert || !cert.project_id) {
  throw new Error('Test cert file is missing or invalid — cannot run tests');
}

const register = (t, options) => {
  const instance = Fastify();
  t.teardown(() => instance.close());
  instance.register(fastifyFirebase, options);
  return new Promise((resolve, reject) => {
    instance.ready((err) => (err ? reject(err) : resolve(instance)));
  });
};

// --- Validation ---

tap.test('throws for non-object options (string)', async (t) => {
  await t.rejects(register(t, 'bad'), { message: /options must be an object/ });
});

tap.test('throws for non-object options (number)', async (t) => {
  await t.rejects(register(t, 42), { message: /options must be an object/ });
});

tap.test('throws when partial cert: only projectId', async (t) => {
  await t.rejects(register(t, {projectId: 'x'}), {
    message: /cert is missing:.*privateKey.*clientEmail/,
  });
});

tap.test('throws when partial cert: only privateKey', async (t) => {
  await t.rejects(register(t, {privateKey: 'x'}), {
    message: /cert is missing:.*projectId.*clientEmail/,
  });
});

tap.test('throws when partial cert: only clientEmail', async (t) => {
  await t.rejects(register(t, {clientEmail: 'x'}), {
    message: /cert is missing:.*projectId.*privateKey/,
  });
});

tap.test('throws when cert values are non-string', async (t) => {
  await t.rejects(register(t, {projectId: 1, privateKey: true, clientEmail: {}}), {
    message: /must be strings/,
  });
});

// --- Key format: snake_case, camelCase, mixed ---

tap.test('snake_case keys pass validation (firebase rejects invalid PEM)', async (t) => {
  await t.rejects(
    register(t, {project_id: 'p', private_key: 'k', client_email: 'e@e.iam.gserviceaccount.com'}),
    { message: /Failed to parse private key|Invalid PEM/ },
  );
});

tap.test('camelCase keys pass validation (firebase rejects invalid PEM)', async (t) => {
  await t.rejects(
    register(t, {projectId: 'p', privateKey: 'k', clientEmail: 'e@e.iam.gserviceaccount.com'}),
    { message: /Failed to parse private key|Invalid PEM/ },
  );
});

tap.test('mixed keys pass validation (firebase rejects invalid PEM)', async (t) => {
  await t.rejects(
    register(t, {project_id: 'p', privateKey: 'k', client_email: 'e@e.iam.gserviceaccount.com'}),
    { message: /Failed to parse private key|Invalid PEM/ },
  );
});


tap.test('allows registration with no options (ADC mode)', async (t) => {
  // On non-GCP, this initializes with applicationDefault which will throw
  // if GOOGLE_APPLICATION_CREDENTIALS is not set.
  // We just verify the plugin does NOT throw a validation error.
  try {
    const instance = await register(t, undefined);
    t.ok(instance.firebase, 'registered in ADC mode');
  } catch (err) {
    // Expected on non-GCP: firebase throws credential error, not our validation
    t.notMatch(err.message, /options must be|cert is missing|must be strings/,
      'plugin validation passed, firebase credential error is expected');
  }
});

tap.test('allows registration with empty object (ADC mode)', async (t) => {
  try {
    const instance = await register(t, {});
    t.ok(instance.firebase, 'registered in ADC mode');
  } catch (err) {
    t.notMatch(err.message, /options must be|cert is missing|must be strings/,
      'plugin validation passed, firebase credential error is expected');
  }
});

tap.test('throws if registered twice', async (t) => {
  const instance = Fastify();
  t.teardown(() => instance.close());
  instance.register(fastifyFirebase, {...cert, name: 'dbl-' + Date.now()});
  instance.register(fastifyFirebase, {...cert, name: 'dbl2-' + Date.now()});
  await t.rejects(
    new Promise((resolve, reject) => instance.ready((err) => (err ? reject(err) : resolve(instance)))),
    { message: /already been registered|already decorated/ },
  );
});

tap.test('decorates instance with firebase app', async (t) => {
  for (const app of fb.apps) {
    try { await app.delete(); } catch { /* ignore */ }
  }

  const instance = await register(t, cert);

  t.ok(instance.firebase, 'decorator exists');
  t.equal(typeof instance.firebase.auth, 'function', 'auth()');
  t.equal(typeof instance.firebase.firestore, 'function', 'firestore()');
  t.equal(typeof instance.firebase.storage, 'function', 'storage()');
  t.equal(typeof instance.firebase.messaging, 'function', 'messaging()');
  t.equal(instance.firebase.name, 'default', 'default app name');
});

tap.test('custom app name', async (t) => {
  const instance = await register(t, {...cert, name: 'custom-app'});
  t.equal(instance.firebase.name, 'custom-app');
});

tap.test('cleanup on close', async (t) => {
  const appName = 'cleanup-' + Date.now();
  const instance = await register(t, {...cert, name: appName});
  t.ok(instance.firebase);
  await instance.close();
  t.throws(() => fb.app(appName), 'app deleted after close');
});