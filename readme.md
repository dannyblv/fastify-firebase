# @fastify-firebase-ts

Adding firebase's service such as Auth, Firestore, Cloud Storage, Cloud Messaging, and more.
## Install
```
npm i @Danny-weebo/fastify-firebase-ts
yarn add @Danny-weebo/fastify-firebase-ts
pnpm add @Danny-weebo/fastify-firebase-ts
```

## Usage
Add it to you project with `register` link the cert file from firebase console and you are done!
This plugin will add the firebase namespace in your Fastify instance.

Example:
```ts
import Fastify from 'fastify';
import fastifyFirebase from 'fastify-firbase-ts';
import firebaseConfig from '../firebase.json'; // <-- this json can be downloaded from firebase console (aka cert file).

const server = Fastify({logger: true});

server.register(fastifyFirebase, firebaseConfig); // simply hook the plugin with the cert file.

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
- [Fastify](https://www.fastify.io/)
- [fastify-plugin NPM](https://www.npmjs.com/package/fastify-plugin)
- [firebase-admin NPM](https://www.npmjs.com/package/firebase-admin)

## License
Licensed under [MIT](./LICENSE).
