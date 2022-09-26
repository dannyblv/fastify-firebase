# fastify-firebase
<img src="https://github.com/dannyblv/fastify-firebase/actions/workflows/node.js.yml/badge.svg" alt="CI status" /> <a href="https://www.npmjs.com/package/fastify-firebase" title="View this project on NPM"><img src="https://img.shields.io/npm/v/fastify-firebase" alt="NPM version" /></a>

Adding firebase-admin service into fastify with typescript support.
<img width="1144" alt="Firebase modules are presented in suggestions window" src="https://user-images.githubusercontent.com/6795014/192258871-36a637dc-5f82-431d-9c75-bc5a5fe57950.png">

## Install
```
npm i fastify-firebase
yarn add fastify-firebase
pnpm add fastify-firebase
```

## Usage
Add it to you project with `register` link the cert file from firebase console and you are done!
This plugin will add the firebase namespace in your Fastify instance.

Example:
```ts
import Fastify from 'fastify';
import fastifyFirebase from 'fastify-firebase';
import firebasePrivateKeyJson from '../firebase.json'; // <-- private key file can be downloaded from firebase console (aka cert file).

const server = Fastify({logger: true});

server.register(fastifyFirebase, firebasePrivateKeyJson); // simply hook the plugin with the cert file.

server.get('/getAllUsers', async (request, reply) => {
  // both request and reply contains server object
  // means we can find firebase object on both
  // request.server.firebase | reply.server.firebase
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
    const address = await server.listen({port: 3000});
    console.log(`Server listening at ${address}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();

```

## Useful links
- [How to generate a private key file for your service account](https://firebase.google.com/docs/admin/setup#node.js)
- [Firebase's Settings > Service Accounts.](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
- [Fastify](https://www.fastify.io/)
- [fastify-plugin NPM](https://www.npmjs.com/package/fastify-plugin)
- [firebase-admin NPM](https://www.npmjs.com/package/firebase-admin)
- [fastify-firebase NPM](https://www.npmjs.com/package/fastify-firebase)

## License
Licensed under [MIT](./LICENSE).
