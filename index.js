import fp from 'fastify-plugin';
import fb from 'firebase-admin';

const fastifyFirebase = async (fastify, opts) => {
  const cert = opts || {};
  // Normalize keys to camelCase
  const projectId = cert.projectId || cert.project_id;
  const privateKey = cert.privateKey || cert.private_key;
  const clientEmail = cert.clientEmail || cert.client_email;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error('fastify-firebase(plugin): cert must include projectId/project_id, privateKey/private_key, and clientEmail/client_email');
  }

  // Prevent multiple initializations
  let firebaseInstance;
  try {
    if (fb.apps && fb.apps.length > 0) {
      firebaseInstance = fb.app('default');
    } else {
      firebaseInstance = fb.initializeApp({
        projectId,
        credential: fb.credential.cert({ projectId, privateKey, clientEmail }),
      }, 'default');
    }

    fastify.decorate('firebase', firebaseInstance);
  } catch (error) {
    throw new Error(`fastify-firebase(plugin): ${error.message || error}`);
  }
};

export default fp(fastifyFirebase, {
  fastify: '>=5.0.0',
  name: 'fastify-firebase',
});
