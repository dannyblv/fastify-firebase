const fp = require('fastify-plugin');
const fb = require('firebase-admin');

const fastifyFirebase = (server, cert, done) => {
  if (!Object.keys(cert).length) {
    done(new Error('fastify-firebase(plugin): no cert provided'));
    return;
  }

  try {
    const firebaseInstance = fb.initializeApp(
      {
        projectId: cert.projectId,
        credential: fb.credential.cert(cert),
      },
      'default'
    );

    server.decorate('firebase', firebaseInstance);
    done();
  } catch (error) {
    done(new Error(`fastify-firebase(plugin): ${error}`));
  }
};

module.exports = fp(fastifyFirebase, {
  fastify: '>=1.1.0',
  name: 'fastify-firebase',
});
