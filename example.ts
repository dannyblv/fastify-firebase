import fastify from 'fastify';
import fastifyFirebase from './index.js';
import firebaseCertJson from './firebase.json'; // download from Firebase console

const app = fastify();

// Option 1: Register with cert JSON file
app.register(fastifyFirebase, firebaseCertJson);

// Option 2: On GCP (Cloud Run, Cloud Functions)  no cert needed
// app.register(fastifyFirebase);

// Option 3: With extra options
// app.register(fastifyFirebase, {
//   ...firebaseCertJson,
//   name: 'my-app',
//   databaseURL: 'https://my-app.firebaseio.com',
//   storageBucket: 'my-app.appspot.com',
// });

app.get('/users', async (request, reply) => {
  const snapshot = await request.server.firebase.firestore().collection('Users').get();
  reply.send(snapshot.docs.map((doc) => doc.data()));
});

app.listen({ port: 3000 }).then((address) => {
  console.log(`Server listening at ${address}`);
});