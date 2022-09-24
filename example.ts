import fastify from 'fastify';
import fastifyFirebase  from '.';
import firebaseCertJson from './firebase.json'; // this file can be downloaded from firebase console.

const fastifyInstance = fastify();

// registering fastifyFirebase plugin with firebase's cert json file.
fastifyInstance.register(fastifyFirebase, firebaseCertJson);

fastifyInstance.get('/getAllUsers', async (request, reply) => {
  const firebase = request.server.firebase;

  try {
    const snapshot = await firebase.firestore().collection('Users').get();
    const arrayOfUsers = snapshot.docs.map((doc) => doc.data());
    reply.send(arrayOfUsers);
  } catch (error) {
    throw new Error(error);
  }
});

(async () => {
  try {
    const address = await fastifyInstance.listen({port: 3000});
    console.log(`Server listening at ${address}`);
  } catch (error) {
    fastifyInstance.log.error(error);
    process.exit(1);
  }
})();