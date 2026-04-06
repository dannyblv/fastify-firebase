# fastify-firebase
<img src="https://github.com/dannyblv/fastify-firebase/actions/workflows/node.js.yml/badge.svg" alt="CI status" /> <a href="https://www.npmjs.com/package/fastify-firebase" title="View this project on NPM"><img src="https://img.shields.io/npm/v/fastify-firebase" alt="NPM version" /></a> <img src="https://img.shields.io/npm/dw/fastify-firebase" alt="Weekly downloads" /> <img src="https://img.shields.io/bundlephobia/min/fastify-firebase" alt="Bundle size" />

**Fastify v5+ plugin for firebase-admin. Full TypeScript support.**

---

- Works with service account JSON **or** Application Default Credentials (GCP)
- Supports `databaseURL`, `storageBucket`, and custom app `name`
- Accepts both camelCase and snake_case cert keys
- Singleton Firebase app with auto-cleanup on close
- Zero config on Cloud Run / Cloud Functions

## Install
```sh
npm i fastify-firebase
```

## Usage

### With service account cert
```ts
import Fastify from 'fastify';
import fastifyFirebase from 'fastify-firebase';
import cert from './firebase.json';

const app = Fastify();
app.register(fastifyFirebase, cert);

app.get('/users', async (req, reply) => {
  const snapshot = await req.server.firebase.firestore().collection('Users').get();
  reply.send(snapshot.docs.map((doc) => doc.data()));
});

app.listen({port: 3000});
```

### On GCP (Cloud Run, Cloud Functions)  no cert needed
```ts
app.register(fastifyFirebase); // uses Application Default Credentials
```

### With extra options
```ts
app.register(fastifyFirebase, {
  ...cert,
  name: 'my-app',                              // custom app name (default: 'default')
  databaseURL: 'https://my-app.firebaseio.com', // for Realtime Database
  storageBucket: 'my-app.appspot.com',           // for Cloud Storage
});
```

## Options

| Option | Type | Description |
|---|---|---|
| `projectId` / `project_id` | `string` | Firebase project ID |
| `privateKey` / `private_key` | `string` | Service account private key |
| `clientEmail` / `client_email` | `string` | Service account email |
| `name` | `string` | Firebase app name (default: `'default'`) |
| `databaseURL` | `string` | Realtime Database URL |
| `storageBucket` | `string` | Cloud Storage bucket |

All options are optional when using Application Default Credentials on GCP. When providing a cert, all three cert fields are required.

## Migration from v2.x
- **BREAKING**: Registering without options **no longer throws**  uses Application Default Credentials instead
- New options: `databaseURL`, `storageBucket`
- Firebase app is now deleted on Fastify close (auto-cleanup)
- Error messages are more specific

## Migration from v1.x
- Requires Fastify v5+
- ESM-only (`import`/`export`)
- Plugin is async/Promise-based

## Links
- [Generate a private key](https://firebase.google.com/docs/admin/setup#node.js)
- [Firebase Console - Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
- [Fastify](https://www.fastify.io/) · [fastify-plugin](https://www.npmjs.com/package/fastify-plugin) · [firebase-admin](https://www.npmjs.com/package/firebase-admin)

## License
[MIT](./LICENSE)
