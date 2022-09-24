const {test} = require('tap');
const fastify = require('fastify');
const fastifyFirebase = require('.');

const register = (t, options, cb) => {
  const instance = fastify();
  t.teardown(() => instance.close());
  instance.register(fastifyFirebase, options);
  instance.ready(error => cb(error, instance));
};

test('{ }', (t) => {
  register(t, undefined, (error) => {
    t.ok(error);
    t.equal(error.message, 'fastify-firebase(plugin): no cert provided');
    t.end();
  });
});

test('cert supports camelCase and snake-case + firebase throws error', (t) => {
  register(
    t,
    {project_id: '1', privateKey: '1', client_email: '1'},
    (error) => {
      t.ok(error);
      t.equal(error.message, 'fastify-firebase(plugin): Error: Failed to parse private key: Error: Invalid PEM formatted message.');
      t.end();
    }
  );
});

test('happy path', (t) => {
  console.log('process.argv', process.argv);
  register(t, JSON.parse(process.env.FIREBASE_CONFIG), (_error, fastifyInstance) => {
    t.ok(fastifyInstance.firebase);
    t.ok(fastifyInstance.firebase.auth);
    t.ok(fastifyInstance.firebase.storage);
    t.ok(fastifyInstance.firebase.firestore);
    t.end();
  });
});