import fb from 'firebase-admin';
import { FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    firebase: fb.app.App;
  }
}

type FastifyFirebaseOptions = {
  project_id?: string;
  private_key?: string;
  client_email?: string;
  projectId?: string;
  privateKey?: string;
  clientEmail?: string;
  /** Custom Firebase app name (default: 'default') */
  name?: string;
  /** Realtime Database URL */
  databaseURL?: string;
  /** Cloud Storage bucket name (e.g. 'my-app.appspot.com') */
  storageBucket?: string;
};

declare const fastifyFirebase: FastifyPluginAsync<FastifyFirebaseOptions>;

export default fastifyFirebase;
export type {FastifyFirebaseOptions};