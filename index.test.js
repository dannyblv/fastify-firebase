import tap from 'tap';
import fastify from 'fastify';
import fastifyFirebase from './index.js';

const cert = JSON.parse(process.env.FIREBASE_CONFIG);

const register = (t, options, cb) => {
  const instance = fastify();
  t.teardown(() => instance.close());
  instance.register(fastifyFirebase, options);
  instance.ready(error => cb(error, instance));
};

tap.test('{ }', (t) => {
  register(t, undefined, (error) => {
    t.ok(error);
    t.match(error.message, /no cert provided|cert must include/);
    t.end();
  });
});

tap.test('cert supports camelCase and snake-case + firebase throws error', (t) => {
  register(
    t,
    {project_id: '1', privateKey: '1', client_email: '1'},
    (error) => {
      t.ok(error);
      t.match(error.message, /Failed to parse private key|Invalid PEM formatted message/);
      t.end();
    }
  );
});

tap.test('happy path', (t) => {
  if (!cert) {
    t.skip('cert not set');
    t.end();
    return;
  }
  register(t, cert, (_error, fastifyInstance) => {
    t.ok(fastifyInstance.firebase);
    t.ok(fastifyInstance.firebase.auth);
    t.ok(fastifyInstance.firebase.storage);
    t.ok(fastifyInstance.firebase.firestore);
    t.end();
  });
});