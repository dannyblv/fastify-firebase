# fastify-firebase
<img src="https://github.com/dannyblv/fastify-firebase/actions/workflows/node.js.yml/badge.svg" alt="CI status" /> <a href="https://www.npmjs.com/package/fastify-firebase" title="View this project on NPM"><img src="https://img.shields.io/npm/v/fastify-firebase" alt="NPM version" /></a> <img src="https://img.shields.io/npm/dw/fastify-firebase" alt="Weekly downloads" />

**Fastify v5+ firebase-admin plugin. Adds a singleton firebase object to your Fastify instance with full TypeScript support.**

---

- Supports both camelCase and snake_case Firebase cert keys  TypeScript types for both cert formats.
- Prevents multiple Firebase app initializations (singleton)
- Throws clear errors for missing/invalid certs
- Works with Fastify v5+ and fastify-plugin v5+
- Async/Promise plugin signature for modern Fastify
- Full TypeScript support

<img width="1144" alt="Firebase modules are presented in suggestions window" src="https://user-images.githubusercontent.com/6795014/192258871-36a637dc-5f82-431d-9c75-bc5a5fe57950.png">

## Install
```sh
npm i fastify-firebase
# or
yarn add fastify-firebase
# or
pnpm add fastify-firebase
```

## Usage
Add the plugin into your project using the `register` function, provide the cert file from Firebase console and you are done!
This plugin will add the `firebase` namespace to your Fastify instance.

```ts
import Fastify from 'fastify';
import fastifyFirebase from 'fastify-firebase';
import firebasePrivateKeyJson from '../firebase.json'; // <-- private key file from Firebase console

const server = Fastify({ logger: true });

server.register(fastifyFirebase, firebasePrivateKeyJson); // just hook the plugin with the cert file

server.get('/getAllUsers', async (request, reply) => {
  // firebase is available on request.server.firebase
  const firebase = request.server.firebase;
  const snapshot = await firebase.firestore().collection('Users').get();
  const arrayOfUsers = snapshot.docs.map((doc) => doc.data());
  reply.send(arrayOfUsers);
});

(async () => {
  try {
    const address = await server.listen({ port: 3000 });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
```

## Migration from v1.x
- Now requires Fastify v5+
- Cert keys can be camelCase or snake_case
- Only one Firebase app instance is created (singleton)
- Plugin is now async/Promise-based

## Useful links
- [How to generate a private key file for your service account](https://firebase.google.com/docs/admin/setup#node.js)
- [Firebase's Settings > Service Accounts.](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
- [Fastify](https://www.fastify.io/)
- [fastify-plugin NPM](https://www.npmjs.com/package/fastify-plugin)
- [firebase-admin NPM](https://www.npmjs.com/package/firebase-admin)
- [fastify-firebase NPM](https://www.npmjs.com/package/fastify-firebase)

## License
Licensed under [MIT](./LICENSE).
