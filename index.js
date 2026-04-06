import fp from 'fastify-plugin';
import fb from 'firebase-admin';

const customError = (msg) => new Error(`fastify-firebase: ${msg}`);

const getMissing = (fields) =>
  Object.entries(fields)
    .filter(([, v]) => !v)
    .map(([k]) => k);

const fastifyFirebase = async (fastify, opts) => {
  if (opts !== undefined && (typeof opts !== 'object' || opts === null)) {
    throw customError('options must be an object');
  }

  const {
    name: appName = 'default',
    databaseURL,
    storageBucket,
    ...cert
  } = opts || {};

  // Normalize keys to camelCase
  const projectId = cert.projectId || cert.project_id;
  const privateKey = cert.privateKey || cert.private_key;
  const clientEmail = cert.clientEmail || cert.client_email;

  const hasAnyCertField = projectId || privateKey || clientEmail;
  const hasAllCertFields = projectId && privateKey && clientEmail;

  // If user provides partial cert fields, tell them what's missing
  if (hasAnyCertField && !hasAllCertFields) {
    const missing = getMissing({ projectId, privateKey, clientEmail });
    throw customError(`cert is missing: ${missing.join(', ')}`);
  }

  if (hasAllCertFields) {
    if (typeof projectId !== 'string' || typeof privateKey !== 'string' || typeof clientEmail !== 'string') {
      throw customError('projectId, privateKey, and clientEmail must be strings');
    }
  }

  if (fastify.hasDecorator('firebase')) {
    throw customError('firebase has already been registered');
  }

  // Build config
  const config = {
    ...(projectId && { projectId }),
    ...(databaseURL && { databaseURL }),
    ...(storageBucket && { storageBucket }),
    ...(hasAllCertFields && {
      credential: fb.credential.cert({ projectId, privateKey, clientEmail }),
    }),
  };

  // Reuse existing app or initialize a new one
  let firebaseInstance;
  try {
    firebaseInstance = fb.app(appName);
  } catch {
    firebaseInstance = fb.initializeApp(
      Object.keys(config).length > 0 ? config : undefined,
      appName,
    );
  }

  fastify.decorate('firebase', firebaseInstance);

  fastify.addHook('onClose', async () => {
    try { await firebaseInstance.delete(); } catch { /* already deleted */ }
  });
};

export default fp(fastifyFirebase, {
  fastify: '>=5.0.0',
  name: 'fastify-firebase',
});
