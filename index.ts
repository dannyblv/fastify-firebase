import fp from 'fastify-plugin';
import camelCase from 'lodash.camelcase';
import fb, {ServiceAccount} from 'firebase-admin';
import {FastifyPluginCallback} from 'fastify';

// firebase provides cert file with snakeCase keys while 
// fb.credential.cert expects it to be camelCase of type ServiceAccount.
type ICertSnakeCase = {
	project_id: string;
	private_key: string;
	client_email: string;
};

const firebasePlugin: FastifyPluginCallback<ICertSnakeCase> = (server, _cert, done) => {
  if (!_cert) {
    throw new Error('fastify-firebase-ts (plugin): no cert provided');
  }

	const cert: ServiceAccount = camelCase(_cert);

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
		console.error('fastify-firebase-ts couldn\'t initialize firebase instance');
    throw new Error(`fastify-firebase-ts (plugin): ${error}`);
  }
};

export default fp(firebasePlugin, {
  fastify: '>=1.1.0',
  name: 'fastify-firebase-ts',
});
